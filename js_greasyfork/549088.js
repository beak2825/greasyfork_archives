// ==UserScript==
// @name         视频加速
// @version      7.1.0
// @description  提供15个预设按钮(5x3布局)和拖拽滑块，支持修改B站原生倍速菜单
// @author       kuaisudaohang
// @match        *://*.bilibili.com/*
// @match        *://*.youtube.com/*
// @match        *://v.youku.com/v_show/*
// @match        *://*.iqiyi.com/*
// @match        *://v.qq.com/x/cover/*
// @match        *://*.mgtv.com/*
// @match        *://tv.sohu.com/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.nicovideo.jp/watch/*
// @match        *://*.dailymotion.com/video/*
// @match        *://vimeo.com/*
// @match        *://ani.gamer.com.tw/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1513773
// @downloadURL https://update.greasyfork.org/scripts/549088/%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/549088/%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement("style");
    document.head.appendChild(style);
    const sheet = style.sheet;

    sheet.insertRule(`.vsc-container { position: fixed; left: 15px; top: 50%; transform: translateY(-50%); z-index: 2147483647; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }`, 0);
    sheet.insertRule(`.vsc-icon { width: 42px; height: 42px; background: rgba(28, 28, 30, 0.8); border-radius: 50%; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); transition: all 0.3s ease; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }`, 1);
    // --- 修改：调整面板宽度以适应5x3布局 ---
    sheet.insertRule(`.vsc-panel { position: absolute; left: 21px; top: 50%; width: 320px; padding: 18px 22px; background: rgba(28, 28, 30, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 14px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35); visibility: hidden; opacity: 0; transform: translateY(-50%) translateX(-20px) scale(0.95); pointer-events: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); color: #f5f5f7; }`, 2);
    sheet.insertRule(`.vsc-container:hover .vsc-panel { visibility: visible; opacity: 1; transform: translateY(-50%) translateX(0) scale(1); pointer-events: auto; }`, 3);
    sheet.insertRule(`.vsc-container:hover .vsc-icon { transform: scale(1.1) rotate(90deg); }`, 4);

    // --- 修改：5x3布局的预设按钮容器 ---
    sheet.insertRule(`.vsc-options { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 20px; }`, 5);
    sheet.insertRule(`.vsc-btn { background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%); border: 1px solid rgba(255, 255, 255, 0.1); color: #f5f5f7; padding: 10px 0; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }`, 6);
    sheet.insertRule(`.vsc-btn:hover { background: linear-gradient(135deg, #4A4A4C 0%, #3C3C3E 100%); transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }`, 7);
    sheet.insertRule(`.vsc-btn.active { background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); font-weight: 600; border-color: rgba(255, 255, 255, 0.2); box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4); }`, 8);

    sheet.insertRule(`.vsc-slider-track { position: relative; flex: 1; height: 8px; background: linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.25) 100%); border-radius: 4px; cursor: pointer; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2); }`, 9);
    sheet.insertRule(`.vsc-slider-thumb { position: absolute; top: 50%; transform: translateY(-50%); width: 64px; height: 32px; background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border-radius: 10px; color: white; font-weight: 600; font-size: 13px; display: flex; justify-content: center; align-items: center; cursor: grab; box-shadow: 0 3px 12px rgba(0, 122, 255, 0.4); user-select: none; -webkit-user-select: none; border: 1px solid rgba(255, 255, 255, 0.2); }`, 10);
    sheet.insertRule(`.vsc-slider-thumb:active { cursor: grabbing; transform: translateY(-50%) scale(1.08); box-shadow: 0 4px 16px rgba(0, 122, 255, 0.5); }`, 11);
    sheet.insertRule(`.vsc-slider-controls { display: flex; align-items: center; gap: 10px; }`, 12);
    sheet.insertRule(`.vsc-step-btn { width: 32px; height: 32px; background: linear-gradient(135deg, #3A3A3C 0%, #2C2C2E 100%); border: 1px solid rgba(255, 255, 255, 0.1); color: #f5f5f7; border-radius: 50%; font-size: 20px; line-height: 32px; cursor: pointer; transition: all 0.2s ease; font-weight: 600; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }`, 13);
    sheet.insertRule(`.vsc-step-btn:hover { background: linear-gradient(135deg, #4A4A4C 0%, #3C3C3E 100%); transform: scale(1.1); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }`, 14);

    const SPEED_MIN = 0.1;
    const SPEED_MAX = 16.0;
    // --- 修改：15个预设速度(5x3布局) ---
    const config = [0.1, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 6.0, 8.0, 12.0, 16.0];
    let mainVideo = null;
    let curSpeed = localStorage.getItem("videoSpeed") || 1;
    const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>`;

    // --- 新增：修改B站原生倍速菜单的功能 ---
    function modifyBilibiliSpeedMenu() {
        // 检测是否在B站
        if (!window.location.hostname.includes('bilibili.com')) return;

        // 查找B站播放器倍速按钮并监听
        const observer = new MutationObserver(() => {
            const speedMenu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
            if (speedMenu && !speedMenu.dataset.modified) {
                speedMenu.dataset.modified = 'true';
                
                // 要删除的倍速
                const speedsToRemove = [0.75, 1.25];
                
                // 删除0.75x和1.25x
                speedsToRemove.forEach(speed => {
                    const itemToRemove = Array.from(speedMenu.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item')).find(item => {
                        return parseFloat(item.dataset.value) === speed;
                    });
                    if (itemToRemove) {
                        itemToRemove.remove();
                    }
                });
                
                // 新增的倍速
                const customSpeeds = [0.1, 2.5, 3.0, 4.0];
                
                customSpeeds.forEach(speed => {
                    // 检查是否已存在该倍速
                    const existingItem = Array.from(speedMenu.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item')).find(item => {
                        return parseFloat(item.dataset.value) === speed;
                    });
                    
                    if (!existingItem) {
                        const menuItem = document.createElement('li');
                        menuItem.className = 'bpx-player-ctrl-playbackrate-menu-item';
                        menuItem.dataset.value = speed;
                        menuItem.textContent = speed === 1.0 ? '1.0x 倍速' : `${speed}x`;
                        
                        menuItem.addEventListener('click', function() {
                            const video = document.querySelector('video');
                            if (video) {
                                video.playbackRate = speed;
                                curSpeed = speed;
                                localStorage.setItem("videoSpeed", speed);
                                updateUI(speed);
                                
                                // 更新B站UI的选中状态
                                speedMenu.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item').forEach(item => {
                                    item.classList.remove('bpx-state-active');
                                });
                                menuItem.classList.add('bpx-state-active');
                                
                                // 更新倍速按钮显示文本
                                const speedButton = document.querySelector('.bpx-player-ctrl-playbackrate-result');
                                if (speedButton) {
                                    speedButton.textContent = speed === 1.0 ? '倍速' : `${speed}x`;
                                }
                            }
                        });
                        
                        // B站的菜单是从下往上排列的,所以速度小的要插入到后面
                        // 按速度大小倒序插入(大的在前,小的在后)
                        const items = Array.from(speedMenu.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item'));
                        let inserted = false;
                        for (let i = 0; i < items.length; i++) {
                            const itemSpeed = parseFloat(items[i].dataset.value);
                            // 如果当前项的速度小于要插入的速度,插入到它前面
                            if (itemSpeed < speed) {
                                speedMenu.insertBefore(menuItem, items[i]);
                                inserted = true;
                                break;
                            }
                        }
                        // 如果没有插入,说明是最小的,添加到最后
                        if (!inserted) {
                            speedMenu.appendChild(menuItem);
                        }
                    }
                });
            }
        });

        // 开始观察DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function createSpeedController() {
        const container = document.createElement('div');
        container.className = 'vsc-container';
        const icon = document.createElement('div');
        icon.className = 'vsc-icon';
        icon.innerHTML = iconSVG;
        const panel = document.createElement('div');
        panel.className = 'vsc-panel';
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'vsc-options';
        config.forEach(speed => {
            const btn = document.createElement('button');
            btn.className = 'vsc-btn';
            btn.textContent = `${speed}x`;
            btn.dataset.speed = speed;
            optionsContainer.appendChild(btn);
        });
        const sliderControls = document.createElement('div');
        sliderControls.className = 'vsc-slider-controls';
        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'vsc-slider-track';
        const sliderThumb = document.createElement('div');
        sliderThumb.className = 'vsc-slider-thumb';
        sliderTrack.appendChild(sliderThumb);
        const btnDecrease = document.createElement('button');
        btnDecrease.className = 'vsc-step-btn';
        btnDecrease.textContent = '-';
        const btnIncrease = document.createElement('button');
        btnIncrease.className = 'vsc-step-btn';
        btnIncrease.textContent = '+';
        sliderControls.append(sliderTrack, btnDecrease, btnIncrease);
        panel.append(optionsContainer, sliderControls);
        container.append(icon, panel);
        document.body.appendChild(container);
        optionsContainer.addEventListener('click', (e) => { if (e.target.matches('.vsc-btn')) { curSpeed = parseFloat(e.target.dataset.speed); setVideoSpeed(curSpeed); } });
        sliderThumb.addEventListener('mousedown', onDragStart);
        sliderTrack.addEventListener('click', onTrackClick);
        btnDecrease.addEventListener('click', () => handleStepChange(-0.25));
        btnIncrease.addEventListener('click', () => handleStepChange(0.25));
        updateUI(curSpeed);
    }

    function handleStepChange(amount) { let newSpeed = parseFloat(curSpeed) + amount; newSpeed = Math.max(SPEED_MIN, Math.min(newSpeed, SPEED_MAX)); curSpeed = newSpeed; setVideoSpeed(curSpeed); }
    let isDragging = false;
    function onDragStart(e) { e.preventDefault(); isDragging = true; document.addEventListener('mousemove', onDragMove); document.addEventListener('mouseup', onDragEnd); }
    function onDragEnd() { isDragging = false; document.removeEventListener('mousemove', onDragMove); document.removeEventListener('mouseup', onDragEnd); }
    function onDragMove(e) { if (!isDragging) return; const track = document.querySelector('.vsc-slider-track'); if (!track) return; const rect = track.getBoundingClientRect(); const thumbWidth = document.querySelector('.vsc-slider-thumb').offsetWidth; let positionX = e.clientX - rect.left; positionX = Math.max(thumbWidth / 2, Math.min(positionX, rect.width - thumbWidth / 2)); const percentage = (positionX - thumbWidth / 2) / (rect.width - thumbWidth); curSpeed = SPEED_MIN + percentage * (SPEED_MAX - SPEED_MIN); setVideoSpeed(curSpeed); }
    function onTrackClick(e) { if (e.target.classList.contains('vsc-slider-thumb')) return; onDragMove(e); }

    function updateUI(speed) {
        const speedFloat = parseFloat(speed);
        const container = document.querySelector('.vsc-container');
        if (!container) return;
        const buttons = container.querySelectorAll('.vsc-btn');
        buttons.forEach(btn => { btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speedFloat); });
        const track = container.querySelector('.vsc-slider-track');
        const thumb = container.querySelector('.vsc-slider-thumb');
        if (!track || !thumb) return;
        thumb.textContent = `${speedFloat.toFixed(2)}x`;
        requestAnimationFrame(() => {
            const trackWidth = track.offsetWidth;
            const thumbWidth = thumb.offsetWidth;
            if (trackWidth <= 0 || thumbWidth <= 0) return;
            const percentage = (speedFloat - SPEED_MIN) / (SPEED_MAX - SPEED_MIN);
            const leftPosition = Math.max(0, Math.min(percentage * (trackWidth - thumbWidth), trackWidth - thumbWidth));
            thumb.style.left = `${leftPosition}px`;
        });
    }

    function setVideoSpeed(speed) {
        mainVideo = document.querySelector('video');
        if (mainVideo) {
            mainVideo.playbackRate = speed;
            localStorage.setItem("videoSpeed", speed);
            updateUI(speed);
        }
    }

    function initSpeedController() {
        const videoCheckInterval = setInterval(() => {
            mainVideo = document.querySelector('video');
            if (mainVideo) {
                if (!document.querySelector('.vsc-container')) {
                    createSpeedController();
                }
                setVideoSpeed(curSpeed);
                clearInterval(videoCheckInterval);
            }
        }, 500);
        
        // --- 新增：初始化B站倍速菜单修改 ---
        modifyBilibiliSpeedMenu();
    }

    initSpeedController();
})();