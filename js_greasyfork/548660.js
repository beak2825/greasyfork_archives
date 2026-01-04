// ==UserScript==
// @name         超星慕课自动播放防切屏 v2.9
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  修复视频完成检测和自动切换问题
// @author       Assistant
// @match        https://mooc1.chaoxing.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548660/%E8%B6%85%E6%98%9F%E6%85%95%E8%AF%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E9%98%B2%E5%88%87%E5%B1%8F%20v29.user.js
// @updateURL https://update.greasyfork.org/scripts/548660/%E8%B6%85%E6%98%9F%E6%85%95%E8%AF%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E9%98%B2%E5%88%87%E5%B1%8F%20v29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const window = unsafeWindow;
    const isInIframe = window.self !== window.top;

    const scriptId = 'chaoxingAutoPlayScript_' + (isInIframe ? 'iframe' : 'main');
    if (window[scriptId]) {
        return;
    }
    window[scriptId] = true;

    // === 防切屏代码 ===
    const blackListedEvents = new Set([
        "visibilitychange", "blur", "focus", "pagehide", "freeze", "resume",
        "mouseleave", "mouseout", "keyup", "keydown"
    ]);

    const scriptPrefix = "[超星慕课增强" + (isInIframe ? "-iframe" : "") + "]";
    const log = console.log.bind(console, `%c${scriptPrefix}`, 'color: #1E88E5; font-weight: bold;');
    const warn = console.warn.bind(console, `%c${scriptPrefix}`, 'color: #FB8C00; font-weight: bold;');
    const error = console.error.bind(console, `%c${scriptPrefix}`, 'color: #D32F2F; font-weight: bold;');

    try {
        Object.defineProperty(document, 'hidden', { value: false, configurable: true });
        Object.defineProperty(document, 'visibilityState', { value: "visible", configurable: true });
        Object.defineProperty(document, 'hasFocus', { value: () => true, configurable: true });

        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (blackListedEvents.has(type.toLowerCase())) {
                log(`BLOCKED addEventListener: ${type}`);
                return;
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    } catch (e) {
        error("防切屏实现失败:", e);
    }

    log("防切屏功能已启用");

    if (isInIframe) {
        log("检测到在iframe中，只启用防切屏功能");
        return;
    }

    log("在主页面中，启用完整功能");

    function createDebugWindow() {
        const existingWindows = document.querySelectorAll('[id^="chaoxing-debug-window"]');
        existingWindows.forEach(win => win.remove());
        const debugWindow = document.createElement('div');
        debugWindow.id = 'chaoxing-debug-window-main';
        debugWindow.innerHTML = `
        <div style="background: rgba(0,0,0,0.9); color: white; padding: 15px; border-radius: 10px; font-size: 13px; max-width: 400px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); border: 2px solid #4CAF50;">
            <div style="font-weight: bold; margin-bottom: 10px; color: #4CAF50; text-align: center;">🎓 超星自动学习助手 v2.9</div>
            <div id="debug-status" style="margin-bottom: 8px; color: #FFD54F;">初始化中...</div>
            <div id="debug-details" style="font-size: 11px; opacity: 0.8; margin-bottom: 8px; color: #B0BEC5;">正在检测页面状态...</div>
            <div id="debug-video" style="font-size: 10px; opacity: 0.7; margin-bottom: 8px; color: #81C784;">视频: 检测中</div>
            <div id="debug-task" style="font-size: 10px; opacity: 0.7; margin-bottom: 8px; color: #81C784;">任务: 检测中</div>
            <div id="debug-progress" style="font-size: 10px; opacity: 0.7; margin-bottom: 10px; color: #81C784;"></div>

            <div style="text-align: center; font-size: 10px; margin-top: 8px; opacity: 0.7;">
                <a href="https://www.hbut.edu.cn" target="_blank" style="color: #B0BEC5; text-decoration: none;">脚本来自湖北工业大学</a>
            </div>

            <div style="margin-top: 10px; text-align: center;">
                <button id="toggle-auto-play" style="padding: 6px 12px; margin: 2px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 11px;">开启</button>
                <button id="next-chapter" style="padding: 6px 12px; margin: 2px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 11px;">下一章</button>
                <button id="try-play" style="padding: 6px 12px; margin: 2px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 11px;">手动播放</button>
            </div>
        </div>
    `;
        debugWindow.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99999;
        cursor: move;
        user-select: none;
    `;

        // 拖拽功能
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        debugWindow.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = debugWindow.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            debugWindow.style.left = (startLeft + deltaX) + 'px';
            debugWindow.style.top = (startTop + deltaY) + 'px';
            debugWindow.style.right = 'auto';
            debugWindow.style.bottom = 'auto';
        });
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        return debugWindow;
    }

    class AutoPlayController {
        constructor() {
            this.isEnabled = true;
            this.debugWindow = null;
            this.statusElement = null;
            this.detailsElement = null;
            this.videoElement = null;
            this.taskElement = null;
            this.progressElement = null;
            this.checkInterval = null;
            this.retryCount = 0;
            this.maxRetries = 3;
            this.taskCompletedCount = 0;
            this.requiredCompletedTasks = 3; // 增加确认次数
            this.deepScanCount = 0;
            this.maxDeepScan = 15;
            this.currentPlayer = null;
            this.videoEndedDetected = false;
            this.lastVideoTime = 0;
            this.videoStuckCount = 0;
            this.switchingChapter = false;
        }

        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        }

        setup() {
            this.createUI();
            this.startAutoPlay();
        }

        createUI() {
            this.debugWindow = createDebugWindow();
            document.body.appendChild(this.debugWindow);

            this.statusElement = document.getElementById('debug-status');
            this.detailsElement = document.getElementById('debug-details');
            this.videoElement = document.getElementById('debug-video');
            this.taskElement = document.getElementById('debug-task');
            this.progressElement = document.getElementById('debug-progress');

            document.getElementById('toggle-auto-play').addEventListener('click', () => {
                this.toggle();
            });

            document.getElementById('next-chapter').addEventListener('click', () => {
                this.clickNextChapter();
            });

            document.getElementById('try-play').addEventListener('click', () => {
                this.manualPlay();
            });

            this.updateUI();
        }

        updateStatus(status, details = '', video = '', task = '', progress = '') {
            if (this.statusElement) {
                this.statusElement.textContent = status;
            }
            if (this.detailsElement && details) {
                this.detailsElement.textContent = details;
            }
            if (this.videoElement && video) {
                this.videoElement.textContent = '视频: ' + video;
            }
            if (this.taskElement && task) {
                this.taskElement.textContent = '任务: ' + task;
            }
            if (this.progressElement && progress) {
                this.progressElement.textContent = progress;
            }
            log(status + (details ? ' - ' + details : ''));
        }

        updateUI() {
            const toggleBtn = document.getElementById('toggle-auto-play');
            if (toggleBtn) {
                toggleBtn.textContent = this.isEnabled ? '关闭' : '开启';
                toggleBtn.style.backgroundColor = this.isEnabled ? '#f44336' : '#4CAF50';
                toggleBtn.style.color = 'white';
            }
        }

        toggle() {
            this.isEnabled = !this.isEnabled;
            this.updateUI();

            if (this.isEnabled) {
                this.startAutoPlay();
                this.updateStatus('自动播放已开启', '重新开始检测');
            } else {
                this.stopAutoPlay();
                this.updateStatus('自动播放已关闭', '停止所有检测');
            }
        }

        startAutoPlay() {
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
            }

            this.updateStatus('启动中...', '等待页面和播放器加载');
            this.retryCount = 0;
            this.taskCompletedCount = 0;
            this.deepScanCount = 0;
            this.currentPlayer = null;
            this.videoEndedDetected = false;
            this.lastVideoTime = 0;
            this.videoStuckCount = 0;
            this.switchingChapter = false;

            setTimeout(() => {
                this.checkAndPlay();
                // 缩短检查间隔到3秒，更频繁地监控视频状态
                this.checkInterval = setInterval(() => {
                    if (this.isEnabled && !this.switchingChapter) {
                        this.checkAndPlay();
                    }
                }, 3000);
            }, 3000);
        }

        stopAutoPlay() {
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }
        }

        // 深度扫描所有iframe查找播放器
        deepScanForPlayer() {
            this.deepScanCount++;

            const allFrames = [];
            const iframes = document.querySelectorAll('iframe');

            for (let iframe of iframes) {
                allFrames.push({
                    element: iframe,
                    path: 'main->' + (iframe.id || iframe.className || 'unnamed'),
                    src: iframe.src
                });

                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) {
                        const nestedIframes = iframeDoc.querySelectorAll('iframe');
                        for (let nested of nestedIframes) {
                            allFrames.push({
                                element: nested,
                                path: 'main->' + (iframe.id || 'unnamed') + '->' + (nested.id || 'unnamed'),
                                src: nested.src,
                                parent: iframe
                            });
                        }
                    }
                } catch (e) {
                    // 跨域iframe，跳过
                }
            }

            // 在每个iframe中查找播放器
            for (let frame of allFrames) {
                try {
                    const doc = frame.element.contentDocument || frame.element.contentWindow?.document;
                    if (doc) {
                        const playerInfo = this.findPlayerInDocument(doc);
                        if (playerInfo.found) {
                            // 为播放器添加事件监听
                            this.setupVideoEventListeners(playerInfo);
                            return {
                                success: true,
                                iframe: frame.element,
                                document: doc,
                                player: playerInfo,
                                path: frame.path
                            };
                        }
                    }
                } catch (e) {
                    // 跨域iframe，继续下一个
                }
            }

            return { success: false, message: '未找到播放器' };
        }

        // 为视频添加事件监听器
        setupVideoEventListeners(player) {
            if (player.video && !player.video._chaoxingListenersAdded) {
                player.video._chaoxingListenersAdded = true;

                // 监听视频结束事件
                player.video.addEventListener('ended', () => {
                    this.videoEndedDetected = true;
                    log('检测到视频播放结束');
                    this.updateStatus('视频播放完成', '检测到ended事件', '✓ 播放完成', '等待确认');
                });

                // 监听播放进度
                player.video.addEventListener('timeupdate', () => {
                    this.lastVideoTime = player.video.currentTime;
                });

                // 监听播放状态变化
                player.video.addEventListener('play', () => {
                    this.updateStatus('视频开始播放', '检测到play事件', '▶️ 播放中');
                });

                player.video.addEventListener('pause', () => {
                    this.updateStatus('视频暂停', '检测到pause事件', '⏸️ 已暂停');
                });
            }
        }

        findPlayerInDocument(doc) {
            if (!doc) return { found: false };

            // 查找Video.js播放器
            const videoJsContainers = doc.querySelectorAll('#video, .video-js, [class*="video-js"]');
            for (let container of videoJsContainers) {
                const video = container.querySelector('video') || doc.querySelector('#video_html5_api');
                if (video || container.classList.contains('video-js')) {
                    return {
                        found: true,
                        type: 'Video.js',
                        container: container,
                        video: video,
                        playButton: container.querySelector('.vjs-big-play-button') || container.querySelector('.vjs-play-control')
                    };
                }
            }

            // 查找普通video元素
            const videos = doc.querySelectorAll('video');
            for (let video of videos) {
                return {
                    found: true,
                    type: 'HTML5 Video',
                    video: video,
                    container: video.parentElement,
                    playButton: video.parentElement.querySelector('.play-button, [class*="play"]')
                };
            }

            return { found: false };
        }

        async checkAndPlay() {
            try {
                if (this.switchingChapter) {
                    this.updateStatus('正在切换章节', '等待页面加载完成');
                    return;
                }

                // 查找播放器
                const scanResult = this.deepScanForPlayer();

                if (!scanResult.success) {
                    if (this.deepScanCount >= this.maxDeepScan) {
                        this.updateStatus('扫描完成', '未找到播放器', '未检测到', '未检测到');
                        this.deepScanCount = 0;
                    } else {
                        this.updateStatus('扫描播放器', `${this.deepScanCount}/${this.maxDeepScan}`, '扫描中', '扫描中');
                    }
                    return;
                }

                // 更新当前播放器
                this.currentPlayer = scanResult.player;
                const { document: playerDoc, player, path } = scanResult;

                // 分析任务和视频状态
                const status = this.analyzeCompleteStatus(playerDoc, player);

                this.updateStatus('监控播放状态', status.description, status.videoStatus, status.taskStatus,
                    `时长: ${Math.floor(status.currentTime)}/${Math.floor(status.duration)}s (${status.progressPercent}%)`);

                // 检查是否需要切换章节
                if (this.shouldSwitchChapter(status)) {
                    this.taskCompletedCount++;
                    this.updateStatus('任务完成确认', `确认次数: ${this.taskCompletedCount}/${this.requiredCompletedTasks}`,
                        '完成确认中', `${this.taskCompletedCount}/${this.requiredCompletedTasks}`);

                    if (this.taskCompletedCount >= this.requiredCompletedTasks) {
                        this.updateStatus('准备切换章节', '所有条件已满足');
                        this.taskCompletedCount = 0;
                        this.switchingChapter = true;
                        setTimeout(() => {
                            this.findAndClickNextChapter();
                        }, 2000);
                        return;
                    }
                } else {
                    this.taskCompletedCount = 0;
                    this.videoEndedDetected = false; // 重置视频结束标记
                }

                // 尝试播放视频
                if (!status.isPlaying && status.canPlay && !status.isCompleted) {
                    const playResult = this.tryPlayVideo(player);
                    if (playResult.success) {
                        this.updateStatus('播放操作完成', playResult.message, '启动播放');
                    } else {
                        this.updateStatus('播放尝试', playResult.message, '播放失败');
                    }
                    return;
                }

                // 检测视频卡住
                if (status.isPlaying) {
                    if (Math.abs(status.currentTime - this.lastVideoTime) < 0.1) {
                        this.videoStuckCount++;
                        if (this.videoStuckCount > 5) { // 连续5次检测到时间没变化
                            this.updateStatus('视频可能卡住', '尝试重新播放', '疑似卡住');
                            this.tryPlayVideo(player);
                            this.videoStuckCount = 0;
                        }
                    } else {
                        this.videoStuckCount = 0;
                    }
                    this.lastVideoTime = status.currentTime;
                }

            } catch (error) {
                this.updateStatus('系统错误', error.message, '异常', '错误');
                error('检查过程出错:', error);
            }
        }

        // 判断是否应该切换章节
        shouldSwitchChapter(status) {
            // 条件1: 视频播放完成 (通过ended事件检测)
            const videoEnded = this.videoEndedDetected;

            // 条件2: 播放进度接近100% (98%以上)
            const progressCompleted = status.progressPercent >= 98;

            // 条件3: 任务点都已完成
            const tasksCompleted = status.totalTasks > 0 ?
                (status.completedTasks === status.totalTasks) : true;

            // 条件4: 视频当前不在播放
            const notPlaying = !status.isPlaying;

            log(`切换条件检查: ended=${videoEnded}, progress=${progressCompleted}(${status.progressPercent}%), tasks=${tasksCompleted}(${status.completedTasks}/${status.totalTasks}), notPlaying=${notPlaying}`);

            // 满足以下任一组合条件就切换:
            // 1. 视频已结束 且 任务完成
            // 2. 进度98%以上 且 任务完成 且 不在播放
            return (videoEnded && tasksCompleted) ||
                   (progressCompleted && tasksCompleted && notPlaying);
        }

        analyzeCompleteStatus(doc, player) {
            let isPlaying = false;
            let canPlay = false;
            let currentTime = 0;
            let duration = 0;
            let playerState = '检测中';
            let videoStatus = '检测中';

            // 分析视频状态
            if (player.video) {
                currentTime = player.video.currentTime || 0;
                duration = player.video.duration || 0;
                isPlaying = !player.video.paused && currentTime > 0;
                canPlay = player.video.readyState >= 3;

                if (player.video.ended) {
                    videoStatus = '已播放完成';
                    this.videoEndedDetected = true;
                } else if (isPlaying) {
                    videoStatus = '播放中';
                } else if (canPlay) {
                    videoStatus = '可播放';
                } else {
                    videoStatus = '加载中';
                }
            }

            // 分析Video.js状态
            if (player.container && player.container.classList.contains('video-js')) {
                const isPaused = player.container.classList.contains('vjs-paused');
                const hasStarted = player.container.classList.contains('vjs-has-started');

                if (!isPaused && hasStarted) {
                    isPlaying = true;
                    playerState = 'VJS播放中';
                } else if (isPaused && hasStarted) {
                    playerState = 'VJS已暂停';
                    canPlay = true;
                } else {
                    playerState = 'VJS未开始';
                    canPlay = true;
                }
            }

            // 分析任务点
            const allJobIcons = doc.querySelectorAll('.ans-job-icon');
            const finishedJobIcons = doc.querySelectorAll('.ans-job-icon.ans-job-icon-clear[aria-label*="任务点已完成"]');

            const progressPercent = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;

            // 任务状态
            let taskStatus = '检测中';
            if (allJobIcons.length > 0) {
                if (finishedJobIcons.length === allJobIcons.length) {
                    taskStatus = '全部完成';
                } else {
                    taskStatus = `${finishedJobIcons.length}/${allJobIcons.length}完成`;
                }
            } else {
                taskStatus = '无任务点';
            }

            const isCompleted = this.shouldSwitchChapter({
                progressPercent,
                totalTasks: allJobIcons.length,
                completedTasks: finishedJobIcons.length,
                isPlaying
            });

            return {
                isCompleted,
                isPlaying,
                canPlay,
                playerState,
                videoStatus,
                taskStatus,
                totalTasks: allJobIcons.length,
                completedTasks: finishedJobIcons.length,
                currentTime,
                duration,
                progressPercent,
                description: `${playerState || videoStatus} | ${taskStatus}`
            };
        }

        tryPlayVideo(player) {
            try {
                let clicked = false;

                // 方法1: 点击播放按钮
                if (player.playButton && this.isElementVisible(player.playButton)) {
                    this.clickElement(player.playButton);
                    clicked = true;
                }

                // 方法2: 直接调用video.play()
                if (player.video && typeof player.video.play === 'function') {
                    const playPromise = player.video.play();
                    if (playPromise && typeof playPromise.then === 'function') {
                        playPromise.catch(e => {
                            warn('视频播放被阻止:', e.message);
                        });
                    }
                    clicked = true;
                }

                return {
                    success: clicked,
                    message: clicked ? `播放操作完成 (${player.type})` : '未找到可点击的播放元素'
                };

            } catch (error) {
                return { success: false, message: '播放操作异常: ' + error.message };
            }
        }

        clickElement(element) {
            try {
                if (element.click) {
                    element.click();
                }

                element.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: element.ownerDocument.defaultView
                }));

                if (element.tabIndex >= 0) {
                    element.focus();
                    element.dispatchEvent(new KeyboardEvent('keydown', {
                        key: ' ',
                        code: 'Space',
                        keyCode: 32,
                        bubbles: true
                    }));
                }
            } catch (error) {
                warn('点击元素失败:', error);
            }
        }

        findAndClickNextChapter() {
            try {
                const courseTree = document.getElementById('coursetree');
                if (!courseTree) {
                    this.updateStatus('未找到课程目录', '无法进行章节切换');
                    this.switchingChapter = false;
                    return;
                }

                const chapterLinks = courseTree.querySelectorAll('.posCatalog_select');
                const currentActiveChapter = courseTree.querySelector('.posCatalog_select.posCatalog_active');

                if (!currentActiveChapter) {
                    this.updateStatus('未找到当前章节', '无法确定切换目标');
                    this.switchingChapter = false;
                    return;
                }

                let currentIndex = Array.from(chapterLinks).indexOf(currentActiveChapter);
                if (currentIndex === -1) {
                    this.updateStatus('无法定位当前章节', '切换逻辑错误');
                    this.switchingChapter = false;
                    return;
                }

                // 寻找下一个未完成的章节
                for (let i = currentIndex + 1; i < chapterLinks.length; i++) {
                    const chapter = chapterLinks[i];
                    const isCompleted = this.isChapterCompleted(chapter);

                    if (!isCompleted) {
                        this.updateStatus('找到下一个未完成章节', `切换到第 ${i + 1} 个章节`);
                        const chapterLink = chapter.querySelector('a, .posCatalog_name');
                        if (chapterLink) {
                            chapterLink.click();
                            this.updateStatus('已切换章节', '等待新页面加载');

                            // 切换后重置所有状态
                            setTimeout(() => {
                                this.retryCount = 0;
                                this.taskCompletedCount = 0;
                                this.deepScanCount = 0;
                                this.currentPlayer = null;
                                this.videoEndedDetected = false;
                                this.lastVideoTime = 0;
                                this.videoStuckCount = 0;
                                this.switchingChapter = false;
                                this.updateStatus('章节切换完成', '重新开始检测');
                            }, 5000); // 等待5秒让新页面完全加载

                            return;
                        }
                    }
                }

                this.updateStatus('🎉 课程已完成！', '恭喜完成所有章节学习！');
                this.switchingChapter = false;

            } catch (error) {
                this.updateStatus('章节切换失败', error.message);
                this.switchingChapter = false;
                error('章节切换失败:', error);
            }
        }

        isChapterCompleted(chapterElement) {
            const completedIcon = chapterElement.querySelector('.icon_Completed');
            if (!completedIcon) {
                return false;
            }
            const hoverTips = chapterElement.querySelector('.prevHoverTips');
            return hoverTips && hoverTips.textContent.includes('已完成');
        }

        manualPlay() {
            this.updateStatus('手动播放模式', '立即执行检测');
            this.deepScanCount = 0;
            this.switchingChapter = false;
            this.checkAndPlay();
        }

        clickNextChapter() {
            this.updateStatus('手动切换章节', '正在寻找下一章节');
            this.switchingChapter = true;
            this.findAndClickNextChapter();
        }

        isElementVisible(element) {
            if (!element) return false;
            try {
                const rect = element.getBoundingClientRect();
                const style = element.ownerDocument.defaultView.getComputedStyle(element);
                return style.display !== 'none' &&
                       style.visibility !== 'hidden' &&
                       style.opacity !== '0' &&
                       rect.width > 0 &&
                       rect.height > 0;
            } catch (e) {
                return false;
            }
        }
    }

    const autoPlayController = new AutoPlayController();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                autoPlayController.init();
            }, 2000);
        });
    } else {
        setTimeout(() => {
            autoPlayController.init();
        }, 2000);
    }

    log("超星防切屏和自动播放脚本 v2.8 已启动 - 智能切换版");

})();
