// ==UserScript==
// @name         Youtube Subtitle Downloader（Downsub）
// @license      Zelda & ChatGPT
// @namespace    https://downsub.com/
// @version      1.0.0
// @description  在 YouTube 影片標題下方自動加入「下載字幕」按鈕，一鍵跳轉到 downsub.com 下載字幕。
// @author       Zelda & ChatGPT
// @match        https://www.youtube.com/watch*
// @grant        none


// @downloadURL https://update.greasyfork.org/scripts/551677/Youtube%20Subtitle%20Downloader%EF%BC%88Downsub%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551677/Youtube%20Subtitle%20Downloader%EF%BC%88Downsub%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 觀察 DOM 變化（YouTube 是動態載入的）
    const observer = new MutationObserver(() => {
        const titleContainer = document.querySelector('#above-the-fold #title');

        if (titleContainer && !document.querySelector('#download-subtitle-btn')) {
            const btn = document.createElement('button');
            btn.id = 'download-subtitle-btn';
            btn.innerText = '📥 下載字幕（Downsub）';
            btn.style.cssText = `
                background-color: #ff4b4b;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 8px 12px;
                margin-top: 8px;
                font-size: 14px;
                cursor: pointer;
                transition: background 0.2s;
            `;
            btn.onmouseover = () => btn.style.backgroundColor = '#e03d3d';
            btn.onmouseout = () => btn.style.backgroundColor = '#ff4b4b';
            btn.onclick = () => {
                const currentUrl = window.location.href;
                const downsubUrl = `https://downsub.com/?url=${encodeURIComponent(currentUrl)}`;
                window.open(downsubUrl, '_blank');
            };

            // 插入按鈕到影片標題下方
            titleContainer.parentNode.insertBefore(btn, titleContainer.nextSibling);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
