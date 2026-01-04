// ==UserScript==
// @name         YouTube 黑名單功能09-19
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  在 YouTube 中添加影片和頻道黑名單功能，分別封鎖不需要的內容（新增搜尋功能，完全避開 Trusted Types 錯誤，支援合輯內容）
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551864/YouTube%20%E9%BB%91%E5%90%8D%E5%96%AE%E5%8A%9F%E8%83%BD09-19.user.js
// @updateURL https://update.greasyfork.org/scripts/551864/YouTube%20%E9%BB%91%E5%90%8D%E5%96%AE%E5%8A%9F%E8%83%BD09-19.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定義黑名單儲存鍵
    const VIDEO_BLACKLIST_KEY = 'youtube_video_blacklist';
    const CHANNEL_BLACKLIST_KEY = 'youtube_channel_blacklist';
    const BUTTON_POSITION_KEY = 'youtube_button_positions';
    const BUTTON_STATE_KEY = 'youtube_button_states';

    // 從 GM_getValue 獲取黑名單
    function getVideoBlacklist() {
        return GM_getValue(VIDEO_BLACKLIST_KEY, []);
    }

    function getChannelBlacklist() {
        return GM_getValue(CHANNEL_BLACKLIST_KEY, []);
    }

    // 儲存黑名單到 GM_setValue
    function saveVideoBlacklist(blacklist) {
        GM_setValue(VIDEO_BLACKLIST_KEY, blacklist);
    }

    function saveChannelBlacklist(blacklist) {
        GM_setValue(CHANNEL_BLACKLIST_KEY, blacklist);
    }

    // 獲取和儲存按鈕位置
    function getButtonPositions() {
        return GM_getValue(BUTTON_POSITION_KEY, {
            videoBtn: { x: 200, y: 70 },
            channelBtn: { x: 10, y: 70 }
        });
    }

    function saveButtonPositions(positions) {
        GM_setValue(BUTTON_POSITION_KEY, positions);
    }

    // 獲取和儲存按鈕狀態
    function getButtonStates() {
        return GM_getValue(BUTTON_STATE_KEY, {
            videoBtn: { minimized: false, hidden: false },
            channelBtn: { minimized: false, hidden: false }
        });
    }

    function saveButtonStates(states) {
        GM_setValue(BUTTON_STATE_KEY, states);
    }

    // 安全創建元素函數（完全避開 innerHTML）
    function createSafeElement(tag, attributes = {}, styles = {}, textContent = '') {
        const element = document.createElement(tag);

        // 設置屬性
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }

        // 設置樣式
        for (const [key, value] of Object.entries(styles)) {
            element.style[key] = value;
        }

        // 設置文字內容
        if (textContent) {
            element.textContent = textContent;
        }

        return element;
    }

    // 提取影片標題 (增強版，支援合輯內容)
    function extractVideoTitle(element) {
        // 嘗試多種選擇器來找到標題元素
        const titleSelectors = [
            'h3 a',
            '#video-title',
            '.yt-lockup-metadata-view-model__title',
            'a[aria-label*="秒"]',
            'a[aria-label*="分"]',
            'a[aria-label*="時"]',
            'yt-formatted-string.ytd-video-renderer',
            'yt-formatted-string.ytd-rich-item-renderer'
        ];

        let titleElement = null;
        for (const selector of titleSelectors) {
            titleElement = element.querySelector(selector);
            if (titleElement) break;
        }

        if (!titleElement) return null;

        // 從不同屬性獲取標題文本
        let title = titleElement.getAttribute('title') ||
                   titleElement.getAttribute('aria-label') ||
                   titleElement.textContent.trim();

        // 處理包含時間信息的標題 (例如: "10:30 影片標題")
        if (title && (title.includes('秒') || title.includes('分') || title.includes('時'))) {
            // 分割字符串並取最後一部分作為標題
            const parts = title.split(' ');
            if (parts.length > 1) {
                title = parts.slice(1).join(' ');
            }
        }

        return title;
    }

    // 提取頻道名稱
    function extractChannelName(element) {
        const channelSelectors = [
            'ytd-channel-name a',
            '#channel-name a',
            'ytd-video-meta-block a',
            'a.yt-formatted-string[href*="/channel/"]',
            'a.yt-formatted-string[href*="/user/"]',
            'a.yt-core-attributed-string__link',
            '.yt-content-metadata-view-model__metadata-text' // 合輯頻道名稱選擇器
        ];

        let channelElement = null;
        for (const selector of channelSelectors) {
            channelElement = element.querySelector(selector);
            if (channelElement) break;
        }

        if (!channelElement) return null;

        let channelName = channelElement.getAttribute('title') ||
                         channelElement.textContent.trim();

        if (channelName) {
            channelName = channelName.replace(/\s*•\s*$/, '').trim();
        }

        return channelName;
    }

    // 隱藏黑名單中的影片
    function hideBlacklistedVideos() {
        const blacklist = getVideoBlacklist();
        if (blacklist.length === 0) return;

        // 選擇所有可能的影片元素
        const videoSelectors = [
            'ytd-rich-item-renderer',
            'ytd-video-renderer',
            'ytd-grid-video-renderer',
            'ytd-playlist-renderer' // 新增合輯選擇器
        ];

        videoSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(card => {
                const title = extractVideoTitle(card);
                if (title && blacklist.some(blacklistedTitle =>
                    title.includes(blacklistedTitle) || blacklistedTitle.includes(title))) {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 隱藏黑名單頻道的影片
    function hideBlacklistedChannels() {
        const blacklist = getChannelBlacklist();
        if (blacklist.length === 0) return;

        // 選擇所有可能的影片元素
        const videoSelectors = [
            'ytd-rich-item-renderer',
            'ytd-video-renderer',
            'ytd-grid-video-renderer',
            'ytd-playlist-renderer' // 新增合輯選擇器
        ];

        videoSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(card => {
                const channelName = extractChannelName(card);
                if (channelName && blacklist.includes(channelName)) {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 為每個影片添加移除按鈕
    function addRemoveButtons() {
        const videoBlacklist = getVideoBlacklist();
        const channelBlacklist = getChannelBlacklist();

        // 選擇所有可能的影片元素
        const videoSelectors = [
            'ytd-rich-item-renderer',
            'ytd-video-renderer',
            'ytd-grid-video-renderer',
            'ytd-playlist-renderer' // 新增合輯選擇器
        ];

        videoSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(card => {
                // 檢查是否已經添加了按鈕
                if (card.querySelector('.video-remove-btn') && card.querySelector('.channel-remove-btn')) return;

                const title = extractVideoTitle(card);
                const channelName = extractChannelName(card);

                if (!title || !channelName) return;

                // 確保卡片有相對定位，以便按鈕可以絕對定位
                if (getComputedStyle(card).position === 'static') {
                    card.style.position = 'relative';
                }

                // 添加影片移除按鈕
                if (!card.querySelector('.video-remove-btn') && !videoBlacklist.some(t => title.includes(t) || t.includes(title))) {
                    const removeBtn = createVideoRemoveButton(title);
                    card.appendChild(removeBtn);
                }

                // 添加頻道移除按鈕
                if (!card.querySelector('.channel-remove-btn') && !channelBlacklist.includes(channelName)) {
                    const channelBtn = createChannelRemoveButton(channelName);
                    card.appendChild(channelBtn);
                }
            });
        });
    }

    // 創建影片移除按鈕
    function createVideoRemoveButton(title) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'video-remove-btn';
        removeBtn.title = '移除此影片';
        removeBtn.dataset.title = title;

        removeBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 10;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        `;

        removeBtn.textContent = '✕';

        removeBtn.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            this.style.transform = 'scale(1.1)';
        });

        removeBtn.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            this.style.transform = 'scale(1)';
        });

        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();

            const videoTitle = this.dataset.title;
            let blacklist = getVideoBlacklist();

            if (!blacklist.includes(videoTitle)) {
                blacklist.push(videoTitle);
                saveVideoBlacklist(blacklist);
                this.parentElement.style.display = 'none';
            }
        });

        return removeBtn;
    }

    // 創建頻道移除按鈕
    function createChannelRemoveButton(channelName) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'channel-remove-btn';
        removeBtn.title = '封鎖此頻道';
        removeBtn.dataset.channel = channelName;

        removeBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 43px;
            z-index: 10;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: rgba(255, 0, 0, 0.7);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        `;

        removeBtn.textContent = '✕';

        removeBtn.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
            this.style.transform = 'scale(1.1)';
        });

        removeBtn.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
            this.style.transform = 'scale(1)';
        });

        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();

            const channel = this.dataset.channel;
            let blacklist = getChannelBlacklist();

            if (!blacklist.includes(channel)) {
                blacklist.push(channel);
                saveChannelBlacklist(blacklist);

                // 隱藏這個頻道的所有影片
                hideBlacklistedChannels();
            }
        });

        return removeBtn;
    }

    // 顯示影片黑名單管理面板（完全避開 innerHTML）
    function showVideoBlacklistPanel() {
        const existingPanel = document.querySelector('.video-blacklist-panel');
        if (existingPanel) {
            existingPanel.remove();
            return;
        }

        const blacklist = getVideoBlacklist();

        const panel = document.createElement('div');
        panel.className = 'video-blacklist-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #1c1c1c;
            border: 1px solid #333;
            padding: 20px;
            z-index: 10000;
            max-height: 80vh;
            overflow-y: auto;
            width: 500px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.6);
            border-radius: 8px;
            color: #fff;
            font-family: inherit;
        `;

        if (blacklist.length === 0) {
            // 創建標題
            const title = createSafeElement('h2', {}, {
                marginTop: '0',
                color: '#ffcc00',
                borderBottom: '1px solid #444',
                paddingBottom: '10px'
            }, '影片黑名單管理');
            panel.appendChild(title);

            // 創建空狀態提示
            const emptyMsg = createSafeElement('p', {}, {
                textAlign: 'center',
                padding: '20px'
            }, '黑名單為空');
            panel.appendChild(emptyMsg);

            // 創建按鈕容器
            const buttonContainer = createSafeElement('div', {}, {
                marginTop: '20px',
                textAlign: 'right'
            });

            // 創建關閉按鈕
            const closeBtn = createSafeElement('button', {
                id: 'close-btn'
            }, {
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#6c757d',
                color: 'white',
                cursor: 'pointer'
            }, '關閉');

            closeBtn.addEventListener('click', function() {
                panel.remove();
            });

            buttonContainer.appendChild(closeBtn);
            panel.appendChild(buttonContainer);
        } else {
            // 創建標題
            const title = createSafeElement('h2', {}, {
                marginTop: '0',
                color: '#ffcc00',
                borderBottom: '1px solid #444',
                paddingBottom: '10px'
            }, '影片黑名單管理');
            panel.appendChild(title);

            // 創建統計信息
            const statsText = createSafeElement('p', {}, {
                color: '#aaa',
                fontSize: '14px'
            }, `已屏蔽 ${blacklist.length} 個影片`);
            panel.appendChild(statsText);

            // 創建搜尋框容器
            const searchContainer = createSafeElement('div', {}, {
                margin: '15px 0'
            });

            // 創建搜尋框
            const searchInput = createSafeElement('input', {
                type: 'text',
                id: 'video-search-input',
                placeholder: '搜尋影片標題...'
            }, {
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #444',
                backgroundColor: '#2a2a2a',
                color: 'white',
                boxSizing: 'border-box'
            });

            searchContainer.appendChild(searchInput);
            panel.appendChild(searchContainer);

            // 創建列表容器
            const blacklistItems = createSafeElement('ul', {
                id: 'video-blacklist-items'
            }, {
                listStyle: 'none',
                padding: '0',
                maxHeight: '300px',
                overflowY: 'auto'
            });
            panel.appendChild(blacklistItems);

            // 創建按鈕容器
            const buttonContainer = createSafeElement('div', {}, {
                marginTop: '20px',
                textAlign: 'right'
            });

            // 創建清空按鈕
            const clearBtn = createSafeElement('button', {
                id: 'clear-all-btn'
            }, {
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#dc3545',
                color: 'white',
                cursor: 'pointer',
                marginRight: '10px'
            }, '清空黑名單');

            // 創建關閉按鈕
            const closeBtn = createSafeElement('button', {
                id: 'close-btn'
            }, {
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#6c757d',
                color: 'white',
                cursor: 'pointer'
            }, '關閉');

            buttonContainer.appendChild(clearBtn);
            buttonContainer.appendChild(closeBtn);
            panel.appendChild(buttonContainer);

            // 渲染黑名單項目
            function renderBlacklistItems(filterText = '') {
                try {
                    // 清空列表
                    while (blacklistItems.firstChild) {
                        blacklistItems.removeChild(blacklistItems.firstChild);
                    }

                    const filteredList = filterText ?
                        blacklist.filter(title => title.toLowerCase().includes(filterText.toLowerCase())) :
                        blacklist;

                    if (filteredList.length === 0) {
                        const emptyMsg = createSafeElement('p', {}, {
                            textAlign: 'center',
                            padding: '20px',
                            color: filterText ? '#aaa' : 'inherit'
                        }, filterText ? '沒有找到匹配的影片' : '黑名單為空');
                        blacklistItems.appendChild(emptyMsg);

                        // 更新統計信息
                        statsText.textContent = filterText ?
                            `找到 0 個匹配的影片 (共 ${blacklist.length} 個)` :
                            `已屏蔽 ${blacklist.length} 個影片`;
                        return;
                    }

                    filteredList.forEach(title => {
                        const li = createSafeElement('li', {}, {
                            marginBottom: '10px',
                            padding: '8px',
                            backgroundColor: '#2a2a2a',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        });

                        const titleSpan = createSafeElement('span', {}, {
                            flexGrow: '1',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }, title);
                        li.appendChild(titleSpan);

                        const restoreBtn = createSafeElement('button', {
                            className: 'restore-btn',
                            'data-title': title
                        }, {
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            marginLeft: '10px'
                        }, '恢復');

                        li.appendChild(restoreBtn);
                        blacklistItems.appendChild(li);
                    });

                    // 更新統計信息
                    statsText.textContent = filterText ?
                        `找到 ${filteredList.length} 個匹配的影片 (共 ${blacklist.length} 個)` :
                        `已屏蔽 ${blacklist.length} 個影片`;
                } catch (error) {
                    console.error('渲染黑名單時發生錯誤:', error);

                    // 清空列表
                    while (blacklistItems.firstChild) {
                        blacklistItems.removeChild(blacklistItems.firstChild);
                    }

                    const errorMsg = createSafeElement('p', {}, {
                        textAlign: 'center',
                        padding: '20px',
                        color: '#ff6b6b'
                    }, '渲染錯誤，請刷新頁面重試');
                    blacklistItems.appendChild(errorMsg);
                }
            }

            // 初始渲染
            renderBlacklistItems();

            // 搜尋功能
            searchInput.addEventListener('input', function() {
                renderBlacklistItems(this.value);
            });

            // 清空按鈕事件
            clearBtn.addEventListener('click', function() {
                if (confirm('確定要清空影片黑名單嗎？所有隱藏的影片將重新顯示。')) {
                    saveVideoBlacklist([]);
                    panel.remove();
                    location.reload();
                }
            });

            // 使用事件委託處理恢復按鈕
            panel.addEventListener('click', function(e) {
                if (e.target.classList.contains('restore-btn')) {
                    const title = e.target.dataset.title;
                    let blacklist = getVideoBlacklist();

                    if (blacklist.includes(title)) {
                        blacklist = blacklist.filter(t => t !== title);
                        saveVideoBlacklist(blacklist);

                        // 重新渲染列表
                        renderBlacklistItems(searchInput.value);

                        if (blacklist.length === 0) {
                            clearBtn.style.display = 'none';
                        }
                    }
                }
            });

            // 關閉按鈕事件
            closeBtn.addEventListener('click', function() {
                panel.remove();
            });
        }

        document.body.appendChild(panel);
    }

    // 顯示頻道黑名單管理面板（完全避開 innerHTML）
    function showChannelBlacklistPanel() {
        const existingPanel = document.querySelector('.channel-blacklist-panel');
        if (existingPanel) {
            existingPanel.remove();
            return;
        }

        const blacklist = getChannelBlacklist();

        const panel = document.createElement('div');
        panel.className = 'channel-blacklist-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #1c1c1c;
            border: 1px solid #333;
            padding: 20px;
            z-index: 10000;
            max-height: 80vh;
            overflow-y: auto;
            width: 500px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.6);
            border-radius: 8px;
            color: #fff;
            font-family: inherit;
        `;

        if (blacklist.length === 0) {
            // 創建標題
            const title = createSafeElement('h2', {}, {
                marginTop: '0',
                color: '#ffcc00',
                borderBottom: '1px solid #444',
                paddingBottom: '10px'
            }, '頻道黑名單管理');
            panel.appendChild(title);

            // 創建空狀態提示
            const emptyMsg = createSafeElement('p', {}, {
                textAlign: 'center',
                padding: '20px'
            }, '黑名單為空');
            panel.appendChild(emptyMsg);

            // 創建按鈕容器
            const buttonContainer = createSafeElement('div', {}, {
                marginTop: '20px',
                textAlign: 'right'
            });

            // 創建關閉按鈕
            const closeBtn = createSafeElement('button', {
                id: 'close-btn'
            }, {
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#6c757d',
                color: 'white',
                cursor: 'pointer'
            }, '關閉');

            closeBtn.addEventListener('click', function() {
                panel.remove();
            });

            buttonContainer.appendChild(closeBtn);
            panel.appendChild(buttonContainer);
        } else {
            // 創建標題
            const title = createSafeElement('h2', {}, {
                marginTop: '0',
                color: '#ffcc00',
                borderBottom: '1px solid #444',
                paddingBottom: '10px'
            }, '頻道黑名單管理');
            panel.appendChild(title);

            // 創建統計信息
            const statsText = createSafeElement('p', {}, {
                color: '#aaa',
                fontSize: '14px'
            }, `已屏蔽 ${blacklist.length} 個頻道`);
            panel.appendChild(statsText);

            // 創建搜尋框容器
            const searchContainer = createSafeElement('div', {}, {
                margin: '15px 0'
            });

            // 創建搜尋框
            const searchInput = createSafeElement('input', {
                type: 'text',
                id: 'channel-search-input',
                placeholder: '搜尋頻道名稱...'
            }, {
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #444',
                backgroundColor: '#2a2a2a',
                color: 'white',
                boxSizing: 'border-box'
            });

            searchContainer.appendChild(searchInput);
            panel.appendChild(searchContainer);

            // 創建列表容器
            const blacklistItems = createSafeElement('ul', {
                id: 'channel-blacklist-items'
            }, {
                listStyle: 'none',
                padding: '0',
                maxHeight: '300px',
                overflowY: 'auto'
            });
            panel.appendChild(blacklistItems);

            // 創建按鈕容器
            const buttonContainer = createSafeElement('div', {}, {
                marginTop: '20px',
                textAlign: 'right'
            });

            // 創建清空按鈕
            const clearBtn = createSafeElement('button', {
                id: 'clear-all-btn'
            }, {
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#dc3545',
                color: 'white',
                cursor: 'pointer',
                marginRight: '10px'
            }, '清空黑名單');

            // 創建關閉按鈕
            const closeBtn = createSafeElement('button', {
                id: 'close-btn'
            }, {
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#6c757d',
                color: 'white',
                cursor: 'pointer'
            }, '關閉');

            buttonContainer.appendChild(clearBtn);
            buttonContainer.appendChild(closeBtn);
            panel.appendChild(buttonContainer);

            // 渲染黑名單項目
            function renderBlacklistItems(filterText = '') {
                try {
                    // 清空列表
                    while (blacklistItems.firstChild) {
                        blacklistItems.removeChild(blacklistItems.firstChild);
                    }

                    const filteredList = filterText ?
                        blacklist.filter(channel => channel.toLowerCase().includes(filterText.toLowerCase())) :
                        blacklist;

                    if (filteredList.length === 0) {
                        const emptyMsg = createSafeElement('p', {}, {
                            textAlign: 'center',
                            padding: '20px',
                            color: filterText ? '#aaa' : 'inherit'
                        }, filterText ? '沒有找到匹配的頻道' : '黑名單為空');
                        blacklistItems.appendChild(emptyMsg);

                        // 更新統計信息
                        statsText.textContent = filterText ?
                            `找到 0 個匹配的頻道 (共 ${blacklist.length} 個)` :
                            `已屏蔽 ${blacklist.length} 個頻道`;
                        return;
                    }

                    filteredList.forEach(channel => {
                        const li = createSafeElement('li', {}, {
                            marginBottom: '10px',
                            padding: '8px',
                            backgroundColor: '#2a2a2a',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        });

                        const channelSpan = createSafeElement('span', {}, {
                            flexGrow: '1',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }, channel);
                        li.appendChild(channelSpan);

                        const restoreBtn = createSafeElement('button', {
                            className: 'restore-btn',
                            'data-channel': channel
                        }, {
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            marginLeft: '10px'
                        }, '恢復');

                        li.appendChild(restoreBtn);
                        blacklistItems.appendChild(li);
                    });

                    // 更新統計信息
                    statsText.textContent = filterText ?
                        `找到 ${filteredList.length} 個匹配的頻道 (共 ${blacklist.length} 個)` :
                        `已屏蔽 ${blacklist.length} 個頻道`;
                } catch (error) {
                    console.error('渲染黑名單時發生錯誤:', error);

                    // 清空列表
                    while (blacklistItems.firstChild) {
                        blacklistItems.removeChild(blacklistItems.firstChild);
                    }

                    const errorMsg = createSafeElement('p', {}, {
                        textAlign: 'center',
                        padding: '20px',
                        color: '#ff6b6b'
                    }, '渲染錯誤，請刷新頁面重試');
                    blacklistItems.appendChild(errorMsg);
                }
            }

            // 初始渲染
            renderBlacklistItems();

            // 搜尋功能
            searchInput.addEventListener('input', function() {
                renderBlacklistItems(this.value);
            });

            // 清空按鈕事件
            clearBtn.addEventListener('click', function() {
                if (confirm('確定要清空頻道黑名單嗎？所有隱藏的頻道將重新顯示。')) {
                    saveChannelBlacklist([]);
                    panel.remove();
                    location.reload();
                }
            });

            // 使用事件委託處理恢復按鈕
            panel.addEventListener('click', function(e) {
                if (e.target.classList.contains('restore-btn')) {
                    const channel = e.target.dataset.channel;
                    let blacklist = getChannelBlacklist();

                    if (blacklist.includes(channel)) {
                        blacklist = blacklist.filter(c => c !== channel);
                        saveChannelBlacklist(blacklist);

                        // 重新渲染列表
                        renderBlacklistItems(searchInput.value);

                        if (blacklist.length === 0) {
                            clearBtn.style.display = 'none';
                        }
                    }
                }
            });

            // 關閉按鈕事件
            closeBtn.addEventListener('click', function() {
                panel.remove();
            });
        }

        document.body.appendChild(panel);
    }

    // 創建可拖動的管理按鈕
    function createManageButton(type, text, onClick, defaultX, defaultY) {
        const positions = getButtonPositions();
        const states = getButtonStates();

        const btn = document.createElement('button');
        btn.className = `${type}-manage-btn`;
        btn.textContent = text;

        // 設置初始位置
        const pos = positions[type] || { x: defaultX, y: defaultY };
        btn.style.left = `${pos.x}px`;
        btn.style.top = `${pos.y}px`;

        // 設置初始狀態
        const state = states[type] || { minimized: false, hidden: false };
        if (state.minimized) {
            minimizeButton(btn, type);
        }
        if (state.hidden) btn.style.display = 'none';

        btn.style.cssText += `
            position: fixed;
            z-index: 9999;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            background-color: #ffcc00;
            color: #000;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;

        // 添加點擊事件
        btn.addEventListener('click', onClick);

        // 添加拖動功能
        makeDraggable(btn, type);

        // 添加右鍵菜單
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showButtonContextMenu(e, btn, type);
        });

        document.body.appendChild(btn);
        return btn;
    }

    // 使元素可拖動
    function makeDraggable(element, type) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.button !== 0) return; // 只允許左鍵拖動
            e.preventDefault();
            // 獲取鼠標位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            // 計算新位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 設置元素的新位置
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // 停止移動
            document.onmouseup = null;
            document.onmousemove = null;

            // 保存新位置
            const positions = getButtonPositions();
            positions[type] = {
                x: element.offsetLeft,
                y: element.offsetTop
            };
            saveButtonPositions(positions);
        }
    }

    // 顯示按鈕的右鍵菜單
    function showButtonContextMenu(e, button, type) {
        // 移除現有的上下文菜單
        const existingMenu = document.querySelector('.button-context-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'button-context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${e.pageX}px;
            top: ${e.pageY}px;
            background-color: #2c2c2c;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 5px 0;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        `;

        const minimizeOption = document.createElement('div');
        minimizeOption.textContent = '縮小/還原';
        minimizeOption.style.cssText = `
            padding: 8px 15px;
            cursor: pointer;
            color: #fff;
        `;
        minimizeOption.addEventListener('click', () => {
            toggleMinimizeButton(button, type);
            menu.remove();
        });

        const hideOption = document.createElement('div');
        hideOption.textContent = button.style.display === 'none' ? '顯示' : '隱藏';
        hideOption.style.cssText = `
            padding: 8px 15px;
            cursor: pointer;
            color: #fff;
        `;
        hideOption.addEventListener('click', () => {
            toggleHideButton(button, type);
            menu.remove();
        });

        menu.appendChild(minimizeOption);
        menu.appendChild(hideOption);

        document.body.appendChild(menu);

        // 點擊其他地方關閉菜單
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0);
    }

    // 縮小按鈕
    function minimizeButton(button, type) {
        button.textContent = type === 'videoBtn' ? '影' : '頻';
        button.style.width = '40px';
        button.style.height = '40px';
        button.style.padding = '0';
        button.style.borderRadius = '50%';
    }

    // 還原按鈕
    function restoreButton(button, type) {
        button.textContent = type === 'videoBtn' ? '管理影片黑名單' : '管理頻道黑名單';
        button.style.width = '';
        button.style.height = '';
        button.style.padding = '10px 15px';
        button.style.borderRadius = '5px';
    }

    // 切換按鈕的縮小狀態
    function toggleMinimizeButton(button, type) {
        const states = getButtonStates();
        const state = states[type] || { minimized: false, hidden: false };

        if (state.minimized) {
            // 還原按鈕
            restoreButton(button, type);
            state.minimized = false;
        } else {
            // 縮小按鈕
            minimizeButton(button, type);
            state.minimized = true;
        }

        states[type] = state;
        saveButtonStates(states);
    }

    // 切換按鈕的隱藏狀態
    function toggleHideButton(button, type) {
        const states = getButtonStates();
        const state = states[type] || { minimized: false, hidden: false };

        if (button.style.display === 'none') {
            button.style.display = 'block';
            state.hidden = false;
        } else {
            button.style.display = 'none';
            state.hidden = true;
        }

        states[type] = state;
        saveButtonStates(states);

        // 檢查是否需要顯示全局觸發按鈕
        checkGlobalTrigger();
    }

    // 檢查是否需要顯示全局觸發按鈕
    function checkGlobalTrigger() {
        const states = getButtonStates();
        const videoHidden = states.videoBtn?.hidden || false;
        const channelHidden = states.channelBtn?.hidden || false;

        if (videoHidden && channelHidden) {
            addGlobalTrigger();
        } else {
            removeGlobalTrigger();
        }
    }

    // 添加全局觸發按鈕
    function addGlobalTrigger() {
        if (document.querySelector('.global-trigger-btn')) return;

        const trigger = document.createElement('button');
        trigger.className = 'global-trigger-btn';
        trigger.textContent = '黑';
        trigger.title = '顯示黑名單管理按鈕';

        trigger.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #ffcc00;
            color: #000;
            border: none;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;

        trigger.addEventListener('click', showAllButtons);

        document.body.appendChild(trigger);
    }

    // 移除全局觸發按鈕
    function removeGlobalTrigger() {
        const trigger = document.querySelector('.global-trigger-btn');
        if (trigger) trigger.remove();
    }

    // 顯示所有按鈕
    function showAllButtons() {
        const states = getButtonStates();
        states.videoBtn.hidden = false;
        states.channelBtn.hidden = false;
        saveButtonStates(states);

        document.querySelectorAll('.video-manage-btn, .channel-manage-btn').forEach(btn => {
            btn.style.display = 'block';
        });

        removeGlobalTrigger();
    }

    // 添加管理按鈕
    function addManageButtons() {
        if (document.querySelector('.video-manage-btn') && document.querySelector('.channel-manage-btn')) return;

        // 添加影片黑名單管理按鈕
        if (!document.querySelector('.video-manage-btn')) {
            createManageButton('videoBtn', '管理影片黑名單', showVideoBlacklistPanel, 200, 70);
        }

        // 添加頻道黑名單管理按鈕
        if (!document.querySelector('.channel-manage-btn')) {
            createManageButton('channelBtn', '管理頻道黑名單', showChannelBlacklistPanel, 10, 70);
        }

        // 檢查是否需要顯示全局觸發按鈕
        checkGlobalTrigger();
    }

    // 監聽動態內容加載
    const observer = new MutationObserver(function(mutations) {
        let shouldProcess = false;

        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                shouldProcess = true;
            }
        });

        if (shouldProcess) {
            hideBlacklistedVideos();
            hideBlacklistedChannels();
            addRemoveButtons();
        }
    });

    // 開始監聽頁面變化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 頁面加載時執行
    window.addEventListener('load', function() {
        console.log('YouTube 黑名單腳本開始執行...');
        hideBlacklistedVideos();
        hideBlacklistedChannels();
        addRemoveButtons();
        addManageButtons();
    });

    // 添加一些樣式
    GM_addStyle(`
        .video-remove-btn:hover {
            background-color: rgba(0, 0, 0, 0.9) !important;
        }

        .channel-remove-btn:hover {
            background-color: rgba(255, 0, 0, 0.9) !important;
        }

        .video-blacklist-panel, .channel-blacklist-panel {
            font-family: 'YouTube Noto', Roboto, Arial, sans-serif;
        }

        .video-blacklist-panel h2, .channel-blacklist-panel h2 {
            font-size: 1.5rem;
            margin-bottom: 15px;
        }

        .video-blacklist-panel input, .channel-blacklist-panel input {
            font-size: 14px;
        }

        .restore-btn:hover {
            background-color: #218838 !important;
        }

        #clear-all-btn:hover {
            background-color: #c82333 !important;
        }

        #close-btn:hover {
            background-color: #5a6268 !important;
        }

        .button-context-menu div:hover {
            background-color: #3c3c3c;
        }
    `);
})();