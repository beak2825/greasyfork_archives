// ==UserScript==
// @name         Anime1 現代化改造 (V2.3 大圖滿版最終型)
// @name:zh-CN   Anime1 現代化改造 (V2.3 大圖滿版最終型)
// @name:zh-TW   Anime1 現代化改造 (V2.3 大圖滿版最終型)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Grid 佈局 + Yahoo 高清圖 + 極速換頁 + 搜尋框 + 新分頁 + 滿版顯示 + 卡片放大
// @description:zh-TW Grid 佈局 + Yahoo 高清圖 + 極速換頁 + 搜尋框 + 新分頁 + 滿版顯示 + 卡片放大
// @author       Mark
// @match        https://anime1.me/
// @connect      tw.images.search.yahoo.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561833/Anime1%20%E7%8F%BE%E4%BB%A3%E5%8C%96%E6%94%B9%E9%80%A0%20%28V23%20%E5%A4%A7%E5%9C%96%E6%BB%BF%E7%89%88%E6%9C%80%E7%B5%82%E5%9E%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561833/Anime1%20%E7%8F%BE%E4%BB%A3%E5%8C%96%E6%94%B9%E9%80%A0%20%28V23%20%E5%A4%A7%E5%9C%96%E6%BB%BF%E7%89%88%E6%9C%80%E7%B5%82%E5%9E%8B%29.meta.js
// ==/UserScript==

