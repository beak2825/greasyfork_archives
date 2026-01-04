// ==UserScript==
// @name        JavDB Enhancer (繁體中文)
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description JavDB 功能增強
// @author      Gemini
// @match       https://javdb.com/*
// @connect     javzimu.com
// @connect     subtitlecat.com
// @icon        https://www.google.com/s2/favicons?sz=64&domain=javdb.com
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/557366/JavDB%20Enhancer%20%28%E7%B9%81%E9%AB%94%E4%B8%AD%E6%96%87%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557366/JavDB%20Enhancer%20%28%E7%B9%81%E9%AB%94%E4%B8%AD%E6%96%87%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 僅在頂層視窗執行主要邏輯
    if (window.self !== window.top) {
        return;
    }

    // --- 設定預設值與讀取 ---
    const DEFAULTS = {
        cols: 4,
        infiniteScroll: true,
        modalPreview: true,
        hideSearchBar: false,
        margin: 0,
        minRating: 0,
        hiddenTags: '',
        showQuickBlock: true,
        translateTitle: false,
        floatingSearch: false,
        subtitleSearch: true,
        triggerDistance: 1500
    };

    let state = {
        isLoading: false,
        nextPageUrl: null,
        mainContainer: null,
        hiddenItems: { rating: [], text: [] },
        hiddenByRatingCount: 0,
        hiddenByTextCount: 0,
        modalHistory: [],
        currentModalUrl: null,
        activeMovieUrl: null,
        searchObserver: null,
        config: {
            cols: parseInt(localStorage.getItem('jd_cols')) || DEFAULTS.cols,
            infiniteScroll: (localStorage.getItem('jd_infinite') !== 'false'),
            modalPreview: (localStorage.getItem('jd_modal') !== 'false'),
            hideSearchBar: (localStorage.getItem('jd_hide_search') === 'true'),
            margin: (localStorage.getItem('jd_margin') !== null) ? parseInt(localStorage.getItem('jd_margin')) : DEFAULTS.margin,
            minRating: parseFloat(localStorage.getItem('jd_rating')) || DEFAULTS.minRating,
            hiddenTags: localStorage.getItem('jd_tags') || DEFAULTS.hiddenTags,
            showQuickBlock: (localStorage.getItem('jd_quick_block') !== 'false'),
            translateTitle: (localStorage.getItem('jd_translate_title') === 'true'),
            floatingSearch: (localStorage.getItem('jd_floating_search') === 'true'),
            subtitleSearch: (localStorage.getItem('jd_subtitle_search') !== 'false')
        }
    };

    // --- CSS 樣式 (僅保留介面部分，按鈕樣式改用 Inline) ---
    const styles = `
        :root {
            --jd-cols: ${state.config.cols};
            --jd-margin: ${state.config.margin}%;
        }

        .section .container,
        .navbar .container,
        .footer .container {
            max-width: calc(100% - (var(--jd-margin) * 2)) !important;
            width: calc(100% - (var(--jd-margin) * 2)) !important;
            margin-left: auto !important;
            margin-right: auto !important;
            transition: width 0.3s ease, max-width 0.3s ease;
        }

        /* 指定隱藏規則 */
        body.jd-hide-search nav.sub-header:nth-child(3) { display: none !important; }
        body.jd-hide-search #search-bar-container > div.column { display: none !important; }
        body.jd-hide-search form[action="/search"]:not(#jd-search-form),
        body.jd-hide-search .navbar-item:has(form[action="/search"]) { display: none !important; }

        .jd-search-hidden { display: none !important; }

        /* 強制應用 Grid 設定 */
        #jd-main-grid, .jd-main-grid {
            display: grid !important;
            grid-template-columns: repeat(var(--jd-cols), minmax(0, 1fr)) !important;
            width: 100% !important;
        }
        @media (max-width: 768px) {
             #jd-main-grid, .jd-main-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }

        /* 快速封鎖按鈕 Hover 效果 (基礎樣式已 Inline) */
        .jd-block-tag-btn:hover {
            transform: scale(1.2);
            opacity: 1 !important;
        }
        body.jd-hide-quick-block .jd-block-tag-btn { display: none !important; }

        /* 懸浮控制區容器 */
        #jd-wrapper {
            position: fixed; bottom: 30px; right: 30px; z-index: 20000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
            pointer-events: none;
        }

        #jd-wrapper > * {
            pointer-events: auto;
        }

        /* 底部操作列 */
        #jd-action-row {
            display: flex; align-items: center; justify-content: flex-end; gap: 12px;
            height: 52px;
        }

        /* 通用圓形按鈕 */
        .jd-round-btn {
            width: 52px; height: 52px;
            background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 0 6px 16px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1);
            border: 1px solid #444; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); color: #ddd;
            flex-shrink: 0; position: relative; z-index: 10;
        }
        .jd-round-btn:hover {
            transform: scale(1.05); background: linear-gradient(135deg, #0066cc, #004499);
            border-color: #0077ff; color: white; box-shadow: 0 8px 20px rgba(0, 102, 204, 0.4);
        }
        .jd-round-btn svg { width: 24px; height: 24px; fill: currentColor; transition: transform 0.5s ease; }
        #jd-gear-btn:hover svg { transform: rotate(90deg); }

        /* 懸浮搜索欄 */
        #jd-floating-search-bar {
            height: 52px;
            width: 0;
            opacity: 0;
            overflow: hidden;
            background: rgba(30, 30, 30, 0.98);
            backdrop-filter: blur(10px);
            border-radius: 26px;
            display: flex;
            align-items: center;
            transition: width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease, padding 0.3s ease;
            padding: 0;
            border: 0px solid #444;
            white-space: nowrap;
            margin-right: -26px;
            padding-right: 30px;
            z-index: 1;
        }

        #jd-floating-search-bar.active {
            width: 540px;
            opacity: 1;
            padding: 0 10px 0 15px;
            border: 1px solid #555;
            margin-right: 10px;
            padding-right: 10px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.5);
        }

        /* 搜尋欄內部表單 */
        #jd-search-form {
            display: flex !important; gap: 8px !important; height: 100% !important; align-items: center !important;
            width: 100% !important; min-width: 520px !important; margin: 0 !important; padding: 0 !important;
            visibility: visible !important; opacity: 1 !important;
        }

        #jd-search-select {
            display: block !important; visibility: visible !important; opacity: 1 !important;
            background: #222 !important; color: #fff !important; border: 1px solid #555 !important;
            border-radius: 20px !important; padding: 0 10px !important; font-size: 13px !important;
            width: auto !important; min-width: 75px !important; height: 36px !important;
            outline: none !important; flex-shrink: 0 !important; cursor: pointer !important;
        }

        #jd-search-input {
            display: block !important; visibility: visible !important; opacity: 1 !important;
            flex: 1 !important; background: #222 !important; color: #fff !important;
            border: 1px solid #555 !important; border-radius: 20px !important;
            padding: 0 15px !important; font-size: 14px !important; height: 36px !important;
            min-width: 100px !important;
        }
        #jd-search-input:focus { outline: none; border-color: #0066cc !important; }

        .jd-search-icon-btn {
            display: flex !important; align-items: center !important; justify-content: center !important;
            visibility: visible !important; opacity: 1 !important; background: transparent !important;
            border: 1px solid #555 !important; color: #ccc !important; width: 36px !important;
            height: 36px !important; cursor: pointer !important; border-radius: 50% !important;
            transition: 0.2s !important; flex-shrink: 0 !important;
        }
        .jd-search-icon-btn:hover { background: #444 !important; color: #fff !important; border-color: #0066cc !important; }
        .jd-search-icon-btn svg { width: 18px !important; height: 18px !important; fill: currentColor !important; display: block !important; }

        /* 設定面板 */
        #jd-panel {
            position: absolute; bottom: 70px; right: 0; width: 300px;
            background: rgba(26, 26, 26, 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border-radius: 12px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.6);
            border: 1px solid #444; display: none; flex-direction: column; gap: 18px;
            opacity: 0; transform: translateY(15px); transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 19999;
        }
        #jd-panel.active { display: flex; opacity: 1; transform: translateY(0); }

        .jd-row { display: flex; justify-content: space-between; align-items: center; color: #eee; font-size: 14px; }
        .jd-label { font-weight: 500; color: #ccc; }
        .jd-status-bar { font-size: 13px; color: #aaa; text-align: center; padding-top: 10px; border-top: 1px solid #444; margin-top: 5px; line-height: 1.6; }
        .jd-status-btn { color: #fff; cursor: pointer; padding: 2px 6px; border-radius: 4px; transition: background 0.2s; text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 3px; }
        .jd-status-btn:hover { background: #0066cc; color: white; text-decoration: none; }
        .jd-input-num { width: 50px; background: #111; border: 1px solid #444; color: #fff; border-radius: 6px; padding: 5px; text-align: center; font-size: 14px; }
        .jd-btn { background: #333; border: 1px solid #555; color: #fff; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; transition: background 0.2s; }
        .jd-btn:hover { background: #0066cc; border-color: #0077ff; }

        /* 文字過濾設定視窗 */
        #jd-tag-panel {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 320px; background: #1a1a1a; border: 1px solid #444; border-radius: 10px;
            padding: 20px; z-index: 20001; display: none; box-shadow: 0 10px 40px rgba(0,0,0,0.8);
            flex-direction: column; gap: 10px;
        }
        #jd-tag-panel.active { display: flex; }
        #jd-tag-panel h3 { margin: 0 0 5px 0; color: #fff; font-size: 16px; text-align: center; display: none; }
        #jd-tag-panel p { margin: 0; color: #aaa; font-size: 12px; text-align: center; }
        #jd-tag-input { width: 100%; height: 100px; background: #111; border: 1px solid #444; color: #eee; padding: 10px; border-radius: 6px; resize: vertical; font-size: 14px; }
        #jd-tag-input:focus { outline: none; border-color: #0066cc; }
        .jd-tag-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 5px; }

        .jd-slider { -webkit-appearance: none; width: 100px; height: 4px; background: #444; border-radius: 2px; outline: none; }
        .jd-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #0066cc; cursor: pointer; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .jd-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .jd-switch input { opacity: 0; width: 0; height: 0; }
        .jd-slider-switch { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444; transition: .3s; border-radius: 24px; }
        .jd-slider-switch:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        input:checked + .jd-slider-switch { background-color: #0066cc; }
        input:checked + .jd-slider-switch:before { transform: translateX(20px); }
        .jd-val-display { font-size: 13px; color: #aaa; min-width: 35px; text-align: right; font-variant-numeric: tabular-nums; }

        /* Modal 樣式 */
        #jd-modal-overlay, #jd-filtered-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.7); z-index: 10000; display: none;
            justify-content: center; align-items: center; opacity: 0; transition: opacity 0.2s ease;
        }
        #jd-modal-overlay.active, #jd-filtered-modal-overlay.active { display: flex; opacity: 1; }

        #jd-modal-content, #jd-filtered-modal-content {
            background: #ffffff; width: 90%; max-width: 1200px; height: 90%;
            border-radius: 8px; position: relative;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3); color: #333333;
            display: flex; flex-direction: column; overflow: hidden; padding: 0;
        }
        #jd-filtered-modal-content { width: 85%; max-width: 1100px; height: 85%; }

        #jd-modal-toolbar, #jd-filtered-modal-header {
            flex: 0 0 auto; height: 44px; background: rgba(255, 255, 255, 0.98);
            border-bottom: 1px solid #eaeaea; display: flex; align-items: center;
            justify-content: space-between; padding: 0 15px; z-index: 100;
        }
        #jd-modal-body, #jd-filtered-modal-body { flex: 1 1 auto; overflow: hidden; position: relative; padding: 0; }
        #jd-filtered-modal-body { overflow-y: auto; padding: 25px; }
        #jd-modal-iframe { width: 100%; height: 100%; border: none; display: block; }

        #jd-modal-close, #jd-filtered-modal-close {
            width: 32px; height: 32px; cursor: pointer; color: #ff4444;
            transition: transform 0.2s, color 0.2s; display: flex; align-items: center; justify-content: center;
        }
        #jd-filtered-modal-close { font-size: 24px; color: #999; line-height: 1; width: auto; height: auto; }
        #jd-modal-close:hover { transform: scale(1.1); color: #d50000; }
        #jd-filtered-modal-close:hover { color: #333; }
        #jd-modal-close svg { width: 24px; height: 24px; fill: currentColor; }

        #jd-modal-back {
            width: 32px; height: 32px; cursor: pointer; color: #2ecc71;
            transition: transform 0.2s, color 0.2s; display: flex;
            align-items: center; justify-content: center;
        }
        #jd-modal-back:hover { transform: scale(1.1); color: #27ae60; }
        #jd-modal-back svg { width: 24px; height: 24px; fill: currentColor; }

        .jd-group-header {
            background: #f5f5f5; color: #333; padding: 10px 15px;
            font-weight: bold; cursor: pointer; border-radius: 4px;
            margin-bottom: 10px; display: flex; justify-content: space-between;
            align-items: center; border-left: 5px solid #0066cc;
        }
        .jd-group-header:hover { background: #e8e8e8; }
        .jd-group-header span { font-size: 12px; color: #666; transition: transform 0.2s; }
        .jd-group-header.collapsed span { transform: rotate(-90deg); }
        .jd-group-content { margin-bottom: 20px; overflow: hidden; transition: max-height 0.3s ease-out; }
        .jd-group-content.collapsed { display: none; }
        .jd-hidden-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 15px; width: 100%; }
        @media (max-width: 768px) { .jd-hidden-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

        .jd-loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; padding: 30px; font-size: 16px; color: #888; }
        .jd-hidden-item-container { padding-bottom: 50px; }
        .jd-hidden-item-container a { color: #0066cc; }
        .jd-hidden-item-container img { max-width: 100%; border-radius: 4px; }

        .jd-translated-title { font-size: 1.5rem; font-weight: bold; color: #111; margin-top: 10px; padding: 5px 0; border-top: 1px dashed #eee; line-height: 1.4; }

        /* 字幕搜尋結果相關 */
        .jd-sub-result-group { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
        .jd-sub-result-group h3 { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #333; }
        .jd-sub-list { list-style: none; padding: 0; margin: 0; }
        .jd-sub-list li { margin-bottom: 8px; }
        .jd-sub-list a { display: block; padding: 8px 12px; background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 4px; color: #0066cc; text-decoration: none; transition: background 0.2s; }
        .jd-sub-list a:hover { background: #eef6fc; border-color: #2196f3; }
        .jd-sub-list .tag { display: inline-block; padding: 2px 6px; font-size: 12px; color: #666; background: #eee; border-radius: 3px; margin-right: 8px; }
        .jd-sub-empty { color: #999; font-size: 14px; padding: 10px 0; }

        /* 字幕搜尋按鈕 (純文字樣式) */
        .jd-btn-subtitle {
            background-color: #ffdd57 !important; color: #333 !important; border-color: #ffcc00 !important;
            margin-left: 5px; /* 與其他按鈕的間距 */
        }
        .jd-btn-subtitle:hover { background-color: #ffc107 !important; }
    `;

    GM_addStyle(styles);

    // --- 核心工具 ---
    function findMainContainer(doc = document) {
        const firstItem = doc.querySelector('.movie-list .item, .grid .item');
        if (firstItem) return firstItem.parentElement;
        const candidates = ['.grid-cols-2', '.grid-cols-3', '.grid-cols-4', '.grid-cols-5', '#videos .grid', '.section .grid', '.movie-list'];
        for (let selector of candidates) { const el = doc.querySelector(selector); if (el) return el; }
        return null;
    }

    function getHiddenTagsArray() {
        return state.config.hiddenTags.split('/').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function addTagToFilter(tag) {
        const currentTags = getHiddenTagsArray();
        if (!currentTags.includes(tag)) {
            currentTags.push(tag);
            const newStr = currentTags.join('/');
            state.config.hiddenTags = newStr; localStorage.setItem('jd_tags', newStr);
            const tagInput = document.getElementById('jd-tag-input'); if (tagInput) tagInput.value = newStr;
            filterItems();
            const btn = document.createElement('div');
            btn.style.position = 'fixed'; btn.style.bottom = '20px'; btn.style.left = '50%';
            btn.style.transform = 'translateX(-50%)'; btn.style.background = 'rgba(0,0,0,0.8)';
            btn.style.color = 'white'; btn.style.padding = '10px 20px'; btn.style.borderRadius = '5px';
            btn.style.zIndex = '20002'; btn.innerText = `已將「${tag}」加入過濾清單`;
            document.body.appendChild(btn); setTimeout(() => btn.remove(), 2000);
        }
    }

    function translateText(text) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-TW&dt=t&q=" + encodeURIComponent(text),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        let translatedText = "";
                        if (data && data[0]) {
                            data[0].forEach(item => { if (item[0]) translatedText += item[0]; });
                        }
                        resolve(translatedText);
                    } catch (e) { reject(e); }
                },
                onerror: function(err) { reject(err); }
            });
        });
    }

    // --- 字幕搜尋相關函式 ---
    function searchSubtitles(code) {
        // 開啟搜尋結果 Modal
        const modal = document.getElementById('jd-filtered-modal-overlay');
        const container = document.getElementById('jd-filtered-modal-body');
        const title = document.getElementById('jd-filtered-modal-header').querySelector('span');

        title.innerText = `字幕搜尋: ${code}`;
        container.innerHTML = '<div class="jd-loading">正在搜尋字幕...</div>';
        modal.classList.add('active');

        // 建立結果容器
        const resultsHtml = `
            <div class="jd-sub-result-group" id="jd-sub-javzimu">
                <h3>JavZimu</h3>
                <div class="content">搜尋中...</div>
            </div>
            <div class="jd-sub-result-group" id="jd-sub-subcat">
                <h3>SubtitleCat</h3>
                <div class="content">搜尋中...</div>
            </div>
        `;
        container.innerHTML = resultsHtml;

        // 執行搜尋
        fetchJavZimu(code);
        fetchSubtitleCat(code);
    }

    function fetchJavZimu(code) {
        const container = document.querySelector('#jd-sub-javzimu .content');
        const searchUrl = `https://javzimu.com/tw/search/${code}`;
        // v3.97: 改為不抓取，直接顯示連結按鈕
        container.innerHTML = `<a href="${searchUrl}" target="_blank" class="button is-warning" style="width:100%; font-weight:bold;">前往 JavZimu 搜尋</a>`;
    }

    function fetchSubtitleCat(code) {
        const container = document.querySelector('#jd-sub-subcat .content');
        const searchUrl = `https://subtitlecat.com/index.php?search=${code}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: searchUrl,
            onload: function(response) {
                if (response.status === 200) {
                     const parser = new DOMParser();
                     const doc = parser.parseFromString(response.responseText, "text/html");
                     // SubtitleCat 通常是 table
                     const rows = doc.querySelectorAll('table tbody tr');

                     if (rows.length > 0) {
                         let html = '<ul class="jd-sub-list">';
                         let count = 0;
                         rows.forEach(row => {
                             const linkEl = row.querySelector('a');
                             if (linkEl && count < 10) { // 限制顯示數量
                                 const title = linkEl.innerText.trim();
                                 // v3.97: 增加過濾邏輯，只顯示包含搜尋代碼的結果 (不區分大小寫)
                                 if (!title.toLowerCase().includes(code.toLowerCase())) return;

                                 // 修正：確保連結正確 (SubtitleCat 連結常為相對路徑)
                                 let link = linkEl.getAttribute('href');
                                 if (link && !link.startsWith('http')) {
                                     // 移除開頭的 ./ 或 /
                                     link = link.replace(/^(\.\/|\/)/, '');
                                     link = `https://subtitlecat.com/${link}`;
                                 }

                                 html += `<li><a href="${link}" target="_blank"><span class="tag">SubCat</span>${title}</a></li>`;
                                 count++;
                             }
                         });
                         html += '</ul>';
                         if (count === 0) {
                             container.innerHTML = `<div class="jd-sub-empty">未找到包含 "${code}" 的結果，<a href="${searchUrl}" target="_blank">前往網站確認</a></div>`;
                         } else {
                             container.innerHTML = html;
                         }
                     } else {
                         container.innerHTML = `<div class="jd-sub-empty">未找到結果，<a href="${searchUrl}" target="_blank">前往網站確認</a></div>`;
                     }
                } else {
                    container.innerHTML = `<a href="${searchUrl}" target="_blank" class="button is-small is-warning">前往 SubtitleCat 搜尋</a>`;
                }
            },
             onerror: function() {
                container.innerHTML = `<a href="${searchUrl}" target="_blank" class="button is-small is-warning">前往 SubtitleCat 搜尋</a>`;
            }
        });
    }

    function toggleQuickBlock(show) {
        if (show) document.body.classList.remove('jd-hide-quick-block');
        else document.body.classList.add('jd-hide-quick-block');

        const iframe = document.getElementById('jd-modal-iframe');
        if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
            if (show) iframe.contentDocument.body.classList.remove('jd-hide-quick-block');
            else iframe.contentDocument.body.classList.add('jd-hide-quick-block');
        }
    }

    function toggleSearchBar(hide) {
        if (hide) {
            document.body.classList.add('jd-hide-search');
        } else {
            document.body.classList.remove('jd-hide-search');
        }

        const searchInputs = document.querySelectorAll('form input[name="q"]');
        searchInputs.forEach(input => {
            const form = input.closest('form');
            if (!form) return;

            let target = null;
            const navItem = form.closest('.navbar-item');
            if (navItem) target = navItem;
            else {
                let parent = form.parentElement;
                while (parent && parent.tagName !== 'BODY') {
                    if (parent.classList.contains('section') || parent.classList.contains('hero') || parent.tagName === 'SECTION') {
                        const hasContent = parent.querySelector('.movie-list') ||
                                           parent.querySelector('.grid-cols-2') ||
                                           parent.querySelector('.grid-cols-4') ||
                                           parent.querySelector('.video-meta-panel') ||
                                           parent.id === 'videos';
                        if (!hasContent) target = parent;
                        else parent.classList.toggle('jd-collapsed', hide);
                        break;
                    }
                    parent = parent.parentElement;
                }
            }

            if (!target || !hide) {
                form.classList.toggle('jd-search-hidden', hide);
                let sibling = form.nextElementSibling;
                while(sibling) {
                    if (sibling.classList.contains('tags') || sibling.tagName === 'DIV' || sibling.tagName === 'P') {
                        sibling.classList.toggle('jd-search-hidden', hide);
                    }
                    sibling = sibling.nextElementSibling;
                }
            }

            if (target) target.classList.toggle('jd-search-hidden', hide);
        });
    }

    // 切換懸浮搜尋欄 (展開/收起)
    function toggleFloatingSearch(show) {
        const btn = document.getElementById('jd-search-btn');
        const bar = document.getElementById('jd-floating-search-bar');
        if (show) {
            if (btn) btn.style.display = 'flex';
        } else {
            if (btn) btn.style.display = 'none';
            if (bar) bar.classList.remove('active');
        }
    }

    function isMatch(text, tag) {
        if (!tag) return false;
        if (/[^\u0000-\u007f]/.test(tag)) {
            return text.includes(tag);
        } else {
            try {
                const regex = new RegExp(`\\b${escapeRegExp(tag)}\\b`, 'i');
                return regex.test(text);
            } catch (e) {
                return text.includes(tag);
            }
        }
    }

    function processContainerItems(container) {
        const items = container.querySelectorAll('.item');
        const minRating = state.config.minRating;
        const hiddenTags = getHiddenTagsArray();

        let localRatingCount = 0;
        let localTextCount = 0;

        items.forEach(item => {
            let isVisible = true;
            let hiddenReason = null;
            let hiddenMeta = null;

            let itemText = item.textContent.toLowerCase();
            item.querySelectorAll('[title]').forEach(el => itemText += ' ' + (el.getAttribute('title') || '').toLowerCase());
            item.querySelectorAll('[alt]').forEach(el => itemText += ' ' + (el.getAttribute('alt') || '').toLowerCase());
            item.querySelectorAll('img[data-original]').forEach(el => itemText += ' ' + (el.getAttribute('data-original') || '').toLowerCase());

            if (minRating > 0) {
                const match = itemText.match(/(\d+\.\d+)分/);
                if (match) {
                    const score = parseFloat(match[1]);
                    if (score < minRating) {
                        isVisible = false; hiddenReason = 'rating'; hiddenMeta = score;
                    }
                }
            }

            if (isVisible && hiddenTags.length > 0) {
                const matchedTag = hiddenTags.find(tag => isMatch(itemText, tag.toLowerCase()));
                if (matchedTag) {
                    isVisible = false;
                    hiddenReason = 'text';
                    hiddenMeta = matchedTag;
                }
            }

            if (!isVisible) {
                const clone = document.importNode(item, true);
                clone.style.display = '';
                clone.querySelectorAll('img').forEach(img => {
                    if(img.dataset.src) img.src = img.dataset.src;
                    if(img.dataset.original) img.src = img.dataset.original;
                    img.style.opacity = 1;
                });

                if (hiddenReason === 'rating') {
                    state.hiddenItems.rating.push({ item: clone, score: hiddenMeta });
                    localRatingCount++;
                } else if (hiddenReason === 'text') {
                    state.hiddenItems.text.push({ item: clone, tag: hiddenMeta });
                    localTextCount++;
                }
            }
            item.style.display = isVisible ? '' : 'none';
        });
        return { r: localRatingCount, t: localTextCount };
    }

    function filterItems() {
        state.hiddenItems.rating = [];
        state.hiddenItems.text = [];
        let totalRating = 0;
        let totalText = 0;

        if (!state.mainContainer) state.mainContainer = findMainContainer();
        if (state.mainContainer) {
            state.mainContainer.id = 'jd-main-grid';
            const res = processContainerItems(state.mainContainer);
            totalRating += res.r;
            totalText += res.t;
        }

        const iframe = document.getElementById('jd-modal-iframe');
        if (iframe && iframe.contentDocument) {
            const iframeContainer = findMainContainer(iframe.contentDocument);
            if (iframeContainer) {
                iframeContainer.classList.add('jd-main-grid');
                const res = processContainerItems(iframeContainer);
                totalRating += res.r;
                totalText += res.t;
            }
        }

        state.hiddenByRatingCount = totalRating;
        state.hiddenByTextCount = totalText;
        updateStatusBar();
    }

    function updateStatusBar() {
        const statusBar = document.getElementById('jd-status-bar');
        if (statusBar) {
            statusBar.innerHTML = `
                已隱藏：
                <span id="jd-btn-show-rating" class="jd-status-btn" title="點擊檢視因評分隱藏的影片">評分: ${state.hiddenByRatingCount}</span>
                /
                <span id="jd-btn-show-text" class="jd-status-btn" title="點擊檢視因文字隱藏的影片">文字: ${state.hiddenByTextCount}</span>
            `;
            document.getElementById('jd-btn-show-rating').onclick = (e) => { e.stopPropagation(); openHiddenItemsModal('rating'); };
            document.getElementById('jd-btn-show-text').onclick = (e) => { e.stopPropagation(); openHiddenItemsModal('text'); };
        }
    }

    function openHiddenItemsModal(type) {
        const modal = document.getElementById('jd-filtered-modal-overlay');
        const container = document.getElementById('jd-filtered-modal-body');
        const title = document.getElementById('jd-filtered-modal-header').querySelector('span');

        const titleText = type === 'rating' ? '因評分過低隱藏的影片' : '因文字過濾隱藏的影片';
        const itemsData = type === 'rating' ? state.hiddenItems.rating : state.hiddenItems.text;

        title.innerText = titleText;
        container.innerHTML = '';

        if (itemsData.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:#666;">沒有相關項目</div>';
            modal.classList.add('active');
            return;
        }

        const groups = {};
        if (type === 'rating') {
            // v3.86: 調整評分分組 (細分)
            const ranges = ['4.1-5.0', '3.1-4.0', '2.1-3.0', '1.1-2.0', '0.1-1.0', '0'];
            ranges.forEach(r => groups[r] = []);
            itemsData.forEach(data => {
                const s = data.score;
                let key = '0';
                if (s > 4.0) key = '4.1-5.0';
                else if (s > 3.0) key = '3.1-4.0';
                else if (s > 2.0) key = '2.1-3.0';
                else if (s > 1.0) key = '1.1-2.0';
                else if (s > 0) key = '0.1-1.0';
                if (groups[key]) groups[key].push(data.item);
            });
        } else {
            itemsData.forEach(data => {
                const tag = data.tag || '其他';
                if (!groups[tag]) groups[tag] = [];
                groups[tag].push(data.item);
            });
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'jd-hidden-item-container';

        Object.keys(groups).forEach(groupName => {
            const items = groups[groupName];
            if (items.length === 0) return;

            const groupDiv = document.createElement('div');
            groupDiv.className = 'jd-hidden-group';

            const header = document.createElement('div');
            header.className = 'jd-group-header';
            header.innerHTML = `${groupName} (${items.length}) <span>▼</span>`;

            const content = document.createElement('div');
            content.className = 'jd-group-content';

            const grid = document.createElement('div');
            grid.className = 'jd-hidden-grid';
            items.forEach(item => {
                item.querySelector('a').onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    openModal(item.querySelector('a').href, false, true);
                };
                grid.appendChild(item);
            });

            content.appendChild(grid);
            groupDiv.appendChild(header);
            groupDiv.appendChild(content);
            wrapper.appendChild(groupDiv);

            header.onclick = () => {
                content.classList.toggle('collapsed');
                header.classList.toggle('collapsed');
            };
        });

        container.appendChild(wrapper);
        modal.classList.add('active');
    }

    // --- 初始化 UI ---
    function initUI() {
        const wrapper = document.createElement('div');
        wrapper.id = 'jd-wrapper';
        wrapper.innerHTML = `
            <div id="jd-panel">
                <div class="jd-row"><span class="jd-label">每行數量</span><input type="number" id="jd-input-cols" class="jd-input-num" min="1" max="10" value="${state.config.cols}"></div>
                <div class="jd-row"><span class="jd-label">懸浮視窗</span><label class="jd-switch"><input type="checkbox" id="jd-switch-modal" ${state.config.modalPreview ? 'checked' : ''}><span class="jd-slider-switch"></span></label></div>
                <div class="jd-row"><span class="jd-label">標題翻譯</span><label class="jd-switch"><input type="checkbox" id="jd-switch-translate" ${state.config.translateTitle ? 'checked' : ''}><span class="jd-slider-switch"></span></label></div>
                <div class="jd-row"><span class="jd-label">無縫瀏覽</span><label class="jd-switch"><input type="checkbox" id="jd-switch-scroll" ${state.config.infiniteScroll ? 'checked' : ''}><span class="jd-slider-switch"></span></label></div>
                <div class="jd-row"><span class="jd-label">兩側留白</span><div style="display:flex; align-items:center; gap:8px;"><input type="range" id="jd-input-margin" class="jd-slider" min="0" max="20" step="1" value="${state.config.margin}"><span id="jd-val-margin" class="jd-val-display" style="width:35px;">${state.config.margin}%</span></div></div>
                <div class="jd-row"><span class="jd-label">評分過濾</span><div style="display:flex; align-items:center; gap:8px;"><input type="range" id="jd-input-rating" class="jd-slider" min="0" max="5" step="0.1" value="${state.config.minRating}"><span id="jd-val-rating" class="jd-val-display" style="width:30px;">${state.config.minRating}</span></div></div>
                <div class="jd-row"><span class="jd-label">文字過濾</span><button id="jd-btn-edit-tags" class="jd-btn">編輯過濾文字</button></div>
                <div class="jd-row"><span class="jd-label">快速過濾</span><label class="jd-switch"><input type="checkbox" id="jd-switch-quickblock" ${state.config.showQuickBlock ? 'checked' : ''}><span class="jd-slider-switch"></span></label></div>
                <div class="jd-row"><span class="jd-label">隱藏搜索</span><label class="jd-switch"><input type="checkbox" id="jd-switch-hidesearch" ${state.config.hideSearchBar ? 'checked' : ''}><span class="jd-slider-switch"></span></label></div>
                <div class="jd-row"><span class="jd-label">懸浮搜索</span><label class="jd-switch"><input type="checkbox" id="jd-switch-floating" ${state.config.floatingSearch ? 'checked' : ''}><span class="jd-slider-switch"></span></label></div>
                <div class="jd-row"><span class="jd-label">字幕搜尋</span><label class="jd-switch"><input type="checkbox" id="jd-switch-subtitle" ${state.config.subtitleSearch ? 'checked' : ''}><span class="jd-slider-switch"></span></label></div>
                <div id="jd-status-bar" class="jd-status-bar"></div>
            </div>

            <div id="jd-action-row">
                <div id="jd-floating-search-bar">
                    <form action="/search" method="get" id="jd-search-form" target="_blank">
                        <div style="flex: 0 0 75px;">
                             <select name="f" id="jd-search-select">
                                 <option value="1">影片</option>
                                 <option value="actor">演員</option>
                                 <option value="code">番號</option>
                                 <option value="series">系列</option>
                                 <option value="maker">片商</option>
                                 <option value="director">導演</option>
                                 <option value="playable">可播放</option>
                                 <option value="sub">字幕</option>
                             </select>
                        </div>
                        <input type="text" name="q" id="jd-search-input" placeholder="搜尋番號、演員..." autocomplete="off">
                        <div class="jd-search-icon-btn" id="jd-img-search-btn" title="以圖搜片">
                            <svg viewBox="0 0 24 24"><path d="M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
                        </div>
                        <button type="submit" class="jd-search-icon-btn" title="搜尋">
                             <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                        </button>
                        <a href="https://javdb.com/advanced_search" target="_blank" class="jd-search-icon-btn" title="進階搜尋" id="jd-adv-search-btn">
                             <svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
                        </a>
                    </form>
                     <form action="/search_by_image" method="post" enctype="multipart/form-data" target="_blank" id="jd-img-form" style="display:none;">
                        <input type="file" name="file" id="jd-file-input" accept="image/*">
                    </form>
                </div>
                <div id="jd-search-btn" class="jd-round-btn" style="display: none;">
                    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                </div>
                <div id="jd-gear-btn" class="jd-round-btn">
                    <svg viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
                </div>
            </div>
        `;
        document.body.appendChild(wrapper);

        const tagPanel = document.createElement('div');
        tagPanel.id = 'jd-tag-panel';
        tagPanel.innerHTML = `<p>輸入欲隱藏的文字，使用 / 分隔</p><textarea id="jd-tag-input" placeholder="例如: VR/歐美/重口味"></textarea><div class="jd-tag-actions"><button id="jd-tag-cancel" class="jd-btn" style="background:#555;">取消</button><button id="jd-tag-save" class="jd-btn" style="background:#0066cc;">儲存</button></div>`;
        document.body.appendChild(tagPanel);

        // 3. 詳情 Modal
        const modal = document.createElement('div');
        modal.id = 'jd-modal-overlay';
        modal.innerHTML = `<div id="jd-modal-content"><div id="jd-modal-toolbar"><div id="jd-modal-back" title="上一頁"><svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></div><div style="flex:1;"></div><div id="jd-modal-close" title="關閉"><svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></div></div><div id="jd-modal-body"></div></div>`;
        document.body.appendChild(modal);

        // 4. 過濾列表 Modal
        const filteredModal = document.createElement('div');
        filteredModal.id = 'jd-filtered-modal-overlay';
        filteredModal.innerHTML = `<div id="jd-filtered-modal-content"><div id="jd-filtered-modal-header"><span id="jd-filtered-title"></span><div id="jd-filtered-modal-close">×</div></div><div id="jd-filtered-modal-body"></div></div>`;
        document.body.appendChild(filteredModal);

        const closeFiltered = () => filteredModal.classList.remove('active');
        filteredModal.addEventListener('click', (e) => { if (e.target === filteredModal) closeFiltered(); });
        document.getElementById('jd-filtered-modal-close').addEventListener('click', closeFiltered);

        bindSettingsEvents(tagPanel, modal);

        document.documentElement.style.setProperty('--jd-cols', state.config.cols);
        document.documentElement.style.setProperty('--jd-margin', state.config.margin + '%');

        setTimeout(() => {
            state.mainContainer = findMainContainer();
            if (state.mainContainer) {
                state.mainContainer.id = 'jd-main-grid';
                filterItems();
            }
            toggleQuickBlock(state.config.showQuickBlock);
            toggleSearchBar(state.config.hideSearchBar);
            toggleFloatingSearch(state.config.floatingSearch);
            updateStatusBar();

            state.searchObserver = new MutationObserver(() => {
                if (state.config.hideSearchBar) toggleSearchBar(true);
            });
            state.searchObserver.observe(document.body, { childList: true, subtree: true });
        }, 500);

        document.body.addEventListener('click', (e) => {
            if (!state.config.modalPreview) return;

            const target = e.target;
            const link = target.closest('a');

            if (!link || !link.closest('.item')) return;

            if (link.hasAttribute('data-method') ||
                link.hasAttribute('data-confirm') ||
                link.classList.contains('button')) {
                return;
            }

            const text = link.innerText.trim();
            if (['刪除', 'Delete', '訂正', 'Edit'].some(key => text.includes(key))) return;

            if (link.href.includes('/v/') && !link.closest('#jd-panel') && !link.closest('.jd-hidden-group') && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
                e.preventDefault();
                e.stopPropagation();
                openModal(link.href, false, true);
            }
        });
    }

    function bindSettingsEvents(tagPanel, modal) {
        const gearBtn = document.getElementById('jd-gear-btn');
        const searchBtn = document.getElementById('jd-search-btn');
        const panel = document.getElementById('jd-panel');
        const searchBar = document.getElementById('jd-floating-search-bar');
        const tagInput = document.getElementById('jd-tag-input');

        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active')) {
                document.getElementById('jd-search-input').focus();
            }
        });

        document.getElementById('jd-search-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const q = document.getElementById('jd-search-input').value;
            const f = document.getElementById('jd-search-select').value;
            if (q.trim()) {
                const url = `${window.location.origin}/search?q=${encodeURIComponent(q)}&f=${f}`;
                GM_openInTab(url, { active: false, insert: true });
                searchBar.classList.remove('active');
            }
        });

        document.getElementById('jd-img-search-btn').addEventListener('click', () => {
            document.getElementById('jd-file-input').click();
        });
        document.getElementById('jd-file-input').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                document.getElementById('jd-img-form').submit();
                searchBar.classList.remove('active');
                setTimeout(() => { e.target.value = ''; }, 1000);
            }
        });

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target) && panel.classList.contains('active') && !tagPanel.contains(e.target)) {
                panel.classList.remove('active'); setTimeout(() => panel.style.display = 'none', 300);
            }
            if (!wrapper.contains(e.target) && searchBar.classList.contains('active')) {
                searchBar.classList.remove('active');
            }
        });

        gearBtn.addEventListener('click', (e) => { e.stopPropagation(); const isActive = panel.classList.contains('active'); if (isActive) { panel.classList.remove('active'); setTimeout(() => panel.style.display = 'none', 300); } else { panel.style.display = 'flex'; requestAnimationFrame(() => panel.classList.add('active')); } });
        document.getElementById('jd-input-cols').addEventListener('change', (e) => { const val = parseInt(e.target.value); if (val >= 1 && val <= 10) { state.config.cols = val; localStorage.setItem('jd_cols', val); document.documentElement.style.setProperty('--jd-cols', val); const iframe = document.getElementById('jd-modal-iframe'); if (iframe && iframe.contentDocument) iframe.contentDocument.documentElement.style.setProperty('--jd-cols', val); } });
        document.getElementById('jd-switch-hidesearch').addEventListener('change', (e) => { state.config.hideSearchBar = e.target.checked; localStorage.setItem('jd_hide_search', e.target.checked); toggleSearchBar(e.target.checked); });
        document.getElementById('jd-switch-scroll').addEventListener('change', (e) => { state.config.infiniteScroll = e.target.checked; localStorage.setItem('jd_infinite', e.target.checked); });
        document.getElementById('jd-switch-modal').addEventListener('change', (e) => { state.config.modalPreview = e.target.checked; localStorage.setItem('jd_modal', e.target.checked); });
        document.getElementById('jd-switch-translate').addEventListener('change', (e) => { state.config.translateTitle = e.target.checked; localStorage.setItem('jd_translate_title', e.target.checked); });
        document.getElementById('jd-input-margin').addEventListener('input', (e) => { const val = e.target.value; state.config.margin = val; localStorage.setItem('jd_margin', val); document.documentElement.style.setProperty('--jd-margin', val + '%'); document.getElementById('jd-val-margin').textContent = val + '%'; const iframe = document.getElementById('jd-modal-iframe'); if (iframe && iframe.contentDocument) iframe.contentDocument.documentElement.style.setProperty('--jd-margin', val + '%'); });
        document.getElementById('jd-switch-quickblock').addEventListener('change', (e) => { state.config.showQuickBlock = e.target.checked; localStorage.setItem('jd_quick_block', e.target.checked); toggleQuickBlock(e.target.checked); });
        document.getElementById('jd-switch-floating').addEventListener('change', (e) => { state.config.floatingSearch = e.target.checked; localStorage.setItem('jd_floating_search', e.target.checked); toggleFloatingSearch(e.target.checked); });
        
        // --- 補上遺漏的字幕搜尋事件監聽器 ---
        document.getElementById('jd-switch-subtitle').addEventListener('change', (e) => { state.config.subtitleSearch = e.target.checked; localStorage.setItem('jd_subtitle_search', e.target.checked); });
        // --------------------------------

        document.getElementById('jd-input-rating').addEventListener('input', (e) => { const val = parseFloat(e.target.value); state.config.minRating = val; document.getElementById('jd-val-rating').innerText = val; localStorage.setItem('jd_rating', val); filterItems(); });
        document.getElementById('jd-btn-edit-tags').addEventListener('click', (e) => { e.stopPropagation(); panel.classList.remove('active'); setTimeout(() => panel.style.display = 'none', 300); tagInput.value = state.config.hiddenTags; tagPanel.classList.add('active'); tagInput.focus(); });
        document.getElementById('jd-tag-save').addEventListener('click', () => { state.config.hiddenTags = tagInput.value; localStorage.setItem('jd_tags', tagInput.value); tagPanel.classList.remove('active'); filterItems(); });
        document.getElementById('jd-tag-cancel').addEventListener('click', () => tagPanel.classList.remove('active'));
        const closeModalFunc = () => { modal.classList.remove('active'); state.modalHistory = []; state.currentModalUrl = null; state.activeMovieUrl = null; document.getElementById('jd-modal-back').style.display = 'none'; setTimeout(() => document.getElementById('jd-modal-body').innerHTML = '', 200); };
        const backModalFunc = () => {
            if (state.modalHistory.length > 0) {
                const prevUrl = state.modalHistory.pop();
                openModal(prevUrl, true, false);
            }
        };

        modal.addEventListener('click', (e) => { if (e.target === modal) closeModalFunc(); });
        document.getElementById('jd-modal-close').addEventListener('click', closeModalFunc);
        document.getElementById('jd-modal-back').addEventListener('click', backModalFunc);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModalFunc(); });
    }

    function initInfiniteScroll() {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;
        const nextLink = pagination.querySelector('a[rel="next"]');
        if (nextLink) state.nextPageUrl = nextLink.href;
        if (state.config.infiniteScroll && document.documentElement.scrollHeight <= window.innerHeight + 200) loadNextPage();
        window.addEventListener('scroll', () => {
            if (!state.config.infiniteScroll) return;
            if (state.isLoading || !state.nextPageUrl) return;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const clientHeight = window.innerHeight;
            if (scrollTop + clientHeight >= document.documentElement.scrollHeight - DEFAULTS.triggerDistance) loadNextPage();
        });
    }

    function loadNextPage() {
        if (!state.mainContainer) state.mainContainer = findMainContainer();
        if (!state.mainContainer) return;
        state.isLoading = true;
        const loader = document.createElement('div');
        loader.className = 'jd-loading'; loader.innerText = '正在讀取下一頁內容...';
        state.mainContainer.appendChild(loader);
        fetch(state.nextPageUrl).then(res => res.text()).then(html => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const newItems = doc.querySelectorAll('.movie-list .item, .grid .item');
            loader.remove();
            if (newItems.length > 0) {
                newItems.forEach(item => {
                    const img = item.querySelector('img');
                    if (img) { if (img.dataset.src) img.src = img.dataset.src; if (img.dataset.original) img.src = img.dataset.original; img.style.opacity = 1; }
                    state.mainContainer.appendChild(item);
                });
                filterItems();
            }
            const nextLink = doc.querySelector('.pagination a[rel="next"]');
            if (nextLink) { state.nextPageUrl = nextLink.href; if (state.config.infiniteScroll && document.documentElement.scrollHeight <= window.innerHeight + 200) setTimeout(loadNextPage, 500); } else { state.nextPageUrl = null; const endMsg = document.createElement('div'); endMsg.className = 'jd-loading'; endMsg.innerText = '--- 已經到底了 ---'; state.mainContainer.appendChild(endMsg); }
            state.isLoading = false;
        }).catch(() => { loader.innerText = '載入失敗'; state.isLoading = false; });
    }

    function openModal(url, isBack = false, isRoot = false) {
        const modal = document.getElementById('jd-modal-overlay');
        const body = document.getElementById('jd-modal-body');
        const backBtn = document.getElementById('jd-modal-back');
        const absUrl = new URL(url, window.location.href).href;
        state.activeMovieUrl = absUrl;

        if (isRoot) {
            state.modalHistory = [];
            state.currentModalUrl = url;
            backBtn.style.display = 'none';
        } else if (!isBack) {
            if (state.currentModalUrl) state.modalHistory.push(state.currentModalUrl);
            state.currentModalUrl = url;
            backBtn.style.display = 'flex';
        } else {
            state.currentModalUrl = url;
            backBtn.style.display = state.modalHistory.length > 0 ? 'flex' : 'none';
        }

        if (document.getElementById('jd-filtered-modal-overlay').classList.contains('active')) {
            modal.style.zIndex = 12000;
        } else {
            modal.style.zIndex = 10000;
        }

        body.innerHTML = '<div class="jd-loading" style="color:#666; font-size: 20px; padding-top: 100px;">正在讀取...</div>';
        const iframe = document.createElement('iframe');
        iframe.id = 'jd-modal-iframe'; iframe.src = url; iframe.style.width = '100%'; iframe.style.height = '100%'; iframe.style.border = 'none'; iframe.style.visibility = 'hidden'; iframe.style.position = 'absolute';

        iframe.onload = function() {
            const doc = iframe.contentDocument;
            if (doc) {
                // --- v3.82 修正：歷史紀錄同步邏輯 ---
                const currentFrameUrl = doc.location.href;
                // 如果 Iframe 內部的網址與腳本記錄的當前網址不同 (且不是 about:blank)
                // 代表發生了「原生頁面跳轉」(如點擊訂正)，需要補上歷史紀錄
                if (state.currentModalUrl && currentFrameUrl !== state.currentModalUrl && currentFrameUrl !== 'about:blank') {
                    state.modalHistory.push(state.currentModalUrl);
                    state.currentModalUrl = currentFrameUrl;
                    backBtn.style.display = 'flex'; // 顯示上一頁
                }

                const style = doc.createElement('style');
                style.textContent = `
                    :root { --jd-cols: ${state.config.cols}; --jd-margin: ${state.config.margin}%; }
                    #jd-main-grid, .jd-main-grid, .movie-list, .grid { display: grid !important; grid-template-columns: repeat(var(--jd-cols), minmax(0, 1fr)) !important; width: 100% !important; }
                    @media (max-width: 768px) { #jd-main-grid, .jd-main-grid, .movie-list, .grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
                    .section .container { max-width: calc(100% - (var(--jd-margin) * 2)) !important; width: calc(100% - (var(--jd-margin) * 2)) !important; }
                    body.jd-hide-search nav.sub-header:nth-child(3), body.jd-hide-search #search-bar-container > div.column { display: none !important; }
                    body.jd-hide-search form[action="/search"]:not(#jd-search-form), body.jd-hide-search .navbar-item:has(form[action="/search"]) { display: none !important; }
                    .navbar, .footer, .ad-banner, .is-hidden-mobile { display: none !important; }
                    html, body { padding-bottom: 80px !important; background-color: #fff !important; height: auto !important; min-height: 100% !important; overflow-y: auto !important; }
                    .section { padding: 20px 10px !important; }
                    .columns > .column.is-3, .columns > .column.is-one-quarter { display: none !important; }
                    .columns > .column.is-9, .columns > .column.is-three-quarters { width: 100% !important; flex: none !important; }
                    body.jd-hide-quick-block .jd-block-tag-btn { display: none !important; }
                    .jd-translated-title { font-size: 1.5rem; font-weight: bold; color: #111; margin-top: 10px; padding: 5px 0; border-top: 1px dashed #eee; line-height: 1.4; }
                `;
                doc.head.appendChild(style);

                if (state.config.hideSearchBar) doc.body.classList.add('jd-hide-search');
                if (!state.config.showQuickBlock) doc.body.classList.add('jd-hide-quick-block');
                doc.querySelectorAll('base[target="_blank"]').forEach(b => b.remove());
                doc.querySelectorAll('a[target="_blank"]').forEach(a => a.removeAttribute('target'));

                const videoMeta = doc.querySelector('.video-meta-panel');
                if (videoMeta) {
                    if (state.config.translateTitle) {
                        const titleEl = videoMeta.querySelector('.title.is-4') || doc.querySelector('.section .title');
                        if (titleEl) {
                            const existingTrans = titleEl.parentNode.querySelector('.jd-translated-title');
                            if (!existingTrans) {
                                const originalText = titleEl.innerText.trim();
                                translateText(originalText).then(translated => {
                                    if (translated) {
                                        const transDiv = doc.createElement('div'); transDiv.className = 'jd-translated-title'; transDiv.innerText = translated; titleEl.parentNode.insertBefore(transDiv, titleEl.nextSibling);
                                    }
                                });
                            }
                        }
                    }
                    const hiddenTags = getHiddenTagsArray();
                    let foundHiddenTags = [];
                    const metaText = videoMeta.textContent.toLowerCase();
                    const strictMode = true;
                    hiddenTags.forEach(tag => { if (isMatch(metaText, tag.toLowerCase(), strictMode)) foundHiddenTags.push(tag); });
                    if (foundHiddenTags.length > 0) {
                        const alertDiv = doc.createElement('div');
                        alertDiv.style.background = '#ffebee'; alertDiv.style.color = '#c62828'; alertDiv.style.border = '1px solid #ffcdd2'; alertDiv.style.padding = '10px'; alertDiv.style.borderRadius = '6px'; alertDiv.style.marginBottom = '15px'; alertDiv.style.display = 'flex'; alertDiv.style.alignItems = 'center'; alertDiv.style.justifyContent = 'space-between';
                        alertDiv.innerHTML = `<strong>⚠️ 警告</strong> <span>此影片包含隱藏文字：${foundHiddenTags.join(', ')}</span>`;
                        const mainSection = doc.querySelector('.section .container');
                        if (mainSection) { mainSection.insertBefore(alertDiv, mainSection.firstChild); } else { doc.body.insertBefore(alertDiv, doc.body.firstChild); }
                    }
                    
                    // --- 迴圈開始：快速封鎖標籤 ---
                    const tagLinks = doc.querySelectorAll('.video-meta-panel .value a');
                    tagLinks.forEach(link => {
                        // 排除功能按鈕 (如複製按鈕)
                        if (link.classList.contains('copy-btn') || link.classList.contains('copy-to-clipboard') || link.hasAttribute('data-clipboard-text')) {
                            return;
                        }

                        const btn = doc.createElement('span');
                        // v3.96: 完全使用 Inline Style 強制覆蓋所有外部 CSS 影響
                        btn.className = 'jd-block-tag-btn';
                        btn.title = '快速過濾此標籤';
                        // 使用 style.cssText 設定容器樣式
                        btn.style.cssText = 'display:inline-flex; align-items:center; justify-content:center; margin-left:4px; cursor:pointer; width:16px; height:16px; vertical-align:middle; background:transparent; line-height:1; border:none; padding:0;';

                        // SVG 標籤內直接寫死 width/height 屬性與 style
                        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" style="width:14px; height:14px; fill:#d32f2f; display:block;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.41 3.59-8 8-8 1.84 0 3.54.63 4.9 1.69L5.69 16.9C4.63 15.54 4 13.84 4 12zm8 8c-1.84 0-3.54-.63-4.9-1.69L18.31 7.1C19.37 8.46 20 10.16 20 12c0 4.41-3.59 8-8 8z"/></svg>';

                        btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); addTagToFilter(link.innerText.trim()); };

                        const panelBlock = link.closest('.panel-block');
                        // v4.01: 針對番號欄位，將按鈕移至該區塊的最尾端，避免插入中間導致番號被切斷
                        if (panelBlock && (panelBlock.textContent.includes('番號') || panelBlock.textContent.includes('ID'))) {
                            link.parentNode.appendChild(btn);
                        } else {
                            // 其他欄位維持插入在連結後方
                            link.parentNode.insertBefore(btn, link.nextSibling);
                        }
                    }); 
                    // --- 迴圈結束 (修正：將字幕按鈕邏輯移出此迴圈) ---

                    // --- 字幕搜尋按鈕 ---
                    if (state.config.subtitleSearch) {
                        // 嘗試尋找影片代碼 (番號)
                        let code = '';
                        const metaItems = doc.querySelectorAll('.video-meta-panel .panel-block');
                        for (let item of metaItems) {
                             if (item.innerText.includes('番號') || item.innerText.includes('ID')) {
                                 // v4.02: 修正番號獲取邏輯
                                 // 1. 優先尋找官方複製按鈕 (data-clipboard-text)，這是最準確的
                                 const copyBtn = item.querySelector('[data-clipboard-text]');
                                 if (copyBtn) {
                                     code = copyBtn.getAttribute('data-clipboard-text').trim();
                                 } else {
                                     // 2. 如果沒有按鈕，則獲取 .value 的完整文字 (修復 GANA-3311 只有 GANA 是連結導致截斷的問題)
                                     const valueEl = item.querySelector('.value');
                                     if (valueEl) {
                                         // 移除可能存在的按鈕文字
                                         const clone = valueEl.cloneNode(true);
                                         clone.querySelectorAll('button, a[href="#"], .copy-btn').forEach(el => el.remove());
                                         code = clone.innerText.trim();
                                         // 簡單過濾：通常番號不含空白，取第一段
                                         code = code.split(/\s+/)[0];
                                     }
                                 }
                                 break;
                             }
                        }

                        if (code) {
                             // v3.89: 嘗試將按鈕加入到下方的 Tab 欄位 (磁鏈、短評那一行)
                             const tabsUl = doc.querySelector('.tabs ul');
                             if (tabsUl) {
                                 const li = doc.createElement('li');
                                 li.style.marginLeft = 'auto'; // 推到最右邊

                                 const a = doc.createElement('a');
                                 // 維持原本的黃色按鈕樣式，但放在 Tab 裡
                                 a.style.color = '#333';
                                 a.style.fontWeight = 'bold';
                                 a.style.background = '#ffdd57';
                                 a.style.border = '1px solid #ffcc00';
                                 a.style.borderRadius = '4px';
                                 a.style.padding = '4px 12px';
                                 a.style.height = 'auto'; // Reset bulma tab height
                                 a.style.display = 'flex';
                                 a.style.alignItems = 'center';

                                 // v3.97: 移除圖示，只顯示文字
                                 a.innerHTML = '字幕搜尋';

                                 a.onclick = (e) => {
                                     e.preventDefault(); e.stopPropagation();
                                     searchSubtitles(code);
                                 };

                                 li.appendChild(a);
                                 tabsUl.appendChild(li);
                             } else {
                                 // Fallback: 如果找不到 tabs，還是放回原來的地方
                                 const actionButtons = doc.querySelector('.video-meta-panel .columns .column:last-child, .video-meta-panel .actions');
                                 if (actionButtons) {
                                     const subBtn = doc.createElement('a');
                                     subBtn.className = 'button is-warning is-small';
                                     // v3.97: 移除圖示，只顯示文字
                                     subBtn.innerHTML = '<strong>字幕搜尋</strong>';
                                     subBtn.style.marginLeft = '5px';
                                     subBtn.style.color = '#333';
                                     subBtn.onclick = (e) => {
                                         e.preventDefault(); e.stopPropagation();
                                         searchSubtitles(code);
                                     };
                                     actionButtons.appendChild(subBtn);
                                 }
                             }
                        }
                    }
                }

                const iContainer = findMainContainer(doc);
                if (iContainer) iContainer.classList.add('jd-main-grid');

                // Iframe 內監聽
                doc.body.addEventListener('click', (e) => {
                    const link = e.target.closest('a');
                    if (!link) return;

                    // 1. 功能按鈕 & 播放器排除 (v3.82 修正)
                    if (link.hasAttribute('data-method') ||
                        link.hasAttribute('data-confirm') ||
                        link.classList.contains('button') ||
                        link.closest('.video-player') || // 排除播放器
                        link.closest('.preview-video-container') || // 排除預覽容器
                        link.classList.contains('play-button') // 排除播放按鈕
                    ) {
                        return;
                    }

                    // 2. 內嵌導航攔截
                    if (link.href.includes('/v/')) {
                         e.preventDefault();
                         e.stopPropagation();
                         openModal(link.href, false, false);
                         return;
                    }

                    // 3. 其他連結
                    if (link.closest('.video-meta-panel') && !link.classList.contains('jd-block-tag-btn')) {
                        if (link.href && !link.href.startsWith('javascript') && !link.href.includes('#') && !link.href.startsWith('magnet:')) {
                            e.preventDefault();
                            e.stopPropagation();
                            GM_openInTab(link.href, { active: false, insert: true });
                        }
                        return;
                    }
                }, true); // 使用 Capture

                body.querySelector('.jd-loading')?.remove();
                iframe.style.visibility = 'visible'; iframe.style.position = 'static'; backBtn.style.display = state.modalHistory.length > 0 ? 'flex' : 'none';
            }
        };
        body.appendChild(iframe);
        modal.classList.add('active');
    }

    function main() {
        setTimeout(() => {
            initUI(); initInfiniteScroll();
            console.log('JavDB Enhancer v4.04 Started');
        }, 500);
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', main); }
    else { main(); }

})();