// ==UserScript==
// @name         YouTube Quick Speed & Volume Interface(Capsule Style)
// @name:zh-TW   YouTube 快速倍速與音量控制介面(膠囊樣式)
// @name:zh-CN   YouTube 快速倍速与音量控制界面(胶囊样式)
// @namespace    https://twitter.com/CobleeH
// @version      6.11
// @description  Add a quick speed and volume interface to YouTube's middle-bottom area without interfering with existing controls.
// @description:zh-TW  在YouTube的右下部區域添加一個快速速度和音量界面，而不干擾現有控件。
// @description:zh-CN  在YouTube的右下部区域添加一个快速速度和音量界面，而不干扰现有控件。
// @author       CobleeH
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552616/YouTube%20Quick%20Speed%20%20Volume%20Interface%28Capsule%20Style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552616/YouTube%20Quick%20Speed%20%20Volume%20Interface%28Capsule%20Style%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const speeds = [0.5, 1, 1.5, 2, 3];
    const volumes = [0, 0.15, 0.35, 0.65, 1];

    const UNIFIED_MIN_WIDTH = '180px';
    const CAPSULE_BACKGROUND_COLOR = 'rgba(20, 20, 20, 0.4)';
    const HIGHLIGHT_BORDER_RADIUS = '9999px'; 

    // 定義兩種模式下的 bottom 值
    const BOTTOM_NORMAL = '110px';
    const BOTTOM_FULLSCREEN = '165px'; 
    // 預設的右側偏移量
    const RIGHT_OFFSET_DEFAULT = '25px';
    // 設定選單開啟時，將控制項推到畫面外的偏移量（確保完全隱藏）
    const RIGHT_OFFSET_HIDDEN = '-300px'; 
    const CONTROL_TRANSITION = 'opacity 0.2s ease-out, bottom 0.2s ease-out, right 0.2s ease-out';


    function createControlContainer() {
        const container = document.createElement('div');
        container.classList.add('ytp-control-container-custom');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'stretch';
        container.style.position = 'absolute';
        container.style.right = RIGHT_OFFSET_DEFAULT; 
        container.style.bottom = BOTTOM_NORMAL;
        container.style.zIndex = '9999';
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
        container.style.transition = CONTROL_TRANSITION; 

        const volumeOptions = createVolumeOptions();
        const speedOptions = createSpeedOptions();
        container.appendChild(volumeOptions);
        container.appendChild(speedOptions);
        return container;
    }

    function createOptionElement(text) {
        const option = document.createElement('div');
        option.classList.add('ytp-option-custom');
        option.innerText = text;
        option.style.cursor = 'pointer';
        option.style.margin = '0 3px';
        option.style.flexGrow = '1';
        option.style.textAlign = 'center';
        option.style.padding = '3px 6px';
        
        option.style.borderRadius = HIGHLIGHT_BORDER_RADIUS; 
        
        option.style.transition = 'background-color 0.1s ease, color 0.1s ease, font-weight 0.1s ease';

        option.addEventListener('mouseenter', () => {
            if (option.style.backgroundColor !== 'rgb(255, 255, 255)' && option.style.backgroundColor !== 'rgb(255,255,255)') {
                option.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            }
        });
        option.addEventListener('mouseleave', () => {
            if (option.style.backgroundColor !== 'rgb(255, 255, 255)' && option.style.backgroundColor !== 'rgb(255,255,255)') {
                option.style.backgroundColor = 'transparent';
            }
        });
        return option;
    }

    function highlightOption(selectedOption, selector) {
        const options = document.querySelectorAll(selector);
        options.forEach(option => {
            option.style.color = '#fff';
            option.style.fontWeight = 'normal';
            option.style.backgroundColor = 'transparent';
            option.style.borderRadius = HIGHLIGHT_BORDER_RADIUS;
        });
        selectedOption.style.backgroundColor = '#fff';
        selectedOption.style.color = '#000';
        selectedOption.style.fontWeight = 'bold';
        selectedOption.style.borderRadius = HIGHLIGHT_BORDER_RADIUS; 
    }

    function createVolumeOptions() {
        const volumeContainer = document.createElement('div');
        volumeContainer.classList.add('ytp-volume-options-custom');
        volumeContainer.style.display = 'flex';
        volumeContainer.style.alignItems = 'center';
        volumeContainer.style.marginBottom = '5px';

        volumeContainer.style.minWidth = UNIFIED_MIN_WIDTH;
        volumeContainer.style.background = CAPSULE_BACKGROUND_COLOR;
        volumeContainer.style.borderRadius = '9999px';
        volumeContainer.style.padding = '4px 10px';

        const label = document.createElement('span');
        label.innerText = 'Vol';
        label.style.marginRight = '8px';
        label.style.fontWeight = 'bold';
        volumeContainer.appendChild(label);
        volumes.forEach(volume => {
            const option = createOptionElement((volume * 100) + '%');
            option.addEventListener('click', () => {
                const video = document.querySelector('video');
                if (video) {
                    video.volume = volume;
                    highlightOption(option, '.ytp-volume-options-custom .ytp-option-custom');
                }
            });
            volumeContainer.appendChild(option);
        });
        return volumeContainer;
    }

    function createSpeedOptions() {
        const speedContainer = document.createElement('div');
        speedContainer.classList.add('ytp-speed-options-custom');
        speedContainer.style.display = 'flex';
        speedContainer.style.alignItems = 'center';

        speedContainer.style.minWidth = UNIFIED_MIN_WIDTH;
        speedContainer.style.background = CAPSULE_BACKGROUND_COLOR;
        speedContainer.style.borderRadius = '9999px';
        speedContainer.style.padding = '4px 10px';

        const label = document.createElement('span');
        label.innerText = 'Spd';
        label.style.marginRight = '8px';
        label.style.fontWeight = 'bold';
        speedContainer.appendChild(label);
        speeds.forEach(speed => {
            const option = createOptionElement(speed + 'x');
            option.addEventListener('click', () => {
                const video = document.querySelector('video');
                if (video) {
                    video.playbackRate = speed;
                    highlightOption(option, '.ytp-speed-options-custom .ytp-option-custom');
                }
            });
            speedContainer.appendChild(option);
        });
        return speedContainer;
    }

    function setupInitialStateAndSync() {
        const video = document.querySelector('video');
        if (!video) return;

        const syncSpeed = () => {
            const newSpeed = video.playbackRate;
            const speedOptions = document.querySelectorAll('.ytp-speed-options-custom .ytp-option-custom');
            speedOptions.forEach(option => {
                const speedValue = parseFloat(option.innerText.replace('x', ''));
                if (Math.abs(speedValue - newSpeed) < 0.001) {
                    highlightOption(option, '.ytp-speed-options-custom .ytp-option-custom');
                }
            });
        };

        const syncVolume = () => {
            const newVolume = video.volume;
            const volumeOptions = document.querySelectorAll('.ytp-volume-options-custom .ytp-option-custom');
            volumeOptions.forEach(option => {
                const volumeValue = parseFloat(option.innerText.replace('%', '')) / 100;
                const effectiveVolume = video.muted ? 0 : newVolume;

                if (Math.abs(volumeValue - effectiveVolume) < 0.001) {
                    highlightOption(option, '.ytp-volume-options-custom .ytp-option-custom');
                }
            });
        };

        syncSpeed();
        syncVolume();

        video.addEventListener('ratechange', syncSpeed);
        video.addEventListener('volumechange', syncVolume);
    }

    // 【核心修正】判斷設定選單是否開啟的函數
    function isSettingsMenuOpen() {
        // 原生設定選單的容器是 .ytp-popup.ytp-settings-menu
        const settingsMenu = document.querySelector('.ytp-settings-menu');
        
        // 檢查三個條件：元素存在、不是被隱藏 (display: none)、且是可見的 (opacity > 0)
        if (settingsMenu) {
             // getComputedStyle 可以獲取元素實時計算後的樣式
            const style = window.getComputedStyle(settingsMenu);
            // 判斷方式：檢查 style.display 是否為 block/flex/grid 等非 none 值
            // 同時檢查它的 visibility 是否為 visible
            return style.display !== 'none' && style.visibility === 'visible';
        }
        return false;
    }


    // 合併所有位置和可見性更新邏輯
    function updateVisibilityAndPosition(player, controlContainer) {
        if (!controlContainer) return;

        const isFullscreen = player.classList.contains('ytp-fullscreen');
        const isTheaterMode = document.querySelector('ytd-watch-flexy[theater]') || player.classList.contains('ytp-autohide');
        
        // 【核心修正】呼叫精準的判斷函數
        const settingsOpen = isSettingsMenuOpen();


        // 1. 調整垂直位置 (bottom)
        if (isFullscreen || isTheaterMode) {
            controlContainer.style.bottom = BOTTOM_FULLSCREEN;
        } else {
            controlContainer.style.bottom = BOTTOM_NORMAL;
        }

        // 2. 調整水平位置 (right) 以避開設定選單
        if (settingsOpen) {
            controlContainer.style.right = RIGHT_OFFSET_HIDDEN; // 推到右邊隱藏
        } else {
            controlContainer.style.right = RIGHT_OFFSET_DEFAULT; // 恢復預設位置
        }
        
        // 3. 調整透明度 (opacity) 與原生控制條同步
        if (player.classList.contains('ytp-autohide')) {
            // 如果原生控制條隱藏，則自訂控制項也隱藏
            controlContainer.style.opacity = '0';
            controlContainer.style.pointerEvents = 'none';
        } else {
            // 如果原生控制條顯示，則自訂控制項也顯示
            controlContainer.style.opacity = '1';
            controlContainer.style.pointerEvents = 'auto';
        }
    }


    // 【修改】專門監聽設定選單容器的樣式變化
    function setupSettingsMenuObserver(player, controlContainer) {
        // 我們要監聽的目標是設定選單的彈出容器
        const settingsPopup = document.querySelector('.ytp-popup.ytp-settings-menu');
        
        if (!settingsPopup) {
             // 如果元素還沒載入，則監聽播放器容器
             const playerObserver = new MutationObserver(() => {
                 if (document.querySelector('.ytp-popup.ytp-settings-menu')) {
                     playerObserver.disconnect();
                     // 找到元素後重新設置監聽
                     setupSettingsMenuObserver(player, controlContainer); 
                 }
             });
             // 監聽播放器子節點，直到找到設定選單
             playerObserver.observe(player, { childList: true, subtree: true });
             return;
        }
        
        // 觀察器：監聽設定選單的 class 和 style 屬性
        const settingsObserver = new MutationObserver(() => {
            updateVisibilityAndPosition(player, controlContainer);
        });
        
        // 【重點】監聽 class 變動 (例如 ytp-panel-menu/ytp-settings-menu 開啟時的 class)
        // 以及 style 變動 (display: block/none, opacity, visibility)
        settingsObserver.observe(settingsPopup, { attributes: true, attributeFilter: ['class', 'style'] });

        // 確保初始狀態正確
        updateVisibilityAndPosition(player, controlContainer);
    }
    
    // 整合控制條隱藏與設定選單監聽
    function setupAutoHideSync(player, controlContainer) {
        
        // 1. 監聽播放器 Class 變化 (處理全螢幕/自動隱藏/垂直位置)
        const playerClassObserver = new MutationObserver(() => {
            updateVisibilityAndPosition(player, controlContainer); 
        });
        playerClassObserver.observe(player, { attributes: true, attributeFilter: ['class'] });

        // 2. 監聽設定選單的出現與隱藏 (處理重疊問題)
        setupSettingsMenuObserver(player, controlContainer);

        // 初始執行一次
        updateVisibilityAndPosition(player, controlContainer);
    }

    function insertControls() {
        const player = document.querySelector('.html5-video-player');
        if (!player) return;

        let existingContainer = document.querySelector('.ytp-control-container-custom');
        if (existingContainer) {
            // 移除舊的容器以清理舊的事件監聽器
            existingContainer.remove();
        }

        const controlContainer = createControlContainer();
        player.appendChild(controlContainer);
        setupInitialStateAndSync();
        setupAutoHideSync(player, controlContainer);
    }

    // 觀察器與載入事件
    const mainObserver = new MutationObserver(() => {
        if (document.querySelector('.html5-video-player') && !document.querySelector('.ytp-control-container-custom')) {
             insertControls();
        }
    });
    mainObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', insertControls);
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(insertControls, 500);
        }
    }).observe(document, {subtree: true, childList: true});

})();