// ==UserScript==
// @name         Anime1 現代化改造 (V1.9 極速換頁版)
// @name:zh-CN   Anime1 現代化改造 (V1.9 極速換頁版)
// @name:zh-TW   Anime1 現代化改造 (V1.9 極速換頁版)
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  修復連續換頁導致圖片不加載的問題 (Batch ID 機制)
// @description:zh-TW 修復連續換頁導致圖片不加載的問題 (Batch ID 機制)
// @author       你
// @match        https://anime1.me/*
// @connect      tw.images.search.yahoo.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    console.log("🔥 腳本 V2.3 啟動：大圖滿版模式...");

    // ---------------------------------------------------------
    // 1. CSS 樣式表
    // ---------------------------------------------------------
    const myCss = `
        body {
            font-family: "Noto Sans TC", "Microsoft JhengHei", sans-serif !important;
            overflow-x: hidden;
            background-color: #121212 !important;
        }

        #secondary, #recent-posts-6, .entry-content > p:first-of-type,
        #table-list thead, .dataTables_length, .dataTables_filter, .dataTables_info {
            display: none !important;
        }

        /* 滿版寬度 */
        #page, #content, #primary, .site-content, .entry-content, article {
            width: 100% !important;
            max-width: 98vw !important;
            margin: 0 auto !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            float: none !important;
        }

        /* 搜尋框 */
        .dataTables_filter {
            display: block !important;
            text-align: center !important;
            margin: 20px 0 30px 0 !important;
            color: #fff !important;
        }
        .dataTables_filter input {
            background-color: #2a2a2a !important;
            border: 1px solid #444 !important;
            border-radius: 50px !important;
            color: #eee !important;
            padding: 10px 24px !important;
            width: 350px !important; /* 搜尋框也稍微加大 */
            transition: all 0.3s ease !important;
            outline: none !important;
            font-size: 16px !important;
        }
        .dataTables_filter input:focus {
            width: 550px !important;
            background-color: #333 !important;
            border-color: #28a745 !important;
        }

        /* ★★★ 核心修改：卡片變大 ★★★ */
        #table-list tbody {
            display: grid !important;
            /* 從 210px 改為 280px，卡片會變大，每行數量會變少 */
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
            gap: 24px !important; /* 間距稍微拉大一點，比較不擁擠 */
            padding: 0 10px !important;
            background: transparent !important;
        }

        /* 卡片本體 */
        #table-list tbody tr {
            display: flex !important;
            flex-direction: column !important;
            border: none !important;
            border-radius: 12px !important;
            background-color: #1e1e1e !important;
            overflow: hidden !important;
            padding: 0 !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            height: 100%;
            position: relative;
        }
        #table-list tbody tr:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.7);
            z-index: 10;
        }

        /* 文字區域 */
        #table-list tbody tr td {
            display: block !important;
            border: none !important;
            padding: 0 16px !important;
            width: 100% !important;
            background: transparent !important;
        }

        /* 標題 (配合卡片加大) */
        #table-list tbody tr td:first-child {
            order: 2;
            margin-top: 14px;
            margin-bottom: 6px;
            font-size: 19px !important; /* 字體加大 */
            font-weight: 700 !important;
            color: #e0e0e0 !important;
            line-height: 1.4 !important;
            height: 2.8em;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box !important;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        #table-list tbody tr td:first-child:hover { color: #fff !important; }
        #table-list tbody tr td:first-child a {
            text-decoration: none !important;
            color: inherit !important;
        }

        /* 副標題 */
        #table-list tbody tr td:not(:first-child) {
            order: 3;
            font-size: 14px !important; /* 副標題也稍微加大 */
            color: #999 !important;
            margin-bottom: 3px;
        }
        #table-list tbody tr td:last-child {
            padding-bottom: 16px !important;
        }

        .img-anchor {
            order: 1;
            width: 100%;
            display: block;
            text-decoration: none;
            cursor: pointer;
        }

        .img-container {
            width: 100%;
            aspect-ratio: 16/9;
            overflow: hidden;
            background-color: #000;
            position: relative;
        }
        .anime-cover {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease, opacity 0.3s;
            display: block;
            opacity: 0;
        }
        .anime-cover.loaded { opacity: 1; }
        #table-list tbody tr:hover .anime-cover { transform: scale(1.06); }

        .quality-badge {
            position: absolute;
            top: 8px; left: 8px;
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 11px; font-weight: bold; color: #fff;
            z-index: 2;
            box-shadow: 0 2px 5px rgba(0,0,0,0.6);
            opacity: 0.9;
        }
        .badge-hd { background-color: #28a745; }
        .badge-sd { background-color: #fd7e14; }

        .dataTables_paginate {
            display: flex !important;
            justify-content: center;
            margin: 40px 0 60px 0;
            gap: 15px;
            padding-top: 20px;
            border-top: 1px solid #333;
        }
        .paginate_button {
            cursor: pointer;
            padding: 10px 22px !important;
            background-color: #333 !important;
            color: #ccc !important;
            border-radius: 8px !important;
            text-decoration: none !important;
            transition: background 0.2s;
            font-weight: bold;
            font-size: 15px !important;
            border: none !important;
        }
        .paginate_button:hover:not(.disabled) {
            background-color: #555 !important;
            color: #fff !important;
        }
        .paginate_button.disabled { opacity: 0.3; cursor: default; }

        @media (max-width: 768px) {
            #table-list tbody {
                /* 手機版保持 2 欄，但間距縮小 */
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 12px !important;
            }
            #table-list tbody tr td:first-child {
                font-size: 15px !important;
                height: 3em;
            }
        }
    `;
    let styleNode = document.createElement("style");
    styleNode.innerHTML = myCss;
    document.head.appendChild(styleNode);

    // ---------------------------------------------------------
    // 2. 工具函數
    // ---------------------------------------------------------
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function searchYahooImages(keyword) {
        return new Promise((resolve, reject) => {
            const cleanName = keyword
                .replace(/\[.*?\]/g, '')
                .replace(/（.*?）/g, '')
                .replace(/\(.*?\)/g, '')
                .replace(/連載中.*/g, '')
                .trim();

            const searchUrl = `https://tw.images.search.yahoo.com/search/images?p=${encodeURIComponent(cleanName + " 動畫 視覺圖")}`;

            GM_xmlhttpRequest({
                method: "GET",
                url: searchUrl,
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
                onload: function(response) {
                    try {
                        const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                        const item = doc.querySelector('#sres li');
                        if (!item) { resolve(null); return; }

                        const imgNode = item.querySelector('img');
                        const thumbUrl = imgNode ? (imgNode.getAttribute('data-src') || imgNode.src) : null;
                        const anchor = item.querySelector('a');
                        let highResUrl = null;
                        if (anchor && anchor.href) {
                            const match = anchor.href.match(/imgurl=([^&]+)/);
                            if (match && match[1]) {
                                highResUrl = decodeURIComponent(match[1]);
                                if (highResUrl && !highResUrl.startsWith('http')) {
                                    highResUrl = 'https://' + highResUrl;
                                }
                            }
                        }
                        resolve({ highRes: highResUrl, thumb: thumbUrl });
                    } catch (e) { resolve(null); }
                },
                onerror: function(err) { resolve(null); }
            });
        });
    }

    // ---------------------------------------------------------
    // 3. 核心邏輯
    // ---------------------------------------------------------
    let currentBatchId = 0;

    async function processRows(batchId) {
        const rows = document.querySelectorAll("#table-list tbody tr");
        const unprocessedRows = Array.from(rows).filter(row => !row.querySelector('.img-container'));

        const MAX_CONCURRENT = 3;
        const activePromises = [];

        for (const row of unprocessedRows) {
            if (batchId !== currentBatchId) break;

            if (activePromises.length >= MAX_CONCURRENT) {
                await Promise.race(activePromises);
            }

            const p = (async () => {
                const linkElement = row.querySelector("a");
                if (!linkElement) return;

                linkElement.target = "_blank";

                const rawName = linkElement.innerText;
                const animeLink = linkElement.href;

                const imgAnchor = document.createElement("a");
                imgAnchor.href = animeLink;
                imgAnchor.target = "_blank";
                imgAnchor.className = "img-anchor";

                const imgContainer = document.createElement("div");
                imgContainer.className = "img-container";
                imgContainer.style.backgroundColor = "#222";

                const img = document.createElement("img");
                img.className = "anime-cover";

                const badge = document.createElement("div");
                badge.className = "quality-badge";
                badge.style.display = "none";

                imgContainer.appendChild(badge);
                imgContainer.appendChild(img);
                imgAnchor.appendChild(imgContainer);
                row.prepend(imgAnchor);

                const result = await searchYahooImages(rawName);

                if (result) {
                    img.onerror = function() {
                        if (this.src !== result.thumb) {
                            this.src = result.thumb;
                            badge.innerText = "SD";
                            badge.className = "quality-badge badge-sd";
                            badge.style.display = "block";
                        }
                    };
                    img.onload = function() { this.classList.add('loaded'); };

                    if (result.highRes) {
                        img.src = result.highRes;
                        badge.innerText = "HD";
                        badge.className = "quality-badge badge-hd";
                        badge.style.display = "block";
                    } else {
                        img.src = result.thumb;
                        badge.innerText = "SD";
                        badge.className = "quality-badge badge-sd";
                        badge.style.display = "block";
                    }
                } else {
                    img.src = `https://placehold.co/640x360/333/FFF?text=${encodeURIComponent(rawName.substring(0,4))}`;
                    img.classList.add('loaded');
                }
            })().then(() => {
                activePromises.splice(activePromises.indexOf(p), 1);
            });

            activePromises.push(p);
            await sleep(100);
        }

        await Promise.all(activePromises);
    }

    // ---------------------------------------------------------
    // 4. 啟動與監聽
    // ---------------------------------------------------------
    let debounceTimer = null;

    function triggerUpdate() {
        if (debounceTimer) clearTimeout(debounceTimer);
        currentBatchId++;
        const myBatchId = currentBatchId;

        debounceTimer = setTimeout(() => {
            processRows(myBatchId);
        }, 200);
    }

    setTimeout(triggerUpdate, 1500);

    const targetNode = document.querySelector('#table-list tbody');
    if (targetNode) {
        const observer = new MutationObserver((mutationsList) => {
            let shouldProcess = false;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                    break;
                }
            }
            if (shouldProcess) {
                triggerUpdate();
            }
        });
        observer.observe(targetNode, { childList: true });
    }

})();