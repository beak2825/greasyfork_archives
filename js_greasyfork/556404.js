// ==UserScript==
// @name         Bilibili 本地弹幕加载器（看视频额外加载弹幕、看切成肉酱的reaction视频根据分p校准弹幕、看直播录屏加载直播弹幕可选显示id）
// @name:en      Bilibili Local Danmaku Loader
// @namespace    https://github.com/YourName/bilibili-local-danmaku
// @version      1.11.0
// @description  支持手动加载 XML 弹幕文件，支持自动根据分P时长校准弹幕，支持录播姬 XML 文件的发送者ID/SuperChat/礼物/舰长显示，提供手动精调、卡顿补偿、**新增弹幕搜索定点对齐**功能。
// @description:en Supports loading local XML danmaku files, automatic alignment based on video duration, display of sender ID/SuperChat/Gift/Guard for "BililiveRecorder" XML files, with manual fine-tuning, lag compensation, and search-based alignment.
// @author       Gemini（反正不是我）
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556404/Bilibili%20%E6%9C%AC%E5%9C%B0%E5%BC%B9%E5%B9%95%E5%8A%A0%E8%BD%BD%E5%99%A8%EF%BC%88%E7%9C%8B%E8%A7%86%E9%A2%91%E9%A2%9D%E5%A4%96%E5%8A%A0%E8%BD%BD%E5%BC%B9%E5%B9%95%E3%80%81%E7%9C%8B%E5%88%87%E6%88%90%E8%82%89%E9%85%B1%E7%9A%84reaction%E8%A7%86%E9%A2%91%E6%A0%B9%E6%8D%AE%E5%88%86p%E6%A0%A1%E5%87%86%E5%BC%B9%E5%B9%95%E3%80%81%E7%9C%8B%E7%9B%B4%E6%92%AD%E5%BD%95%E5%B1%8F%E5%8A%A0%E8%BD%BD%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%8F%AF%E9%80%89%E6%98%BE%E7%A4%BAid%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556404/Bilibili%20%E6%9C%AC%E5%9C%B0%E5%BC%B9%E5%B9%95%E5%8A%A0%E8%BD%BD%E5%99%A8%EF%BC%88%E7%9C%8B%E8%A7%86%E9%A2%91%E9%A2%9D%E5%A4%96%E5%8A%A0%E8%BD%BD%E5%BC%B9%E5%B9%95%E3%80%81%E7%9C%8B%E5%88%87%E6%88%90%E8%82%89%E9%85%B1%E7%9A%84reaction%E8%A7%86%E9%A2%91%E6%A0%B9%E6%8D%AE%E5%88%86p%E6%A0%A1%E5%87%86%E5%BC%B9%E5%B9%95%E3%80%81%E7%9C%8B%E7%9B%B4%E6%92%AD%E5%BD%95%E5%B1%8F%E5%8A%A0%E8%BD%BD%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%8F%AF%E9%80%89%E6%98%BE%E7%A4%BAid%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Bilibili Local Danmaku Loader v1.11.0 is running!");

    // --- 变量声明 ---
    let danmakuList = [];
    let videoElement = null;
    let videoWrap = null;
    let danmakuOverlay = null;
    let densityCanvas = null;
    let progressContainer = null;
    let danmakuTooltip = null;
    let lastHoverTime = -1;

    let nextDanmakuIndex = 0;

    let danmakuCache = new Map();
    const MERGE_DURATION = 30.0;

    const MAX_SCALE = 2.5;
    const MAX_PREVIEW_LINES = 10;
    const PREVIEW_WINDOW_SECONDS = 1.0;

    let pBaseOffset = 0.0;
    let fineTuneOffset = 0.0;
    let globalTimeOffset = 0.0;

    const MIN_FT_OFFSET = -60.0;
    const MAX_FT_OFFSET = 60.0;

    let pOffsetsMap = new Map();
    let pDurationsMap = new Map();
    let pStickyManualDurationsMap = new Map();

    let currentPIndex = -1;
    let lastVideoSrc = "";
    let autoSyncEnabled = true;

    let isLagPaused = false;
    let lagStartTime = 0;

    // [v1.10.0] 新增配置项
    let cfgShowSender = false; // 显示发送者ID
    let cfgShowSC = true;      // 显示 SuperChat
    let cfgShowGift = false;   // 显示礼物
    let cfgShowGuard = false;  // 显示舰长

    // UI 引用
    let offsetSlider = null;
    let offsetInput = null;
    let globalOffsetDisplay = null;
    let syncVideoTimeInput = null;
    let syncDanmakuTimeInput = null;
    let autoSyncCheckbox = null;
    let pSyncCorrectLabel = null;
    let pSyncCorrectInput = null;
    let pSyncCorrectSaveBtn = null;
    let lagCompensatorBtn = null;

    // [v1.11.0] CRC32 算法
    const CRC32_TABLE = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        CRC32_TABLE[i] = c;
    }
    function crc32(str) {
        let crc = -1;
        for (let i = 0; i < str.length; i++) {
            crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ str.charCodeAt(i)) & 0xFF];
        }
        return (crc ^ -1) >>> 0;
    }

    // CSS 样式
    GM_addStyle(`
        /* 主容器 */
        #local-dm-container {
            position: fixed;
            top: 100px;
            left: -275px; /* [修改] 面板250 + 隐藏按钮25 = 275 */
            width: 290px; /* [修改] 面板250 + 标签40 */
            z-index: 99999;
            transition: left 0.3s ease;
        }
        #local-dm-container.open {
            left: 0;
        }

        /* 主面板 */
        #local-dm-main-panel {
            width: 250px; /* [修改] 变宽 */
            display: flex;
            flex-direction: column;
            background: rgba(0,0,0,0.85);
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            gap: 10px;
            position: absolute;
            left: 0;
            top: 0;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            z-index: 5;
            max-height: 80vh;
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-width: thin;
            scrollbar-color: #888 #333;
        }

        #local-dm-main-panel::-webkit-scrollbar { width: 6px; }
        #local-dm-main-panel::-webkit-scrollbar-track { background: #333; border-radius: 3px; }
        #local-dm-main-panel::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }
        #local-dm-main-panel::-webkit-scrollbar-thumb:hover { background: #aaa; }

        /* 折叠标签 */
        #local-dm-toggle-tab {
            position: absolute;
            left: 250px; /* [修改] 紧贴面板右侧 */
            top: 0;
            width: 40px;
            height: 50px;
            background: #00a1d6;
            border-radius: 0 8px 8px 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 5px;
            box-sizing: border-box;
            color: white;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
            z-index: 10;
        }
        #local-dm-container.open #local-dm-toggle-tab {
            background: #e74c3c;
            justify-content: center;
            padding-right: 0;
        }

        /* UI 组件 */
        #local-dm-load-btn {
            background: #00a1d6;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 8px 12px;
            font-size: 14px;
            cursor: pointer;
            flex-shrink: 0;
        }
        #local-dm-load-btn:hover { background: #00b5e5; }
        #local-dm-file-input { display: none; }
        .dm-panel-divider {
            border-top: 1px solid #444;
            padding-top: 10px;
            margin-top: 5px;
            flex-shrink: 0;
        }
        #local-dm-offset-controls, #local-dm-anchor-sync-controls, #local-dm-auto-sync-controls, #local-dm-lag-compensator, #local-dm-live-controls, #local-dm-search-panel {
            display: flex;
            flex-direction: column;
            gap: 8px;
            color: white;
            font-size: 13px;
        }
        #local-dm-offset-controls span, #local-dm-anchor-sync-controls span, #local-dm-auto-sync-controls span, #local-dm-live-controls span, #local-dm-search-panel span {
            font-weight: bold;
            text-align: center;
            color: #eee;
        }

        .offset-display-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px solid #555;
            margin-bottom: 8px;
        }
        .offset-display-row span:first-child { font-weight: bold; color: #ccc; }
        #local-dm-global-offset-display { font-weight: bold; font-size: 14px; color: #4CAF50; }

        #local-dm-offset-slider { width: 100%; margin: 0; }
        .offset-input-row {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 8px;
            align-items: center;
        }
        #local-dm-offset-input {
            width: 70px;
            background: #333;
            color: white;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 14px;
            text-align: center;
        }
        .offset-button-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5px;
        }
        .offset-button-grid button, #local-dm-offset-reset {
            background: #555;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 0;
            font-size: 12px;
            cursor: pointer;
        }
        .offset-button-grid button:hover, #local-dm-offset-reset:hover { background: #777; }
        #local-dm-offset-reset { background: #833; }
        #local-dm-offset-reset:hover { background: #a55; }
        .sync-input-group {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 5px;
            align-items: center;
        }
        .sync-input-group label { font-size: 12px; color: #ccc; }
        .sync-input-row {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 5px;
        }
        .sync-input-row input {
            background: #333;
            color: white;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 13px;
        }
        .sync-input-row button {
            background: #555;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 0 8px;
            font-size: 12px;
            cursor: pointer;
        }
        .sync-input-row button:hover { background: #777; }
        #local-dm-sync-apply {
            background: #007a4a;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 8px 12px;
            font-size: 14px;
            cursor: pointer;
        }
        #local-dm-sync-apply:hover { background: #009a5c; }

        #local-dm-auto-sync-controls label, #local-dm-live-controls label {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
        }
        #local-dm-auto-sync-p-correct label { font-size: 12px; color: #ccc; }
        #local-dm-auto-sync-p-correct {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        #local-dm-p-correct-save { background: #4a007a; color: white; }
        #local-dm-p-correct-save:hover { background: #6a009a; }

        #local-dm-lag-btn {
            background: #864d0c;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 8px 12px;
            font-size: 14px;
            cursor: pointer;
        }
        #local-dm-lag-btn:hover { background: #a6631c; }
        #local-dm-lag-btn.lagging {
            background: #c00;
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }

        /* --- [新增] 搜索功能样式 --- */
        #local-dm-search-panel {
            display: flex;
            flex-direction: column;
            gap: 5px;
            max-height: 200px; /* 限制搜索区域高度 */
        }
        .search-input-row {
            display: flex;
            gap: 5px;
        }
        #local-dm-search-input {
            flex: 1;
            background: #333;
            color: white;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 13px;
        }
        #local-dm-search-btn {
            background: #007a4a; /* 绿色按钮 */
            color: white;
            border: none;
            border-radius: 4px;
            padding: 0 10px;
            cursor: pointer;
        }
        #local-dm-search-btn:hover { background: #009a5c; }

        #local-dm-search-results {
            flex: 1;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid #444;
            border-radius: 4px;
            padding: 2px;
            display: none; /* 默认隐藏，有结果时显示 */
            max-height: 120px;
        }
        .dm-search-item {
            padding: 4px;
            font-size: 12px;
            color: #ddd;
            cursor: pointer;
            border-bottom: 1px solid #444;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .dm-search-item:hover {
            background-color: #00a1d6;
            color: white;
        }
        .dm-search-time {
            color: #aaa;
            margin-right: 8px;
            font-family: monospace;
        }
        .dm-search-item:hover .dm-search-time { color: #eee; }

        #local-dm-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 90%;
            overflow: hidden;
            pointer-events: none;
            color: white;
            font-size: 20px;
            font-family: SimHei, "Microsoft YaHei", Arial, sans-serif;
            font-weight: bold;
            text-shadow: 1px 1px 3px black;
        }
        .local-dm-span {
            position: absolute;
            white-space: nowrap;
            will-change: transform, opacity;
            --local-dm-scale: 1.0;
            transform-origin: left center;
            z-index: 1;
            animation: local-dm-scroll 8s linear;
        }
        /* 直播特殊弹幕样式 */
        .local-dm-span.dm-type-sc {
            color: #FFE066;
            text-shadow: 1px 1px 0px #B06600, -1px -1px 0px #B06600;
            border: 1px solid #FFE066;
            background: rgba(255, 165, 0, 0.3);
            border-radius: 4px;
            padding: 0 4px;
        }
        .local-dm-span.dm-type-gift {
            color: #FFB6C1;
            font-size: 0.9em;
        }
        .local-dm-span.dm-type-guard {
            color: #87CEFA;
            font-size: 0.9em;
            border: 1px solid #87CEFA;
            border-radius: 4px;
            padding: 0 2px;
        }

        @keyframes local-dm-scroll {
            from { transform: translateX(100vw) scale(var(--local-dm-scale)); opacity: 1; }
            to { transform: translateX(-100%) scale(var(--local-dm-scale)); opacity: 1; }
        }
        #local-dm-density-canvas {
            position: absolute;
            left: 0;
            width: 100%;
            height: 30px;
            bottom: 100%;
            pointer-events: none;
            z-index: 10;
        }
        #local-dm-tooltip {
            position: absolute;
            display: none;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 5px;
            padding: 8px 12px;
            font-size: 13px;
            line-height: 1.6;
            max-width: 300px;
            z-index: 9999;
            pointer-events: none;
            bottom: 40px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        #local-dm-tooltip div {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    `);

    // 2. waitForPlayer
    function waitForPlayer() {
        console.log("Local Danmaku: Waiting for player components...");
        videoElement = document.querySelector('video');
        videoWrap = document.querySelector('.bpx-player-video-wrap');
        progressContainer = document.querySelector('.bpx-player-progress-wrap');
        if (videoElement && videoWrap && progressContainer) {
            console.log("Local Danmaku: Player ready. Setting up UI.");
            setupApp();
        } else {
            setTimeout(waitForPlayer, 1000);
        }
    }

    // 3. setupApp
    function setupApp() {
        if (!document.getElementById('local-dm-overlay')) {
            danmakuOverlay = document.createElement('div');
            danmakuOverlay.id = 'local-dm-overlay';
            videoWrap.appendChild(danmakuOverlay);
        }

        let mainContainer = document.getElementById('local-dm-container');
        if (!mainContainer) {
            mainContainer = document.createElement('div');
            mainContainer.id = 'local-dm-container';
            document.body.appendChild(mainContainer);

            const mainPanel = document.createElement('div');
            mainPanel.id = 'local-dm-main-panel';
            mainContainer.appendChild(mainPanel);

            const toggleTab = document.createElement('div');
            toggleTab.id = 'local-dm-toggle-tab';
            toggleTab.textContent = '弹';
            toggleTab.addEventListener('click', () => {
                mainContainer.classList.toggle('open');
            });
            mainContainer.appendChild(toggleTab);

            // --- UI 元素创建区 ---

            // 1. 加载按钮
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.xml';
            fileInput.id = 'local-dm-file-input';
            fileInput.onchange = (e) => loadFile(e.target.files[0]);
            const loadBtn = document.createElement('button');
            loadBtn.id = 'local-dm-load-btn';
            loadBtn.innerHTML = '加载本地弹幕';
            loadBtn.onclick = () => fileInput.click();

            // [新增] 1.5 弹幕搜索与对齐
            const searchControls = document.createElement('div');
            searchControls.id = 'local-dm-search-panel';
            searchControls.className = 'dm-panel-divider';
            searchControls.innerHTML = `
                <span>搜索弹幕并对齐 (定点校准)</span>
                <div class="search-input-row">
                    <input type="text" id="local-dm-search-input" placeholder="输入弹幕内容...">
                    <button id="local-dm-search-btn">搜索</button>
                </div>
                <div id="local-dm-search-results"></div>
            `;

            // 2. 精调偏移
            const offsetControls = document.createElement('div');
            offsetControls.id = 'local-dm-offset-controls';
            offsetControls.className = 'dm-panel-divider';
            offsetControls.innerHTML = `
                <span>精调偏移 (P-1)</span>
                <div class="offset-display-row">
                    <span>总偏移:</span>
                    <span id="local-dm-global-offset-display">0.0s</span>
                </div>
                <input type="range" id="local-dm-offset-slider" min="${MIN_FT_OFFSET}" max="${MAX_FT_OFFSET}" step="0.1" value="0.0">
                <div class="offset-input-row">
                    <input type="number" id="local-dm-offset-input" step="0.1" value="0.0">
                    <button id="local-dm-offset-reset">重置</button>
                </div>
                <div class="offset-button-grid">
                    <button id="offset-minus-5">-5s</button>
                    <button id="offset-plus-5">+5s</button>
                    <button id="offset-minus-05">-0.5s</button>
                    <button id="offset-plus-05">+0.5s</button>
                </div>
            `;

            // 3. 手动锚点对齐
            const syncControls = document.createElement('div');
            syncControls.id = 'local-dm-anchor-sync-controls';
            syncControls.className = 'dm-panel-divider';
            syncControls.innerHTML = `
                <span>手动锚点对齐 (P-1)</span>
                <div class="sync-input-group">
                    <label>视频时间:</label>
                    <div class="sync-input-row">
                        <input type="text" id="local-dm-sync-video" placeholder="0:00">
                        <button id="local-dm-sync-get">获取</button>
                    </div>
                </div>
                <div class="sync-input-group">
                    <label>弹幕时间:</label>
                    <div class="sync-input-row">
                        <input type="text" id="local-dm-sync-danmaku" placeholder="例如 10:00">
                    </div>
                </div>
                <button id="local-dm-sync-apply">计算并应用偏移</button>
            `;

            // 4. 卡顿补偿
            const lagControls = document.createElement('div');
            lagControls.id = 'local-dm-lag-compensator';
            lagControls.className = 'dm-panel-divider';
            lagControls.innerHTML = `<button id="local-dm-lag-btn">卡顿补偿 [暂停]</button>`;

            // 5. 自动分P & 手动修正
            const autoSyncControls = document.createElement('div');
            autoSyncControls.id = 'local-dm-auto-sync-controls';
            autoSyncControls.className = 'dm-panel-divider';
            autoSyncControls.innerHTML = `
                <span>自动分P对齐</span>
                <label>
                    <input type="checkbox" id="local-dm-auto-sync-check" checked>
                    启用自动P-List对齐
                </label>
                <div id="local-dm-auto-sync-p-correct">
                    <label id="local-dm-p-correct-label">修正 P-1 时长 (用于P-2):</label>
                    <div class="sync-input-row">
                        <input type="text" id="local-dm-p-correct-input" placeholder="例如 10:05">
                        <button id="local-dm-p-correct-save">保存</button>
                    </div>
                </div>
            `;

            // 6. 直播录播设置
            const liveControls = document.createElement('div');
            liveControls.id = 'local-dm-live-controls';
            liveControls.className = 'dm-panel-divider';
            liveControls.innerHTML = `
                <span>直播录播设置</span>
                <label><input type="checkbox" id="local-dm-show-sc" checked> 显示 SC</label>
                <label><input type="checkbox" id="local-dm-show-sender"> 显示 ID/用户名</label>
                <label><input type="checkbox" id="local-dm-show-gift"> 显示礼物</label>
                <label><input type="checkbox" id="local-dm-show-guard"> 显示舰长</label>
            `;

            // --- 组装 UI ---
            mainPanel.appendChild(loadBtn);
            mainPanel.appendChild(fileInput);
            mainPanel.appendChild(searchControls); // [新增]
            mainPanel.appendChild(offsetControls);
            mainPanel.appendChild(syncControls);
            mainPanel.appendChild(lagControls);
            mainPanel.appendChild(autoSyncControls);
            mainPanel.appendChild(liveControls);


            // --- 绑定事件 ---

            // [新增] 搜索功能事件绑定
            const searchInput = document.getElementById('local-dm-search-input');
            const searchBtn = document.getElementById('local-dm-search-btn');
            const searchResults = document.getElementById('local-dm-search-results');

            // 执行搜索函数
            function performDanmakuSearch() {
                const query = searchInput.value.trim();
                searchResults.innerHTML = ''; // 清空旧结果

                if (!query) {
                    searchResults.style.display = 'none';
                    return;
                }

                if (danmakuList.length === 0) {
                    searchResults.style.display = 'block';
                    searchResults.innerHTML = '<div class="dm-search-item" style="cursor:default">暂无弹幕数据</div>';
                    return;
                }

                // 搜索逻辑：匹配 text 内容
                const matches = danmakuList.filter(d => d.text && d.text.includes(query));

                if (matches.length === 0) {
                    searchResults.style.display = 'block';
                    searchResults.innerHTML = '<div class="dm-search-item" style="cursor:default">未找到匹配弹幕</div>';
                    return;
                }

                searchResults.style.display = 'block';

                // 限制显示数量，防止卡顿，最多显示前 50 条
                matches.slice(0, 50).forEach(dm => {
                    const div = document.createElement('div');
                    div.className = 'dm-search-item';
                    // 显示格式：[弹幕原始时间] 弹幕内容
                    div.innerHTML = `<span class="dm-search-time">[${formatTime(dm.time)}]</span>${dm.text}`;
                    div.title = "点击将此弹幕对齐到当前视频画面"; // 鼠标悬停提示

                    // 点击事件：核心对齐逻辑
                    div.addEventListener('click', () => {
                        if (!videoElement) return;

                        // 核心算法： Offset = 当前视频时间 - 弹幕原始时间
                        const currentVideoTime = videoElement.currentTime;
                        const targetDmTime = dm.time;
                        const newOffset = currentVideoTime - targetDmTime;

                        console.log(`[Search Sync] Aligning danmaku "${dm.text}" (Ts: ${targetDmTime}) to Video (Ts: ${currentVideoTime}). New Offset: ${newOffset}`);

                        // 保存并应用偏移
                        if (currentPIndex > 0) {
                            pOffsetsMap.set(currentPIndex, newOffset);
                        }
                        updatePBaseOffset(newOffset, 'manual');

                        // 视觉反馈：闪烁一下结果框或者清空
                        div.style.backgroundColor = '#28a745';
                        setTimeout(() => { searchResults.style.display = 'none'; }, 300);
                    });

                    searchResults.appendChild(div);
                });
            }

            searchBtn.addEventListener('click', performDanmakuSearch);
            // 允许回车搜索
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performDanmakuSearch();
            });

            // 直播设置事件
            document.getElementById('local-dm-show-sc').addEventListener('change', (e) => { cfgShowSC = e.target.checked; triggerFullDanmakuReset(videoElement.currentTime); });
            document.getElementById('local-dm-show-sender').addEventListener('change', (e) => { cfgShowSender = e.target.checked; triggerFullDanmakuReset(videoElement.currentTime); });
            document.getElementById('local-dm-show-gift').addEventListener('change', (e) => { cfgShowGift = e.target.checked; triggerFullDanmakuReset(videoElement.currentTime); });
            document.getElementById('local-dm-show-guard').addEventListener('change', (e) => { cfgShowGuard = e.target.checked; triggerFullDanmakuReset(videoElement.currentTime); });

            // 自动分P事件
            autoSyncCheckbox = document.getElementById('local-dm-auto-sync-check');
            pSyncCorrectLabel = document.getElementById('local-dm-p-correct-label');
            pSyncCorrectInput = document.getElementById('local-dm-p-correct-input');
            pSyncCorrectSaveBtn = document.getElementById('local-dm-p-correct-save');
            autoSyncCheckbox.addEventListener('change', (e) => {
                autoSyncEnabled = e.target.checked;
            });
            pSyncCorrectSaveBtn.addEventListener('click', saveManualDuration);

            // 锚点对齐事件
            syncVideoTimeInput = document.getElementById('local-dm-sync-video');
            syncDanmakuTimeInput = document.getElementById('local-dm-sync-danmaku');
            document.getElementById('local-dm-sync-get').addEventListener('click', () => {
                if (videoElement) {
                    syncVideoTimeInput.value = formatTime(videoElement.currentTime);
                }
            });
            document.getElementById('local-dm-sync-apply').addEventListener('click', applyDanmakuSync);

            // 偏移控制事件
            offsetSlider = document.getElementById('local-dm-offset-slider');
            offsetInput = document.getElementById('local-dm-offset-input');
            globalOffsetDisplay = document.getElementById('local-dm-global-offset-display');
            offsetSlider.addEventListener('input', (e) => {
                updateFineTuneOffset(parseFloat(e.target.value), 'slider');
            });
            offsetInput.addEventListener('change', (e) => {
                updateFineTuneOffset(parseFloat(e.target.value), 'input');
            });
            document.getElementById('local-dm-offset-reset').addEventListener('click', () => updateFineTuneOffset(0.0));
            document.getElementById('offset-minus-5').addEventListener('click', () => updateFineTuneOffset(fineTuneOffset - 5.0));
            document.getElementById('offset-plus-5').addEventListener('click', () => updateFineTuneOffset(fineTuneOffset + 5.0));
            document.getElementById('offset-minus-05').addEventListener('click', () => updateFineTuneOffset(fineTuneOffset - 0.5));
            document.getElementById('offset-plus-05').addEventListener('click', () => updateFineTuneOffset(fineTuneOffset + 0.5));

            // 卡顿补偿事件
            lagCompensatorBtn = document.getElementById('local-dm-lag-btn');
            lagCompensatorBtn.addEventListener('click', toggleLagCompensation);
        }

        // G. 密度图 Canvas
        if (!document.getElementById('local-dm-density-canvas') && progressContainer) {
            densityCanvas = document.createElement('canvas');
            densityCanvas.id = 'local-dm-density-canvas';
            const rect = progressContainer.getBoundingClientRect();
            densityCanvas.width = rect.width;
            densityCanvas.height = 30;
            progressContainer.appendChild(densityCanvas);
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const rect = entry.contentRect;
                    densityCanvas.width = rect.width;
                    densityCanvas.height = 30;
                    redrawDensityGraph();
                }
            });
            resizeObserver.observe(progressContainer);
        }
        // H. 弹幕预览提示框
        if (!document.getElementById('local-dm-tooltip') && videoWrap) {
            danmakuTooltip = document.createElement('div');
            danmakuTooltip.id = 'local-dm-tooltip';
            videoWrap.appendChild(danmakuTooltip);
        }
        // I. 进度条鼠标事件
        if (progressContainer) {
            progressContainer.addEventListener('mousemove', handleProgressHover);
            progressContainer.addEventListener('mouseleave', hideProgressHover);
        }

        addVideoListeners();
    }

    // 4. 偏移逻辑

    function updatePBaseOffset(newBaseOffset, source = 'auto') {
        pBaseOffset = newBaseOffset;
        updateFineTuneOffset(0.0, 'auto_reset');

        if (currentPIndex > 0) {
            if (source !== 'auto') {
                pOffsetsMap.set(currentPIndex, newBaseOffset);
                console.log(`P-Sync: Saved *manual* offset ${newBaseOffset} for P-${currentPIndex}`);
            }
        }

        // [v1.10.3] 修复：确保在更新 P 基础偏移时重绘密度图
        redrawDensityGraph();
        triggerFullDanmakuReset(videoElement.currentTime);
    }

    function updateFineTuneOffset(newFineTune, source = '') {
        if (!videoElement) return;

        if (source === 'slider') {
            newFineTune = Math.max(MIN_FT_OFFSET, Math.min(MAX_FT_OFFSET, newFineTune));
        }
        newFineTune = Math.round(newFineTune * 10) / 10;
        if (isNaN(newFineTune)) { newFineTune = 0.0; }

        fineTuneOffset = newFineTune;
        globalTimeOffset = pBaseOffset + fineTuneOffset;

        updateGlobalOffsetDisplay();

        if (source !== 'slider' && offsetSlider) {
            offsetSlider.value = Math.max(MIN_FT_OFFSET, Math.min(MAX_FT_OFFSET, newFineTune));
        }
        if (source !== 'input' && offsetInput) {
            offsetInput.value = newFineTune.toFixed(1);
        }

        if (source !== 'auto_reset') {
             console.log(`Local Danmaku: FineTune updated to ${fineTuneOffset}s. Global offset is ${globalTimeOffset.toFixed(1)}s`);
            redrawDensityGraph();
            triggerFullDanmakuReset(videoElement.currentTime);
        }
    }

    function updateGlobalOffsetDisplay() {
        if (globalOffsetDisplay) {
            globalOffsetDisplay.textContent = globalTimeOffset.toFixed(1) + 's';
            if (globalTimeOffset > 0.05) {
                globalOffsetDisplay.style.color = '#E6A23C';
            } else if (globalTimeOffset < -0.05) {
                globalOffsetDisplay.style.color = '#F56C6C';
            } else {
                globalOffsetDisplay.style.color = '#4CAF50';
            }
        }
    }


    // 5. triggerFullDanmakuReset
    function triggerFullDanmakuReset(currentTime) {
        if (!danmakuList.length) return;
        if(danmakuOverlay) { danmakuOverlay.innerHTML = ''; }
        danmakuCache.clear();
        const targetTime = currentTime - globalTimeOffset;
        const firstIndex = binarySearchDanmakuIndex(targetTime);
        nextDanmakuIndex = (firstIndex === -1) ? danmakuList.length : firstIndex;
        for (let i = 0; i < danmakuList.length; i++) {
            danmakuList[i].shown = (i < nextDanmakuIndex);
        }
        console.log(`Local Danmaku: Reset. New index ${nextDanmakuIndex} (targetTime ${targetTime.toFixed(2)})`);
    }

    // 6. loadFile
    function loadFile(file) {
        if (!file) return;

        pOffsetsMap.clear();
        pDurationsMap.clear();
        pStickyManualDurationsMap.clear();
        currentPIndex = -1;
        lastVideoSrc = "";
        resetLagCompensator();

        updatePBaseOffset(0.0);

        const reader = new FileReader();
        reader.onload = (e) => {
            parseXMLDanmaku(e.target.result);
        };
        reader.readAsText(file, 'UTF-8');
    }

    // 7. parseXMLDanmaku
    function parseXMLDanmaku(xmlStr) {
        danmakuList = [];
        nextDanmakuIndex = 0;
        danmakuCache.clear();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlStr, 'text/xml');

        // --- 1. 建立 Hash -> 真名 对照表 ---
        const hashToUserMap = new Map();
        const safeJSONParse = (str) => { try { return JSON.parse(str); } catch (e) { return null; } };
        const registerUser = (uid, name) => {
            if (!uid || !name || uid === 0) return;
            const crc = crc32(uid.toString()).toString(16);
            hashToUserMap.set(crc, name);
        };

        // 扫描 Gifts
        for (let item of xmlDoc.getElementsByTagName('gift')) {
            const rawData = safeJSONParse(item.getAttribute('raw'));
            if (rawData?.sender_uinfo?.uid && rawData?.sender_uinfo?.name) {
                registerUser(rawData.sender_uinfo.uid, rawData.sender_uinfo.name);
            }
        }
        // 扫描 SC
        for (let item of xmlDoc.getElementsByTagName('sc')) {
            const rawData = safeJSONParse(item.getAttribute('raw'));
            if (rawData?.user_info?.uid && rawData?.user_info?.uname) {
                registerUser(rawData.user_info.uid, rawData.user_info.uname);
            }
        }
        // 扫描 Guard
        for (let item of xmlDoc.getElementsByTagName('guard')) {
            const rawData = safeJSONParse(item.getAttribute('raw'));
            if (rawData?.uid && rawData?.username) {
                registerUser(rawData.uid, rawData.username);
            }
        }

        // --- 2. 解析普通弹幕 ---
        for (let item of xmlDoc.getElementsByTagName('d')) {
            try {
                const p = item.getAttribute('p').split(',');
                const time = parseFloat(p[0]);
                const text = item.textContent;
                let user = item.getAttribute('user') || "";

                const rawStr = item.getAttribute('raw');
                let hash = "";
                if (rawStr) {
                      const rawData = safeJSONParse(rawStr);
                      if (Array.isArray(rawData) && Array.isArray(rawData[0])) {
                          const info = rawData[0];
                          if (info.length > 7 && typeof info[7] === 'string') {
                              hash = info[7];
                          }
                      }
                }

                if (hash && hashToUserMap.has(hash)) {
                    user = hashToUserMap.get(hash);
                } else if (hash) {
                    user += ` (ID:${hash})`;
                }

                if (!isNaN(time) && text) {
                    danmakuList.push({ time, text, type: 'danmaku', user, shown: false });
                }
            } catch (e) {}
        }

        // --- 3. 添加特殊弹幕 ---
        // SC
        for (let item of xmlDoc.getElementsByTagName('sc')) {
            try {
                const time = parseFloat(item.getAttribute('ts'));
                const rawData = safeJSONParse(item.getAttribute('raw'));
                const user = rawData?.user_info?.uname || item.getAttribute('user') || "未知";
                const price = item.getAttribute('price') || "0";
                const text = item.textContent;
                if (!isNaN(time)) danmakuList.push({ time, text, type: 'sc', user, price, shown: false });
            } catch(e){}
        }
        // Gift
        for (let item of xmlDoc.getElementsByTagName('gift')) {
            try {
                const time = parseFloat(item.getAttribute('ts'));
                const rawData = safeJSONParse(item.getAttribute('raw'));
                const user = rawData?.sender_uinfo?.name || item.getAttribute('user') || "未知";
                const giftName = item.getAttribute('giftname') || "礼物";
                const count = item.getAttribute('giftcount') || "1";
                if (!isNaN(time)) danmakuList.push({ time, text: `投喂了 ${giftName} x ${count}`, type: 'gift', user, count, shown: false });
            } catch(e){}
        }
        // Guard
        for (let item of xmlDoc.getElementsByTagName('guard')) {
            try {
                const time = parseFloat(item.getAttribute('ts'));
                const rawData = safeJSONParse(item.getAttribute('raw'));
                const user = rawData?.username || item.getAttribute('user') || "未知";
                const level = item.getAttribute('level');
                const levelName = level==="1"?"总督":(level==="2"?"提督":"舰长");
                if (!isNaN(time)) danmakuList.push({ time, text: `成为了 ${levelName}`, type: 'guard', user, shown: false });
            } catch(e){}
        }

        danmakuList.sort((a, b) => a.time - b.time);

        const btn = document.getElementById('local-dm-load-btn');
        if(btn) {
            btn.textContent = `加载成功 (${danmakuList.length}条)`;
            setTimeout(() => { btn.textContent = '加载本地弹幕'; }, 2000);
        }
        console.log(`Local Danmaku: Loaded ${danmakuList.length} items.`);

        redrawDensityGraph();
        if(videoElement && videoElement.src) { onVideoLoaded(); }
    }

    // 8. addVideoListeners
    function addVideoListeners() {
        if (!videoElement) return;

        videoElement.addEventListener('loadedmetadata', onVideoLoaded);

        videoElement.addEventListener('timeupdate', () => {
            if (isLagPaused) return;
            if (!danmakuOverlay || videoElement.paused || danmakuList.length === 0 || nextDanmakuIndex >= danmakuList.length) {
                return;
            }
            const currentTime = videoElement.currentTime;
            while(nextDanmakuIndex < danmakuList.length) {
                const dm = danmakuList[nextDanmakuIndex];
                const virtualDmTime = dm.time + globalTimeOffset;
                if (virtualDmTime >= currentTime && virtualDmTime < currentTime + 2.0) {
                    if (!dm.shown) {
                        dm.shown = true;
                        processDanmaku(dm, virtualDmTime);
                    }
                } else if (virtualDmTime < currentTime) {
                    dm.shown = true;
                } else {
                    break;
                }
                nextDanmakuIndex++;
            }
        });
        videoElement.addEventListener('seeked', () => {
            triggerFullDanmakuReset(videoElement.currentTime);
        });

        videoElement.addEventListener('play', () => {
            if (!document.getElementById('local-dm-overlay')) {
                 videoWrap = document.querySelector('.bpx-player-video-wrap');
                 if(videoWrap) {
                    danmakuOverlay = document.createElement('div');
                    danmakuOverlay.id = 'local-dm-overlay';
                    videoWrap.appendChild(danmakuOverlay);
                 }
            }
            if (videoElement.currentTime < 1.0) {
                triggerFullDanmakuReset(videoElement.currentTime);
            }
        });
    }

    // 9. onVideoLoaded
    function onVideoLoaded() {
        if (!videoElement) return;

        const newVideoSrc = videoElement.src;
        const newVideoDuration = videoElement.duration;

        if (isNaN(newVideoDuration) || newVideoDuration <= 0 || !newVideoSrc) {
            console.log("P-Sync: Video duration not ready, retrying...");
            setTimeout(onVideoLoaded, 100);
            return;
        }

        if (newVideoSrc === lastVideoSrc) {
            pDurationsMap.set(currentPIndex, newVideoDuration);
            if (danmakuList.length > 0) {
                 redrawDensityGraph();
                 triggerFullDanmakuReset(videoElement.currentTime);
            }
            return;
        }

        console.log(`P-Sync: P-Change Detected!`);
        lastVideoSrc = newVideoSrc;

        resetLagCompensator();

        const newPIndex = getCurrentPIndex();
        if (newPIndex === -1) {
             console.log("P-Sync: Could not find P-index. Auto-sync disabled.");
             return;
        }

        currentPIndex = newPIndex;
        pDurationsMap.set(currentPIndex, newVideoDuration);
        updatePSyncUILabels();

        if (danmakuList.length === 0) {
             console.log("P-Sync: P-change detected, but no danmaku loaded.");
             return;
        }

        if (!autoSyncEnabled) {
            console.log("P-Sync: Auto-sync is disabled.");
            return;
        }

        if (pOffsetsMap.has(currentPIndex)) {
            const savedOffset = pOffsetsMap.get(currentPIndex);
            console.log(`P-Sync: Found saved offset for P-${currentPIndex}: ${savedOffset}. Applying.`);
            updatePBaseOffset(savedOffset, 'auto');
        } else {
            console.log(`P-Sync: No saved offset for P-${currentPIndex}. Predicting...`);
            if (currentPIndex === 1) {
                 updatePBaseOffset(0.0, 'auto');
                 return;
            }
            let predictedOffset = pOffsetsMap.get(1) || 0;
            console.log(`P-Sync: Prediction base offset (P1) = ${predictedOffset}`);

            for (let i = 1; i < currentPIndex; i++) {
                let durationToUse = getDurationForP(i);
                if (durationToUse <= 0) {
                    console.error(`P-Sync: FATAL: Duration for P-${i} is 0 or missing! Prediction aborted.`);
                    return;
                }
                predictedOffset -= durationToUse;
                console.log(`P-Sync: ...minus P-${i} duration (${durationToUse}s) = ${predictedOffset}`);
            }

            console.log(`P-Sync: Predicted offset for P-${currentPIndex} is ${predictedOffset}. Applying.`);
            pOffsetsMap.set(currentPIndex, predictedOffset);
            updatePBaseOffset(predictedOffset, 'auto');
        }
    }

    // 10. processDanmaku
    function processDanmaku(dm, virtualDmTime) {
        if (!videoElement) return;

        // --- 过滤逻辑 ---
        if (dm.type === 'sc' && !cfgShowSC) return;
        if (dm.type === 'gift' && !cfgShowGift) return;
        if (dm.type === 'guard' && !cfgShowGuard) return;

        // --- 文本构建 ---
        let displayText = dm.text;

        if (cfgShowSender && dm.user) {
            displayText = `${dm.user}: ${displayText}`;
        }

        if (dm.type === 'sc') {
            displayText = `[SC ￥${dm.price}] ${displayText}`;
        } else if (dm.type === 'gift') {
            displayText = `[礼物] ${displayText}`;
        } else if (dm.type === 'guard') {
            displayText = `[舰长] ${displayText}`;
        }

        // --- 缓存合并逻辑 ---
        if (dm.type === 'danmaku') {
            const cacheEntry = danmakuCache.get(displayText);
            const now = virtualDmTime;
            if (cacheEntry && (now - cacheEntry.lastTime < MERGE_DURATION)) {
                cacheEntry.count++;
                cacheEntry.lastTime = now;
                const el = cacheEntry.element;
                el.textContent = displayText + ` (x${cacheEntry.count})`;
                let scale = 1.0 + Math.log10(cacheEntry.count);
                scale = Math.min(scale, MAX_SCALE);
                el.style.setProperty('--local-dm-scale', scale);
                el.style.zIndex = 10 + cacheEntry.count;
                el.style.textShadow = '1px 1px 3px black, 0 0 3px black';
                return;
            }
        }

        // --- 显示 ---
        const el = showDanmaku(displayText, dm.type);

        if (dm.type === 'danmaku') {
            danmakuCache.set(displayText, {
                count: 1,
                element: el,
                lastTime: virtualDmTime
            });
        }

        el.addEventListener('animationend', () => {
            if (dm.type === 'danmaku') {
                const currentEntry = danmakuCache.get(displayText);
                if (currentEntry && currentEntry.element === el) {
                    danmakuCache.delete(displayText);
                }
            }
            el.remove();
        });
    }

    // 11. showDanmaku
    function showDanmaku(text, type) {
        if (!danmakuOverlay) return null;
        const dm = document.createElement('span');
        dm.className = 'local-dm-span';

        if (type && type !== 'danmaku') {
            dm.classList.add(`dm-type-${type}`);
        }

        dm.textContent = text;

        const trackCount = Math.floor((danmakuOverlay.clientHeight / 24) - 1);
        const row = Math.floor(Math.random() * (trackCount > 0 ? trackCount : 1));
        dm.style.top = (row * 24) + 'px';
        dm.style.zIndex = 1;

        if (type === 'sc') dm.style.zIndex = 50;

        danmakuOverlay.appendChild(dm);
        return dm;
    }

    // 12. redrawDensityGraph
    function redrawDensityGraph() {
        if (!densityCanvas || !videoElement) {
             if (densityCanvas) {
                const ctx = densityCanvas.getContext('2d');
                ctx.clearRect(0, 0, densityCanvas.width, densityCanvas.height);
             }
            return;
        }
        const duration = videoElement.duration;
        if (isNaN(duration) || duration <= 0) {
             if (densityCanvas) {
                const ctx = densityCanvas.getContext('2d');
                ctx.clearRect(0, 0, densityCanvas.width, densityCanvas.height);
             }
             return;
        }
        const ctx = densityCanvas.getContext('2d');
        const width = densityCanvas.width;
        const height = densityCanvas.height;
        ctx.clearRect(0, 0, width, height);
        if (danmakuList.length === 0) return;

        const buckets = new Array(width).fill(0);

        for (const dm of danmakuList) {
            if (dm.type !== 'danmaku') continue;

            const virtualTime = dm.time + globalTimeOffset;

            if (virtualTime < 0 || virtualTime > duration) {
                continue;
            }

            const timeRatio = virtualTime / duration;
            const bucketIndex = Math.floor(timeRatio * width);
            if (bucketIndex >= 0 && bucketIndex < width) {
                buckets[bucketIndex]++;
            }
        }

        const maxRawDensity = Math.max(20, ...buckets);
        const maxSqrtDensity = Math.sqrt(maxRawDensity);
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, 'rgba(0, 161, 214, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 161, 214, 0.9)');
        ctx.fillStyle = gradient;
        for (let i = 0; i < width; i++) {
            const density = buckets[i];
            if (density === 0) continue;
            const sqrtDensity = Math.sqrt(density);
            const relativeHeight = sqrtDensity / maxSqrtDensity;
            const barHeight = Math.max(2, relativeHeight * height);
            ctx.fillRect(i, height - barHeight, 1, barHeight);
        }
    }

    // 13. handleProgressHover
    function handleProgressHover(event) {
        if (!danmakuList.length || !videoElement || !videoElement.duration || !progressContainer || !danmakuTooltip) {
            return;
        }
        const rect = progressContainer.getBoundingClientRect();

        // [v1.10.3] 修复：使用 clientX 计算相对位置，避免 offsetX 受到子元素干扰
        const mouseX = event.clientX - rect.left;
        const hoverRatio = Math.max(0, Math.min(1, mouseX / rect.width));
        const hoverTime = hoverRatio * videoElement.duration;

        const targetDmTime = hoverTime - globalTimeOffset;
        if (Math.abs(hoverTime - lastHoverTime) < 0.1) {
            positionAndShowTooltip(mouseX);
            return;
        }
        lastHoverTime = hoverTime;
        const startIndex = binarySearchDanmakuIndex(targetDmTime);
        if (startIndex === -1) {
            danmakuTooltip.innerHTML = '无弹幕';
            positionAndShowTooltip(mouseX);
            return;
        }
        const candidates = [];
        const counts = new Map();
        for (let i = startIndex; i < danmakuList.length; i++) {
            const dm = danmakuList[i];
            const virtualDmTime = dm.time + globalTimeOffset;
            if (virtualDmTime < hoverTime) continue;
            if (virtualDmTime > hoverTime + PREVIEW_WINDOW_SECONDS) {
                break;
            }
            candidates.push(dm);
            counts.set(dm.text, (counts.get(dm.text) || 0) + 1);
        }
        if (candidates.length === 0) {
            danmakuTooltip.innerHTML = '无弹幕';
            positionAndShowTooltip(mouseX);
            return;
        }
        const sortedDanmaku = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
        let html = '';
        for (let i = 0; i < sortedDanmaku.length && i < MAX_PREVIEW_LINES; i++) {
            const [text, count] = sortedDanmaku[i];
            const div = document.createElement('div');
            div.textContent = text + (count > 1 ? ` (x${count})` : '');
            html += div.outerHTML;
        }
        if (sortedDanmaku.length > MAX_PREVIEW_LINES) {
            html += `<div>... (及其他 ${sortedDanmaku.length - MAX_PREVIEW_LINES} 条)</div>`;
        }
        danmakuTooltip.innerHTML = html;
        positionAndShowTooltip(mouseX);
    }

    // 14. positionAndShowTooltip
    function positionAndShowTooltip(mouseX) {
        if (!danmakuTooltip) return;
        const tooltipWidth = danmakuTooltip.offsetWidth;

        // [v1.10.3] 修复：直接使用传入的 mouseX (相对于 container)
        let left = mouseX - (tooltipWidth / 2);

        if (left < 0) {
            left = 0;
        }
        if (progressContainer && left + tooltipWidth > progressContainer.clientWidth) {
            left = progressContainer.clientWidth - tooltipWidth;
        }
        danmakuTooltip.style.left = left + 'px';
        danmakuTooltip.style.display = 'block';
    }

    // 15. hideProgressHover (v1.7.1 不变)
    function hideProgressHover() {
        if (danmakuTooltip) {
            danmakuTooltip.style.display = 'none';
        }
        lastHoverTime = -1;
    }

    // 16. binarySearchDanmakuIndex (v1.7.1 不变)
    function binarySearchDanmakuIndex(targetTime) {
        let low = 0;
        let high = danmakuList.length - 1;
        let result = -1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (danmakuList[mid].time >= targetTime) {
                result = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        if (result === -1) {
            return -1;
        }
        return Math.max(0, result - 1);
    }

    // 17. [v1.7.1] 辅助函数 (不变)

    function getDurationForP(pIndex) {
        if (pStickyManualDurationsMap.has(pIndex)) {
            console.log(`P-Sync: Using Sticky duration for P-${pIndex}`);
            return pStickyManualDurationsMap.get(pIndex);
        }
        if (pDurationsMap.has(pIndex)) {
             console.log(`P-Sync: Using Cached duration for P-${pIndex}`);
            return pDurationsMap.get(pIndex);
        }
        return findAndCacheDurationInDOM(pIndex);
    }

    function findAndCacheDurationInDOM(pIndex) {
         console.log(`P-Sync: DOM search for P-${pIndex} duration...`);
        try {
            const pItems = document.querySelectorAll('.video-pod__list .simple-base-item, .list-box-item');
            if (pItems.length === 0) {
                 console.warn(`P-Sync: Could not find P-list DOM container.`);
                 return 0;
            }
            const pItem = pItems[pIndex - 1];

            if (pItem) {
                const durationSpan = pItem.querySelector('.duration, .stat-item.duration');
                if (durationSpan) {
                    const duration = parseTimeToSeconds(durationSpan.textContent);
                    if (duration > 0) {
                        console.log(`P-Sync: Found P-${pIndex} duration: ${duration}s`);
                        pDurationsMap.set(pIndex, duration);
                        return duration;
                    }
                }
            }
            console.warn(`P-Sync: Could not find duration for P-${pIndex} in DOM.`);
            return 0;
        } catch(e) {
            console.error(`P-Sync: Error finding duration for P-${pIndex}`, e);
            return 0;
        }
    }

    function getCurrentPIndex() {
        try {
            const allItems = document.querySelectorAll('.video-pod__list .simple-base-item, .list-box-item');
            const activeItem = document.querySelector('.video-pod__item.active, .list-box-item.on');

            if (allItems.length > 0 && activeItem) {
                for (let i = 0; i < allItems.length; i++) {
                    if (allItems[i] === activeItem) {
                        return i + 1; // 索引 0 是 P1
                    }
                }
            }
            if (window.player && typeof window.player.p === 'number') {
                return window.player.p;
            }
            const match = window.location.href.match(/[\?&]p=(\d+)/);
            if (match && match[1]) {
                return parseInt(match[1], 10);
            }
            return 1;
        } catch (e) {
            console.error("P-Sync: Error getting P-index", e);
            return -1;
        }
    }

    function updatePSyncUILabels() {
        if (!pSyncCorrectLabel || !pSyncCorrectInput || !pSyncCorrectSaveBtn) return;

        pSyncCorrectLabel.textContent = `修正 P-${currentPIndex} 时长 (用于P-${currentPIndex+1}):`;

        const stickyDuration = pStickyManualDurationsMap.get(currentPIndex);
        const autoDuration = pDurationsMap.get(currentPIndex);

        if (stickyDuration > 0) {
            pSyncCorrectInput.value = formatTime(stickyDuration, false);
            pSyncCorrectInput.placeholder = `自动: ${formatTime(autoDuration || 0, false)}`;
        } else {
            pSyncCorrectInput.value = "";
            pSyncCorrectInput.placeholder = `自动: ${formatTime(autoDuration || 0, false)}`;
        }

        pSyncCorrectSaveBtn.textContent = "保存";

        const anchorTitle = document.querySelector("#local-dm-anchor-sync-controls span");
        if(anchorTitle) anchorTitle.textContent = `手动锚点对齐 (P-${currentPIndex})`;

        const offsetTitle = document.querySelector("#local-dm-offset-controls span");
        if(offsetTitle) offsetTitle.textContent = `精调偏移 (P-${currentPIndex})`;
    }

    function saveManualDuration() {
        if (!pSyncCorrectInput || !pSyncCorrectSaveBtn || currentPIndex === -1) return;

        const duration = parseTimeToSeconds(pSyncCorrectInput.value);

        if (isNaN(duration) || duration <= 0) {
            pStickyManualDurationsMap.delete(currentPIndex);
            pSyncCorrectInput.value = "";
            console.log(`P-Sync: Cleared sticky duration for P-${currentPIndex}.`);
            pSyncCorrectSaveBtn.textContent = "已清除";
        } else {
            pStickyManualDurationsMap.set(currentPIndex, duration);
            console.log(`P-Sync: Sticky duration for P-${currentPIndex} saved: ${duration}s`);
            pSyncCorrectSaveBtn.textContent = "已保存";
        }

        setTimeout(() => {
            if (pSyncCorrectSaveBtn) pSyncCorrectSaveBtn.textContent = "保存";
        }, 2000);
    }

    function formatTime(seconds, showDecimals = true) {
        if (isNaN(seconds) || seconds < 0) {
            return "0:00";
        }
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;

        let timeStr = "";
        if (hours > 0) {
            timeStr += `${hours}:${minutes.toString().padStart(2, '0')}:`;
        } else {
            timeStr += `${minutes}:`;
        }

        if (showDecimals) {
             timeStr += `${Math.floor(secs).toString().padStart(2, '0')}.${Math.floor((secs % 1) * 10)}`;
        } else {
             timeStr += `${Math.floor(secs).toString().padStart(2, '0')}`;
        }
        return timeStr;
    }

    function parseTimeToSeconds(timeStr) {
        if (!timeStr) return 0;
        if (!isNaN(parseFloat(timeStr)) && isFinite(timeStr)) {
            return parseFloat(timeStr);
        }
        let parts = timeStr.split(':').reverse();
        let seconds = 0;
        try {
            if (parts[0]) seconds += parseFloat(parts[0]);
            if (parts[1]) seconds += parseFloat(parts[1]) * 60;
            if (parts[2]) seconds += parseFloat(parts[2]) * 3600;
        } catch (e) {
            console.error("Error parsing time:", timeStr, e);
            return 0;
        }
        return isNaN(seconds) ? 0 : seconds;
    }

    // [v1.8 修改] 锚点对齐 (调用 updatePBaseOffset)
    function applyDanmakuSync() {
        if (!syncVideoTimeInput || !syncDanmakuTimeInput || currentPIndex === -1) return;
        const videoTime = parseTimeToSeconds(syncVideoTimeInput.value);
        const danmakuTime = parseTimeToSeconds(syncDanmakuTimeInput.value);
        if (isNaN(videoTime) || isNaN(danmakuTime)) {
            console.error("Invalid P-Sync time format.");
            return;
        }
        const newBaseOffset = videoTime - danmakuTime; // [v1.8]
        console.log(`P-Sync (Manual): VideoTime=${videoTime}, DanmakuTime=${danmakuTime}. Calculated new Base offset: ${newBaseOffset}`);

        pOffsetsMap.set(currentPIndex, newBaseOffset);
        updatePBaseOffset(newBaseOffset, 'manual'); // [v1.8]
    }

    // 18. [v1.9 修复] 卡顿补偿逻辑
    function toggleLagCompensation() {
        if (!videoElement || !lagCompensatorBtn) return;

        if (isLagPaused) {
            // --- 恢复 ---
            const lagEndTime = performance.now(); // [v1.9] 使用 performance.now()
            const lagDurationMs = lagEndTime - lagStartTime;
            const lagDurationSec = lagDurationMs / 1000.0;

            if (lagDurationSec > 0.1) {
                console.log(`Lag Compensator: Resumed. Detected ${lagDurationSec.toFixed(1)}s lag.`);
                // [v1.9 修复] 弹幕需要更晚出现, 所以偏移量要 *增加* (更正)
                const newFineTune = fineTuneOffset + lagDurationSec;
                updateFineTuneOffset(newFineTune); // 这会触发重置
            } else {
                 console.log(`Lag Compensator: Resumed. No significant lag detected.`);
            }

            resetLagCompensator();

        } else {
            // --- 暂停 ---
            isLagPaused = true;
            lagStartTime = performance.now(); // [v1.9] 使用 performance.now()
            lagCompensatorBtn.textContent = "卡顿中... [点击恢复]";
            lagCompensatorBtn.classList.add('lagging');
            console.log(`Lag Compensator: Paused at ${lagStartTime.toFixed(1)}.`);
        }
    }

    function resetLagCompensator() {
        isLagPaused = false;
        lagStartTime = 0;
        if (lagCompensatorBtn) {
            lagCompensatorBtn.textContent = "卡顿补偿 [暂停]";
            lagCompensatorBtn.classList.remove('lagging');
        }
    }

    // 启动脚本
    waitForPlayer();

})();