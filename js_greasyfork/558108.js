// ==UserScript==
// @name         B站音频在线随机播放器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从B站收藏夹获取音频播放
// @author       无夏不春风orz
// @match        https://t.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      api.bilibili.com
// @connect      *.bilibili.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/558108/B%E7%AB%99%E9%9F%B3%E9%A2%91%E5%9C%A8%E7%BA%BF%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558108/B%E7%AB%99%E9%9F%B3%E9%A2%91%E5%9C%A8%E7%BA%BF%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        #bilibili-audio-player {
            position: fixed;
            top: 100px;
            left: 20px;
            width: 520px;
            background: rgba(255, 255, 255, 0.98);
            border: 2px solid #00a1d6;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-family: 'Microsoft YaHei', sans-serif;
            backdrop-filter: blur(12px);
            transition: all 0.2s ease-out;
            user-select: none;
        }

        #bilibili-audio-player.dragging {
            transition: none;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
            transform: scale(1.02);
            z-index: 10001;
        }

        .player-header {
            background: linear-gradient(135deg, #00a1d6, #0092c4);
            color: white;
            padding: 12px 16px;
            border-radius: 10px 10px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: grab;
            user-select: none;
        }

        .player-header:active {
            cursor: grabbing;
        }

        .player-title {
            font-size: 16px;
            font-weight: bold;
        }

        .player-controls {
            display: flex;
            gap: 6px;
        }

        .player-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            transition: all 0.3s;
            user-select: none;
        }

        .player-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .player-content {
            padding: 16px;
        }

        .player-info {
            margin-bottom: 16px;
        }

        .player-track-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 6px;
            color: #333;
            line-height: 1.4;
            max-height: 42px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .player-audio-info {
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
        }

        .player-progress {
            margin-bottom: 16px;
        }

        .progress-bar {
            width: 100%;
            height: 5px;
            background: #e8e8e8;
            border-radius: 3px;
            cursor: pointer;
            position: relative;
            transition: height 0.2s;
        }

        .progress-bar:hover {
            height: 8px;
        }

        .progress-filled {
            height: 100%;
            background: linear-gradient(90deg, #00a1d6, #0092c4);
            border-radius: 3px;
            width: 0%;
            transition: width 0.1s ease;
        }

        .time-display {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #999;
            margin-top: 6px;
        }

        .player-buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 16px;
            flex-wrap: wrap;
        }

        .control-btn {
            background: #00a1d6;
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s;
            white-space: nowrap;
            min-width: 60px;
        }

        .control-btn:hover {
            background: #0092c4;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 161, 214, 0.3);
        }

        .control-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .control-btn.small {
            padding: 6px 12px;
            font-size: 11px;
            min-width: 50px;
        }

        .control-btn.active {
            background: #ff6b6b;
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }

        .play-mode-btn {
            position: relative;
        }

        .volume-control {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
        }

        .volume-slider {
            flex: 1;
            height: 5px;
            background: #e8e8e8;
            border-radius: 3px;
            outline: none;
            cursor: pointer;
            transition: height 0.2s;
        }

        .volume-slider:hover {
            height: 8px;
        }

        .volume-slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #00a1d6;
            cursor: pointer;
            transition: all 0.2s;
        }

        .volume-slider::-webkit-slider-thumb:hover {
            background: #0092c4;
            transform: scale(1.2);
        }

        .favorite-management {
            margin-bottom: 16px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }

        .favorite-header {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
            flex-wrap: wrap;
        }

        .favorite-input {
            flex: 1;
            min-width: 120px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 12px;
            transition: border-color 0.3s;
        }

        .favorite-input:focus {
            outline: none;
            border-color: #00a1d6;
            box-shadow: 0 0 0 2px rgba(0, 161, 214, 0.1);
        }

        .favorite-select {
            flex: 1;
            min-width: 150px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 12px;
            background: white;
            transition: border-color 0.3s;
        }

        .favorite-select:focus {
            outline: none;
            border-color: #00a1d6;
        }

        .favorite-list {
            max-height: 120px;
            overflow-y: auto;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            background: white;
        }

        .favorite-item {
            padding: 8px 12px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.2s;
        }

        .favorite-item:last-child {
            border-bottom: none;
        }

        .favorite-item:hover {
            background: #f8f9fa;
        }

        .favorite-item.active {
            background: #00a1d6;
            color: white;
        }

        .favorite-actions {
            display: flex;
            gap: 4px;
        }

        .favorite-action {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 11px;
            opacity: 0.6;
            transition: opacity 0.2s;
            padding: 4px;
            border-radius: 3px;
        }

        .favorite-action:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.2);
        }

        .favorite-item.active .favorite-action:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .loading-progress {
            margin: 8px 0;
            font-size: 12px;
            color: #666;
        }

        .progress-text {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
        }

        .progress-bar-container {
            width: 100%;
            height: 8px;
            background: #e8e8e8;
            border-radius: 4px;
            overflow: hidden;
        }

        .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #00a1d6, #0092c4);
            border-radius: 4px;
            width: 0%;
            transition: width 0.3s ease;
        }

        .playlist-section {
            max-height: 220px;
            overflow-y: auto;
            border-top: 1px solid #eee;
            padding-top: 12px;
        }

        .playlist-title {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .playlist-item {
            padding: 8px 12px;
            background: #f8f9fa;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            line-height: 1.4;
            transition: all 0.2s;
            border-left: 3px solid transparent;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }

        .playlist-item:hover {
            background: #e9ecef;
            transform: translateX(2px);
        }

        .playlist-item.active {
            background: #00a1d6;
            color: white;
            border-left-color: #ff6b6b;
        }

        .playlist-item-content {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .playlist-item-actions {
            display: flex;
            gap: 4px;
            margin-left: 8px;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .playlist-item:hover .playlist-item-actions {
            opacity: 1;
        }

        .playlist-item-action {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 3px;
            transition: all 0.2s;
        }

        .playlist-item-action:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }

        .status-message {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #666;
            border-radius: 6px;
            margin-top: 12px;
            transition: all 0.3s;
        }

        .status-message.info {
            background: #e3f2fd;
            color: #1565c0;
            border: 1px solid #bbdefb;
        }

        .status-message.success {
            background: #e8f5e8;
            color: #2e7d32;
            border: 1px solid #c8e6c9;
        }

        .status-message.error {
            background: #ffebee;
            color: #c62828;
            border: 1px solid #ffcdd2;
        }

        .status-message.loading {
            background: #fff3e0;
            color: #ef6c00;
            border: 1px solid #ffe0b2;
        }

        .loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #00a1d6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
            vertical-align: middle;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .hidden {
            display: none;
        }

        /* 滚动条样式 */
        .favorite-list::-webkit-scrollbar,
        .playlist-section::-webkit-scrollbar {
            width: 6px;
        }

        .favorite-list::-webkit-scrollbar-track,
        .playlist-section::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }

        .favorite-list::-webkit-scrollbar-thumb,
        .playlist-section::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        .favorite-list::-webkit-scrollbar-thumb:hover,
        .playlist-section::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }

        /* 防止拖拽时文本选择 */
        .player-header * {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }

        /* 拖拽时的视觉反馈 */
        #bilibili-audio-player.dragging .player-header {
            background: linear-gradient(135deg, #0092c4, #0082b3);
        }
    `);

    class BilibiliAudioPlayer {
        constructor() {
            this.audio = null;
            this.currentTrack = null;
            this.playlist = [];
            this.favorites = [];
            this.currentFavoriteId = null;
            this.isPlaying = false;
            this.currentVolume = 0.7;
            this.isDragging = false;
            this.isLoading = false;
            this.playMode = 'random';
            this.dragData = null;
            this.init();
        }

        init() {
            this.loadSettings();
            this.createUI();
            this.bindEvents();
            this.loadVolume();
            this.setInitialPosition();
            this.restoreWindowState();
            this.updateFavoriteDisplay();

            // 尝试加载上次选择的收藏夹
            this.loadLastFavorite();
        }

        setInitialPosition() {
            const player = $('#bilibili-audio-player');
            const savedPosition = GM_getValue('playerPosition', null);

            if (savedPosition) {
                player.css({
                    left: savedPosition.left + 'px',
                    top: savedPosition.top + 'px'
                });
            } else {
                const windowWidth = $(window).width();
                const playerWidth = player.outerWidth();
                player.css({
                    left: (windowWidth - playerWidth - 20) + 'px',
                    top: '100px'
                });
            }
        }

        createUI() {
            const playerHTML = `
                <div id="bilibili-audio-player">
                    <div class="player-header">
                        <div class="player-title">🎵 B站合集音频播放器</div>
                        <div class="player-controls">
                            <button class="player-btn" id="minimize-btn">−</button>
                        </div>
                    </div>
                    <div class="player-content">
                        <div class="player-info">
                            <div class="player-track-title" id="track-title">请选择收藏夹开始播放</div>
                            <div class="player-audio-info" id="audio-info">-</div>
                        </div>

                        <div class="player-progress">
                            <div class="progress-bar" id="progress-bar">
                                <div class="progress-filled" id="progress-filled"></div>
                            </div>
                            <div class="time-display">
                                <span id="current-time">00:00</span>
                                <span id="duration">00:00</span>
                            </div>
                        </div>

                        <div class="player-buttons">
                            <button class="control-btn" id="prev-btn">上一首</button>
                            <button class="control-btn" id="play-btn">播放</button>
                            <button class="control-btn" id="next-btn">下一首</button>
                            <button class="control-btn play-mode-btn active" id="mode-btn" data-mode="random">随机</button>
                        </div>

                        <div class="volume-control">
                            <span>🔊</span>
                            <input type="range" class="volume-slider" id="volume-slider" min="0" max="100" value="70">
                            <span id="volume-value">70%</span>
                        </div>

                        <div class="favorite-management">
                            <div class="favorite-header">
                                <input type="text" id="sid-input" class="favorite-input" placeholder="输入收藏夹ID">
                                <button class="control-btn small" id="add-favorite-btn">添加</button>
                                <select id="favorite-select" class="favorite-select">
                                    <option value="">选择收藏夹...</option>
                                </select>
                                <button class="control-btn small" id="update-favorite-btn" disabled>更新</button>
                            </div>
                            <div class="loading-progress hidden" id="loading-progress">
                                <div class="progress-text">
                                    <span id="progress-status">加载中...</span>
                                    <span id="progress-count">0/0</span>
                                </div>
                                <div class="progress-bar-container">
                                    <div class="progress-bar-fill" id="progress-bar-fill"></div>
                                </div>
                            </div>
                            <div class="favorite-list" id="favorite-list"></div>
                        </div>

                        <div class="playlist-section">
                            <div class="playlist-title">
                                <span>播放列表 (<span id="playlist-count">0</span>)</span>
                                <div>
                                    <button class="control-btn small" id="shuffle-btn" disabled>打乱</button>
                                    <button class="control-btn small" id="clear-cache-btn" disabled>清除缓存</button>
                                </div>
                            </div>
                            <div id="playlist-container"></div>
                        </div>

                        <div class="status-message info" id="status-message">准备就绪，请选择收藏夹</div>
                    </div>
                </div>
            `;

            $('body').append(playerHTML);
            this.audio = new Audio();
            this.setupAudio();
        }

        setupAudio() {
            this.audio.volume = this.currentVolume;
            this.audio.preload = 'metadata';

            this.audio.addEventListener('timeupdate', () => {
                this.updateProgress();
            });

            this.audio.addEventListener('loadedmetadata', () => {
                this.updateDuration();
            });

            this.audio.addEventListener('canplaythrough', () => {
                this.showStatus('音频加载完成', 'success');
            });

            this.audio.addEventListener('ended', () => {
                this.handleTrackEnd();
            });

            this.audio.addEventListener('error', (e) => {
                this.showStatus('音频加载失败，尝试下一首...', 'error');
                setTimeout(() => this.playNext(), 2000);
            });
        }

        bindEvents() {
            $('#play-btn').click(() => this.togglePlay());
            $('#prev-btn').click(() => this.playPrev());
            $('#next-btn').click(() => this.playNext());
            $('#mode-btn').click(() => this.togglePlayMode());

            $('#progress-bar').on('click', (e) => this.seek(e));
            $('#volume-slider').on('input', (e) => {
                this.setVolume(e.target.value / 100);
                $('#volume-value').text(e.target.value + '%');
                GM_setValue('volume', this.currentVolume);
            });

            $('#add-favorite-btn').click(() => this.addFavorite());
            $('#update-favorite-btn').click(() => this.updateCurrentFavorite());
            $('#favorite-select').change(() => this.selectFavorite());
            $('#shuffle-btn').click(() => this.shufflePlaylist());
            $('#clear-cache-btn').click(() => this.clearPlaylistCache());

            $('#minimize-btn').click(() => this.toggleMinimize());
            this.makeDraggable();
        }

        makeDraggable() {
            const player = $('#bilibili-audio-player')[0];
            const header = $('.player-header')[0];

            if (!player || !header) return;

            header.addEventListener('mousedown', (e) => {
                if (e.target.closest('.player-btn')) return;

                e.preventDefault();
                e.stopPropagation();

                const rect = player.getBoundingClientRect();
                const startX = e.clientX;
                const startY = e.clientY;
                const startLeft = rect.left;
                const startTop = rect.top;

                player.classList.add('dragging');
                this.dragData = {
                    startX: startX,
                    startY: startY,
                    startLeft: startLeft,
                    startTop: startTop,
                    isDragging: true
                };

                const onMouseMove = (e) => {
                    if (!this.dragData || !this.dragData.isDragging) return;

                    const dx = e.clientX - this.dragData.startX;
                    const dy = e.clientY - this.dragData.startY;

                    const newLeft = Math.max(10, Math.min(
                        window.innerWidth - player.offsetWidth - 10,
                        this.dragData.startLeft + dx
                    ));

                    const newTop = Math.max(10, Math.min(
                        window.innerHeight - player.offsetHeight - 10,
                        this.dragData.startTop + dy
                    ));

                    player.style.left = newLeft + 'px';
                    player.style.top = newTop + 'px';
                };

                const onMouseUp = (e) => {
                    if (this.dragData) {
                        this.dragData.isDragging = false;

                        const finalLeft = parseInt(player.style.left);
                        const finalTop = parseInt(player.style.top);
                        GM_setValue('playerPosition', {
                            left: finalLeft,
                            top: finalTop
                        });

                        player.classList.remove('dragging');
                    }

                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    document.removeEventListener('mouseleave', onMouseUp);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                document.addEventListener('mouseleave', onMouseUp);
            });

            header.addEventListener('selectstart', (e) => {
                if (!e.target.closest('.player-btn')) {
                    e.preventDefault();
                }
                return false;
            });

            this.checkBoundaries();
            $(window).on('resize', () => this.checkBoundaries());
        }

        checkBoundaries() {
            const player = $('#bilibili-audio-player')[0];
            if (!player) return;

            const rect = player.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let needsUpdate = false;
            let newLeft = parseInt(player.style.left) || 0;
            let newTop = parseInt(player.style.top) || 0;

            if (rect.right > windowWidth) {
                newLeft = windowWidth - player.offsetWidth - 10;
                needsUpdate = true;
            }

            if (rect.bottom > windowHeight) {
                newTop = windowHeight - player.offsetHeight - 10;
                needsUpdate = true;
            }

            if (rect.left < 0) {
                newLeft = 10;
                needsUpdate = true;
            }

            if (rect.top < 0) {
                newTop = 10;
                needsUpdate = true;
            }

            if (needsUpdate) {
                player.style.left = newLeft + 'px';
                player.style.top = newTop + 'px';
                GM_setValue('playerPosition', {
                    left: newLeft,
                    top: newTop
                });
            }
        }

        loadSettings() {
            this.loadFavorites();
            this.playMode = GM_getValue('playMode', 'random');
        }

        saveSettings() {
            GM_setValue('playMode', this.playMode);
        }

        loadFavorites() {
            const savedFavorites = GM_getValue('favorites', []);
            this.favorites = savedFavorites;
        }

        saveFavorites() {
            GM_setValue('favorites', this.favorites);
        }

        loadLastFavorite() {
            const lastFavoriteId = GM_getValue('lastFavoriteId', null);
            if (lastFavoriteId && this.favorites.find(fav => fav.id === lastFavoriteId)) {
                setTimeout(() => {
                    this.selectFavorite(lastFavoriteId);
                }, 500);
            }
        }

        async addFavorite() {
            const sid = $('#sid-input').val().trim();
            if (!sid) {
                this.showStatus('请输入收藏夹ID', 'error');
                return;
            }

            if (this.favorites.find(fav => fav.id === sid)) {
                this.showStatus('收藏夹已存在', 'error');
                return;
            }

            this.showStatus('<div class="loading"></div>获取收藏夹信息中...', 'info');

            try {
                const favoriteInfo = await this.getFavoriteInfo(sid);
                const favoriteName = `${favoriteInfo.title} - ${favoriteInfo.upper.name}`;
                const newFavorite = {
                    id: sid,
                    name: favoriteName,
                    lastUpdated: Date.now(),
                    trackCount: 0
                };

                this.favorites.push(newFavorite);
                this.saveFavorites();
                this.updateFavoriteDisplay();
                this.selectFavorite(sid);
                this.showStatus('收藏夹添加成功', 'success');
                $('#sid-input').val('');
            } catch (error) {
                this.showStatus('获取收藏夹信息失败: ' + error.message, 'error');
            }
        }

        async getFavoriteInfo(sid) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.bilibili.com/x/space/fav/season/list?season_id=${sid}&pn=1&ps=1000`,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://www.bilibili.com/'
                    },
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.code === 0) {
                                resolve(data.data.info || '未知');
                            } else {
                                reject(new Error(data.message || 'API错误'));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: reject
                });
            });
        }

        selectFavorite(favoriteId = null) {
            const selectedId = favoriteId || $('#favorite-select').val();
            if (!selectedId) {
                this.disableControls();
                this.clearPlaylist();
                return;
            }

            if (this.currentFavoriteId === selectedId) {
                this.showStatus('已选择当前收藏夹', 'info');
                this.enableControls();
                this.enablePlaybackControls();
                return;
            }

            this.currentFavoriteId = selectedId;
            GM_setValue('lastFavoriteId', selectedId);
            this.enableControls();
            this.loadFavorite(selectedId);
        }

        clearPlaylist() {
            this.playlist = [];
            this.currentTrack = null;
            this.audio.src = '';
            this.updatePlaylistDisplay();
            $('#track-title').text('请选择收藏夹开始播放');
            $('#audio-info').text('-');
            $('#current-time').text('00:00');
            $('#duration').text('00:00');
            $('#progress-filled').css('width', '0%');
        }

        async loadFavorite(favoriteId) {
            const favorite = this.favorites.find(fav => fav.id === favoriteId);
            if (!favorite) return;

            $('#favorite-select').val(favoriteId);
            this.updateFavoriteListDisplay();

            this.clearPlaylist();

            const cachedPlaylist = this.getCachedPlaylist(favoriteId);
            if (cachedPlaylist && cachedPlaylist.length > 0) {
                this.showStatus('使用缓存播放列表', 'success');
                this.playlist = cachedPlaylist;
                this.updatePlaylistDisplay();
                this.enablePlaybackControls();

                this.checkForUpdates(favoriteId);
            } else {
                await this.loadPlaylist(favoriteId);
            }
        }

        getCachedPlaylist(favoriteId) {
            try {
                const cachedData = GM_getValue(`playlist_${favoriteId}`, null);
                if (cachedData) {
                    const data = JSON.parse(cachedData);
                    if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
                        return data.playlist;
                    }
                }
            } catch (e) {
                console.error('读取缓存失败:', e);
            }
            return null;
        }

        savePlaylistToCache(favoriteId, playlist) {
            try {
                const cacheData = {
                    playlist: playlist,
                    timestamp: Date.now(),
                    count: playlist.length
                };
                GM_setValue(`playlist_${favoriteId}`, JSON.stringify(cacheData));
            } catch (e) {
                console.error('保存缓存失败:', e);
            }
        }

        async checkForUpdates(favoriteId) {
            try {
                const favorite = this.favorites.find(fav => fav.id === favoriteId);
                if (!favorite) return;

                const medias = await this.getBvidData(favoriteId);
                if (!medias || medias.length === 0) return;

                const cachedPlaylist = this.getCachedPlaylist(favoriteId);
                if (cachedPlaylist && medias.length !== cachedPlaylist.length) {
                    this.showStatus(`发现新内容 (${medias.length - cachedPlaylist.length}首新音频)，点击更新按钮加载`, 'info');
                }
            } catch (error) {
                console.error('检查更新失败:', error);
            }
        }

        async updateCurrentFavorite() {
            if (!this.currentFavoriteId) {
                this.showStatus('请先选择收藏夹', 'error');
                return;
            }

            this.clearPlaylistCache(this.currentFavoriteId);
            await this.loadPlaylist(this.currentFavoriteId, true);
        }

        removeFavorite(favoriteId) {
            if (this.favorites.length <= 1) {
                this.showStatus('至少需要保留一个收藏夹', 'error');
                return;
            }

            this.favorites = this.favorites.filter(fav => fav.id !== favoriteId);
            this.clearPlaylistCache(favoriteId);

            if (this.currentFavoriteId === favoriteId) {
                this.currentFavoriteId = null;
                GM_setValue('lastFavoriteId', null);
                this.clearPlaylist();
                this.disableControls();
            }

            this.saveFavorites();
            this.updateFavoriteDisplay();
        }

        clearPlaylistCache(favoriteId = null) {
            if (favoriteId) {
                GM_deleteValue(`playlist_${favoriteId}`);
                this.showStatus(`已清除收藏夹缓存`, 'success');
            } else if (this.currentFavoriteId) {
                GM_deleteValue(`playlist_${this.currentFavoriteId}`);
                this.showStatus(`已清除当前收藏夹缓存`, 'success');
            } else {
                this.favorites.forEach(fav => {
                    GM_deleteValue(`playlist_${fav.id}`);
                });
                this.showStatus(`已清除所有缓存`, 'success');
            }
        }

        updateFavoriteDisplay() {
            const select = $('#favorite-select');
            select.empty();
            select.append('<option value="">选择收藏夹...</option>');

            this.favorites.forEach(favorite => {
                select.append(new Option(
                    `${favorite.name} (${favorite.trackCount}首)`,
                    favorite.id
                ));
            });

            if (this.currentFavoriteId) {
                select.val(this.currentFavoriteId);
                this.enableControls();
            } else {
                this.disableControls();
            }

            this.updateFavoriteListDisplay();
        }

        updateFavoriteListDisplay() {
            const list = $('#favorite-list');
            list.empty();

            this.favorites.forEach(favorite => {
                const isActive = favorite.id === this.currentFavoriteId;
                const item = $(`
                    <div class="favorite-item ${isActive ? 'active' : ''}">
                        <span>${favorite.name} (${favorite.trackCount}首)</span>
                        <div class="favorite-actions">
                            <button class="favorite-action" title="删除">❌</button>
                        </div>
                    </div>
                `);

                item.click(() => this.selectFavorite(favorite.id));
                item.find('.favorite-action').eq(0).click((e) => {
                    e.stopPropagation();
                    this.removeFavorite(favorite.id);
                });

                list.append(item);
            });
        }

        disableControls() {
            $('#update-favorite-btn').prop('disabled', true);
            $('#play-btn').prop('disabled', true);
            $('#prev-btn').prop('disabled', true);
            $('#next-btn').prop('disabled', true);
            $('#shuffle-btn').prop('disabled', true);
            $('#clear-cache-btn').prop('disabled', true);
        }

        enableControls() {
            $('#update-favorite-btn').prop('disabled', false);
            $('#clear-cache-btn').prop('disabled', false);
        }

        enablePlaybackControls() {
            $('#play-btn').prop('disabled', false);
            $('#prev-btn').prop('disabled', false);
            $('#next-btn').prop('disabled', false);
            $('#shuffle-btn').prop('disabled', false);
        }

        async loadPlaylist(sid, isUpdate = false) {
            if (this.isLoading) {
                this.showStatus('正在加载中，请稍候...', 'info');
                return;
            }

            this.isLoading = true;
            this.showStatus('<div class="loading"></div>加载收藏夹中...', 'info');
            this.disableControls();

            const progressEl = $('#loading-progress');
            progressEl.removeClass('hidden');

            try {
                const medias = await this.getBvidData(sid);
                if (!medias || medias.length === 0) {
                    this.showStatus('收藏夹为空或不存在', 'error');
                    return;
                }

                if (isUpdate && this.playlist.length > 0) {
                    await this.updatePlaylistWithNewData(medias, sid);
                } else {
                    await this.createNewPlaylist(medias, sid);
                }

            } catch (error) {
                this.showStatus('加载失败: ' + error.message, 'error');
                console.error('Load playlist error:', error);
            } finally {
                this.isLoading = false;
                progressEl.addClass('hidden');
                this.enableControls();
                this.enablePlaybackControls();
            }
        }

        async createNewPlaylist(medias, sid) {
            this.playlist = [];
            this.updatePlaylistDisplay();

            let successCount = 0;
            let errorCount = 0;

            const updateProgress = (current, total) => {
                const percent = (current / total) * 100;
                $('#progress-status').text(`加载音频信息中...`);
                $('#progress-count').text(`${current}/${total}`);
                $('#progress-bar-fill').css('width', percent + '%');
            };

            for (let i = 0; i < medias.length; i++) {
                const media = medias[i];
                updateProgress(i + 1, medias.length);

                try {
                    // 只获取视频基本信息，不获取音频URL
                    const track = await this.processMediaItem(media);
                    if (track) {
                        this.playlist.push(track);
                        successCount++;
                    }
                } catch (e) {
                    console.error(`Error processing ${media.bvid}:`, e);
                    errorCount++;
                }

                await new Promise(resolve => setTimeout(resolve, 100));
            }

            this.finalizePlaylistLoading(sid, successCount, errorCount);
        }

        async updatePlaylistWithNewData(medias, sid) {
            let newCount = 0;
            let updatedCount = 0;
            let errorCount = 0;

            const updateProgress = (current, total) => {
                const percent = (current / total) * 100;
                $('#progress-status').text(`更新音频信息中...`);
                $('#progress-count').text(`${current}/${total}`);
                $('#progress-bar-fill').css('width', percent + '%');
            };

            const existingTracksMap = new Map();
            this.playlist.forEach(track => {
                existingTracksMap.set(track.bvid, track);
            });

            for (let i = 0; i < medias.length; i++) {
                const media = medias[i];
                updateProgress(i + 1, medias.length);

                if (existingTracksMap.has(media.bvid)) {
                    updatedCount++;
                    continue;
                }

                try {
                    const track = await this.processMediaItem(media);
                    if (track) {
                        this.playlist.push(track);
                        newCount++;
                    }
                } catch (e) {
                    console.error(`Error processing ${media.bvid}:`, e);
                    errorCount++;
                }

                await new Promise(resolve => setTimeout(resolve, 100));
            }

            let statusMsg = `更新完成: 新增 ${newCount} 首`;
            if (updatedCount > 0) {
                statusMsg += `, 已存在 ${updatedCount} 首`;
            }
            if (errorCount > 0) {
                statusMsg += `, 失败 ${errorCount} 首`;
            }

            this.finalizePlaylistLoading(sid, this.playlist.length, errorCount, statusMsg);
        }

        async processMediaItem(media) {
            // 只获取视频基本信息，不获取音频URL
            const videoInfo = await this.getVideoInfo(media.bvid);

            return {
                bvid: media.bvid,
                title: videoInfo.title,
                duration: videoInfo.duration,
                cid: videoInfo.cid, // 保存cid用于播放时获取音频URL
                lastUpdated: Date.now()
            };
        }

        // 播放时实时获取音频URL
        async getAudioUrl(bvid, cid) {
            try {
                const audioInfo = await this.getAudioPlayInfo(bvid, cid);

                if (audioInfo.dash && audioInfo.dash.audio) {
                    const bestAudio = audioInfo.dash.audio.reduce((best, current) =>
                        (current.bandwidth || 0) > (best.bandwidth || 0) ? current : best
                    );
                    return bestAudio.baseUrl || bestAudio.backupUrl;
                }

                if (audioInfo.durl && audioInfo.durl.length > 0) {
                    return audioInfo.durl[0].url;
                }

                throw new Error('无法获取音频URL');
            } catch (error) {
                console.error('获取音频URL失败:', error);
                throw error;
            }
        }

        finalizePlaylistLoading(sid, successCount, errorCount, customMessage = null) {
            const favoriteIndex = this.favorites.findIndex(fav => fav.id === sid);
            if (favoriteIndex !== -1) {
                this.favorites[favoriteIndex].trackCount = successCount;
                this.favorites[favoriteIndex].lastUpdated = Date.now();
                this.saveFavorites();
                this.updateFavoriteDisplay();
            }

            this.savePlaylistToCache(sid, this.playlist);
            this.updatePlaylistDisplay();

            let statusMsg = customMessage || `成功加载 ${successCount} 首音频信息`;
            if (errorCount > 0 && !customMessage) {
                statusMsg += ` (${errorCount} 首加载失败)`;
            }

            this.showStatus(statusMsg, 'success');
        }

        getBvidData(sid) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.bilibili.com/x/space/fav/season/list?season_id=${sid}&pn=1&ps=1000`,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://www.bilibili.com/'
                    },
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.code === 0) {
                                resolve(data.data.medias || []);
                            } else {
                                reject(new Error(data.message || 'API错误'));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: reject
                });
            });
        }

        getVideoInfo(bvid) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://www.bilibili.com/'
                    },
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.code === 0) {
                                resolve(data.data);
                            } else {
                                reject(new Error(data.message || 'API错误'));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: reject
                });
            });
        }

        getAudioPlayInfo(bvid, cid) {
            return new Promise((resolve, reject) => {
                // 尝试多种参数组合
                const urls = [
                    `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=0&fnval=16&fourk=1`,
                    `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=16&fnval=16`,
                    `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=0&fnval=4048`
                ];

                const tryNextUrl = (index) => {
                    if (index >= urls.length) {
                        reject(new Error('所有音频格式尝试失败'));
                        return;
                    }

                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: urls[index],
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Referer': 'https://www.bilibili.com/'
                        },
                        onload: function(response) {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data.code === 0) {
                                    resolve(data.data);
                                } else if (index < urls.length - 1) {
                                    tryNextUrl(index + 1);
                                } else {
                                    reject(new Error(data.message || 'API错误'));
                                }
                            } catch (e) {
                                if (index < urls.length - 1) {
                                    tryNextUrl(index + 1);
                                } else {
                                    reject(e);
                                }
                            }
                        },
                        onerror: function(error) {
                            if (index < urls.length - 1) {
                                tryNextUrl(index + 1);
                            } else {
                                reject(error);
                            }
                        }
                    });
                };

                tryNextUrl(0);
            });
        }

        togglePlayMode() {
            const modes = ['sequential', 'loop', 'random'];
            const currentIndex = modes.indexOf(this.playMode);
            this.playMode = modes[(currentIndex + 1) % modes.length];

            this.updateModeButton();
            this.saveSettings();

            const modeNames = {'sequential': '顺序播放', 'loop': '列表循环', 'random': '随机播放'};
            this.showStatus(`播放模式: ${modeNames[this.playMode]}`, 'success');
        }

        updateModeButton() {
            const btn = $('#mode-btn');
            btn.attr('data-mode', this.playMode);
            btn.toggleClass('active', this.playMode === 'random');
            btn.text({'sequential': '顺序', 'loop': '循环', 'random': '随机'}[this.playMode]);
        }

        handleTrackEnd() {
            this.playNext();
        }

        playNext() {
            if (this.playlist.length === 0 || this.isLoading) return;

            if (this.playMode === 'sequential') {
                this.playNextSequential();
            } else if (this.playMode === 'loop') {
                this.playNextLoop();
            } else {
                this.playNextRandom();
            }
        }

        playNextSequential() {
            const currentIndex = this.playlist.findIndex(track => track.bvid === this.currentTrack?.bvid);
            const nextIndex = (currentIndex + 1) % this.playlist.length;
            this.playTrack(nextIndex);
        }

        playNextLoop() {
            const currentIndex = this.playlist.findIndex(track => track.bvid === this.currentTrack?.bvid);
            const nextIndex = (currentIndex + 1) % this.playlist.length;
            this.playTrack(nextIndex);
        }

        playNextRandom() {
            if (this.playlist.length === 0) return;
            const randomIndex = Math.floor(Math.random() * this.playlist.length);
            this.playTrack(randomIndex);
        }

        playPrev() {
            if (this.playlist.length === 0 || this.isLoading) return;

            const currentIndex = this.playlist.findIndex(track => track.bvid === this.currentTrack?.bvid);
            if (currentIndex === -1) return;

            let prevIndex;
            if (this.playMode === 'random') {
                prevIndex = Math.floor(Math.random() * this.playlist.length);
            } else {
                prevIndex = currentIndex <= 0 ? this.playlist.length - 1 : currentIndex - 1;
            }
            this.playTrack(prevIndex);
        }

        playRandom() {
            if (this.playlist.length === 0 || this.isLoading) return;
            this.playNextRandom();
        }

        async playTrack(index) {
            if (index < 0 || index >= this.playlist.length) return;

            const track = this.playlist[index];
            this.currentTrack = track;

            $('#track-title').text(track.title);
            $('#audio-info').text(`时长: ${this.formatTime(track.duration)} 加载中...`);

            // 设置音频源之前先停止当前播放
            this.audio.pause();
            this.audio.currentTime = 0;

            try {
                this.showStatus('<div class="loading"></div>获取音频地址中...', 'info');

                // 播放时实时获取音频URL
                const audioUrl = await this.getAudioUrl(track.bvid, track.cid);

                if (!audioUrl) {
                    throw new Error('无法获取音频地址');
                }

                this.audio.src = audioUrl;
                this.audio.load();
                $('#audio-info').text(`时长: ${this.formatTime(track.duration)}`);
                this.updatePlaylistDisplay();
                this.play();
            } catch (error) {
                this.showStatus('获取音频地址失败: ' + error.message, 'error');
                setTimeout(() => this.playNext(), 2000);
            }
        }

        play() {
            this.audio.play().then(() => {
                this.isPlaying = true;
                $('#play-btn').text('暂停');
                this.showStatus('开始播放', 'success');
            }).catch(error => {
                this.showStatus('播放失败: ' + error.message, 'error');

                // 如果是源文件问题，尝试下一首
                if (error.name === 'NotSupportedError' || error.name === 'MediaError') {
                    setTimeout(() => this.playNext(), 2000);
                }
            });
        }

        pause() {
            this.audio.pause();
            this.isPlaying = false;
            $('#play-btn').text('播放');
        }

        togglePlay() {
            if (!this.currentTrack) {
                if (this.playlist.length > 0) this.playRandom();
                return;
            }

            if (this.isLoading) return;

            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        }

        removeTrack(bvid) {
            if (!bvid || this.playlist.length <= 1) {
                this.showStatus('播放列表至少需要保留一首歌曲', 'error');
                return;
            }

            const trackIndex = this.playlist.findIndex(track => track.bvid === bvid);
            if (trackIndex === -1) return;

            const trackTitle = this.playlist[trackIndex].title;
            this.playlist.splice(trackIndex, 1);

            if (this.currentTrack && this.currentTrack.bvid === bvid) {
                this.currentTrack = null;
                this.audio.src = '';
                this.isPlaying = false;
                $('#play-btn').text('播放');
                $('#track-title').text('请选择歌曲开始播放');
                $('#audio-info').text('-');
            }

            if (this.currentFavoriteId) {
                this.savePlaylistToCache(this.currentFavoriteId, this.playlist);
            }

            this.updatePlaylistDisplay();
            this.showStatus(`已删除歌曲: ${this.truncateTitle(trackTitle)}`, 'success');
        }

        updatePlaylistDisplay() {
            const container = $('#playlist-container');
            container.empty();

            $('#playlist-count').text(this.playlist.length);

            this.playlist.forEach((track, index) => {
                const isActive = this.currentTrack && track.bvid === this.currentTrack.bvid;

                const item = $(`
                    <div class="playlist-item ${isActive ? 'active' : ''}" data-index="${index}">
                        <div class="playlist-item-content">
                            ${index + 1}. ${this.truncateTitle(track.title)}
                        </div>
                        <div class="playlist-item-actions">
                            <button class="playlist-item-action" title="删除此歌曲">🗑️</button>
                        </div>
                    </div>
                `);

                item.click((e) => {
                    if (!$(e.target).closest('.playlist-item-actions').length) {
                        this.playTrack(index);
                    }
                });

                item.find('.playlist-item-action').click((e) => {
                    e.stopPropagation();
                    this.removeTrack(track.bvid);
                });

                container.append(item);
            });

            const hasPlaylist = this.playlist.length > 0;
            $('#shuffle-btn').prop('disabled', !hasPlaylist);
        }

        shufflePlaylist() {
            if (this.isLoading || this.playlist.length === 0) return;

            for (let i = this.playlist.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
            }
            this.updatePlaylistDisplay();
            this.showStatus('播放列表已打乱', 'success');
        }

        seek(e) {
            if (!this.audio.duration || this.isLoading) return;

            const progressBar = $('#progress-bar')[0];
            const rect = progressBar.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const newTime = percent * this.audio.duration;

            this.audio.currentTime = newTime;
            this.updateProgress();
        }

        updateProgress() {
            if (!this.audio.duration) return;

            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            $('#progress-filled').css('width', percent + '%');
            $('#current-time').text(this.formatTime(this.audio.currentTime));
        }

        updateDuration() {
            $('#duration').text(this.formatTime(this.audio.duration));
        }

        formatTime(seconds) {
            if (!seconds || isNaN(seconds)) return '00:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        setVolume(volume) {
            this.currentVolume = volume;
            this.audio.volume = volume;
        }

        loadVolume() {
            const savedVolume = GM_getValue('volume', 0.7);
            this.setVolume(savedVolume);
            $('#volume-slider').val(savedVolume * 100);
            $('#volume-value').text(Math.round(savedVolume * 100) + '%');
        }

        showStatus(message, type = 'info') {
            const statusEl = $('#status-message');
            statusEl.html(message).removeClass('info error success loading').addClass(type);

            if (type !== 'loading') {
                setTimeout(() => {
                    if (statusEl.text() === message) {
                        statusEl.removeClass('info error success').addClass('info').text('准备就绪');
                    }
                }, 5000);
            }
        }

        truncateTitle(title, maxLength = 40) {
            return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
        }

        toggleMinimize() {
            const content = $('.player-content');
            const isVisible = content.is(':visible');
            content.slideToggle(300);
            $('#minimize-btn').text(isVisible ? '+' : '−');
            GM_setValue('playerMinimized', !isVisible);
        }

        restoreWindowState() {
            const isMinimized = GM_getValue('playerMinimized', false);

            if (isMinimized) {
                $('.player-content').hide();
                $('#minimize-btn').text('+');
            }
        }
    }

    // 初始化播放器
    $(document).ready(() => {
        setTimeout(() => {
            try {
                new BilibiliAudioPlayer();
                console.log('B站音频播放器初始化成功');
            } catch (error) {
                console.error('B站音频播放器初始化失败:', error);
            }
        }, 2000);
    });

    // 全局键盘快捷键
    $(document).on('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'p') {
            e.preventDefault();
            const player = $('#bilibili-audio-player');
            if (player.is(':visible')) {
                player.fadeOut(300);
            } else {
                player.fadeIn(300);
            }
        }

        if (e.key === ' ' && !e.target.matches('input, textarea, select')) {
            e.preventDefault();
            const playBtn = $('#play-btn');
            if (playBtn.length) {
                playBtn.click();
            }
        }
    });
})();