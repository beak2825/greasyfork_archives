// ==UserScript==
// @name         动态首页看直播
// @namespace    http://tampermonkey.net/
// @version      2.23
// @description  动态页替换关注直播列表，点击播放，无痕观看，支持滚轮调节音量，显示人气值和舰长数
// @author       无夏不春风orz
// @license      MIT
// @iconURL      https://www.bilibili.com/favicon.ico
// @icon64URL    https://www.bilibili.com/favicon.ico
// @match        https://t.bilibili.com/*
// @connect      bilibili.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.js
// @require      https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.3/hls.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552858/%E5%8A%A8%E6%80%81%E9%A6%96%E9%A1%B5%E7%9C%8B%E7%9B%B4%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/552858/%E5%8A%A8%E6%80%81%E9%A6%96%E9%A1%B5%E7%9C%8B%E7%9B%B4%E6%92%AD.meta.js
// ==/UserScript==

window.onload = (function() {
    'use strict';
    const newWindow = {
        init: () => {
            return newWindow.Toast.init();
        },
        Toast: {
            init: () => {
                try {
                    const list = [];
                    window.toast = (msg, type = 'info', timeout = 10e3) => {
                        console.log(msg)
                        switch (type){
                            case 'success':
                            case 'info':
                            case 'error':
                                break;
                            default:
                                type = 'info';
                        }
                        const a = $(`<div class='link-toast ${type} fixed' style='z-index:2001;text-align: left;'><span class='toast-text'>${msg}</span> </div>`)[0];
                        document.body.appendChild(a);
                        a.style.top = (document.body.scrollTop + list.length * 50 + 10) + 'px';
                        a.style.left = (document.body.offsetWidth + document.body.scrollLeft - a.offsetWidth)/2 + 'px';
                        list.push(a);
                        setTimeout(() => {
                            a.className += ' out';
                            setTimeout(() => {
                                list.shift();
                                list.forEach((v) => {
                                    v.style.top = (parseInt(v.style.top, 10) - 50) + 'px';
                                });
                                $(a).remove();
                            }, 200);
                        }, timeout);
                    };
                    return $.Deferred().resolve();
                } catch (err){
                    return $.Deferred().reject();
                }
            }
        }
    }
    // 添加自定义CSS样式
    GM_addStyle(`
        .link-toast {
            position: absolute;
            padding: 12px 24px;
            font-size: 20px;
            border-radius: 8px;
            white-space: nowrap;
            color: #fff;
            -webkit-animation: link-msg-move-in-top cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
            animation: link-msg-move-in-top cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
            z-index: 10000;
        }

        .link-toast.fixed {
            position: fixed;
        }

        .link-toast.success {
            background-color: #47d279;
            box-shadow: 0 0.2em 0.1em 0.1em rgba(71,210,121,0.2);
        }

        .link-toast.caution {
            background-color: #ffb243;
            box-shadow: 0 0.2em 0.1em 0.1em rgba(255,190,68,0.2);
        }

        .link-toast.error {
            background-color: #ff6464;
            box-shadow: 0 0.2em 1em 0.1em rgba(255,100,100,0.2);
        }

        .link-toast.info {
            background-color: #48bbf8;
            box-shadow: 0 0.2em 0.1em 0.1em rgba(72,187,248,0.2);
        }

        .link-toast.out {
            animation: link-msg-fade-out cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
        }
        #live-list-container {
            position: sticky;
            min-height: 50vh;
            overflow-y: auto;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            padding: 8px;
            margin-bottom: 8px
        }

        #live-list-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .live-item {
            display: flex;
            align-items: center;
            padding: 8px;
            margin-bottom: 5px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .live-tooltip {
            position: absolute;
            z-index: 100;
            padding: 5px 10px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 4px;
            font-size: 16px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
            max-width: 200px;
            word-wrap: break-word;
        }

        .live-item:hover {
            background-color: #c9ccd0;
        }

        .live-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            margin-right: 10px;
            object-fit: cover;
        }

        .live-info {
            flex: 1;
            overflow: hidden;
        }

        .live-title {
            font-size: 13px;
            color: var(--text3);
            max-height: 32px;
            -webkit-line-clamp: 1;
        }

        .live-name {
            font-size: 15px;
            color: var(--text1);
            -webkit-line-clamp: 2;
            margin-bottom: 2px;
            line-height: 20px;
        }

        .player-container {
            position: fixed;
            width: 800px;
            max-width: 90%;
            height: 450px;
            max-height: 80vh;
            background-color: #000;
            z-index: 10000;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            display: none;
            resize: both;
            min-width: 300px;
            min-height: 200px;
        }

        .live-player-header {
            height: 30px;
            background-color: #333;
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            cursor: move;
            user-select: none;
        }

        .live-player-title {
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            flex: 1;
        }

        .live-player-stats {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #ff9a2e;
            margin-left: 10px;
        }

        .live-player-stat {
            display: flex;
            align-items: center;
            margin-left: 8px;
        }

        .live-player-stat-icon {
            margin-right: 3px;
        }

        .player-controls {
            display: flex;
            align-items: center;
            margin-left: 10px;
        }

        .player-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: 5px;
            font-size: 14px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .player-btn:hover {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }

        .player-video {
            width: 100%;
            height: calc(100% - 30px);
        }

        #custom-room-input {
            display: flex;
        }

        #room-id-input {
            flex: 1;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px 0 0 4px;
            outline: none;
        }

        #play-custom-btn {
            background-color: #00a1d6;
            color: white;
            border: none;
            padding: 0 12px;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
        }

        #play-custom-btn:hover {
            background-color: #0088b7;
        }

        #history-dropdown {
            position: relative;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        #history-toggle {
            background-color: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            width: 100%;
            text-align: left;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #history-toggle:hover {
            background-color: #e0e0e0;
        }

        #history-toggle::after {
            content: "▼";
            font-size: 10px;
            margin-left: 5px;
        }

        #history-toggle.active::after {
            content: "▲";
        }

        #history-list {
            display: none;
            position: absolute;
            width: 100%;
            max-height: 300px;
            overflow-y: auto;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            z-index: 1000;
            margin-top: 5px;
        }

        #history-list.show {
            display: block;
        }

        .history-item {
            padding: 8px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
        }

        .history-item:last-child {
            border-bottom: none;
        }

        .history-item:hover {
            background-color: #f5f5f5;
        }

        .history-item-name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .history-item-roomid {
            color: #999;
            margin-left: 5px;
        }

        .history-item-delete {
            color: #ccc;
            margin-left: 5px;
        }

        .history-item:hover .history-item-delete {
            color: #f56c6c;
        }

        #clear-history-btn {
            display: block;
            width: 100%;
            padding: 5px;
            background-color: #f8f8f8;
            border: none;
            border-top: 1px solid #eee;
            color: #f56c6c;
            cursor: pointer;
        }

        #clear-history-btn:hover {
            background-color: #f0f0f0;
        }

        /* 弹幕发送窗口样式 */
        .danmaku-send-container {
            position: fixed;
            width: 300px;
            height: 120px;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            display: none;
            min-width: 250px;
        }

        .danmaku-send-header {
            height: 30px;
            background-color: #333;
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            cursor: move;
            user-select: none;
        }

        .danmaku-send-title {
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .danmaku-send-controls {
            display: flex;
            align-items: center;
        }

        .danmaku-send-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: 5px;
            font-size: 14px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .danmaku-send-btn:hover {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }

        .danmaku-send-input-container {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 40px;
            background-color: #333;
            display: flex;
            padding: 5px;
        }

        .danmaku-send-input {
            flex: 1;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            outline: none;
            background-color: #222;
            color: white;
        }

        .danmaku-send-submit {
            background-color: #00a1d6;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 0 10px;
            margin-left: 5px;
            cursor: pointer;
        }

        .danmaku-send-submit:hover {
            background-color: #0088b7;
        }

        .danmaku-message {
            margin-bottom: 5px;
            word-break: break-word;
        }

        .danmaku-message.system {
            color: #aaa;
            font-size: 12px;
        }

        .danmaku-message.self {
            color: #00a1d6;
        }
        /* 新增弹幕消息显示区域样式 */
        .danmaku-messages {
            height: calc(100% - 40px);
            overflow-y: auto;
            padding: 10px;
            color: white;
            font-size: 14px;
        }

        .danmaku-message {
            margin-bottom: 5px;
            word-break: break-word;
        }

        .danmaku-message.system {
            color: #aaa;
            font-size: 12px;
        }

        .danmaku-message.self {
            color: #00a1d6;
        }

        /* 音量提示样式 - 修复版本 */
        .volume-tooltip {
            position: fixed;
            background-color: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            z-index: 20001;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
            white-space: nowrap;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .volume-tooltip.show {
            opacity: 1;
        }
    `);

    // 创建直播间列表容器
    const liveListContainer = document.createElement('div');
    liveListContainer.id = 'live-list-container';

    const liveListHeader = document.createElement('div');
    liveListHeader.id = 'live-list-header';

    const title = document.createElement('h3');
    title.textContent = '正在直播';

    const tooltip = document.createElement('div');
    tooltip.className = 'live-tooltip';
    document.body.appendChild(tooltip);

    // 创建音量提示
    const volumeTooltip = document.createElement('div');
    volumeTooltip.className = 'volume-tooltip';
    document.body.appendChild(volumeTooltip);

    liveListHeader.appendChild(title);
    liveListContainer.appendChild(liveListHeader);

    // 添加自定义直播间输入框
    const customRoomInput = document.createElement('div');
    customRoomInput.id = 'custom-room-input';

    const roomIdInput = document.createElement('input');
    roomIdInput.id = 'room-id-input';
    roomIdInput.type = 'text';
    roomIdInput.placeholder = '输入直播间号';

    const playCustomBtn = document.createElement('button');
    playCustomBtn.id = 'play-custom-btn';
    playCustomBtn.textContent = '播放';
    playCustomBtn.addEventListener('click', () => {
        const roomId = roomIdInput.value.trim();
        if (roomId) {
            playCustomRoom(roomId);
        }
    });

    // 按回车键也可以触发播放
    roomIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const roomId = roomIdInput.value.trim();
            if (roomId) {
                playCustomRoom(roomId);
            }
        }
    });

    customRoomInput.appendChild(roomIdInput);
    customRoomInput.appendChild(playCustomBtn);
    liveListContainer.appendChild(customRoomInput);

    // 添加历史记录下拉菜单
    const historyDropdown = document.createElement('div');
    historyDropdown.id = 'history-dropdown';

    const historyToggle = document.createElement('button');
    historyToggle.id = 'history-toggle';
    historyToggle.textContent = '历史记录';
    historyToggle.addEventListener('click', toggleHistoryList);

    const historyList = document.createElement('div');
    historyList.id = 'history-list';

    historyDropdown.appendChild(historyToggle);
    historyDropdown.appendChild(historyList);
    liveListContainer.appendChild(historyDropdown);

    const liveList = document.createElement('div');
    liveList.id = 'live-list';
    liveListContainer.appendChild(liveList);

    // 存储所有创建的播放器实例
    const players = new Map();
    // 存储弹幕窗口与播放器的关联关系
    const danmakuWindows = new Map();
    // 存储直播统计信息刷新定时器
    const statsTimers = new Map();
    // 全局音量状态
    const volumeState = {
        currentVolume: 0.5,
        isMuted: false
    };

    // 获取历史记录
    function getHistory() {
        const history = GM_getValue('live_history', []);
        return Array.isArray(history) ? history : [];
    }

    // 保存历史记录
    function saveHistory(history) {
        GM_setValue('live_history', history);
    }

    // 添加历史记录
    function addHistory(roomId, uname, title) {
        const history = getHistory();
        // 移除重复记录
        const newHistory = history.filter(item => item.roomId !== roomId);
        // 添加新记录到开头
        newHistory.unshift({
            roomId,
            uname,
            title,
            timestamp: Date.now()
        });
        // 限制历史记录数量
        if (newHistory.length > 10) {
            newHistory.pop();
        }
        saveHistory(newHistory);
        renderHistory();
    }

    // 删除单个历史记录
    function deleteHistoryItem(roomId, e) {
        e.stopPropagation();
        const history = getHistory();
        const newHistory = history.filter(item => item.roomId !== roomId);
        saveHistory(newHistory);
        renderHistory();
    }

    // 清空历史记录
    function clearHistory() {
        if (confirm('确定要清空历史记录吗？')) {
            GM_deleteValue('live_history');
            renderHistory();
        }
    }

    // 切换历史记录列表显示/隐藏
    function toggleHistoryList() {
        historyToggle.classList.toggle('active');
        historyList.classList.toggle('show');
    }

    // 渲染历史记录
    function renderHistory() {
        const history = getHistory();
        historyList.innerHTML = '';

        if (history.length === 0) {
            const emptyItem = document.createElement('div');
            emptyItem.textContent = '暂无历史记录';
            emptyItem.style.padding = '8px';
            emptyItem.style.color = '#999';
            emptyItem.style.textAlign = 'center';
            historyList.appendChild(emptyItem);
            return;
        }

        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.setAttribute('data-roomid', item.roomId);

            const itemContent = document.createElement('div');
            itemContent.style.display = 'flex';
            itemContent.style.alignItems = 'center';
            itemContent.style.flex = '1';
            itemContent.style.overflow = 'hidden';

            const name = document.createElement('div');
            name.className = 'history-item-name';
            name.textContent = item.uname || item.title || '未知直播间';
            name.style.flex = '1';
            name.style.overflow = 'hidden';
            name.style.textOverflow = 'ellipsis';

            const roomId = document.createElement('div');
            roomId.className = 'history-item-roomid';
            roomId.textContent = item.roomId;

            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'history-item-delete';
            deleteBtn.innerHTML = '×';
            deleteBtn.addEventListener('click', (e) => deleteHistoryItem(item.roomId, e));

            itemContent.appendChild(name);
            itemContent.appendChild(roomId);
            historyItem.appendChild(itemContent);
            historyItem.appendChild(deleteBtn);

            historyItem.addEventListener('click', (e) => {
                if (e.target !== deleteBtn) {
                    playCustomRoom(item.roomId);
                    toggleHistoryList();
                }
            });

            historyList.appendChild(historyItem);
        });

        const clearBtn = document.createElement('button');
        clearBtn.id = 'clear-history-btn';
        clearBtn.textContent = '清空历史记录';
        clearBtn.addEventListener('click', clearHistory);
        historyList.appendChild(clearBtn);
    }

    // 获取关注直播列表中的直播信息
    function fetchLiveList() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.live.bilibili.com/xlive/web-ucenter/v1/xfetter/GetWebList?hit_ab=true',
            headers: {
                'Referer': 'https://live.bilibili.com/',
                'Origin': 'https://live.bilibili.com'
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    console.log('获取关注直播列表:', data);
                    if (data.code === 0) {
                        const Livedata = data.data.list;
                        Livedata.sort(function(a, b) {return a.room_id - b.room_id;})
                        checkLiveStatus(Livedata);
                    } else {
                        console.error('获取关注直播列表失败:', data);
                    }
                } catch (e) {
                    console.error('解析关注直播失败:', e);
                }
            },
            onerror: function(error) {
                console.error('请求关注直播失败:', error);
            }
        });
    }

    // 检查关注用户的直播状态
    function checkLiveStatus(Livedata) {
        liveList.innerHTML = '<div style="padding: 10px; text-align: center;">加载中...</div>';
        if(!Livedata.length){
            liveList.innerHTML = '<div style="padding: 10px; text-align: center;">暂无直播</div>';
            return
        }
        displayLiveList(Livedata);
    }

    // 显示直播列表
    function displayLiveList(liveData) {
        liveList.innerHTML = '';

        const liveUsers = Object.values(liveData).filter(user => user.live_status === 1);

        if (liveUsers.length === 0) {
            liveList.innerHTML = '<div style="padding: 10px; text-align: center;">暂无直播</div>';
            return;
        }

        liveUsers.forEach(user => {
            const liveItem = document.createElement('div');
            liveItem.className = 'live-item';
            liveItem.addEventListener('click', () => playLive(user.room_id, user.uname, user.title));
            liveItem.addEventListener('contextmenu', (e) => {
                e.preventDefault(); // 阻止事件冒泡，避免触发live-item的点击事件
                window.open(`https://live.bilibili.com/blanc/${user.room_id}`, '_blank');
            });
            liveItem.addEventListener('mouseenter', (e) => {
                tooltip.innerHTML = `左键偷偷观看<br>右键进入观看`;
                tooltip.style.left = `${e.pageX + 10}px`;
                tooltip.style.top = `${e.pageY + 10}px`;
                tooltip.style.opacity = '1';
            });

            liveItem.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });

            liveItem.addEventListener('mousemove', (e) => {
                tooltip.style.left = `${e.pageX + 10}px`;
                tooltip.style.top = `${e.pageY + 10}px`;
            });
            const avatar = document.createElement('img');
            avatar.className = 'live-avatar';
            avatar.src = user.face + '@96w_96h_!web-dynamic.avif';
            avatar.onerror = () => { avatar.src = 'https://i0.hdslb.com/bfs/face/member/noface.jpg'; };

            const info = document.createElement('div');
            info.className = 'live-info';

            const title = document.createElement('div');
            title.className = 'live-title';
            title.textContent = user.title || '无标题';

            const name = document.createElement('div');
            name.className = 'live-name';
            name.textContent = user.uname;

            info.appendChild(name);
            info.appendChild(title);
            liveItem.appendChild(avatar);
            liveItem.appendChild(info);

            liveList.appendChild(liveItem);
        });
    }

    // 显示音量提示 - 修复版本
    function showVolumeTooltip(text, x, y, useFixedPosition = false) {
        volumeTooltip.textContent = text;

        if (useFixedPosition) {
            // 使用固定位置在屏幕中央显示
            volumeTooltip.style.left = '50%';
            volumeTooltip.style.top = '50%';
            volumeTooltip.style.transform = 'translate(-50%, -50%)';
        } else {
            // 原有的鼠标位置计算
            volumeTooltip.style.left = (x + 15) + 'px';
            volumeTooltip.style.top = (y - 40) + 'px';
            volumeTooltip.style.transform = 'none';
        }

        volumeTooltip.classList.add('show');

        // 清除之前的隐藏定时器
        clearTimeout(volumeTooltip._hideTimeout);

        // 2秒后隐藏
        volumeTooltip._hideTimeout = setTimeout(() => {
            volumeTooltip.classList.remove('show');
        }, 2000);
    }

    // 添加鼠标滚轮音量控制 - 修复版本
    function addVolumeWheelControl(videoElement, playerContainer) {
        const handleWheel = (e) => {
            // 阻止默认滚动行为
            e.preventDefault();

            // 计算音量变化量
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            let newVolume = videoElement.volume + delta;

            // 限制音量在0-1之间
            newVolume = Math.max(0, Math.min(1, newVolume));

            // 设置新音量
            videoElement.volume = newVolume;

            // 显示音量提示 - 使用播放器中心位置
            const volumePercent = Math.round(newVolume * 100);
            const muteText = videoElement.muted ? ' (静音)' : '';
            const text = `音量: ${volumePercent}%${muteText}`;

            // 获取播放器中心位置
            const playerRect = playerContainer.getBoundingClientRect();
            const centerX = playerRect.left + playerRect.width / 2;
            const centerY = playerRect.top + playerRect.height / 2;

            showVolumeTooltip(text, centerX, centerY, true);

            // 保存音量状态到全局
            volumeState.currentVolume = newVolume;
            volumeState.isMuted = videoElement.muted;

            // 保存音量状态到播放器实例
            const playerId = playerContainer.id;
            const player = players.get(playerId);
            if (player) {
                player.volume = newVolume;
                player.muted = videoElement.muted;
            }
        };

        // 为播放器容器添加滚轮事件监听
        playerContainer.addEventListener('wheel', handleWheel, { passive: false });

        // 返回清理函数
        return () => {
            playerContainer.removeEventListener('wheel', handleWheel);
        };
    }

    // 应用全局音量状态到视频元素
    function applyGlobalVolumeState(videoElement) {
        videoElement.volume = volumeState.currentVolume;
        videoElement.muted = volumeState.isMuted;
    }

    // 创建直播统计信息显示区域
    function createStatsDisplay() {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'live-player-stats';

        const onlineStat = document.createElement('div');
        onlineStat.className = 'live-player-stat online-stat';
        onlineStat.innerHTML = '<span class="live-player-stat-icon">🔥</span><span class="online-count">0</span>';

        const guardStat = document.createElement('div');
        guardStat.className = 'live-player-stat guard-stat';
        guardStat.innerHTML = '<span class="live-player-stat-icon">⚓</span><span class="guard-count">0</span>';

        statsContainer.appendChild(onlineStat);
        statsContainer.appendChild(guardStat);

        return statsContainer;
    }

    // 格式化数字（添加千分位逗号）
    function formatNumber(num) {
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + '万';
        }
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // 获取直播统计信息
    async function fetchLiveStats(roomId, statsContainer) {
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${roomId}`,
                    headers: {
                        'Referer': 'https://live.bilibili.com/',
                        'Origin': 'https://live.bilibili.com'
                    },
                    onload: resolve,
                    onerror: reject
                });
            });

            const data = JSON.parse(response.responseText);
            if (data.code === 0) {
                const online = data.data.room_rank_info.user_rank_entry.user_contribution_rank_entry.count || 0;
                const guardCount = data.data.guard_info.count || 0; // 注意：这里可能需要调整，B站API的舰长数可能在别的字段

                // 更新统计信息显示
                const onlineCountElement = statsContainer.querySelector('.online-count');
                const guardCountElement = statsContainer.querySelector('.guard-count');

                if (onlineCountElement) {
                    onlineCountElement.textContent = online;
                }
                if (guardCountElement) {
                    guardCountElement.textContent = guardCount;
                }

                return { online, guardCount };
            }
        } catch (error) {
            console.error('获取直播统计信息失败:', error);
        }
        return null;
    }

    // 开始定时刷新直播统计信息
    function startStatsRefresh(roomId, playerId) {
        // 清除之前的定时器
        stopStatsRefresh(playerId);

        const player = players.get(playerId);
        if (!player) return;

        const statsContainer = player.container.querySelector('.live-player-stats');
        if (!statsContainer) return;

        // 立即获取一次
        fetchLiveStats(roomId, statsContainer);

        // 定时刷新
        const timer = setInterval(async () => {
            await fetchLiveStats(roomId, statsContainer);
        }, 30000); // 每10秒刷新一次

        // 保存定时器
        statsTimers.set(playerId, timer);
    }

    // 停止定时刷新直播统计信息
    function stopStatsRefresh(playerId) {
        if (statsTimers.has(playerId)) {
            clearInterval(statsTimers.get(playerId));
            statsTimers.delete(playerId);
        }
    }

    // 创建可拖动的播放器窗口
    function createPlayerWindow(title, roomId, playerState = null) {
        const playerId = 'player-' + Date.now();

        const playerContainer = document.createElement('div');
        playerContainer.className = 'player-container';
        playerContainer.id = playerId;

        const playerHeader = document.createElement('div');
        playerHeader.className = 'live-player-header';

        const playerTitle = document.createElement('div');
        playerTitle.className = 'live-player-title';
        playerTitle.textContent = title;

        // 创建统计信息显示区域
        const statsContainer = createStatsDisplay();

        const playerControls = document.createElement('div');
        playerControls.className = 'player-controls';

        const danmakuBtn = document.createElement('button');
        danmakuBtn.className = 'player-btn';
        danmakuBtn.innerHTML = '💬';
        danmakuBtn.title = '发送弹幕';
        danmakuBtn.addEventListener('click', () => {
            createDanmakuSendWindow(roomId, title, playerContainer);
        });

        const closeBtn = document.createElement('button');
        closeBtn.className = 'player-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            const player = players.get(playerId);
            if (player.hls) {
                player.hls.destroy();
            }
            if (playerContainer._cleanupDrag) {
                playerContainer._cleanupDrag();
            }
            if (playerContainer._cleanupWheel) {
                playerContainer._cleanupWheel();
            }
            // 停止统计信息刷新
            stopStatsRefresh(playerId);
            // 关闭关联的弹幕窗口
            const danmakuWindow = danmakuWindows.get(playerId);
            if (danmakuWindow) {
                danmakuWindow.remove();
                danmakuWindows.delete(playerId);
            }
            playerContainer.remove();
            players.delete(playerId);
        });

        playerControls.appendChild(danmakuBtn);
        playerControls.appendChild(closeBtn);

        playerHeader.appendChild(playerTitle);
        playerHeader.appendChild(statsContainer);
        playerHeader.appendChild(playerControls);

        const videoElement = document.createElement('video');
        videoElement.className = 'player-video';
        videoElement.controls = true;

        // 设置音量和静音状态 - 优先使用全局状态
        applyGlobalVolumeState(videoElement);

        // 如果有特定的播放器状态，则使用
        if (playerState) {
            if (playerState.volume !== undefined) {
                videoElement.volume = playerState.volume;
            }
            if (playerState.muted !== undefined) {
                videoElement.muted = playerState.muted;
            }
        }

        playerContainer.appendChild(playerHeader);
        playerContainer.appendChild(videoElement);
        document.body.appendChild(playerContainer);

        // 应用保存的位置和大小
        if (playerState && playerState.position) {
            playerContainer.style.left = playerState.position.left;
            playerContainer.style.top = playerState.position.top;
            playerContainer.style.width = playerState.position.width;
            playerContainer.style.height = playerState.position.height;

            if (playerState.zIndex) {
                playerContainer.style.zIndex = playerState.zIndex;
            }
        } else {
            // 初始位置 - 稍微偏移以避免完全重叠
            const existingPlayers = document.querySelectorAll('.player-container');
            const offset = existingPlayers.length * 20;

            // 计算初始位置
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const containerWidth = Math.min(800, windowWidth * 0.9);
            const containerHeight = Math.min(450, windowHeight * 0.8);

            let left = (windowWidth - containerWidth) / 2 + offset;
            let top = (windowHeight - containerHeight) / 2 + offset;

            // 确保窗口不会超出屏幕
            left = Math.max(0, Math.min(left, windowWidth - containerWidth));
            top = Math.max(0, Math.min(top, windowHeight - containerHeight));

            playerContainer.style.width = containerWidth + 'px';
            playerContainer.style.height = containerHeight + 'px';
            playerContainer.style.left = left + 'px';
            playerContainer.style.top = top + 'px';
        }

        playerContainer.style.display = 'block';

        // 存储播放器实例
        const playerInstance = {
            videoElement: videoElement,
            hls: null,
            originalHeight: null,
            roomId: roomId,
            title: title,
            container: playerContainer,
            volume: videoElement.volume,
            muted: videoElement.muted
        };

        players.set(playerId, playerInstance);

        // 使窗口可拖动
        makeDraggable(playerContainer, playerHeader, () => {
            // 拖动回调，移动关联的弹幕窗口
            const danmakuWindow = danmakuWindows.get(playerId);
            if (danmakuWindow) {
                updateDanmakuWindowPosition(playerContainer, danmakuWindow);
            }
        });

        // 添加滚轮音量控制
        playerContainer._cleanupWheel = addVolumeWheelControl(videoElement, playerContainer);

        // 监听音量变化，保存状态
        videoElement.addEventListener('volumechange', () => {
            playerInstance.volume = videoElement.volume;
            playerInstance.muted = videoElement.muted;
            // 同步到全局状态
            volumeState.currentVolume = videoElement.volume;
            volumeState.isMuted = videoElement.muted;
        });

        return { container: playerContainer, videoElement, playerId, statsContainer };
    }

    // 更新弹幕窗口位置
    function updateDanmakuWindowPosition(playerContainer, danmakuWindow) {
        const playerRect = playerContainer.getBoundingClientRect();
        const danmakuWidth = 300;

        let left = playerRect.right + 10;
        let top = playerRect.top;

        // 如果右边空间不足，放在左边
        if (left + danmakuWidth > window.innerWidth) {
            left = playerRect.left - danmakuWidth - 10;
        }

        // 确保窗口不会超出屏幕
        left = Math.max(0, Math.min(left, window.innerWidth - danmakuWidth));
        top = Math.max(0, Math.min(top, window.innerHeight - 120));

        danmakuWindow.style.left = left + 'px';
        danmakuWindow.style.top = top + 'px';
    }

    // 创建弹幕发送窗口
    function createDanmakuSendWindow(roomId, title, playerContainer) {
        const playerId = playerContainer.id;

        // 检查是否已经打开了这个弹幕窗口
        const existingDanmaku = danmakuWindows.get(playerId);
        if (existingDanmaku) {
            // 如果已经存在，则将其置顶
            const maxZ = Math.max(...Array.from(document.querySelectorAll('.player-container, .danmaku-send-container'))
                                  .map(el => parseInt(el.style.zIndex || 10000)));
            existingDanmaku.style.zIndex = maxZ + 1;
            return existingDanmaku;
        }

        const danmakuContainer = document.createElement('div');
        danmakuContainer.className = 'danmaku-send-container';
        danmakuContainer.setAttribute('data-roomid', roomId);

        const danmakuHeader = document.createElement('div');
        danmakuHeader.className = 'danmaku-send-header';

        const danmakuTitle = document.createElement('div');
        danmakuTitle.className = 'danmaku-send-title';
        danmakuTitle.textContent = '发送弹幕';

        const danmakuControls = document.createElement('div');
        danmakuControls.className = 'danmaku-send-controls';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'danmaku-send-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            danmakuContainer.remove();
            danmakuWindows.delete(playerId);
        });

        danmakuControls.appendChild(closeBtn);

        danmakuHeader.appendChild(danmakuTitle);
        danmakuHeader.appendChild(danmakuControls);

        // 新增弹幕消息显示区域
        const danmakuMessages = document.createElement('div');
        danmakuMessages.className = 'danmaku-messages';

        // 添加欢迎消息
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'danmaku-message system';
        welcomeMsg.textContent = '在此输入弹幕内容并发送';
        danmakuMessages.appendChild(welcomeMsg);

        const danmakuInputContainer = document.createElement('div');
        danmakuInputContainer.className = 'danmaku-send-input-container';

        const danmakuInput = document.createElement('input');
        danmakuInput.className = 'danmaku-send-input';
        danmakuInput.type = 'text';
        danmakuInput.placeholder = '输入弹幕内容...';
        danmakuInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendDanmaku(roomId, danmakuInput.value, danmakuMessages);
                danmakuInput.value = '';
            }
        });

        const danmakuSendBtn = document.createElement('button');
        danmakuSendBtn.className = 'danmaku-send-submit';
        danmakuSendBtn.textContent = '发送';
        danmakuSendBtn.addEventListener('click', () => {
            sendDanmaku(roomId, danmakuInput.value, danmakuMessages);
            danmakuInput.value = '';
        });

        danmakuInputContainer.appendChild(danmakuInput);
        danmakuInputContainer.appendChild(danmakuSendBtn);

        danmakuContainer.appendChild(danmakuHeader);
        danmakuContainer.appendChild(danmakuMessages);  // 添加消息显示区域
        danmakuContainer.appendChild(danmakuInputContainer);
        document.body.appendChild(danmakuContainer);

        // 使弹幕窗口与播放器窗口关联
        danmakuWindows.set(playerId, danmakuContainer);

        // 初始位置 - 放在播放器旁边
        updateDanmakuWindowPosition(playerContainer, danmakuContainer);

        danmakuContainer.style.width = '300px';
        danmakuContainer.style.height = '200px';  // 增加高度以容纳消息区域
        danmakuContainer.style.display = 'block';

        // 当播放器窗口关闭时，也关闭弹幕窗口
        playerContainer.addEventListener('DOMNodeRemoved', () => {
            if (danmakuContainer.parentNode) {
                danmakuContainer.remove();
            }
            danmakuWindows.delete(playerId);
        });

        return { container: danmakuContainer, input: danmakuInput, messages: danmakuMessages };
    }

    // 修改后的发送弹幕函数
    function sendDanmaku(roomId, message, messagesContainer) {
        if (!message.trim()) return;

        // 在发送前先显示自己的弹幕
        const selfMsg = document.createElement('div');
        selfMsg.className = 'danmaku-message self';
        selfMsg.textContent = `我: ${message}`;
        messagesContainer.appendChild(selfMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 获取CSRF token
        const cookie = document.cookie;
        const csrfMatch = cookie.match(/bili_jct=([^;]+)/);
        if (!csrfMatch) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'danmaku-message system';
            errorMsg.textContent = '发送失败: 未找到CSRF token，请确保已登录';
            messagesContainer.appendChild(errorMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            return;
        }
        const csrf = csrfMatch[1];

        // 发送弹幕请求
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.live.bilibili.com/msg/send',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': `https://live.bilibili.com/${roomId}`,
                'Origin': 'https://live.bilibili.com'
            },
            data: `bubble=0&msg=${encodeURIComponent(message)}&color=16777215&mode=1&fontsize=25&rnd=${Math.floor(Date.now()/1000)}&roomid=${roomId}&csrf=${csrf}&csrf_token=${csrf}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.code !== 0) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'danmaku-message system';
                        errorMsg.textContent = `发送失败: ${data.message || '未知错误'}`;
                        messagesContainer.appendChild(errorMsg);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                } catch (e) {
                    console.error('解析弹幕发送响应失败:', e);
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'danmaku-message system';
                    errorMsg.textContent = '解析弹幕发送响应失败';
                    messagesContainer.appendChild(errorMsg);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            },
            onerror: function(error) {
                console.error('发送弹幕失败:', error);
                const errorMsg = document.createElement('div');
                errorMsg.className = 'danmaku-message system';
                errorMsg.textContent = '发送弹幕失败，请检查网络连接';
                messagesContainer.appendChild(errorMsg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        });
    }

    // 使元素可拖动 - 修正版本
    function makeDraggable(element, header, onDrag) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        const startDrag = (e) => {
            if (e.button !== 0) return; // 只响应左键

            isDragging = true;

            // 计算鼠标位置与元素左上角的偏移
            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            // 防止文本选中和拖动图片
            e.preventDefault();

            // 提高当前窗口的z-index
            const maxZ = Math.max(...Array.from(document.querySelectorAll('.player-container, .danmaku-send-container'))
                                  .map(el => parseInt(el.style.zIndex || 10000)));
            element.style.zIndex = maxZ + 1;

            // 添加拖动时的样式
            element.style.cursor = 'grabbing';
            element.style.opacity = '0.9';
        };

        const drag = (e) => {
            if (!isDragging) return;

            // 计算新位置
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            // 限制在视窗内
            const maxLeft = window.innerWidth - element.offsetWidth;
            const maxTop = window.innerHeight - element.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            // 应用新位置
            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';

            // 调用拖动回调
            if (onDrag) onDrag();
        };

        const stopDrag = () => {
            isDragging = false;
            element.style.cursor = '';
            element.style.opacity = '';
        };

        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        // 清理事件监听器
        element._cleanupDrag = function() {
            header.removeEventListener('mousedown', startDrag);
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        };
    }

    // 更新播放器标题
    function updatePlayerTitle(playerId, newTitle) {
        const player = players.get(playerId);
        if (!player) return;

        player.title = newTitle;

        // 更新容器标题
        const container = player.container;
        if (container) {
            const titleElement = container.querySelector('.live-player-title');
            if (titleElement) {
                titleElement.firstChild.textContent = newTitle;
            }
        }
    }

    // 更新播放器统计信息
    async function updatePlayerStats(playerId) {
        const player = players.get(playerId);
        if (!player) return;

        const { roomId, container } = player;
        const statsContainer = container.querySelector('.live-player-stats');
        if (!statsContainer) return;

        await fetchLiveStats(roomId, statsContainer);
    }

    // 播放自定义直播间
    function playCustomRoom(roomId, playerState = null) {
        // 检查是否已经打开了这个直播
        for (const [id, player] of players.entries()) {
            if (player.roomId === roomId) {
                // 如果已经存在，则将其置顶
                const container = document.getElementById(id);
                const maxZ = Math.max(...Array.from(document.querySelectorAll('.player-container, .danmaku-send-container'))
                                      .map(el => parseInt(el.style.zIndex || 10000)));
                container.style.zIndex = maxZ + 1;
                // 同时置顶关联的弹幕窗口
                const danmakuWindow = danmakuWindows.get(id);
                if (danmakuWindow) {
                    danmakuWindow.style.zIndex = maxZ + 2;
                }
                return;
            }
        }

        // 先获取直播间基本信息
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.live.bilibili.com/room/v1/Room/get_info?id=${roomId}`,
            headers: {
                'Referer': 'https://www.bilibili.com/',
                'Origin': 'https://www.bilibili.com'
            },
            onload: function(response) {
                try {
                    const roomData = JSON.parse(response.responseText);
                    if (roomData.code === 0) {
                        const title = roomData.data.title || '直播间';
                        const live_status = roomData.data.live_status
                        if (live_status !== 1) {
                            window.toast('该直播间当前未开播');
                            return;
                        }
                        // 获取主播信息
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: `https://api.live.bilibili.com/live_user/v1/UserInfo/get_anchor_in_room?roomid=${roomId}`,
                            headers: {
                                'Referer': 'https://www.bilibili.com/',
                                'Origin': 'https://www.bilibili.com'
                            },
                            onload: function(anchorResponse) {
                                try {
                                    const anchorData = JSON.parse(anchorResponse.responseText);
                                    let uname = '未知主播';

                                    if (anchorData.code === 0 && anchorData.data.info) {
                                        uname = anchorData.data.info.uname || '未知主播';
                                    }

                                    const { container, videoElement, playerId, statsContainer } = createPlayerWindow(`${uname} - ${title}`, roomId, playerState);

                                    // 启动统计信息定时刷新
                                    startStatsRefresh(roomId, playerId);

                                    // 保存到历史记录
                                    addHistory(roomId, uname, title);

                                    // 获取直播流
                                    GM_xmlhttpRequest({
                                        method: 'GET',
                                        url: `https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${roomId}&quality=4&platform=h5`,
                                        headers: {
                                            'Referer': 'https://www.bilibili.com/',
                                            'Origin': 'https://www.bilibili.com'
                                        },
                                        onload: function(streamResponse) {
                                            try {
                                                const streamData = JSON.parse(streamResponse.responseText);
                                                if (streamData.code === 0 && streamData.data.durl && streamData.data.durl.length > 0) {
                                                    const hlsUrl = streamData.data.durl[0].url;
                                                    initHlsPlayer(hlsUrl, videoElement, playerId, uname, roomId, title, playerState, statsContainer);
                                                } else {
                                                    console.error('获取直播流失败:', streamData.message);
                                                    window.toast('获取直播流失败: ' + (streamData.message || '未知错误'));
                                                }
                                            } catch (e) {
                                                console.error('解析直播流失败:', e);
                                                window.toast('解析直播流失败');
                                            }
                                        },
                                        onerror: function(error) {
                                            console.error('请求直播流失败:', error);
                                            window.toast('请求直播流失败');
                                        }
                                    });
                                } catch (e) {
                                    console.error('解析主播信息失败:', e);
                                    const { container, videoElement, playerId, statsContainer } = createPlayerWindow(`未知主播 - ${title}`, roomId, playerState);
                                    // 启动统计信息定时刷新
                                    startStatsRefresh(roomId, playerId);
                                    addHistory(roomId, '未知主播', title);
                                    getStreamUrl('未知主播', roomId, title, videoElement, playerId, playerState, statsContainer);
                                }
                            },
                            onerror: function(error) {
                                console.error('请求主播信息失败:', error);
                                const { container, videoElement, playerId, statsContainer } = createPlayerWindow(`未知主播 - ${title}`, roomId, playerState);
                                // 启动统计信息定时刷新
                                startStatsRefresh(roomId, playerId);
                                addHistory(roomId, '未知主播', title);
                                getStreamUrl('未知主播', roomId, title, videoElement, playerId, playerState, statsContainer);
                            }
                        });
                    } else {
                        console.error('获取直播间信息失败:', roomData.message);
                        window.toast('获取直播间信息失败: ' + (roomData.message || '未知错误'));
                    }
                } catch (e) {
                    console.error('解析直播间信息失败:', e);
                    window.toast('解析直播间信息失败');
                }
            },
            onerror: function(error) {
                console.error('请求直播间信息失败:', error);
                window.toast('请求直播间信息失败');
            }
        });
    }

    // 获取直播流URL的独立函数
    function getStreamUrl(uname, roomId, title, videoElement, playerId, playerState = null, statsContainer) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${roomId}&quality=4&platform=h5`,
            headers: {
                'Referer': 'https://www.bilibili.com/',
                'Origin': 'https://www.bilibili.com'
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.code === 0 && data.data.durl && data.data.durl.length > 0) {
                        const hlsUrl = data.data.durl[0].url;
                        initHlsPlayer(hlsUrl, videoElement, playerId, uname, roomId, title, playerState, statsContainer);
                    } else {
                        console.error('获取直播流失败:', data.message);
                    }
                } catch (e) {
                    console.error('解析直播流失败:', e);
                }
            },
            onerror: function(error) {
                console.error('请求直播流失败:', error);
            }
        });
    }

    // 播放直播
    function playLive(roomId, uname, title, playerState = null) {
        // 检查是否已经打开了这个直播
        for (const [id, player] of players.entries()) {
            if (player.roomId === roomId) {
                // 如果已经存在，则将其置顶
                const container = document.getElementById(id);
                const maxZ = Math.max(...Array.from(document.querySelectorAll('.player-container, .danmaku-send-container'))
                                      .map(el => parseInt(el.style.zIndex || 10000)));
                container.style.zIndex = maxZ + 1;
                // 同时置顶关联的弹幕窗口
                const danmakuWindow = danmakuWindows.get(id);
                if (danmakuWindow) {
                    danmakuWindow.style.zIndex = maxZ + 2;
                }
                return;
            }
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.live.bilibili.com/room/v1/Room/get_info?id=${roomId}`,
            headers: {
                'Referer': 'https://www.bilibili.com/',
                'Origin': 'https://www.bilibili.com'
            },
            onload: function(response) {
                try {
                    const roomData = JSON.parse(response.responseText);
                    console.log('直播间:', roomData);
                    if (roomData.code === 0) {
                        const title = roomData.data.title || '直播间';
                        const live_status = roomData.data.live_status
                        if (live_status !== 1) {
                            return;
                        }else{
                            const { container, videoElement, playerId, statsContainer } = createPlayerWindow(`${uname} - ${title}`, roomId, playerState);

                            // 启动统计信息定时刷新
                            startStatsRefresh(roomId, playerId);

                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: `https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${roomId}&quality=4&platform=h5`,
                                headers: {
                                    'Referer': 'https://www.bilibili.com/',
                                    'Origin': 'https://www.bilibili.com'
                                },
                                onload: function(response) {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        if (data.code === 0 && data.data.durl && data.data.durl.length > 0) {
                                            const hlsUrl = data.data.durl[0].url;
                                            initHlsPlayer(hlsUrl, videoElement, playerId, uname, roomId, title, playerState, statsContainer);
                                        } else {
                                            console.error('获取直播流失败:', data.message);
                                        }
                                    } catch (e) {
                                        console.error('解析直播流失败:', e);
                                    }
                                },
                                onerror: function(error) {
                                    console.error('请求直播流失败:', error);

                                }
                            });
                        }
                    }
                }catch (e) {
                    console.error('解析直播状态失败:', e);

                }
            },
            onerror: function(error) {
                console.error('请求直播状态失败:', error);

            }
        });

    }

    // 初始化HLS播放器
    function initHlsPlayer(url, videoElement, playerId, uname, roomId, title, playerState = null, statsContainer) {
        const player = players.get(playerId);

        if (player.hls) {
            player.hls.destroy();
        }

        if (Hls.isSupported()) {
            const hls = new Hls({

                // 优化缓冲区设置
                maxBufferLength: 60,
                maxMaxBufferLength: 120,
                maxBufferSize: 60 * 1000 * 1000,
                maxBufferHole: 0.1, // 减少缓冲区空洞容忍度

                // 性能优化
                lowLatencyMode: true,
                backBufferLength: 30,

                // 错误恢复策略
                maxStarvationDelay: 4,
                maxLoadingDelay: 4,
                maxSeekHole: 2,
                maxFragLookUpTolerance: 0.25,

                // 网络优化
                maxRetry: 3,
                maxRetryDelay: 3000,
                liveSyncDurationCount: 3,
                liveMaxLatencyDurationCount: 10,

                // 调试信息（生产环境可关闭）
                debug: false,
                enableWorker: true,
                enableSoftwareAES: true

            });

            hls.loadSource(url);
            hls.attachMedia(videoElement);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                // 应用全局音量状态
                applyGlobalVolumeState(videoElement);

                // 如果有特定的播放器状态，则使用
                if (playerState) {
                    if (playerState.volume !== undefined) {
                        videoElement.volume = playerState.volume;
                    }
                    if (playerState.muted !== undefined) {
                        videoElement.muted = playerState.muted;
                    }
                }

                videoElement.play();
            });

            hls.on(Hls.Events.ERROR, function(event, data) {
                const errorTypesToIgnore = [
                    'bufferSeekOverHole',
                    'fragParsingError',
                    'bufferFullError',
                    'levelLoadError'
                ];
                if(errorTypesToIgnore.includes(data.details)){
                    console.warn('非致命错误:', data);
                }else{
                    console.error('播放直播流失败:', data);
                    // 保存当前播放器状态
                    const currentPlayer = players.get(playerId);
                    if (currentPlayer) {
                        const playerState = {
                            volume: currentPlayer.videoElement.volume,
                            muted: currentPlayer.videoElement.muted,
                            position: {
                                left: currentPlayer.container.style.left,
                                top: currentPlayer.container.style.top,
                                width: currentPlayer.container.style.width,
                                height: currentPlayer.container.style.height
                            },
                            zIndex: currentPlayer.container.style.zIndex
                        };

                        // 保存到全局状态存储
                        if (!window.playerStates) window.playerStates = {};
                        window.playerStates[roomId] = playerState;
                    }
                    // 停止统计信息刷新
                    stopStatsRefresh(playerId);
                    document.getElementById(playerId).querySelectorAll('button')[1].click();
                    // 延迟2秒后重新尝试播放，并传递播放器状态
                    setTimeout(() => {
                        const savedState = window.playerStates ? window.playerStates[roomId] : null;
                        playLive(roomId, uname, title, savedState);
                    }, 2000);
                }
            });

            // 更新播放器实例
            players.set(playerId, {
                ...player,
                hls: hls,
                roomId: roomId,
                videoElement: videoElement,
                container: document.getElementById(playerId)
            });

        } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            // 对于Safari浏览器
            videoElement.src = url;

            // 应用全局音量状态
            applyGlobalVolumeState(videoElement);

            // 如果有特定的播放器状态，则使用
            if (playerState) {
                if (playerState.volume !== undefined) {
                    videoElement.volume = playerState.volume;
                }
                if (playerState.muted !== undefined) {
                    videoElement.muted = playerState.muted;
                }
            }

            videoElement.addEventListener('loadedmetadata', function() {
                videoElement.play();
            });

            // 更新播放器实例
            players.set(playerId, {
                ...player,
                roomId: roomId,
                videoElement: videoElement,
                container: document.getElementById(playerId)
            });
        } else {
            window.toast('您的浏览器不支持HLS播放');
        }
    }

    // 初始加载
    setTimeout(() => {
        $('.left').children().eq(0).after(liveListContainer);
        $('.bili-dyn-live-users').hide()
        fetchLiveList();
        renderHistory();
        newWindow.init()
    }, 2000);
    setInterval(() => {
        fetchLiveList();
    }, 30000);
})();