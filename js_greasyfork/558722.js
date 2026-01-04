// ==UserScript==
// @name        openlist扩展音乐播放器
// @author       remramEMT
// @version      0.2
// @description  在openlist网页上扩展一个更好用的音乐播放器
// @include     *://*:5244/*
// @include     *://*:5244/*
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license MII
// @namespace https://greasyfork.org/users/1275713
// @downloadURL https://update.greasyfork.org/scripts/558722/openlist%E6%89%A9%E5%B1%95%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558722/openlist%E6%89%A9%E5%B1%95%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
          .floatingWindow button:focus {
             outline: none;
          }
           #positioning{
            background: none;
               border: none;
               color: #666;
               font-size: 1.2rem;
               cursor: pointer;
               padding: 5px 10px;
               border-radius: 50%;
           }
           #positioning:hover{
            color: #3498db;
               background: rgba(52, 152, 219, 0.1);
           }
           #playModeBtn {
               background: none;
               border: none;
               color: #666;
               font-size: 1.2rem;
               cursor: pointer;
               padding: 5px 10px;
               border-radius: 50%;
               transition: all 0.3s;
           }
           #playModeBtn:hover {
               color: #3498db;
               background: rgba(52, 152, 219, 0.1);
           }
           #playModeBtn.active {
               color: #3498db;
           }
           .fa-random {
               transition: transform 0.3s;
           }
           #playModeBtn:hover .fa-random {
               transform: rotate(180deg);
           }
    .currentCard{
             box-shadow:
                0 0 10px rgba(0, 255, 255, 0.5),
                0 0 20px rgba(0, 255, 255, 0.3),
                0 0 40px rgba(0, 255, 255, 0.2),
                0 0 80px rgba(0, 255, 255, 0.1);
            animation: neon-glow 3s ease-in-out infinite alternate;
        }
      @keyframes neon-glow {
            from {
                box-shadow:
                    0 0 10px rgba(0, 255, 255, 0.5),
                    0 0 15px rgba(0, 255, 255, 0.4),
                    0 0 20px rgba(0, 255, 255, 0.3),
                    0 0 40px rgba(0, 255, 255, 0.2),
                    0 0 80px rgba(0, 255, 255, 0.1);
            }}
    .player-hidden {
            transform: scale(0.8) translate(-50%, -50%) !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    #musicPlayer {
            position: fixed !important;
            background: white !important;
            border-radius: 20px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
            overflow: hidden !important;
            z-index: 97 !important;
            left: 0px ;
            top: 0px;
            font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
        }


        #playerHeader {
        height: 30px ;
        background: linear-gradient(to right, #6a11cb 0%, #2575fc 100% 100%);
        cursor: move ;
        }

        #playerToggle {
            position: fixed !important;
            bottom: 20px !important;
            left: 20px !important;
            width: 40px !important;
            height: 40px !important;
            background: linear-gradient(135deg, #9e57cd, #517aff) !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            cursor: pointer !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
            z-index: 98 !important;
            transition: all 0.3s ease !important;
        }

        #playerToggle:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }
        .floatingWindow * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .floatingWindow body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
            padding: 20px;
        }

        .floatingWindow {
            max-width: 800px;
            margin: 0 auto;
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .floatingWindow header {
            background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
            color: white;
            padding: 30px 40px;
            padding-top: 0px;
            text-align: center;
        }

        .floatingWindow header h1 {
            font-size: 2.8rem;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }

        .floatingWindow header h1 i {
            font-size: 3rem;
            color: #ffde59;
        }

        .floatingWindow header p {
            font-size: 1.1rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
        }

        .stats-bar {
            display: flex;
            justify-content: space-around;
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #ffde59;
        }

        .stat-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }

        .controls {
            padding: 10px;
            background: #f8f9fa;
            border-bottom: 1px solid #eaeaea;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
        }

        .search-box {
            flex: 1;
            min-width: 300px;
            position: relative;
        }

        .search-box input {
            width: 100%;
            padding: 12px 20px 12px 45px;
            border: 2px solid #e0e0e0;
            border-radius: 50px;
            font-size: 1rem;
            transition: all 0.3s;
        }

        .search-box input:focus {
            outline: none;
            border-color: #6a11cb;
            box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
        }

        .search-box i {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
        }

        .filter-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 10px;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 15px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .filter-btn:hover {
            border-color: #2575fc;
            color: #2575fc;
        }

        .filter-btn.active {
            background: linear-gradient(to right, #6a11cb 0%, #2575fc 100% 100%);;
            color: white !important;
            border-color: #6a11cb !important;
        }

        .filter-buttons button{
            padding: 10px 10px;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s;
        }
       .filter-buttons button:hover {
            border-color: #6a11cb;
            color: #6a11cb;
        }
        .music-grid {
            height: 800px;
            overflow-y: auto;
            padding: 15px;
        }

       .music-grid::-webkit-scrollbar-track {
           background-color: #fff; /* 轨道颜色 */
           border-radius: 6px;
       }

       .music-grid::-webkit-scrollbar-thumb {
           background-color: #ccc; /* 滑块颜色 */
           border-radius: 6px;
        }
        .music-card {
            margin: 5px 0;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            border: 1px solid #f0f0f0;
            display: grid;
            grid-template-columns: 1fr 0fr; /* 两列，等宽 */
            grid-template-rows: auto auto;   /* 两行，高度自适应 */
        }

        .music-card:hover {
            transform:  scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .music-header {
            padding: 5px 20px;
            background: linear-gradient(to right, #f8f9fa, #ffffff);

            align-items: center;
            grid-column: 1 / span 2; grid-row: 1;
        }

        .music-icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(to right, #6a11cb, #2575fc);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.8rem;
        }

        .music-info {
            flex: 1;
            color:#888
        }

        .music-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 5px;
            line-height: 1.4;
        }

        .music-format {
            color: #FFD700;
            font-weight: 600;

        }

        .music-details {

            display: flex;
            align-items: center;
            justify-content: space-around;
        }


        .detail-row {
            display: flex;
            align-items: center;

        }

        .detail-label {
            font-weight: 500;
            color: #666;
            display: flex;
            align-items: center;
            margin-left:10px;
        }

        .detail-value {
            font-weight: 600;
            color: #666;
            max-width: 200px;
            text-align: right;
            word-break: break-word;
        }

        .music-actions {
            padding: 5px 8px;
            justify-content: space-between;
            display: flex;

            gap: 15px;


        }

        .action-btn {
           width: 70px;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;

        }

        .play-btn {
            background: linear-gradient(to right, #6a11cb, #2575fc);
            color: white;
        }

        .play-btn:hover {
                background: linear-gradient(to right, #6a11cb, #2575fc);
            box-shadow: 0 0 20px 0px rgba(106, 17, 203, 0.4);
        }
        .delete-btn{
            background: white;
            color: #666;
            border: 2px solid #e0e0e0;
        }
        .delete-btn:hover{
           border-color: #dc3545;
           color: #dc3545;
        }

        .download-btn {
            background: white;
            color: #666;
            border: 2px solid #e0e0e0;
        }

        .download-btn:hover {
            border-color: #2563EB;
            color: #2563EB;
        }

        .empty-state {
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }

        .empty-state i {
            font-size: 4rem;
            color: #ddd;
            margin-bottom: 20px;
        }

        .empty-state h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: #999;
        }

        .player {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 10px;
            box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
            display: none;
            align-items: center;
            gap: 20px;
            z-index: 1000;
        }

        .player.show {
            display: grid;
            grid-template-columns: 0fr 1fr;
            grid-template-rows: auto auto;
        }

        .player-info {
            display: grid;
            grid-column: 2;
            grid-row: 1;
            align-items: center;
            grid-template-columns: auto auto;
            grid-template-rows: 1fr;
            justify-content: start
        }

        .player-title {
            font-weight: 600;
            color: #2c3e50;
            white-space: nowrap;
            overflow-x: auto;
            text-overflow: ellipsis;
        }
        /* 美化滚动条 */
        .player-title::-webkit-scrollbar {
            height: 0px;
        }

        .player-artist {
            color: #666;
            font-size: 0.9rem;
            margin-left: 10px;
        }

        .player-controls {
            grid-column: 1;
            grid-row: 1 /span 2;
        }
        .player-controls .big{
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .player-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: #6a11cb;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s;
        }

        .player-btn:hover {
            background: #2575fc;
            transform: scale(1.1);
        }

        .progress-container {
            grid-column: 2;
            grid-row: 2;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 3px;
            overflow: hidden;
            cursor: pointer;
        }

        .progress {
            height: 100%;
            background: #6a11cb;
            width: 0%;
            transition: width 0.1s;
        }

        .time-display {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            font-size: 0.85rem;
            color: #666;
        }

        @media (max-width: 768px) {
        .player-controls .placeholder{
           width:79px
        }
        .player-controls{
           display: flex;
           justify-content: space-between;
           align-items: center;
        }
        .floatingWindow {
            min-width: 569px;
            }
        .music-card{
           grid-template-columns: 1fr 0fr;
           grid-template-rows: 1fr 0fr;
        }
        .music-header{
          grid-column: 1;
          grid-row: 1;
        }
        .music-details{
          grid-column: 1;
          grid-row: 2;
        }
        .music-actions{
          grid-column: 2;
          grid-row: 1 / span 2;
          flex-direction: column;
          gap:0;
          justify-content: space-around;
        }
        .action-btn{
        height:24px;

        }
          #audio-player {
            grid-template-columns: 1fr;
           }
           #music-grid{
            min-height:auto
           }
           .player-info{
            grid-column: 1;
            grid-row: 1;
           }
           .progress-container{
             grid-column: 1;
             grid-row: 2;
           }
           .player-controls{
            grid-column: 1;
            grid-row: 3;
           }
           .floatingWindow header{
           padding:10px
           }
           #playerHeader{
              display:none
            }
            .music-grid {
                grid-template-columns: 1fr;
                padding: 10px;
            }

            .controls {
                padding: 8px;
                flex-direction: column;
                align-items: stretch;
            }

            .search-box {
                min-width: 100%;
            }

            .player {
                flex-direction: column;
                gap: 0px;
            }

            .player-controls {
                width: 100%;
            }

            header h1 {
                font-size: 2rem;
            }
        }
    `;
    document.head.appendChild(style);

    //获取音乐目录
    let storag = localStorage.getItem('music_dir')|| ''
    // 创建播放器HTML
    const playerHTML = `
        <div id="musicPlayer" class="player-hidden">
            <!-- 播放器头部 (可拖动区域) -->

