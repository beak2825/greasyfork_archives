// ==UserScript==
// @name         消防课程自动刷课工具 - 缓冲计时修复版
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  自动处理消防课程验证码、下一集切换和视频播放，20秒加载/缓冲超时刷新（独立计时）
// @author       Doubao
// @match        https://shhxf.119.gov.cn/trainOnline/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/560079/%E6%B6%88%E9%98%B2%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%B7%A5%E5%85%B7%20-%20%E7%BC%93%E5%86%B2%E8%AE%A1%E6%97%B6%E4%BF%AE%E5%A4%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/560079/%E6%B6%88%E9%98%B2%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%B7%A5%E5%85%B7%20-%20%E7%BC%93%E5%86%B2%E8%AE%A1%E6%97%B6%E4%BF%AE%E5%A4%8D%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 优化后的配置参数
    const config = {
        checkInterval: 1000,          // 基础检查间隔(毫秒)
        refreshOnCaptcha: true,        // 遇到验证码时刷新页面
        nextEpisodeOnEnd: true,        // 课程结束时切换下一集
        autoPlayOnPause: true,         // 视频暂停时自动播放
        debugMode: false,              // 调试模式
        panelVisible: true,            // 控制面板可见性
        minPlayDuration: 60,           // 最小播放时长(秒)
        endThreshold: 0.997,           // 视频播放完成的阈值
        maxVideoLoadTime: 180000,       // 最大视频加载等待时间(20秒)
        maxBufferTime: 180000,          // 最大缓冲等待时间(20秒)
        videoLoadCheckInterval: 1000,  // 视频加载检查间隔(1秒)
        sessionMaintainInterval: 300000 // 会话保持间隔(5分钟)
    };

    // 状态变量
    let isProcessing = false;
    let lastEpisodeId = null;
    let panelElement = null;
    let logMessages = [];
    let videoStats = {
        currentPlayTime: 0,
        lastPlayTime: 0,
        totalPlayTime: 0,
        isPlaying: false,
        lastCheckedTime: 0,
        loadStartTime: 0,              // 视频加载开始时间
        lastProgressTime: 0,           // 最后进度更新时间
        bufferStartTime: 0,            // 缓冲开始时间
        isBuffering: false             // 是否正在缓冲（新增）
    };

    // 初始化函数
    function init() {
        console.log('消防课程自动刷课工具已启动 - 缓冲计时修复版');

        // 注册菜单命令
        GM_registerMenuCommand("显示/隐藏面板", togglePanel, "显示或隐藏控制面板");
        GM_registerMenuCommand("启用自动刷课", toggleScript, "启用或禁用自动刷课功能");
        GM_registerMenuCommand("刷新页面", refreshPage, "刷新当前课程页面");

        // 初始化状态
        lastEpisodeId = GM_getValue('lastEpisodeId', null);

        // 创建控制面板
        createControlPanel();

        // 启动会话保持
        maintainSession();

        // 开始监控
        startMonitoring();
    }

    // 创建控制面板
    function createControlPanel() {
        if (panelElement) return;

        panelElement = document.createElement('div');
        panelElement.id = 'fireCourseAutoPanel';
        panelElement.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            font-family: Arial, sans-serif;
            max-width: 350px;
            display: ${config.panelVisible ? 'block' : 'none'};
        `;

        panelElement.innerHTML = `
            <h3 style="margin-top: 0; border-bottom: 1px solid #555; padding-bottom: 10px;">消防课程自动刷课工具</h3>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="chkAutoPlay" ${config.autoPlayOnPause ? 'checked' : ''}>
                    自动播放暂停视频
                </label>
                <label style="display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="chkNextEpisode" ${config.nextEpisodeOnEnd ? 'checked' : ''}>
                    自动切换下一集
                </label>
                <label style="display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="chkRefreshCaptcha" ${config.refreshOnCaptcha ? 'checked' : ''}>
                    验证码自动刷新
                </label>
                <label style="display: block; margin-bottom: 10px;">
                    <input type="checkbox" id="chkDebugMode" ${config.debugMode ? 'checked' : ''}>
                    调试模式(控制台输出)
                </label>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="btnRefreshPage" style="padding: 5px 10px; margin-right: 5px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">刷新页面</button>
                <button id="btnTogglePanel" style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">${config.panelVisible ? '隐藏面板' : '显示面板'}</button>
            </div>
            <div style="border-top: 1px solid #555; padding-top: 10px; margin-top: 10px;">
                <h4 style="margin-top: 0;">当前状态</h4>
                <div id="panelStatus" style="font-size: 12px; color: #ccc; min-height: 40px;"></div>
            </div>
            <div style="border-top: 1px solid #555; padding-top: 10px; margin-top: 10px;">
                <h4 style="margin-top: 0;">视频状态</h4>
                <div id="videoProgress" style="font-size: 12px; color: #ccc; margin-bottom: 5px;">加载中...</div>
                <div id="progressBar" style="height: 8px; background-color: #555; border-radius: 4px; overflow: hidden;">
                    <div id="progressFill" style="height: 100%; background-color: #4CAF50; width: 0%;"></div>
                </div>
                <div id="videoStatus" style="font-size: 11px; color: #aaa; margin-top: 5px;">
                    <div>加载状态: <span id="loadStatus">正常</span></div>
                    <div>缓冲状态: <span id="bufferStatus">正常</span></div>
                </div>
            </div>
            <div style="border-top: 1px solid #555; padding-top: 10px; margin-top: 10px;">
                <h4 style="margin-top: 0;">操作日志</h4>
                <div id="panelLogs" style="font-size: 11px; color: #aaa; min-height: 60px; overflow-y: auto; max-height: 120px; line-height: 1.2;"></div>
            </div>
        `;

        document.body.appendChild(panelElement);

        // 绑定控制面板事件
        document.getElementById('chkAutoPlay').addEventListener('change', function() {
            config.autoPlayOnPause = this.checked;
            logEvent(`自动播放功能已${this.checked ? '启用' : '禁用'}`);
        });

        document.getElementById('chkNextEpisode').addEventListener('change', function() {
            config.nextEpisodeOnEnd = this.checked;
            logEvent(`自动下一集功能已${this.checked ? '启用' : '禁用'}`);
        });

        document.getElementById('chkRefreshCaptcha').addEventListener('change', function() {
            config.refreshOnCaptcha = this.checked;
            logEvent(`验证码刷新功能已${this.checked ? '启用' : '禁用'}`);
        });

        document.getElementById('chkDebugMode').addEventListener('change', function() {
            config.debugMode = this.checked;
            logEvent(`调试模式已${this.checked ? '启用' : '禁用'}`);
        });

        document.getElementById('btnRefreshPage').addEventListener('click', refreshPage);
        document.getElementById('btnTogglePanel').addEventListener('click', togglePanel);
    }

    // 切换面板显示状态
    function togglePanel() {
        config.panelVisible = !config.panelVisible;
        if (panelElement) {
            panelElement.style.display = config.panelVisible ? 'block' : 'none';
            document.getElementById('btnTogglePanel').textContent = config.panelVisible ? '隐藏面板' : '显示面板';
        }
    }

    // 更新面板状态
    function updatePanelStatus() {
        if (!panelElement) return;

        const statusDiv = document.getElementById('panelStatus');
        const currentEpisode = getCurrentEpisode();

        let statusText = "等待课程加载...";
        if (currentEpisode) {
            statusText = `当前课程: ${currentEpisode.title}`;

            const video = document.getElementById('demoVideo_html5_api');
            if (video) {
                const isPlaying = !video.paused && !video.ended;
                statusText += ` | 播放状态: ${isPlaying ? '播放中' : '已暂停'}`;

                const countdownElement = document.querySelector('.vjs-remaining-time-display');
                if (countdownElement) {
                    statusText += ` | 剩余时间: ${countdownElement.textContent.trim()}`;
                }
            }
        }

        statusDiv.textContent = statusText;
    }

    // 更新视频进度
    function updateVideoProgress() {
        if (!panelElement) return;

        const video = document.getElementById('demoVideo_html5_api');
        if (!video || !video.duration) {
            document.getElementById('videoProgress').textContent = '加载中...';
            document.getElementById('progressFill').style.width = '0%';
            return;
        }

        const currentTime = Math.floor(video.currentTime);
        const duration = Math.floor(video.duration);
        const percent = Math.min(100, Math.floor((currentTime / duration) * 100));

        const timeStr = formatTime(currentTime) + ' / ' + formatTime(duration);
        document.getElementById('videoProgress').textContent = `进度: ${timeStr} (${percent}%)`;
        document.getElementById('progressFill').style.width = `${percent}%`;

        // 记录最后有效进度时间
        videoStats.lastProgressTime = Date.now();
    }

    // 格式化时间为 MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 记录事件到日志
    function logEvent(message) {
        logMessages.push(`[${new Date().toLocaleTimeString()}] ${message}`);
        if (logMessages.length > 10) logMessages.shift(); // 限制日志数量

        if (panelElement) {
            const logsDiv = document.getElementById('panelLogs');
            logsDiv.innerHTML = logMessages.join('<br>');
        }

        if (config.debugMode) console.log(message);
    }

    // 开始监控
    function startMonitoring() {
        // 初始等待确保页面加载
        setTimeout(() => {
            updatePanelStatus();
            logEvent("开始监控课程状态...");

            // 初始化视频状态
            videoStats.loadStartTime = Date.now();
            videoStats.lastProgressTime = Date.now();

            // 定期检查课程状态
            setInterval(checkCourseStatus, config.checkInterval);

            // 定期检查视频加载状态
            setInterval(checkVideoStatus, config.videoLoadCheckInterval);

            // 监听视频事件
            const video = document.getElementById('demoVideo_html5_api');
            if (video) {
                video.addEventListener('play', onVideoPlay);
                video.addEventListener('pause', onVideoPause);
                video.addEventListener('ended', onVideoEnded);
                video.addEventListener('timeupdate', onVideoTimeUpdate);
                video.addEventListener('waiting', onVideoWaiting);
                video.addEventListener('playing', onVideoPlaying);
                video.addEventListener('progress', onVideoProgress);
            }
        }, 3000); // 延迟3秒启动
    }

    // 检查课程状态
    function checkCourseStatus() {
        if (isProcessing) return;

        try {
            // 检查是否有验证码
            if (config.refreshOnCaptcha && checkForCaptcha()) {
                handleCaptcha();
                return;
            }

            // 检查视频进度
            updateVideoProgress();

            // 检查视频是否真正完成
            if (config.nextEpisodeOnEnd && checkVideoCompleted()) {
                goToNextEpisode();
                return;
            }

            // 检查视频播放状态
            if (config.autoPlayOnPause) {
                checkVideoPlayback();
            }

            // 更新面板状态
            updatePanelStatus();
        } catch (error) {
            if (config.debugMode) console.error("检查课程状态时出错:", error);
            logEvent(`错误: 检查课程状态时发生异常 - ${error.message}`);
        }
    }

    // 检查视频状态（加载和缓冲）
    function checkVideoStatus() {
        const video = document.getElementById('demoVideo_html5_api');
        if (!video) return;

        const now = Date.now();

        // 1. 检查视频加载状态
        if (video.readyState < 3) { // 0=HAVE_NOTHING, 1=HAVE_METADATA, 2=HAVE_CURRENT_DATA
            const loadTime = now - videoStats.loadStartTime;
            const loadStatus = `加载中 (${Math.floor(loadTime/1000)}秒)`;
            document.getElementById('loadStatus').textContent = loadStatus;
            document.getElementById('loadStatus').style.color = '#FF9800';

            // 超过最大加载时间
            if (loadTime > config.maxVideoLoadTime) {
                logEvent(`视频加载超时 (${Math.floor(loadTime/1000)}秒)，刷新页面`);
                refreshPage();
                return;
            }
        } else {
            document.getElementById('loadStatus').textContent = '正常';
            document.getElementById('loadStatus').style.color = '#4CAF50';
        }

        // 2. 检查视频缓冲状态
        if (videoStats.isBuffering) {
            const bufferTime = now - videoStats.bufferStartTime;
            const bufferStatus = `缓冲中 (${Math.floor(bufferTime/1000)}秒)`;
            document.getElementById('bufferStatus').textContent = bufferStatus;
            document.getElementById('bufferStatus').style.color = '#FF9800';

            // 超过最大缓冲时间
            if (bufferTime > config.maxBufferTime) {
                logEvent(`视频缓冲超时 (${Math.floor(bufferTime/1000)}秒)，刷新页面`);
                refreshPage();
                return;
            }
        } else {
            document.getElementById('bufferStatus').textContent = '正常';
            document.getElementById('bufferStatus').style.color = '#4CAF50';
        }
    }

    // 视频等待事件（缓冲开始）
    function onVideoWaiting() {
        if (!videoStats.isBuffering) {
            videoStats.isBuffering = true;
            videoStats.bufferStartTime = Date.now(); // 重置缓冲计时器
            logEvent("视频开始缓冲...");
        }
    }

    // 视频播放事件（缓冲结束）
    function onVideoPlaying() {
        if (videoStats.isBuffering) {
            const bufferTime = Date.now() - videoStats.bufferStartTime;
            logEvent(`缓冲结束 (${Math.floor(bufferTime/1000)}秒)`);
            videoStats.isBuffering = false;
            videoStats.bufferStartTime = 0; // 重置缓冲计时器
        }
    }

    // 视频进度更新事件
    function onVideoProgress() {
        // 当有新的数据加载时，重置缓冲计时器
        if (videoStats.isBuffering) {
            videoStats.bufferStartTime = Date.now();
            logEvent("检测到新数据加载，重置缓冲计时");
        }
    }

    // 检查是否存在验证码
    function checkForCaptcha() {
        const captchaElement = document.getElementById('verifyCodeImg');
        const hasCaptcha = captchaElement && captchaElement.innerHTML && captchaElement.innerHTML.trim() !== '';

        if (hasCaptcha) {
            logEvent("检测到验证码，准备刷新页面");
        }

        return hasCaptcha;
    }

    // 处理验证码
    function handleCaptcha() {
        logEvent("开始处理验证码...");
        isProcessing = true;

        // 记录当前状态
        const currentEpisode = getCurrentEpisode();
        if (currentEpisode) {
            GM_setValue('lastEpisodeId', currentEpisode.id);
            logEvent(`已记录当前课程: ${currentEpisode.title}`);
        }

        // 刷新页面
        setTimeout(() => {
            window.location.reload();
            isProcessing = false;
            logEvent("页面已刷新，等待课程加载...");
        }, 1000);
    }

    // 检查视频是否真正完成
    function checkVideoCompleted() {
        const video = document.getElementById('demoVideo_html5_api');
        if (!video || video.duration === Infinity) return false;

        // 检查视频是否结束且满足最小播放时长
        const isEnded = video.ended;
        const isNearEnd = video.currentTime / video.duration >= config.endThreshold;
        const hasMinimumPlayTime = video.currentTime >= config.minPlayDuration;

        if ((isEnded || isNearEnd) && hasMinimumPlayTime) {
            logEvent(`视频已完成播放: ${Math.floor(video.currentTime)}s / ${Math.floor(video.duration)}s`);
            return true;
        }

        return false;
    }

    // 视频播放事件处理
    function onVideoPlay() {
        logEvent("视频开始播放");
        videoStats.isPlaying = true;
        videoStats.lastPlayTime = Date.now();
        videoStats.loadStartTime = Date.now();
        videoStats.lastProgressTime = Date.now();
    }

    // 视频暂停事件处理
    function onVideoPause() {
        logEvent("视频已暂停");
        videoStats.isPlaying = false;
        videoStats.lastPlayTime = 0;

        if (config.autoPlayOnPause) {
            const video = document.getElementById('demoVideo_html5_api');
            if (video) {
                video.play().catch(error => {
                    if (config.debugMode) console.error("自动播放视频时出错:", error);
                    logEvent(`错误: 自动播放视频失败 - ${error.message}`);
                });
            }
        }
    }

    // 视频结束事件处理
    function onVideoEnded() {
        logEvent("视频已结束");
        videoStats.isPlaying = false;

        if (config.nextEpisodeOnEnd && checkVideoCompleted()) {
            goToNextEpisode();
        }
    }

    // 视频时间更新事件处理
    function onVideoTimeUpdate() {
        if (!videoStats.lastCheckedTime) {
            videoStats.lastCheckedTime = Date.now();
            return;
        }

        const now = Date.now();
        const delta = (now - videoStats.lastCheckedTime) / 1000; // 秒
        videoStats.lastCheckedTime = now;

        if (videoStats.isPlaying) {
            videoStats.totalPlayTime += delta;
        }

        // 更新最后有效进度时间
        videoStats.lastProgressTime = now;
    }

    // 检查视频播放状态
    function checkVideoPlayback() {
        const video = document.getElementById('demoVideo_html5_api');
        if (!video) return;

        if (video.paused && !video.ended) {
            logEvent("检测到视频暂停，自动播放...");
            video.play().catch(error => {
                if (config.debugMode) console.error("自动播放视频时出错:", error);
                logEvent(`错误: 自动播放视频失败 - ${error.message}`);
            });
        }
    }

    // 获取当前课程项
    function getCurrentEpisode() {
        const currentLi = document.querySelector('li.on');
        if (currentLi) {
            const title = currentLi.textContent.trim();
            const onclick = currentLi.getAttribute('onclick');
            const ids = onclick ? onclick.match(/'([^']+)'/g) : [];
            const id = ids && ids.length > 0 ? ids[0].replace(/'/g, '') : null;

            return { title, id };
        }
        return null;
    }

    // 切换到下一集
    function goToNextEpisode() {
        if (isProcessing) return;
        isProcessing = true;

        const currentEpisode = getCurrentEpisode();
        if (!currentEpisode) {
            logEvent("无法获取当前课程信息");
            isProcessing = false;
            return;
        }

        logEvent(`当前课程: ${currentEpisode.title}, ID: ${currentEpisode.id}`);

        // 获取所有课程项
        const episodes = Array.from(document.querySelectorAll('li[onclick^="getReload"]')).map(li => {
            const title = li.textContent.trim();
            const onclick = li.getAttribute('onclick');
            const ids = onclick ? onclick.match(/'([^']+)'/g) : [];
            const id1 = ids && ids.length > 0 ? ids[0].replace(/'/g, '') : '未知';
            const id2 = ids && ids.length > 1 ? ids[1].replace(/'/g, '') : '未知';
            const isCurrent = li.classList.contains('on');
            return { title, id1, id2, isCurrent, element: li };
        });

        if (episodes.length === 0) {
            logEvent("未找到课程列表");
            isProcessing = false;
            return;
        }

        // 找到当前课程的索引
        const currentIndex = episodes.findIndex(e => e.isCurrent);
        if (currentIndex === -1) {
            logEvent("无法找到当前课程在列表中的位置");
            isProcessing = false;
            return;
        }

        // 找到下一集
        const nextEpisode = episodes[currentIndex + 1];
        if (!nextEpisode) {
            logEvent("已经是最后一集，无法继续");
            isProcessing = false;
            return;
        }

        logEvent(`切换到下一集: ${nextEpisode.title}, ID: ${nextEpisode.id2}`);

        // 记录当前状态
        GM_setValue('lastEpisodeId', nextEpisode.id2);

        // 模拟点击下一集
        setTimeout(() => {
            try {
                const nextLi = episodes[currentIndex + 1]?.element;
                if (nextLi) {
                    const event = new Event('click');
                    nextLi.dispatchEvent(event);
                    logEvent(`已触发下一集点击事件: ${nextEpisode.title}`);
                } else {
                    logEvent("错误: 找不到下一集元素");
                }

                // 备用方案：直接调用函数
                if (window.getReload && nextEpisode.id1 && nextEpisode.id2) {
                    window.getReload(nextEpisode.id1, nextEpisode.id2);
                    logEvent(`已调用getReload函数: ${nextEpisode.id1}, ${nextEpisode.id2}`);
                }
            } catch (error) {
                logEvent(`错误: 切换下一集时发生异常 - ${error.message}`);
            }

            isProcessing = false;
        }, 1500); // 延长等待时间
    }

    // 切换脚本启用状态
    function toggleScript() {
        config.autoPlayOnPause = !config.autoPlayOnPause;
        config.nextEpisodeOnEnd = !config.nextEpisodeOnEnd;
        config.refreshOnCaptcha = !config.refreshOnCaptcha;

        const status = [
            `自动播放: ${config.autoPlayOnPause ? '启用' : '禁用'}`,
            `自动下一集: ${config.nextEpisodeOnEnd ? '启用' : '禁用'}`,
            `验证码刷新: ${config.refreshOnCaptcha ? '启用' : '禁用'}`
        ].join(', ');

        logEvent(`脚本状态已更新: ${status}`);
    }

    // 刷新页面
    function refreshPage() {
        logEvent("刷新页面...");
        window.location.reload();
    }

    // 添加会话保持功能
    function maintainSession() {
        logEvent("启动会话保持功能");

        // 每5分钟执行一次保持会话的操作
        setInterval(() => {
            if (document.hidden) return; // 如果页面不在前台则不操作

            // 模拟用户活动
            simulateUserActivity();
        }, config.sessionMaintainInterval);
    }

    // 模拟用户活动
    function simulateUserActivity() {
        const events = ['mousemove', 'keydown', 'scroll'];
        events.forEach(eventType => {
            const event = new Event(eventType);
            document.dispatchEvent(event);
        });
        logEvent("执行会话保持活动");
    }

    // 初始化脚本
    init();
})();