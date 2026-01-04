// ==UserScript==
// @name         Threads.com 圖片/影片隱藏
// @namespace    http://tampermonkey.net/
// @version      0.7.5
// @description  隱藏 Threads.com 貼文圖片/影片
// @match        https://www.threads.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549801/Threadscom%20%E5%9C%96%E7%89%87%E5%BD%B1%E7%89%87%E9%9A%B1%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/549801/Threadscom%20%E5%9C%96%E7%89%87%E5%BD%B1%E7%89%87%E9%9A%B1%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SMALL_SIZE = 200; // 小圖閾值

    // 🔑 檢查是否在單一媒體頁
    function inMediaPage() {
        return /\/post\/[^/]+\/media$/.test(location.pathname);
    }

    function handleButton(btn, mediaEl, label) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // 阻止外層 pressable
            console.log(`[Tampermonkey] 點擊 ${label}:`, mediaEl.src || mediaEl.currentSrc);
            mediaEl.style.display = '';
            if (mediaEl.tagName.toLowerCase() === 'video') {
                mediaEl.play().catch(()=>{});
            }
            btn.remove();
        }, { once: true });
    }

    function processImages() {
        if (inMediaPage()) {
            console.log('[Tampermonkey] 偵測到媒體頁，跳過遮掩處理');
            return;
        }

        const imgs = document.querySelectorAll('picture img, div img');
        imgs.forEach(img => {
            if (!img.dataset.hiddenByScript) {
                const w = img.width || img.naturalWidth || 0;
                const h = img.height || img.naturalHeight || 0;

                // 過濾小圖 (頭像/emoji)
                if (w < SMALL_SIZE && h < SMALL_SIZE) {
                    img.dataset.hiddenByScript = 'skip-small';
                    return;
                }

                img.dataset.hiddenByScript = 'true';
                img.style.display = 'none';

                const btn = document.createElement('button');
                btn.innerText = '顯示圖片';
                btn.style.display = 'block';
                btn.style.margin = '5px 0';
                btn.style.cursor = 'pointer';
                btn.style.padding = '4px 8px';
                btn.style.fontSize = '14px';

                handleButton(btn, img, '圖片');

                if (img.parentNode) {
                    img.parentNode.insertBefore(btn, img);
                }
            }
        });
    }

    function processVideos() {
        if (inMediaPage()) {
            console.log('[Tampermonkey] 偵測到媒體頁，跳過影片遮掩');
            return;
        }

        const vids = document.querySelectorAll('video');
        vids.forEach(video => {
            if (!video.dataset.hiddenByScript) {
                const w = video.videoWidth || video.clientWidth || 0;
                const h = video.videoHeight || video.clientHeight || 0;

                // 過濾小影片（通常是頭像動畫、背景特效）
                if (w < SMALL_SIZE && h < SMALL_SIZE) {
                    video.dataset.hiddenByScript = 'skip-small';
                    return;
                }

                video.dataset.hiddenByScript = 'true';

                try { video.pause(); } catch {}
                video.removeAttribute('autoplay');
                video.autoplay = false;
                video.style.display = 'none';

                const btn = document.createElement('button');
                btn.innerText = '顯示影片';
                btn.style.display = 'block';
                btn.style.margin = '5px 0';
                btn.style.cursor = 'pointer';
                btn.style.padding = '4px 8px';
                btn.style.fontSize = '14px';

                handleButton(btn, video, '影片');

                if (video.parentNode) {
                    video.parentNode.insertBefore(btn, video);
                }
            }
        });
    }

    console.log('[Tampermonkey] 腳本已啟動 (圖片/影片隱藏 + 小圖閾值200px + 媒體頁不遮掩)');
    processImages();
    processVideos();

    const observer = new MutationObserver(() => {
        processImages();
        processVideos();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();