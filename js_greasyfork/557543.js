// ==UserScript==
// @name         Shopee Quick Likes (蝦皮按讚清單)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在蝦皮台灣 (shopee.tw) 左下角增加一個SVG愛心圖示，點擊後展開顯示按讚過的商品清單
// @author       You
// @match        https://shopee.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.tw
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557543/Shopee%20Quick%20Likes%20%28%E8%9D%A6%E7%9A%AE%E6%8C%89%E8%AE%9A%E6%B8%85%E5%96%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557543/Shopee%20Quick%20Likes%20%28%E8%9D%A6%E7%9A%AE%E6%8C%89%E8%AE%9A%E6%B8%85%E5%96%AE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 本地資料管理 (改用 GM_Storage 以防止網站登出時清除資料)
    const LocalData = {
        KEY_CATS: 'shopee_likes_custom_cats',
        KEY_ITEMS: 'shopee_likes_custom_items',
        
        getCats: () => {
            try {
                // 1. 優先讀取 GM Storage (永久儲存)
                let data = GM_getValue(LocalData.KEY_CATS);
                if (data) return JSON.parse(data);

                // 2. 如果沒有，嘗試從舊的 LocalStorage 遷移資料
                const oldData = localStorage.getItem(LocalData.KEY_CATS);
                if (oldData) {
                    console.log('[Shopee Likes] Migrating categories to GM storage...');
                    GM_setValue(LocalData.KEY_CATS, oldData);
                    return JSON.parse(oldData);
                }
            } catch (e) {
                console.error('[Shopee Likes] Categories parse error:', e);
            }
            return [{"id":"all","name":"全部"}];
        },

        saveCats: (cats) => {
            // 存入 GM Storage
            GM_setValue(LocalData.KEY_CATS, JSON.stringify(cats));
        },
        
        getItems: () => {
            try {
                // 1. 優先讀取 GM Storage
                let data = GM_getValue(LocalData.KEY_ITEMS);
                if (data) return JSON.parse(data);

                // 2. 嘗試遷移舊資料
                const oldData = localStorage.getItem(LocalData.KEY_ITEMS);
                if (oldData) {
                    console.log('[Shopee Likes] Migrating items to GM storage...');
                    GM_setValue(LocalData.KEY_ITEMS, oldData);
                    return JSON.parse(oldData);
                }
            } catch (e) {
                console.error('[Shopee Likes] Items parse error:', e);
            }
            return {};
        },

        saveItems: (items) => {
            // 存入 GM Storage
            GM_setValue(LocalData.KEY_ITEMS, JSON.stringify(items));
        },

        addCategory: (name) => {
            const cats = LocalData.getCats();
            const newId = 'cat_' + Date.now();
            cats.push({ id: newId, name: name });
            LocalData.saveCats(cats);
            return newId;
        },

        deleteCategory: (id) => {
            if(id === 'all') return;
            const cats = LocalData.getCats().filter(c => c.id !== id);
            LocalData.saveCats(cats);
        },

        addItemToCat: (itemData, catId) => {
            const items = LocalData.getItems();
            const key = `${itemData.shopid}_${itemData.itemid}`;
            
            if (!items[key]) items[key] = { ...itemData, cats: [] };
            if (!items[key].cats.includes(catId)) items[key].cats.push(catId);
            
            items[key].name = itemData.name;
            items[key].price = itemData.price;
            items[key].image = itemData.image;
            LocalData.saveItems(items);
        },

        removeItemFromCat: (shopid, itemid, catId) => {
            const items = LocalData.getItems();
            const key = `${shopid}_${itemid}`;
            if (items[key]) {
                items[key].cats = items[key].cats.filter(c => c !== catId);
                if (items[key].cats.length === 0) delete items[key];
                LocalData.saveItems(items);
            }
        },

        removeItemFromAllCats: (shopid, itemid) => {
            const items = LocalData.getItems();
            const key = `${shopid}_${itemid}`;
            if (items[key]) {
                delete items[key];
                LocalData.saveItems(items);
                return true;
            }
            return false;
        },

        getItemsByCat: (catId) => {
            const items = LocalData.getItems();
            return Object.values(items).filter(item => item.cats && item.cats.includes(catId));
        }
    };

    // 狀態管理
    const STATE = {
        currentPage: 1,
        pageSize: 20,
        totalCount: null,
        currentCatId: 'all',
        isLoading: false,
        renderId: 0,
        isSyncing: false
    };

    // 配置
    const CONFIG = {
        apiBase: 'https://shopee.tw/api/v4/pages/get_liked_items',
        countApi: 'https://shopee.tw/api/v4/pages/get_like_count',
        unlikeApi: 'https://shopee.tw/api/v4/item/like',
        coinsUrl: 'https://shopee.tw/shopee-coins',
        imageBaseUrl: 'https://down-tw.img.susercontent.com/file/',
        productBaseUrl: 'https://shopee.tw/product/',
        primaryColor: '#ee4d2d',
        hoverColor: '#d73211',
        coinColor: '#F6A700',
        panelWidth: '380px',
        panelHeight: '650px'
    };

    function initNetworkInterceptor() {
        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async function(resource, init) {
            const response = await originalFetch(resource, init);
            if (response.ok) {
                try {
                    const url = typeof resource === 'string' ? resource : resource.url;
                    // 監聽單一商品取消按讚
                    if (url.includes('api/v4/item/like') && init && init.method === 'POST') {
                        const body = JSON.parse(init.body);
                        if (body && body.like === false) {
                            handleAutoRemove(body.shopid, body.itemid);
                        }
                    } 
                    // 監聽批量取消按讚
                    else if (url.includes('api/v4/pages/unlike_items') && init && init.method === 'POST') {
                        const body = JSON.parse(init.body);
                        if (body && body.items) {
                            body.items.forEach(item => {
                                const sId = item.shopid || item.shop_id;
                                const iId = item.itemid || item.item_id;
                                handleAutoRemove(sId, iId);
                            });
                        }
                    }
                } catch (e) {}
            }
            return response;
        };
    }

    function handleAutoRemove(shopid, itemid) {
        if (!shopid || !itemid) return;
        const removed = LocalData.removeItemFromAllCats(shopid, itemid);
        if (removed) {
            const panel = document.getElementById('shopee-likes-panel');
            if (panel && panel.classList.contains('visible')) {
                if (STATE.currentCatId !== 'all') {
                    renderLocalLikes(STATE.currentCatId);
                }
            }
        }
    }

    // -----------------------------------------------------------
    // 背景同步功能
    // -----------------------------------------------------------
    async function syncLocalDataWithServer() {
        if (STATE.isSyncing) return;
        
        const localItems = LocalData.getItems();
        const localKeys = Object.keys(localItems);
        if (localKeys.length === 0) return; 

        STATE.isSyncing = true;
        const syncStatusEl = document.getElementById('sync-status');
        if (syncStatusEl) syncStatusEl.textContent = '⟳ 同步檢查中...';

        try {
            const validKeys = new Set();
            const limit = 50; 
            let offset = 0;
            let hasMore = true;
            let completeSuccess = true;
            let maxPages = 50; // 安全限制

            const nativeFetch = (typeof unsafeWindow !== 'undefined' && unsafeWindow.fetch) ? unsafeWindow.fetch : window.fetch;

            while (hasMore && maxPages > 0) {
                const apiUrl = `${CONFIG.apiBase}?cursor=${offset}&limit=${limit}&offset=${offset}&status=0&_ts=${Date.now()}`;
                const response = await nativeFetch(apiUrl);
                
                if (!response.ok) {
                    completeSuccess = false;
                    break;
                }

                const json = await response.json();
                const items = json.data && json.data.items;

                if (items && items.length > 0) {
                    items.forEach(item => {
                        validKeys.add(`${item.shopid}_${item.itemid}`);
                    });
                    
                    if (items.length < limit) hasMore = false;
                    offset += limit;
                } else {
                    hasMore = false;
                }
                maxPages--;
            }

            if (completeSuccess && !hasMore) {
                let changed = false;
                localKeys.forEach(key => {
                    if (!validKeys.has(key)) {
                        delete localItems[key];
                        changed = true;
                        console.log(`[Shopee Likes] 同步移除已失效商品: ${key}`);
                    }
                });

                if (changed) {
                    LocalData.saveItems(localItems);
                    if (STATE.currentCatId !== 'all') {
                        renderLocalLikes(STATE.currentCatId);
                    }
                }
                if (syncStatusEl) syncStatusEl.textContent = '✓ 同步完成';
            } else {
                if (syncStatusEl) syncStatusEl.textContent = '! 同步未完成';
            }

        } catch (e) {
            console.error('[Shopee Likes] Sync error:', e);
            if (syncStatusEl) syncStatusEl.textContent = '! 同步錯誤';
        } finally {
            STATE.isSyncing = false;
            setTimeout(() => {
                if (syncStatusEl && syncStatusEl.textContent.includes('同步')) syncStatusEl.textContent = '';
            }, 3000);
        }
    }

    // -----------------------------------------------------------
    // UI 程式碼
    // -----------------------------------------------------------
    const css = `
        #shopee-likes-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 99999;
            font-family: sans-serif;
        }
        #shopee-likes-btn {
            width: 50px;
            height: 50px;
            background-color: ${CONFIG.primaryColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            transition: transform 0.2s;
            position: relative;
            z-index: 2;
        }
        #shopee-likes-btn:hover {
            transform: scale(1.05);
        }
        #shopee-likes-btn svg {
            width: 24px;
            height: 24px;
            fill: white;
        }
        #shopee-coins-btn {
            width: 40px;
            height: 40px;
            background-color: ${CONFIG.coinColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            position: absolute;
            bottom: 5px; 
            left: 5px; 
            z-index: 1;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
        }
        #shopee-coins-btn.visible {
            transform: translateX(60px);
            opacity: 1;
            pointer-events: auto;
        }
        #shopee-coins-btn:hover {
            transform: translateX(60px) scale(1.1);
        }
        #shopee-coins-btn svg {
            width: 20px;
            height: 20px;
            fill: white;
        }
        #shopee-likes-panel {
            position: absolute;
            bottom: 60px;
            left: 0;
            width: ${CONFIG.panelWidth};
            height: ${CONFIG.panelHeight};
            background: white;
            border-radius: 8px;
            box-shadow: 0 -4px 16px rgba(0,0,0,0.15);
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #e8e8e8;
        }
        #shopee-likes-panel.visible {
            display: flex;
        }
        .likes-header {
            padding: 12px 16px;
            background: #f8f8f8;
            border-bottom: 1px solid #eee;
            font-weight: bold;
            color: #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }
        .category-bar {
            padding: 8px 10px;
            background: #fff;
            border-bottom: 1px solid #eee;
            overflow-x: auto;
            white-space: nowrap;
            display: flex;
            gap: 6px;
            flex-shrink: 0;
            align-items: center;
        }
        .category-bar::-webkit-scrollbar {
            height: 4px;
        }
        .category-bar::-webkit-scrollbar-thumb {
            background: #ddd; 
            border-radius: 2px;
        }
        .category-chip {
            display: inline-flex;
            align-items: center;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            color: #666;
            background: #f0f0f0;
            cursor: pointer;
            border: 1px solid transparent;
            user-select: none;
        }
        .category-chip:hover {
            background: #e0e0e0;
        }
        .category-chip.active {
            background: #fff5f3;
            color: ${CONFIG.primaryColor};
            border-color: ${CONFIG.primaryColor};
        }
        .cat-delete-btn {
            margin-left: 6px;
            width: 14px;
            height: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 10px;
            color: #aaa;
            transition: all 0.2s;
        }
        .cat-delete-btn:hover {
            background-color: #ffcccc;
            color: #cc0000;
        }
        .add-cat-btn {
            font-size: 16px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #eee;
            cursor: pointer;
            color: #555;
            flex-shrink: 0;
        }
        .add-cat-btn:hover {
            background: #ddd;
        }
        #likes-list {
            flex: 1;
            overflow-y: auto;
            padding: 0;
            margin: 0;
            list-style: none;
            background-color: #fff;
        }
        .like-item {
            display: flex;
            padding: 10px;
            border-bottom: 1px solid #f1f1f1;
            position: relative;
        }
        .like-item:hover {
            background-color: #fafafa;
        }
        .like-link-wrapper {
            display: flex;
            text-decoration: none;
            color: inherit;
            flex: 1;
            align-items: flex-start;
            overflow: hidden;
        }
        .like-img {
            width: 70px;
            height: 70px;
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid #eee;
            margin-right: 10px;
            flex-shrink: 0;
        }
        .like-info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
            flex: 1;
            height: 70px;
        }
        .like-title {
            font-size: 13px;
            line-height: 1.4;
            color: #333;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .like-price {
            font-size: 14px;
            color: ${CONFIG.primaryColor};
            font-weight: bold;
        }
        .action-btn {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 50%;
            margin-left: 5px;
            align-self: center;
            color: #aaa;
            transition: all 0.2s;
        }
        .action-btn:hover {
            background-color: #f0f0f0;
            color: #555;
        }
        .action-btn.active {
            color: ${CONFIG.primaryColor};
        }
        .pagination-bar {
            padding: 10px;
            background: #fff;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            font-size: 13px;
        }
        .page-btn {
            padding: 4px 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #fff;
            cursor: pointer;
            color: #555;
            min-width: 50px;
        }
        .page-btn:hover:not(:disabled) {
            border-color: ${CONFIG.primaryColor};
            color: ${CONFIG.primaryColor};
        }
        .page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .jump-page-wrapper {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .jump-page-input {
            width: 40px;
            padding: 4px;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-align: center;
            font-size: 12px;
            outline: none;
        }
        .jump-page-input:focus {
            border-color: ${CONFIG.primaryColor};
        }
        .jump-page-input::-webkit-outer-spin-button,
        .jump-page-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .jump-page-btn {
            padding: 4px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #f9f9f9;
            cursor: pointer;
            font-size: 12px;
            color: #666;
        }
        .jump-page-btn:hover {
            background: #eee;
            color: #333;
        }
        .spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        #cat-modal {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(255,255,255,0.95);
            z-index: 10;
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        #cat-modal.show { display: flex; }
        .modal-title { font-weight: bold; margin-bottom: 15px; }
        .cat-select-list { 
            width: 100%; max-height: 300px; overflow-y: auto; 
            border: 1px solid #eee; border-radius: 4px;
        }
        .cat-option {
            padding: 10px; border-bottom: 1px solid #eee;
            cursor: pointer; text-align: center;
        }
        .cat-option:hover { background: #f9f9f9; }
        .modal-close {
            margin-top: 15px; padding: 5px 15px;
            background: #eee; border-radius: 4px; cursor: pointer;
        }
    `;

    function createUI() {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = css;
        document.head.appendChild(styleEl);

        const container = document.createElement('div');
        container.id = 'shopee-likes-container';

        const panel = document.createElement('div');
        panel.id = 'shopee-likes-panel';
        panel.innerHTML = `
            <div class="likes-header">
                <div style="display:flex;align-items:center;gap:5px;">
                    <span>按讚好物</span>
                    <span id="sync-status" style="font-size:10px;color:#aaa;font-weight:normal;"></span>
                </div>
                <div class="likes-info-text">
                    <span id="page-indicator">第 1 頁</span>
                    <span id="total-count-display"></span>
                </div>
            </div>
            
            <div id="category-bar" class="category-bar"></div>

            <ul id="likes-list">
                <div style="padding:50px;text-align:center;color:#999;">載入中...</div>
            </ul>

            <div class="pagination-bar" id="pagination-bar">
                <button id="prev-page-btn" class="page-btn">上一頁</button>
                <div class="jump-page-wrapper">
                    <input type="number" id="jump-page-input" class="jump-page-input" min="1" placeholder="">
                    <button id="jump-page-btn" class="jump-page-btn">Go</button>
                </div>
                <button id="next-page-btn" class="page-btn">下一頁</button>
            </div>

            <div id="cat-modal">
                <div class="modal-title">加入分類</div>
                <div class="cat-select-list" id="cat-select-list"></div>
                <div class="modal-close" id="modal-close-btn">取消</div>
            </div>
        `;

        const btn = document.createElement('div');
        btn.id = 'shopee-likes-btn';
        btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
        
        const coinBtn = document.createElement('div');
        coinBtn.id = 'shopee-coins-btn';
        coinBtn.title = '我的蝦幣';
        coinBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h2.97c-.24-2.36-1.92-3.66-4.1-3.92V4h-2v1.73c-2.22.34-3.79 1.76-3.79 3.58 0 2.21 1.77 3.25 4.67 3.93 1.77.41 2.37.99 2.37 1.74 0 .93-.97 1.57-2.29 1.57-1.58 0-2.22-.72-2.36-1.84H6.26c.26 2.58 2.11 3.79 4.62 4.09V20h2v-1.75c2.31-.32 3.96-1.83 3.96-3.72 0-2.3-1.84-3.32-4.53-3.89z"/></svg>`;
        
        btn.addEventListener('click', togglePanel);
        coinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            GM_openInTab(CONFIG.coinsUrl, { active: true });
        });

        panel.querySelector('#prev-page-btn').addEventListener('click', () => changePage(-1));
        panel.querySelector('#next-page-btn').addEventListener('click', () => changePage(1));
        panel.querySelector('#jump-page-btn').addEventListener('click', jumpToPage);
        panel.querySelector('#jump-page-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') jumpToPage();
        });
        panel.querySelector('#modal-close-btn').addEventListener('click', () => {
            document.getElementById('cat-modal').classList.remove('show');
        });

        container.appendChild(panel);
        container.appendChild(coinBtn);
        container.appendChild(btn);
        document.body.appendChild(container);

        renderCategoryBar();
    }

    function togglePanel() {
        const panel = document.getElementById('shopee-likes-panel');
        const coinBtn = document.getElementById('shopee-coins-btn');
        if (panel.classList.contains('visible')) {
            panel.classList.remove('visible');
            coinBtn.classList.remove('visible');
        } else {
            panel.classList.add('visible');
            coinBtn.classList.add('visible');
            loadData();
            syncLocalDataWithServer();
        }
    }

    function renderCategoryBar() {
        const bar = document.getElementById('category-bar');
        bar.innerHTML = '';
        const cats = LocalData.getCats();

        cats.forEach(cat => {
            const chip = document.createElement('span');
            chip.className = `category-chip ${STATE.currentCatId === cat.id ? 'active' : ''}`;
            const nameSpan = document.createElement('span');
            nameSpan.textContent = cat.name;
            chip.appendChild(nameSpan);

            if (cat.id !== 'all') {
                const delBtn = document.createElement('span');
                delBtn.className = 'cat-delete-btn';
                delBtn.innerHTML = '✕';
                delBtn.title = '刪除此分類';
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    if(confirm(`確定要刪除分類「${cat.name}」嗎？(商品不會被刪除)`)) {
                        LocalData.deleteCategory(cat.id);
                        if (STATE.currentCatId === cat.id) STATE.currentCatId = 'all';
                        renderCategoryBar();
                        loadData();
                    }
                });
                chip.appendChild(delBtn);
            }
            chip.addEventListener('click', () => {
                selectCategory(cat.id);
            });
            bar.appendChild(chip);
        });

        const addBtn = document.createElement('span');
        addBtn.className = 'add-cat-btn';
        addBtn.innerHTML = '+';
        addBtn.title = '新增分類';
        addBtn.addEventListener('click', () => {
            const name = prompt('請輸入新分類名稱：');
            if (name) {
                const newId = LocalData.addCategory(name);
                selectCategory(newId);
                renderCategoryBar();
            }
        });
        bar.appendChild(addBtn);
    }

    function selectCategory(catId) {
        if (STATE.currentCatId === catId) return;
        STATE.currentCatId = catId;
        STATE.currentPage = 1;
        renderCategoryBar();
        loadData();
    }

    function changePage(delta) {
        STATE.currentPage += delta;
        loadData();
    }

    function jumpToPage() {
        const input = document.getElementById('jump-page-input');
        const page = parseInt(input.value);
        if (page && page > 0) {
            STATE.currentPage = page;
            loadData();
            input.value = ''; 
        }
    }

    function loadData() {
        const listEl = document.getElementById('likes-list');
        listEl.innerHTML = '<div style="padding:50px;text-align:center;color:#999;">載入中...</div>';
        
        STATE.renderId++;

        if (STATE.currentCatId === 'all') {
            fetchLikesFromApi(STATE.currentPage, STATE.renderId);
            document.getElementById('pagination-bar').style.display = 'flex';
        } else {
            try {
                renderLocalLikes(STATE.currentCatId);
            } catch (e) {
                listEl.innerHTML = '<div style="padding:20px;text-align:center;color:red;">渲染失敗</div>';
                console.error(e);
            }
            document.getElementById('pagination-bar').style.display = 'none';
        }
    }

    async function fetchLikesFromApi(page, reqRenderId) {
        const pageIndicator = document.getElementById('page-indicator');
        pageIndicator.textContent = `第 ${page} 頁`;

        // 嚴格檢查
        if (STATE.currentCatId !== 'all') return;

        if (page === 1 || STATE.totalCount === null) await fetchTotalCount();

        if (reqRenderId !== STATE.renderId) return;
        if (STATE.currentCatId !== 'all') return;

        const offset = (page - 1) * STATE.pageSize;
        const apiUrl = `${CONFIG.apiBase}?cursor=${offset}&limit=${STATE.pageSize}&offset=${offset}&status=0&_ts=${Date.now()}`;

        try {
            const nativeFetch = (typeof unsafeWindow !== 'undefined' && unsafeWindow.fetch) ? unsafeWindow.fetch : window.fetch;
            const res = await nativeFetch(apiUrl);
            
            if (reqRenderId !== STATE.renderId) return;
            if (STATE.currentCatId !== 'all') return;

            if (!res.ok) throw new Error('API Error');
            const json = await res.json();
            const items = json.data && json.data.items;
            
            if (!items || items.length === 0) {
                document.getElementById('likes-list').innerHTML = '<div style="padding:20px;text-align:center;">沒有商品</div>';
            } else {
                renderList(items, true);
            }

            const prevBtn = document.getElementById('prev-page-btn');
            const nextBtn = document.getElementById('next-page-btn');
            
            prevBtn.disabled = page <= 1;

            if (STATE.totalCount !== null && STATE.totalCount > 0) {
                const currentCount = offset + (items ? items.length : 0);
                nextBtn.disabled = currentCount >= STATE.totalCount;
                
                const totalPages = Math.ceil(STATE.totalCount / STATE.pageSize);
                document.getElementById('total-count-display').textContent = ` / 共 ${totalPages} 頁 (共 ${STATE.totalCount} 個)`;
            } else {
                nextBtn.disabled = (!items || items.length === 0);
                document.getElementById('total-count-display').textContent = ``;
            }

        } catch (err) {
            if (reqRenderId === STATE.renderId && STATE.currentCatId === 'all') {
                console.error(err);
                document.getElementById('likes-list').innerHTML = '<div style="padding:20px;text-align:center;color:red;">載入失敗，請重整</div>';
            }
        }
    }

    function renderLocalLikes(catId) {
        const listEl = document.getElementById('likes-list');
        const items = LocalData.getItemsByCat(catId);
        
        document.getElementById('page-indicator').textContent = '第 1 頁';
        document.getElementById('total-count-display').textContent = ` / 共 1 頁 (共 ${items.length} 個)`;

        if (items.length === 0) {
            listEl.innerHTML = '<div style="padding:20px;text-align:center;color:#888;">此分類還沒有商品<br>請回到「全部」點擊資料夾圖示加入</div>';
        } else {
            renderList(items.reverse(), false); 
        }
    }

    function renderList(items, isApiSource) {
        const listEl = document.getElementById('likes-list');
        listEl.innerHTML = '';
        
        const localItemsMap = LocalData.getItems();

        items.forEach(item => {
            const displayImgUrl = item.image.startsWith('http') ? item.image : `${CONFIG.imageBaseUrl}${item.image}`;
            const productUrl = `${CONFIG.productBaseUrl}${item.shopid}/${item.itemid}`;
            const price = formatPrice(item.price);
            
            const key = `${item.shopid}_${item.itemid}`;
            const localData = localItemsMap[key];
            const hasCats = localData && localData.cats && localData.cats.length > 0;

            const li = document.createElement('li');
            li.className = 'like-item';
            li.innerHTML = `
                <a href="${productUrl}" target="_blank" class="like-link-wrapper">
                    <img src="${displayImgUrl}" class="like-img">
                    <div class="like-info">
                        <div class="like-title">${item.name}</div>
                        <div class="like-price">${price}</div>
                    </div>
                </a>
                
                <div class="action-btn folder-btn ${hasCats ? 'active' : ''}" title="加入分類">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                </div>
            `;
            
            if (!isApiSource) {
                const removeBtn = document.createElement('div');
                removeBtn.className = 'action-btn';
                removeBtn.title = '從此分類移除';
                removeBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
                removeBtn.addEventListener('click', () => {
                   if(confirm('確定從分類移除？')) {
                       LocalData.removeItemFromCat(item.shopid, item.itemid, STATE.currentCatId);
                       renderLocalLikes(STATE.currentCatId);
                   }
                });
                li.appendChild(removeBtn);
            }

            li.querySelector('.folder-btn').addEventListener('click', () => {
                openCategoryModal({
                    shopid: item.shopid,
                    itemid: item.itemid,
                    name: item.name,
                    price: item.price,
                    image: displayImgUrl
                });
            });

            listEl.appendChild(li);
        });
    }

    function openCategoryModal(itemData) {
        const modal = document.getElementById('cat-modal');
        const list = document.getElementById('cat-select-list');
        list.innerHTML = '';
        
        const cats = LocalData.getCats().filter(c => c.id !== 'all');
        
        if (cats.length === 0) {
            list.innerHTML = '<div style="padding:20px;text-align:center;">請先在上方建立分類</div>';
        } else {
            cats.forEach(cat => {
                const opt = document.createElement('div');
                opt.className = 'cat-option';
                opt.textContent = cat.name;
                opt.addEventListener('click', () => {
                    LocalData.addItemToCat(itemData, cat.id);
                    modal.classList.remove('show');
                    if (STATE.currentCatId === 'all') {
                        loadData(); 
                    }
                });
                list.appendChild(opt);
            });
        }
        modal.classList.add('show');
    }

    async function fetchTotalCount() {
        try {
            const nativeFetch = (typeof unsafeWindow !== 'undefined' && unsafeWindow.fetch) ? unsafeWindow.fetch : window.fetch;
            const res = await nativeFetch(CONFIG.countApi);
            if (res.ok) {
                const data = await res.json();
                let count = 0;
                if (data.data && typeof data.data.total_count === 'number') {
                    count = data.data.total_count;
                } else if (data.data && data.data.distribution && typeof data.data.distribution.product_liked_count === 'number') {
                    count = data.data.distribution.product_liked_count;
                }
                
                STATE.totalCount = count;
                const totalPages = Math.ceil(count / STATE.pageSize);
                document.getElementById('total-count-display').textContent = ` / 共 ${totalPages} 頁 (共 ${count} 個)`;
            }
        } catch(e) {
            console.error("Total count error", e);
        }
    }

    function formatPrice(price) {
        if (!price) return '$--';
        if (price > 100000) return '$' + (price / 100000).toLocaleString();
        return '$' + price.toLocaleString();
    }

    initNetworkInterceptor();
    createUI();
})();