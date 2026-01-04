// ==UserScript==
// @license MIT
// @name         YouTube Video & Channel Blacklist
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  在 YouTube 中添加影片和頻道黑名單功能，分別封鎖不需要的內容
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549148/YouTube%20Video%20%20Channel%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/549148/YouTube%20Video%20%20Channel%20Blacklist.meta.js
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

    // 安全地設置 innerHTML - 修復 Trusted Types 錯誤
    function setTrustedHTML(element, htmlString) {
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            const policy = window.trustedTypes.createPolicy('ytScriptPolicy', {
                createHTML: (s) => s
            });
            element.innerHTML = policy.createHTML(htmlString);
        } else {
            element.innerHTML = htmlString;
        }
    }

    // 提取影片標題
    function extractVideoTitle(element) {
        let titleElement = element.querySelector('h3 a, #video-title, yt-lockup-metadata-view-model__title, a[aria-label*="秒"]');
        if (!titleElement) return null;

        let title = titleElement.getAttribute('title') ||
                   titleElement.getAttribute('aria-label') ||
                   titleElement.textContent.trim();

        if (title && title.includes('秒')) {
            title = title.split(' ')[0];
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
            'a.yt-core-attributed-string__link'
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

        document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer').forEach(card => {
            const title = extractVideoTitle(card);
            if (title && blacklist.includes(title)) {
                card.style.display = 'none';
            }
        });
    }

    // 隱藏黑名單頻道的影片
    function hideBlacklistedChannels() {
        const blacklist = getChannelBlacklist();
        if (blacklist.length === 0) return;

        document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer').forEach(card => {
            const channelName = extractChannelName(card);
            if (channelName && blacklist.includes(channelName)) {
                card.style.display = 'none';
            }
        });
    }

    // 為每個影片添加移除按鈕
    function addRemoveButtons() {
        const videoBlacklist = getVideoBlacklist();
        const channelBlacklist = getChannelBlacklist();

        document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer').forEach(card => {
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
            if (!card.querySelector('.video-remove-btn') && !videoBlacklist.includes(title)) {
                const removeBtn = createVideoRemoveButton(title);
                card.appendChild(removeBtn);
            }

            // 添加頻道移除按鈕
            if (!card.querySelector('.channel-remove-btn') && !channelBlacklist.includes(channelName)) {
                const channelBtn = createChannelRemoveButton(channelName);
                card.appendChild(channelBtn);
            }
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

        setTrustedHTML(removeBtn, '✕');

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

        setTrustedHTML(removeBtn, '✕');

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

    // 顯示影片黑名單管理面板
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
            setTrustedHTML(panel, `
                <h2 style="margin-top: 0; color: #ffcc00; border-bottom: 1px solid #444; padding-bottom: 10px;">影片黑名單管理</h2>
                <p style="text-align: center; padding: 20px;">黑名單為空</p>
                <div style="margin-top: 20px; text-align: right;">
                    <button id="close-btn" style="padding: 8px 16px; border: none; border-radius: 5px; background-color: #6c757d; color: white; cursor: pointer;">關閉</button>
                </div>
            `);
        } else {
            setTrustedHTML(panel, `
                <h2 style="margin-top: 0; color: #ffcc00; border-bottom: 1px solid #444; padding-bottom: 10px;">影片黑名單管理</h2>
                <p style="color: #aaa; font-size: 14px;">已屏蔽 ${blacklist.length} 個影片</p>
                <ul id="video-blacklist-items" style="list-style: none; padding: 0; max-height: 300px; overflow-y: auto;"></ul>
                <div style="margin-top: 20px; text-align: right;">
                    <button id="clear-all-btn" style="padding: 8px 16px; border: none; border-radius: 5px; background-color: #dc3545; color: white; cursor: pointer; margin-right: 10px;">清空黑名單</button>
                    <button id="close-btn" style="padding: 8px 16px; border: none; border-radius: 5px; background-color: #6c757d; color: white; cursor: pointer;">關閉</button>
                </div>
            `);

            const blacklistItems = panel.querySelector('#video-blacklist-items');

            blacklist.forEach(title => {
                const li = document.createElement('li');
                li.style.marginBottom = '10px';
                li.style.padding = '8px';
                li.style.backgroundColor = '#2a2a2a';
                li.style.borderRadius = '4px';
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';

                setTrustedHTML(li, `
                    <span style="flex-grow: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${title}</span>
                    <button class="restore-btn" data-title="${title}" style="background-color: #28a745; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; margin-left: 10px;">恢復</button>
                `);

                blacklistItems.appendChild(li);
            });

            panel.querySelector('#clear-all-btn').addEventListener('click', function() {
                if (confirm('確定要清空影片黑名單嗎？所有隱藏的影片將重新顯示。')) {
                    saveVideoBlacklist([]);
                    panel.remove();
                    location.reload();
                }
            });

            panel.querySelectorAll('.restore-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const title = this.dataset.title;
                    let blacklist = getVideoBlacklist();

                    if (blacklist.includes(title)) {
                        blacklist = blacklist.filter(t => t !== title);
                        saveVideoBlacklist(blacklist);
                        this.parentElement.remove();

                        if (blacklist.length === 0) {
                            panel.querySelector('#video-blacklist-items').innerHTML = '<p style="text-align: center; padding: 20px;">黑名單為空</p>';
                            panel.querySelector('#clear-all-btn').style.display = 'none';
                        }
                    }
                });
            });
        }

        panel.querySelector('#close-btn').addEventListener('click', function() {
            panel.remove();
        });

        document.body.appendChild(panel);
    }

    // 顯示頻道黑名單管理面板
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
            setTrustedHTML(panel, `
                <h2 style="margin-top: 0; color: #ffcc00; border-bottom: 1px solid #444; padding-bottom: 10px;">頻道黑名單管理</h2>
                <p style="text-align: center; padding: 20px;">黑名單為空</p>
                <div style="margin-top: 20px; text-align: right;">
                    <button id="close-btn" style="padding: 8px 16px; border: none; border-radius: 5px; background-color: #6c757d; color: white; cursor: pointer;">關閉</button>
                </div>
            `);
        } else {
            setTrustedHTML(panel, `
                <h2 style="margin-top: 0; color: #ffcc00; border-bottom: 1px solid #444; padding-bottom: 10px;">頻道黑名單管理</h2>
                <p style="color: #aaa; font-size: 14px;">已屏蔽 ${blacklist.length} 個頻道</p>
                <ul id="channel-blacklist-items" style="list-style: none; padding: 0; max-height: 300px; overflow-y: auto;"></ul>
                <div style="margin-top: 20px; text-align: right;">
                    <button id="clear-all-btn" style="padding: 8px 16px; border: none; border-radius: 5px; background-color: #dc3545; color: white; cursor: pointer; margin-right: 10px;">清空黑名單</button>
                    <button id="close-btn" style="padding: 8px 16px; border: none; border-radius: 5px; background-color: #6c757d; color: white; cursor: pointer;">關閉</button>
                </div>
            `);

            const blacklistItems = panel.querySelector('#channel-blacklist-items');

            blacklist.forEach(channel => {
                const li = document.createElement('li');
                li.style.marginBottom = '10px';
                li.style.padding = '8px';
                li.style.backgroundColor = '#2a2a2a';
                li.style.borderRadius = '4px';
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';

                setTrustedHTML(li, `
                    <span style="flex-grow: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${channel}</span>
                    <button class="restore-btn" data-channel="${channel}" style="background-color: #28a745; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; margin-left: 10px;">恢復</button>
                `);

                blacklistItems.appendChild(li);
            });

            panel.querySelector('#clear-all-btn').addEventListener('click', function() {
                if (confirm('確定要清空頻道黑名單嗎？所有隱藏的頻道將重新顯示。')) {
                    saveChannelBlacklist([]);
                    panel.remove();
                    location.reload();
                }
            });

            panel.querySelectorAll('.restore-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const channel = this.dataset.channel;
                    let blacklist = getChannelBlacklist();

                    if (blacklist.includes(channel)) {
                        blacklist = blacklist.filter(c => c !== channel);
                        saveChannelBlacklist(blacklist);
                        this.parentElement.remove();

                        if (blacklist.length === 0) {
                            panel.querySelector('#channel-blacklist-items').innerHTML = '<p style="text-align: center; padding: 20px;">黑名單為空</p>';
                            panel.querySelector('#clear-all-btn').style.display = 'none';
                        }
                    }
                });
            });
        }

        panel.querySelector('#close-btn').addEventListener('click', function() {
            panel.remove();
        });

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