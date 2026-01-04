// ==UserScript==
// @name         Missav字幕小姐
// @namespace    http://tampermonkey.net/
// @version      0.9.2
// @description  自动查询并缓存字幕信息，加载本地字幕，快捷键操作加速.
// @author       av字幕小姐
// @match        *://missav.ws/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @connect      xunlei.com
// @connect      geilijiasu.com
// @connect      v.geilijiasu.com
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549578/Missav%E5%AD%97%E5%B9%95%E5%B0%8F%E5%A7%90.user.js
// @updateURL https://update.greasyfork.org/scripts/549578/Missav%E5%AD%97%E5%B9%95%E5%B0%8F%E5%A7%90.meta.js
// ==/UserScript==
 
(function () {
    'use strict';

    // --- Cache Settings ---
    const CACHE_KEY = 'missav_subtitle_cache';
    const CACHE_EXPIRATION_DAYS = 30;

    // --- Site Settings ---
    // 影片縮圖卡片的 CSS 選擇器。如果未來網站改版導致列表頁功能失效，只需修改這裡。
    // .card 是舊版結構, .aspect-w-16 是新版結構 (Tailwind CSS)
    const VIDEO_CARD_SELECTOR = '.card, .aspect-w-16';

    GM_addStyle(`
        .custom-control-panel {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 10px;
            z-index: 9999;
            border-radius: 5px;
            min-width: 300px;
        }
        .custom-control-panel label {
            margin-right: 5px;
        }
        .custom-control-panel input[type="number"] {
            width: 60px;
            margin-right: 5px;
            color: white;
            background: rgba(0, 0, 0, 0.3);
        }
        .custom-control-panel input[type="text"] {
            width: 60px;
            margin-right: 5px;
            color: white;
            background: rgba(0, 0, 0, 0.3);
        }
        .custom-control-panel button {
            background: #2196F3;
            border: none;
            color: white;
            padding: 5px 5px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 10px;
        }
        .custom-subtitle {
            position: absolute;
            bottom: 15%;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            background: rgba(0,0,0,0.0);
            padding: 4px 8px;
            border-radius: 4px;
            max-width: 80%;
            text-align: center;
            transition: opacity 0.3s;
            z-index: 10000;
        }
        .subtitle-list {
            position: fixed;
            bottom: 60px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            max-height: 300px;
            overflow-y: auto;
            padding: 10px;
            border-radius: 5px;
            z-index: 10001;
        }
        .subtitle-item {
            padding: 5px;
            cursor: pointer;
            border-bottom: 1px solid #444;
        }
        .subtitle-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    `);
    let accelerationRate = parseFloat(localStorage.getItem('missavAccelerationRate')) || 3;
    let skipTime = parseFloat(localStorage.getItem('missavSkipTime')) || 5;
    let subtitleOffset = 0;
    let isZKeyPressed = false;
    let plyrInstance = null;
    let subtitles = [];
    let currentSubtitle = null;
    let shortcutKeys = {
        accelerate: localStorage.getItem('missavAccelerateKey') || 'z',
        forward: localStorage.getItem('missavForwardKey') || 'x',
        backward: localStorage.getItem('missavBackwardKey') || 'c'
    };
    let controlPanel;
    let subtitleElement;
    let videoContainer;
    let subtitleList = null;
    let originalSubtitleText = '';
    let subtitleEncoding = 'UTF-8';
    let currentSubtitleSource = null; // Can be a File object or a Blob

    function getCache() {
        try {
            const cachedData = localStorage.getItem(CACHE_KEY);
            return cachedData ? JSON.parse(cachedData) : {};
        } catch (e) {
            console.error('[Missav 字幕腳本] 解析缓存失败:', e);
            return {};
        }
    }

    function saveCache(cache) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (e) {
            console.error('[Missav 字幕腳本] 保存缓存失败:', e);
        }
    }

    function cleanupCache() {
        const cache = getCache();
        const now = Date.now();
        const expirationMs = CACHE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
        let changed = false;
        for (const videoId in cache) {
            if (now - cache[videoId].timestamp > expirationMs) {
                delete cache[videoId];
                changed = true;
            }
        }
        if (changed) {
            saveCache(cache);
            console.log('[Missav 字幕腳本] 已清理过期缓存.');
        }
    }
 
    function createControlPanel() {
        if (document.querySelector('.custom-control-panel')) return;
        controlPanel = document.createElement('div');
        controlPanel.className = 'custom-control-panel';
        const inputsContainer = document.createElement('div');
        inputsContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 5px 10px; margin-bottom: 10px;';

        const createSelectGroup = (labelText, options, onchangeHandler) => {
            const group = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = labelText;
            const select = document.createElement('select');
            select.style.cssText = 'color: white; background: rgba(0, 0, 0, 0.3);';
            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                select.appendChild(option);
            });
            select.onchange = onchangeHandler;
            group.append(label, select);
            return group;
        };

        const createInputGroup = (labelText, inputType, inputValue, onInputHandler) => {
            const group = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = labelText;
            const input = document.createElement('input');
            input.type = inputType;
            input.value = inputValue;
            input.oninput = onInputHandler;
            group.append(label, input);
            return group;
        };
        inputsContainer.append(
            createInputGroup('加速键:', 'text', shortcutKeys.accelerate, e => shortcutKeys.accelerate = e.target.value.toLowerCase()),
            createInputGroup('快进键:', 'text', shortcutKeys.forward, e => shortcutKeys.forward = e.target.value.toLowerCase()),
            createInputGroup('倒退键:', 'text', shortcutKeys.backward, e => shortcutKeys.backward = e.target.value.toLowerCase()),
            createInputGroup('加速倍率:', 'number', accelerationRate, e => accelerationRate = parseFloat(e.target.value)),
            createInputGroup('快进(秒):', 'number', skipTime, e => skipTime = parseFloat(e.target.value)),
            createInputGroup('字幕偏移(秒):', 'number', subtitleOffset, async (e) => {
                subtitleOffset = parseFloat(e.target.value);
                if (originalSubtitleText) {
                    subtitles = await parseSRT(originalSubtitleText);
                }
            }),
            createSelectGroup('字幕编码:', ['UTF-8', 'BIG5', 'GBK'], (e) => {
                subtitleEncoding = e.target.value;
                reloadSubtitleWithNewEncoding();
            })
        );
        controlPanel.appendChild(inputsContainer);
        const buttonContainer = document.createElement('div');
        const subtitleInput = document.createElement('input');
        subtitleInput.type = 'file';
        subtitleInput.accept = '.srt';
        subtitleInput.style.display = 'none';
        const subtitleButton = document.createElement('button');
        subtitleButton.textContent = '加载本地字幕';
        subtitleButton.onclick = () => subtitleInput.click();
        const searchSubtitleButton = document.createElement('button');
        searchSubtitleButton.textContent = '搜索字幕1';
        searchSubtitleButton.onclick = searchSubtitle;
        const searchSubtitle2Button = document.createElement('button');
        searchSubtitle2Button.textContent = '搜索字幕2';
        searchSubtitle2Button.onclick = searchSubtitle2;
        const clearSubtitleButton = document.createElement('button');
        clearSubtitleButton.textContent = '清除字幕';
        clearSubtitleButton.onclick = () => {
            subtitles = [];
            if (subtitleElement) subtitleElement.textContent = '';
            originalSubtitleText = '';
            currentSubtitleSource = null;
            showToast('字幕已清除');
        };
        const saveSettingsButton = document.createElement('button');
        saveSettingsButton.textContent = '保存设置';
        saveSettingsButton.onclick = saveSettings;
        buttonContainer.append(
            subtitleButton,
            searchSubtitleButton,
            searchSubtitle2Button,
            clearSubtitleButton,
            saveSettingsButton,
            subtitleInput
        );
        controlPanel.appendChild(buttonContainer);
        document.body.appendChild(controlPanel);
        setupSubtitleHandler(subtitleInput);
    }

    async function reloadSubtitleWithNewEncoding() {
        if (!currentSubtitleSource) return;
        showToast(`以 ${subtitleEncoding} 编码重新加载...`);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                originalSubtitleText = e.target.result;
                subtitles = await parseSRT(originalSubtitleText);
                subtitleElement.style.display = 'block';
                showToast('字幕已重新加载');
            };
            reader.onerror = () => {
                showToast('使用新编码重新加载失败');
            };
            reader.readAsText(currentSubtitleSource, subtitleEncoding);
        } catch (error) {
            showToast(`重新加载失败: ${error.message}`);
        }
    }
 
    function setupSubtitleHandler(inputElement) {
        subtitleElement = document.createElement('div');
        subtitleElement.className = 'custom-subtitle';
        subtitleElement.style.display = 'none';
        if (videoContainer) videoContainer.appendChild(subtitleElement);

        inputElement.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            currentSubtitleSource = file;
            await reloadSubtitleWithNewEncoding();
        });
    }
 
    async function parseSRT(text) {
        return text.replace(/\r/g, '').split(/\n\n+/).filter(Boolean).map(block => {
            const [id, time, ...textLines] = block.split('\n');
            const [start, end] = time.split(' --> ').map(parseTime);
            return {
                start: start + subtitleOffset,
                end: end + subtitleOffset,
                text: textLines.join('\n').trim()
            };
        });
    }
 
    function parseTime(timeStr) {
        const [hms, ms] = timeStr.split(/[,.]/);
        const [h, m, s] = hms.split(':');
        return (+h * 3600) + (+m * 60) + (+s) + (+ms / 1000);
    }
 
    function updateSubtitle() {
        if (!plyrInstance || !subtitles.length) return;
        const currentTime = unsafeWindow.player.currentTime;
        const sub = subtitles.find(s => currentTime >= s.start && currentTime <= s.end);
        subtitleElement.textContent = sub?.text || '';
        subtitleElement.style.display = sub ? 'block' : 'none';
    }
 
    function initPlayer() {
        const checkPlayer = setInterval(() => {
            const video = document.querySelector('video');
            if (video && unsafeWindow.player) {
                clearInterval(checkPlayer);
                plyrInstance = unsafeWindow.player;
                video.addEventListener('timeupdate', () => {
                    requestAnimationFrame(updateSubtitle);
                });
                setInterval(updateSubtitle, 250);
                showToast('播放器初始化完成');
            }
        }, 500);
    }
 
    function setupShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!plyrInstance) return;
            const key = e.key.toLowerCase();
            if (key === shortcutKeys.accelerate) {
                plyrInstance.speed = accelerationRate;
                isZKeyPressed = true;
            } else if (key === shortcutKeys.forward) {
                plyrInstance.currentTime += skipTime;
            } else if (key === shortcutKeys.backward) {
                plyrInstance.currentTime -= skipTime;
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() === shortcutKeys.accelerate && isZKeyPressed) {
                plyrInstance.speed = 1;
                isZKeyPressed = false;
            }
        });
    }
 
    function searchSubtitle() {
        const videoID = getCurrentVideoID();
        GM_openInTab(`https://subtitlecat.com/index.php?search=${encodeURIComponent(videoID)}`, { active: true });
    }
 
    function fetchSubtitleAPI(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "Cache-Control": "no-cache",
                    "Referer": location.href,
                    "Origin": location.origin,
                    "User-Agent": navigator.userAgent
                },
                timeout: 15000,
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) {
                        try {
                            resolve(JSON.parse(res.responseText));
                        } catch (e) {
                            reject(new Error('JSON解析失败'));
                        }
                    } else {
                        reject(new Error(`HTTP错误 ${res.status}`));
                    }
                },
                onerror: () => reject(new Error('网络错误')),
                ontimeout: () => reject(new Error('请求超时'))
            });
        });
    }
 
    async function searchSubtitle2() {
        try {
            const videoID = getCurrentVideoID();
            if (!videoID) return showToast('无法获取视频ID');
            showToast('正在搜索字幕...');
            const data = await fetchSubtitleAPI(`https://api-shoulei-ssl.xunlei.com/oracle/subtitle?name=${encodeURIComponent(videoID)}`);
            if (data.code === 0 && data.data && data.data.length > 0) {
                const srtItems = data.data.filter(item => item.url.includes('.srt'));
                if (srtItems.length > 0) {
                    showSubtitleList(srtItems);
                } else {
                    showToast('API返回结果中未找到.srt格式字幕');
                }
            } else {
                showToast('未找到匹配字幕');
            }
        } catch (e) {
            showToast(`错误: ${e.message}`);
        }
    }
 
    function showSubtitleList(items) {
        if (subtitleList) subtitleList.remove();
        subtitleList = document.createElement('div');
        subtitleList.className = 'subtitle-list';
        subtitleList.innerHTML = '<div style="color:#ccc; margin-bottom:8px;">选择字幕：</div>';
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'subtitle-item';
            div.textContent = `${item.name} (${item.extra_name})`;
            div.onclick = () => loadRemoteSubtitle(item.url);
            subtitleList.appendChild(div);
        });
        document.body.appendChild(subtitleList);
    }
 
    async function loadRemoteSubtitle(url) {
        showToast('正在加载字幕...');
        try {
            const blob = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: 'blob',
                    headers: {
                        "Referer": location.href,
                        "Origin": location.origin,
                        "User-Agent": navigator.userAgent
                    },
                    timeout: 15000,
                    onload: (res) => res.status === 200 ? resolve(res.response) : reject(new Error(`HTTP ${res.status}`)),
                    onerror: () => reject(new Error('网络错误')),
                    ontimeout: () => reject(new Error('请求超时'))
                });
            });
            currentSubtitleSource = blob;
            await reloadSubtitleWithNewEncoding();
            if (subtitleList) subtitleList.remove();
        } catch (e) {
            showToast(`字幕加载失败: ${e.message}`);
        }
    }
 
    function parseVideoIDFromURL(url) {
        try {
            const pathSegments = new URL(url, location.origin).pathname.split('/').filter(segment => segment.length > 0);
            if (pathSegments.length === 0) return '';
            const lastSegment = pathSegments[pathSegments.length - 1];
            if (/^[a-zA-Z0-9]+-[a-zA-Z0-9]+$/.test(lastSegment)) return lastSegment.toUpperCase();
            const idMatch = lastSegment.match(/([a-zA-Z]+-\d+|[a-zA-Z]+\d+-\d+|[a-zA-Z]+\d+[a-zA-Z]+-\d+)/i);
            if (idMatch && idMatch[1]) return idMatch[1].toUpperCase();
            const looseMatch = lastSegment.match(/([a-zA-Z0-9]+-[a-zA-Z0-9]+)/);
            if (looseMatch && looseMatch[1]) return looseMatch[1].toUpperCase();
            return lastSegment.toUpperCase();
        } catch (e) { return ''; }
    }

    function getCurrentVideoID() {
        return parseVideoIDFromURL(location.href);
    }

    function saveSettings() {
        localStorage.setItem('missavAccelerationRate', accelerationRate);
        localStorage.setItem('missavSkipTime', skipTime);
        localStorage.setItem('missavAccelerateKey', shortcutKeys.accelerate);
        localStorage.setItem('missavForwardKey', shortcutKeys.forward);
        localStorage.setItem('missavBackwardKey', shortcutKeys.backward);
        showToast('设置已保存');
    }
 
    function initListPage() {
        const buttonQueue = [];
        let isProcessing = false;

        const processQueue = () => {
            if (buttonQueue.length === 0) {
                isProcessing = false;
                return;
            }
            isProcessing = true;
            const button = buttonQueue.shift();

            // Programmatically trigger the handler if it's not already processing
            if (button && button.dataset.processing === 'false') {
                handleButtonClick(button); // No event object needed
            }

            // Schedule the next one
            setTimeout(processQueue, 100);
        };

        const handleButtonClick = async (button, event) => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            // Use a data attribute as a flag to prevent re-clicking while processing
            if (button.dataset.processing === 'true') return;
            button.dataset.processing = 'true';
            button.style.cursor = 'default';

            const videoID = button.dataset.videoId;
            if (!videoID) {
                button.textContent = 'ID错误';
                button.style.backgroundColor = '#dc3545';
                return;
            }

            try {
                const data = await fetchSubtitleAPI(`https://api-shoulei-ssl.xunlei.com/oracle/subtitle?name=${encodeURIComponent(videoID)}`);
                let result;
                if (data.code === 0 && data.data && data.data.length > 0 && data.data.some(item => item.url.includes('.srt'))) {
                    const srtCount = data.data.filter(item => item.url.includes('.srt')).length;
                    result = { text: `有字幕 (${srtCount})`, color: '#28a745' };
                } else {
                    result = { text: '无字幕', color: '#6c757d' };
                }
                button.textContent = result.text;
                button.style.backgroundColor = result.color;

                // Save to cache
                const cache = getCache();
                cache[videoID] = { ...result, timestamp: Date.now() };
                saveCache(cache);

            } catch (error) {
                button.textContent = '查询失败';
                button.style.backgroundColor = '#dc3545'; // Red
                console.error(`[Missav 字幕腳本] 字幕查詢失敗 for ID ${videoID}:`, error);
            }
        };

        const createAndQueueButton = (card) => {
            if (card.querySelector('.missav-subtitle-button')) return;

            const linkElement = card.querySelector('a');
            if (!linkElement) return;
            const videoID = parseVideoIDFromURL(linkElement.href);
            if (!videoID) return;

            const button = document.createElement('button');
            button.className = 'missav-subtitle-button';
            button.dataset.videoId = videoID;

            // Apply styles directly to the element to avoid being overridden
            button.style.cssText = `
                position: absolute !important;
                top: 8px !important;
                right: 8px !important;
                z-index: 10 !important;
                border: none !important;
                padding: 3px 7px !important;
                font-size: 12px !important;
                line-height: 1.2 !important;
                border-radius: 3px !important;
                opacity: 0.9 !important;
                display: inline-block !important;
                width: auto !important;
                height: auto !important;
                color: white !important;
                background-color: #007bff !important; /* Blue */
                cursor: default !important; /* Non-interactive appearance */
                pointer-events: auto !important; /* Ensure the button itself is clickable */
            `;

            // Check cache first
            const cache = getCache();
            const now = Date.now();
            const expirationMs = CACHE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
            const cachedEntry = cache[videoID];

            if (cachedEntry && (now - cachedEntry.timestamp < expirationMs)) {
                // Cache hit: create final button and do not queue
                button.textContent = cachedEntry.text;
                button.style.backgroundColor = cachedEntry.color;
                button.dataset.processing = 'true';

                let imageContainer;
                if (card.matches('.card')) { // Old structure
                    imageContainer = card.querySelector('.card-img-top');
                    if (imageContainer) {
                        imageContainer.style.position = 'relative';
                        imageContainer.appendChild(button);
                    }
                } else { // New structure (.aspect-w-16)
                    imageContainer = card; // The card itself is the container
                    const wrapper = document.createElement('div');
                    wrapper.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5;`;
                    wrapper.appendChild(button);
                    imageContainer.appendChild(wrapper);
                }

                return;
            }

            // Cache miss: create "querying" button and queue it
            button.textContent = '查询中...';
            button.dataset.processing = 'false';
            button.onclick = (e) => handleButtonClick(button, e);

            let imageContainer;
            if (card.matches('.card')) { // Old structure
                imageContainer = card.querySelector('.card-img-top');
                if (imageContainer) {
                    imageContainer.style.position = 'relative';
                    imageContainer.appendChild(button);
                }
            } else { // New structure (.aspect-w-16)
                imageContainer = card; // The card itself is the container
                const wrapper = document.createElement('div');
                wrapper.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5;`;
                wrapper.appendChild(button);
                imageContainer.appendChild(wrapper);
            }

            // Add to queue for automatic processing
            if (button.dataset.processing === 'false') {
                buttonQueue.push(button);
                if (!isProcessing) {
                    processQueue();
                }
            }
        };

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    const newCards = (node.matches(VIDEO_CARD_SELECTOR) ? [node] : node.querySelectorAll(VIDEO_CARD_SELECTOR));
                    if (newCards.length > 0) {
                        newCards.forEach(createAndQueueButton);
                    }
                }
            }));
        });

        console.log('[Missav 字幕腳本] 開始自動查詢字幕...');
        document.querySelectorAll(VIDEO_CARD_SELECTOR).forEach(createAndQueueButton);

        // Start observing for dynamically added cards (e.g., infinite scroll)
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 99999;
            animation: fadeIn 0.3s;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
 
    function initPlayerPage() {
        // The main function's check guarantees the container exists.
        videoContainer = document.querySelector('.plyr__video-wrapper');
        createControlPanel();
        setupShortcuts();
        initPlayer();
    }

    (function main() {
        cleanupCache();

        console.log('[Missav 字幕腳本] 腳本已啟動, 開始偵測頁面元素...');

        let playerPageInitialized = false;
        let listPageInitialized = false;
        let attempts = 0;
        const maxAttempts = 20; // Wait for max 10 seconds

        const detectInterval = setInterval(() => {
            attempts++;

            // Check for player, but only initialize once.
            if (!playerPageInitialized && document.querySelector('.plyr__video-wrapper')) {
                playerPageInitialized = true;
                console.log('[Missav 字幕腳本] 偵測到【播放器】，初始化播放器功能。');
                initPlayerPage();
            }

            // Check for list, but only initialize once.
            if (!listPageInitialized && document.querySelector(VIDEO_CARD_SELECTOR)) {
                listPageInitialized = true;
                console.log('[Missav 字幕腳本] 偵測到【影片列表】，初始化縮圖查詢功能。');
                initListPage();
            }

            // Stop condition: if time runs out.
            if (attempts >= maxAttempts) {
                clearInterval(detectInterval);
                if (!playerPageInitialized && !listPageInitialized) {
                     console.warn(`[Missav 字幕腳本] 10秒後仍無法偵測到任何可操作元素 (播放器或列表)。腳本可能需要更新選擇器 (目前為 "${VIDEO_CARD_SELECTOR}")。`);
                }
            }
        }, 500);
    })();
})();
