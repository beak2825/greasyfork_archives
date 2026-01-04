// ==UserScript==
// @name         YouTube Screenshot
// @namespace    https://loongphy.com
// @version      0.1.1
// @description  为 YouTube 播放器注入截图按钮，支持截图并显示在浮动面板中。
// @author       Loongphy
// @license      PolyForm-Noncommercial-1.0.0; https://polyformproject.org/licenses/noncommercial/1.0.0/
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/552659/YouTube%20Screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/552659/YouTube%20Screenshot.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_ID = 'tm-ytp-screenshot-button';
    const GALLERY_ID = 'tm-ytp-screenshot-gallery';
    const RETRY_LIMIT = 10;
    const RETRY_DELAY = 500;

    GM_addStyle(`
      #${GALLERY_ID} {
        position: fixed;
        top: 16px;
        right: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: calc(100vh - 32px);
        overflow-y: auto;
        z-index: 2147483647;
        pointer-events: none;
      }
  
      #${GALLERY_ID}::-webkit-scrollbar {
        width: 8px;
      }
  
      #${GALLERY_ID}::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.25);
        border-radius: 4px;
      }
  
      #${GALLERY_ID} .tm-ytp-screenshot-item {
        pointer-events: auto;
        background: rgba(15, 15, 15, 0.85);
        border-radius: 10px;
        padding: 8px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
        display: flex;
        flex-direction: column;
        gap: 6px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
      }
  
      #${GALLERY_ID} .tm-ytp-screenshot-item a {
        display: block;
        text-decoration: none;
        color: inherit;
      }
  
      #${GALLERY_ID} .tm-ytp-screenshot-item img {
        display: block;
        width: 220px;
        max-width: 220px;
        height: auto;
        border-radius: 6px;
      }
  
      #${GALLERY_ID} .tm-ytp-screenshot-toolbar {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        word-break: break-all;
      }
  
      #${GALLERY_ID} .tm-ytp-screenshot-actions {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        gap: 18px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        z-index: 2;
      }
  
      #${GALLERY_ID} .tm-ytp-screenshot-item:hover .tm-ytp-screenshot-actions {
        opacity: 1;
        pointer-events: auto;
      }
  
      #${GALLERY_ID} .tm-ytp-screenshot-action {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.65);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.25);
        cursor: pointer;
        backdrop-filter: blur(2px);
        transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        color: #fff;
      }
  
      #${GALLERY_ID} .tm-ytp-screenshot-action:hover {
        transform: scale(1.05);
        background: rgba(0, 0, 0, 0.82);
      }
  
      #${GALLERY_ID} .tm-ytp-screenshot-action svg {
        width: 28px;
        height: 28px;
        stroke: currentColor;
        stroke-width: 2;
      }
  
      #${GALLERY_ID} .tm-ytp-screenshot-item.tm-ytp-screenshot-copied .tm-ytp-screenshot-action--copy {
        background: rgba(24, 144, 255, 0.85);
        border-color: rgba(64, 169, 255, 0.9);
        color: #0a1a2c;
      }
  
      #${GALLERY_ID} .tm-ytp-screenshot-item.tm-ytp-screenshot-saved .tm-ytp-screenshot-action--save {
        background: rgba(24, 201, 100, 0.85);
        border-color: rgba(76, 238, 164, 0.95);
        color: #0f1c0f;
      }
  
      #${GALLERY_ID} .tm-ytp-screenshot-timestamp {
        position: absolute;
        left: 14px;
        bottom: 14px;
        padding: 4px 8px;
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        font-size: 14px;
        line-height: 1;
      font-family: var(--yt-spec-font-family, "YouTube Sans", "Roboto", sans-serif);
        font-weight: 500;
      }
  
      #${BUTTON_ID} {
        width: 48px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
      }
  
      #${BUTTON_ID} svg {
        width: 22px;
        height: 22px;
        stroke: currentColor;
        stroke-width: 1.5;
      }
    `);

    init();

    function init() {
        ensureGallery();
        attachObservers();
        ensureButtonWithRetries();
    }

    function ensureButtonWithRetries(attempt = 0) {
        if (attempt > RETRY_LIMIT) {
            return;
        }
        if (!ensureButton()) {
            setTimeout(() => ensureButtonWithRetries(attempt + 1), RETRY_DELAY);
        }
    }

    function attachObservers() {
        const reactRoot = document.body;
        if (!reactRoot) {
            return;
        }

        const observer = new MutationObserver(throttle(ensureButton, 500));
        observer.observe(reactRoot, {
            childList: true,
            subtree: true,
        });

        document.addEventListener('yt-navigate-finish', () => {
            ensureButtonWithRetries();
        });

        window.addEventListener('yt-page-data-updated', () => {
            ensureButtonWithRetries();
        });
    }

    function ensureButton() {
        const controls = document.querySelector('.ytp-right-controls');
        if (!controls) {
            return false;
        }

        if (document.getElementById(BUTTON_ID)) {
            return true;
        }

        const button = createButton();
        controls.insertBefore(button, controls.firstChild);
        return true;
    }

    function createButton() {
        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.className = 'ytp-button';
        button.type = 'button';
        button.title = '截图';
        button.setAttribute('aria-label', '截图');

        const icon = createCameraIcon();
        button.appendChild(icon);

        button.addEventListener('click', (event) => {
            event.preventDefault();
            captureScreenshot();
        });
        return button;
    }

    function createCameraIcon() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        const group = document.createElementNS(svgNS, 'g');
        group.setAttribute('fill', 'none');
        group.setAttribute('stroke', 'currentColor');
        group.setAttribute('stroke-linecap', 'round');
        group.setAttribute('stroke-linejoin', 'round');
        group.setAttribute('stroke-width', '2');

        const body = document.createElementNS(svgNS, 'path');
        body.setAttribute('d', 'M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z');
        const lens = document.createElementNS(svgNS, 'circle');
        lens.setAttribute('cx', '12');
        lens.setAttribute('cy', '13');
        lens.setAttribute('r', '3');

        group.appendChild(body);
        group.appendChild(lens);
        svg.appendChild(group);
        return svg;
    }

    function createTrashIcon() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('d', 'M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2');

        svg.appendChild(path);
        return svg;
    }

    function createCopyIcon() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        const group = document.createElementNS(svgNS, 'g');
        group.setAttribute('fill', 'none');
        group.setAttribute('stroke', 'currentColor');
        group.setAttribute('stroke-linecap', 'round');
        group.setAttribute('stroke-linejoin', 'round');
        group.setAttribute('stroke-width', '2');

        const rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('width', '14');
        rect.setAttribute('height', '14');
        rect.setAttribute('x', '8');
        rect.setAttribute('y', '8');
        rect.setAttribute('rx', '2');
        rect.setAttribute('ry', '2');

        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2');

        group.appendChild(rect);
        group.appendChild(path);
        svg.appendChild(group);
        return svg;
    }

    function createSaveIcon() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        const group = document.createElementNS(svgNS, 'g');
        group.setAttribute('fill', 'none');
        group.setAttribute('stroke', 'currentColor');
        group.setAttribute('stroke-linecap', 'round');
        group.setAttribute('stroke-linejoin', 'round');
        group.setAttribute('stroke-width', '2');

        const body = document.createElementNS(svgNS, 'path');
        body.setAttribute('d', 'M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z');
        const slot = document.createElementNS(svgNS, 'path');
        slot.setAttribute('d', 'M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7');
        const top = document.createElementNS(svgNS, 'path');
        top.setAttribute('d', 'M7 3v4a1 1 0 0 0 1 1h7');

        group.appendChild(body);
        group.appendChild(slot);
        group.appendChild(top);
        svg.appendChild(group);
        return svg;
    }

    async function copyImageToClipboard(dataUrl) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        if (!navigator.clipboard || !navigator.clipboard.write) {
            throw new Error('Clipboard API not available');
        }
        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);
    }

    function saveImage(dataUrl, filename, item) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        item.classList.add('tm-ytp-screenshot-saved');
        setTimeout(() => item.classList.remove('tm-ytp-screenshot-saved'), 600);
    }

    function captureScreenshot() {
        const video = document.querySelector('video.html5-main-video');
        if (!video) {
            console.warn('[YouTube Screenshot] Video element not found.');
            return;
        }

        if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
            console.warn('[YouTube Screenshot] Video is not ready for capturing.');
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.warn('[YouTube Screenshot] Unable to obtain 2D context.');
            return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
            const dataUrl = canvas.toDataURL('image/png');
            addScreenshotToGallery(dataUrl, video.currentTime);
        } catch (error) {
            console.error('[YouTube Screenshot] Failed to capture screenshot:', error);
        }
    }

    function addScreenshotToGallery(dataUrl, playbackTime) {
        const gallery = ensureGallery();
        const item = document.createElement('div');
        item.className = 'tm-ytp-screenshot-item';

        const link = document.createElement('a');
        const timestamp = new Date();
        const filename = `youtube-screenshot-${formatTimestamp(timestamp)}.png`;
        link.href = dataUrl;
        link.download = filename;
        link.target = '_blank';
        link.rel = 'noopener';

        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = 'YouTube screenshot';
        link.appendChild(img);

        const toolbar = document.createElement('div');
        toolbar.className = 'tm-ytp-screenshot-toolbar';
        toolbar.textContent = filename;
        toolbar.setAttribute('title', filename);

        const timestampBadge = document.createElement('div');
        timestampBadge.className = 'tm-ytp-screenshot-timestamp';
        timestampBadge.textContent = formatPlaybackTimestamp(playbackTime);

        const actions = document.createElement('div');
        actions.className = 'tm-ytp-screenshot-actions';

        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.className = 'tm-ytp-screenshot-action tm-ytp-screenshot-action--save';
        saveButton.title = '保存图片';
        const saveIcon = createSaveIcon();
        saveButton.appendChild(saveIcon);
        saveButton.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            saveImage(dataUrl, filename, item);
        });

        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'tm-ytp-screenshot-action tm-ytp-screenshot-action--copy';
        copyButton.title = '复制到剪贴板';
        const copyIcon = createCopyIcon();
        copyButton.appendChild(copyIcon);
        copyButton.addEventListener('click', async (event) => {
            event.stopPropagation();
            event.preventDefault();
            try {
                await copyImageToClipboard(dataUrl);
                item.classList.add('tm-ytp-screenshot-copied');
                setTimeout(() => item.classList.remove('tm-ytp-screenshot-copied'), 600);
            } catch (error) {
                console.warn('[YouTube Screenshot] Failed to copy screenshot to clipboard.', error);
            }
        });

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'tm-ytp-screenshot-action tm-ytp-screenshot-action--remove';
        removeButton.title = '移除截图';
        const removeIcon = createTrashIcon();
        removeButton.appendChild(removeIcon);
        removeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            item.remove();
        });

        actions.appendChild(saveButton);
        actions.appendChild(copyButton);
        actions.appendChild(removeButton);

        item.appendChild(link);
        item.appendChild(actions);
        item.appendChild(timestampBadge);
        item.appendChild(toolbar);

        gallery.appendChild(item);
    }

    function ensureGallery() {
        let gallery = document.getElementById(GALLERY_ID);
        if (gallery) {
            return gallery;
        }

        gallery = document.createElement('div');
        gallery.id = GALLERY_ID;
        document.body.appendChild(gallery);
        return gallery;
    }

    function formatTimestamp(date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const mi = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        return `${yyyy}${mm}${dd}-${hh}${mi}${ss}`;
    }

    function formatPlaybackTimestamp(seconds) {
        if (typeof seconds !== 'number' || Number.isNaN(seconds)) {
            return '--:--';
        }

        const totalMs = Math.max(0, Math.round(seconds * 1000));
        const hours = Math.floor(totalMs / 3600000);
        const minutes = Math.floor((totalMs % 3600000) / 60000);
        const secs = Math.floor((totalMs % 60000) / 1000);

        const minutePart = String(minutes).padStart(2, '0');
        const secondPart = String(secs).padStart(2, '0');

        if (hours > 0) {
            const hourPart = String(hours).padStart(2, '0');
            return `${hourPart}:${minutePart}:${secondPart}`;
        }

        return `${minutePart}:${secondPart}`;
    }

    function throttle(fn, wait) {
        let lastCall = 0;
        let timeout = null;
        let lastArgs;

        return function throttled(...args) {
            const now = Date.now();
            const remaining = wait - (now - lastCall);
            lastArgs = args;

            if (remaining <= 0) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                lastCall = now;
                fn.apply(this, lastArgs);
            } else if (!timeout) {
                timeout = setTimeout(() => {
                    lastCall = Date.now();
                    timeout = null;
                    fn.apply(this, lastArgs);
                }, remaining);
            }
        };
    }
})();
