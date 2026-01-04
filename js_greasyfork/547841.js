// ==UserScript==
// @name         Видеоссылка с тайм-кодом и QR-кодом
// @namespace    http://tampermonkey.net/
// @version      1.8
// @license MIT
// @description  Копирует ссылку на сайт с таймкодом видео.
// @author       Ko16aska
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js
// @downloadURL https://update.greasyfork.org/scripts/547841/%D0%92%D0%B8%D0%B4%D0%B5%D0%BE%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B0%20%D1%81%20%D1%82%D0%B0%D0%B9%D0%BC-%D0%BA%D0%BE%D0%B4%D0%BE%D0%BC%20%D0%B8%20QR-%D0%BA%D0%BE%D0%B4%D0%BE%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/547841/%D0%92%D0%B8%D0%B4%D0%B5%D0%BE%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B0%20%D1%81%20%D1%82%D0%B0%D0%B9%D0%BC-%D0%BA%D0%BE%D0%B4%D0%BE%D0%BC%20%D0%B8%20QR-%D0%BA%D0%BE%D0%B4%D0%BE%D0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) return;

    GM_addStyle(`
        #qr-code-modal {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background-color: #f4f4f5; /* Очень светлый серый фон */
            padding: 20px; border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); z-index: 2147483647;
            display: flex; flex-direction: column; align-items: center; gap: 15px;
            max-width: 90vw; box-sizing: border-box;
        }
        #qr-code-modal button.close-button {
            position: absolute; top: 10px; right: 10px; background: none; border: none;
            font-size: 1.5em; cursor: pointer; color: #aaa; transition: color 0.2s ease;
            padding: 5px; line-height: 1;
        }
        #qr-code-modal button.close-button:hover { color: #333; }

        /* --- НОВЫЙ СТИЛЬ РАМОК --- */
        #qr-visual-container, .text-info-container {
            background-color: #ffffff;
            border: 2px solid #7c3aed; /* Насыщенный фиолетовый */
            border-radius: 10px;
            box-sizing: border-box;
            /* Та самая 3D-тень */
            box-shadow: 3px 3px 0px #c4b5fd, 5px 5px 10px rgba(0, 0, 0, 0.15);
        }

        /* --- ИСПРАВЛЕНИЕ ОТСТУПОВ --- */
        #qr-visual-container {
            padding: 10px; /* Внутренний отступ, чтобы код не прилипал к рамке */
            /* width: auto; убрали width: 100% */
        }

        #qr-code-modal canvas, #qr-code-modal img.qr-fallback {
            display: block;
            width: 200px;
            height: 200px;
            margin: 0 auto;
            border-radius: 6px; /* Больше не нужна своя рамка, так как есть контейнер */
        }

        .text-info-container {
            width: 100%; /* Текстовый блок пусть растягивается */
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 12px;
        }

        #qr-code-modal p.link-label {
            margin: 0; color: #333;
            font-size: 1.1em; font-weight: 600;
            text-align: center;
        }
        #qr-code-modal a.generated-link {
            word-break: break-all;
            color: #7c3aed; /* Фиолетовая ссылка в тему */
            font-weight: 600; /* Сделаем жирнее */
            text-decoration: none;
            font-size: 1.1em; text-align: center;
            max-width: 380px; display: block; line-height: 1.4;
        }
        #qr-code-modal a.generated-link:hover { text-decoration: underline; }
        #qr-code-modal .info-message {
            color: #666; font-style: italic; font-size: 1em;
            text-align: center; max-width: 95%; margin-top: 5px;
            border-top: 1px dashed #ccc; padding-top: 8px;
        }
    `);

    function cropCanvasWhitespace(sourceCanvas) {
        const ctx = sourceCanvas.getContext('2d'), { width, height } = sourceCanvas;
        const imageData = ctx.getImageData(0, 0, width, height), data = imageData.data;
        let minX = width, minY = height, maxX = -1, maxY = -1;
        for (let y = 0; y < height; y++) { for (let x = 0; x < width; x++) { const i = (y * width + x) * 4; if (data[i + 3] > 0 && (data[i] < 255 || data[i + 1] < 255 || data[i + 2] < 255)) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; } } }
        if (maxX === -1) return sourceCanvas;
        const croppedWidth = maxX - minX + 1, croppedHeight = maxY - minY + 1, sideLength = Math.max(croppedWidth, croppedHeight);
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = sideLength; croppedCanvas.height = sideLength;
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCtx.drawImage(sourceCanvas, minX, minY, croppedWidth, croppedHeight, (sideLength - croppedWidth) / 2, (sideLength - croppedHeight) / 2, croppedWidth, croppedHeight);
        return croppedCanvas;
    }

    function displayQRCode(url, infoMessage) {
        const existingModal = document.getElementById('qr-code-modal');
        if (existingModal) existingModal.remove();
        const modal = document.createElement('div');
        modal.id = 'qr-code-modal';
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.textContent = '×';
        closeButton.onclick = () => modal.remove();
        modal.appendChild(closeButton);
        const qrContainer = document.createElement('div');
        qrContainer.id = 'qr-visual-container';
        modal.appendChild(qrContainer);
        const textContainer = document.createElement('div');
        textContainer.className = 'text-info-container';
        const linkLabel = document.createElement('p');
        linkLabel.className = 'link-label';
        linkLabel.textContent = 'Ссылка скопирована в буфер:';
        textContainer.appendChild(linkLabel);
        const linkElement = document.createElement('a');
        linkElement.className = 'generated-link';
        linkElement.href = url;
        linkElement.textContent = url;
        linkElement.target = '_blank';
        textContainer.appendChild(linkElement);
        if (infoMessage) {
            const msgElement = document.createElement('p');
            msgElement.className = 'info-message';
            msgElement.textContent = infoMessage;
            textContainer.appendChild(msgElement);
        }
        modal.appendChild(textContainer);
        document.body.appendChild(modal);
        try {
            const tempCanvas = document.createElement('canvas');
            new QRious({ element: tempCanvas, value: url, size: 300 });
            const perfectCanvas = cropCanvasWhitespace(tempCanvas);
            qrContainer.appendChild(perfectCanvas);
        } catch (e) {
            console.error('Ошибка QRious, используется Google Charts API:', e);
            const qrImg = document.createElement('img');
            qrImg.className = 'qr-fallback';
            qrImg.src = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encodeURIComponent(url)}`;
            qrImg.alt = 'QR Code';
            qrContainer.appendChild(qrImg);
        }
    }

    // Остальные функции без изменений
    function getVideoInfo() {
        let videoElement = null, currentTime = 0, urlToShare = window.location.href, infoMessage = '', videoType = 'page';
        const videosOnPage = Array.from(document.querySelectorAll('video')), playingVideo = videosOnPage.find(v => !v.paused && v.currentTime > 0);
        videoElement = playingVideo || videosOnPage[0];
        if (videoElement && videoElement.duration > 0 && !isNaN(videoElement.currentTime)) {
             currentTime = videoElement.currentTime;
             if (window.location.hostname.includes('youtube.com')) {
                const urlObj = new URL(window.location.href);
                urlObj.searchParams.set('t', Math.floor(currentTime) + 's');
                urlToShare = urlObj.toString();
                videoType = 'youtube';
                infoMessage = `YouTube видео с тайм-кодом ${formatTime(currentTime)}`;
             } else {
                urlToShare = window.location.href.split('#')[0] + '#t=' + Math.floor(currentTime);
                videoType = 'html5';
                infoMessage = `HTML5 видео с тайм-кодом ${formatTime(currentTime)}`;
             }
        } else {
            const iframes = document.querySelectorAll('iframe');
            let foundIframeVideo = false;
            for (const iframe of iframes) {
                try {
                    const iframeSrc = iframe.src;
                    if (iframeSrc && (iframeSrc.includes('youtube.com/embed/') || iframeSrc.includes('vimeo.com/video/'))) {
                        urlToShare = iframeSrc;
                        videoType = 'iframe';
                        infoMessage = `Найдено видео в iframe. Ссылка скопирована на источник видео.`;
                        foundIframeVideo = true;
                        break;
                    }
                } catch (e) { /* Ignore */ }
            }
            if (!foundIframeVideo) {
                infoMessage = 'Видео не найдено. Копируется ссылка на текущую страницу.';
                videoType = 'page';
            }
        }
        return { url: urlToShare, type: videoType, message: infoMessage };
    }
    function formatTime(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
        const h = Math.floor(totalSeconds / 3600), m = Math.floor((totalSeconds % 3600) / 60), s = Math.floor(totalSeconds % 60);
        return (h > 0 ? [h, m, s] : [m, s]).map(v => String(v).padStart(2, '0')).join(':');
    }
    function handleAction() {
        const videoInfo = getVideoInfo();
        GM_setClipboard(videoInfo.url);
        displayQRCode(videoInfo.url, videoInfo.message);
    }

    GM_registerMenuCommand('Копировать QR/ссылку на видео', handleAction, 'q');

})();