<div class="floatingWindow" >
<div id="playerHeader"></div>
        <header >
                    <h1><i class="fa fa-music"></i>我的音乐</h1>
            <div class="stats-bar">
                <div class="stat-item">
                    <div class="stat-number" id="total-files">0</div>
                    <div class="stat-label">总文件数</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" id="total-size">0 GB</div>
                    <div class="stat-label">总大小</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" id="flac-count">0</div>
                    <div class="stat-label">FLAC文件</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" id="last-updated">-</div>
                    <div class="stat-label">最近更新</div>
                </div>
            </div>
        </header>

        <div class="controls">
            <div class="search-box">
                <i class="fa fa-search"></i>
                <input type="text" id="search-input" placeholder="搜索歌曲、艺术家或专辑...">
            </div>
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">
                     <i class="fa-solid fa-bars"></i>全部
                </button>

                <button class="filter-btn" data-filter="recent">
                    <i class="fa-solid fa-clock-rotate-left"></i>最近
                </button>

                <button class="reset-btn" id="reset" >
                    <i class="fa-solid fa-arrows-rotate"></i>刷新
                </button>
                <button class="change-btn" id="change">
                    <i class="fa-regular fa-folder-open"></i>${storag? '更改目录':'添加目录'}
                </button>

            </div>
        </div>

        <div class="music-grid" id="music-grid">
            <!-- 音乐卡片会动态生成在这里 -->
            <div class="empty-state" id="empty-state">
                <i class="fa fa-music"></i>
                <h3>暂无音乐文件</h3>
                <p>请添加您的音乐文件目录</p>
            </div>
        </div>
        <div class="player" id="audio-player">
        <div class="player-info">
            <div class="player-title" id="player-title">未选择歌曲</div>
            <div class="player-artist" id="player-artist">请从列表中选择一首歌曲</div>
        </div>
        <div class="progress-container">
            <div class="progress-bar" id="progress-bar">
                <div class="progress" id="progress"></div>
            </div>
            <div class="time-display">
                <span id="current-time">0:00</span>
                <span id="duration">0:00</span>
            </div>

        </div>
        <div class="player-controls">
        <div class="small">
           <button id="positioning" title="定位">
                <i class="fa-solid fa-crosshairs"></i>
            </button>
            <button id="playModeBtn" class="control-btn" title="列表循环">
                 <i id="playModeIcon" class="fas fa-repeat"></i>
            </button>
        </div>
        <div class="big">
            <button class="player-btn" id="prev-btn" title="上一首">
                <i class="fa fa-step-backward"></i>
            </button>
            <button class="player-btn" id="play-btn" title="播放">
                <i class="fa fa-play"></i>
            </button>
            <button class="player-btn" id="next-btn" title="下一首">
                <i class="fa fa-step-forward"></i>
            </button>
        </div>
        <div class="placeholder"></div>
        </div>
            </div>
        </div>

    </div>
        <!-- 切换按钮 -->
        <div id="playerToggle" >
            <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
        </div>
    `;

    // 检查是否已加载Font Awesome
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }

    // 全局变量
    let allMusicData = [];
    let filteredData = [];
    let currentPlayingIndex = -1;
    let audio = null;
    const host = window.location.host || ''

    // 播放模式常量
    const PLAY_MODES = {
        LIST_LOOP: 'list_loop', // 列表循环（默认）
        SINGLE_LOOP: 'single_loop',// 单曲循环
        RANDOM: 'random' // 随机播放
    };
    // 当前播放模式
    let currentPlayMode = PLAY_MODES.LIST_LOOP;

    // 添加播放器到页面
    const container = document.createElement('div');
    container.innerHTML = playerHTML;
    document.body.appendChild(container);
    // 初始化拖动功能
    initDraggable();
    // 初始化切换按钮
    initToggle();
    // 拖动功能
    function initDraggable() {
        const musicPlayer = document.getElementById('musicPlayer');
        const playerHeader = document.getElementById('playerHeader');

        let isDragging = false;
        let offsetX, offsetY;

        // 鼠标按下事件
        playerHeader.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            isDragging = true;
            // 计算鼠标点击位置相对于播放器的偏移量
            offsetX = e.clientX - musicPlayer.getBoundingClientRect().left;
            offsetY = e.clientY - musicPlayer.getBoundingClientRect().top;

            // 添加视觉反馈
            playerHeader.style.opacity = '0.8';
            musicPlayer.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            // 计算新位置
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            // 限制播放器在视口内
            const maxX = window.innerWidth - musicPlayer.offsetWidth;
            const maxY = window.innerHeight - musicPlayer.offsetHeight;

            const boundedX = Math.max(0, Math.min(x, maxX));
            const boundedY = Math.max(0, Math.min(y, maxY));

            // 更新播放器位置
            musicPlayer.style.left = boundedX + 'px';
            musicPlayer.style.top = boundedY + 'px';
        });

        // 鼠标释放事件
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;

                // 恢复视觉效果
                playerHeader.style.opacity = '1';
                musicPlayer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }
        });
    }
    // 切换按钮功能
    function initToggle() {
        const toggleBtn = document.getElementById('playerToggle');
        const musicPlayer = document.getElementById('musicPlayer');
        let isVisible = false;

        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            isVisible = !isVisible;
            if (isVisible) {
                musicPlayer.classList.remove('player-hidden');
                toggleBtn.innerHTML = '<i class="fa-solid fa-down-left-and-up-right-to-center"></i>';
            } else {
                musicPlayer.classList.add('player-hidden');
                toggleBtn.innerHTML = '<i class="fa-solid fa-up-right-and-down-left-from-center"></i>';
            }
        });
    }

    // DOM元素
    const musicGrid = document.getElementById('music-grid');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const player = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const totalFilesEl = document.getElementById('total-files');
    const totalSizeEl = document.getElementById('total-size');
    const flacCountEl = document.getElementById('flac-count');
    const lastUpdatedEl = document.getElementById('last-updated');
    const reset = document.getElementById('reset')
    const positioning = document.getElementById('positioning')
    const playModeBtn = document.getElementById('playModeBtn');

    // 更新统计数据
    function updateStats() {
        const totalFiles = allMusicData.length;
        const totalSize = allMusicData.reduce((sum, item) => sum + item.size, 0);
        const flacCount = allMusicData.filter(item => item.name.toLowerCase().endsWith('.flac')).length;
        const latestDate = allMusicData.length > 0
        ? new Date(Math.max(...allMusicData.map(item => new Date(item.modified))))
        : null;
        totalFilesEl.textContent = totalFiles;
        totalSizeEl.textContent = (totalSize / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        flacCountEl.textContent = flacCount;

        if (latestDate) {
            lastUpdatedEl.textContent = formatDate(latestDate);
        }
    }

    // 格式化日期
    function formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return '今天';
        } else if (diffDays === 1) {
            return '昨天';
        } else if (diffDays < 7) {
            return `${diffDays}天前`;
        } else {
            return date.toLocaleDateString('zh-CN');
        }
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 提取艺术家和歌曲名
    function parseMusicInfo(filename) {
        const parts = filename.split(' - ');
        if (parts.length >= 2) {
            return {
                artist: parts[0].trim(),
                title: parts.slice(1).join(' - ').replace(/\.[^/.]+$/, "")
            };
        }
        return {
            artist: '未知艺术家',
            title: filename.replace(/\.[^/.]+$/, "")
        };
    }

    // 获取文件格式
    function getFileFormat(filename) {
        const ext = filename.split('.').pop().toUpperCase();
        return ext;
    }

    // 渲染音乐卡片
    function renderMusicCards() {
        musicGrid.innerHTML = '';

        if (filteredData.length === 0) {
            emptyState.style.display = 'block';
            emptyState.innerHTML = `
                    <i class="fa fa-search"></i>
                    <h3>未找到匹配的音乐</h3>
                    <p>尝试使用不同的搜索词或过滤器</p>
                `;
            musicGrid.appendChild(emptyState);
            return;
        }

        emptyState.style.display = 'none';

        filteredData.forEach((item, index) => {
            const musicInfo = parseMusicInfo(item.name);
            const fileSize = formatFileSize(item.size);
            const fileFormat = getFileFormat(item.name);
            const createdDate = new Date(item.created);
            const modifiedDate = new Date(item.modified);

            const card = document.createElement('div');
            card.className = 'music-card';
            card.dataset.index = index;

            card.innerHTML = `
                    <div class="music-header">
                        <div class="music-info">
                            <div class="music-title">${musicInfo.title}</div>
                            <div>${musicInfo.artist}</div>
                        </div>
                    </div>
                    <div class="music-details">
                        <div class="detail-row">
                            <span class="detail-label">文件大小:</span>
                            <span class="detail-value">${fileSize}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label"> 更新时间:</span>
                            <span class="detail-value">${formatDate(modifiedDate)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label"> 文件格式:</span>
                             <div class="${fileFormat === 'FLAC'? 'music-format': 'detail-value'}">${fileFormat}</div>
                        </div>
                    </div>
                    <div class="music-actions">
                        <button class="action-btn play-btn" data-action="play" data-index="${index}">
                            <i class="fa fa-play"></i> 播放
                        </button>
                        <button class="action-btn download-btn" data-action="download" data-path="${item.path}" data-sign="${item.sign}">
                            <i class="fa fa-download"></i> 下载
                        </button>
                        <button class="action-btn delete-btn" data-action="delete" data-path="${item.path}">
                            <i class="fa fa-trash"></i> 删除
                        </button>
                    </div>
                `;

            musicGrid.appendChild(card);
        });

        // 为播放和下载按钮添加事件监听器
        document.querySelectorAll('.music-card [data-action="play"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('[data-index]').dataset.index);
                playMusic(index);
            });
        });

        document.querySelectorAll('.music-card [data-action="download"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const path = e.target.closest('[data-path]').dataset.path;
                // 获取文件名（
                const fileName = path.split('/').pop();
                const sign = e.target.closest('[data-sign]').dataset.sign;
                downloadMusic(fileName, sign);
            });
        });

        document.querySelectorAll('.music-card [data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const path = e.target.closest('[data-path]').dataset.path;
                // 获取文件名
                const fileName = path.split('/').pop();
                Swal.fire({
                    title: `确定删除【${fileName}】吗？`,
                    text: "此操作不可撤销！",
                    icon: 'warning',
                    showCancelButton: true,
                    zIndex: 100,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // 执行删除操作
                        fetch(`http://${host}/api/fs/remove`, {
                            method: 'POST',
                            headers: {
                                "accept": "application/json, text/plain, */*",
                                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                                "authorization": localStorage.getItem('token'),
                                "content-type": "application/json;charset=UTF-8"
                            },
                            body: JSON.stringify({
                                dir:storag,
                                names:[`${fileName}`]
                            }),
                        })
                            .then(() => {
                            Swal.fire({
                                title: '删除成功!',
                                text: '项目已成功删除',
                                icon: 'success',
                                timer: 2000,
                                timerProgressBar: true,
                                showConfirmButton: true
                            });
                            //重新加载文件列表
                            reset.click()

                        })
                            .catch(error => {
                            // 错误处理
                            Swal.fire('错误!', '删除失败: ' + error.message, 'error');
                        });
                    }
                });
            });
        });
    }
    // 跳转到当前播放音乐
    const gotoCurrentCard = ()=>document.querySelector(`.music-card.currentCard`).scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
    // 播放音乐
    function playMusic(index) {
        if (index < 0 || index >= filteredData.length) return;
        const item = filteredData[index];
        const fileName = item.path.split('/').pop();
        currentPlayingIndex = index;

        // 解析歌曲信息
        const musicInfo = parseMusicInfo(item.name);
        playerTitle.textContent = musicInfo.title;
        playerArtist.textContent = musicInfo.artist;

        // 构建播放URL
        const playUrl = `http://${host}/d/${storag}/${fileName}?sign=${item.sign}`;

        // 创建或更新audio元素
        if (!audio) {
            audio = new Audio();
            setupAudioEvents();
        }

        audio.src = playUrl;
        player.classList.add('show');

        // 更新播放按钮状态
        playBtn.innerHTML = '<i class="fa fa-pause"></i>';
        playBtn.title = '暂停';
        playBtn.dataset.playing = 'true';

        // 尝试播放
        audio.play().catch(error => {
            console.error('播放失败:', error);
            alert('播放失败: ' + error.message);
        });

        /* 所有卡片取消高亮*/
        document.querySelectorAll('.music-card').forEach(card => {
            card.classList.remove('currentCard');
        });
        /* 高亮当前播放的卡片*/
        const currentCard = document.querySelector(`.music-card[data-index="${index}"]`);
        if (currentCard) {
            currentCard.classList.add('currentCard');
        }
    }

    // 设置音频事件监听
    function setupAudioEvents() {
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', () => {
            durationEl.textContent = formatTime(audio.duration);
        });
        audio.addEventListener('ended', playNext);
    }

    // 更新播放进度
    function updateProgress() {
        if (!audio) return;

        const currentTime = audio.currentTime;
        const duration = audio.duration;

        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
            currentTimeEl.textContent = formatTime(currentTime);
        }
    }

    // 格式化时间（秒 → 分:秒）
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    // 切换播放模式
    function switchPlayMode() {
        switch (currentPlayMode) {
            case PLAY_MODES.LIST_LOOP:
                currentPlayMode = PLAY_MODES.SINGLE_LOOP;
                break;
            case PLAY_MODES.SINGLE_LOOP:
                currentPlayMode = PLAY_MODES.RANDOM;
                break;
            case PLAY_MODES.RANDOM:
                currentPlayMode = PLAY_MODES.LIST_LOOP;
                break;
        }
        updatePlayModeUI();

    }

    // 获取模式名称
    function getPlayModeName(mode) {
        const names = {
            [PLAY_MODES.LIST_LOOP]: '列表循环',
            [PLAY_MODES.SINGLE_LOOP]: '单曲循环',
            [PLAY_MODES.RANDOM]: '随机播放'
        };
        return names[mode] || '未知模式';
    }

    //切换播放模式后更新UI显示
    function updatePlayModeUI() {
        const modeIcon = document.getElementById('playModeIcon');
        if (!modeIcon) return;
        switch (currentPlayMode) {
            case PLAY_MODES.LIST_LOOP:
                modeIcon.className = 'fa-solid fa-repeat';
                modeIcon.title = '列表循环';
                break;
            case PLAY_MODES.SINGLE_LOOP:
                modeIcon.className = 'fa-solid fa-arrow-rotate-right';
                modeIcon.title = '单曲循环';
                break;
            case PLAY_MODES.RANDOM:
                modeIcon.className = 'fa-solid fa-shuffle';
                modeIcon.title = '随机播放';
                break;
        }
    }

    // 播放下一首
    function playNext() {
        if (filteredData.length === 0) return;

        let nextIndex;

        switch (currentPlayMode) {
            case PLAY_MODES.SINGLE_LOOP:
                // 单曲循环：播放同一首
                nextIndex = currentPlayingIndex;
                break;

            case PLAY_MODES.RANDOM:
                // 随机播放
                nextIndex = getRandomIndex();
                break;

            case PLAY_MODES.LIST_LOOP:
            default:
                // 列表循环：正常下一首，到底部时回到第一首
                if (currentPlayingIndex >= filteredData.length - 1) {
                    nextIndex = 0; // 循环到开头
                } else {
                    nextIndex = currentPlayingIndex + 1;
                }
                break;
        }

        playMusic(nextIndex);
    }

    // 获取随机索引（避免连续两次随机到同一首）
    function getRandomIndex() {
        if (filteredData.length <= 1) return 0;

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * filteredData.length);
        } while (randomIndex === currentPlayingIndex && filteredData.length > 1);

        return randomIndex;
    }

    // 播放上一首
    function playPrev() {
        if (filteredData.length === 0) return;

        let prevIndex;

        switch (currentPlayMode) {
            case PLAY_MODES.SINGLE_LOOP:
                prevIndex = currentPlayingIndex;
                break;

            case PLAY_MODES.RANDOM:
                prevIndex = getRandomIndex();
                break;

            case PLAY_MODES.LIST_LOOP:
            default:
                if (currentPlayingIndex <= 0) {
                    prevIndex = filteredData.length - 1; // 到第一首时跳到最后
                } else {
                    prevIndex = currentPlayingIndex - 1;
                }
                break;
        }

        playMusic(prevIndex);
    }

    // 切换播放/暂停
    function togglePlay() {
        if (!audio) return;

        if (audio.paused) {
            audio.play();
            playBtn.innerHTML = '<i class="fa fa-pause"></i>';
            playBtn.title = '暂停';
            playBtn.dataset.playing = 'true';
        } else {
            audio.pause();
            playBtn.innerHTML = '<i class="fa fa-play"></i>';
            playBtn.title = '播放';
            playBtn.dataset.playing = 'false';
        }
    }

    // 下载音乐
    function downloadMusic(fileName, sign) {
        // 根据你的服务器API调整下载URL
        const downloadUrl = `http://${host}/d/${storag}/${fileName}?sign=${sign}`;
        // 创建一个临时链接来触发下载
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // 显示下载提示
        showNotification('开始下载文件...');
    }

    // 显示通知
    function showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 10000;
                transform: translateX(150%);
                transition: transform 0.3s ease;
            `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // 显示通知
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // 3秒后隐藏并移除
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 过滤音乐数据
    function filterMusicData() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        filteredData = allMusicData.filter(item => {
            // 搜索过滤
            const matchesSearch = searchTerm === '' || item.name.toLowerCase().includes(searchTerm)

            // 过滤器过滤
            let matchesFilter = true;
            switch (activeFilter) {
                case 'flac':
                    matchesFilter = item.name.toLowerCase().endsWith('.flac');
                    break;
                case 'large':
                    matchesFilter = item.size > 50 * 1024 * 1024; // > 50MB
                    break;
                case 'recent': {
                    // 使用块作用域包裹
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    matchesFilter = new Date(item.created) > sevenDaysAgo;
                    break;
                }
            }

            return matchesSearch && matchesFilter;
        });

        renderMusicCards();
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 搜索输入
        searchInput.addEventListener('input', filterMusicData);

        // 过滤器按钮
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterMusicData();
            });
        });

        // 播放器控制
        playBtn.addEventListener('click', togglePlay);
        prevBtn.addEventListener('click', playPrev);
        nextBtn.addEventListener('click', playNext);
        positioning.addEventListener('click', gotoCurrentCard);
        playModeBtn.addEventListener('click', switchPlayMode);

        /* 进度条点击跳转
        progressBar.addEventListener('click', (e) => {
            if (!audio) return;
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * audio.duration;
        });*/


        // 等待音频元素和进度条加载
        const checkInterval = setInterval(() => {

            if (progressBar && audio) {
                clearInterval(checkInterval);
                initDraggableProgress(progressBar, audio);
            }
        }, 1000);
        function initDraggableProgress(progressBar, audio) {
            let isDragging = false;

            // 添加必要的CSS
            const style = document.createElement('style');
            style.textContent = `
            .progress-bar {
                position: relative;
                cursor: pointer;
                user-select: none;
            }
            .progress-bar.dragging {
                cursor: grabbing;
            }
        `;
            document.head.appendChild(style);

            // 事件监听
            progressBar.addEventListener('mousedown', startDrag);
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', endDrag);

            function startDrag(e) {
                isDragging = true;
                progressBar.classList.add('dragging');
                updateProgress(e);
            }

            function onDrag(e) {
                if (!isDragging) return;
                updateProgress(e);
            }

            function endDrag() {
                isDragging = false;
                progressBar.classList.remove('dragging');
            }

            function updateProgress(e) {
                const rect = progressBar.getBoundingClientRect();
                let percent = (e.clientX - rect.left) / rect.width;
                percent = Math.max(0, Math.min(1, percent));
                audio.currentTime = percent * audio.duration;
            }

            // 保留原有的点击功能
            progressBar.addEventListener('click', (e) => {
                if (!isDragging) { // 如果不是在拖拽中，执行点击跳转
                    const rect = progressBar.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    audio.currentTime = percent * audio.duration;
                }
            });
        }

        /* 点击页面任意位置关闭播放器（如果点击的不是播放器内部）
        document.addEventListener('click', (e) => {
            if (!player.contains(e.target) && !e.target.closest('.music-card [data-action="play"]')) {
                player.classList.remove('show');
            }
        });*/
    }
    //刷新按钮添加点击事件
    reset.addEventListener('click', function() {
        //重新加载文件列表
        loadMusicData();
        //重置筛选状态
        filterButtons[0].classList.add('active');
        filterButtons[1].classList.remove('active');
        //清空搜索栏
        searchInput.value = ''
    })
    //更改目录按钮添加点击事件
    document.getElementById('change').addEventListener('click', function() {
        Swal.fire({
            title: '请输入您的音乐文件目录',
            text: '此目录应为您的openlist的文件目录',
            input: 'text', // 指定输入类型为文本[citation:3]
            inputValue: storag,
            inputPlaceholder: '例如：本地存储/音乐', // 输入框的占位符[citation:9]
            showCancelButton: true, // 显示取消按钮[citation:9]
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            // 在确认前对输入进行验证[citation:2]
            preConfirm: (inputValue) => {
                if (!inputValue) {
                    Swal.showValidationMessage('内容不能为空哦');
                }
                return inputValue; // 返回的值会传递给 `.then()` 中的 `result.value`
            }
        }).then((result) => {
            // 用户点击“确定”后执行
            if (result.isConfirmed) {
                const userInput = result.value;
                localStorage.setItem('music_dir', userInput);
                Swal.fire({
                    title: '保存成功',
                    text: '将为您重新加载文件目录',
                    icon: 'success',
                    timer: 2000,
                } );
                storag = localStorage.getItem('music_dir')|| ''
                reset.click()
            }
        });
    });
    // 加载音乐文件
    async function loadMusicData() {
        if(storag){
            try {
                const response = await fetch(`http://${host}/api/fs/list`, {
                    method: "POST",
                    headers: {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                        "authorization": localStorage.getItem('token'),
                        "content-type": "application/json;charset=UTF-8"
                    },
                    body: JSON.stringify({
                        path: storag,
                        password: "",
                        page: 1,
                        per_page: 0,
                        refresh: false
                    }),
                    mode: "cors",
                    credentials: "include"
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const result = await response.json();

                if (result.code === 200 && result.data && result.data.content) {
                    // 定义常见音频文件扩展名
                    const audioExtensions = [
                        '.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac',
                        '.wma', '.opus', '.aiff', '.alac', '.mp2', '.mp1',
                        '.ape', '.wv', '.tta', '.mka', '.dsf', '.dsd'
                    ];

                    // 将扩展名转换为小写以便不区分大小写匹配
                    const extensionsLower = audioExtensions.map(ext => ext.toLowerCase());

                    // 筛选音频文件
                    allMusicData = result.data.content.filter(item => {
                        if (item.is_dir) return false; // 排除文件夹

                        const fileName = item.name || '';
                        const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

                        // 检查文件扩展名是否在音频扩展名列表中
                        return extensionsLower.includes(fileExt);
                    });
                    filteredData = [...allMusicData];
                    init();
                    showNotification(`成功加载 ${allMusicData.length} 首音乐`);
                    document.getElementById('change').innerHTML=`<i class="fa-regular fa-folder-open"></i>${storag? '更改目录':'添加目录'}`
                    console.log('storag',storag)
                } else {
                    throw new Error(result.message || '获取数据失败');
                }
            } catch (error) {

                Swal.fire({
                    title: `加载音乐数据失败!`,
                    text: error.message,
                    icon: 'warning',
                    zIndex: 100,
                    confirmButtonColor: '#d33',
                    confirmButtonText: '确定',
                })


            }}
    }
    // 初始化
    function init() {
        updateStats();
        renderMusicCards();
        setupEventListeners();
        // 检查是否有实际数据，如果没有则显示空状态
        if (allMusicData.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }
    //使用加载文件数据
    loadMusicData();

})();