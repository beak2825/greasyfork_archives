// ==UserScript==
// @name         广东省干部培训网络学院自动学习脚本（3分钟多刷新版）
// @namespace    http://tampermonkey.net/
// @version      27.0
// @description  3分钟定时关闭，关闭后刷新2-3次再检测学习进度
// @author       陈前
// @match        https://gbpx.gd.gov.cn/*
// @match        https://wcs1.shawcoder.xyz/*
// @match        https://cs1.gdgbpx.com/*
// @match        *://*gzqinghui.com.cn/*
// @grant        window.close
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560027/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%B9%B2%E9%83%A8%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%EF%BC%883%E5%88%86%E9%92%9F%E5%A4%9A%E5%88%B7%E6%96%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560027/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%B9%B2%E9%83%A8%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%EF%BC%883%E5%88%86%E9%92%9F%E5%A4%9A%E5%88%B7%E6%96%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 简单的状态变量
    var bofangwan = false;
    var currentUrl = window.location.href;

    // 显示状态
    showStatus("脚本已加载");

    // 主逻辑
    if (currentUrl.includes("gbpx.gd.gov.cn/gdceportal/Study/LearningCourse.aspx")) {
        // 课程列表页面
        setTimeout(function() {
            handleCourseListPage();
        }, 3000);
    } else if (currentUrl.includes("gbpx.gd.gov.cn/gdceportal/study/StudyCenter.aspx")) {
        // 学习中心页面
        setTimeout(function() {
            handleStudyCenterPage();
        }, 3000);
    } else if (currentUrl.includes("play_pc") || currentUrl.includes("CourseWare")) {
        // 视频播放页面
        setTimeout(function() {
            handleVideoPage();
        }, 2000);
    } else if (currentUrl === "https://wcs1.shawcoder.xyz/gdcecw/play_pc/playdo_pc.html") {
        // 播放完成页面
        setTimeout(function() {
            handleCompletionPage();
        }, 2000);
    } else {
        // 其他页面
        showStatus("等待处理");
    }

    // 处理课程列表页面
    function handleCourseListPage() {
        showStatus("正在处理课程列表");

        // 等待页面完全加载
        setTimeout(function() {
            var alla = document.querySelectorAll("a.courseware-list-reed");
            if (alla.length === 0) {
                // 尝试通过ID模式查找
                alla = document.querySelectorAll("a[id^='gvList_ctl']");
            }

            if (alla.length > 0) {
                // 查找第一个未完成课程
                var unfinishedCourse = null;
                for (var i = 0; i < alla.length; i++) {
                    var course = alla[i];
                    var title = course.title || course.textContent || "";
                    var progress = getCourseProgress(title);

                    if (progress < 95) {
                        unfinishedCourse = {
                            element: course,
                            index: i + 1,
                            total: alla.length,
                            progress: progress
                        };
                        break;
                    }
                }

                if (unfinishedCourse) {
                    showStatus("找到 " + unfinishedCourse.index + "/" + unfinishedCourse.total + " 个课程");
                    showControlPanel(unfinishedCourse);
                } else {
                    showStatus("所有课程已完成");
                }
            } else {
                showStatus("未找到课程链接");
            }
        }, 1000);
    }

    // 处理学习中心页面
    function handleStudyCenterPage() {
        showStatus("正在检测学习进度...");

        // 等待页面加载
        setTimeout(function() {
            // 查找课程进度元素
            var progress = getCurrentProgress();

            showStatus("当前课程进度: " + progress + "%");

            if (progress >= 95) {
                // 课程已完成，继续下一个
                showStatus("课程已完成，继续下一个");
                setTimeout(function() {
                    window.location.href = "https://gbpx.gd.gov.cn/gdceportal/Study/LearningCourse.aspx";
                }, 3000);
            } else {
                // 课程未完成，重新学习
                showStatus("课程未完成，重新学习");
                setTimeout(function() {
                    findAndClickCourse();
                }, 3000);
            }
        }, 2000);
    }

    // 获取当前进度
    function getCurrentProgress() {
        // 方法1: 查找包含百分比的div
        var allDivs = document.querySelectorAll("div");
        for (var i = 0; i < allDivs.length; i++) {
            var div = allDivs[i];
            var text = div.textContent || div.innerText || "";
            var match = text.match(/([\d.]+)%/);
            if (match) {
                var progress = parseFloat(match[1]);
                if (!isNaN(progress)) {
                    return progress;
                }
            }
        }

        // 方法2: 查找特定样式的div
        var styledDivs = document.querySelectorAll("div[style*='width: 50px']");
        for (var j = 0; j < styledDivs.length; j++) {
            var styledDiv = styledDivs[j];
            var text = styledDiv.textContent || styledDiv.innerText || "";
            var match = text.trim().match(/([\d.]+)/);
            if (match) {
                var progress = parseFloat(match[1]);
                if (!isNaN(progress)) {
                    return progress;
                }
            }
        }

        return 0;
    }

    // 查找并点击课程
    function findAndClickCourse() {
        var alla = document.querySelectorAll("a.courseware-list-reed");
        if (alla.length === 0) {
            alla = document.querySelectorAll("a[id^='gvList_ctl']");
        }

        if (alla.length > 0) {
            // 点击第一个课程
            showStatus("点击课程继续学习");
            alla[0].click();
        } else {
            showStatus("未找到课程，返回课程列表");
            setTimeout(function() {
                window.location.href = "https://gbpx.gd.gov.cn/gdceportal/Study/LearningCourse.aspx";
            }, 3000);
        }
    }

    // 处理视频页面
    function handleVideoPage() {
        showStatus("正在处理视频页面...");

        // 设置定时器：3分钟后关闭窗口
        var minutes = 3;  // 改为3分钟
        var totalSeconds = minutes * 60;

        showStatus("设置" + minutes + "分钟定时关闭");

        // 显示倒计时
        updateCountdown(minutes, 0);

        // 启动3分钟定时器
        var timer = setTimeout(function() {
            showStatus(minutes + "分钟到，关闭窗口检测进度");
            closeVideoAndCheckProgress();
        }, minutes * 60 * 1000);

        // 更新倒计时显示
        var countdownSeconds = totalSeconds;
        var countdownInterval = setInterval(function() {
            countdownSeconds--;
            var mins = Math.floor(countdownSeconds / 60);
            var secs = countdownSeconds % 60;

            updateCountdown(mins, secs);

            if (countdownSeconds <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);

        // 保存定时器以便清理
        window.videoTimer = timer;
        window.countdownTimer = countdownInterval;

        // 延迟后开始尝试播放
        setTimeout(function() {
            startVideoPlayback();
        }, 2000);
    }

    // 开始视频播放
    function startVideoPlayback() {
        showStatus("开始尝试播放视频...");

        // 增加播放尝试次数
        var playAttempts = 0;
        var maxAttempts = 10;

        // 立即尝试第一次播放
        tryToPlayVideo();

        // 设置定期重试
        var playInterval = setInterval(function() {
            playAttempts++;
            showStatus("播放尝试 " + playAttempts + "/" + maxAttempts);

            if (playAttempts >= maxAttempts) {
                clearInterval(playInterval);
                showStatus("达到最大尝试次数，停止尝试播放");
                return;
            }

            // 检查视频是否已经在播放
            if (isVideoPlaying()) {
                clearInterval(playInterval);
                showStatus("视频已在播放中，停止重试");
                return;
            }

            // 再次尝试播放
            tryToPlayVideo();
        }, 3000); // 每3秒尝试一次

        // 保存定时器以便清理
        window.playInterval = playInterval;
    }

    // 检查视频是否在播放
    function isVideoPlaying() {
        try {
            var videos = document.querySelectorAll("video");
            if (videos.length > 0) {
                var video = videos[0];
                return !video.paused && !video.ended;
            }

            // 检查进度条
            var progressElements = document.querySelectorAll(".vjs-play-progress");
            if (progressElements.length > 0) {
                var progress = progressElements[0].style.width;
                if (progress && progress !== "0%" && progress !== "0px") {
                    return true;
                }
            }
        } catch (e) {
            // 忽略错误
        }

        return false;
    }

    // 尝试播放视频
    function tryToPlayVideo() {
        showStatus("尝试播放视频...");

        // 方法1: 尝试直接播放video元素
        tryDirectVideoPlay();

        // 延迟后尝试点击播放按钮
        setTimeout(function() {
            tryClickPlayButtons();
        }, 500);

        // 延迟后尝试点击页面中心
        setTimeout(function() {
            tryClickPageCenter();
        }, 1000);
    }

    // 直接播放video元素
    function tryDirectVideoPlay() {
        try {
            var videos = document.querySelectorAll("video");
            if (videos.length > 0) {
                var video = videos[0];

                // 静音
                video.volume = 0;

                // 尝试播放
                video.play().then(function() {
                    showStatus("直接播放video元素成功");
                }).catch(function(error) {
                    showStatus("直接播放失败: " + error.message);
                });
            }
        } catch (e) {
            // 忽略错误
        }
    }

    // 尝试点击播放按钮
    function tryClickPlayButtons() {
        // 播放按钮选择器列表
        var playSelectors = [
            // 视频播放器按钮
            '.vjs-big-play-button',
            '.vjs-play-control',
            '.vjs-play-button',
            '.video-js .vjs-big-play-button',

            // 通用播放按钮
            'button[title*="播放"]',
            'button[title*="play"]',
            'button[aria-label*="播放"]',
            'button[aria-label*="play"]',

            // 播放按钮类
            '.play-btn',
            '.video-play',
            '.play-button',
            '.start-play',

            // 全屏播放相关
            '.vjs-fullscreen-control',
            '.fullscreen-btn',

            // 开始按钮
            '.start-button',
            '.begin-btn',

            // 视频容器
            'video',
            '.video-js',

            // 点击区域
            '.vjs-poster',
            '.video-poster'
        ];

        for (var i = 0; i < playSelectors.length; i++) {
            try {
                var elements = document.querySelectorAll(playSelectors[i]);
                if (elements.length > 0) {
                    for (var j = 0; j < elements.length; j++) {
                        var element = elements[j];
                        if (isElementVisible(element)) {
                            showStatus("点击播放按钮: " + playSelectors[i] + " #" + j);
                            element.click();

                            // 如果点击了video元素，也尝试播放
                            if (playSelectors[i] === 'video' || playSelectors[i] === '.video-js') {
                                setTimeout(function() {
                                    tryDirectVideoPlay();
                                }, 100);
                            }
                        }
                    }
                }
            } catch (e) {
                showStatus("点击" + playSelectors[i] + "失败: " + e.message);
            }
        }
    }

    // 尝试点击页面中心
    function tryClickPageCenter() {
        try {
            var x = window.innerWidth / 2;
            var y = window.innerHeight / 2;

            var element = document.elementFromPoint(x, y);
            if (element) {
                showStatus("点击页面中心元素: " + element.tagName);

                // 创建点击事件
                var clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: x,
                    clientY: y
                });

                element.dispatchEvent(clickEvent);
            }
        } catch (e) {
            showStatus("点击页面中心失败: " + e.message);
        }
    }

    // 检查元素是否可见
    function isElementVisible(element) {
        if (!element) return false;

        var rect = element.getBoundingClientRect();
        return rect.width > 0 &&
               rect.height > 0 &&
               rect.top >= 0 &&
               rect.left >= 0 &&
               rect.bottom <= window.innerHeight &&
               rect.right <= window.innerWidth;
    }

    // 更新倒计时显示
    function updateCountdown(minutes, seconds) {
        var timeStr = minutes + "分" + (seconds < 10 ? "0" : "") + seconds + "秒";
        showStatus("剩余时间: " + timeStr);
    }

    // 关闭视频并检查进度
    function closeVideoAndCheckProgress() {
        showStatus("视频播放完成，检查进度...");

        // 清理所有定时器
        if (window.videoTimer) {
            clearTimeout(window.videoTimer);
        }
        if (window.countdownTimer) {
            clearInterval(window.countdownTimer);
        }
        if (window.playInterval) {
            clearInterval(window.playInterval);
        }

        // 尝试向主窗口发送刷新消息
        try {
            if (window.opener && !window.opener.closed) {
                // 发送多次刷新消息
                sendMultipleRefreshMessages();
            }
        } catch (e) {
            showStatus("无法向主窗口发送消息: " + e.message);
        }

        // 延迟后关闭窗口
        setTimeout(function() {
            try {
                window.close();
                showStatus("成功关闭窗口");
            } catch (e) {
                showStatus("无法关闭窗口，跳转到学习中心");
                window.location.href = "https://gbpx.gd.gov.cn/gdceportal/study/StudyCenter.aspx";
            }
        }, 2000);
    }

    // 发送多次刷新消息
    function sendMultipleRefreshMessages() {
        // 向主窗口发送3次刷新消息，每次间隔3秒
        var refreshCount = 3;
        var currentCount = 0;

        showStatus("将发送" + refreshCount + "次刷新消息");

        function sendNextRefresh() {
            if (currentCount < refreshCount) {
                currentCount++;
                showStatus("发送第" + currentCount + "次刷新消息");

                window.opener.postMessage({
                    type: 'refreshPage',
                    source: 'videoWindow',
                    timestamp: Date.now(),
                    refreshCount: currentCount,
                    totalRefreshes: refreshCount
                }, '*');

                if (currentCount < refreshCount) {
                    // 等待3秒后发送下一次刷新
                    setTimeout(sendNextRefresh, 3000);
                } else {
                    showStatus("已发送所有" + refreshCount + "次刷新消息");
                }
            }
        }

        // 开始发送第一次刷新
        setTimeout(sendNextRefresh, 1000);
    }

    // 处理播放完成页面
    function handleCompletionPage() {
        showStatus("播放完成页面");

        setTimeout(function() {
            try {
                var closeButtons = document.querySelectorAll("button.instructions-close");
                if (closeButtons.length > 0) {
                    closeButtons[0].click();
                    showStatus("点击了关闭按钮");
                }
            } catch (e) {
                showStatus("关闭按钮点击失败");
            }

            // 延迟后关闭
            setTimeout(function() {
                try {
                    window.close();
                } catch (e) {
                    window.location.href = "https://gbpx.gd.gov.cn/gdceportal/study/StudyCenter.aspx";
                }
            }, 1000);
        }, 2000);
    }

    // 获取课程进度
    function getCourseProgress(title) {
        var progress = 0;
        var match = title.match(/已学习\s*([\d.]+)[％%]/);
        if (match && match[1]) {
            progress = parseFloat(match[1]);
        }
        return progress;
    }

    // 显示控制面板
    function showControlPanel(course) {
        var panel = document.createElement("div");
        panel.innerHTML = `
            <div style="position:fixed; top:10px; right:10px; background:white; border:1px solid #ccc; padding:10px; z-index:9999; border-radius:5px; min-width:200px;">
                <div style="font-weight:bold; margin-bottom:5px;">学习助手</div>
                <div style="font-size:12px; color:#666; margin-bottom:5px;">课程: ${course.index}/${course.total}</div>
                <div style="font-size:12px; color:#666; margin-bottom:5px;">进度: ${course.progress}%</div>
                <div id="gbpx-countdown" style="margin:5px 0; color:#666;">3秒后开始学习</div>
                <div style="display:flex; gap:5px; margin-top:10px;">
                    <button id="gbpx-start" style="flex:1; background:#4CAF50; color:white; border:none; padding:8px; border-radius:3px; cursor:pointer; font-weight:bold;">立即开始</button>
                    <button id="gbpx-stop" style="flex:1; background:#f44336; color:white; border:none; padding:8px; border-radius:3px; cursor:pointer;">停止</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 倒计时
        var countdown = 3;
        var countdownElement = document.getElementById("gbpx-countdown");
        var interval = setInterval(function() {
            countdown--;
            if (countdownElement) {
                countdownElement.textContent = countdown + "秒后开始学习";
            }

            if (countdown <= 0) {
                clearInterval(interval);
                startLearning(course);
                panel.remove();
            }
        }, 1000);

        // 立即开始按钮
        document.getElementById("gbpx-start").onclick = function() {
            clearInterval(interval);
            startLearning(course);
            panel.remove();
        };

        // 停止按钮
        document.getElementById("gbpx-stop").onclick = function() {
            clearInterval(interval);
            showStatus("已停止");
            panel.remove();
        };
    }

    // 开始学习
    function startLearning(course) {
        showStatus("开始学习第" + course.index + "个课程");
        try {
            // 保存当前课程信息到opener窗口（主窗口）
            if (window.opener && !window.opener.closed) {
                try {
                    window.opener.postMessage({
                        type: 'startCourse',
                        courseIndex: course.index,
                        courseTitle: course.element.title || course.element.textContent || ""
                    }, '*');
                } catch (e) {
                    console.log("无法向主窗口发送消息:", e);
                }
            }

            // 点击课程按钮
            course.element.click();
        } catch (e) {
            showStatus("点击失败: " + e);
        }
    }

    // 显示状态
    function showStatus(message) {
        // 移除旧的状态显示
        var oldStatus = document.getElementById("gbpx-status");
        if (oldStatus) {
            oldStatus.remove();
        }

        // 创建新的状态显示
        var statusDiv = document.createElement("div");
        statusDiv.id = "gbpx-status";
        statusDiv.textContent = "状态: " + message;
        statusDiv.style.cssText = `
            position:fixed;
            top:10px;
            left:10px;
            background:rgba(0,0,0,0.8);
            color:white;
            padding:5px 10px;
            border-radius:5px;
            font-size:12px;
            z-index:9998;
        `;

        document.body.appendChild(statusDiv);
    }

    // 添加主窗口消息监听器
    if (window.location.href.includes("gbpx.gd.gov.cn/gdceportal/Study/LearningCourse.aspx")) {
        // 只在课程列表页面添加消息监听
        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'refreshPage') {
                console.log("收到刷新消息，刷新页面检测进度");
                showStatus("收到刷新消息，正在刷新页面...");

                // 延迟2秒后刷新页面
                setTimeout(function() {
                    window.location.reload();
                }, 2000);
            }

            if (event.data && event.data.type === 'multipleRefresh') {
                console.log("收到多次刷新消息，第" + event.data.refreshCount + "次刷新，共" + event.data.totalRefreshes + "次");
                showStatus("收到刷新消息(" + event.data.refreshCount + "/" + event.data.totalRefreshes + ")，正在刷新...");

                // 延迟2秒后刷新页面
                setTimeout(function() {
                    window.location.reload();
                }, 2000);
            }
        });

        // 添加自动刷新机制：每30秒检查一次是否有子窗口关闭
        setInterval(function() {
            // 检查是否有子窗口打开
            if (window.videoWindow && window.videoWindow.closed) {
                showStatus("检测到视频窗口已关闭，刷新页面");

                // 多次刷新
                var refreshCount = 3;
                var currentCount = 0;

                function doRefresh() {
                    if (currentCount < refreshCount) {
                        currentCount++;
                        showStatus("刷新第" + currentCount + "次，共" + refreshCount + "次");

                        if (currentCount < refreshCount) {
                            // 刷新页面
                            window.location.reload();
                        } else {
                            // 最后一次刷新后延迟检测进度
                            showStatus("刷新完成，等待检测进度...");
                            setTimeout(function() {
                                window.location.reload();
                            }, 3000);
                        }
                    }
                }

                // 开始刷新
                setTimeout(doRefresh, 2000);
            }
        }, 30000);
    }

})();
