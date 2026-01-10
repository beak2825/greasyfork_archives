// ==UserScript==
// @name         Twitter排行榜：大屏播放版
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  点击封面弹出大屏遮罩层播放视频，禁用Referer解决403问题
// @author       Gemini
// @license MIT
// @match        https://twitter-ero-video-ranking.com/*
// @grant        GM_xmlhttpRequest
// @connect      twitter-ero-video-ranking.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562130/Twitter%E6%8E%92%E8%A1%8C%E6%A6%9C%EF%BC%9A%E5%A4%A7%E5%B1%8F%E6%92%AD%E6%94%BE%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/562130/Twitter%E6%8E%92%E8%A1%8C%E6%A6%9C%EF%BC%9A%E5%A4%A7%E5%B1%8F%E6%92%AD%E6%94%BE%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 强制全局禁用 Referer (解决403) ---
    const meta = document.createElement('meta');
    meta.name = "referrer";
    meta.content = "no-referrer";
    document.head.appendChild(meta);

    // --- 2. 创建全局唯一的遮罩层样式 ---
    const style = document.createElement('style');
    style.textContent = `
        #video-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 10000;
            display: none; align-items: center; justify-content: center;
        }
        #video-modal-container {
            position: relative; width: 90%; max-width: 500px; /* 针对竖屏视频优化 */
            height: 80vh; background: #000; border-radius: 8px; overflow: hidden;
        }
        #video-modal-player { width: 100%; height: 100%; object-fit: contain; }
        #video-modal-close {
            position: absolute; top: 10px; right: 15px; color: #fff;
            font-size: 30px; cursor: pointer; z-index: 10001;
            text-shadow: 0 0 5px rgba(0,0,0,0.8);
        }
        .modal-loading {
            position: absolute; color: #fff; font-size: 14px;
            top: 50%; left: 50%; transform: translate(-50%, -50%);
        }
    `;
    document.head.appendChild(style);

    // --- 3. 初始化遮罩层 DOM ---
    let overlay, player, loadingHint;

    function createModal() {
        overlay = document.createElement('div');
        overlay.id = 'video-modal-overlay';
        overlay.innerHTML = `
            <div id="video-modal-container">
                <span id="video-modal-close">&times;</span>
                <div class="modal-loading">解析中...</div>
                <video id="video-modal-player" controls referrerpolicy="no-referrer"></video>
            </div>
        `;
        document.body.appendChild(overlay);

        player = overlay.querySelector('#video-modal-player');
        loadingHint = overlay.querySelector('.modal-loading');

        // 点击关闭按钮或背景关闭
        overlay.addEventListener('click', (e) => {
            if (e.target.id === 'video-modal-overlay' || e.target.id === 'video-modal-close') {
                closeModal();
            }
        });
    }

    function closeModal() {
        overlay.style.display = 'none';
        player.pause();
        player.src = ""; // 释放内存
    }

    // --- 4. 视频源提取逻辑 ---
    const videoCache = new Map();

    async function fetchVideoUrl(detailUrl) {
        if (videoCache.has(detailUrl)) return videoCache.get(detailUrl);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: detailUrl,
                onload: (res) => {
                    const doc = new DOMParser().parseFromString(res.responseText, "text/html");
                    const json = doc.querySelector('script[type="application/ld+json"]');
                    if (json) {
                        const data = JSON.parse(json.textContent);
                        if (data.contentUrl) {
                            videoCache.set(detailUrl, data.contentUrl);
                            resolve(data.contentUrl); return;
                        }
                    }
                    reject("URL NOT FOUND");
                },
                onerror: reject
            });
        });
    }

    // --- 5. 绑定点击事件 ---
    function bindEvents() {
        // 针对 Next.js 页面结构，寻找包含 /movie/ 链接的容器 
        const links = document.querySelectorAll('a.block[href*="/movie/"]');
        
        links.forEach(link => {
            if (link.dataset.modalHooked) return;
            link.dataset.modalHooked = "true";

            link.addEventListener('click', async function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (!overlay) createModal();
                
                // 重置并显示遮罩层
                overlay.style.display = 'flex';
                loadingHint.style.display = 'block';
                player.style.display = 'none';

                try {
                    const mp4Url = await fetchVideoUrl(this.href);
                    player.src = mp4Url;
                    player.style.display = 'block';
                    loadingHint.style.display = 'none';
                    player.play();
                } catch (err) {
                    loadingHint.textContent = "视频解析失败，可能已被删除";
                    console.error(err);
                }
            }, true);
        });
    }

    // --- 6. 运行与监听 ---
    const observer = new MutationObserver(bindEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    if (document.readyState !== 'loading') {
        bindEvents();
    } else {
        document.addEventListener('DOMContentLoaded', bindEvents);
    }
})();