// ==UserScript==
// @name         后盾人视频自动连播和倍速播放
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  在后盾人视频网站实现自动连播并设置1.5倍播放速度，支持隐藏设置窗口
// @author       fintinger
// @match        https://www.houdunren.com/video/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561480/%E5%90%8E%E7%9B%BE%E4%BA%BA%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%E5%92%8C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/561480/%E5%90%8E%E7%9B%BE%E4%BA%BA%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%E5%92%8C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        autoPlayNext: true,      // 是否自动连播
        playbackRate: 1.5,       // 播放速度
        checkInterval: 1000,     // 检查间隔（毫秒）
        nextVideoDelay: 500     // 播放下一个视频的延迟（毫秒）
    };

    class VideoAutoPlayer {
        constructor() {
            this.currentVideoId = this.getCurrentVideoId();
            this.videoElement = null;
            this.isSettingUp = false;
            this.isPanelVisible = true; // 面板默认可见
            this.init();
        }

        // 获取当前视频ID
        getCurrentVideoId() {
            const match = window.location.pathname.match(/\/video\/(\d+)/);
            return match ? parseInt(match[1], 10) : null;
        }

        // 初始化
        init() {
            console.log('后盾人视频助手已加载，当前视频ID:', this.currentVideoId);
            this.loadUserSettings();
            this.loadPanelVisibility();
            this.waitForVideo();
            this.setupKeyboardShortcuts();
            this.addGlobalEventListeners();
            // 创建浮动显示按钮（默认隐藏）
            this.createFloatButton();
        }

        // 加载用户设置
        loadUserSettings() {
            const savedRate = localStorage.getItem('houdunren_playback_rate');
            const savedAutoPlay = localStorage.getItem('houdunren_auto_play');

            if (savedRate) {
                CONFIG.playbackRate = parseFloat(savedRate);
            }

            if (savedAutoPlay !== null) {
                CONFIG.autoPlayNext = savedAutoPlay === 'true';
            }
        }

        // 加载面板可见性设置
        loadPanelVisibility() {
            const savedVisibility = localStorage.getItem('houdunren_panel_visible');
            if (savedVisibility !== null) {
                this.isPanelVisible = savedVisibility === 'true';
            }
        }

        // 保存面板可见性设置
        savePanelVisibility() {
            localStorage.setItem('houdunren_panel_visible', this.isPanelVisible);
        }

        // 等待视频元素加载
        waitForVideo() {
            const observer = new MutationObserver((mutations) => {
                if (!this.videoElement || this.videoElement.parentNode === null) {
                    this.findVideoElement();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 初始查找
            setTimeout(() => this.findVideoElement(), 1000);
        }

        // 查找视频元素
        findVideoElement() {
            if (this.isSettingUp) return;

            // 尝试多种选择器查找视频元素
            const selectors = [
                'video',
                '.video-player video',
                'iframe[src*="video"]',
                'video[src*="video"]',
                '[class*="video"] video',
                '[class*="player"] video'
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && element.tagName === 'VIDEO') {
                    this.setupVideo(element);
                    break;
                }
            }

            // 如果没有找到，尝试查找iframe内的视频
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach((iframe, index) => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const iframeVideo = iframeDoc.querySelector('video');
                    if (iframeVideo) {
                        this.setupVideo(iframeVideo);
                    }
                } catch (e) {
                    // 跨域iframe，无法访问
                }
            });
        }

        // 设置视频元素
        setupVideo(videoElement) {
            if (this.isSettingUp || !videoElement) return;

            this.isSettingUp = true;
            this.videoElement = videoElement;

            //console.log('找到视频元素，开始设置...');

            // 设置播放速度
            this.setPlaybackRate();

            // 添加事件监听
            this.addVideoEventListeners();

            // 创建控制面板
            this.createControlPanel();

            this.isSettingUp = false;
        }

        // 设置播放速度
        setPlaybackRate() {
            if (!this.videoElement) return;

            try {
                this.videoElement.playbackRate = CONFIG.playbackRate;
               // console.log(`已设置播放速度为 ${CONFIG.playbackRate} 倍`);
            } catch (error) {
                console.warn('设置播放速度失败:', error);
            }
        }

        // 添加视频事件监听
        addVideoEventListeners() {
            if (!this.videoElement) return;

            // 视频结束事件
            this.videoElement.addEventListener('ended', () => {
               // console.log('视频播放结束');
                if (CONFIG.autoPlayNext) {
                    this.playNextVideo();
                }
            });

            // 视频错误事件
            this.videoElement.addEventListener('error', (e) => {
                console.warn('视频播放错误:', e);
            });
        }

        // 播放下一个视频
        playNextVideo() {
            if (!this.currentVideoId) return;

            const nextId = this.currentVideoId + 1;
           // console.log(`准备播放下一个视频，ID: ${nextId}`);

            // 延迟跳转，给用户查看信息的时间
            setTimeout(() => {
                window.history.pushState({ videoId: this.currentVideoId }, '',`https://www.houdunren.com/video/${nextId}`);
               // window.location.href = `https://www.houdunren.com/video/${nextId}`;
            }, CONFIG.nextVideoDelay);
        }

        // 播放上一个视频
        playPrevVideo() {
            if (!this.currentVideoId || this.currentVideoId <= 1) return;

            const prevId = this.currentVideoId - 1;
           // console.log(`准备播放上一个视频，ID: ${prevId}`);

            setTimeout(() => {
                window.history.pushState({ videoId: this.currentVideoId }, '',`https://www.houdunren.com/video/${prevId}`);
                //window.location.href = `https://www.houdunren.com/video/${prevId}`;
            }, CONFIG.nextVideoDelay);
        }

        // 调整播放速度
        adjustPlaybackRate(change) {
            if (!this.videoElement) return;

            const newRate = Math.max(0.25, Math.min(4, this.videoElement.playbackRate + change));
            this.videoElement.playbackRate = newRate;

            // 更新配置和UI
            CONFIG.playbackRate = newRate;
            localStorage.setItem('houdunren_playback_rate', newRate);
            this.updateControlPanel();

            //console.log(`播放速度已调整为 ${newRate} 倍`);
        }

        // 创建控制面板
        createControlPanel() {
            // 移除可能存在的旧面板
            const oldPanel = document.getElementById('video-helper-panel');
            if (oldPanel) oldPanel.remove();

            // 创建面板容器
            const panel = document.createElement('div');
            panel.id = 'video-helper-panel';
            panel.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: rgba(0, 0, 0, 0.85);
                color: white;
                padding: 0;
                border-radius: 8px;
                z-index: 99999;
                font-family: Arial, sans-serif;
                font-size: 14px;
                min-width: 220px;
                box-shadow: 0 2px 15px rgba(0,0,0,0.4);
                border: 1px solid #333;
                overflow: hidden;
                user-select: none;
                display: ${this.isPanelVisible ? 'block' : 'none'};
            `;

            // 添加面板内容
            panel.innerHTML = `
                <div id="panel-header" style="padding: 12px 15px; background: rgba(0, 123, 255, 0.8); cursor: move; font-weight: bold; border-bottom: 1px solid #0056b3; display: flex; justify-content: space-between; align-items: center;">
                    <span>视频助手控制面板</span>
                    <div style="display: flex; gap: 5px;">
                        <button id="hide-panel-btn" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px; padding: 0 5px;" title="隐藏/显示面板 (快捷键: H)">
                            ${this.isPanelVisible ? '−' : '+'}
                        </button>
                    </div>
                </div>
                <div style="padding: 15px;">
                    <div style="margin-bottom: 15px;">
                        <div style="margin-bottom: 5px; font-weight: bold;">播放速度: <span id="current-speed">${CONFIG.playbackRate}</span>x</div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button id="speed-down" style="padding: 3px 8px; background: #555; color: white; border: none; border-radius: 4px; cursor: pointer;">-</button>
                            <input type="range" id="speed-slider" min="0.25" max="4" step="0.25" value="${CONFIG.playbackRate}"
                                   style="flex: 1; cursor: pointer;">
                            <button id="speed-up" style="padding: 3px 8px; background: #555; color: white; border: none; border-radius: 4px; cursor: pointer;">+</button>
                        </div>
                    </div>
                    <div style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 4px;">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" id="auto-play-toggle" ${CONFIG.autoPlayNext ? 'checked' : ''}>
                            <span style="margin-left: 8px;">自动连播</span>
                        </label>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 12px; color: #aaa; margin-bottom: 8px;">快捷键:</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 11px;">
                            <div>[ 减速</div>
                            <div>] 加速</div>
                            <div>← 上一个</div>
                            <div>→ 下一个</div>
                            <div>H 隐藏面板</div>
                            <div>R 重置速度</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button id="prev-btn" style="flex: 1; padding: 8px; background: #555; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                            ← 上一个
                        </button>
                        <button id="next-btn" style="flex: 1; padding: 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                            下一个 →
                        </button>
                    </div>
                </div>
            `;

            // 添加到页面
            document.body.appendChild(panel);

            // 添加事件监听
            this.setupControlPanelEvents(panel);

            // 使面板可拖拽
            this.makeDraggable(panel.querySelector('#panel-header'), panel);

            // 更新浮动按钮状态
            this.updateFloatButton();
        }

        // 创建浮动按钮（当面板隐藏时显示）
        createFloatButton() {
            // 移除可能存在的旧按钮
            const oldButton = document.getElementById('video-helper-float-btn');
            if (oldButton) oldButton.remove();

            const floatBtn = document.createElement('div');
            floatBtn.id = 'video-helper-float-btn';
            floatBtn.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 123, 255, 0.9);
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: ${this.isPanelVisible ? 'none' : 'flex'};
                justify-content: center;
                align-items: center;
                z-index: 99998;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                user-select: none;
            `;
            floatBtn.textContent = '+';
            floatBtn.title = '显示控制面板 (快捷键: H)';

            // 鼠标悬停效果
            floatBtn.addEventListener('mouseenter', () => {
                floatBtn.style.transform = 'scale(1.1)';
                floatBtn.style.background = 'rgba(0, 123, 255, 1)';
            });

            floatBtn.addEventListener('mouseleave', () => {
                floatBtn.style.transform = 'scale(1)';
                floatBtn.style.background = 'rgba(0, 123, 255, 0.9)';
            });

            // 点击显示面板
            floatBtn.addEventListener('click', () => {
                this.togglePanelVisibility();
            });

            // 添加拖拽功能
            this.makeFloatButtonDraggable(floatBtn);

            document.body.appendChild(floatBtn);
        }

        // 使浮动按钮可拖拽
        makeFloatButtonDraggable(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            element.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                const newTop = element.offsetTop - pos2;
                const newLeft = element.offsetLeft - pos1;

                // 限制在可视区域内
                const maxTop = window.innerHeight - element.offsetHeight;
                const maxLeft = window.innerWidth - element.offsetWidth;

                element.style.top = Math.max(0, Math.min(newTop, maxTop)) + "px";
                element.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + "px";
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        // 更新浮动按钮状态
        updateFloatButton() {
            const floatBtn = document.getElementById('video-helper-float-btn');
            if (floatBtn) {
                floatBtn.style.display = this.isPanelVisible ? 'none' : 'flex';
            }
        }

        // 设置控制面板事件
        setupControlPanelEvents(panel) {
            // 速度滑块
            const speedSlider = panel.querySelector('#speed-slider');
            speedSlider.addEventListener('input', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                const speed = parseFloat(e.target.value);
                if (this.videoElement) {
                    this.videoElement.playbackRate = speed;
                    CONFIG.playbackRate = speed;
                    localStorage.setItem('houdunren_playback_rate', speed);
                    panel.querySelector('#current-speed').textContent = speed;
                }
            });

            // 减速按钮
            panel.querySelector('#speed-down').addEventListener('click', (e) => {
                e.stopPropagation();
                this.adjustPlaybackRate(-0.25);
            });

            // 加速按钮
            panel.querySelector('#speed-up').addEventListener('click', (e) => {
                e.stopPropagation();
                this.adjustPlaybackRate(0.25);
            });

            // 自动连播切换
            const autoPlayToggle = panel.querySelector('#auto-play-toggle');
            autoPlayToggle.addEventListener('change', (e) => {
                CONFIG.autoPlayNext = e.target.checked;
                localStorage.setItem('houdunren_auto_play', e.target.checked);
            });

            // 上一个按钮
            panel.querySelector('#prev-btn').addEventListener('click', () => {
                this.playPrevVideo();
            });

            // 下一个按钮
            panel.querySelector('#next-btn').addEventListener('click', () => {
                this.playNextVideo();
            });

            // 隐藏面板按钮
            const hideBtn = panel.querySelector('#hide-panel-btn');
            hideBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePanelVisibility();
            });
        }

        // 切换面板可见性
        togglePanelVisibility() {
            this.isPanelVisible = !this.isPanelVisible;

            const panel = document.getElementById('video-helper-panel');
            const hideBtn = panel?.querySelector('#hide-panel-btn');
            const floatBtn = document.getElementById('video-helper-float-btn');

            if (panel) {
                panel.style.display = this.isPanelVisible ? 'block' : 'none';

                if (hideBtn) {
                    hideBtn.textContent = this.isPanelVisible ? '−' : '+';
                    hideBtn.title = this.isPanelVisible ? '隐藏面板 (快捷键: H)' : '显示面板 (快捷键: H)';
                }
            }

            if (floatBtn) {
                floatBtn.style.display = this.isPanelVisible ? 'none' : 'flex';
            }

            // 保存设置
            this.savePanelVisibility();

           // console.log(`控制面板已${this.isPanelVisible ? '显示' : '隐藏'}`);
        }

        // 更新控制面板
        updateControlPanel() {
            const panel = document.getElementById('video-helper-panel');
            if (!panel) return;

            const speedSpan = panel.querySelector('#current-speed');
            const speedSlider = panel.querySelector('#speed-slider');
            const autoPlayToggle = panel.querySelector('#auto-play-toggle');

            if (speedSpan) speedSpan.textContent = CONFIG.playbackRate;
            if (speedSlider) speedSlider.value = CONFIG.playbackRate;
            if (autoPlayToggle) autoPlayToggle.checked = CONFIG.autoPlayNext;
        }

        // 使面板可拖拽
        makeDraggable(dragElement, targetElement) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            dragElement.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                // 移除固定宽度限制，让面板可以自然缩放
                targetElement.style.top = (targetElement.offsetTop - pos2) + "px";
                targetElement.style.left = (targetElement.offsetLeft - pos1) + "px";
                targetElement.style.right = "auto"; // 移除right定位
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        // 设置键盘快捷键（全局监听）
        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // 防止在输入框中触发
                if (e.target.tagName === 'INPUT' ||
                    e.target.tagName === 'TEXTAREA' ||
                    e.target.isContentEditable) {
                    return;
                }

                switch(e.key.toLowerCase()) {
                    case ']': // 加速
                        e.preventDefault();
                        this.adjustPlaybackRate(0.25);
                        break;
                    case '[': // 减速
                        e.preventDefault();
                        this.adjustPlaybackRate(-0.25);
                        break;
                    case 'arrowright': // 下一个视频
                        e.preventDefault();
                        this.playNextVideo();
                        break;
                    case 'arrowleft': // 上一个视频
                        e.preventDefault();
                        this.playPrevVideo();
                        break;
                    case 'r': // 重置速度
                        e.preventDefault();
                        if (this.videoElement) {
                            this.videoElement.playbackRate = 1.0;
                            CONFIG.playbackRate = 1.0;
                            this.updateControlPanel();
                        }
                        break;
                    case 'h': // 隐藏/显示面板
                        e.preventDefault();
                        this.togglePanelVisibility();
                        break;
                }
            }, true);
        }

        // 添加全局事件监听
        addGlobalEventListeners() {
            // 监听页面切换（单页应用）
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    setTimeout(() => {
                        this.currentVideoId = this.getCurrentVideoId();
                        console.log('页面切换，新视频ID:', this.currentVideoId);
                    }, 500);
                }
            }).observe(document, { subtree: true, childList: true });
        }
    }

    // 页面加载完成后初始化
    window.addEventListener('load', () => {
        // 延迟初始化，确保页面完全加载
        setTimeout(() => {
            window.videoPlayer = new VideoAutoPlayer();
        }, 2000);
    });

    // 如果页面已经加载完成，立即初始化
    if (document.readyState === 'complete') {
        window.videoPlayer = new VideoAutoPlayer();
    }

})();