// ==UserScript==
// @name            YouTube 守門員
// @namespace       http://tampermonkey.net/
// @version         0.1-optimized
// @description     Adds block/whitelist buttons and a tabbed management UI for YouTube channels, with video duration filtering and export/import functionality.
// @author          MayoHu
// @match           https://www.youtube.com/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @run-at          document-end
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/547729/YouTube%20%E5%AE%88%E9%96%80%E5%93%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/547729/YouTube%20%E5%AE%88%E9%96%80%E5%93%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper functions for GM_storage
    const getBlockedChannels = () => GM_getValue('blocked_channels', []);
    const getWhitelistedChannels = () => GM_getValue('whitelisted_channels', []);
    const getKeywords = () => GM_getValue('blocked_keywords', []);
    const getWhitelistMode = () => GM_getValue('whitelist_mode', false);
    const getMinDuration = () => GM_getValue('min_duration', 30);
    const getDurationFilterEnabled = () => GM_getValue('duration_filter_enabled', false);

    const setWhitelistMode = (mode) => GM_setValue('whitelist_mode', mode);
    const setMinDuration = (duration) => GM_setValue('min_duration', duration);
    const setDurationFilterEnabled = (enabled) => GM_setValue('duration_filter_enabled', enabled);

    const addBlockedChannel = (channelId, channelName) => {
        const blocked = getBlockedChannels();
        if (!blocked.some(c => c.id === channelId)) {
            blocked.push({ id: channelId, name: channelName });
            GM_setValue('blocked_channels', blocked);
            return true;
        }
        return false;
    };

    const removeBlockedChannel = (channelId) => {
        const blocked = getBlockedChannels().filter(c => c.id !== channelId);
        GM_setValue('blocked_channels', blocked);
    };

    const addWhitelistedChannel = (channelId, channelName) => {
        const whitelisted = getWhitelistedChannels();
        if (!whitelisted.some(c => c.id === channelId)) {
            whitelisted.push({ id: channelId, name: channelName });
            GM_setValue('whitelisted_channels', whitelisted);
            return true;
        }
        return false;
    };

    const removeWhitelistedChannel = (channelId) => {
        const whitelisted = getWhitelistedChannels().filter(c => c.id !== channelId);
        GM_setValue('whitelisted_channels', whitelisted);
    };

    const addBlockedKeyword = (keyword) => {
        const keywords = getKeywords();
        if (!keywords.includes(keyword)) {
            keywords.push(keyword);
            GM_setValue('blocked_keywords', keywords);
            return true;
        }
        return false;
    };

    const removeBlockedKeyword = (keyword) => {
        const keywords = getKeywords().filter(k => k !== keyword);
        GM_setValue('blocked_keywords', keywords);
    };

    // UI creation and management
    function createManagementUI() {
        if (document.getElementById('block-channel-ui')) {
            return;
        }

        const ui = document.createElement('div');
        ui.id = 'block-channel-ui';
        ui.style.cssText = `
            position: fixed;
            top: 56px;
            right: 20px;
            width: 700px;
            max-width: 90%;
            max-height: 90vh;
            background-color: white;
            color: black;
            border: 1px solid #ccc;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            display: none;
            flex-direction: column;
            border-radius: 8px;
            padding: 20px;
            font-family: 'Arial', sans-serif;
            font-size: 16px;
        `;

        ui.innerHTML = `
            <style>
                #block-channel-ui h2 { font-size: 20px; margin-bottom: 10px; }
                #block-channel-ui p { font-size: 16px; }
                #block-channel-ui a { color: black; text-decoration: none; }
                #block-channel-ui button {
                    background-color: #f2f2f2;
                    border: 1px solid #ccc;
                    padding: 10px 14px;
                    cursor: pointer;
                    border-radius: 4px;
                    margin: 4px;
                    color: black;
                    font-size: 16px;
                }
                #block-channel-ui button:hover {
                    background-color: #e6e6e6;
                }
                #block-channel-ui input[type="text"], #block-channel-ui input[type="number"] {
                    border: 1px solid #ccc;
                    padding: 8px;
                    border-radius: 4px;
                    font-size: 16px;
                }
                #block-channel-ui .tab-buttons {
                    display: flex;
                    border-bottom: 1px solid #ccc;
                    margin-bottom: 15px;
                }
                #block-channel-ui .tab-button {
                    background: none;
                    border: none;
                    padding: 10px 15px;
                    cursor: pointer;
                    font-size: 16px;
                    color: #555;
                    border-bottom: 2px solid transparent;
                }
                #block-channel-ui .tab-button.active {
                    color: #000;
                    border-bottom: 2px solid #337ab7;
                }
                #block-channel-ui .tab-content {
                    display: none;
                    overflow-y: auto;
                    flex-grow: 1;
                    padding-right: 8px;
                }
                #block-channel-ui .tab-content.active {
                    display: block;
                }
                #block-channel-ui .list-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #eee;
                }
                #block-channel-ui .list-item:last-child {
                    border-bottom: none;
                }
                #block-channel-ui .list-item .remove-btn {
                    background-color: #d9534f;
                    color: white;
                    padding: 6px 10px;
                    margin: 0;
                }
                #block-channel-ui .list-item .remove-btn:hover {
                    background-color: #c9302c;
                }
                #block-channel-ui .item-text {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    flex-grow: 1;
                    margin-right: 8px;
                    font-size: 16px;
                }
                #block-channel-ui .mode-toggle {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 10px 0;
                    font-size: 16px;
                }
                #block-channel-ui .slider {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 20px;
                }
                #block-channel-ui .slider input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                #block-channel-ui .slider-round {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 20px;
                }
                #block-channel-ui .slider-round:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 2px;
                    bottom: 2px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                #block-channel-ui input:checked + .slider-round {
                    background-color: #337ab7;
                }
                #block-channel-ui input:checked + .slider-round:before {
                    transform: translateX(20px);
                }
                #block-channel-ui .export-import-container {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }
                #block-channel-ui .export-import-container button {
                    flex: 1;
                }
                .channel-name-long {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: calc(100% - 100px);
                }
                #channel-lists-container {
                    display: flex;
                    gap: 20px;
                }
                #blocked-channels-section, #whitelisted-channels-section {
                    flex: 1;
                    min-width: 0;
                }
                #blocked-channels-list, #whitelisted-channels-list, #blocked-keywords-list {
                    max-height: 250px;
                    overflow-y: auto;
                    padding-right: 8px;
                }
                .keyword-tag {
                    display: inline-flex;
                    align-items: center;
                    background-color: #f2f2f2;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding: 6px 10px;
                    font-size: 16px;
                    color: black;
                    margin-bottom: 10px;
                    margin-right: 10px;
                }
                .keyword-tag-remove {
                    margin-left: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    color: #555;
                    background: none;
                    border: none;
                    font-size: 18px;
                    line-height: 1;
                }
            </style>
            <h2>YouTube 內容管理</h2>
            <div class="tab-buttons">
                <button class="tab-button active" data-tab="channel-management">頻道管理</button>
                <button class="tab-button" data-tab="blocked-keywords">關鍵字過濾</button>
                <button class="tab-button" data-tab="version-info">版本說明</button>
            </div>

            <div id="channel-management" class="tab-content active">
                <div class="mode-toggle">
                    <span>白名單模式 (僅顯示白名單頻道)</span>
                    <label class="slider">
                        <input type="checkbox" id="whitelist-mode-toggle">
                        <span class="slider-round"></span>
                    </label>
                </div>
                <div class="mode-toggle">
                    <span>啟用影片時長過濾</span>
                    <label class="slider">
                        <input type="checkbox" id="duration-filter-toggle">
                        <span class="slider-round"></span>
                    </label>
                </div>
                <div style="margin: 10px 0;">
                    <label for="min-duration-input">最低時長 (秒):</label>
                    <input type="number" id="min-duration-input" value="30" min="0" style="width: 80px;">
                </div>
                <div id="channel-lists-container">
                    <div id="blocked-channels-section">
                        <p id="blocked-channels-title">以下是您已封鎖的頻道：(共<span id="blocked-count">0</span>)</p>
                        <div id="blocked-channels-list"></div>
                    </div>
                    <div id="whitelisted-channels-section">
                        <p id="whitelisted-channels-title">以下是您已列入白名單的頻道：(共<span id="whitelisted-count">0</span>)</p>
                        <div id="whitelisted-channels-list"></div>
                    </div>
                </div>
                <div class="export-import-container">
                    <button id="export-channels-btn">匯出頻道名單</button>
                    <button id="import-channels-btn">匯入頻道名單</button>
                </div>
                <input type="file" id="import-channels-file-input" style="display: none;">
            </div>

            <div id="blocked-keywords" class="tab-content">
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <input type="text" id="keyword-input" placeholder="輸入要封鎖的關鍵字..." style="flex-grow: 1;">
                    <button id="add-keyword-btn">新增</button>
                </div>
                <div id="blocked-keywords-list-container">
                    <div id="blocked-keywords-list"></div>
                </div>
                <div class="export-import-container">
                    <button id="export-keywords-btn">匯出關鍵字名單</button>
                    <button id="import-keywords-btn">匯入關鍵字名單</button>
                </div>
                <input type="file" id="import-keywords-file-input" style="display: none;">
            </div>

            <div id="version-info" class="tab-content">
                <p>腳本版本：v40.23-optimized</p>
                <p>本次更新內容：</p>
                <ul>
                    <li>**按鈕顯示優化**：擴展 DOM 選擇器以支援更多 YouTube 頁面結構，包括 yt-lockup-view-model 和 ytd-rich-item-renderer 變體。</li>
                    <li>**頻道識別 fallback**：當無法獲取 channelId 時，使用 channelName 作為備用標識符進行封鎖/白名單操作。</li>
                    <li>**UI 微調**：改進版本說明顯示。</li>
                </ul>
            </div>
        `;

        document.body.appendChild(ui);
        setupUIEventHandlers();
        refreshUI();
    }

    function setupUIEventHandlers() {
        const ui = document.getElementById('block-channel-ui');
        if (!ui) return;

        ui.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                ui.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                ui.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(tab).classList.add('active');
                refreshUI();
            });
        });

        const whitelistToggle = document.getElementById('whitelist-mode-toggle');
        if (whitelistToggle) {
            whitelistToggle.addEventListener('change', (e) => {
                setWhitelistMode(e.target.checked);
                hideBlockedContent();
            });
        }

        const durationToggle = document.getElementById('duration-filter-toggle');
        if (durationToggle) {
            durationToggle.addEventListener('change', (e) => {
                setDurationFilterEnabled(e.target.checked);
                hideBlockedContent();
            });
        }

        const minDurationInput = document.getElementById('min-duration-input');
        if (minDurationInput) {
            minDurationInput.addEventListener('change', (e) => {
                setMinDuration(parseInt(e.target.value, 10));
                hideBlockedContent();
            });
        }

        const addKeywordBtn = document.getElementById('add-keyword-btn');
        if (addKeywordBtn) {
            addKeywordBtn.addEventListener('click', () => {
                const keywordInput = document.getElementById('keyword-input');
                const keyword = keywordInput.value.trim();
                if (keyword && addBlockedKeyword(keyword)) {
                    keywordInput.value = '';
                    refreshUI();
                    hideBlockedContent();
                }
            });
        }

        const exportChannelsBtn = document.getElementById('export-channels-btn');
        if (exportChannelsBtn) {
            exportChannelsBtn.addEventListener('click', exportChannelsData);
        }

        const importChannelsBtn = document.getElementById('import-channels-btn');
        if (importChannelsBtn) {
            importChannelsBtn.addEventListener('click', () => {
                document.getElementById('import-channels-file-input').click();
            });
        }

        const importChannelsFile = document.getElementById('import-channels-file-input');
        if (importChannelsFile) {
            importChannelsFile.addEventListener('change', importChannelsData);
        }

        const exportKeywordsBtn = document.getElementById('export-keywords-btn');
        if (exportKeywordsBtn) {
            exportKeywordsBtn.addEventListener('click', exportKeywordsData);
        }

        const importKeywordsBtn = document.getElementById('import-keywords-btn');
        if (importKeywordsBtn) {
            importKeywordsBtn.addEventListener('click', () => {
                document.getElementById('import-keywords-file-input').click();
            });
        }

        const importKeywordsFile = document.getElementById('import-keywords-file-input');
        if (importKeywordsFile) {
            importKeywordsFile.addEventListener('change', importKeywordsData);
        }
    }

    function refreshUI() {
        const blockedChannels = getBlockedChannels();
        const whitelistedChannels = getWhitelistedChannels();
        const blockedKeywords = getKeywords();

        const blockedCountEl = document.getElementById('blocked-count');
        const whitelistedCountEl = document.getElementById('whitelisted-count');
        const blockedListEl = document.getElementById('blocked-channels-list');
        const whitelistedListEl = document.getElementById('whitelisted-channels-list');
        const keywordListEl = document.getElementById('blocked-keywords-list');

        if (blockedCountEl) blockedCountEl.textContent = blockedChannels.length;
        if (whitelistedCountEl) whitelistedCountEl.textContent = whitelistedChannels.length;

        if (blockedListEl) {
            blockedListEl.innerHTML = '';
            blockedChannels.forEach(c => {
                const div = document.createElement('div');
                div.className = 'list-item';
                div.innerHTML = `<span class="item-text"><a href="/channel/${c.id}" target="_blank">${c.name}</a></span> <button class="remove-btn">移除</button>`;
                div.querySelector('.remove-btn').addEventListener('click', () => {
                    removeBlockedChannel(c.id);
                    refreshUI();
                    hideBlockedContent();
                });
                blockedListEl.appendChild(div);
            });
        }

        if (whitelistedListEl) {
            whitelistedListEl.innerHTML = '';
            whitelistedChannels.forEach(c => {
                const div = document.createElement('div');
                div.className = 'list-item';
                div.innerHTML = `<span class="item-text"><a href="/channel/${c.id}" target="_blank">${c.name}</a></span> <button class="remove-btn">移除</button>`;
                div.querySelector('.remove-btn').addEventListener('click', () => {
                    removeWhitelistedChannel(c.id);
                    refreshUI();
                    hideBlockedContent();
                });
                whitelistedListEl.appendChild(div);
            });
        }

        if (keywordListEl) {
            keywordListEl.innerHTML = '';
            blockedKeywords.forEach(k => {
                const span = document.createElement('span');
                span.className = 'keyword-tag';
                span.textContent = k;
                const removeBtn = document.createElement('button');
                removeBtn.textContent = '×';
                removeBtn.className = 'keyword-tag-remove';
                removeBtn.addEventListener('click', () => {
                    removeBlockedKeyword(k);
                    refreshUI();
                    hideBlockedContent();
                });
                span.appendChild(removeBtn);
                keywordListEl.appendChild(span);
            });
        }

        const whitelistToggle = document.getElementById('whitelist-mode-toggle');
        if(whitelistToggle) whitelistToggle.checked = getWhitelistMode();

        const durationToggle = document.getElementById('duration-filter-toggle');
        if(durationToggle) durationToggle.checked = getDurationFilterEnabled();

        const minDurationInput = document.getElementById('min-duration-input');
        if(minDurationInput) minDurationInput.value = getMinDuration();
    }

    function addUIButtons() {
        const endActions = document.querySelector('ytd-masthead #end');
        if (!endActions || document.getElementById('block-channel-manager-button')) {
            return;
        }

        const managerButton = document.createElement('button');
        managerButton.id = 'block-channel-manager-button';
        managerButton.textContent = '內容管理';
        managerButton.style.cssText = `
            background-color: #f2f2f2;
            border: 1px solid #ccc;
            color: black;
            padding: 8px 12px;
            border-radius: 4px;
            font-weight: 500;
            cursor: pointer;
            margin-right: 12px;
        `;
        managerButton.addEventListener('click', () => {
            const ui = document.getElementById('block-channel-ui');
            if (ui.style.display === 'none') {
                ui.style.display = 'flex';
                refreshUI();
            } else {
                ui.style.display = 'none';
            }
        });
        endActions.insertBefore(managerButton, endActions.firstChild);
    }

    function hideBlockedContent() {
        const blockedChannels = getBlockedChannels();
        const whitelistedChannels = getWhitelistedChannels();
        const blockedKeywords = getKeywords().map(k => k.toLowerCase());
        const whitelistMode = getWhitelistMode();
        const durationFilterEnabled = getDurationFilterEnabled();
        const minDuration = getMinDuration();

        const items = document.querySelectorAll('ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-video-renderer, ytd-playlist-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model, ytd-reel-item-renderer, ytd-rich-grid-media');
        items.forEach(item => {
            let shouldHide = false;
            let channelId = null;
            let channelName = null;
            let title = null;
            let duration = null;

            const channelElement = item.querySelector('yt-lockup-metadata-view-model .yt-content-metadata-view-model__metadata-row span, #channel-name a, ytd-channel-name a, .ytd-channel-name a, yt-formatted-string[channel-name], #channel-title, .yt-lockup-metadata-view-model__metadata-row a');
            if (channelElement) {
                channelName = channelElement.textContent.trim();
                let channelUrl = channelElement.href;
                if (!channelUrl && channelElement.parentElement && channelElement.parentElement.tagName === 'A') {
                    channelUrl = channelElement.parentElement.href;
                }
                if (channelUrl) {
                    const match = channelUrl.match(/(@[a-zA-Z0-9_-]+|channel\/[a-zA-Z0-9_-]+)/);
                    if (match) {
                        channelId = match[0];
                    }
                }
            }

            const titleElement = item.querySelector('#video-title, #video-title-link, .yt-lockup-metadata-view-model__title, #video-title-text, a#video-title, span.title, yt-formatted-string.ytd-rich-grid-media');
            if (titleElement) {
                title = titleElement.textContent.trim().toLowerCase();
            }

            const durationElement = item.querySelector('ytd-thumbnail-overlay-time-status-renderer, span.ytd-thumbnail-overlay-time-status-renderer, .yt-badge-shape__text, yt-formatted-string.ytd-thumbnail-overlay-time-status-renderer');
            if (durationElement) {
                duration = parseDuration(durationElement.textContent.trim());
            }

            if (!channelId && !channelName && item.getAttribute('is-live-stream') === 'true') {
                return;
            }

            let isBlocked = false;
            let isWhitelisted = false;

            if (channelId) {
                isBlocked = blockedChannels.some(c => c.id === channelId);
                isWhitelisted = whitelistedChannels.some(c => c.id === channelId);
            }

            if ((!isBlocked || !isWhitelisted) && channelName) {
                isBlocked = isBlocked || blockedChannels.some(c => c.name === channelName);
                isWhitelisted = isWhitelisted || whitelistedChannels.some(c => c.name === channelName);
            }

            if (whitelistMode) {
                shouldHide = !isWhitelisted;
            } else {
                shouldHide = isBlocked || (title && blockedKeywords.some(keyword => title.includes(keyword)));
            }

            if (durationFilterEnabled && duration !== null && duration < minDuration) {
                shouldHide = true;
            }

            if (isWhitelisted) {
                shouldHide = false;
            }

            item.style.display = shouldHide ? 'none' : '';
        });
    }

    function addActionButtons(item) {
        if (item.querySelector('.block-channel-btn') || item.querySelector('.whitelist-channel-btn')) {
            return;
        }

        let channelLink = null;
        let channelName = null;
        let insertPoint = null;

        const selectors = [
            '#byline-container',
            '#channel-name',
            '.yt-lockup-metadata-view-model__text-container',
            '.yt-content-metadata-view-model',
            '.yt-lockup-metadata-view-model__metadata',
            '#meta',
            '#info',
            '.ytd-video-meta-block',
            '.yt-lockup-metadata-view-model',
            'yt-lockup-metadata-view-model'
        ];

        for (const selector of selectors) {
            const container = item.querySelector(selector);
            if (container) {
                channelLink = container.querySelector('a[href*="/@"], a[href*="/channel/"], a[href*="/user/"], .yt-content-metadata-view-model__metadata-row a');
                if (!channelLink) {
                    const nameSpan = container.querySelector('.yt-content-metadata-view-model__metadata-row span, yt-formatted-string');
                    if (nameSpan) {
                        channelName = nameSpan.textContent.trim();
                        channelLink = nameSpan; // Use as placeholder
                    }
                }
                if (channelLink || channelName) {
                    insertPoint = container;
                    break;
                }
            }
        }

        if (!channelLink && !channelName) {
            return;
        }

        if (!channelName) {
            channelName = channelLink.textContent.trim();
        }

        let channelId = null;
        let channelUrl = channelLink.href;
        if (!channelUrl && channelLink.parentElement && channelLink.parentElement.tagName === 'A') {
            channelUrl = channelLink.parentElement.href;
        }
        if (channelUrl) {
            const match = channelUrl.match(/(@[a-zA-Z0-9_-]+|channel\/[a-zA-Z0-9_-]+)/);
            if (match) {
                channelId = match[0];
            }
        }

        if (!channelId) {
            channelId = channelName; // Fallback to name if no ID found
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: inline-flex;
            flex-wrap: nowrap;
            gap: 4px;
            font-size: 12px;
            margin-left: 8px;
        `;

        const blockBtn = document.createElement('button');
        blockBtn.textContent = '封鎖';
        blockBtn.className = 'block-channel-btn';
        blockBtn.style.cssText = `
            background-color: #f2f2f2;
            border: 1px solid #ccc;
            color: black;
            padding: 2px 6px;
            border-radius: 4px;
            cursor: pointer;
        `;

        const whitelistBtn = document.createElement('button');
        whitelistBtn.textContent = '白名單';
        whitelistBtn.className = 'whitelist-channel-btn';
        whitelistBtn.style.cssText = `
            background-color: #f2f2f2;
            border: 1px solid #ccc;
            color: black;
            padding: 2px 6px;
            border-radius: 4px;
            cursor: pointer;
        `;

        blockBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (addBlockedChannel(channelId, channelName)) {
                buttonContainer.style.display = 'none';
                hideBlockedContent();
            }
        });

        whitelistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (addWhitelistedChannel(channelId, channelName)) {
                buttonContainer.style.display = 'none';
                hideBlockedContent();
            }
        });

        buttonContainer.appendChild(blockBtn);
        buttonContainer.appendChild(whitelistBtn);
        insertPoint.appendChild(buttonContainer);
    }

    function parseDuration(durationStr) {
        if (!durationStr) return null;
        let parts = durationStr.split(':').map(Number);
        let duration = 0;
        if (parts.length === 3) {
            duration = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            duration = parts[0] * 60 + parts[1];
        } else if (parts.length === 1) {
            duration = parts[0];
        }
        return duration;
    }

    function exportData(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        a.href = url;
        a.download = `${filename}_${year}_${month}_${day}_${hour}_${minute}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('資料已匯出！');
    }

    function importData(event, key) {
        const file = event.target.files[0];
        if (!file) {
             alert('匯入失敗：沒有選擇檔案。');
             return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (key === 'channels') {
                    if (!data.blocked_channels || !data.whitelisted_channels) {
                        throw new Error('Invalid channels file format.');
                    }
                    GM_setValue('blocked_channels', data.blocked_channels);
                    GM_setValue('whitelisted_channels', data.whitelisted_channels);
                } else if (key === 'keywords') {
                    if (!Array.isArray(data)) {
                        throw new Error('Invalid keywords file format.');
                    }
                    GM_setValue('blocked_keywords', data);
                }

                alert('資料已成功匯入！');
                refreshUI();
                hideBlockedContent();
            } catch (error) {
                alert('匯入失敗，請確認檔案格式是否正確。');
                console.error('Import failed:', error);
            }
        };
        reader.readAsText(file);
    }

    function exportChannelsData() {
        const data = {
            blocked_channels: getBlockedChannels(),
            whitelisted_channels: getWhitelistedChannels()
        };
        exportData(data, 'youtube_channels');
    }

    function importChannelsData(event) {
        importData(event, 'channels');
    }

    function exportKeywordsData() {
        const data = getKeywords();
        exportData(data, 'youtube_keywords');
    }

    function importKeywordsData(event) {
        importData(event, 'keywords');
    }

    // Main execution function
    function initializeScript() {
        const observer = new MutationObserver(() => {
            const items = document.querySelectorAll('ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-video-renderer, ytd-playlist-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model, ytd-reel-item-renderer, ytd-rich-grid-media');
            items.forEach(item => {
                addActionButtons(item);
            });
            hideBlockedContent();
        });

        // Use a more specific observer to improve performance
        const mainContent = document.querySelector('ytd-page-manager');
        if (mainContent) {
             observer.observe(mainContent, { childList: true, subtree: true });
        } else {
             observer.observe(document.body, { childList: true, subtree: true });
        }

        // Initial setup
        createManagementUI();
        addUIButtons();
    }

    // Run the script
    initializeScript();
})();