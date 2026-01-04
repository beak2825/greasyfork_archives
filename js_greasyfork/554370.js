// ==UserScript==
// @name         YouTube Fullscreen Manager
// @name:zh-CN   YouTube 全萤幕管理器
// @name:en      YouTube Fullscreen Manager
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  管理 YouTube 全螢幕模式切換，包含四種模式：原生、瀏覽器API、網頁全螢幕（置中容器）、網頁全螢幕（置頂容器）。僅在影片播放頁面啟用核心功能。
// @description:zh-CN 管理 YouTube 全萤幕模式切换，包含四种模式：原生、浏览器API、网页全萤幕（置中容器）、网页全萤幕（置顶容器）。仅在影片播放页面启用核心功能。
// @description:en  Manages YouTube fullscreen switching with four modes: Native, Browser API, Web Fullscreen (Centered Container), Web Fullscreen (Top Container). Core functionality only activates on video playback pages.
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554370/YouTube%20Fullscreen%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/554370/YouTube%20Fullscreen%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LANG = /^zh-(cn|tw|hk|mo|sg)/i.test(navigator.language) ? 'zh' : 'en';
    const i18n = {
        zh: {
            menuFullscreenMode: '📺 設定 YouTube 全螢幕模式',
            fullscreenModeOptions: {
                1: '1. 原生最大化 (點擊 .ytp-fullscreen-button)',
                2: '2. 原生API最大化 (toggleNativeFullscreen)',
                3: '3. 網頁全螢幕 (容器置中)',
                4: '4. 網頁全螢幕 (容器置頂)'
            },
            promptFullscreen: '選擇 YouTube 全螢幕模式:',
            saveAlert: '設定已保存，需重新整理頁面後生效'
        },
        en: {
            menuFullscreenMode: '📺 Set YouTube Fullscreen Mode',
            fullscreenModeOptions: {
                1: '1. Native maximization (click .ytp-fullscreen-button)',
                2: '2. Native API maximization (toggleNativeFullscreen)',
                3: '3. Web Fullscreen (Centered Container)',
                4: '4. Web Fullscreen (Top Container)'
            },
            promptFullscreen: 'Select YouTube fullscreen mode:',
            saveAlert: 'Settings saved. Refresh page to apply'
        }
    };

    // 配置管理 / Configuration management
    const CONFIG_STORAGE_KEY = 'YouTubeFullscreenManagerConfig';
    const DEFAULT_CONFIG = {
        youtubeFullscreenMode: 2 // 預設模式改為2 / Default mode changed to 2
    };

    const getConfig = () => {
        const savedConfig = GM_getValue(CONFIG_STORAGE_KEY, {});
        return { ...DEFAULT_CONFIG, ...savedConfig };
    };

    const saveConfig = (config) => {
        const currentConfig = { ...config };
        const isDefault = Object.keys(DEFAULT_CONFIG).every(key =>
            currentConfig[key] === DEFAULT_CONFIG[key]
        );
        if (isDefault) {
            GM_setValue(CONFIG_STORAGE_KEY, {});
            return;
        }
        GM_setValue(CONFIG_STORAGE_KEY, currentConfig);
    };

    let CONFIG = getConfig();

    // 註冊選單 / Register menu
    const registerMenuCommands = () => {
        const t = i18n[LANG];
        GM_registerMenuCommand(t.menuFullscreenMode, handleFullscreenModeSetting);
    };

    const handleFullscreenModeSetting = () => {
        const t = i18n[LANG];
        const options = t.fullscreenModeOptions;
        const choice = prompt(
            `${t.promptFullscreen}\n${Object.values(options).join('\n')}`,
            CONFIG.youtubeFullscreenMode
        );
        if (choice && options[choice]) {
            CONFIG.youtubeFullscreenMode = parseInt(choice);
            saveConfig(CONFIG);
            alert(t.saveAlert);
        }
    };

    // 核心功能控制變量 / Core functionality control variables
    let isCoreActive = false; // 核心功能是否啟動 / Whether core functionality is active
    let videoDoubleClickHandler = null; // 用於存儲雙擊處理函數 / Used to store the double-click handler
    let keydownHandler = null; // 用於存儲按鍵處理函數 / Used to store the keydown handler
    let mutationObserver = null; // 用於監聽DOM變更 / Used to observe DOM changes

    // 狀態變量 / State variables
    let isWebFullscreened = false;
    let originalVideoParent = null;
    let originalVideoStyles = {};
    let originalParentStyles = {};
    let webFullscreenContainer = null;

    // 切換函數 / Toggle functions
    function toggleWebFullscreen(video) {
        if (!video) return;

        if (isWebFullscreened) {
            // 恢復原狀 / Restore original state
            if (webFullscreenContainer && webFullscreenContainer.contains(video)) {
                webFullscreenContainer.removeChild(video);
            }
            if (webFullscreenContainer && document.body.contains(webFullscreenContainer)) {
                document.body.removeChild(webFullscreenContainer);
                webFullscreenContainer = null;
            }
            if (originalVideoParent && !originalVideoParent.contains(video)) {
                originalVideoParent.appendChild(video);
            }
            Object.assign(video.style, originalVideoStyles);
            if (originalVideoParent) {
                Object.assign(originalVideoParent.style, originalParentStyles);
            }
            isWebFullscreened = false;
            originalVideoParent = null;
        } else {
            // 進入全螢幕 / Enter fullscreen
            originalVideoParent = video.parentElement;
            if (!originalVideoParent) return;

            originalVideoStyles = {
                position: video.style.position,
                top: video.style.top,
                left: video.style.left,
                width: video.style.width,
                height: video.style.height,
                zIndex: video.style.zIndex,
                objectFit: video.style.objectFit,
                objectPosition: video.style.objectPosition
            };
            originalParentStyles = {
                position: originalVideoParent.style.position,
                overflow: originalVideoParent.style.overflow
            };

            if (!webFullscreenContainer) {
                webFullscreenContainer = document.createElement('div');
                webFullscreenContainer.id = 'web-fullscreen-container';
                // 根據模式設定容器樣式 / Set container styles based on mode
                let containerStyles;
                if (CONFIG.youtubeFullscreenMode === 3) { // 模式3: 容器置中 (覆蓋整個視窗) / Mode 3: Centered container (covers entire window)
                    containerStyles = {
                        position: 'fixed', // 固定定位 / Fixed positioning
                        top: '0',
                        left: '0',
                        width: '100vw',
                        height: '100vh',
                        zIndex: '2147483645',
                        backgroundColor: 'black',
                        display: 'flex',
                        alignItems: 'center', // 垂直置中 / Center vertically
                        justifyContent: 'center' // 水平置中 / Center horizontally
                    };
                } else { // 模式4: 容器置頂 / Mode 4: Top container
                    containerStyles = {
                        position: 'relative',
                        zIndex: '2147483645',
                        backgroundColor: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        maxWidth: '100%',
                        maxHeight: '100vh'
                    };
                }
                Object.assign(webFullscreenContainer.style, containerStyles);
                webFullscreenContainer.addEventListener('click', () => {
                    if (video && !video.paused) {
                        video.pause();
                    } else if (video) {
                        video.play().catch(() => {});
                    }
                });
            }

            Object.assign(originalVideoParent.style, {
                position: 'static',
                overflow: 'visible'
            });

            originalVideoParent.removeChild(video);
            webFullscreenContainer.appendChild(video);
            document.body.insertBefore(webFullscreenContainer, document.body.firstChild);

            // 模式3: 設定影片置中並最大化 / Mode 3: Set video to center and maximize
            // 模式4: 設定影片置中並最大化 / Mode 4: Set video to center and maximize
            video.style.position = '';
            video.style.top = '';
            video.style.left = '';
            video.style.width = CONFIG.youtubeFullscreenMode === 3 ? '100%' : '100%';
            video.style.height = CONFIG.youtubeFullscreenMode === 3 ? '100%' : 'auto';
            video.style.maxWidth = CONFIG.youtubeFullscreenMode === 3 ? 'none' : 'none';
            video.style.maxHeight = CONFIG.youtubeFullscreenMode === 3 ? 'none' : '100vh';
            video.style.zIndex = '';
            video.style.objectFit = 'contain'; // 保持比例並填滿容器 (模式3) 或適應容器 (模式4) / Maintain aspect ratio and fit within container (Mode 3) or adapt to container (Mode 4)
            video.style.objectPosition = 'center'; // 置中 / Center
            isWebFullscreened = true;
        }
    }

    function toggleNativeFullscreen(video) {
        if (!video) return;
        try {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                let elementToFullscreen = video;
                for (let i = 0; i < 2; i++) {
                    elementToFullscreen = elementToFullscreen.parentElement || elementToFullscreen;
                }
                elementToFullscreen.requestFullscreen?.() ||
                elementToFullscreen.webkitRequestFullscreen?.() ||
                elementToFullscreen.msRequestFullscreen?.() ||
                video.requestFullscreen?.() ||
                video.webkitRequestFullscreen?.() ||
                video.msRequestFullscreen?.();
            }
        } catch (e) {
            console.error('Fullscreen error:', e);
        }
    }

    function toggleFullscreen(video) {
        switch(CONFIG.youtubeFullscreenMode) {
            case 1:
                document.querySelector('.ytp-fullscreen-button')?.click();
                break;
            case 2:
                toggleNativeFullscreen(video);
                break;
            case 3:
            case 4: // 模式3和4都使用相同的函數，僅容器定位不同 / Mode 3 and 4 use same function, only container positioning differs
                toggleWebFullscreen(video);
                break;
        }
    }

    // 雙擊處理 / Double-click handling
    function setupVideoEventOverrides(video) {
        if (videoDoubleClickHandler) {
            video.removeEventListener('dblclick', videoDoubleClickHandler);
        }
        videoDoubleClickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFullscreen(video);
        };
        video.addEventListener('dblclick', videoDoubleClickHandler);
    }

    // 按鍵處理 / Key handling
    function handleKeyEvent(e) {
        if (e.target.matches('input, textarea, select') || e.target.isContentEditable) return;

        const video = document.querySelector('video, ytd-player video');
        if (!video) return;

        // Enter鍵切換全螢幕 / Enter key to toggle fullscreen
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            toggleFullscreen(video);
        }
    }

    // 綁定核心功能 / Bind core functionality
    function bindCoreFeatures() {
        if (isCoreActive) return; // 如果已啟動則不重複綁定 / Don't re-bind if already active

        document.querySelectorAll('video').forEach(video => {
            if (!video.dataset.fullscreenBound) {
                setupVideoEventOverrides(video);
                video.dataset.fullscreenBound = 'true';
            }
        });

        keydownHandler = handleKeyEvent;
        document.addEventListener('keydown', keydownHandler, true);

        // 監聽動態內容 / Listen for dynamic content
        mutationObserver = new MutationObserver(() => {
            document.querySelectorAll('video').forEach(video => {
                if (!video.dataset.fullscreenBound) {
                    setupVideoEventOverrides(video);
                    video.dataset.fullscreenBound = 'true';
                }
            });
        });
        mutationObserver.observe(document.body, { childList: true, subtree: true });

        isCoreActive = true;
    }

    // 釋放核心功能 / Release core functionality
    function unbindCoreFeatures() {
        if (!isCoreActive) return; // 如果未啟動則不需釋放 / Don't release if not active

        document.querySelectorAll('video[data-fullscreen-bound]').forEach(video => {
            if (videoDoubleClickHandler) {
                video.removeEventListener('dblclick', videoDoubleClickHandler);
            }
            delete video.dataset.fullscreenBound;
        });

        if (keydownHandler) {
            document.removeEventListener('keydown', keydownHandler, true);
            keydownHandler = null;
        }

        if (mutationObserver) {
            mutationObserver.disconnect();
            mutationObserver = null;
        }

        // 退出全螢幕狀態 / Exit fullscreen state
        if (isWebFullscreened) {
            // 觸發一次切換以恢復原狀 / Trigger a toggle to restore original state
            const video = document.querySelector('video, ytd-player video');
            if (video) {
                // 手動調用切換函數恢復狀態 / Manually call toggle function to restore state
                if (webFullscreenContainer && webFullscreenContainer.contains(video)) {
                    webFullscreenContainer.removeChild(video);
                }
                if (webFullscreenContainer && document.body.contains(webFullscreenContainer)) {
                    document.body.removeChild(webFullscreenContainer);
                    webFullscreenContainer = null;
                }
                if (originalVideoParent && !originalVideoParent.contains(video)) {
                    originalVideoParent.appendChild(video);
                }
                if (video && originalVideoStyles) Object.assign(video.style, originalVideoStyles);
                if (originalVideoParent && originalParentStyles) Object.assign(originalVideoParent.style, originalParentStyles);
                isWebFullscreened = false;
                originalVideoParent = null;
            }
        }

        isCoreActive = false;
    }

    // 檢查是否為影片播放頁面 / Check if it's a video playback page
    const isVideoPage = () => location.pathname.startsWith('/watch');

    // 初始化 / Initialization
    function init() {
        registerMenuCommands();

        // 初始檢查 / Initial check
        if (isVideoPage()) {
            bindCoreFeatures();
        }

        // 監聽 URL 變化 / Listen for URL changes
        let currentPath = location.pathname;
        const observer = new MutationObserver(() => {
            if (location.pathname !== currentPath) {
                currentPath = location.pathname;
                if (isVideoPage()) {
                    bindCoreFeatures();
                } else {
                    unbindCoreFeatures();
                }
            }
        });
        observer.observe(document, { childList: true, subtree: true });

        // 監聽 popstate 事件 (瀏覽器前後按鈕) / Listen for popstate event (browser back/forward buttons)
        window.addEventListener('popstate', () => {
            if (isVideoPage()) {
                bindCoreFeatures();
            } else {
                unbindCoreFeatures();
            }
        });
    }

    init();
})();