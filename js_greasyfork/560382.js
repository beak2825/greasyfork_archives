// ==UserScript==
// @name         AOTY Genre Display
// @name:zh-CN   AOTY 专辑流派 Genre 显示
// @name:zh-TW   AOTY 專輯流派 Genre 顯示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display album genres on listing pages with fade-out effect and hover expansion.
// @description:zh-CN 在 AOTY 列表页显示专辑流派，支持渐隐效果和悬停展开。
// @description:zh-TW 在 AOTY 列表頁顯示專輯流派，支持漸隱效果和懸停展開。
// @author       Google Gemini AI
// @match        https://www.albumoftheyear.org/*
// @grant        GM_xmlhttpRequest
// @connect      albumoftheyear.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560382/AOTY%20Genre%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/560382/AOTY%20Genre%20Display.meta.js
// ==/UserScript==

/* Made by Google Gemini AI 
   Features: 
   - Lazy loading via Intersection Observer logic
   - 2-line limit with fade-out mask
   - Absolute-positioned hover expansion (doesn't break layout)
   - LocalStorage caching (24h)
*/

(function() {
    'use strict';

    const CACHE_PREFIX = 'aoty_gen_v6_';
    const EXPIRE = 86400000;

    // 1. CSS Injection
    const style = document.createElement('style');
    style.innerHTML = `
        .genre-container {
            position: relative;
            min-height: 14px;
            margin: 4px 0;
            z-index: 5;
        }

        .custom-genre-tag {
            font-size: 11px !important;
            color: #666 !important;
            font-weight: 500 !important;
            line-height: 1.3;
            font-family: Consolas, Arial, sans-serif;
            
            display: -webkit-box;
            -webkit-line-clamp: 2; 
            -webkit-box-orient: vertical;
            overflow: hidden;
            
            mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
            
            transition: all 0.2s ease;
        }

        .genre-container:hover .custom-genre-tag {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            max-width: 220px; 
            background: #ffffff;
            border: 1px solid #cccccc;
            border-radius: 4px;
            padding: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 100;
            
            -webkit-line-clamp: unset; 
            display: block;
            mask-image: none;
            -webkit-mask-image: none;
            color: #222 !important;
        }
    `;
    document.head.appendChild(style);

    function processAlbumBlock(block) {
        if (block.dataset.processed) return;

        const linkEl = block.querySelector('a[href^="/album/"]');
        if (!linkEl) return;

        const href = linkEl.getAttribute('href');
        const fullUrl = "https://www.albumoftheyear.org" + href;
        const albumId = href.split('/album/')[1].replace('.php', '');

        const cached = localStorage.getItem(CACHE_PREFIX + albumId);
        if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() < data.exp) {
                renderGenre(block, data.val);
                block.dataset.processed = "true";
                return;
            }
        }

        block.dataset.processed = "true";

        GM_xmlhttpRequest({
            method: "GET",
            url: fullUrl,
            onload: function(res) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(res.responseText, "text/html");
                const detailRows = doc.querySelectorAll('.detailRow');
                let genres = [];

                detailRows.forEach(row => {
                    if (row.textContent.includes('Genre')) {
                        const links = row.querySelectorAll('a');
                        links.forEach(a => {
                            if (!a.closest('.secondary')) {
                                genres.push(a.textContent.trim());
                            }
                        });
                    }
                });

                const result = genres.join(', ');
                if (result) {
                    localStorage.setItem(CACHE_PREFIX + albumId, JSON.stringify({val: result, exp: Date.now() + EXPIRE}));
                    renderGenre(block, result);
                }
            }
        });
    }

    function renderGenre(block, text) {
        if (block.querySelector('.genre-container')) return;

        const container = document.createElement('div');
        container.className = 'genre-container';
        
        const div = document.createElement('div');
        div.className = 'custom-genre-tag';
        div.innerText = text;

        container.appendChild(div);

        const ratingContainer = block.querySelector('.ratingRowContainer');
        if (ratingContainer) {
            ratingContainer.parentNode.insertBefore(container, ratingContainer);
        } else {
            block.appendChild(container);
        }
    }

    function init() {
        const blocks = document.querySelectorAll('.albumBlock');
        blocks.forEach(block => {
            const rect = block.getBoundingClientRect();
            if (rect.top < window.innerHeight + 800 && rect.bottom > -800) {
                processAlbumBlock(block);
            }
        });
    }

    window.addEventListener('scroll', init);
    setInterval(init, 3000);
    setTimeout(init, 800);
})();