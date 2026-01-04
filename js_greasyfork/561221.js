// ==UserScript==
// @name         Pommuをより便利に
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  画像全体表示、右側リサイズバー(通常時不可視・逸走防止)、2x2グリッド、いね/ブックマーク保存機能
// @author       meranoa
// @match        https://ch.dlsite.com/pommu/*
// @match        https://*.dlsite.com/pommu/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561221/Pommu%E3%82%92%E3%82%88%E3%82%8A%E4%BE%BF%E5%88%A9%E3%81%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/561221/Pommu%E3%82%92%E3%82%88%E3%82%8A%E4%BE%BF%E5%88%A9%E3%81%AB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================================
       設定・定数
       ========================================= */
    const STORAGE_KEY_WIDTH = 'pommu_tl_width';

    // 保存タイプ定義
    const STORAGE_TYPES = {
        LIKES: {
            key: 'pommu_user_likes_history_v2',
            label: 'いいね履歴',
            icon: '♥',
            colorClass: 'pink'
        },
        BOOKMARKS: {
            key: 'pommu_user_bookmarks',
            label: 'ブックマーク',
            icon: '★',
            colorClass: 'blue'
        }
    };

    // SVGパス定義
    const SVG_BM_OUTLINE = "M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z";
    const SVG_BM_FILLED = "M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z";

    let savedWidth = localStorage.getItem(STORAGE_KEY_WIDTH) || '900px';
    let currentHistoryType = 'LIKES';

    /* =========================================
       CSS スタイル定義
       ========================================= */
    const style = document.createElement('style');
    style.id = 'pommu-custom-styles';
    style.innerHTML = `
        /* --- 1. レイアウト修正 --- */
        .max-w-screen-lg {
            max-width: none !important; width: fit-content !important; margin: 0 auto !important;
        }
        .pc\\:w-120 {
            width: var(--tl-width, ${savedWidth}) !important;
            min-width: var(--tl-width, ${savedWidth}) !important;
            max-width: var(--tl-width, ${savedWidth}) !important;
            flex: none !important;
        }
        ul.grid, .h-42\\.5, .pc\\:h-56 {
            height: auto !important; min-height: 0 !important;
        }
        ul.grid:not(:has(li:nth-child(2))) { display: block !important; }
        ul.grid:not(:has(li:nth-child(2))) img {
            width: 100% !important; height: auto !important; max-height: 80vh !important;
            object-fit: contain !important; position: static !important;
        }
        ul.grid:has(li:nth-child(2)) {
            display: grid !important; height: auto !important; align-items: stretch !important;
        }
        ul.grid:has(li:nth-child(2)) li, ul.grid:has(li:nth-child(2)) li button {
            height: auto !important; min-height: 100% !important; position: relative !important; display: flex !important;
        }
        ul.grid:has(li:nth-child(2)) img {
            position: relative !important; width: 100% !important; height: 100% !important; object-fit: cover !important;
        }
        ul.grid:has(li:nth-child(4)):not(:has(li:nth-child(5))) {
            grid-template-columns: repeat(2, 1fr) !important; gap: 4px !important;
        }
        ul.grid:has(li:nth-child(4)):not(:has(li:nth-child(5))) > li {
            grid-column: span 1 !important; width: auto !important;
        }
        .card > div.relative:first-child > img:not(.rounded-full) {
            object-fit: cover !important; height: 250px !important; width: 100% !important; position: static !important;
        }
        .card img.rounded-full {
            position: relative !important; width: auto !important; height: auto !important; object-fit: cover !important;
        }
        button.relative.overflow-hidden { position: relative !important; overflow: visible !important; }
        body { background: #1a1a1a !important; }

        /* --- リサイザーの見た目強化 --- */
        #tl-resizer {
            width: 16px;
            cursor: col-resize;
            background: transparent;
            z-index: 9999;
            margin-left: -8px;
            margin-right: -8px;
            flex-shrink: 0;
            position: relative;
            transition: background 0.2s;
        }
        /* 中心線 (通常時は透明) */
        #tl-resizer::after {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: transparent; /* ここを変更: グレーを削除 */
            transition: all 0.2s;
            transform: translateX(-50%);
            border-radius: 2px;
        }
        /* マウスホバー・ドラッグ時のみ青く表示 */
        #tl-resizer:hover::after, #tl-resizer.is-dragging::after {
            background: #1d9bf0;
            width: 4px;
            box-shadow: 0 0 8px rgba(29, 155, 240, 0.6);
        }
        #tl-resizer:hover {
            background: rgba(255, 255, 255, 0.02);
        }

        /* --- 2. 履歴UI --- */
        .pommu-floating-btn {
            position: fixed; right: 20px; z-index: 10000;
            color: white; border: none; border-radius: 30px;
            padding: 10px 20px; font-weight: bold; cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s;
            display: flex; align-items: center; gap: 5px;
        }
        .pommu-floating-btn:hover { transform: scale(1.05); }

        #pommu-history-btn { bottom: 20px; background: #e91e63; }
        #pommu-history-btn:hover { background: #d81b60; }

        #pommu-bookmark-btn { bottom: 75px; background: #1d9bf0; }
        #pommu-bookmark-btn:hover { background: #0c85d0; }

        #pommu-toast {
            position: fixed; bottom: 130px; right: 20px; z-index: 10001;
            background: #333; color: #fff; padding: 10px 20px; border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5); opacity: 0; pointer-events: none;
            transition: opacity 0.3s; display: flex; align-items: center; gap: 8px;
        }
        #pommu-toast.show { opacity: 1; }
        #pommu-toast span.pink { color: #e91e63; font-size: 1.2em; }
        #pommu-toast span.blue { color: #1d9bf0; font-size: 1.2em; }
        #pommu-toast span.green { color: #4caf50; font-size: 1.2em; }

        #pommu-history-modal {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10002; align-items: center; justify-content: center;
        }
        #pommu-history-modal.active { display: flex; }

        .ph-content {
            background: #111; width: 95%; max-width: 700px; height: 90%; border-radius: 12px;
            display: flex; flex-direction: column; overflow: hidden; color: #eee;
            box-shadow: 0 0 20px rgba(0,0,0,0.8); border: 1px solid #333;
        }
        .ph-header {
            padding: 15px; background: #222; border-bottom: 1px solid #333;
            display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
        }
        .ph-header h2 { margin: 0; font-size: 18px; color: #fff; display: flex; gap: 10px; align-items: center; }
        .ph-close { background: none; border: none; color: #aaa; font-size: 24px; cursor: pointer; }
        .ph-close:hover { color: #fff; }

        .ph-list { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 15px; }

        .ph-card {
            background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 15px;
            display: flex; flex-direction: column; gap: 10px; position: relative;
        }
        .ph-card-header { display: flex; gap: 10px; align-items: flex-start; }
        .ph-icon { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; background: #333; flex-shrink: 0; }
        .ph-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .ph-name { font-weight: bold; font-size: 15px; color: #fff; }
        .ph-date { font-size: 12px; color: #777; margin-top: 2px; }
        .ph-body { font-size: 15px; line-height: 1.5; color: #e0e0e0; white-space: pre-wrap; word-break: break-word; }

        .ph-images { display: grid; gap: 2px; width: 100%; margin-top: 8px; border-radius: 8px; overflow: hidden; }
        .ph-images.cols-1 { grid-template-columns: 1fr; }
        .ph-images.cols-2 { grid-template-columns: repeat(2, 1fr); }
        .ph-images.cols-3 { grid-template-columns: repeat(2, 1fr); }
        .ph-images.cols-4 { grid-template-columns: repeat(2, 1fr); }
        .ph-img-wrap { position: relative; width: 100%; height: 0; padding-bottom: 100%; background: #000; overflow: hidden; }
        .ph-images.cols-1 .ph-img-wrap { height: auto; padding-bottom: 0; max-height: 500px; display: flex; justify-content: center;}
        .ph-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .ph-images.cols-1 .ph-img { position: static; width: auto; max-width: 100%; height: auto; max-height: 500px; object-fit: contain; }

        .ph-quote {
            border: 1px solid #444; border-radius: 12px; padding: 12px; margin-top: 8px;
            background: #111; display: flex; flex-direction: column; gap: 8px;
        }
        .ph-quote-user { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: bold; color: #ddd; }
        .ph-quote-icon { width: 20px; height: 20px; border-radius: 50%; }

        .ph-actions { margin-top: 5px; padding-top: 10px; border-top: 1px solid #333; display: flex; justify-content: flex-end; gap: 10px; }
        .ph-btn { border: none; padding: 6px 12px; border-radius: 4px; font-size: 13px; cursor: pointer; text-decoration: none; }
        .ph-btn-open { background: #1e88e5; color: white; }
        .ph-btn-del { background: #d32f2f; color: white; }
        .ph-empty { text-align: center; color: #777; padding: 50px; }
        .ph-footer { padding: 10px; border-top: 1px solid #333; text-align: right; background: #222; }

        /* ブックマークボタンの追加スタイル */
        .pommu-bm-btn-inject {
            display: flex; align-items: center; justify-content: center;
            width: 32px; height: 32px; border-radius: 9999px; border: none; background: transparent;
            cursor: pointer; color: #71767b; transition: all 0.2s; margin-left: 0;
        }
        .pommu-bm-btn-inject:hover {
            background-color: rgba(29, 155, 240, 0.1);
            color: #1d9bf0;
        }
        .pommu-bm-btn-inject.bookmarked {
            color: #1d9bf0;
        }
        .pommu-bm-btn-inject svg { width: 1.25em; height: 1.25em; fill: currentColor; }
    `;
    document.head.appendChild(style);

    /* =========================================
       3. データ管理 (共通化・キャッシュ機能付き)
       ========================================= */
    const HistoryManager = {
        _cache: {
            LIKES: null,
            BOOKMARKS: null
        },
        getList: (type) => {
            if (HistoryManager._cache[type]) return HistoryManager._cache[type];
            const key = STORAGE_TYPES[type].key;
            try {
                const list = JSON.parse(localStorage.getItem(key) || '[]');
                HistoryManager._cache[type] = list;
                return list;
            } catch (e) { return []; }
        },
        has: (type, url) => {
            const list = HistoryManager.getList(type);
            return list.some(item => item.url === url);
        },
        add: (type, data) => {
            const list = HistoryManager.getList(type);
            const key = STORAGE_TYPES[type].key;
            if (list.some(item => item.url === data.url)) {
                return 'duplicate';
            }
            list.unshift(data);
            if (list.length > 500) list.pop();
            localStorage.setItem(key, JSON.stringify(list));
            return 'success';
        },
        remove: (type, index) => {
            const list = HistoryManager.getList(type);
            const key = STORAGE_TYPES[type].key;
            list.splice(index, 1);
            localStorage.setItem(key, JSON.stringify(list));
            renderHistoryList();
        },
        exportCSV: () => {
            const type = currentHistoryType;
            const list = HistoryManager.getList(type);
            const label = STORAGE_TYPES[type].label;
            if (list.length === 0) return alert(`${label}がありません`);

            let csv = '\uFEFF保存日時,URL,本文,引用有無\n';
            list.forEach(item => {
                const text = (item.text || '').replace(/"/g, '""').replace(/\n/g, ' ');
                csv += `"${item.savedAt}","${item.url}","${text}","${item.quote ? 'あり' : ''}"\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `pommu_${type.toLowerCase()}_${new Date().toISOString().slice(0,10)}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    /* =========================================
       4. UI作成
       ========================================= */
    const historyBtn = document.createElement('button');
    historyBtn.id = 'pommu-history-btn';
    historyBtn.className = 'pommu-floating-btn';
    historyBtn.innerHTML = '♥ 履歴';
    historyBtn.onclick = () => openModal('LIKES');
    document.body.appendChild(historyBtn);

    const bookmarkBtn = document.createElement('button');
    bookmarkBtn.id = 'pommu-bookmark-btn';
    bookmarkBtn.className = 'pommu-floating-btn';
    bookmarkBtn.innerHTML = '★ ブックマーク';
    bookmarkBtn.onclick = () => openModal('BOOKMARKS');
    document.body.appendChild(bookmarkBtn);

    const toast = document.createElement('div');
    toast.id = 'pommu-toast';
    document.body.appendChild(toast);

    function showToast(msg, type = 'normal', mode = 'LIKES') {
        const iconInfo = STORAGE_TYPES[mode];
        if (type === 'duplicate') {
            toast.innerHTML = `<span class="green">✔</span> ${msg}`;
        } else {
            toast.innerHTML = `<span class="${iconInfo.colorClass}">${iconInfo.icon}</span> ${msg}`;
        }
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    const modal = document.createElement('div');
    modal.id = 'pommu-history-modal';
    modal.innerHTML = `
        <div class="ph-content">
            <div class="ph-header">
                <h2 id="ph-title">履歴</h2>
                <button class="ph-close">×</button>
            </div>
            <div class="ph-list" id="ph-list-container"></div>
            <div class="ph-footer">
                <button class="ph-btn ph-btn-open" onclick="document.getElementById('pommu-history-csv').click()">CSV出力</button>
                <button id="pommu-history-csv" style="display:none"></button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.ph-close').onclick = closeModal;
    modal.querySelector('#pommu-history-csv').onclick = HistoryManager.exportCSV;
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    function openModal(type) {
        currentHistoryType = type;
        const info = STORAGE_TYPES[type];
        document.getElementById('ph-title').innerHTML = `<span style="color:${type==='LIKES'?'#e91e63':'#1d9bf0'}">${info.icon}</span> ${info.label} (ローカル保存)`;
        renderHistoryList();
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    function renderHistoryList() {
        const container = document.getElementById('ph-list-container');
        const list = HistoryManager.getList(currentHistoryType);
        const info = STORAGE_TYPES[currentHistoryType];

        if (list.length === 0) {
            container.innerHTML = `<div class="ph-empty">${info.label}がありません。<br>TLまたは個別ページで${info.icon}を押すと保存されます。</div>`;
            return;
        }

        container.innerHTML = '';
        list.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'ph-card';

            let imagesHtml = '';
            if (item.images && item.images.length > 0) {
                const count = item.images.length;
                let gridClass = 'cols-1';
                if (count === 2) gridClass = 'cols-2';
                if (count === 3) gridClass = 'cols-3';
                if (count >= 4) gridClass = 'cols-4';
                const displayImages = item.images.slice(0, 4);
                const imgTags = displayImages.map(src => `<div class="ph-img-wrap"><img src="${src}" class="ph-img" loading="lazy"></div>`).join('');
                imagesHtml = `<div class="ph-images ${gridClass}">${imgTags}</div>`;
            }

            let quoteHtml = '';
            if (item.quote) {
                let qImagesHtml = '';
                if (item.quote.images && item.quote.images.length > 0) {
                     qImagesHtml = `<div class="ph-images cols-${item.quote.images.length >= 2 ? '2' : '1'}" style="margin-top:5px;">
                        ${item.quote.images.slice(0,4).map(src => `<div class="ph-img-wrap"><img src="${src}" class="ph-img"></div>`).join('')}
                     </div>`;
                }
                const qIcon = item.quote.icon || 'https://via.placeholder.com/40';
                quoteHtml = `
                    <div class="ph-quote">
                        <div class="ph-quote-user">
                            <img src="${qIcon}" class="ph-quote-icon">
                            <span>${escapeHtml(item.quote.author)}</span>
                        </div>
                        <div class="ph-body" style="font-size:14px;">${escapeHtml(item.quote.text)}</div>
                        ${qImagesHtml}
                    </div>
                `;
            }

            const iconSrc = item.icon || 'https://via.placeholder.com/40';
            card.innerHTML = `
                <div class="ph-card-header">
                    <img src="${iconSrc}" class="ph-icon">
                    <div class="ph-meta">
                        <span class="ph-name">${escapeHtml(item.author)}</span>
                        <span class="ph-date">${item.savedAt}</span>
                    </div>
                </div>
                <div class="ph-body">${escapeHtml(item.text)}</div>
                ${imagesHtml}
                ${quoteHtml}
                <div class="ph-actions">
                    <a href="${item.url}" target="_blank" class="ph-btn ph-btn-open">元ポストを見る</a>
                    <button class="ph-btn ph-btn-del" data-idx="${index}">削除</button>
                </div>
            `;
            container.appendChild(card);
        });

        container.querySelectorAll('.ph-btn-del').forEach(btn => {
            btn.onclick = (e) => {
                const idx = e.target.getAttribute('data-idx');
                HistoryManager.remove(currentHistoryType, idx);
            };
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
    }

    /* =========================================
       5. 投稿データ抽出ロジック
       ========================================= */
    function extractPostData(containerElement, ignoreElement = null) {
        if (!containerElement) return null;
        const isIgnored = (node) => ignoreElement && (ignoreElement === node || ignoreElement.contains(node));

        let text = '';
        const textEls = containerElement.querySelectorAll('[data-testid="post-text-content"]');
        for (const el of textEls) {
            if (!isIgnored(el)) {
                text = el.textContent.trim();
                break;
            }
        }

        let authorName = '不明';
        let nameEl = containerElement.querySelector('[data-testid="post-username-link"]');
        if (!nameEl || isIgnored(nameEl)) {
            const noLinkNames = containerElement.querySelectorAll('[data-testid="post-username-no-link"]');
            for (const el of noLinkNames) {
                if (!isIgnored(el)) {
                    nameEl = el;
                    break;
                }
            }
        }
        if (nameEl && !isIgnored(nameEl)) {
            authorName = nameEl.textContent.trim();
        }

        let iconUrl = '';
        const altImgs = containerElement.querySelectorAll('img[alt="プロフィール画像"]');
        for (const img of altImgs) {
            if (!isIgnored(img)) {
                iconUrl = img.src;
                break;
            }
        }
        if (!iconUrl) {
            const avatarSelectors = ['[data-testid="post-avatar-link"] img', '[data-testid="post-avatar-no-link"] img', '.avatar img'];
            for (const sel of avatarSelectors) {
                const imgs = containerElement.querySelectorAll(sel);
                for (const img of imgs) {
                    if (!isIgnored(img)) {
                        iconUrl = img.src;
                        if (iconUrl) break;
                    }
                }
                if (iconUrl) break;
            }
        }

        let images = [];
        const allImgs = containerElement.querySelectorAll('img');
        for (const img of allImgs) {
            if (isIgnored(img)) continue;
            if (img.getAttribute('alt') === 'プロフィール画像') continue;
            if (img.closest('.avatar')) continue;
            if (img.classList.contains('rounded-full')) continue;
            const src = img.src;
            if (src) images.push(src);
        }

        return {
            author: authorName,
            icon: iconUrl,
            text: text,
            images: images
        };
    }

    function findPostCard(startNode) {
        let current = startNode;
        for (let i = 0; i < 8; i++) {
            if (!current) break;
            if (current.querySelector && current.querySelector('[data-testid="post-timeline-item"]')) {
                return current;
            }
            current = current.parentNode;
        }
        return startNode.closest('li') || startNode.closest('article');
    }

    function getPostUrl(card) {
        if (!card) return null;
        const timeEl = card.querySelector('time');
        if (timeEl) {
            const link = timeEl.closest('a');
            if (link && link.href) return link.href;
        }
        const links = card.querySelectorAll('a');
        for (let link of links) {
            if (link.href && link.href.includes('/posts/') && !link.href.includes('/users/')) {
                return link.href;
            }
        }
        return window.location.href;
    }

    function processSave(targetBtn, type) {
        const card = findPostCard(targetBtn);
        if (!card) {
            console.log('PommuScript: Card not found');
            return;
        }

        const postUrl = getPostUrl(card);
        const quoteContainer = card.querySelector('[data-testid="post-quote-item"]');
        const baseData = extractPostData(card, quoteContainer);

        let quoteData = null;
        if (quoteContainer) {
            const q = extractPostData(quoteContainer, null);
            if (q && (q.text || q.images.length > 0)) {
                quoteData = q;
            }
        }

        const saveItem = {
            url: postUrl,
            savedAt: new Date().toLocaleString(),
            author: baseData.author,
            icon: baseData.icon,
            text: baseData.text,
            images: baseData.images,
            quote: quoteData
        };

        const result = HistoryManager.add(type, saveItem);
        const info = STORAGE_TYPES[type];

        if (type === 'BOOKMARKS' && (result === 'success' || result === 'duplicate')) {
            const bmBtn = targetBtn.closest('.pommu-bm-btn-inject') || targetBtn;
            if (bmBtn.classList.contains('pommu-bm-btn-inject')) {
                bmBtn.classList.add('bookmarked');
                bmBtn.querySelector('path').setAttribute('d', SVG_BM_FILLED);
            }
        }

        if (result === 'success') {
            showToast(`${info.label}に保存しました`, 'success', type);
        } else if (result === 'duplicate') {
            showToast('既に保存済みです', 'duplicate', type);
        }
    }

    /* =========================================
       6. 監視処理 (いいね & ブックマークボタン注入)
       ========================================= */
    function injectBookmarkButtons() {
        const likeButtons = document.querySelectorAll('button[data-testid="like-button"]');
        likeButtons.forEach(btn => {
            const parent = btn.parentElement;
            if (!parent || parent.querySelector('.pommu-bm-btn-inject')) return;

            const bmBtn = document.createElement('button');
            bmBtn.className = 'pommu-bm-btn-inject';
            bmBtn.title = "ブックマーク";

            const card = findPostCard(btn);
            const url = getPostUrl(card);
            const isBookmarked = url && HistoryManager.has('BOOKMARKS', url);

            if (isBookmarked) {
                bmBtn.classList.add('bookmarked');
                bmBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="${SVG_BM_FILLED}"></path></svg>`;
            } else {
                bmBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="${SVG_BM_OUTLINE}"></path></svg>`;
            }

            bmBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                processSave(bmBtn, 'BOOKMARKS');
            });

            if (parent.lastElementChild) {
                parent.insertBefore(bmBtn, parent.lastElementChild);
            } else {
                parent.appendChild(bmBtn);
            }
        });
    }

    document.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('button[data-testid="like-button"]');
        if (!likeBtn) return;

        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (!document.body.contains(likeBtn)) { clearInterval(interval); return; }

            const svg = likeBtn.querySelector('svg');
            let isLiked = false;
            if (svg && (!svg.classList.contains('text-on-surface-variant') || svg.getAttribute('data-testid') === 'heart-icon-filled')) {
                isLiked = true;
            }

            if (isLiked) {
                clearInterval(interval);
                processSave(likeBtn, 'LIKES');
            } else if (attempts >= 20) {
                clearInterval(interval);
            }
        }, 100);
    }, true);


    /* =========================================
       7. リサイザー & DOM監視統合 (逸走防止版)
       ========================================= */
    function updateTLWidth(width) {
        document.documentElement.style.setProperty('--tl-width', width + 'px');
        localStorage.setItem(STORAGE_KEY_WIDTH, width + 'px');
    }
    function injectResizer() {
        if (document.getElementById('tl-resizer')) return;
        const timeline = document.querySelector('.pc\\:w-120');
        if (timeline) {
            const resizer = document.createElement('div');
            resizer.id = 'tl-resizer';
            timeline.parentNode.insertBefore(resizer, timeline.nextSibling);
            let startX, startWidth;

            const onMouseDown = (e) => {
                e.preventDefault();
                startX = e.clientX;
                startWidth = timeline.offsetWidth;
                resizer.classList.add('is-dragging');
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
            };

            const onMouseMove = (e) => {
                requestAnimationFrame(() => {
                    const delta = e.clientX - startX;
                    let newWidth = startWidth + delta;

                    const rect = timeline.getBoundingClientRect();
                    const availableSpace = window.innerWidth - rect.left - 50;

                    newWidth = Math.max(300, Math.min(newWidth, availableSpace));

                    updateTLWidth(newWidth);
                });
            };

            const onMouseUp = () => {
                resizer.classList.remove('is-dragging');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };
            resizer.addEventListener('mousedown', onMouseDown);
        }
    }

    const observer = new MutationObserver(() => {
        injectResizer();
        injectBookmarkButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.documentElement.style.setProperty('--tl-width', savedWidth);
    injectResizer();
    injectBookmarkButtons();

})();