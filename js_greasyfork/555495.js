// ==UserScript==
// @name         音频倍速控制器
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  为页面中的audio标签增加倍速控制功能，提供可视化控制面板
// @author       You
// @match        https://www.tingshuw.com/play/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555495/%E9%9F%B3%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555495/%E9%9F%B3%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class AudioSpeedController {
        constructor() {
            this.speedOptions = [0.5, 0.75, 1,  1.5, 2];
            this.currentSpeed = 1;
            this.audioElements = [];
            this.controlPanel = null;
            this.isPlaying = false;
            this.progressUpdateInterval = null;
            this.init();
        }

        init() {
            this.findAudioElements();
            this.observeAudioElements();
            if (this.audioElements.length > 0) {
                this.createControlPanel();
                this.applySpeedToAll();
            }
        }

        findAudioElements() {
            this.audioElements = Array.from(document.querySelectorAll('audio'));

            // 检查所有iframe中的audio元素
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const iframeAudios = iframeDoc.querySelectorAll('audio');
                    this.audioElements.push(...Array.from(iframeAudios));
                } catch (e) {
                    // 跨域iframe无法访问，忽略
                    console.log('无法访问跨域iframe:', e);
                }
            });

            console.log(`找到 ${this.audioElements.length} 个音频元素`);
        }

        observeAudioElements() {
            // 监听主页面DOM变化
            const observer = new MutationObserver((mutations) => {
                let hasNewAudio = false;
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'AUDIO') {
                                this.addAudioElement(node);
                                hasNewAudio = true;
                            } else if (node.tagName === 'IFRAME') {
                                // 新增iframe时延迟检查内部audio元素
                                setTimeout(() => {
                                    this.checkIframeAudios(node);
                                }, 100);
                            } else if (node.querySelectorAll) {
                                const audioElements = node.querySelectorAll('audio');
                                audioElements.forEach(audio => this.addAudioElement(audio));
                                if (audioElements.length > 0) hasNewAudio = true;

                                // 检查新增节点中的iframe
                                const iframes = node.querySelectorAll('iframe');
                                iframes.forEach(iframe => {
                                    setTimeout(() => {
                                        this.checkIframeAudios(iframe);
                                    }, 100);
                                });
                            }
                        }
                    });
                });

                // 如果发现新的audio元素且没有面板，则创建面板
                if (hasNewAudio && !document.getElementById('audio-speed-controller')) {
                    this.createControlPanel();
                    this.applySpeedToAll();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 定期检查iframe中的audio元素
            setInterval(() => {
                this.checkAllIframeAudios();
            }, 3000);
        }

        addAudioElement(audio) {
            if (!this.audioElements.includes(audio)) {
                this.audioElements.push(audio);
                audio.playbackRate = this.currentSpeed;
                console.log('发现新的音频元素，已应用倍速');
            }
        }

        checkIframeAudios(iframe) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const iframeAudios = iframeDoc.querySelectorAll('audio');
                let hasNewAudio = false;

                iframeAudios.forEach(audio => {
                    if (!this.audioElements.includes(audio)) {
                        this.audioElements.push(audio);
                        audio.playbackRate = this.currentSpeed;
                        hasNewAudio = true;
                    }
                });

                if (hasNewAudio && !document.getElementById('audio-speed-controller')) {
                    this.createControlPanel();
                    this.applySpeedToAll();
                }

                return hasNewAudio;
            } catch (e) {
                // 跨域iframe无法访问，忽略
                return false;
            }
        }

        checkAllIframeAudios() {
            const iframes = document.querySelectorAll('iframe');
            let hasNewAudio = false;

            iframes.forEach(iframe => {
                if (this.checkIframeAudios(iframe)) {
                    hasNewAudio = true;
                }
            });

            if (hasNewAudio) {
                this.updateUI();
            }
        }

        createControlPanel() {
            if (document.getElementById('audio-speed-controller')) {
                return;
            }

            const panel = document.createElement('div');
            panel.id = 'audio-speed-controller';
            panel.innerHTML = `
                <div class="audio-player">
                    <div class="player-header">
                        <div class="window-controls">
                            <button class="window-btn close"></button>
                            <button class="window-btn minimize"></button>
                            <button class="window-btn maximize"></button>
                        </div>
                        <div class="player-title">🎵 音频播放增强</div>
                    </div>

                    <div class="player-body">
                        <!-- 音频可视化 -->
                        <div class="visualizer">
                            <div class="audio-waves">
                                <div class="wave"></div>
                                <div class="wave"></div>
                                <div class="wave"></div>
                                <div class="wave"></div>
                                <div class="wave"></div>
                            </div>
                        </div>

                        <!-- 主控制区 -->
                        <div class="main-controls">
                            <button class="control-btn prev-btn" title="后退10秒">⏪</button>
                            <button class="control-btn play-pause-btn" id="playPauseBtn" title="播放/暂停">
                                <span class="play-icon">▶️</span>
                                <span class="pause-icon">⏸️</span>
                            </button>
                            <button class="control-btn next-btn" title="前进10秒">⏩</button>
                        </div>

                        <!-- 进度条 -->
                        <div class="progress-section">
                            <div class="time-info">
                                <span class="current-time">00:00</span>
                                <span class="duration">00:00</span>
                            </div>
                            <div class="progress-container">
                                <div class="progress-track">
                                    <div class="progress-buffer"></div>
                                    <div class="progress-fill"></div>
                                    <div class="progress-handle"></div>
                                </div>
                            </div>
                        </div>


                        <!-- 倍速控制 -->
                        <div class="speed-section">
                            <div class="speed-display">
                                <span class="speed-label">Speed</span>
                                <span class="speed-value">${this.currentSpeed}x</span>
                            </div>
                            <div class="speed-presets">
                                ${this.speedOptions.map(speed =>
                                    `<button class="speed-preset ${speed === this.currentSpeed ? 'active' : ''}" data-speed="${speed}">${speed}x</button>`
                                ).join('')}
                            </div>
                            <div class="custom-speed">
                                <input type="range" class="speed-slider" min="0.1" max="4" step="0.1" value="${this.currentSpeed}">
                                <input type="number" class="speed-input" min="0.1" max="4" step="0.1" value="${this.currentSpeed}">
                            </div>
                        </div>

                        <!-- 状态栏 -->
                        <div class="status-bar">
                            <span class="audio-indicator">🎧</span>
                            <span class="audio-count">${this.audioElements.length} 音频源</span>
                        </div>
                    </div>
                </div>
            `;

            this.addPanelStyles();
            document.body.appendChild(panel);
            this.setupPanelEvents();
            this.makePanelDraggable(panel);
        }

        addPanelStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #audio-speed-controller {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 14px;
                    color: #333;
                }

                .audio-player {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                    width: 360px;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                .player-header {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 12px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    user-select: none;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .window-controls {
                    display: flex;
                    gap: 8px;
                }

                .window-btn {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .window-btn.close {
                    background: #ff5f56;
                }

                .window-btn.minimize {
                    background: #ffbd2e;
                }

                .window-btn.maximize {
                    background: #27ca3f;
                }

                .window-btn:hover {
                    opacity: 0.8;
                }

                .player-title {
                    color: #fff;
                    font-weight: 600;
                    font-size: 16px;
                    flex: 1;
                    text-align: center;
                }

                .settings-btn {
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 16px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background 0.2s;
                }

                .settings-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .player-body {
                    padding: 20px;
                }

                /* 音频可视化 */
                .visualizer {
                    margin-bottom: 20px;
                }

                .audio-waves {
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    height: 40px;
                    gap: 3px;
                }

                .wave {
                    width: 4px;
                    background: linear-gradient(to top, #667eea, #764ba2);
                    border-radius: 2px;
                    animation: wave 1.2s ease-in-out infinite;
                }

                .wave:nth-child(1) { animation-delay: 0s; height: 20px; }
                .wave:nth-child(2) { animation-delay: 0.1s; height: 30px; }
                .wave:nth-child(3) { animation-delay: 0.2s; height: 25px; }
                .wave:nth-child(4) { animation-delay: 0.3s; height: 35px; }
                .wave:nth-child(5) { animation-delay: 0.4s; height: 28px; }

                @keyframes wave {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(0.3); }
                }

                /* 主控制区 */
                .main-controls {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .control-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: #fff;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(5px);
                }

                .control-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }

                .play-pause-btn {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-size: 24px;
                }

                .play-pause-btn:hover {
                    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
                }

                .pause-icon {
                    display: none;
                }

                .play-pause-btn.playing .play-icon {
                    display: none;
                }

                .play-pause-btn.playing .pause-icon {
                    display: inline;
                }

                /* 进度条 */
                .progress-section {
                    margin-bottom: 20px;
                }

                .time-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 500;
                }

                .progress-container {
                    position: relative;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    cursor: pointer;
                    overflow: hidden;
                }

                .progress-track {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                .progress-buffer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                    width: 30%;
                }

                .progress-fill {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    background: linear-gradient(90deg, #667eea, #764ba2);
                    border-radius: 3px;
                    width: 0%;
                    transition: width 0.1s ease;
                }

                .progress-handle {
                    position: absolute;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 14px;
                    height: 14px;
                    background: #fff;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    left: 0%;
                    transition: left 0.1s ease;
                }

                .progress-container:hover .progress-handle {
                    width: 16px;
                    height: 16px;
                }


                /* 倍速控制 */
                .speed-section {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 16px;
                }

                .speed-display {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .speed-label {
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 500;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .speed-value {
                    color: #fff;
                    font-weight: 700;
                    font-size: 18px;
                }

                .speed-presets {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 12px;
                    flex-wrap: wrap;
                }

                .speed-preset {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: rgba(255, 255, 255, 0.8);
                    border-radius: 6px;
                    padding: 6px 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 12px;
                    font-weight: 500;
                    min-width: 40px;
                    text-align: center;
                }

                .speed-preset:hover {
                    background: rgba(255, 255, 255, 0.2);
                    color: #fff;
                    transform: translateY(-1px);
                }

                .speed-preset.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #fff;
                    border-color: transparent;
                }

                .custom-speed {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .speed-slider {
                    flex: 1;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    outline: none;
                    -webkit-appearance: none;
                }

                .speed-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
                }

                .speed-slider::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
                }

                .speed-input {
                    width: 60px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #fff;
                    border-radius: 6px;
                    padding: 6px 8px;
                    text-align: center;
                    font-weight: 500;
                    font-size: 12px;
                }

                .speed-input:focus {
                    outline: none;
                    border-color: #667eea;
                    background: rgba(255, 255, 255, 0.15);
                }

                /* 状态栏 */
                .status-bar {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 11px;
                }

                .audio-indicator {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                /* 响应式设计 */
                @media (max-width: 400px) {
                    .audio-player {
                        width: 320px;
                    }

                    .speed-presets {
                        gap: 4px;
                    }

                    .speed-preset {
                        padding: 4px 8px;
                        min-width: 36px;
                        font-size: 11px;
                    }
                }

                /* 暗色主题适配 */
                .audio-player * {
                    box-sizing: border-box;
                }
            `;
            document.head.appendChild(style);
        }

        setupPanelEvents() {
            const panel = document.getElementById('audio-speed-controller');
            const speedButtons = panel.querySelectorAll('.speed-preset');
            const speedSlider = panel.querySelector('.speed-slider');
            const speedInput = panel.querySelector('.speed-input');
            const minimizeBtn = panel.querySelector('.window-btn.minimize');
            const closeBtn = panel.querySelector('.window-btn.close');
            const playPauseBtn = panel.querySelector('#playPauseBtn');
            const prevBtn = panel.querySelector('.prev-btn');
            const nextBtn = panel.querySelector('.next-btn');
            const progressContainer = panel.querySelector('.progress-container');

            speedButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const speed = parseFloat(btn.dataset.speed);
                    this.setSpeed(speed);
                });
            });

            speedSlider.addEventListener('input', (e) => {
                const speed = parseFloat(e.target.value);
                this.setSpeed(speed);
                speedInput.value = speed;
            });

            speedInput.addEventListener('change', (e) => {
                let speed = parseFloat(e.target.value);
                if (isNaN(speed) || speed < 0.1) speed = 0.1;
                if (speed > 4) speed = 4;
                speed = Math.round(speed * 10) / 10;
                this.setSpeed(speed);
                speedSlider.value = speed;
                speedInput.value = speed;
            });

            minimizeBtn.addEventListener('click', () => {
                const playerBody = panel.querySelector('.player-body');
                playerBody.style.display = playerBody.style.display === 'none' ? 'block' : 'none';
            });

            // 播放/暂停按钮事件
            playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });

            // 后退10秒按钮事件
            prevBtn.addEventListener('click', () => {
                this.seekBy(-10);
            });

            // 前进10秒按钮事件
            nextBtn.addEventListener('click', () => {
                this.seekBy(10);
            });

            // 进度条点击事件
            progressContainer.addEventListener('click', (e) => {
                this.seekTo(e);
            });

            closeBtn.addEventListener('click', () => {
                panel.remove();
            });

            setInterval(() => {
                this.updateAudioCount();
            }, 2000);

            // 启动进度更新定时器
            this.startProgressUpdate();
        }

        makePanelDraggable(element) {
            const header = element.querySelector('.player-header');
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            function dragStart(e) {
                if (e.type === "touchstart") {
                    initialX = e.touches[0].clientX - xOffset;
                    initialY = e.touches[0].clientY - yOffset;
                } else {
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                }

                if (e.target === header || header.contains(e.target)) {
                    isDragging = true;
                }
            }

            function dragEnd(e) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();

                    if (e.type === "touchmove") {
                        currentX = e.touches[0].clientX - initialX;
                        currentY = e.touches[0].clientY - initialY;
                    } else {
                        currentX = e.clientX - initialX;
                        currentY = e.clientY - initialY;
                    }

                    xOffset = currentX;
                    yOffset = currentY;

                    element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                }
            }

            header.addEventListener('touchstart', dragStart, false);
            header.addEventListener('touchend', dragEnd, false);
            header.addEventListener('touchmove', drag, false);
            header.addEventListener('mousedown', dragStart, false);
            header.addEventListener('mouseup', dragEnd, false);
            header.addEventListener('mousemove', drag, false);
        }

        setSpeed(speed) {
            this.currentSpeed = speed;
            this.applySpeedToAll();
            this.updateUI();
        }

        applySpeedToAll() {
            this.audioElements.forEach(audio => {
                if (audio && audio.playbackRate !== undefined) {
                    audio.playbackRate = this.currentSpeed;
                }
            });
        }

        updateUI() {
            const panel = document.getElementById('audio-speed-controller');
            if (!panel) return;

            const speedValue = panel.querySelector('.speed-value');
            const speedButtons = panel.querySelectorAll('.speed-preset');
            const speedSlider = panel.querySelector('.speed-slider');
            const speedInput = panel.querySelector('.speed-input');

            if (speedValue) speedValue.textContent = this.currentSpeed + 'x';

            speedButtons.forEach(btn => {
                const btnSpeed = parseFloat(btn.dataset.speed);
                if (btnSpeed === this.currentSpeed) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            if (speedSlider) speedSlider.value = this.currentSpeed;
            if (speedInput) speedInput.value = this.currentSpeed;
        }

        updateAudioCount() {
            this.findAudioElements();
            const panel = document.getElementById('audio-speed-controller');

            // 如果没有音频元素，移除面板
            if (this.audioElements.length === 0) {
                if (panel) {
                    panel.remove();
                }
                return;
            }

            if (!panel) return;

            const countElement = panel.querySelector('.audio-count');
            if (countElement) {
                countElement.textContent = this.audioElements.length + ' 音频源';
            }

            this.applySpeedToAll();
        }

        // 播放/暂停切换
        togglePlayPause() {
            if (this.audioElements.length === 0) return;

            const playPauseBtn = document.querySelector('#playPauseBtn');
            if (!playPauseBtn) return;

            if (this.isPlaying) {
                this.pauseAll();
                playPauseBtn.textContent = '▶️ 播放';
                this.isPlaying = false;
            } else {
                this.playAll();
                playPauseBtn.textContent = '⏸️ 暂停';
                this.isPlaying = true;
            }
        }

        // 播放所有音频
        playAll() {
            this.audioElements.forEach(audio => {
                if (audio && audio.paused) {
                    audio.play().catch(e => {
                        console.log('播放失败:', e);
                    });
                }
            });
        }

        // 暂停所有音频
        pauseAll() {
            this.audioElements.forEach(audio => {
                if (audio && !audio.paused) {
                    audio.pause();
                }
            });
        }

        // 停止所有音频
        stopAll() {
            this.pauseAll();
            this.audioElements.forEach(audio => {
                if (audio) {
                    audio.currentTime = 0;
                }
            });

            const playPauseBtn = document.querySelector('#playPauseBtn');
            if (playPauseBtn) {
                playPauseBtn.textContent = '▶️ 播放';
            }
            this.isPlaying = false;
        }

        // 跳转到指定位置
        seekTo(event) {
            if (this.audioElements.length === 0) return;

            const progressContainer = event.currentTarget;
            const rect = progressContainer.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const percentage = clickX / rect.width;

            this.audioElements.forEach(audio => {
                if (audio && audio.duration) {
                    audio.currentTime = audio.duration * percentage;
                }
            });
        }

        // 启动进度更新
        startProgressUpdate() {
            if (this.progressUpdateInterval) {
                clearInterval(this.progressUpdateInterval);
            }

            this.progressUpdateInterval = setInterval(() => {
                this.updateProgress();
            }, 100);
        }

        // 更新进度显示
        updateProgress() {
            if (this.audioElements.length === 0) return;

            const panel = document.getElementById('audio-speed-controller');
            if (!panel) return;

            // 获取第一个音频元素的进度（如果有多个音频，以第一个为准）
            const audio = this.audioElements[0];
            if (!audio) return;

            const currentTimeEl = panel.querySelector('.current-time');
            const durationEl = panel.querySelector('.duration');
            const progressFill = panel.querySelector('.progress-fill');
            const progressHandle = panel.querySelector('.progress-handle');

            if (currentTimeEl && audio.currentTime !== undefined) {
                currentTimeEl.textContent = this.formatTime(audio.currentTime);
            }

            if (durationEl && audio.duration !== undefined) {
                durationEl.textContent = this.formatTime(audio.duration);
            }

            if (progressFill && progressHandle && audio.duration && audio.currentTime !== undefined) {
                const percentage = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = percentage + '%';
                progressHandle.style.left = percentage + '%';
            }
        }

        // 格式化时间显示
        formatTime(seconds) {
            if (isNaN(seconds) || !isFinite(seconds)) {
                return '00:00';
            }

            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new AudioSpeedController();
        });
    } else {
        new AudioSpeedController();
    }

})();
