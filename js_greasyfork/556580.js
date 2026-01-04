// ==UserScript==
// @name         苏大双创教育平台刷课插件
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  目前能够稳定运行 - 注意：需在扩展开发者模式下使用
// @author       Shimamura
// @match        https://suda.wnssedu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556580/%E8%8B%8F%E5%A4%A7%E5%8F%8C%E5%88%9B%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/556580/%E8%8B%8F%E5%A4%A7%E5%8F%8C%E5%88%9B%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        // 播放设置
        playbackRate: 1.0,
        autoSkip: true,
        autoContinue: true,

        // 检测设置
        detectionInterval: 2000,
        skipDelay: 1200,

        // 时长模拟设置
        simulateNormalProgress: true,
        progressReportInterval: 40000,
        minWatchPercentage: 0.95,

        // 新增功能设置
        permanentMute: true,
        autoResume: true,

        // 新增：时长伪造配置
        enableTimeForgery: true,
        minForgedProgress: 0.95,
        maxStayTimeMultiplier: 1.2,
        simulateHumanBehavior: true,
        randomizeIntervals: true,
        forgeNetworkRequests: true,

        log: false
    };

    // 新增：时长伪造系统类
    class TimeForgerySystem {
        constructor() {
            this.forgedWatchTime = 0; // 伪造的观看时长
            this.realWatchTime = 0;   // 实际观看时长
            this.videoStartTime = 0;  // 视频开始时间
            this.playbackRate = 1.0;  // 当前播放速率
            this.video = null;
        }

        // 核心伪造算法
        simulateNormalProgress() {
            if (!this.video) return;

            const currentRealTime = (Date.now() - this.videoStartTime) / 1000; // 实际秒数
            const videoDuration = this.video.duration;

            // 计算伪造的观看时长（模拟1倍速观看）
            this.forgedWatchTime = Math.min(
                currentRealTime * this.playbackRate, // 关键：实际时间 × 倍速
                videoDuration
            );

            // 确保伪造时长不会超过视频总时长
            if (this.forgedWatchTime >= videoDuration) {
                this.forgedWatchTime = videoDuration;
            }
        }

        // 伪造页面停留时间相关指标
        forgePageStayMetrics() {
            // 1. 伪造鼠标活动（保持页面"活跃"状态）
            this.forgeMouseActivity();

            // 2. 伪造焦点状态（页面始终在前台）
            this.forgeFocusState();

            // 3. 伪造网络活动（模拟正常用户请求）
            this.forgeNetworkActivity();

            // 4. 伪造视频事件（模拟正常播放行为）
            this.forgeVideoEvents();
        }

        forgeMouseActivity() {
            // 随机但合理的鼠标移动
            const moveMouse = () => {
                const x = 100 + Math.random() * (window.innerWidth - 200);
                const y = 100 + Math.random() * (window.innerHeight - 200);

                document.dispatchEvent(new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    clientX: x,
                    clientY: y,
                    movementX: (Math.random() - 0.5) * 10,
                    movementY: (Math.random() - 0.5) * 10
                }));
            };

            // 每30-120秒随机移动一次鼠标
            setTimeout(moveMouse, 30000 + Math.random() * 90000);
        }

        forgeFocusState() {
            // 确保页面始终显示为"活跃"状态
            try {
                Object.defineProperty(document, 'hidden', {
                    get: () => false,
                    configurable: true
                });

                Object.defineProperty(document, 'visibilityState', {
                    get: () => 'visible',
                    configurable: true
                });
            } catch (e) {
                // 忽略定义错误
            }

            // 定期触发focus事件
            setInterval(() => {
                window.dispatchEvent(new Event('focus'));
                document.dispatchEvent(new Event('visibilitychange'));
            }, 60000);
        }

        forgeNetworkActivity() {
            if (!config.forgeNetworkRequests) return;

            // 模拟正常的API心跳请求
            setInterval(() => {
                this.sendHeartbeat();
                this.sendProgressUpdate();
            }, 45000 + Math.random() * 15000); // 45-60秒随机间隔
        }

        forgeVideoEvents() {
            if (!this.video) return;

            // 模拟正常的视频事件序列
            const events = ['loadstart', 'loadeddata', 'canplay', 'playing', 'timeupdate', 'progress'];

            events.forEach(event => {
                setTimeout(() => {
                    try {
                        this.video.dispatchEvent(new Event(event));
                    } catch (e) {}
                }, Math.random() * 5000);
            });

            // 定期触发timeupdate（视频进度更新）
            setInterval(() => {
                if (this.video && !this.video.paused) {
                    try {
                        this.video.dispatchEvent(new Event('timeupdate'));
                    } catch (e) {}
                }
            }, 1000);
        }

        // 伪造的上报请求
        sendProgressUpdate() {
            if (!this.video) return;

            const progressData = {
                videoId: this.getVideoId(),
                currentTime: this.video.currentTime,
                duration: this.video.duration,
                watchTime: this.forgedWatchTime * 1000, // 转换为毫秒
                progress: (this.video.currentTime / this.video.duration) * 100,
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                pageFocus: true,
                videoState: 'playing'
            };

            this.sendForgedRequest('/api/progress/update', progressData);
            this.sendForgedRequest('/api/heartbeat', progressData);
        }

        sendHeartbeat() {
            const heartbeatData = {
                timestamp: Date.now(),
                pageActive: true,
                videoPlaying: true,
                focusState: 'visible',
                stayDuration: this.forgedWatchTime * 1000
            };

            this.sendForgedRequest('/api/heartbeat', heartbeatData);
        }

        getVideoId() {
            // 尝试从URL、页面元素或全局变量中获取视频ID
            try {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get('videoId') ||
                       document.querySelector('[data-video-id]')?.dataset.videoId ||
                       'defaultVideoId';
            } catch (e) {
                return 'defaultVideoId';
            }
        }

        sendForgedRequest(endpoint, data) {
            if (!config.forgeNetworkRequests) return;

            // 使用多种方式发送伪造请求
            const methods = [
                () => this.forgeFetchRequest(endpoint, data),
                () => this.forgeXHRRequest(endpoint, data),
                () => this.forgeBeaconRequest(endpoint, data)
            ];

            methods.forEach(method => {
                try {
                    method();
                } catch (e) {
                    // 静默失败
                }
            });
        }

        forgeFetchRequest(endpoint, data) {
            try {
                fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(data)
                }).catch(() => {});
            } catch (e) {}
        }

        forgeXHRRequest(endpoint, data) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', endpoint, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(data));
            } catch (e) {}
        }

        forgeBeaconRequest(endpoint, data) {
            try {
                const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
                navigator.sendBeacon(endpoint, blob);
            } catch (e) {}
        }

        // 强制上报最终进度
        forceFinalProgressReport() {
            if (!this.video) return;

            // 模拟100%进度上报
            const finalData = {
                videoId: this.getVideoId(),
                currentTime: this.video.duration,
                duration: this.video.duration,
                progress: 100,
                timestamp: Date.now(),
                status: 'completed',
                watchTime: this.forgedWatchTime * 1000
            };

            this.sendForgedRequest('/api/progress/update', finalData);
            this.sendForgedRequest('/api/progress/complete', finalData);
        }
    }

    class UltimateCourseHelper {
        constructor() {
            this.video = null;
            this.skipAttempts = 0;
            this.isProcessing = false;
            this.currentStatus = '初始化';
            this.videoPlayState = 'unknown';
            this.detectionCycles = 0;
            this.lastProgressReport = 0;
            this.realWatchTime = 0;
            this.reportWatchTime = 0;
            this.videoStartTime = Date.now();
            this.lastStatusUpdate = 0;
            this.successfulSkips = 0;

            // 自动恢复播放相关
            this.autoResumeAttempts = 0;
            this.maxResumeAttempts = 2;
            this.resumeCheckInterval = null;
            this.lastResumeAttempt = 0;
            this.resumeCooldown = 8000;

            // 静音相关
            this.muteCheckInterval = null;
            this.isMuteApplied = false;
            this.lastMuteCheck = 0;
            this.muteCheckCooldown = 5000;

            // 连播相关
            this.continueAttempts = 0;
            this.maxContinueAttempts = 3;
            this.nextSectionCheckInterval = null;

            // 新增：视频监控相关
            this.videoCheckInterval = null;
            this.lastVideoCheck = 0;
            this.videoCheckCooldown = 3000;

            // 新增：时长伪造系统
            this.timeForger = new TimeForgerySystem();

            this.init();
        }

        init() {
            console.log('苏大双创教育平台刷课插件启动（视频切换修复版+时长伪造）');
            this.injectStyles();
            this.createControlPanel();
            this.startVideoMonitoring();
            this.startIndependentDetection();
            this.startProgressSimulation();
            this.setupGlobalObservers();
            this.startStatusMonitoring();

            // 新增：启动时长伪造系统
            if (config.enableTimeForgery) {
                this.startTimeForgery();
            }

            setTimeout(() => {
                this.startAutoResumeMonitoring();
                this.startMuteMonitoring();
                this.startNextSectionDetection();
            }, 8000);
        }

        // 新增：启动时长伪造
        startTimeForgery() {
            // 核心：每5秒更新伪造时长
            this.forgeryInterval = setInterval(() => {
                this.timeForger.simulateNormalProgress();
                if (config.simulateHumanBehavior) {
                    this.timeForger.forgePageStayMetrics();
                }
            }, 5000);

            this.log('时长伪造系统已启动');
        }

        // 修改：增强视频设置 - 关联伪造系统
        setupVideo() {
            if (!this.video) return;

            try {
                // 移除旧的事件监听器（如果存在）
                this.removeVideoEventListeners();

                // 设置播放速率
                this.video.playbackRate = config.playbackRate;
                this.log(`设置播放速率: ${config.playbackRate}`);

                // 应用静音
                this.applyMuteSettings();
                this.log('应用静音设置');

                // 绑定事件监听器
                this.bindVideoEventListeners();

                // 确保播放
                this.ensurePlayback();

                // 关联伪造系统
                this.timeForger.video = this.video;
                this.timeForger.videoStartTime = Date.now();
                this.timeForger.playbackRate = config.playbackRate;

                this.log('视频设置完成');

            } catch (error) {
                this.log(`视频设置失败: ${error.message}`);
            }
        }

        // 修改：视频结束处理 - 确保100%进度
        handleVideoEnd() {
            this.log('视频播放结束');

            // 关键：强制上报最终进度
            if (config.enableTimeForgery) {
                this.timeForger.forceFinalProgressReport();
                this.log('强制上报最终进度');
            }

            if (config.autoContinue) {
                this.log('自动连播已启用');
                setTimeout(() => {
                    this.handleContinuePlay();
                }, 8000); // 延长等待时间，确保完成状态被处理
            }
        }

        // 修改：进度模拟 - 整合时长伪造
        simulateProgressReport() {
            if (!this.video || this.video.paused) return;

            this.log('模拟进度上报');
            try {
                // 原有的鼠标事件模拟
                document.dispatchEvent(new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    clientX: 100,
                    clientY: 100
                }));

                // 新增：时长伪造系统的进度上报
                if (config.enableTimeForgery) {
                    this.timeForger.sendProgressUpdate();
                }
            } catch (e) {
                // 忽略错误
            }
        }

        // 以下是你原有代码的其他部分，保持不变...
        // [保留所有原有方法，包括：injectStyles, createControlPanel, startStatusMonitoring,
        // checkSystemStatus, setStatusNormal, setStatusError, toggleDetection, ensurePlayback,
        // startAutoResumeMonitoring, checkAutoResume, shouldAutoResume, attemptAutoResume,
        // startIndependentDetection, runDetectionCycle, detectAndHandleQuestions, findSkipButtons,
        // handleSkipButtons, forceSkip, updateTimeTracking, startProgressSimulation,
        // startNextSectionDetection, checkNextSection, findNextSectionButtons, handleNextSectionButtons,
        // handleContinuePlay, navigateByChapterList, clickContinueButton, clickNextSection,
        // forceContinuePlay, setupGlobalObservers, resetState, simpleClick, isVisible, delay, log]

        // 原有代码保持不变...
        injectStyles() {
            GM_addStyle(`
                .uch-panel {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: rgba(0,0,0,0.95);
                    color: white;
                    padding: 12px;
                    border-radius: 8px;
                    z-index: 10000;
                    font-size: 12px;
                    font-family: Arial;
                    width: 200px;
                    height: 140px;
                    border: 2px solid #ff6b00;
                    box-shadow: 0 0 15px rgba(255,107,0,0.5);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                }
                .uch-btn {
                    background: #ff4444;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin: 3px;
                    font-size: 11px;
                    width: 90%;
                    min-width: 120px !important;
                    max-width: 120px !important;
                    height: 28px !important;
                    box-sizing: border-box !important;
                    flex-shrink: 0 !important;
                }
                .uch-btn:hover {
                    opacity: 0.9;
                }
                .uch-btn-skip {
                    background: #ff4444;
                }
                .uch-btn-continue {
                    background: #44aa44;
                }
                .uch-btn-toggle {
                    background: #4444ff;
                }
                .uch-status-display {
                    width: 100%;
                    padding: 4px;
                    margin: 4px 0;
                    border-radius: 4px;
                    text-align: center;
                    font-size: 11px;
                    font-weight: bold;
                    background: #333;
                    border: 1px solid #555;
                }
                .status-normal {
                    color: #4CAF50;
                    border-color: #4CAF50;
                }
                .status-error {
                    color: #f44336;
                    border-color: #f44336;
                }
            `);
        }

        createControlPanel() {
            this.panel = document.createElement('div');
            this.panel.className = 'uch-panel';
            this.panel.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px; color: #ff6b00; text-align: center;">🎯 苏大刷课插件 v1.1</div>
                <div id="uch-status-display" class="uch-status-display status-normal">运行中</div>
                <button class="uch-btn uch-btn-skip" id="uch-manual-skip">立即跳过</button>
                <button class="uch-btn uch-btn-continue" id="uch-force-continue">强制连播</button>
                <button class="uch-btn uch-btn-toggle" id="uch-toggle-skip">暂停检测</button>
            `;
            document.body.appendChild(this.panel);

            document.getElementById('uch-manual-skip').addEventListener('click', () => {
                this.forceSkip();
            });

            document.getElementById('uch-force-continue').addEventListener('click', () => {
                this.forceContinuePlay();
            });

            document.getElementById('uch-toggle-skip').addEventListener('click', () => {
                this.toggleDetection();
            });
        }

        startStatusMonitoring() {
            setInterval(() => {
                this.checkSystemStatus();
            }, 10000);
        }

        checkSystemStatus() {
            const statusElement = document.getElementById('uch-status-display');
            if (!statusElement) return;

            try {
                if (this.video && this.video.error) {
                    this.setStatusError('视频异常');
                    return;
                }

                // 检查视频设置状态
                if (this.video) {
                    if (this.video.playbackRate !== config.playbackRate) {
                        this.setStatusError('倍速异常');
                        return;
                    }
                    if (config.permanentMute && (!this.video.muted || this.video.volume > 0)) {
                        this.setStatusError('静音异常');
                        return;
                    }
                }

                this.setStatusNormal('运行中');

            } catch (error) {
                this.setStatusError('系统异常');
            }
        }

        setStatusNormal(message) {
            const statusElement = document.getElementById('uch-status-display');
            if (statusElement) {
                statusElement.textContent = message;
                statusElement.className = 'uch-status-display status-normal';
            }
        }

        setStatusError(message) {
            const statusElement = document.getElementById('uch-status-display');
            if (statusElement) {
                statusElement.textContent = message;
                statusElement.className = 'uch-status-display status-error';
            }
        }

        toggleDetection() {
            config.autoSkip = !config.autoSkip;
            const button = document.getElementById('uch-toggle-skip');
            if (config.autoSkip) {
                button.textContent = '暂停检测';
                button.className = 'uch-btn uch-btn-toggle';
                this.log('自动检测已启用');
                this.setStatusNormal('检测中');
            } else {
                button.textContent = '恢复检测';
                button.className = 'uch-btn uch-btn-skip';
                this.log('自动检测已暂停');
                this.setStatusNormal('检测暂停');
            }
        }

        ensurePlayback() {
            if (this.video && this.video.paused) {
                this.log('尝试开始播放视频...');

                const playVideo = () => {
                    if (this.video && this.video.paused) {
                        this.video.play().then(() => {
                            this.log('视频开始播放成功');
                        }).catch(e => {
                            if (e.name === 'NotAllowedError') {
                                console.log('[苏大刷课插件] 请点击页面开始播放');
                            }
                        });
                    }
                };

                setTimeout(playVideo, 1000);
                setTimeout(playVideo, 5000);
                setTimeout(playVideo, 10000);
            }
        }

        startAutoResumeMonitoring() {
            if (!config.autoResume) return;

            this.resumeCheckInterval = setInterval(() => {
                this.checkAutoResume();
            }, 15000);

            this.log('自动恢复播放监控已启动');
        }

        checkAutoResume() {
            if (!config.autoResume || !this.video) return;

            const now = Date.now();
            if (now - this.lastResumeAttempt < this.resumeCooldown) {
                return;
            }

            if (this.video.ended) return;

            if (this.video.paused && this.shouldAutoResume()) {
                this.log('检测到视频暂停，尝试自动恢复播放');
                this.attemptAutoResume();
            }
        }

        shouldAutoResume() {
            if (!this.video) return false;
            if (this.video.currentTime === 0) return false;
            if (this.video.duration && this.video.currentTime / this.video.duration > 0.98) {
                return false;
            }
            return true;
        }

        attemptAutoResume() {
            if (!this.video || this.autoResumeAttempts >= this.maxResumeAttempts) return;

            this.autoResumeAttempts++;
            this.lastResumeAttempt = Date.now();

            this.video.play().then(() => {
                this.log(`自动恢复播放成功`);
                this.autoResumeAttempts = 0;
                this.setStatusNormal('运行中');
            }).catch(error => {
                this.log(`自动恢复播放失败: ${error.message}`);
            });
        }

        startIndependentDetection() {
            setInterval(() => {
                if (!this.isProcessing) {
                    this.runDetectionCycle();
                }
            }, config.detectionInterval);

            this.log(`独立检测系统启动，间隔: ${config.detectionInterval}ms`);
        }

        runDetectionCycle() {
            if (!config.autoSkip || this.isProcessing) return;
            this.detectAndHandleQuestions();
        }

        detectAndHandleQuestions() {
            const skipButtons = this.findSkipButtons();
            if (skipButtons.length > 0) {
                this.log(`发现跳过按钮: ${skipButtons.length}个`);
                this.handleSkipButtons(skipButtons);
                return true;
            }
            return false;
        }

        findSkipButtons() {
            const buttons = [];
            const possibleButtons = document.querySelectorAll('button');

            for (let i = 0; i < possibleButtons.length; i++) {
                const btn = possibleButtons[i];
                if (!this.isVisible(btn)) continue;

                const text = (btn.textContent || '').trim().toLowerCase();
                if (text.includes('跳过') || text === 'skip') {
                    buttons.push(btn);
                    if (buttons.length >= 5) break;
                }
            }

            return buttons;
        }

        async handleSkipButtons(buttons) {
            if (this.isProcessing) return;

            this.isProcessing = true;
            this.skipAttempts++;

            try {
                await this.delay(config.skipDelay);

                let clicked = false;
                for (let button of buttons) {
                    if (this.isVisible(button)) {
                        if (await this.simpleClick(button)) {
                            clicked = true;
                            this.successfulSkips++;
                            this.log(`成功跳过题目`);
                            break;
                        }
                    }
                }

                if (!clicked) {
                    this.log('跳过按钮点击失败');
                }

            } catch (error) {
                this.log('跳过处理出错');
            } finally {
                this.isProcessing = false;
            }
        }

        async forceSkip() {
            this.log('手动触发跳过');
            this.setStatusNormal('跳过中...');
            const buttons = this.findSkipButtons();
            if (buttons.length > 0) {
                await this.handleSkipButtons(buttons);
            } else {
                this.log('未找到跳过按钮');
            }
            this.setStatusNormal('运行中');
        }

        updateTimeTracking() {
            if (!this.video) return;

            if (this.videoPlayState === 'playing') {
                this.realWatchTime = (Date.now() - this.videoStartTime) / 1000;
            }

            if (config.simulateNormalProgress) {
                this.reportWatchTime = this.realWatchTime;
            }
        }

        startProgressSimulation() {
            if (config.simulateNormalProgress) {
                setInterval(() => {
                    this.simulateProgressReport();
                }, config.progressReportInterval);

                this.log(`进度模拟启动`);
            }
        }

        startNextSectionDetection() {
            if (!config.autoContinue) return;

            this.nextSectionCheckInterval = setInterval(() => {
                this.checkNextSection();
            }, 10000);

            this.log('下一节检测已启动');
        }

        checkNextSection() {
            if (!config.autoContinue || this.isProcessing) return;

            if (this.video && this.video.ended) {
                this.log('检测到视频结束，开始连播流程');
                this.handleContinuePlay();
                return;
            }

            const nextButtons = this.findNextSectionButtons();
            if (nextButtons.length > 0) {
                this.log(`发现下一节按钮: ${nextButtons.length}个`);
                this.handleNextSectionButtons(nextButtons);
            }
        }

        findNextSectionButtons() {
            const buttons = [];
            const possibleButtons = document.querySelectorAll('button, a, .btn, [class*="button"]');

            for (let i = 0; i < possibleButtons.length; i++) {
                const btn = possibleButtons[i];
                if (!this.isVisible(btn)) continue;

                const text = (btn.textContent || btn.innerText || '').trim().toLowerCase();
                if (text.includes('下一节') || text.includes('下一课') || text.includes('下一章') ||
                    text.includes('下一视频') || text.includes('继续学习') || text.includes('next')) {
                    buttons.push(btn);
                    if (buttons.length >= 3) break;
                }
            }

            return buttons;
        }

        async handleNextSectionButtons(buttons) {
            if (this.isProcessing) return;

            this.isProcessing = true;
            this.setStatusNormal('跳转中...');

            try {
                await this.delay(2000);

                let clicked = false;
                for (let button of buttons) {
                    if (this.isVisible(button)) {
                        if (await this.simpleClick(button)) {
                            clicked = true;
                            this.log(`成功点击下一节按钮`);
                            break;
                        }
                    }
                }

                if (clicked) {
                    this.setStatusNormal('跳转成功');
                    setTimeout(() => {
                        this.resetState();
                        // 不需要手动调用 findVideo()，因为视频监控会自动处理
                    }, 5000);
                } else {
                    this.log('下一节按钮点击失败');
                    this.setStatusNormal('跳转失败');
                }

            } catch (error) {
                this.log('下一节处理出错');
                this.setStatusNormal('跳转异常');
            } finally {
                this.isProcessing = false;
            }
        }

        async handleContinuePlay() {
            if (this.continueAttempts >= this.maxContinueAttempts) {
                this.log('连播尝试次数过多，停止尝试');
                this.setStatusNormal('连播停止');
                return;
            }

            this.continueAttempts++;
            this.log(`开始连播尝试 ${this.continueAttempts}/${this.maxContinueAttempts}`);
            this.setStatusNormal('连播中...');

            try {
                let success = false;

                // 方法1: 直接查找并点击下一节按钮
                const nextButtons = this.findNextSectionButtons();
                if (nextButtons.length > 0) {
                    this.log('直接发现下一节按钮');
                    for (let button of nextButtons) {
                        if (await this.simpleClick(button)) {
                            success = true;
                            break;
                        }
                    }
                }

                // 方法2: 如果没有找到下一节按钮，尝试继续播放+下一节流程
                if (!success) {
                    this.log('尝试继续播放流程');
                    const continueSuccess = await this.clickContinueButton();
                    if (continueSuccess) {
                        await this.delay(3000);
                        const nextSuccess = await this.clickNextSection();
                        if (nextSuccess) {
                            success = true;
                        }
                    }
                }

                // 方法3: 尝试章节列表跳转
                if (!success) {
                    this.log('尝试章节列表跳转');
                    success = await this.navigateByChapterList();
                }

                if (success) {
                    this.log('连播成功');
                    this.setStatusNormal('连播成功');
                    this.continueAttempts = 0;

                    setTimeout(() => {
                        this.resetState();
                    }, 8000);
                } else {
                    this.log(`连播失败，已尝试 ${this.continueAttempts} 次`);
                    this.setStatusNormal('连播失败');

                    setTimeout(() => {
                        if (this.continueAttempts < this.maxContinueAttempts) {
                            this.handleContinuePlay();
                        }
                    }, 10000);
                }

            } catch (error) {
                this.log('连播处理出错');
                this.setStatusNormal('连播异常');
            }
        }

        async navigateByChapterList() {
            try {
                const currentActive = document.querySelector('.chapter_list li.active, .ant-menu-item-selected, .el-menu-item.is-active');
                if (currentActive) {
                    const nextItem = currentActive.nextElementSibling;
                    if (nextItem) {
                        const link = nextItem.querySelector('a');
                        if (link && this.isVisible(link)) {
                            this.log('通过章节列表跳转到下一节');
                            return await this.simpleClick(link);
                        }
                    } else {
                        this.log('已经是最后一章');
                        return false;
                    }
                }

                const chapterLinks = document.querySelectorAll('.chapter_list a, .ant-menu-item a, .el-menu-item a');
                for (let i = 0; i < chapterLinks.length; i++) {
                    const link = chapterLinks[i];
                    if (link.classList.contains('active') || link.parentElement.classList.contains('active')) {
                        const nextLink = chapterLinks[i + 1];
                        if (nextLink && this.isVisible(nextLink)) {
                            this.log('通过章节链接跳转到下一节');
                            return await this.simpleClick(nextLink);
                        }
                        break;
                    }
                }

                return false;
            } catch (error) {
                this.log('章节列表跳转失败');
                return false;
            }
        }

        async clickContinueButton() {
            const continueTexts = ['继续播放', '重新播放', '继续', '重播'];
            const buttons = document.querySelectorAll('button');

            for (let i = 0; i < buttons.length; i++) {
                const button = buttons[i];
                if (!this.isVisible(button)) continue;

                const text = (button.textContent || '').trim();
                if (continueTexts.some(t => text.includes(t))) {
                    this.log(`找到继续播放按钮: ${text}`);
                    if (await this.simpleClick(button)) {
                        return true;
                    }
                }
            }

            return false;
        }

        async clickNextSection() {
            const nextTexts = ['下一节', '下一章', '下一个', '继续学习', '下一课', '下一视频', 'next section', 'next lesson'];
            const buttons = document.querySelectorAll('button, a, .btn, [class*="button"]');

            for (let i = 0; i < buttons.length; i++) {
                const button = buttons[i];
                if (!this.isVisible(button)) continue;

                const text = (button.textContent || button.innerText || '').trim().toLowerCase();
                if (nextTexts.some(t => text.includes(t.toLowerCase()))) {
                    this.log(`找到下一节按钮: ${text}`);
                    if (await this.simpleClick(button)) {
                        return true;
                    }
                }
            }

            const specificSelectors = [
                '#btn3', '.next-btn', '.next-section', '.next_btn_section',
                '[onclick*="next"]', '[onclick*="Next"]'
            ];

            for (let selector of specificSelectors) {
                try {
                    const button = document.querySelector(selector);
                    if (button && this.isVisible(button)) {
                        this.log(`通过选择器找到下一节按钮: ${selector}`);
                        if (await this.simpleClick(button)) {
                            return true;
                        }
                    }
                } catch (e) {
                    // 忽略选择器错误
                }
            }

            return false;
        }

        async forceContinuePlay() {
            this.log('手动触发连播');
            this.setStatusNormal('连播中...');
            await this.handleContinuePlay();
            this.setStatusNormal('运行中');
        }

        setupGlobalObservers() {
            const observer = new MutationObserver((mutations) => {
                const hasNewNodes = mutations.some(mutation =>
                    mutation.addedNodes && mutation.addedNodes.length > 0
                );

                if (hasNewNodes) {
                    clearTimeout(this.observerTimeout);
                    this.observerTimeout = setTimeout(() => {
                        if (config.autoSkip && !this.isProcessing) {
                            this.detectAndHandleQuestions();
                        }
                    }, 2000);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: false
            });
        }

        resetState() {
            this.realWatchTime = 0;
            this.reportWatchTime = 0;
            this.videoStartTime = Date.now();
            this.autoResumeAttempts = 0;
            this.continueAttempts = 0;

            // 重置伪造系统
            if (this.timeForger) {
                this.timeForger.videoStartTime = Date.now();
                this.timeForger.forgedWatchTime = 0;
                this.timeForger.realWatchTime = 0;
            }
        }

        async simpleClick(element) {
            return new Promise((resolve) => {
                try {
                    element.click();
                    resolve(true);
                } catch (error) {
                    resolve(false);
                }
            });
        }

        isVisible(element) {
            if (!element) return false;
            const rect = element.getBoundingClientRect();
            return !!(rect.width && rect.height &&
                     rect.top < window.innerHeight &&
                     rect.bottom > 0);
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        log(message) {
            if (config.log) {
                console.log(`[苏大刷课插件] ${message}`);
            }
        }

        // 新增：持续视频监控 - 解决视频切换问题
        startVideoMonitoring() {
            this.videoCheckInterval = setInterval(() => {
                this.checkAndSetupVideo();
            }, this.videoCheckCooldown);

            this.log('视频监控已启动');
        }

        // 新增：检查和设置视频
        checkAndSetupVideo() {
            const now = Date.now();
            if (now - this.lastVideoCheck < this.videoCheckCooldown) {
                return;
            }

            this.lastVideoCheck = now;

            // 查找视频元素
            const video = document.querySelector('video');

            // 如果没有找到视频，尝试重新查找
            if (!video) {
                if (this.video) {
                    this.log('视频元素丢失，等待重新加载');
                    this.video = null;
                }
                return;
            }

            // 如果找到新视频或视频发生变化
            if (!this.video || this.video !== video) {
                this.log('发现新视频元素，重新设置');
                this.video = video;
                this.setupVideo();
            } else {
                // 确保现有视频的设置仍然有效
                this.ensureVideoSettings();
            }
        }

        // 新增：移除视频事件监听器
        removeVideoEventListeners() {
            if (!this.video) return;

            // 这里可以移除之前绑定的事件监听器
            // 由于我们使用匿名函数，实际上不需要特别移除
            // 但如果有命名函数，应该在这里移除
        }

        // 新增：绑定视频事件监听器
        bindVideoEventListeners() {
            if (!this.video) return;

            const handlePlay = () => {
                this.videoPlayState = 'playing';
                this.videoStartTime = Date.now();
                this.log('视频开始播放');
            };

            const handlePause = () => {
                this.videoPlayState = 'paused';
                this.log('视频暂停');
                if (config.autoResume) {
                    setTimeout(() => {
                        if (this.video && this.video.paused) {
                            this.checkAutoResume();
                        }
                    }, 5000);
                }
            };

            const handleEnded = () => {
                this.log('视频播放结束');
                this.handleVideoEnd();
            };

            // 绑定事件
            this.video.addEventListener('play', handlePlay);
            this.video.addEventListener('pause', handlePause);
            this.video.addEventListener('ended', handleEnded);

            this.log('视频事件监听器已绑定');
        }

        // 新增：确保视频设置
        ensureVideoSettings() {
            if (!this.video) return;

            // 确保播放速率
            if (this.video.playbackRate !== config.playbackRate) {
                this.video.playbackRate = config.playbackRate;
                this.log(`修复播放速率: ${config.playbackRate}`);
            }

            // 确保静音
            if (config.permanentMute && (!this.video.muted || this.video.volume > 0)) {
                this.applyMuteSettings();
                this.log('修复静音设置');
            }
        }

        // 修改：应用静音设置
        applyMuteSettings() {
            if (!this.video || !config.permanentMute) return;

            this.video.muted = true;
            this.video.volume = 0;
            this.isMuteApplied = true;
        }

        // 修改：静音监控
        startMuteMonitoring() {
            if (!config.permanentMute) return;

            this.muteCheckInterval = setInterval(() => {
                this.checkAndApplyMute();
            }, 10000);

            this.log('静音监控已启动');
        }

        // 修改：检查并应用静音
        checkAndApplyMute() {
            if (!config.permanentMute || !this.video) return;

            const now = Date.now();
            if (now - this.lastMuteCheck < this.muteCheckCooldown) {
                return;
            }

            this.lastMuteCheck = now;

            if (!this.video.muted || this.video.volume > 0) {
                this.applyMuteSettings();
                this.log('静音状态已修复');
            }
        }
    }

    // 启动系统
    let system;
    const initSystem = () => {
        system = new UltimateCourseHelper();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initSystem, 3000);
        });
    } else {
        setTimeout(initSystem, 3000);
    }

    // 全局控制接口
    window.uch = {
        skip: () => {
            if (system) system.forceSkip();
        },
        continue: () => {
            if (system) system.forceContinuePlay();
        },
        setSpeed: (speed) => {
            config.playbackRate = speed;
            if (system && system.video) {
                system.video.playbackRate = speed;
                system.log(`手动设置播放速率: ${speed}`);
            }
            // 更新伪造系统的播放速率
            if (system && system.timeForger) {
                system.timeForger.playbackRate = speed;
            }
        },
        // 新增：手动应用静音
        applyMute: () => {
            if (system && system.video) {
                system.applyMuteSettings();
                system.log('手动应用静音');
            }
        },
        // 新增：时长伪造控制
        setForgedTime: (minutes) => {
            if (system && system.timeForger) {
                system.timeForger.forgedWatchTime = minutes * 60;
                system.log(`手动设置伪造时长: ${minutes}分钟`);
            }
        },
        getTimeStats: () => {
            if (system && system.timeForger) {
                return {
                    realTime: system.timeForger.realWatchTime,
                    forgedTime: system.timeForger.forgedWatchTime,
                    playbackRate: system.timeForger.playbackRate
                };
            }
        },
        // 新增：强制上报进度
        forceProgressReport: () => {
            if (system && system.timeForger) {
                system.timeForger.sendProgressUpdate();
                system.log('手动强制上报进度');
            }
        }
    };

    console.log('🎯 苏大双创教育平台刷课插件已加载（视频切换修复版+时长伪造）');
    console.log('使用 window.uch.setSpeed(1.5) 调整播放速度');
    console.log('使用 window.uch.applyMute() 手动应用静音');
    console.log('使用 window.uch.getTimeStats() 查看时间统计');
    console.log('使用 window.uch.forceProgressReport() 强制上报进度');
})();