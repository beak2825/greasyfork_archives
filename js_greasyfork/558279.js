// ==UserScript==
// @name         南阳师范学院网视频助手(视频界面)
// @namespace    http://tampermonkey.net/
// @version      2.6.2
// @description  县域高中教师全员全学科网络研修项目学习平台刷课助手，自动播放视频、自动连播下一课程、自动恢复播放。
// @author       woshishabidouyourenqiang
// @match        *://video.edueva.org/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/558279/%E5%8D%97%E9%98%B3%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E7%BD%91%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B%28%E8%A7%86%E9%A2%91%E7%95%8C%E9%9D%A2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558279/%E5%8D%97%E9%98%B3%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E7%BD%91%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B%28%E8%A7%86%E9%A2%91%E7%95%8C%E9%9D%A2%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置参数
    const config = {
        autoPlaySpeed: 1, // 默认播放倍速
        autoStartCourse: false, // 是否自动开始课程
        autoAnswer: true, // 是否自动回答问题
        autoNext: true, // 是否自动播放下一课程
        autoResume: true, // 是否自动恢复播放
        checkInterval: 2000, // 检查间隔(毫秒)
        resumeDelay: 1000, // 暂停后多久自动恢复(毫秒)
        nextVideoDelay: 3000, // 视频结束后多久播放下一课程(毫秒)
        personalCenterUrl: 'https://nysy.shuzijiaoshi.com/PersonalCenter',// 个人中心地址
        switchUrl: 'https://video.edueva.org/studyduration', // 切换课程提醒页面地址
        switchUrls: ['https://video.edueva.org/studyduration', 'https://video.edueva.org/StudyDuration'], // 切换课程提醒页面地址
        courseUrl: 'https://nysy.shuzijiaoshi.com/PrjStudent?prjId=9806a871450c4d25b051b37300aadb95&memberType=0&wgId=e6262c213c624b53a5e1b38800b57344'// 课程地址
    };

    // =====================阻止网站弹窗开始 (改进版)=========================
    // 核心思路：1. 拦截 addEventListener；2. 定期清空 onbeforeunload 属性。

    // 方法1: 重写 beforeunload 事件处理
    const originalBeforeUnload = window.onbeforeunload;
    window.onbeforeunload = null;

    // 方法2: 拦截 addEventListener 调用 (这个方法本身很好，保留)
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'beforeunload') {
            console.log('[油猴脚本] 拦截到 beforeunload 事件监听器添加，已阻止。');
            return; // 不添加 beforeunload 事件监听器
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // 方法3: 定期强制清空 onbeforeunload (不依赖jQuery)
    // 这是关键的改进，我们不再使用 $. _data，而是简单粗暴地反复清空。
    function removeBeforeUnloadListeners() {
        // 强制清空 onbeforeunload 属性，应对直接赋值的情况
        if (window.onbeforeunload) {
            window.onbeforeunload = null;
            console.log('[油猴脚本] 已清空 window.onbeforeunload');
        }
    }

    // 定期检查并清空，频率可以高一些，确保万无一失
    setInterval(removeBeforeUnloadListeners, 500);

    // 方法4: MutationObserver 依然保留，作为辅助触发
    const observer = new MutationObserver(function(mutations) {
        removeBeforeUnloadListeners();
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
    // =====================阻止网站弹窗结束=========================

    // =====================监听页面路径变化开始==========================
    // 监听浏览器历史记录的变化（适用于使用pushState或replaceState改变路径的情况）
    // window.addEventListener('popstate', function(event) {
    //     var newPath = window.location.pathname;
    //     console.log('路径变化到: ' + newPath);
    // });
    // =====================监听页面路径变化结束==========================

    // 添加简化样式
    GM_addStyle(`
        .speed-control-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 15px;
            border-radius: 8px;
            width: 220px;
            font-family: Arial, sans-serif;
        }
        .speed-control-panel h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #40b768;
        }
        .toggle-panel {
            position: fixed;
            top: 20px;
            right: 250px;
            z-index: 10001;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .speed-control-panel.hidden {
            display: none;
        }
        .toggle-panel.panel-hidden {
            right: 20px;
        }
        .auto-controls {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        .checkbox-wrapper {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        .checkbox-wrapper input {
            margin-right: 8px;
        }
        .checkbox-wrapper label {
            font-size: 12px;
            cursor: pointer;
        }
        .resume-delay-control {
            display: none;
            margin-top: 8px;
        }
        .resume-delay-control.show {
            display: block;
        }
        .resume-delay-input {
            width: 60px;
            padding: 3px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            border-radius: 3px;
            margin-left: 5px;
            text-align: center;
        }
        .status-display {
            font-size: 11px;
            color: #888;
            margin-top: 5px;
            padding: 5px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            max-height: 60px;
            overflow-y: auto;
        }
    `);

    let currentSpeed = config.autoPlaySpeed;
    let panelVisible = true;

    // 创建控制面板
    function createControlPanel() {
        // 创建切换按钮
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'toggle-panel';
        toggleBtn.innerHTML = '⚡ 视频助手';
        toggleBtn.onclick = togglePanel;
        document.body.appendChild(toggleBtn);

        // 创建控制面板
        const panel = document.createElement('div');
        panel.className = 'speed-control-panel';
        panel.id = 'speedControlPanel';

        panel.innerHTML = `
            <h3>视频助手控制面板</h3>

            <div class="auto-controls">
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="autoAnswerCheck" ${config.autoAnswer ? 'checked' : ''}>
                    <label for="autoAnswerCheck">自动回答问题</label>
                </div>
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="autoNextCheck" ${config.autoNext ? 'checked' : ''}>
                    <label for="autoNextCheck">自动连播下一课程</label>
                </div>
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="autoResumeCheck" ${config.autoResume ? 'checked' : ''}>
                    <label for="autoResumeCheck">自动恢复播放</label>
                </div>
                <div class="status-display" id="statusDisplay">
                    视频状态: 等待检测...
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        const autoAnswerCheck = document.getElementById('autoAnswerCheck');
        const autoNextCheck = document.getElementById('autoNextCheck');
        const autoResumeCheck = document.getElementById('autoResumeCheck');
        const resumeDelayControl = document.getElementById('resumeDelayControl');
        const statusDisplay = document.getElementById('statusDisplay');

        // 自动回答问题开关
        autoAnswerCheck.addEventListener('change', function () {
            config.autoAnswer = this.checked;
            updateStatus('自动回答问题: ' + (this.checked ? '已启用' : '已禁用'));
        });

        // 自动连播开关
        autoNextCheck.addEventListener('change', function () {
            config.autoNext = this.checked;
            updateStatus('自动连播: ' + (this.checked ? '已启用' : '已禁用'));
        });

        // 自动恢复播放开关
        autoResumeCheck.addEventListener('change', function () {
            config.autoResume = this.checked;
            if (this.checked) {
                resumeDelayControl.classList.add('show');
                updateStatus('自动恢复播放: 已启用');
            } else {
                resumeDelayControl.classList.remove('show');
                updateStatus('自动恢复播放: 已禁用');
            }
        });

        // 更新状态显示
        function updateStatus(message) {
            if (statusDisplay) {
                statusDisplay.textContent = message;
            }
        }

        // 暴露更新状态函数
        window.updateStatus = updateStatus;
    }

    // 切换面板显示/隐藏
    function togglePanel() {
        const panel = document.getElementById('speedControlPanel');
        const toggleBtn = document.querySelector('.toggle-panel');

        if (panelVisible) {
            panel.classList.add('hidden');
            toggleBtn.classList.add('panel-hidden');
        } else {
            panel.classList.remove('hidden');
            toggleBtn.classList.remove('panel-hidden');
        }
        panelVisible = !panelVisible;
    }

    // 设置视频倍速
    function setPlaybackSpeed(speed) {
        // const videoElement = document.querySelector('video');
        // if (videoElement) {
        //     videoElement.playbackRate = speed;
        //     console.log('已设置视频播放速度:' + speed + 'x');
        //     window.updateStatus('已设置视频播放速度:' + speed + 'x');
        // }
    }

    // 检查视频是否播放完毕
    function checkVideoEnded() {
        let videoEnded1 = false;
        let videoEnded2 = false;
        // 方法1: 直接判断 video.currentTime 和 video.duration
        const videoElement = document.querySelector('video');
        if (videoElement){
            const currentTime = videoElement.currentTime;
            const duration = videoElement.duration;
            videoEnded1 = (duration > 0 && currentTime >= duration - 0.2)
        }
        // 方法2: 判断视频进度条是否已满
        const time = document.querySelector("a.dd_active time");
        if (time){
            const strings = time.textContent.split("/");
            videoEnded2 = strings[0] === strings[1];
        }

        return videoEnded1 || videoEnded2;
    }

    // 播放视频
    function playVideo() {
        const videoElement = document.querySelector('video');
        if (!videoElement || !videoElement.paused) return;

        // 尝试直接播放
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log('视频已自动开始播放');
                window.updateStatus('视频已自动开始播放');
            }).catch(error => {
                console.log('自动播放失败，尝试静音播放');
                window.updateStatus('自动播放失败，尝试静音播放');
                videoElement.muted = true;
                const mutedPlayPromise = videoElement.play();
                if (mutedPlayPromise !== undefined) {
                    mutedPlayPromise.then(_ => {
                        console.log('视频已静音播放');
                        window.updateStatus('视频已静音播放');
                    }).catch(error => {
                        console.log('静音播放失败，请手动点击播放按钮');
                        window.updateStatus('静音播放失败，请手动点击播放按钮');
                        alert('自动播放失败，请手动点击播放按钮');
                    });
                }
            });
        }

        // 恢复倍速
        if (videoElement.playbackRate !== currentSpeed) {
            setPlaybackSpeed(currentSpeed);
        }
    }

    // 播放下一课程
    // 方法1: 查找课时列表中的下一个课程
    function playNextVideo1() {
        if (!config.autoNext) return;
        if (!checkVideoEnded()) return;

        console.log('开始寻找当前列表中的下一节');
        window.updateStatus('开始寻找当前列表中的下一节');
        const activeLesson = document.querySelector("a.dd_active");
        if (activeLesson) {
            const parentDIV = activeLesson.parentElement.parentElement;
            const allLessons = parentDIV.querySelectorAll('dd a time');
            for (let allLesson of allLessons) {
                const timeContext = allLesson.textContent.trim();
                const strings = timeContext.split("/");
                if (strings[0] !== strings[1]) {
                    allLesson.parentElement.click();
                    console.log('已点击下一课时');
                    window.updateStatus('已点击下一课时');
                    return;
                }
            }
            // 当前课程最后一节课已经播放完毕
            setTimeout(() => window.location.href = config.personalCenterUrl, 2000);
        }
    }

    // 播放下一课程
    // 方法2: 点击弹窗中的按钮
    function playNextVideo2(){
        const element = document.querySelector("a.layui-layer-btn0");
        if (!element || element.textContent !== "是") return;
        element.click();
    }

    // 自动点击继续按钮
    function autoClickContinue() {
        if (!config.autoAnswer) return;
        const element = document.querySelector("a.btn-ProofOk");
        if (!element) return;
        const parentDIV = element.parentElement.parentElement.parentElement;
        if (parentDIV.style.display === 'none') return;
        element.click()
    }

    // 自动切换视频
    function autoClickSwitch() {
        if (!config.autoAnswer) return;
        if (config.switchUrls.some(url => window.location.href.includes(url))) {
            const element = document.querySelector("body > div:nth-child(1) > div:nth-child(4) > a:nth-child(1)");
            if (!element || element.textContent !== "切换") return;
            element.click()
        }
    }

    // 自动播放下一视频
    function autoPlayNextVideo() {
        playNextVideo1();
        playNextVideo2();
    }

    // 自动恢复播放视频
    function autoResumeVideo() {
        if (!config.autoResume) return;
        const videoElement = document.querySelector('video');
        if (!videoElement || !videoElement.paused) return;

        if (!checkVideoEnded()) {
            playVideo();
        }
    }


    // 主函数
    function main() {
        console.log('南阳师范学院网视频助手(视频界面)已启动');

        createControlPanel();

        // 等待视频播放器加载
        const waitForVideo = setInterval(() => {
            const videoElement = document.querySelector('video');
            if (videoElement) {
                clearInterval(waitForVideo);
                console.log('视频播放器已加载');
                window.updateStatus('视频播放器已加载');

                // 设置初始倍速
                setTimeout(() => setPlaybackSpeed(currentSpeed), 2000);

                // 开始播放
                playVideo();

                // 监听视频事件
                // videoElement.addEventListener('play', () => videoEnded = false);
                // videoElement.addEventListener('timeupdate', () => autoPlayNextVideo());
            }
        }, 1000);

        // 定期检查
        setInterval(() => {
            // 自动点击继续
            autoClickContinue();
            // 自动点击切换
            autoClickSwitch();
            // 自动恢复播放
            autoResumeVideo();
            // 自动播放下一节
            autoPlayNextVideo();
        }, config.checkInterval);
    }



    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();