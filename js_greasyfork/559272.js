// ==UserScript==
// @name         学习通视频自动播放与跳转
// @namespace    https://github.com/Delta-Water
// @version      2.7
// @description  自动播放学习通视频，播放完成后自动跳转到下一节（目标科目是英语）
// @author       Delta_Water
// @match        https://mooc1.chaoxing.com/mycourse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559272/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8E%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/559272/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8E%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        autoStart: true,           // 是否自动开始
        autoMute: false,           // 是否自动静音
        videoEndThreshold: 0.98,   // 视频完成阈值
        checkInterval: 2000,       // 检查间隔
        maxRetryCount: 10,         // 最大重试次数
        nextPageWaitTime: 3000     // 进入下一集后的等待时间（毫秒）
    };

    // 全局变量
    let video = null;
    let videojsPlayer = null;
    let currentTaskIndex = -1;
    let isRunning = false;
    let taskList = [];
    let retryCount = 0;
    let isVideoPage = false;

    // 简洁日志
    function log(msg) {
        console.log('[学习通]', msg);
    }

    // 检测当前页面是否为视频页面
    function detectVideoPage() {
        // 方法1: 直接查找视频元素
        video = getVideoElement();
        if (video) {
            log(`找到视频元素: ${video.tagName} ${video.id || video.className}`);
            return true;
        }

        // 方法2: 查找视频播放器相关元素
        const videoPlayers = document.querySelectorAll('.vjs-tech, .video-js, .video-player, [class*="video"]');
        if (videoPlayers.length > 0) {
            log(`找到视频播放器元素: ${videoPlayers.length}个`);
            return true;
        }

        // 方法3: 查找iframe中的视频
        const iframes = document.querySelectorAll('iframe');
        for (let iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc.querySelector('video, .vjs-tech, #video_html5_api')) {
                    log('iframe中发现视频元素');
                    return true;
                }
            } catch (e) {}
        }

        // 方法4: 检查页面标题或内容是否包含视频相关关键词
        const pageText = document.body.textContent.toLowerCase();
        const videoKeywords = ['视频', 'video', '播放', 'play', '观看', 'watch'];
        for (let keyword of videoKeywords) {
            if (pageText.includes(keyword) && pageText.length < 10000) {
                // 进一步检查是否有视频控件
                const controls = document.querySelectorAll('button[title*="播放"], button[title*="play"]');
                if (controls.length > 0) {
                    log(`找到视频相关控件: ${keyword}`);
                    return true;
                }
            }
        }

        return false;
    }

    // 获取视频元素
    function getVideoElement() {
        // 1. 直接通过ID获取
        video = document.getElementById('video_html5_api');
        if (video) return video;

        // 2. 通过类名获取
        video = document.querySelector('.vjs-tech');
        if (video) return video;

        // 3. 查找所有video元素
        const videos = document.querySelectorAll('video');
        if (videos.length > 0) {
            video = videos[0];
            return video;
        }

        // 4. 尝试从iframe中获取
        try {
            const iframes = document.querySelectorAll('iframe');
            for (let iframe of iframes) {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    video = iframeDoc.querySelector('#video_html5_api') || iframeDoc.querySelector('video');
                    if (video) return video;

                    // 查找嵌套iframe
                    const nestedIframes = iframeDoc.querySelectorAll('iframe');
                    for (let nestedIframe of nestedIframes) {
                        try {
                            const nestedDoc = nestedIframe.contentDocument || nestedIframe.contentWindow.document;
                            video = nestedDoc.querySelector('#video_html5_api') || nestedDoc.querySelector('video');
                            if (video) return video;
                        } catch (e) {}
                    }
                } catch (e) {}
            }
        } catch (e) {}

        return null;
    }

    // 获取所有任务列表
    function getTaskList() {
        taskList = [];

        // 查找所有章节任务
        const tasks = document.querySelectorAll('.posCatalog_name, .chapter_item, .catalog_section li, .timeline li, [onclick*="getTeacherAjax"]');

        tasks.forEach((task, index) => {
            const title = task.textContent.trim();
            const onclick = task.getAttribute('onclick');

            if (onclick && onclick.includes('getTeacherAjax')) {
                taskList.push({
                    element: task,
                    title: title,
                    onclick: onclick,
                    index: index
                });
            }
        });

        if (taskList.length === 0) {
            // 备用方案：查找所有可点击的章节
            const chapterLinks = document.querySelectorAll('a[href*="getTeacherAjax"], span[onclick*="getTeacherAjax"]');
            chapterLinks.forEach((link, index) => {
                const title = link.textContent.trim();
                const onclick = link.getAttribute('onclick') || link.getAttribute('href');
                if (onclick && onclick.includes('getTeacherAjax')) {
                    taskList.push({
                        element: link,
                        title: title,
                        onclick: onclick,
                        index: index
                    });
                }
            });
        }

        log(`找到 ${taskList.length} 个任务`);
        return taskList;
    }

    // 查找当前正在播放的任务
    function findCurrentTask() {
        if (taskList.length === 0) return -1;

        // 查找active状态的元素
        const activeElements = document.querySelectorAll('.current, .active, .currents, .playing, .focus');

        for (let activeEl of activeElements) {
            // 在taskList中查找对应的元素
            for (let i = 0; i < taskList.length; i++) {
                if (taskList[i].element === activeEl ||
                    taskList[i].element.contains(activeEl) ||
                    activeEl.contains(taskList[i].element)) {
                    return i;
                }
            }
        }

        return -1;
    }

    // 播放下一个任务
    function playNextTask() {
        if (taskList.length === 0) {
            getTaskList();
            if (taskList.length === 0) {
                log('未找到任务列表');
                return false;
            }
        }

        let nextIndex = currentTaskIndex + 1;

        // 如果当前任务未知，尝试查找
        if (currentTaskIndex === -1) {
            currentTaskIndex = findCurrentTask();
            if (currentTaskIndex !== -1) {
                nextIndex = currentTaskIndex + 1;
            } else {
                nextIndex = 0;
            }
        }

        // 检查是否所有任务都已完成
        if (nextIndex >= taskList.length) {
            log('所有任务已完成');
            return false;
        }

        // 点击下一个任务
        const nextTask = taskList[nextIndex];
        log(`跳转到任务 ${nextIndex + 1}/${taskList.length}: ${nextTask.title}`);
        nextTask.element.click();

        currentTaskIndex = nextIndex;
        retryCount = 0;

        return true;
    }

    // 跳过当前任务（重试失败时调用）
    function skipCurrentTask() {
        log(`跳过当前任务 ${currentTaskIndex + 1}`);

        // 直接播放下一个任务
        if (playNextTask()) {
            // 重置相关状态
            isVideoPage = false;
            video = null;
            videojsPlayer = null;
            retryCount = 0;

            // 等待页面加载后重新检测
            setTimeout(checkAndPlay, config.nextPageWaitTime);
            return true;
        }
        return false;
    }

    // 阻止暂停功能
    function enableAntiPause() {
        video = getVideoElement();
        if (!video) return false;

        log(`视频信息: ${video.tagName} ${video.id || ''} ${video.className || ''}`);

        // 获取Video.js播放器
        if (typeof videojs !== 'undefined') {
            const players = videojs.getPlayers();
            for (const playerId in players) {
                if (players[playerId].el().contains(video)) {
                    videojsPlayer = players[playerId];
                    log('找到Video.js播放器');
                    break;
                }
            }
        }

        // 阻止原生video的pause方法
        if (!video._originalPause) {
            video._originalPause = video.pause;
            video.pause = () => {
                log('阻止视频暂停');
                video.play().catch(e => {});
            };
        }

        // 针对Video.js播放器的处理
        if (videojsPlayer && !videojsPlayer._originalPause) {
            videojsPlayer._originalPause = videojsPlayer.pause;
            videojsPlayer.pause = () => {
                log('阻止Video.js暂停');
                videojsPlayer.play().catch(e => {});
            };
        }

        return true;
    }

    // 静音功能
    function muteVideo() {
        if (!video) video = getVideoElement();
        if (!video) return;

        video.volume = 0;
        video.muted = true;

        if (videojsPlayer) {
            videojsPlayer.muted(true);
            videojsPlayer.volume(0);
        }

        log('视频已静音');
    }

    // 开始播放当前视频 - 保持原来的播放方法
    function startPlaying() {
        if (!video) video = getVideoElement();
        if (!video) return false;

        // 阻止暂停
        if (!enableAntiPause()) {
            return false;
        }

        // 自动静音
        if (config.autoMute) {
            muteVideo();
        }

        // 如果视频暂停，开始播放
        if (video.paused) {
            log('开始播放视频');
            video.play().catch(e => {
                log('自动播放失败: ' + e.message);
                // 尝试点击播放按钮
                setTimeout(() => {
                    const playButtons = document.querySelectorAll('button, .vjs-big-play-button, [class*="play"]');
                    for (let btn of playButtons) {
                        if (btn.textContent.includes('播放') ||
                            btn.className.includes('play') ||
                            btn.getAttribute('title')?.includes('播放')) {
                            btn.click();
                            log('点击播放按钮');
                            break;
                        }
                    }
                }, 1000);
            });
        } else {
            log('视频已在播放中');
        }

        return true;
    }

    // 监控视频播放
    function monitorVideoPlayback() {
        if (!video) return;

        // 清除之前的监听器
        video.removeEventListener('ended', handleVideoEnded);
        video.removeEventListener('timeupdate', handleTimeUpdate);

        if (videojsPlayer) {
            videojsPlayer.off('ended', handleVideoEnded);
            videojsPlayer.off('timeupdate', handleTimeUpdate);
        }

        // 添加新的监听器
        video.addEventListener('ended', handleVideoEnded);
        video.addEventListener('timeupdate', handleTimeUpdate);

        if (videojsPlayer) {
            videojsPlayer.on('ended', handleVideoEnded);
            videojsPlayer.on('timeupdate', handleTimeUpdate);
        }

        log('开始监控视频播放');
    }

    // 时间更新处理
    function handleTimeUpdate() {
        if (!video || video.duration <= 0) return;

        const progress = video.currentTime / video.duration;
        if (progress >= config.videoEndThreshold && !video.ended) {
            log(`视频即将完成: ${(progress * 100).toFixed(1)}%`);
            // 提前准备跳转
            if (progress > 0.99) {
                handleVideoEnded();
            }
        }
    }

    // 视频结束处理
    function handleVideoEnded() {
        log('视频播放完成，准备跳转到下一节');

        // 等待一小段时间确保视频完全结束
        setTimeout(() => {
            isVideoPage = false;
            video = null;
            videojsPlayer = null;

            // 跳转到下一个任务
            if (playNextTask()) {
                // 使用配置的等待时间
                log(`等待 ${config.nextPageWaitTime}ms 后开始检测`);
                setTimeout(checkAndPlay, config.nextPageWaitTime);
            } else {
                log('没有更多任务');
                isRunning = false;
                updateStatus();
            }
        }, 2000);
    }

    // 检查并播放视频
    function checkAndPlay() {
        retryCount++;

        // 检查是否超过最大重试次数
        if (retryCount > config.maxRetryCount) {
            log(`超过最大重试次数 (${config.maxRetryCount})，自动跳过当前任务`);

            // 自动跳过当前任务
            if (skipCurrentTask()) {
                log('已自动跳过当前任务，尝试下一个任务');
                return;
            } else {
                log('无法跳过当前任务，停止尝试');
                isRunning = false;
                updateStatus();
                return;
            }
        }

        log(`第 ${retryCount} 次检测页面...`);

        // 检测是否为视频页面
        isVideoPage = detectVideoPage();

        if (isVideoPage) {
            log('检测到视频页面，开始处理');
            video = getVideoElement();

            if (video) {
                // 开始播放
                if (startPlaying()) {
                    // 开始监控
                    monitorVideoPlayback();
                    retryCount = 0; // 重置重试计数
                } else {
                    // 重试
                    setTimeout(checkAndPlay, 2000);
                }
            } else {
                // 重试获取视频
                setTimeout(checkAndPlay, 2000);
            }
        } else {
            log('当前页面不是视频页面');

            // 如果当前不是视频页面，等待后尝试跳转
            setTimeout(() => {
                if (!isVideoPage && isRunning) {
                    log('尝试跳转到下一个任务');
                    playNextTask();

                    // 等待后重新检测
                    log(`等待 ${config.nextPageWaitTime}ms 后重新检测`);
                    setTimeout(checkAndPlay, config.nextPageWaitTime);
                }
            }, config.nextPageWaitTime);
        }
    }

    // 主监控循环
    function startMonitoring() {
        if (isRunning) return;
        isRunning = true;

        log('开始自动播放监控');

        // 初始化任务列表
        getTaskList();

        // 查找当前任务
        currentTaskIndex = findCurrentTask();
        if (currentTaskIndex !== -1) {
            log(`当前任务: ${currentTaskIndex + 1}/${taskList.length}`);
        }

        // 开始检测和播放
        checkAndPlay();

        // 定期检查状态
        const statusCheck = setInterval(() => {
            if (!isRunning) {
                clearInterval(statusCheck);
                return;
            }

            // 如果当前是视频页面但没有视频元素，重新检测
            if (isVideoPage && !video) {
                video = getVideoElement();
                if (!video) {
                    log('视频页面丢失视频元素，重新检测');
                    isVideoPage = false;
                    checkAndPlay();
                }
            }

            updateStatus();
        }, 5000);
    }

    // 创建简洁的控制面板
    function createControlPanel() {
        const style = document.createElement('style');
        style.textContent = `
            .cx-control-panel {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .cx-control-btn {
                padding: 8px 16px;
                background: linear-gradient(45deg, #4CAF50, #2E7D32);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: all 0.3s;
                min-width: 120px;
                text-align: center;
            }

            .cx-control-btn:hover {
                opacity: 0.9;
                transform: translateY(-2px);
            }

            .cx-control-btn:active {
                transform: translateY(0);
            }

            .cx-control-btn.stop {
                background: linear-gradient(45deg, #f44336, #c62828);
            }

            .cx-control-btn.next {
                background: linear-gradient(45deg, #FF9800, #F57C00);
            }

            .cx-control-btn.skip {
                background: linear-gradient(45deg, #9C27B0, #6A1B9A);
            }

            .cx-status {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 9998;
                border-left: 3px solid #4CAF50;
                min-width: 200px;
            }
        `;
        document.head.appendChild(style);

        // 状态显示
        const statusDiv = document.createElement('div');
        statusDiv.className = 'cx-status';
        statusDiv.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px; color: #4CAF50;">学习通自动播放 v2.7</div>
            <div>状态: <span id="cx-status">准备中</span></div>
            <div>页面: <span id="cx-page">检测中</span></div>
            <div>任务: <span id="cx-task">-/-</span></div>
            <div>重试: <span id="cx-retry">0/${config.maxRetryCount}</span></div>
        `;
        document.body.appendChild(statusDiv);

        // 更新状态
        window.updateStatus = function() {
            const statusEl = document.getElementById('cx-status');
            const pageEl = document.getElementById('cx-page');
            const taskEl = document.getElementById('cx-task');
            const retryEl = document.getElementById('cx-retry');

            if (statusEl) {
                statusEl.textContent = isRunning ? '运行中' : '已停止';
                statusEl.style.color = isRunning ? '#4CAF50' : '#f44336';
            }

            if (pageEl) {
                pageEl.textContent = isVideoPage ? '视频页面' : '非视频页面';
                pageEl.style.color = isVideoPage ? '#4CAF50' : '#FF9800';
            }

            if (taskEl) {
                const current = currentTaskIndex >= 0 ? currentTaskIndex + 1 : '?';
                const total = taskList.length || '?';
                taskEl.textContent = `${current}/${total}`;
            }

            if (retryEl) {
                retryEl.textContent = `${retryCount}/${config.maxRetryCount}`;
                retryEl.style.color = retryCount >= config.maxRetryCount ? '#f44336' :
                                     retryCount > config.maxRetryCount/2 ? '#FF9800' : '#4CAF50';
            }
        };

        // 控制面板 - 精简版（移除静音按钮）
        const panel = document.createElement('div');
        panel.className = 'cx-control-panel';

        // 开始按钮
        const startBtn = document.createElement('button');
        startBtn.className = 'cx-control-btn';
        startBtn.textContent = '▶ 开始';
        startBtn.onclick = () => {
            isRunning = true;
            startMonitoring();
            updateStatus();
        };

        // 停止按钮
        const stopBtn = document.createElement('button');
        stopBtn.className = 'cx-control-btn stop';
        stopBtn.textContent = '⏹️ 停止';
        stopBtn.onclick = () => {
            isRunning = false;
            updateStatus();
        };

        // 下一集按钮
        const nextBtn = document.createElement('button');
        nextBtn.className = 'cx-control-btn next';
        nextBtn.textContent = '⏭️ 下一集';
        nextBtn.onclick = () => {
            if (playNextTask()) {
                setTimeout(() => {
                    video = null;
                    videojsPlayer = null;
                    isVideoPage = false;
                    retryCount = 0;

                    // 等待后重新检测
                    setTimeout(checkAndPlay, config.nextPageWaitTime);
                }, 1000);
            }
        };

        // 跳过按钮
        const skipBtn = document.createElement('button');
        skipBtn.className = 'cx-control-btn skip';
        skipBtn.textContent = '⏩ 跳过';
        skipBtn.onclick = () => {
            if (skipCurrentTask()) {
                log('手动跳过当前任务');
            }
        };

        panel.appendChild(startBtn);
        panel.appendChild(stopBtn);
        panel.appendChild(nextBtn);
        panel.appendChild(skipBtn);
        document.body.appendChild(panel);

        // 定期更新状态
        setInterval(updateStatus, 1000);
    }

    // 初始化
    function init() {
        log('脚本加载完成 v2.7');
        createControlPanel();

        // 自动开始
        if (config.autoStart) {
            setTimeout(() => {
                isRunning = true;
                startMonitoring();
                updateStatus();
            }, 2000);
        }

        // 监听页面变化
        const observer = new MutationObserver(() => {
            if (!video && isRunning) {
                // 页面变化时重新检测
                setTimeout(() => {
                    video = getVideoElement();
                    if (video && !isVideoPage) {
                        isVideoPage = true;
                        checkAndPlay();
                    }
                }, 1000);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        window.addEventListener('load', init);
    } else {
        init();
    }

})();
