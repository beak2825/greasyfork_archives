// ==UserScript==
// @name         Missav字幕加载增强版V1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  一键搜索字幕，加载本地字幕，快捷键操作加速，可自动隐藏界面，可调整字幕位置及大小。
// @author       xiaoxiongweihu (优化 by goole ai studio)
// @match        *://missav123.com/*
// @match        *://missav.ws/*
// @match        *://missav.ai/*
// @match        *://missav.com/*
// @match        *://missav.live/*

// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @connect      xunlei.com
// @connect      geilijiasu.com
// @connect      v.geilijiasu.com
// @license      MIT
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/562184/Missav%E5%AD%97%E5%B9%95%E5%8A%A0%E8%BD%BD%E5%A2%9E%E5%BC%BA%E7%89%88V1.user.js
// @updateURL https://update.greasyfork.org/scripts/562184/Missav%E5%AD%97%E5%B9%95%E5%8A%A0%E8%BD%BD%E5%A2%9E%E5%BC%BA%E7%89%88V1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Styles ---
    GM_addStyle(`
        /* ... (之前的样式保持不变) ... */
        .custom-control-panel {
            position: fixed;
            top: 10px;
            left: 10px;
            background: linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(40, 40, 55, 0.95));
            color: white;
            padding: 16px 18px;
            z-index: 9999;
            border-radius: 12px;
            min-width: 340px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        .custom-control-panel label {
            margin-right: 8px;
            vertical-align: middle;
            display: inline-block;
            width: 90px;
            text-align: right;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            font-size: 12px;
        }
        .custom-control-panel input[type="number"],
        .custom-control-panel input[type="text"] {
            width: 55px;
            margin-right: 10px;
            color: white;
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(100, 150, 255, 0.3);
            border-radius: 6px;
            padding: 5px 8px;
            vertical-align: middle;
            box-sizing: border-box;
            transition: all 0.2s ease;
            font-size: 12px;
        }
        .custom-control-panel input[type="number"]:focus,
        .custom-control-panel input[type="text"]:focus {
            outline: none;
            border-color: rgba(100, 150, 255, 0.6);
            background: rgba(255, 255, 255, 0.18);
            box-shadow: 0 0 8px rgba(100, 150, 255, 0.3);
        }
         /* Specific width for offset/position inputs */
        .custom-control-panel input[data-key-name="subtitleOffset"],
        .custom-control-panel input[data-key-name="subtitlePosition"] {
             width: 60px;
        }
        .custom-control-panel button {
            background: linear-gradient(135deg, #4a90e2, #357abd);
            border: none;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            margin: 0;
            vertical-align: middle;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(58, 123, 200, 0.3);
            white-space: nowrap;
        }
        .custom-control-panel button:hover {
            background: linear-gradient(135deg, #5aa0f2, #4589cd);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(58, 123, 200, 0.4);
        }
        .custom-control-panel button:active {
            transform: translateY(0);
            box-shadow: 0 1px 4px rgba(58, 123, 200, 0.3);
        }
        .custom-control-panel .input-group {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            padding: 4px 0;
        }
        .custom-control-panel .button-group {
            margin-top: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            padding-top: 12px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        .custom-subtitle {
            position: absolute;
            /* bottom: 15%; */ /* REMOVED - Now controlled by JS */
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 26px;
            font-weight: bold;
            text-shadow: 2px 2px 5px rgba(0,0,0,0.9);
            background: rgba(0,0,0,0.0);
            padding: 5px 10px;
            border-radius: 5px;
            max-width: 85%;
            text-align: center;
            transition: opacity 0.3s, bottom 0.2s ease-out; /* Add transition for bottom */
            z-index: 10000;
            pointer-events: none;
        }
        .subtitle-list {
            position: fixed;
            top: 10px;
            left: 360px;
            background: linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(40, 40, 55, 0.95));
            color: white;
            max-height: 350px;
            width: 320px;
            overflow-y: auto;
            padding: 14px;
            border-radius: 12px;
            z-index: 10001;
            border: 1px solid rgba(100, 150, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
        }
        .subtitle-item {
            padding: 8px 10px;
            cursor: pointer;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 12px;
            border-radius: 6px;
            margin-bottom: 4px;
            transition: all 0.2s ease;
        }
        .subtitle-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .subtitle-item:hover {
            background: rgba(100, 150, 255, 0.25);
            transform: translateX(4px);
            border-color: rgba(100, 150, 255, 0.3);
        }
        .show-controls-button {
            position: fixed;
            top: 50px;
            left: 50px;
            background: linear-gradient(135deg, #4a90e2, #357abd);
            color: white;
            padding: 8px 14px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            z-index: 9998;
            font-size: 13px;
            font-weight: 500;
            box-shadow: 0 4px 16px rgba(58, 123, 200, 0.4);
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        }
        .show-controls-button:hover {
            background: linear-gradient(135deg, #5aa0f2, #4589cd);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(58, 123, 200, 0.5);
        }
        .custom-control-panel button.full-width {
            grid-column: 1 / -1;
        }
    `);

    // --- Global Variables ---
    let accelerationRate = parseFloat(localStorage.getItem('missavAccelerationRate')) || 3;
    let skipTime = parseFloat(localStorage.getItem('missavSkipTime')) || 5;
    let subtitleOffset = parseFloat(localStorage.getItem('missavSubtitleOffset')) || 0;
    let subtitleVerticalPositionPercent = parseFloat(localStorage.getItem('missavSubtitlePosition')) || 15; // Default 15% from bottom
    let isAccelerating = false;
    let plyrInstance = null;
    let subtitles = [];
    let originalSubtitleText = '';
    let shortcutKeys = {
        accelerate: localStorage.getItem('missavAccelerateKey') || 'z',
        forward: localStorage.getItem('missavForwardKey') || 'x',
        backward: localStorage.getItem('missavBackwardKey') || 'c'
    };

    // --- UI Elements ---
    let controlPanel;
    let subtitleElement;
    let videoContainer;
    let subtitleList = null;
    let showControlsButton = null;

    // --- Functions ---

    /** Updates the subtitle element's vertical position style. */
    function updateSubtitlePositionStyle(positionPercent) {
        if (subtitleElement && typeof positionPercent === 'number') {
            // Ensure position is within reasonable bounds (e.g., 0% to 90%)
            const clampedPosition = Math.max(0, Math.min(90, positionPercent));
            subtitleElement.style.bottom = `${clampedPosition}%`;
        }
    }

    /**
     * Creates and appends the main control panel to the page.
     */
    function createControlPanel() {
        if (document.querySelector('.custom-control-panel')) return;

        controlPanel = document.createElement('div');
        controlPanel.className = 'custom-control-panel';

        const createInputGroup = (labelText, inputType, value, onInputHandler, keyName, options = {}) => {
            const group = document.createElement('div');
            group.className = 'input-group';
            const label = document.createElement('label');
            label.textContent = labelText;
            const input = document.createElement('input');
            input.type = inputType;
            input.value = value;
            input.setAttribute('data-key-name', keyName);
            if (inputType === 'number') {
                input.min = options.min ?? ''; // Set min if provided
                input.max = options.max ?? ''; // Set max if provided
                input.step = options.step ?? 'any'; // Set step
            }
            input.oninput = onInputHandler;
            group.append(label, input);
            return group;
        };

        // Shortcut Key Inputs
        controlPanel.append(
            createInputGroup('加速键:', 'text', shortcutKeys.accelerate, (e) => {
                shortcutKeys.accelerate = e.target.value.toLowerCase();
            }, 'accelerate'),
            createInputGroup('快进键:', 'text', shortcutKeys.forward, (e) => {
                shortcutKeys.forward = e.target.value.toLowerCase();
            }, 'forward'),
            createInputGroup('倒退键:', 'text', shortcutKeys.backward, (e) => {
                shortcutKeys.backward = e.target.value.toLowerCase();
            }, 'backward')
        );

        // Playback & Subtitle Settings Inputs
        controlPanel.append(
            createInputGroup('加速倍率:', 'number', accelerationRate, (e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) accelerationRate = val;
            }, 'accelerationRate', { min: 0.1, step: 0.1 }), // Added min/step
            createInputGroup('快进/退(秒):', 'number', skipTime, (e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) skipTime = val;
            }, 'skipTime', { min: 0.1, step: 0.1 }), // Added min/step
            createInputGroup('字幕偏移(秒):', 'number', subtitleOffset, async (e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                    subtitleOffset = val;
                    if (originalSubtitleText) {
                        try {
                            subtitles = await parseSRT(originalSubtitleText);
                            updateSubtitle();
                        } catch (error) {
                            showToast(`应用字幕偏移失败: ${error.message}`);
                        }
                    }
                }
            }, 'subtitleOffset', { step: 0.1 }), // Added step
             // --- NEW: Subtitle Position Input ---
             createInputGroup('字幕位置(%):', 'number', subtitleVerticalPositionPercent, (e) => {
                 const val = parseFloat(e.target.value);
                 if (!isNaN(val)) {
                     subtitleVerticalPositionPercent = val;
                     updateSubtitlePositionStyle(subtitleVerticalPositionPercent); // Update style immediately
                 }
             }, 'subtitlePosition', { min: 0, max: 90, step: 1 }) // Added min/max/step
        );

        // --- Buttons ---
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-group';

        const subtitleInput = document.createElement('input');
        subtitleInput.type = 'file';
        subtitleInput.accept = '.srt';
        subtitleInput.style.display = 'none';
        subtitleInput.onchange = handleLocalSubtitleFile;

        const createButton = (text, onClickHandler) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.onclick = onClickHandler;
            return button;
        };

        buttonContainer.append(
            createButton('加载本地字幕', () => subtitleInput.click()),
            createButton('搜索字幕(源1)', searchSubtitleOnline1),
            createButton('搜索字幕(源2)', searchSubtitleOnline2),
            createButton('清除字幕', clearSubtitles),
            createButton('保存设置', saveSettings)
        );

        const hideButton = createButton('隐藏面板', hideControlPanel);
        hideButton.className = 'full-width';
        buttonContainer.appendChild(hideButton);
        buttonContainer.appendChild(subtitleInput);

        controlPanel.appendChild(buttonContainer);
        document.body.appendChild(controlPanel);
    }

    /**
     * Creates the initially hidden button to show the control panel.
     */
    function createShowControlsButton() {
        if (showControlsButton) return;

        showControlsButton = document.createElement('button');
        showControlsButton.className = 'show-controls-button';
        showControlsButton.textContent = '显示控制'; // Shorter text
        showControlsButton.style.display = 'none';
        showControlsButton.onclick = showControlPanel;
        document.body.appendChild(showControlsButton);
    }

    /** Hides the main control panel and shows the 'Show Controls' button. */
    function hideControlPanel() {
        if (controlPanel) controlPanel.style.display = 'none';
        if (showControlsButton) showControlsButton.style.display = 'block';
        if (subtitleList) subtitleList.style.display = 'none';
    }

    /** Shows the main control panel and hides the 'Show Controls' button. */
    function showControlPanel() {
        if (controlPanel) controlPanel.style.display = 'block';
        if (showControlsButton) showControlsButton.style.display = 'none';
        if (subtitleList) subtitleList.style.display = 'block';
    }

    /** Sets up the subtitle display element and attaches it to the video container. */
    function setupSubtitleDisplay() {
        subtitleElement = document.createElement('div');
        subtitleElement.className = 'custom-subtitle';
        subtitleElement.style.display = 'none'; // Hide initially
        updateSubtitlePositionStyle(subtitleVerticalPositionPercent); // Apply initial position

        const waitForContainer = setInterval(() => {
            videoContainer = document.querySelector('.plyr__video-wrapper') || document.querySelector('.player-container') || document.getElementById('player-container');
            if (!videoContainer) {
                const video = document.querySelector('video');
                if (video) videoContainer = video.parentElement;
            }

            if (videoContainer) {
                clearInterval(waitForContainer);
                // Ensure container can host positioned elements
                if (getComputedStyle(videoContainer).position === 'static') {
                     videoContainer.style.position = 'relative';
                }
                videoContainer.appendChild(subtitleElement);
            } else {
                console.warn("Missav Script: Video container not found yet.");
            }
        }, 500);

        setTimeout(() => {
            if (!videoContainer) {
                clearInterval(waitForContainer);
                console.error("Missav Script: Failed to find video container after 10 seconds.");
                showToast("错误：无法找到视频容器挂载字幕", 5000);
            }
        }, 10000);
    }

    /** Handles the selection of a local SRT file. */
    async function handleLocalSubtitleFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        event.target.value = null; // Reset input

        try {
            const text = await file.text();
            originalSubtitleText = text;
            subtitles = await parseSRT(text);
            subtitleElement.style.display = 'block';
            if (subtitleList) closeSubtitleList(); // Close search results if open
            showToast('本地字幕加载成功');
        } catch (error) {
            console.error("Subtitle load error:", error);
            showToast(`本地字幕加载失败: ${error.message}`);
            clearSubtitles();
        }
    }

    /** Parses SRT text into subtitle objects, applying the current offset. */
    async function parseSRT(text) {
        // ... (parseSRT function remains the same)
         return new Promise((resolve) => {
            const subs = text
                .replace(/\r/g, '') // Remove carriage returns
                .split(/\n\n+/) // Split into blocks
                .filter(Boolean) // Remove empty blocks
                .map(block => {
                    try {
                        const lines = block.split('\n');
                        if (lines.length < 2) return null; // Need at least time + text

                        let timeLineIndex = lines[0].includes('-->') ? 0 : (lines.length > 1 && lines[1].includes('-->') ? 1 : -1); // Allow time on line 0 or 1

                        if (timeLineIndex === -1) return null; // Invalid time line format

                        const [startStr, endStr] = lines[timeLineIndex].split(' --> ');
                        const start = parseTime(startStr) + subtitleOffset;
                        const end = parseTime(endStr) + subtitleOffset;
                        const textContent = lines.slice(timeLineIndex + 1).join('\n').trim();

                        if (isNaN(start) || isNaN(end) || start < 0 || end < 0 || start > end || !textContent) return null; // More validation

                        return { start, end, text: textContent };
                    } catch (e) {
                        console.warn("Skipping invalid SRT block:", block, e);
                        return null; // Skip malformed blocks
                    }
                })
                .filter(Boolean); // Remove any null results from map
            resolve(subs);
        });
    }

    /** Parses SRT time string (HH:MM:SS,ms) into seconds. */
    function parseTime(timeStr) {
        // ... (parseTime function remains the same)
        try {
             const [hms, msPart] = timeStr.split(/[,.]/);
             const ms = msPart ? parseInt(msPart.padEnd(3, '0').slice(0, 3), 10) : 0; // Ensure 3 digits for ms, handle missing ms
             const [h, m, s] = hms.split(':');
             const hours = parseInt(h, 10) || 0;
             const minutes = parseInt(m, 10) || 0;
             const seconds = parseInt(s, 10) || 0;

             if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || isNaN(ms)) {
                 throw new Error("Invalid time component");
             }
             return (hours * 3600) + (minutes * 60) + seconds + (ms / 1000);
         } catch (e) {
             console.error("Failed to parse time string:", timeStr, e);
             return NaN; // Return NaN on failure
         }
    }

    /** Updates the displayed subtitle based on the current video time. */
    function updateSubtitle() {
        // ... (updateSubtitle function remains the same)
        if (!plyrInstance || !subtitles || subtitles.length === 0 || !subtitleElement) return;

        try {
            const currentTime = plyrInstance.currentTime;
            // Find the first matching subtitle (handles potential overlaps)
            const currentSub = subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end);

            const newText = currentSub ? currentSub.text : '';
            // Optimize DOM manipulation: only update if text content changes
            if (subtitleElement.textContent !== newText) {
                subtitleElement.textContent = newText;
            }
            // Toggle display based on whether there's text to show
            subtitleElement.style.display = newText ? 'block' : 'none';

        } catch (e) {
            console.error("Error updating subtitle:", e);
        }
    }

    /** Initializes connection with the Plyr player instance. */
    function initPlayer() {
        // ... (initPlayer function remains the same)
         const checkPlayerInterval = setInterval(() => {
            const player = typeof unsafeWindow !== 'undefined' ? unsafeWindow.player : window.player;
            if (player && typeof player.on === 'function' && typeof player.currentTime !== 'undefined') {
                clearInterval(checkPlayerInterval);
                plyrInstance = player;
                console.log("Missav Script: Player instance found.", plyrInstance);

                plyrInstance.on('timeupdate', () => {
                    requestAnimationFrame(updateSubtitle);
                });

                requestAnimationFrame(updateSubtitle); // Initial update

                showToast('播放器初始化完成', 1500);
            }
        }, 500);

        setTimeout(() => {
            if (!plyrInstance) {
                clearInterval(checkPlayerInterval);
                console.error("Missav Script: Failed to find player instance after 15 seconds.");
                showToast("错误：无法连接到播放器实例", 5000);
            }
        }, 15000);
    }

    /** Sets up global keyboard shortcuts. */
    function setupShortcuts() {
        // ... (setupShortcuts function remains the same)
         document.addEventListener('keydown', (e) => {
            if (e.target.closest && e.target.closest('.custom-control-panel input')) {
                 return; // Ignore if typing in panel inputs
             }
            if (!plyrInstance || typeof plyrInstance.currentTime !== 'number') return;

            const key = e.key.toLowerCase();

            try {
                 if (key === shortcutKeys.accelerate && !isAccelerating) {
                     plyrInstance.speed = accelerationRate;
                     isAccelerating = true;
                 } else if (key === shortcutKeys.forward) {
                     plyrInstance.currentTime += skipTime;
                 } else if (key === shortcutKeys.backward) {
                     plyrInstance.currentTime = Math.max(0, plyrInstance.currentTime - skipTime);
                 }
             } catch (err) {
                console.error("Shortcut error:", err);
             }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() === shortcutKeys.accelerate && isAccelerating) {
                 if (plyrInstance) {
                    try { plyrInstance.speed = 1; } catch(err) { console.error("Error resetting speed:", err); }
                 }
                isAccelerating = false;
            }
        });
    }

    /** Searches subtitles on Subtitlecat. */
    function searchSubtitleOnline1() {
        // ... (searchSubtitleOnline1 function remains the same)
         const videoID = getCurrentVideoID();
        if (!videoID) {
            showToast('无法获取当前视频番号');
            return;
        }
        const searchUrl = `https://subtitlecat.com/index.php?search=${encodeURIComponent(videoID)}`;
        GM_openInTab(searchUrl, { active: true });
        showToast(`正在打开 Subtitlecat 搜索: ${videoID}`);
    }

    /** Searches subtitles using Xunlei API. */
    async function searchSubtitleOnline2() {
        // ... (searchSubtitleOnline2 function remains the same)
         const videoID = getCurrentVideoID();
        if (!videoID) {
            showToast('无法获取当前视频番号');
            return;
        }

        showToast(`(源2) 正在搜索字幕: ${videoID}...`);
        closeSubtitleList();

        try {
            const apiUrl = `https://api-shoulei-ssl.xunlei.com/oracle/subtitle?name=${encodeURIComponent(videoID)}`;
            const data = await fetchSubtitleAPI(apiUrl);

            if (data?.code === 0 && data.data?.length > 0) {
                const relevantSubs = data.data.filter(item =>
                    item.url && item.url.toLowerCase().includes('.srt')
                );
                if (relevantSubs.length > 0) {
                    showSubtitleList(relevantSubs);
                } else {
                    showToast(`(源2) 未找到 ${videoID} 的SRT字幕`);
                }
            } else {
                 showToast(`(源2) 未找到 ${videoID} 的匹配字幕 ${data?.code ? `(Code: ${data.code})` : ''}`);
            }
        } catch (error) {
            console.error("Subtitle search error (Source 2):", error);
            showToast(`(源2) 字幕搜索出错: ${error.message}`);
        }
    }

    /** Fetches data via GM_xmlhttpRequest. */
    function fetchSubtitleAPI(url) {
        // ... (fetchSubtitleAPI function remains the same)
         return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "X-Requested-With": "XMLHttpRequest",
                    "Cache-Control": "no-cache",
                    "Referer": window.location.href,
                    "Origin": window.location.origin,
                    "User-Agent": navigator.userAgent
                },
                timeout: 15000,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try { resolve(JSON.parse(response.responseText)); }
                        catch (e) { reject(new Error('无法解析服务器响应 (JSON)')); }
                    } else {
                        reject(new Error(`服务器错误 ${response.status}`));
                    }
                },
                onerror: (error) => reject(new Error('网络错误或请求被阻止')),
                ontimeout: () => reject(new Error('请求超时 (15秒)'))
            });
        });
    }

    /** Displays list of found subtitles. */
    function showSubtitleList(items) {
        // ... (showSubtitleList function remains the same, including close logic)
         closeSubtitleList(); // Ensure only one list is open

        subtitleList = document.createElement('div');
        subtitleList.className = 'subtitle-list';

        const title = document.createElement('div');
        title.textContent = '选择在线字幕:';
        title.style.cssText = 'color:#ccc; margin-bottom:8px; font-weight: bold;';
        subtitleList.appendChild(title);

        if (items.length === 0) {
            const noSubs = document.createElement('div');
            noSubs.textContent = '未找到相关字幕。';
            noSubs.style.padding = '5px';
            subtitleList.appendChild(noSubs);
        } else {
            items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'subtitle-item';
                div.textContent = `${item.name}${item.extra_name ? ` (${item.extra_name})` : ''}`;
                div.title = `点击加载: ${item.name}`;
                div.onclick = (e) => {
                    e.stopPropagation();
                    loadRemoteSubtitle(item.url);
                };
                subtitleList.appendChild(div);
            });
        }

         const closeBtn = document.createElement('button');
         closeBtn.textContent = '关闭列表';
         closeBtn.style.cssText = 'margin-top: 10px; padding: 4px 6px; font-size: 11px; background: #555; border: none; color: white; border-radius: 3px; cursor: pointer; display: block; margin-left: auto; margin-right: auto;';
         closeBtn.onclick = closeSubtitleList;
         subtitleList.appendChild(closeBtn);

         document.body.appendChild(subtitleList);

         setTimeout(() => {
             document.addEventListener('click', handleClickOutsideList, true);
         }, 0);
    }

    /** Closes the subtitle list. */
    function handleClickOutsideList(event) {
        if (subtitleList && !subtitleList.contains(event.target) && !event.target.closest('.custom-control-panel button')) { // Don't close if clicking buttons that might open it
            closeSubtitleList();
        }
    }

    /** Removes subtitle list and listener. */
    function closeSubtitleList() {
        if (subtitleList) {
            subtitleList.remove();
            subtitleList = null;
        }
        document.removeEventListener('click', handleClickOutsideList, true);
    }

    /** Loads subtitle from remote URL. */
    async function loadRemoteSubtitle(url) {
        // ... (loadRemoteSubtitle function remains the same)
        showToast('正在加载在线字幕...');
        closeSubtitleList();

        try {
            const srtContent = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                     headers: {
                         "Accept": "text/plain,*/*",
                         "Referer": window.location.href,
                         "User-Agent": navigator.userAgent
                     },
                    timeout: 20000,
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) { resolve(response.responseText); }
                        else { reject(new Error(`下载失败 (HTTP ${response.status})`)); }
                    },
                    onerror: (error) => reject(new Error('网络错误或请求被阻止')),
                    ontimeout: () => reject(new Error('下载超时 (20秒)'))
                });
            });

            originalSubtitleText = srtContent;
            subtitles = await parseSRT(srtContent);
            subtitleElement.style.display = 'block';
            showToast('在线字幕加载成功');
        } catch (error) {
            console.error("Error loading remote subtitle:", error);
            showToast(`在线字幕加载失败: ${error.message}`);
            clearSubtitles();
        }
    }

    /** Clears current subtitles. */
    function clearSubtitles() {
        // ... (clearSubtitles function remains the same)
        subtitles = [];
        originalSubtitleText = '';
        if (subtitleElement) {
            subtitleElement.textContent = '';
            subtitleElement.style.display = 'none';
        }
        showToast('字幕已清除', 1500);
    }

    /** Extracts video ID from URL. */
    function getCurrentVideoID() {
        // ... (getCurrentVideoID function remains the same)
         try {
            const path = window.location.pathname;
            const segments = path.split('/').filter(s => s.length > 0);

            if (segments.length === 0) return '';

            // Check last segment first (most common case)
            const lastSegment = segments[segments.length - 1];
            let idMatch = lastSegment.match(/^([a-zA-Z]{2,6})[-_]?(\d{2,5})/i); // Common format: ABC-123 or ABC_123 or ABC123
            if (idMatch) return `${idMatch[1].toUpperCase()}-${idMatch[2]}`;

            // Check if last segment is just the ID without prefix like /ja/1234567 (less common for standard IDs)
            // if (lastSegment.match(/^\d{5,}$/)) { } // Maybe ignore purely numeric IDs unless sure?

            // Check second to last segment (e.g., /videos/abc-123/play)
            if (segments.length >= 2) {
                const secondLastSegment = segments[segments.length - 2];
                idMatch = secondLastSegment.match(/^([a-zA-Z]{2,6})[-_]?(\d{2,5})/i);
                if (idMatch) return `${idMatch[1].toUpperCase()}-${idMatch[2]}`;
            }

            // Fallback: Check entire path for the pattern
            idMatch = path.match(/([a-zA-Z]{2,6})[-_]?(\d{2,5})/i);
            if (idMatch) return `${idMatch[1].toUpperCase()}-${idMatch[2]}`;

            // Final fallback: Return last segment if it contains a hyphen (might be an ID)
            if(lastSegment.includes('-') && lastSegment.length > 3) return lastSegment.toUpperCase();

            console.warn("Could not determine Video ID from path:", path);
            return ''; // Return empty if no ID found

        } catch (error) {
            console.error("Error getting Video ID:", error);
            return '';
        }
    }

    /** Saves settings to localStorage. */
    function saveSettings() {
        try {
            localStorage.setItem('missavAccelerationRate', accelerationRate);
            localStorage.setItem('missavSkipTime', skipTime);
            localStorage.setItem('missavSubtitleOffset', subtitleOffset);
            localStorage.setItem('missavSubtitlePosition', subtitleVerticalPositionPercent); // <-- SAVE POSITION
            localStorage.setItem('missavAccelerateKey', shortcutKeys.accelerate);
            localStorage.setItem('missavForwardKey', shortcutKeys.forward);
            localStorage.setItem('missavBackwardKey', shortcutKeys.backward);
            showToast('设置已保存');
        } catch (e) {
            console.error("Error saving settings:", e);
            showToast('保存设置失败');
        }
    }

    /** Displays a toast message. */
    function showToast(message, duration = 3000) {
        // ... (showToast function remains the same)
         const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            z-index: 10002;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            max-width: 300px; /* Prevent overly wide toasts */
            text-align: center;
        `;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '1'; }, 50);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
        }, duration);
    }

    // --- Initialization ---
    function initializeScript() {
        console.log("Missav Script: Initializing v1.6...");
        setupSubtitleDisplay();    // Prepare subtitle div (applies initial position)
        createControlPanel();      // Create the main controls (including position input)
        createShowControlsButton();// Create the hidden 'show' button
        setupShortcuts();          // Setup keyboard listeners
        initPlayer();              // Connect to the video player
        console.log("Missav Script: Initialization complete.");
    }

    // Use MutationObserver or fallback timer to start initialization
    let initStarted = false;
    const observer = new MutationObserver((mutationsList, obs) => {
        const playerElement = document.querySelector('video#player, video.plyr__video-wrapper video, .player-container video, .plyr--video'); // Added .plyr--video
        if (playerElement && !initStarted) {
             console.log("Missav Script: Player element detected, running main script.");
             initStarted = true;
             obs.disconnect();
             initializeScript();
         }
    });

    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

    setTimeout(() => {
        if (!initStarted) {
             console.log("Missav Script: Fallback timer triggered, attempting initialization.");
             initStarted = true; // Prevent double initialization
             observer.disconnect();
             initializeScript();
         }
     }, 4000); // Increased fallback timer slightly

})(); // End of IIFE