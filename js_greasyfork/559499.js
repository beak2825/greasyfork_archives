// ==UserScript==
// @name        FF14 Wiki 側邊欄書籤
// @namespace   Violentmonkey Scripts
// @match       https://ff14.huijiwiki.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_openInTab
// @version     1.0
// @author      Gemini
// @description 在 FF14 灰機 Wiki 添加便利書籤側邊欄
// @downloadURL https://update.greasyfork.org/scripts/559499/FF14%20Wiki%20%E5%81%B4%E9%82%8A%E6%AC%84%E6%9B%B8%E7%B1%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/559499/FF14%20Wiki%20%E5%81%B4%E9%82%8A%E6%AC%84%E6%9B%B8%E7%B1%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 初始化數據 ---
    let bookmarks = GM_getValue('ff14_bookmarks', []);
    let categories = GM_getValue('ff14_categories', ['預設', '任務', '副本', '採集', '其他']);
    let settings = GM_getValue('ff14_settings', {
        theme: 'light', 
        size: 'medium', 
        openMode: 'new'
    });
    
    let activeView = 'bookmarks'; // 'bookmarks' | 'settings'
    let activeCategory = '預設';
    let dragTarget = null; // 用於拖曳排序

    // --- 樣式設定 ---
    const style = document.createElement('style');
    const updateStyles = () => {
        style.innerHTML = `
            :root {
                --sidebar-width: 380px;
                --category-width: 65px;
                --primary-color: #1890ff;
                
                /* 淺色模式 */
                --bg-light: #ffffff;
                --text-light: #333333;
                --border-light: #eeeeee;
                --item-bg-light: #f9f9f9;
                
                /* 深色模式 (純黑背景 + 淺灰文字) */
                --bg-dark: #000000;
                --text-dark: #b3b3b3; 
                --border-dark: #1a1a1a;
                --item-bg-dark: #0a0a0a;
            }

            #ff14-sidebar-container {
                position: fixed;
                right: calc(-1 * var(--sidebar-width));
                top: 0;
                width: var(--sidebar-width);
                height: 100%;
                z-index: 10000;
                transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                font-family: "PingFang TC", "Microsoft JhengHei", sans-serif;
            }

            #ff14-sidebar-container.open { right: 0; }

            /* 觸發按鈕 */
            #ff14-sidebar-trigger {
                position: absolute;
                left: -60px;
                top: 50%;
                transform: translateY(-50%);
                width: 60px;
                height: 60px;
                background: var(--bg-light);
                color: var(--primary-color);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border-radius: 15px 0 0 15px;
                box-shadow: -4px 0 10px rgba(0,0,0,0.1);
                border: 1px solid var(--border-light);
                border-right: none;
            }
            .dark-mode #ff14-sidebar-trigger { background: var(--bg-dark); border-color: var(--border-dark); color: var(--text-dark); }

            /* 側邊欄主體 */
            #ff14-sidebar-main {
                width: 100%; height: 100%; background: var(--bg-light); color: var(--text-light);
                display: flex; flex-direction: column; box-shadow: -5px 0 15px rgba(0,0,0,0.2);
                border-left: 1px solid var(--border-light); overflow: hidden;
            }
            .dark-mode #ff14-sidebar-main { background: var(--bg-dark); color: var(--text-dark); border-left-color: var(--border-dark); }

            /* 主要佈局 */
            #ff14-main-layout {
                flex: 1;
                display: flex;
                flex-direction: row;
                overflow: hidden;
            }

            /* 左側分類標籤欄 */
            #ff14-category-bar {
                width: var(--category-width); 
                background: rgba(0,0,0,0.02);
                border-right: 1px solid var(--border-light); 
                display: flex; 
                flex-direction: column; 
                padding: 10px 0;
                flex-shrink: 0;
            }
            .dark-mode #ff14-category-bar { border-right-color: var(--border-dark); background: #050505; }

            .cat-item {
                writing-mode: vertical-rl; padding: 22px 0; font-size: 15px; cursor: pointer;
                opacity: 0.4; transition: all 0.2s; text-align: center; display: flex;
                align-items: center; justify-content: center; width: 100%; border-left: 3px solid transparent;
            }
            .cat-item.active {
                opacity: 1; color: var(--primary-color); background: rgba(24, 144, 255, 0.05);
                border-left-color: var(--primary-color); font-weight: bold;
            }
            .cat-settings-icon { margin-top: auto; padding: 15px 0; opacity: 0.4; cursor: pointer; display: flex; justify-content: center; }
            .cat-settings-icon.active { opacity: 1; color: var(--primary-color); }

            /* 右側內容區 */
            #ff14-content-area { flex: 1; overflow-y: auto; padding: 15px; }

            /* 書籤項目 */
            .bookmark-item {
                display: flex; flex-direction: column; margin-bottom: 12px;
                background: var(--item-bg-light); border-radius: 10px; border: 1px solid transparent;
                transition: transform 0.2s; cursor: grab; overflow: hidden;
            }
            .bookmark-item.dragging { opacity: 0.4; }
            .dark-mode .bookmark-item { background: var(--item-bg-dark); border-color: #111; }
            .bookmark-item:hover { border-color: var(--primary-color); background: white; }
            .dark-mode .bookmark-item:hover { background: #0f0f0f; }

            .bookmark-main-content {
                display: flex; justify-content: space-between; align-items: center;
                width: 100%;
            }
            
            /* 顏色裝飾條 */
            .bookmark-color-stripe {
                height: 4px; width: 100%; background: transparent;
            }

            .size-small .bookmark-main-content { padding: 8px 12px; font-size: 12px; }
            .size-medium .bookmark-main-content { padding: 12px 15px; font-size: 14px; }
            .size-large .bookmark-main-content { padding: 18px 20px; font-size: 16px; }

            .bookmark-info { flex: 1; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 10px; }
            .bookmark-actions { display: flex; gap: 10px; opacity: 0; transition: opacity 0.2s; }
            .bookmark-item:hover .bookmark-actions { opacity: 0.5; }
            .bookmark-actions:hover { opacity: 1 !important; }

            /* 設定區樣式 */
            .settings-section { margin-bottom: 25px; }
            .settings-label { font-size: 11px; font-weight: bold; margin-bottom: 10px; opacity: 0.5; }
            .settings-btns { display: flex; gap: 8px; }
            .set-btn {
                flex: 1; padding: 8px; border: 1px solid var(--border-light); border-radius: 6px;
                font-size: 12px; text-align: center; cursor: pointer; background: transparent;
            }
            .dark-mode .set-btn { border-color: var(--border-dark); }
            .set-btn.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }

            /* 分類排序項目 */
            .cat-manage-item {
                padding: 10px 12px; background: rgba(128,128,128,0.1); border-radius: 10px;
                font-size: 13px; cursor: grab; display: flex; align-items: center; gap: 8px;
                margin-bottom: 8px; border: 1px solid transparent;
            }
            .cat-manage-item:hover { border-color: var(--primary-color); background: rgba(128,128,128,0.15); }
            .cat-manage-item.dragging { opacity: 0.4; }

            .footer-btn {
                width: calc(100% - 30px); margin: 15px; padding: 14px; background: var(--primary-color);
                color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: bold;
                box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
                flex-shrink: 0;
            }

            /* 彈窗樣式 */
            #ff14-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.6); z-index: 20000; display: none; align-items: center; justify-content: center;
                font-family: sans-serif;
            }
            #ff14-modal {
                width: 360px; background: #fff; border-radius: 16px; padding: 25px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 15px;
            }
            .dark-mode-active #ff14-modal { background: #111; color: #eee; }
            #ff14-modal h3 { margin: 0 0 10px; font-size: 18px; color: var(--primary-color); }
            .modal-field { display: flex; flex-direction: column; gap: 5px; }
            .modal-field label { font-size: 11px; font-weight: bold; opacity: 0.5; }
            .modal-field input, .modal-field select {
                padding: 12px; border: 1px solid #ddd; border-radius: 8px;
                font-size: 14px; background: transparent; color: inherit;
            }
            .dark-mode-active .modal-field input, .dark-mode-active .modal-field select { border-color: #333; }
            
            /* 顏色選擇器特殊處理 */
            .modal-field input[type="color"] {
                padding: 5px; height: 40px; cursor: pointer;
            }

            .modal-actions { display: flex; gap: 10px; margin-top: 10px; }
            .modal-btn { flex: 1; padding: 12px; border-radius: 10px; cursor: pointer; border: none; font-weight: bold; }
            .btn-cancel { background: rgba(128,128,128,0.1); color: inherit; }
            .btn-save { background: var(--primary-color); color: white; }

            /* 捲軸美化 */
            #ff14-content-area::-webkit-scrollbar { width: 4px; }
            #ff14-content-area::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 10px; }
        `;
    };
    updateStyles();
    document.head.appendChild(style);

    // --- UI 結構 ---
    const container = document.createElement('div');
    container.id = 'ff14-sidebar-container';
    
    container.innerHTML = `
        <div id="ff14-sidebar-trigger">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <div id="ff14-sidebar-main">
            <div id="ff14-main-layout">
                <div id="ff14-category-bar"></div>
                <div id="ff14-content-area" class="size-${settings.size}"></div>
            </div>
            <div id="ff14-footer">
                <button class="footer-btn" id="ff14-add-btn">＋ 加入此頁面</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'ff14-modal-overlay';
    modalOverlay.innerHTML = `
        <div id="ff14-modal">
            <h3 id="modal-title">編輯書籤</h3>
            <div class="modal-field">
                <label>標題</label>
                <input type="text" id="m-name">
            </div>
            <div class="modal-field">
                <label>網址</label>
                <input type="text" id="m-url">
            </div>
            <div class="modal-field">
                <label>分類</label>
                <select id="m-cat"></select>
            </div>
            <div class="modal-field">
                <label>分類色彩條</label>
                <input type="color" id="m-color" value="#1890ff">
            </div>
            <div class="modal-actions">
                <button class="modal-btn btn-cancel" id="m-cancel">取消</button>
                <button class="modal-btn btn-save" id="m-save">儲存</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    // --- 彈窗邏輯 ---
    const showModal = (title, name, url, currentCat, currentColor, onSave) => {
        if (settings.theme === 'dark') modalOverlay.classList.add('dark-mode-active');
        else modalOverlay.classList.remove('dark-mode-active');

        document.getElementById('modal-title').innerText = title;
        document.getElementById('m-name').value = name;
        document.getElementById('m-url').value = url;
        document.getElementById('m-color').value = currentColor || '#1890ff';
        
        const catSelect = document.getElementById('m-cat');
        catSelect.innerHTML = categories.map(c => `<option value="${c}" ${c === currentCat ? 'selected' : ''}>${c}</option>`).join('');
        
        modalOverlay.style.display = 'flex';
        
        const saveBtn = document.getElementById('m-save');
        const cancelBtn = document.getElementById('m-cancel');
        
        const close = () => { modalOverlay.style.display = 'none'; };
        cancelBtn.onclick = close;
        saveBtn.onclick = () => {
            onSave(
                document.getElementById('m-name').value.trim(),
                document.getElementById('m-url').value.trim(),
                document.getElementById('m-cat').value,
                document.getElementById('m-color').value
            );
            close();
        };
    };

    // --- 渲染邏輯 ---
    const renderCategories = () => {
        const catBar = document.getElementById('ff14-category-bar');
        catBar.innerHTML = '';
        categories.forEach(cat => {
            const el = document.createElement('div');
            el.className = `cat-item ${activeView === 'bookmarks' && activeCategory === cat ? 'active' : ''}`;
            el.innerText = cat;
            el.onclick = () => { activeView = 'bookmarks'; activeCategory = cat; render(); };
            catBar.appendChild(el);
        });
        const settingsIcon = document.createElement('div');
        settingsIcon.className = `cat-settings-icon ${activeView === 'settings' ? 'active' : ''}`;
        settingsIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33-1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
        settingsIcon.onclick = () => { activeView = 'settings'; render(); };
        catBar.appendChild(settingsIcon);
    };

    const render = () => {
        const content = document.getElementById('ff14-content-area');
        const addBtn = document.getElementById('ff14-add-btn');
        renderCategories();
        
        if (activeView === 'bookmarks') {
            addBtn.style.display = 'block';
            const filtered = bookmarks.filter(b => (b.category || '預設') === activeCategory);
            
            if (filtered.length === 0) {
                content.innerHTML = `<div style="text-align:center;padding:50px;opacity:0.3;font-size:13px;">該分類中尚無書籤</div>`;
                return;
            }

            content.innerHTML = '';
            filtered.forEach((item) => {
                const realIndex = bookmarks.findIndex(b => b === item);
                const el = document.createElement('div');
                el.className = 'bookmark-item';
                el.draggable = true;
                el.innerHTML = `
                    <div class="bookmark-main-content">
                        <div class="bookmark-info" title="${item.url}">${item.name}</div>
                        <div class="bookmark-actions">
                            <span class="edit-action" title="編輯">✎</span>
                            <span class="delete-action" title="刪除">✕</span>
                        </div>
                    </div>
                    <div class="bookmark-color-stripe" style="background: ${item.color || 'transparent'}"></div>
                `;

                el.ondragstart = () => { dragTarget = realIndex; el.classList.add('dragging'); };
                el.ondragend = () => { el.classList.remove('dragging'); dragTarget = null; };
                el.ondragover = (e) => e.preventDefault();
                el.ondrop = () => {
                    if (dragTarget === null || dragTarget === realIndex) return;
                    const movedItem = bookmarks.splice(dragTarget, 1)[0];
                    bookmarks.splice(realIndex, 0, movedItem);
                    saveData('bookmarks', bookmarks);
                };

                el.querySelector('.bookmark-info').onclick = () => {
                    if (settings.openMode === 'new') { GM_openInTab(item.url, { active: false }); }
                    else { window.location.href = item.url; }
                };

                el.querySelector('.edit-action').onclick = (e) => {
                    e.stopPropagation();
                    showModal('編輯書籤', item.name, item.url, item.category || '預設', item.color, (n, u, c, clr) => {
                        if (n) {
                            bookmarks[realIndex].name = n;
                            bookmarks[realIndex].url = u;
                            bookmarks[realIndex].category = c;
                            bookmarks[realIndex].color = clr;
                            activeCategory = c;
                            saveData('bookmarks', bookmarks);
                        }
                    });
                };

                el.querySelector('.delete-action').onclick = (e) => {
                    e.stopPropagation();
                    if (confirm(`確定刪除「${item.name}」？`)) {
                        bookmarks.splice(realIndex, 1);
                        saveData('bookmarks', bookmarks);
                    }
                };
                content.appendChild(el);
            });
        } else {
            addBtn.style.display = 'none';
            content.innerHTML = `
                <div class="settings-section">
                    <div class="settings-label">色彩主題</div>
                    <div class="settings-btns">
                        <div class="set-btn ${settings.theme === 'light' ? 'active' : ''}" data-k="theme" data-v="light">明亮</div>
                        <div class="set-btn ${settings.theme === 'dark' ? 'active' : ''}" data-k="theme" data-v="dark">深色模式</div>
                    </div>
                </div>
                <div class="settings-section">
                    <div class="settings-label">書籤尺寸</div>
                    <div class="settings-btns">
                        <div class="set-btn ${settings.size === 'small' ? 'active' : ''}" data-k="size" data-v="small">精簡</div>
                        <div class="set-btn ${settings.size === 'medium' ? 'active' : ''}" data-k="size" data-v="medium">標準</div>
                        <div class="set-btn ${settings.size === 'large' ? 'active' : ''}" data-k="size" data-v="large">放大</div>
                    </div>
                </div>
                <div class="settings-section">
                    <div class="settings-label">連結開啟方式</div>
                    <div class="settings-btns">
                        <div class="set-btn ${settings.openMode === 'new' ? 'active' : ''}" data-k="openMode" data-v="new">新分頁</div>
                        <div class="set-btn ${settings.openMode === 'current' ? 'active' : ''}" data-k="openMode" data-v="current">目前頁面</div>
                    </div>
                </div>
                <div class="settings-section">
                    <div class="settings-label">分類管理 (拖曳可排序 / 點擊編輯或刪除)</div>
                    <div id="cat-manage-list"></div>
                    <button id="add-new-cat" style="margin-top:10px; width:100%; padding:10px; font-size:12px; cursor:pointer; background:rgba(128,128,128,0.1); border:1px solid #ddd; border-radius:10px;">＋ 新增分類</button>
                </div>
            `;

            content.querySelectorAll('.set-btn').forEach(btn => {
                btn.onclick = () => { settings[btn.dataset.k] = btn.dataset.v; saveData('settings', settings); applySettings(); };
            });

            const catList = document.getElementById('cat-manage-list');
            categories.forEach((c, idx) => {
                const b = document.createElement('div');
                b.className = 'cat-manage-item';
                b.draggable = true;
                // 修正：僅為非預設分類添加刪除按鈕
                b.innerHTML = `
                    <span style="flex:1">${c}</span>
                    <span class="edit-cat" style="cursor:pointer;opacity:0.5;padding:0 5px;" title="重新命名">✎</span>
                    ${c !== '預設' ? '<span class="del-cat" style="cursor:pointer;opacity:0.5;padding:0 5px;" title="刪除">✕</span>' : ''}
                `;
                
                b.ondragstart = () => { dragTarget = idx; b.classList.add('dragging'); };
                b.ondragend = () => { b.classList.remove('dragging'); dragTarget = null; };
                b.ondragover = (e) => e.preventDefault();
                b.ondrop = () => {
                    if (dragTarget === null || dragTarget === idx) return;
                    const movedCat = categories.splice(dragTarget, 1)[0];
                    categories.splice(idx, 0, movedCat);
                    saveData('categories', categories);
                };

                b.querySelector('.edit-cat').onclick = (e) => {
                    e.stopPropagation();
                    const newCatName = prompt(`請輸入「${c}」的新名稱：`, c);
                    if (newCatName && newCatName.trim() && newCatName !== c) {
                        const trimmedName = newCatName.trim();
                        categories[idx] = trimmedName;
                        bookmarks.forEach(bk => {
                            if (bk.category === c) bk.category = trimmedName;
                        });
                        if (activeCategory === c) activeCategory = trimmedName;
                        saveData('categories', categories);
                        saveData('bookmarks', bookmarks);
                    }
                };

                const delBtn = b.querySelector('.del-cat');
                if (delBtn) {
                    delBtn.onclick = (e) => {
                        e.stopPropagation();
                        if (c === '預設') return; // 安全檢查
                        if (confirm(`刪除分類「${c}」？ (書籤將移至預設)`)) {
                            bookmarks.forEach(bk => { if (bk.category === c) bk.category = '預設'; });
                            categories.splice(idx, 1);
                            saveData('categories', categories);
                            saveData('bookmarks', bookmarks);
                        }
                    };
                }
                catList.appendChild(b);
            });

            document.getElementById('add-new-cat').onclick = () => {
                const n = prompt('輸入新分類名稱：');
                if (n && !categories.includes(n)) { categories.push(n); saveData('categories', categories); }
            };
        }
    };

    const saveData = (key, val) => { GM_setValue(`ff14_${key}`, val); render(); };

    const applySettings = () => {
        if (settings.theme === 'dark') { container.classList.add('dark-mode'); }
        else { container.classList.remove('dark-mode'); }
        document.getElementById('ff14-content-area').className = `size-${settings.size}`;
    };

    // --- 事件處理 ---
    document.getElementById('ff14-sidebar-trigger').onclick = () => container.classList.toggle('open');

    document.getElementById('ff14-add-btn').onclick = () => {
        const title = document.title.replace(' - FF14灰机wiki', '').trim();
        showModal('加入此頁面', title, window.location.href, activeCategory, '#1890ff', (n, u, c, clr) => {
            if (n) {
                bookmarks.unshift({ name: n, url: u, category: c, color: clr });
                activeView = 'bookmarks';
                activeCategory = c;
                saveData('bookmarks', bookmarks);
            }
        });
    };

    applySettings();
    render();

})();