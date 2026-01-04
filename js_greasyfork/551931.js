// ==UserScript==
// @name         巴哈姆特哈啦區文章黑名單 (Bahamut Forum Blacklist)
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在巴哈姆特哈啦區新增文章黑名單功能，可永久隱藏不想看的文章。按鈕會顯示在文章縮圖上。
// @author       Adapted from YouTube Blacklist Script
// @match        https://forum.gamer.com.tw/B.php*
// @match        https://forum.gamer.com.tw/search.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551931/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%E6%96%87%E7%AB%A0%E9%BB%91%E5%90%8D%E5%96%AE%20%28Bahamut%20Forum%20Blacklist%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551931/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%E6%96%87%E7%AB%A0%E9%BB%91%E5%90%8D%E5%96%AE%20%28Bahamut%20Forum%20Blacklist%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const POST_BLACKLIST_KEY = 'bahamut_post_blacklist_v2';
    const BUTTON_POSITION_KEY = 'bahamut_button_positions_v2';
    const BUTTON_STATE_KEY = 'bahamut_button_states_v2';

    // --- 資料儲存與讀取 ---
    function getPostBlacklist() {
        return GM_getValue(POST_BLACKLIST_KEY, []);
    }

    function savePostBlacklist(blacklist) {
        GM_setValue(POST_BLACKLIST_KEY, blacklist);
    }

    function getButtonPositions() {
        return GM_getValue(BUTTON_POSITION_KEY, { postBtn: { x: 10, y: 70 } });
    }

    function saveButtonPositions(positions) {
        GM_setValue(BUTTON_POSITION_KEY, positions);
    }

    function getButtonStates() {
        return GM_getValue(BUTTON_STATE_KEY, { postBtn: { minimized: false, hidden: false } });
    }

    function saveButtonStates(states) {
        GM_setValue(BUTTON_STATE_KEY, states);
    }

    // --- 核心功能：文章資訊提取 ---
    function extractPostId(postElement) {
        const anchor = postElement.querySelector('td.b-list__summary > a[name]');
        return anchor ? anchor.getAttribute('name') : null;
    }

    function extractPostTitle(postElement) {
        const titleElement = postElement.querySelector('.b-list__main__title');
        return titleElement ? titleElement.textContent.trim() : null;
    }

    // --- 核心功能：介面操作 ---
    function hideBlacklistedPosts() {
        const blacklist = getPostBlacklist();
        if (blacklist.length === 0) return;

        const blacklistedIds = new Set(blacklist.map(item => item.id));
        if (blacklistedIds.size === 0) return;

        document.querySelectorAll('tr.b-list-item').forEach(postRow => {
            const postId = extractPostId(postRow);
            if (postId && blacklistedIds.has(postId)) {
                postRow.style.display = 'none';
            }
        });
    }

    /**
     * 為每篇文章添加黑名單按鈕 (已更新)
     */
    function addBlacklistButtons() {
        const blacklistedIds = new Set(getPostBlacklist().map(item => item.id));

        document.querySelectorAll('tr.b-list-item').forEach(postRow => {
            if (postRow.querySelector('.post-blacklist-btn')) return;

            const postId = extractPostId(postRow);
            if (!postId || blacklistedIds.has(postId)) return;

            const postTitle = extractPostTitle(postRow);
            if (!postTitle) return;

            // 尋找最佳的按鈕容器，優先使用縮圖容器
            let buttonContainer = postRow.querySelector('.b-list__img');
            if (!buttonContainer) {
                // 如果沒有縮圖，則退回使用主內容儲存格
                buttonContainer = postRow.querySelector('td.b-list__main');
            }

            if (buttonContainer) {
                // 確保容器可以進行絕對定位
                if (getComputedStyle(buttonContainer).position === 'static') {
                    buttonContainer.style.position = 'relative';
                }
                const blacklistBtn = createBlacklistButton(postId, postTitle);
                buttonContainer.appendChild(blacklistBtn);

                // 為整篇文章的橫條添加滑鼠移入/移出事件，以控制按鈕的顯示
                postRow.addEventListener('mouseenter', () => { blacklistBtn.style.opacity = '1'; });
                postRow.addEventListener('mouseleave', () => { blacklistBtn.style.opacity = '0'; });
            }
        });
    }

    /**
     * 創建一個黑名單按鈕 (已更新樣式)
     */
    function createBlacklistButton(postId, postTitle) {
        const btn = document.createElement('button');
        btn.className = 'post-blacklist-btn';
        btn.title = '將此文章加入黑名單';
        btn.dataset.postId = postId;
        btn.dataset.postTitle = postTitle;

        btn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            z-index: 10;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            border: 2px solid white;
            box-shadow: 0 1px 4px rgba(0,0,0,0.7);
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            opacity: 0; /* 預設隱藏，由 mouseenter 控制顯示 */
        `;
        btn.textContent = '✕';

        btn.addEventListener('mouseover', function() { this.style.backgroundColor = 'rgba(220, 53, 69, 1)'; this.style.transform = 'scale(1.1)'; });
        btn.addEventListener('mouseout', function() { this.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; this.style.transform = 'scale(1)'; });

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();

            const pId = this.dataset.postId;
            const pTitle = this.dataset.postTitle;
            let blacklist = getPostBlacklist();

            if (!blacklist.some(item => item.id === pId)) {
                blacklist.push({ id: pId, title: pTitle });
                savePostBlacklist(blacklist);
                this.closest('tr.b-list-item').style.display = 'none';
            }
        });

        return btn;
    }

    function showPostBlacklistPanel() {
        if (document.querySelector('.post-blacklist-panel')) {
            document.querySelector('.post-blacklist-panel').remove();
            return;
        }

        let blacklist = getPostBlacklist();
        const panel = document.createElement('div');
        panel.className = 'post-blacklist-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h2>文章黑名單管理</h2>
                <button class="close-btn" title="關閉">&times;</button>
            </div>
            <p class="stats-text">已封鎖 ${blacklist.length} 篇文章</p>
            <div class="search-container">
                <input type="text" id="post-search-input" placeholder="搜尋文章標題...">
            </div>
            <ul id="post-blacklist-items"></ul>
            <div class="panel-footer">
                <button id="clear-all-btn">清空黑名單</button>
            </div>
        `;
        document.body.appendChild(panel);

        const itemsUl = panel.querySelector('#post-blacklist-items');
        const searchInput = panel.querySelector('#post-search-input');
        const statsText = panel.querySelector('.stats-text');

        const renderBlacklistItems = (filterText = '') => {
            itemsUl.innerHTML = '';
            const filteredList = filterText
                ? blacklist.filter(post => post.title.toLowerCase().includes(filterText.toLowerCase()))
                : blacklist;

            if (filteredList.length === 0) {
                itemsUl.innerHTML = `<li class="empty-item">${filterText ? '沒有找到匹配的文章' : '黑名單目前是空的'}</li>`;
            } else {
                filteredList.forEach(post => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span title="${post.title}">${post.title}</span><button class="restore-btn" data-id="${post.id}">恢復</button>`;
                    itemsUl.appendChild(li);
                });
            }
            statsText.textContent = filterText ? `找到 ${filteredList.length} 篇文章 (共 ${blacklist.length} 篇)` : `已封鎖 ${blacklist.length} 篇文章`;
        };

        renderBlacklistItems();
        searchInput.addEventListener('input', () => renderBlacklistItems(searchInput.value));
        panel.querySelector('.close-btn').addEventListener('click', () => panel.remove());
        panel.querySelector('#clear-all-btn').addEventListener('click', () => {
            if (confirm('確定要清空所有文章黑名單嗎？此操作無法復原。')) {
                savePostBlacklist([]);
                panel.remove();
                location.reload();
            }
        });

        itemsUl.addEventListener('click', e => {
            if (e.target.classList.contains('restore-btn')) {
                const postId = e.target.dataset.id;
                blacklist = blacklist.filter(p => p.id !== postId);
                savePostBlacklist(blacklist);
                renderBlacklistItems(searchInput.value);
            }
        });
    }

    // --- 浮動按鈕與其管理功能 ---
    function createManageButton(type, text, onClick, defaultX, defaultY) {
        const positions = getButtonPositions();
        const states = getButtonStates();
        const btn = document.createElement('button');
        btn.className = `${type}-manage-btn`;
        btn.textContent = text;
        const pos = positions[type] || { x: defaultX, y: defaultY };
        btn.style.left = `${pos.x}px`;
        btn.style.top = `${pos.y}px`;
        const state = states[type] || { minimized: false, hidden: false };
        if (state.minimized) minimizeButton(btn, type);
        if (state.hidden) btn.style.display = 'none';
        btn.addEventListener('click', onClick);
        makeDraggable(btn, type);
        btn.addEventListener('contextmenu', e => {
            e.preventDefault();
            showButtonContextMenu(e, btn, type);
        });
        document.body.appendChild(btn);
    }

    function makeDraggable(element, type) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const dragMouseDown = e => {
            if (e.button !== 0) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };
        const elementDrag = e => {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = `${element.offsetTop - pos2}px`;
            element.style.left = `${element.offsetLeft - pos1}px`;
        };
        const closeDragElement = () => {
            document.onmouseup = null;
            document.onmousemove = null;
            const positions = getButtonPositions();
            positions[type] = { x: element.offsetLeft, y: element.offsetTop };
            saveButtonPositions(positions);
        };
        element.onmousedown = dragMouseDown;
    }

    function showButtonContextMenu(e, button, type) {
        document.querySelector('.button-context-menu')?.remove();
        const menu = document.createElement('div');
        menu.className = 'button-context-menu';
        menu.innerHTML = `<div class="context-item" data-action="minimize">縮小/還原</div><div class="context-item" data-action="hide">${button.style.display === 'none' ? '顯示' : '隱藏'}</div>`;
        menu.style.left = `${e.pageX}px`;
        menu.style.top = `${e.pageY}px`;
        document.body.appendChild(menu);
        menu.addEventListener('click', e => {
            const action = e.target.dataset.action;
            if (action === 'minimize') toggleMinimizeButton(button, type);
            if (action === 'hide') toggleHideButton(button, type);
            menu.remove();
        });
        const closeMenu = e => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu, true);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu, true), 0);
    }

    const minimizeButton = (button, type) => {
        button.textContent = '文';
        button.style.width = '40px';
        button.style.height = '40px';
        button.style.padding = '0';
        button.style.borderRadius = '50%';
        button.title = '管理文章黑名單';
    };
    const restoreButton = (button, type) => {
        button.textContent = '管理文章黑名單';
        button.style.width = '';
        button.style.height = '';
        button.style.padding = '10px 15px';
        button.style.borderRadius = '5px';
        button.title = '';
    };

    function toggleMinimizeButton(button, type) {
        const states = getButtonStates();
        const state = states[type] || { minimized: false, hidden: false };
        state.minimized = !state.minimized;
        state.minimized ? minimizeButton(button, type) : restoreButton(button, type);
        states[type] = state;
        saveButtonStates(states);
    }

    function toggleHideButton(button, type) {
        const states = getButtonStates();
        const state = states[type] || { minimized: false, hidden: false };
        state.hidden = !state.hidden;
        button.style.display = state.hidden ? 'none' : 'block';
        states[type] = state;
        saveButtonStates(states);
        checkGlobalTrigger();
    }

    const checkGlobalTrigger = () => { getButtonStates().postBtn?.hidden ? addGlobalTrigger() : removeGlobalTrigger(); };
    const addGlobalTrigger = () => {
        if (document.querySelector('.global-trigger-btn')) return;
        const trigger = document.createElement('button');
        trigger.className = 'global-trigger-btn';
        trigger.textContent = '黑';
        trigger.title = '顯示黑名單管理按鈕';
        trigger.addEventListener('click', showAllButtons);
        document.body.appendChild(trigger);
    };
    const removeGlobalTrigger = () => document.querySelector('.global-trigger-btn')?.remove();
    const showAllButtons = () => {
        const states = getButtonStates();
        states.postBtn.hidden = false;
        saveButtonStates(states);
        document.querySelector('.postBtn-manage-btn')?.style.setProperty('display', 'block', 'important');
        removeGlobalTrigger();
    };
    const addManageButtons = () => {
        if (document.querySelector('.postBtn-manage-btn')) return;
        createManageButton('postBtn', '管理文章黑名單', showPostBlacklistPanel, 10, 70);
        checkGlobalTrigger();
    };

    // --- 腳本初始化與監聽 ---
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // 使用 requestAnimationFrame 來避免短時間內重複觸發
                requestAnimationFrame(() => {
                    hideBlacklistedPosts();
                    addBlacklistButtons();
                });
                break;
            }
        }
    });

    function initialize() {
        console.log('巴哈姆特黑名單腳本 v1.3 啟動！');
        hideBlacklistedPosts();
        addBlacklistButtons();
        addManageButtons();
        const targetNode = document.querySelector('.b-list-wrap') || document.body;
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // --- CSS 樣式注入 ---
    GM_addStyle(`
        /* 管理面板樣式... (與前一版相同) */
        .post-blacklist-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:600px;background-color:#333;color:#eee;border:1px solid #555;border-radius:8px;z-index:10000;box-shadow:0 5px 15px rgba(0,0,0,0.5);font-family:'Microsoft JhengHei','微軟正黑體',sans-serif;}.panel-header{display:flex;justify-content:space-between;align-items:center;padding:10px 20px;background-color:#444;border-bottom:1px solid #555;border-top-left-radius:8px;border-top-right-radius:8px;}.panel-header h2{margin:0;font-size:18px;}.close-btn{background:none;border:none;color:#ccc;font-size:24px;cursor:pointer;line-height:1;padding:0 5px;}.close-btn:hover{color:#fff;}.stats-text{padding:10px 20px;margin:0;font-size:14px;color:#aaa;}.search-container{padding:0 20px 10px;}#post-search-input{width:100%;padding:8px;background-color:#222;border:1px solid #555;border-radius:4px;color:#eee;box-sizing:border-box;}#post-blacklist-items{list-style:none;padding:0;margin:0 20px;max-height:50vh;overflow-y:auto;border:1px solid #444;border-radius:4px;}#post-blacklist-items li{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid #444;}#post-blacklist-items li:last-child{border-bottom:none;}#post-blacklist-items li.empty-item{justify-content:center;color:#888;padding:20px;}#post-blacklist-items li span{flex-grow:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-right:10px;}.restore-btn{background-color:#28a745;color:white;border:none;border-radius:3px;padding:4px 8px;cursor:pointer;flex-shrink:0;}.restore-btn:hover{background-color:#218838;}.panel-footer{padding:15px 20px;text-align:right;border-top:1px solid #555;}#clear-all-btn{background-color:#dc3545;color:white;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;}#clear-all-btn:hover{background-color:#c82333;}
        /* 浮動按鈕 */
        .postBtn-manage-btn{position:fixed;z-index:9999;padding:10px 15px;border:none;border-radius:5px;background-color:#0092c7;color:white;cursor:grab;font-weight:bold;box-shadow:0 2px 5px rgba(0,0,0,0.3);transition:all 0.2s;}.postBtn-manage-btn:active{cursor:grabbing;}
        /* 右鍵菜單 */
        .button-context-menu{position:fixed;z-index:10000;background-color:#333;border:1px solid #555;border-radius:4px;padding:5px 0;box-shadow:0 2px 10px rgba(0,0,0,0.5);color:#eee;}.context-item{padding:8px 15px;cursor:pointer;}.context-item:hover{background-color:#444;}
        /* 全局觸發按鈕 */
        .global-trigger-btn{position:fixed;bottom:20px;right:20px;z-index:9999;width:40px;height:40px;border-radius:50%;background-color:#0092c7;color:white;border:none;cursor:pointer;font-weight:bold;font-size:16px;box-shadow:0 2px 5px rgba(0,0,0,0.3);}
    `);
})();