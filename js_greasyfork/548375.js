// ==UserScript==
// @name        YouTube Volume Booster 600% Enhanced
// @name:vi     YouTube - Tăng Âm Lượng 600% Nâng Cao
// @namespace   http://tampermonkey.net/
// @version     4.2.4
// @description Enhanced volume booster with closable panel, zoom feature, and improved stability - Fixed drag jump issue
// @description:vi Tăng âm lượng nâng cao với panel có thể đóng, zoom, và ổn định hơn - Đã sửa lỗi giật khi kéo
// @author      Gemini & Developer
// @match       *://*.youtube.com/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/548375/YouTube%20Volume%20Booster%20600%25%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/548375/YouTube%20Volume%20Booster%20600%25%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- GLOBAL VARIABLES AND SETTINGS ---
    let audioContext, gainNode, sourceNode;
    let currentVideoElement = null;
    let currentVideoId = null;
    let previousVideoId = null;
    let currentTabVolume = 100;
    let tabId = null;

    // Feature states
    let isGlobalVolumeEnabled = false;
    let isRememberPerVideoEnabled = false;
    let isOneTimeRestoreEnabled = true;
    let isPanelVisible = true;
    let currentScale = 1.0;

    let currentLanguage = 'en';

    // Variables for draggable toolbar position
    let isDragging = false;
    let dragOffsetX, dragOffsetY;
    const STORAGE_KEY_TOOLBAR_POSITION = 'youtubeBoosterToolbarPosition';
    const STORAGE_KEY_TOOLBAR_SCALE = 'youtubeBoosterToolbarScale';
    const STORAGE_KEY_PANEL_VISIBILITY = 'youtubeBoosterPanelVisibility';

    const translations = {
        'vi': {
            globalVolumeTitle: 'Âm lượng toàn tab',
            globalVolumeEnabled: 'Âm lượng toàn tab: Đã bật',
            globalVolumeDisabled: 'Âm lượng toàn tab: Đã tắt',
            rememberPerVideoTitle: 'Ghi nhớ từng video',
            rememberPerVideoEnabled: 'Ghi nhớ từng video: Đã bật',
            rememberPerVideoDisabled: 'Ghi nhớ từng video: Đã tắt',
            savePerVideoTitle: 'Lưu âm lượng cho video này',
            savePerVideoEnabledHint: 'Lưu âm lượng cho video này',
            savePerVideoDisabledHint: 'Chỉ hoạt động khi "Ghi nhớ từng video" bật',
            oneTimeRestoreTitle: 'Khôi phục một lần',
            oneTimeRestoreEnabled: 'Khôi phục một lần: Đã bật',
            oneTimeRestoreDisabled: 'Khôi phục một lần: Đã tắt',
            languageToggleTitle: 'Ngôn ngữ',
            languageToggleHint: 'Chuyển đổi ngôn ngữ',
            savePositionTitle: 'Lưu vị trí & kích thước',
            savePositionHint: 'Lưu vị trí và kích thước hiện tại',
            closePanel: 'Đóng panel (Ctrl+Shift+V để bật lại)',
            clearManualStorageTitle: "Xóa bộ nhớ 'Ghi nhớ từng video'",
            confirmClear: "Bạn có chắc chắn muốn xóa tất cả dữ liệu không?",
            clearManualStorageSuccess: "Đã xóa dữ liệu thành công",
            clearPositionStorageTitle: "Xóa bộ nhớ vị trí toolbar",
            confirmClearPosition: "Xóa vị trí toolbar đã lưu?",
            clearPositionStorageSuccess: "Đã xóa bộ nhớ vị trí",
            zoomHint: 'Di chuột vào viền + cuộn chuột để thu phóng (0.5x-2.0x)',
            showPanelTitle: 'Hiện panel Volume Booster',
            panelShown: 'Panel đã được hiển thị'
        },
        'en': {
            globalVolumeTitle: 'Global Volume',
            globalVolumeEnabled: 'Global Volume: Enabled',
            globalVolumeDisabled: 'Global Volume: Disabled',
            rememberPerVideoTitle: 'Remember Per Video',
            rememberPerVideoEnabled: 'Remember Per Video: Enabled',
            rememberPerVideoDisabled: 'Remember Per Video: Disabled',
            savePerVideoTitle: 'Save volume for this video',
            savePerVideoEnabledHint: 'Save volume for this video',
            savePerVideoDisabledHint: 'Only active when "Remember Per Video" is on',
            oneTimeRestoreTitle: 'One-Time Restore',
            oneTimeRestoreEnabled: 'One-Time Restore: Enabled',
            oneTimeRestoreDisabled: 'One-Time Restore: Disabled',
            languageToggleTitle: 'Language',
            languageToggleHint: 'Switch language',
            savePositionTitle: 'Save position & size',
            savePositionHint: 'Save current position and size',
            closePanel: 'Close panel (Ctrl+Shift+V to reopen)',
            clearManualStorageTitle: "Clear 'Remember Per Video' Storage",
            confirmClear: "Are you sure you want to delete all data?",
            clearManualStorageSuccess: "Data cleared successfully",
            clearPositionStorageTitle: "Clear toolbar position storage",
            confirmClearPosition: "Clear saved toolbar position?",
            clearPositionStorageSuccess: "Position storage cleared",
            zoomHint: 'Hover on edge + scroll wheel to zoom (0.5x-2.0x)',
            showPanelTitle: 'Show Volume Booster Panel',
            panelShown: 'Panel is now visible'
        }
    };

    // Storage keys
    const STORAGE_KEY_PER_VIDEO = 'youtubeVolumeSettings_v2';
    const STORAGE_KEY_GLOBAL_FEATURE_STATE = 'youtubeGlobalVolumeFeatureState_v2';
    const STORAGE_KEY_PER_VIDEO_FEATURE_STATE = 'youtubePerVideoFeatureState_v2';
    const STORAGE_KEY_ONE_TIME_RESTORE_FEATURE_STATE = 'youtubeOneTimeRestoreFeatureState_v1';
    const STORAGE_KEY_TAB_VOLUME_PREFIX = 'youtubeGlobalVolumePerTab_v2_';
    const STORAGE_KEY_LANGUAGE = 'youtubeBoosterLanguage_v1';
    const STORAGE_KEY_ONE_TIME_RESTORE_VOLUMES = 'youtubeRestoreVolume_v3_videoId_map';

    const SESSION_STORAGE_TAB_ID_KEY = 'youtubeBoosterTabId_v2';
    const SESSION_STORAGE_ONE_TIME_PROCESSED_KEY_PREFIX = 'youtubeBoosterOneTimeProcessed_';

    let initializeTimeout = null;
    const DEBOUNCE_DELAY = 100;

    // --- ENHANCED CSS WITH LARGER SLIDER AND CLOSER ICONS ---
    GM_addStyle(`
        #volume-booster-container-abs {
            position: absolute;
            z-index: 10000;
            background: linear-gradient(135deg, rgba(30, 30, 35, 0.95) 0%, rgba(20, 20, 25, 0.95) 100%);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            padding: 8px 12px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
            opacity: 0;
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            cursor: grab;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
                        0 2px 8px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.08);
            transform-origin: bottom right;
            user-select: none;
            will-change: transform, opacity;
        }

        #volume-booster-container-abs.hidden {
            display: none !important;
        }

        #volume-booster-container-abs.dragging {
            cursor: grabbing;
            transition: none;
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6),
                        0 4px 16px rgba(0, 0, 0, 0.3);
        }

        #volume-booster-container-abs.zoom-hover {
            transform: scale(1.15);
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5),
                        0 4px 16px rgba(0, 0, 0, 0.3);
            cursor: ns-resize;
        }

        #volume-booster-container-abs.zoom-hover::after {
            content: '🔍';
            position: absolute;
            top: -25px;
            right: -25px;
            font-size: 18px;
            opacity: 0.8;
            animation: pulse 1s ease-in-out infinite;
            pointer-events: none;
        }

        #volume-booster-container-abs.zoom-hover::before {
            content: attr(data-zoom-hint);
            position: absolute;
            bottom: calc(100% + 12px);
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            animation: fadeInTooltip 0.3s ease-in-out 0.5s forwards;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            z-index: 10001;
        }

        @keyframes fadeInTooltip {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(5px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }

        #movie_player:not(.ytp-autohide) #volume-booster-container-abs {
            opacity: 1;
            pointer-events: auto;
        }

        .volume-booster-close-btn {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 22px;
            height: 22px;
            background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(255, 0, 0, 0.4);
            transition: all 0.2s ease;
            border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .volume-booster-close-btn:hover {
            transform: scale(1.15) rotate(90deg);
            background: linear-gradient(135deg, #ff6666 0%, #ff0000 100%);
            box-shadow: 0 4px 12px rgba(255, 0, 0, 0.6);
        }

        .volume-booster-close-btn::before,
        .volume-booster-close-btn::after {
            content: '';
            position: absolute;
            width: 12px;
            height: 2px;
            background: white;
            border-radius: 1px;
        }

        .volume-booster-close-btn::before {
            transform: rotate(45deg);
        }

        .volume-booster-close-btn::after {
            transform: rotate(-45deg);
        }

        .volume-booster-slider-abs {
            -webkit-appearance: none;
            appearance: none;
            width: 150px;
            height: 8px;
            background: linear-gradient(to right,
                rgba(100, 100, 100, 0.3) 0%,
                rgba(100, 100, 100, 0.5) 100%);
            outline: none;
            cursor: pointer;
            border-radius: 4px;
            margin: 0;
            position: relative;
        }

        .volume-booster-slider-abs::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #ff3333 0%, #ff0000 100%);
            cursor: pointer;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(255, 0, 0, 0.5),
                        0 0 0 4px rgba(255, 0, 0, 0.1);
            transition: all 0.2s ease;
        }

        .volume-booster-slider-abs::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 3px 12px rgba(255, 0, 0, 0.6),
                        0 0 0 6px rgba(255, 0, 0, 0.15);
        }

        .volume-booster-slider-abs::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #ff3333 0%, #ff0000 100%);
            cursor: pointer;
            border-radius: 50%;
            border: none;
            box-shadow: 0 2px 8px rgba(255, 0, 0, 0.5);
        }

        .volume-booster-label-abs {
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            min-width: 50px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            text-align: right;
            letter-spacing: 0.5px;
        }

        .volume-booster-setting-icon {
            cursor: pointer;
            width: 32px;
            height: 32px;
            background-color: rgba(255, 255, 255, 0.7);
            mask-size: 22px;
            mask-repeat: no-repeat;
            mask-position: center;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 6px;
            padding: 5px;
            position: relative;
        }

        .volume-booster-setting-icon:hover {
            background-color: rgba(255, 255, 255, 0.9);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }

        .volume-booster-setting-icon.enabled {
            background-color: #4CAF50;
            box-shadow: 0 0 12px rgba(76, 175, 80, 0.5);
        }

        .volume-booster-setting-icon.enabled:hover {
            background-color: #66BB6A;
        }

        .volume-booster-setting-icon.clicked {
            animation: pulse 0.3s ease-in-out;
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 0.8;
            }
            50% {
                transform: scale(1.2);
                opacity: 1;
            }
        }

        .volume-booster-setting-icon.global-volume {
            mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>');
        }

        .volume-booster-setting-icon.per-video-toggle {
            mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>');
        }

        .volume-booster-setting-icon.save-per-video {
            mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>');
            opacity: 0.5;
            pointer-events: none;
        }

        .volume-booster-setting-icon.one-time-restore-toggle {
            mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1l-4 4 4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.01 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>');
        }

        .volume-booster-setting-icon.language-toggle {
            mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>');
        }

        .volume-booster-setting-icon.save-position {
            mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/></svg>');
        }
    `);

    // --- HELPER FUNCTIONS ---
    function getTabId() {
        let id = sessionStorage.getItem(SESSION_STORAGE_TAB_ID_KEY);
        if (!id) {
            id = crypto.randomUUID();
            sessionStorage.setItem(SESSION_STORAGE_TAB_ID_KEY, id);
        }
        return id;
    }

    function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }

    async function getVolumeSetting(videoId) {
        if (!videoId) return null;
        const allSettings = await GM_getValue(STORAGE_KEY_PER_VIDEO, {});
        return allSettings[videoId] !== undefined ? allSettings[videoId] : null;
    }

    async function saveVolumeSetting(videoId, volume) {
        if (!videoId) return;
        const allSettings = await GM_getValue(STORAGE_KEY_PER_VIDEO, {});
        if (volume === 100) {
            delete allSettings[videoId];
        } else {
            allSettings[videoId] = volume;
        }
        await GM_setValue(STORAGE_KEY_PER_VIDEO, allSettings);
    }

    async function getFeatureState(key, defaultValue = false) {
        return await GM_getValue(key, defaultValue);
    }

    async function saveFeatureState(key, state) {
        await GM_setValue(key, state);
    }

    async function saveOneTimeRestoreVolume(videoId, volume) {
        if (!videoId || !isOneTimeRestoreEnabled) return;
        let restoreData = await GM_getValue(STORAGE_KEY_ONE_TIME_RESTORE_VOLUMES, {});
        restoreData[videoId] = volume;
        await GM_setValue(STORAGE_KEY_ONE_TIME_RESTORE_VOLUMES, restoreData);
    }

    async function loadAndClearOneTimeRestoreVolume(videoId) {
        if (!videoId || !isOneTimeRestoreEnabled) return null;
        const oneTimeProcessedKey = SESSION_STORAGE_ONE_TIME_PROCESSED_KEY_PREFIX + videoId;
        if (sessionStorage.getItem(oneTimeProcessedKey)) return null;
        let restoreData = await GM_getValue(STORAGE_KEY_ONE_TIME_RESTORE_VOLUMES, {});
        let restoredVolume = restoreData[videoId];
        if (restoredVolume !== undefined) {
            sessionStorage.setItem(oneTimeProcessedKey, 'true');
            return restoredVolume;
        }
        return null;
    }

    async function clearOneTimeRestoreVolume(videoIdToClear) {
        if (!videoIdToClear) return;
        let restoreData = await GM_getValue(STORAGE_KEY_ONE_TIME_RESTORE_VOLUMES, {});
        if (restoreData.hasOwnProperty(videoIdToClear)) {
            delete restoreData[videoIdToClear];
            await GM_setValue(STORAGE_KEY_ONE_TIME_RESTORE_VOLUMES, restoreData);
        }
        sessionStorage.removeItem(SESSION_STORAGE_ONE_TIME_PROCESSED_KEY_PREFIX + videoIdToClear);
    }

    async function saveToolbarPosition(bottomPercent, rightPercent) {
        await GM_setValue(STORAGE_KEY_TOOLBAR_POSITION, { bottomPercent, rightPercent });
    }

    async function loadToolbarPosition() {
        return await GM_getValue(STORAGE_KEY_TOOLBAR_POSITION, null);
    }

    async function saveToolbarScale(scale) {
        await GM_setValue(STORAGE_KEY_TOOLBAR_SCALE, scale);
    }

    async function loadToolbarScale() {
        return await GM_getValue(STORAGE_KEY_TOOLBAR_SCALE, 1.0);
    }

    // --- CORE FUNCTIONS ---
    function setupAudioBoosterOnce(videoElement) {
        if (audioContext && sourceNode && currentVideoElement === videoElement) {
            return;
        }

        if (currentVideoElement !== videoElement) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            sourceNode = audioContext.createMediaElementSource(videoElement);
            gainNode = audioContext.createGain();
            sourceNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
            currentVideoElement = videoElement;
        } else if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            sourceNode = audioContext.createMediaElementSource(videoElement);
            gainNode = audioContext.createGain();
            sourceNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
            currentVideoElement = videoElement;
        }
    }

    function applyVolumeToUIAndGain(volume) {
        if (!gainNode) return;
        const clampedVolume = Math.max(0, Math.min(600, volume));
        gainNode.gain.value = clampedVolume / 100;
        const slider = document.querySelector('.volume-booster-slider-abs');
        const label = document.querySelector('.volume-booster-label-abs');
        if (slider) slider.value = clampedVolume;
        if (label) label.textContent = `${clampedVolume}%`;
    }

    function updateUIText() {
        const lang = currentLanguage;
        const icons = {
            global: document.querySelector('.volume-booster-setting-icon.global-volume'),
            perVideo: document.querySelector('.volume-booster-setting-icon.per-video-toggle'),
            save: document.querySelector('.volume-booster-setting-icon.save-per-video'),
            oneTime: document.querySelector('.volume-booster-setting-icon.one-time-restore-toggle'),
            language: document.querySelector('.volume-booster-setting-icon.language-toggle'),
            position: document.querySelector('.volume-booster-setting-icon.save-position'),
            close: document.querySelector('.volume-booster-close-btn')
        };

        if (icons.global) {
            icons.global.title = isGlobalVolumeEnabled ?
                translations[lang].globalVolumeEnabled : translations[lang].globalVolumeDisabled;
        }
        if (icons.perVideo) {
            icons.perVideo.title = isRememberPerVideoEnabled ?
                translations[lang].rememberPerVideoEnabled : translations[lang].rememberPerVideoDisabled;
        }
        if (icons.save) {
            icons.save.title = isRememberPerVideoEnabled ?
                translations[lang].savePerVideoEnabledHint : translations[lang].savePerVideoDisabledHint;
        }
        if (icons.oneTime) {
            icons.oneTime.title = isOneTimeRestoreEnabled ?
                translations[lang].oneTimeRestoreEnabled : translations[lang].oneTimeRestoreDisabled;
        }
        if (icons.language) {
            icons.language.title = translations[lang].languageToggleHint;
        }
        if (icons.position) {
            icons.position.title = `${translations[lang].savePositionHint} (${(currentScale * 100).toFixed(0)}%)`;
        }
        if (icons.close) {
            icons.close.title = translations[lang].closePanel;
        }
    }

    async function createVolumeSliderUI(playerContainer) {
        if (document.getElementById('volume-booster-container-abs')) return;
        if (!playerContainer) return;

        const container = document.createElement('div');
        container.id = 'volume-booster-container-abs';

        const closeBtn = document.createElement('div');
        closeBtn.className = 'volume-booster-close-btn';
        closeBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            isPanelVisible = false;
            await saveFeatureState(STORAGE_KEY_PANEL_VISIBILITY, isPanelVisible);
            container.classList.add('hidden');
        });

        const slider = document.createElement('input');
        slider.className = 'volume-booster-slider-abs';
        slider.type = 'range';
        slider.min = '0';
        slider.max = '600';
        slider.step = '10';

        const label = document.createElement('span');
        label.className = 'volume-booster-label-abs';

        const icons = {
            global: createIcon('global-volume'),
            perVideo: createIcon('per-video-toggle'),
            save: createIcon('save-per-video'),
            position: createIcon('save-position'),
            oneTime: createIcon('one-time-restore-toggle'),
            language: createIcon('language-toggle')
        };

        function createIcon(className) {
            const icon = document.createElement('div');
            icon.className = `volume-booster-setting-icon ${className}`;
            return icon;
        }

        if (isRememberPerVideoEnabled) icons.perVideo.classList.add('enabled');
        if (isOneTimeRestoreEnabled) icons.oneTime.classList.add('enabled');
        if (isGlobalVolumeEnabled) icons.global.classList.add('enabled');

        function updateSaveButtonState() {
            if (isRememberPerVideoEnabled) {
                icons.save.style.opacity = '1';
                icons.save.style.pointerEvents = 'auto';
            } else {
                icons.save.style.opacity = '0.5';
                icons.save.style.pointerEvents = 'none';
            }
        }
        updateSaveButtonState();

        slider.addEventListener('input', async () => {
            const boostValue = parseInt(slider.value, 10);
            currentTabVolume = boostValue;
            applyVolumeToUIAndGain(currentTabVolume);

            if (isGlobalVolumeEnabled) {
                await GM_setValue(STORAGE_KEY_TAB_VOLUME_PREFIX + tabId, currentTabVolume);
            }
            if (isOneTimeRestoreEnabled) {
                await saveOneTimeRestoreVolume(currentVideoId, currentTabVolume);
            }
        });

        icons.global.addEventListener('click', async () => {
            isGlobalVolumeEnabled = !isGlobalVolumeEnabled;
            await saveFeatureState(STORAGE_KEY_GLOBAL_FEATURE_STATE, isGlobalVolumeEnabled);
            icons.global.classList.toggle('enabled', isGlobalVolumeEnabled);
            updateUIText();
            icons.global.classList.add('clicked');
            setTimeout(() => icons.global.classList.remove('clicked'), 200);
            if (isGlobalVolumeEnabled) {
                await GM_setValue(STORAGE_KEY_TAB_VOLUME_PREFIX + tabId, currentTabVolume);
            }
            debouncedInitialize();
        });

        icons.perVideo.addEventListener('click', async () => {
            isRememberPerVideoEnabled = !isRememberPerVideoEnabled;
            await saveFeatureState(STORAGE_KEY_PER_VIDEO_FEATURE_STATE, isRememberPerVideoEnabled);
            icons.perVideo.classList.toggle('enabled', isRememberPerVideoEnabled);
            updateSaveButtonState();
            updateUIText();
            icons.perVideo.classList.add('clicked');
            setTimeout(() => icons.perVideo.classList.remove('clicked'), 200);
            debouncedInitialize();
        });

        icons.save.addEventListener('click', async () => {
            if (isRememberPerVideoEnabled && currentVideoId) {
                const currentSliderValue = parseInt(slider.value, 10);
                await saveVolumeSetting(currentVideoId, currentSliderValue);
                currentTabVolume = currentSliderValue;
                applyVolumeToUIAndGain(currentTabVolume);
                if (isOneTimeRestoreEnabled) {
                    await saveOneTimeRestoreVolume(currentVideoId, currentTabVolume);
                }
                icons.save.classList.add('clicked');
                setTimeout(() => icons.save.classList.remove('clicked'), 500);
            }
        });

        icons.oneTime.addEventListener('click', async () => {
            isOneTimeRestoreEnabled = !isOneTimeRestoreEnabled;
            await saveFeatureState(STORAGE_KEY_ONE_TIME_RESTORE_FEATURE_STATE, isOneTimeRestoreEnabled);
            icons.oneTime.classList.toggle('enabled', isOneTimeRestoreEnabled);
            updateUIText();
            icons.oneTime.classList.add('clicked');
            setTimeout(() => icons.oneTime.classList.remove('clicked'), 200);
            if (isOneTimeRestoreEnabled) {
                await saveOneTimeRestoreVolume(currentVideoId, currentTabVolume);
            } else {
                await clearOneTimeRestoreVolume(currentVideoId);
            }
            debouncedInitialize();
        });

        icons.language.addEventListener('click', async () => {
            currentLanguage = (currentLanguage === 'vi') ? 'en' : 'vi';
            await saveFeatureState(STORAGE_KEY_LANGUAGE, currentLanguage);
            updateUIText();
            icons.language.classList.add('clicked');
            setTimeout(() => icons.language.classList.remove('clicked'), 200);
        });

        icons.position.addEventListener('click', async () => {
            await saveToolbarPosition(bottomPercent, rightPercent);
            await saveToolbarScale(currentScale);
            icons.position.classList.add('clicked');
            setTimeout(() => icons.position.classList.remove('clicked'), 500);
        });

        container.appendChild(closeBtn);
        container.appendChild(slider);
        container.appendChild(label);
        container.appendChild(icons.global);
        container.appendChild(icons.perVideo);
        container.appendChild(icons.save);
        container.appendChild(icons.position);
        container.appendChild(icons.oneTime);
        container.appendChild(icons.language);
        playerContainer.appendChild(container);

        const savedPos = await loadToolbarPosition();
        const savedScale = await loadToolbarScale();
        currentScale = savedScale;
        container.style.transform = `scale(${currentScale})`;

        let bottomPercent = savedPos ? savedPos.bottomPercent : 0.1;
        let rightPercent = savedPos ? savedPos.rightPercent : 0.02;

        let rafId = null;
        function applyPosition() {
            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                const playerRect = playerContainer.getBoundingClientRect();
                const bottom = bottomPercent * playerRect.height;
                const right = rightPercent * playerRect.width;
                container.style.bottom = `${bottom}px`;
                container.style.right = `${right}px`;
                rafId = null;
            });
        }

        applyPosition();

        let isOnEdge = false;
        container.addEventListener('mouseenter', (e) => {
            if (!isDragging) {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const threshold = 20;

                if (x < threshold || y < threshold ||
                    x > rect.width - threshold || y > rect.height - threshold) {
                    container.classList.add('zoom-hover');
                    container.setAttribute('data-zoom-hint', translations[currentLanguage].zoomHint);
                    isOnEdge = true;
                }
            }
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDragging) {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const threshold = 20;

                if (x < threshold || y < threshold ||
                    x > rect.width - threshold || y > rect.height - threshold) {
                    if (!container.classList.contains('zoom-hover')) {
                        container.classList.add('zoom-hover');
                        container.setAttribute('data-zoom-hint', translations[currentLanguage].zoomHint);
                        isOnEdge = true;
                    }
                } else {
                    container.classList.remove('zoom-hover');
                    container.removeAttribute('data-zoom-hint');
                    isOnEdge = false;
                }
            }
        });

        container.addEventListener('mouseleave', () => {
            container.classList.remove('zoom-hover');
            container.removeAttribute('data-zoom-hint');
            isOnEdge = false;
        });

        container.addEventListener('wheel', (e) => {
            if (isOnEdge) {
                e.preventDefault();
                e.stopPropagation();

                const delta = e.deltaY > 0 ? -0.05 : 0.05;
                currentScale = Math.max(0.5, Math.min(2.0, currentScale + delta));
                container.style.transform = `scale(${currentScale})`;

                const lang = currentLanguage;
                if (icons.position) {
                    icons.position.title = `${translations[lang].savePositionHint} (${(currentScale * 100).toFixed(0)}%)`;
                }
            }
        }, { passive: false });

        container.addEventListener('mousedown', (e) => {
            if (e.button === 0 && !e.target.closest('input, .volume-booster-setting-icon, .volume-booster-close-btn')) {
                isDragging = true;
                container.classList.add('dragging');
                container.classList.remove('zoom-hover');

                const containerRect = container.getBoundingClientRect();
                dragOffsetX = (e.clientX - containerRect.left) / currentScale;
                dragOffsetY = (e.clientY - containerRect.top) / currentScale;

                container.style.transition = 'none';
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            requestAnimationFrame(() => {
                const playerRect = playerContainer.getBoundingClientRect();
                const containerWidth = container.offsetWidth * currentScale;
                const containerHeight = container.offsetHeight * currentScale;

                const mouseXRelativeToPlayer = e.clientX - playerRect.left;
                const mouseYRelativeToPlayer = e.clientY - playerRect.top;

                let newContainerLeftRelativeToPlayer = mouseXRelativeToPlayer - (dragOffsetX * currentScale);
                let newContainerTopRelativeToPlayer = mouseYRelativeToPlayer - (dragOffsetY * currentScale);

                newContainerLeftRelativeToPlayer = Math.max(0, Math.min(newContainerLeftRelativeToPlayer, playerRect.width - containerWidth));
                newContainerTopRelativeToPlayer = Math.max(0, Math.min(newContainerTopRelativeToPlayer, playerRect.height - containerHeight));

                let newRight = playerRect.width - (newContainerLeftRelativeToPlayer + containerWidth);
                let newBottom = playerRect.height - (newContainerTopRelativeToPlayer + containerHeight);

                container.style.right = `${newRight}px`;
                container.style.bottom = `${newBottom}px`;
            });
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.classList.remove('dragging');
                container.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

                const playerRect = playerContainer.getBoundingClientRect();
                const currentBottom = parseFloat(container.style.bottom);
                const currentRight = parseFloat(container.style.right);
                bottomPercent = currentBottom / playerRect.height;
                rightPercent = currentRight / playerRect.width;
            }
        });

        let resizeTimeout;
        const resizeObserver = new ResizeObserver(() => {
            if (!isDragging) {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    requestAnimationFrame(() => {
                        applyPosition();

                        const playerRect = playerContainer.getBoundingClientRect();
                        const containerWidth = container.offsetWidth * currentScale;
                        const containerHeight = container.offsetHeight * currentScale;

                        const currentBottom = parseFloat(container.style.bottom);
                        const currentRight = parseFloat(container.style.right);

                        const maxBottom = playerRect.height - containerHeight;
                        const maxRight = playerRect.width - containerWidth;

                        let needsAdjustment = false;
                        let newBottom = currentBottom;
                        let newRight = currentRight;

                        if (currentBottom > maxBottom || currentBottom < 0) {
                            newBottom = Math.max(0, Math.min(currentBottom, maxBottom));
                            needsAdjustment = true;
                        }
                        if (currentRight > maxRight || currentRight < 0) {
                            newRight = Math.max(0, Math.min(currentRight, maxRight));
                            needsAdjustment = true;
                        }

                        if (needsAdjustment) {
                            container.style.bottom = `${newBottom}px`;
                            container.style.right = `${newRight}px`;

                            bottomPercent = newBottom / playerRect.height;
                            rightPercent = newRight / playerRect.width;
                        }
                    });
                }, 150);
            }
        });
        resizeObserver.observe(playerContainer);

        const handleViewportChange = () => {
            if (!isDragging) {
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        const playerRect = playerContainer.getBoundingClientRect();
                        const containerWidth = container.offsetWidth * currentScale;
                        const containerHeight = container.offsetHeight * currentScale;

                        let newBottom = bottomPercent * playerRect.height;
                        let newRight = rightPercent * playerRect.width;

                        newBottom = Math.max(0, Math.min(newBottom, playerRect.height - containerHeight));
                        newRight = Math.max(0, Math.min(newRight, playerRect.width - containerWidth));

                        container.style.bottom = `${newBottom}px`;
                        container.style.right = `${newRight}px`;
                    });
                }, 300);
            }
        };

        document.addEventListener('fullscreenchange', handleViewportChange);
        document.addEventListener('webkitfullscreenchange', handleViewportChange);
        document.addEventListener('mozfullscreenchange', handleViewportChange);
        document.addEventListener('MSFullscreenChange', handleViewportChange);

        const theaterObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const hasTheaterClass = playerContainer.classList.contains('ytp-size-large');
                    const hasBigModeClass = playerContainer.classList.contains('ytp-big-mode');
                    if (hasTheaterClass || hasBigModeClass) {
                        handleViewportChange();
                    }
                }
            }
        });

        theaterObserver.observe(playerContainer, {
            attributes: true,
            attributeFilter: ['class']
        });

        const watchFlexy = document.querySelector('ytd-watch-flexy');
        if (watchFlexy) {
            const flexObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' &&
                        (mutation.attributeName === 'theater' || mutation.attributeName === 'fullscreen')) {
                        handleViewportChange();
                    }
                }
            });

            flexObserver.observe(watchFlexy, {
                attributes: true,
                attributeFilter: ['theater', 'fullscreen']
            });
        }

        isPanelVisible = await getFeatureState(STORAGE_KEY_PANEL_VISIBILITY, true);
        if (!isPanelVisible) {
            container.classList.add('hidden');
        }

        updateUIText();
    }

    async function initialize() {
        if (!window.location.pathname.startsWith('/watch')) {
            const container = document.getElementById('volume-booster-container-abs');
            if (container) container.remove();
            currentVideoId = null;
            previousVideoId = null;
            return;
        }

        const newVideoId = getVideoId();
        const videoElement = document.querySelector('video');
        const playerContainer = document.querySelector('#movie_player');

        if (!videoElement || !newVideoId || !playerContainer) {
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 300));

        if (newVideoId === currentVideoId && currentVideoId !== null) {
            return;
        }

        if (previousVideoId && previousVideoId !== newVideoId && isOneTimeRestoreEnabled) {
            await clearOneTimeRestoreVolume(previousVideoId);
        }

        previousVideoId = currentVideoId;
        currentVideoId = newVideoId;
        tabId = getTabId();

        isGlobalVolumeEnabled = await getFeatureState(STORAGE_KEY_GLOBAL_FEATURE_STATE, false);
        isRememberPerVideoEnabled = await getFeatureState(STORAGE_KEY_PER_VIDEO_FEATURE_STATE, false);
        isOneTimeRestoreEnabled = await getFeatureState(STORAGE_KEY_ONE_TIME_RESTORE_FEATURE_STATE, true);

        const browserLang = navigator.language || navigator.userLanguage || 'en';
        const defaultLang = browserLang.toLowerCase().startsWith('vi') ? 'vi' : 'en';
        currentLanguage = await getFeatureState(STORAGE_KEY_LANGUAGE, defaultLang);

        let volumeToDetermine = 100;
        const perVideoVolume = await getVolumeSetting(currentVideoId);
        const restoredVolumeOnBrowserRestore = await loadAndClearOneTimeRestoreVolume(currentVideoId);
        const globalTabVolume = await GM_getValue(STORAGE_KEY_TAB_VOLUME_PREFIX + tabId, 100);

        if (isRememberPerVideoEnabled && perVideoVolume !== null) {
            volumeToDetermine = perVideoVolume;
        } else if (restoredVolumeOnBrowserRestore !== null) {
            volumeToDetermine = restoredVolumeOnBrowserRestore;
        } else if (isGlobalVolumeEnabled) {
            volumeToDetermine = globalTabVolume;
        } else {
            volumeToDetermine = 100;
        }

        currentTabVolume = volumeToDetermine;
        if (isGlobalVolumeEnabled) {
            await GM_setValue(STORAGE_KEY_TAB_VOLUME_PREFIX + tabId, currentTabVolume);
        }
        if (isOneTimeRestoreEnabled) {
            await saveOneTimeRestoreVolume(currentVideoId, currentTabVolume);
        }

        setupAudioBoosterOnce(videoElement);
        await createVolumeSliderUI(playerContainer);
        applyVolumeToUIAndGain(currentTabVolume);
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    function debouncedInitialize() {
        clearTimeout(initializeTimeout);
        initializeTimeout = setTimeout(initialize, DEBOUNCE_DELAY);
    }

    const observer = new MutationObserver(() => {
        const newVideoIdInURL = getVideoId();
        if (newVideoIdInURL && newVideoIdInURL !== currentVideoId) {
            debouncedInitialize();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('yt-page-data-updated', debouncedInitialize);
    window.addEventListener('yt-navigate-finish', debouncedInitialize);
    window.addEventListener('load', debouncedInitialize);

    async function clearManualVideoSettings() {
        const isConfirmed = confirm(translations[currentLanguage].confirmClear);
        if (isConfirmed) {
            await GM_setValue(STORAGE_KEY_PER_VIDEO, {});
            alert(translations[currentLanguage].clearManualStorageSuccess);
        }
    }

    async function clearToolbarPosition() {
        const isConfirmed = confirm(translations[currentLanguage].confirmClearPosition);
        if (isConfirmed) {
            await GM_setValue(STORAGE_KEY_TOOLBAR_POSITION, null);
            await GM_setValue(STORAGE_KEY_TOOLBAR_SCALE, 1.0);
            alert(translations[currentLanguage].clearPositionStorageSuccess);
        }
    }

    async function showPanel() {
        isPanelVisible = true;
        await saveFeatureState(STORAGE_KEY_PANEL_VISIBILITY, isPanelVisible);
        const container = document.getElementById('volume-booster-container-abs');
        if (container) {
            container.classList.remove('hidden');
            container.style.boxShadow = '0 0 0 4px rgba(76, 175, 80, 0.6), 0 8px 32px rgba(0, 0, 0, 0.4)';
            setTimeout(() => {
                container.style.boxShadow = '';
            }, 1000);
        }
    }

    document.addEventListener('keydown', async (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'V') {
            e.preventDefault();
            await showPanel();
        }
    });

    (async () => {
        const browserLang = navigator.language || navigator.userLanguage || 'en';
        const defaultLang = browserLang.toLowerCase().startsWith('vi') ? 'vi' : 'en';

        currentLanguage = await getFeatureState(STORAGE_KEY_LANGUAGE, defaultLang);
        GM_registerMenuCommand(translations[currentLanguage].showPanelTitle, showPanel);
        GM_registerMenuCommand(translations[currentLanguage].clearManualStorageTitle, clearManualVideoSettings);
        GM_registerMenuCommand(translations[currentLanguage].clearPositionStorageTitle, clearToolbarPosition);
    })();

})();