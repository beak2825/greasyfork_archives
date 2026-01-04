// ==UserScript==
// @name         Osu! Background Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Download osu! beatmap background images in original quality and full size
// @author       Panzer4OSU
// @license      MIT
// @match        https://osu.ppy.sh/beatmapsets/*
// @grant        GM_xmlhttpRequest
// @connect      assets.ppy.sh
// @downloadURL https://update.greasyfork.org/scripts/553712/Osu%21%20Background%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/553712/Osu%21%20Background%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        const beatmapsetId = window.location.pathname.match(/\/beatmapsets\/(\d+)/)?.[1];
        if (!beatmapsetId) return;

        const imageUrl = `https://assets.ppy.sh/beatmaps/${beatmapsetId}/covers/raw.jpg`;
        createDownloadButton(imageUrl, beatmapsetId);
    }

    function createDownloadButton(imageUrl, beatmapsetId) {
        const button = document.createElement('button');
        button.textContent = '⬇️ Download BG';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 16px;
            background: #66ccff;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-family: inherit;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            transition: all 0.2s ease;
        `;

        button.onmouseenter = () => button.style.background = '#4db8ff';
        button.onmouseleave = () => button.style.background = '#66ccff';

        button.onclick = async () => {
            const originalText = button.textContent;
            button.textContent = '⏳ Downloading...';
            button.disabled = true;
            button.style.opacity = '0.7';

            try {
                await downloadImage(imageUrl, beatmapsetId);
                button.textContent = '✅ Downloaded!';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.opacity = '1';
                }, 2000);
            } catch (error) {
                button.textContent = '❌ Failed';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.opacity = '1';
                }, 2000);
            }
        };

        button.oncontextmenu = (e) => {
            e.preventDefault();
            if (confirm(`Original background URL:\n\n${imageUrl}\n\nOpen in new tab?`)) {
                window.open(imageUrl, '_blank');
            }
        };

        document.body.appendChild(button);
    }

    function downloadImage(url, beatmapsetId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: (response) => {
                    if (response.status !== 200) {
                        reject(new Error(`HTTP ${response.status}`));
                        return;
                    }

                    const blob = response.response;
                    const downloadUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');

                    const title = document.querySelector('.beatmapset-header__details-text--title')?.textContent.trim();
                    const artist = document.querySelector('.beatmapset-header__details-text--artist')?.textContent.trim();

                    const filename = (title && artist)
                        ? `${artist} - ${title} [${beatmapsetId}].jpg`.replace(/[<>:"/\\|?*]/g, '').substring(0, 150)
                        : `osu-bg-${beatmapsetId}.jpg`;

                    link.href = downloadUrl;
                    link.download = filename;
                    link.click();

                    URL.revokeObjectURL(downloadUrl);
                    resolve();
                },
                onerror: () => reject(new Error('Network error'))
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
    } else {
        setTimeout(init, 500);
    }
})();