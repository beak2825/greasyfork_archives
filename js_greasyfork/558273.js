// ==UserScript==
// @name         华夏教师研培网视频助手
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  自动回答弹窗问题、自动播放视频、倍速播放、自动连播下一课程、自动恢复播放
// @author       woshishabidouyourenqiang
// @match        *://*.huaxiajiaoshiyanpei.com/*
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/558273/%E5%8D%8E%E5%A4%8F%E6%95%99%E5%B8%88%E7%A0%94%E5%9F%B9%E7%BD%91%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558273/%E5%8D%8E%E5%A4%8F%E6%95%99%E5%B8%88%E7%A0%94%E5%9F%B9%E7%BD%91%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.meta.js
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
        courseUrls: ['http://study.huaxiajiaoshiyanpei.com/mylesson.html', 'http://study.huaxiajiaoshiyanpei.com/myLesson.html']// 课程地址列表
    };

    // 问题答案映射表
    const answerMap = {
        "中国的首都是哪里": "北京"
    }

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
        .speed-select {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            border-radius: 4px;
        }
        .speed-select option {
            background: #333;
        }
        .speed-buttons {
            display: flex;
            gap: 5px;
            margin-bottom: 10px;
        }
        .speed-btn {
            flex: 1;
            padding: 5px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .speed-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        .speed-btn.active {
            background: #40b768;
            border-color: #40b768;
        }
        .speed-status {
            font-size: 12px;
            color: #aaa;
            margin-top: 5px;
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
    let completed = false;

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
            <select class="speed-select" id="speedSelect">
                <option value="0.25">0.25x</option>
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1" selected>1x 正常</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="1.75">1.75x</option>
                <option value="2">2x</option>
                <option value="2.5">2.5x</option>
                <option value="3">3x</option>
                <option value="4">4x</option>
                <option value="5">5x</option>
                <option value="8">8x</option>
                <option value="16">16x</option>
            </select>
            <div class="speed-buttons">
                <button class="speed-btn" data-speed="0.5">0.5x</button>
                <button class="speed-btn" data-speed="1">1x</button>
                <button class="speed-btn" data-speed="1.5">1.5x</button>
                <button class="speed-btn active" data-speed="2">2x</button>
                <button class="speed-btn" data-speed="3">3x</button>
            </div>
            <div class="speed-status">当前倍速: <span id="currentSpeedDisplay">2x</span></div>

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
        const speedSelect = document.getElementById('speedSelect');
        const speedButtons = panel.querySelectorAll('.speed-btn');
        const currentSpeedDisplay = document.getElementById('currentSpeedDisplay');
        const autoAnswerCheck = document.getElementById('autoAnswerCheck');
        const autoNextCheck = document.getElementById('autoNextCheck');
        const autoResumeCheck = document.getElementById('autoResumeCheck');
        const resumeDelayControl = document.getElementById('resumeDelayControl');
        const statusDisplay = document.getElementById('statusDisplay');

        // 下拉框改变事件
        speedSelect.addEventListener('change', function () {
            const speed = parseFloat(this.value);
            setPlaybackSpeed(speed);
            updateSpeedDisplay(speed);
            updateActiveButton(speed);
        });

        // 快捷按钮点击事件
        speedButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const speed = parseFloat(this.dataset.speed);
                setPlaybackSpeed(speed);
                updateSpeedDisplay(speed);
                updateActiveButton(speed);
                speedSelect.value = speed;
            });
        });

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

        // 更新显示函数
        function updateSpeedDisplay(speed) {
            currentSpeed = speed;
            currentSpeedDisplay.textContent = speed + 'x';
            config.autoPlaySpeed = speed;
        }

        // 更新激活按钮状态
        function updateActiveButton(speed) {
            speedButtons.forEach(btn => {
                btn.classList.remove('active');
                if (parseFloat(btn.dataset.speed) === speed) {
                    btn.classList.add('active');
                }
            });
        }

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
        const videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.playbackRate = speed;
            console.log('已设置视频播放速度:' + speed + 'x');
            window.updateStatus('已设置视频播放速度:' + speed + 'x');
        }
    }

    // 检查视频是否播放完毕
    function checkVideoEnded() {
        const videoElement = document.querySelector('video');
        const currentTime = videoElement.currentTime;
        const duration = videoElement.duration;
        return duration > 0 && currentTime >= duration - 0.2;
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
    function playNextVideo() {
        if (!config.autoNext) return;

        console.log('开始寻找课时列表中的下一个课程');
        window.updateStatus('开始寻找课时列表中的下一个课程');
        // 方法1: 查找课时列表中的下一个课程
        const activeLesson = document.querySelector('.video_nav ul li.active');
        if (activeLesson) {
            const parentDIV = activeLesson.parentElement.parentElement;
            const allLessons = parentDIV.querySelectorAll('li');
            const currentIndex = Array.from(allLessons).indexOf(activeLesson);

            if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
                const nextLesson = allLessons[currentIndex + 1];
                nextLesson.click();
                setTimeout(() => setPlaybackSpeed(currentSpeed), 2000);
                console.log('已点击下一课时');
                window.updateStatus('已点击下一课时');
                return;
            }
            // 当前课程最后一节课已经播放完毕
            completed = true;
        }
    }

    // 计算数学表达式
    function calculateExpression(expression) {
        try {
            // 尝试匹配答案映射表
            const answer = Object.keys(answerMap).find(question => question.includes(expression) || expression.includes(question));
            if (answer) {
                return answerMap[answer];
            }
            // 尝试计算数学表达式
            expression = expression.replace(/\s|\?/g, '');
            if (/^[\d+\-*/()= ]+$/.test(expression)) {
                expression = expression.replace(/=/g, '');
                return Function('"use strict"; return (' + expression + ')')();
            }

            return 'default';
        } catch (e) {
            console.error('计算错误:', e);
        }
        return null;
    }

    // 自动回答问题
    function autoAnswerQuestion() {
        if (!config.autoAnswer) return;

        const overlays = document.querySelectorAll('.el-overlay');
        for (const overlay of overlays) {
            if (overlay.style.display !== 'none') {
                const dialog = overlay.querySelector('.el-overlay-dialog');
                if (dialog) {
                    const titleElement = dialog.querySelector('.exam_title');
                    if (titleElement) {
                        const questionText = titleElement.textContent.trim();
                        console.log('检测到问题: ' + questionText);
                        window.updateStatus('检测到问题: ' + questionText);

                        const answer = calculateExpression(questionText);
                        if (answer !== null) {
                            const inputElement = dialog.querySelector('.el-input__inner');
                            if (inputElement) {
                                inputElement.value = answer;
                                inputElement.dispatchEvent(new Event('input', {bubbles: true}));
                                inputElement.dispatchEvent(new Event('change', {bubbles: true}));
                                console.log('已填入答案: ' + answer);
                                window.updateStatus('已填入答案: ' + answer);

                                setTimeout(() => {
                                    const confirmButton = dialog.querySelector('.el-button--primary') ||
                                        Array.from(dialog.querySelectorAll('button')).find(btn =>
                                            btn.textContent.includes('确定') ||
                                            btn.querySelector('span')?.textContent.includes('确定')
                                        );
                                    if (confirmButton && !confirmButton.disabled) {
                                        confirmButton.click();
                                        console.log('已点击确定按钮');
                                        window.updateStatus('已点击确定按钮');
                                    }
                                }, 500);
                            }
                        }
                    }
                }
            }
        }
    }

    // 自动播放下一视频
    function autoPlayNextVideo() {
        const videoElement = document.querySelector('video');
        if (!videoElement || !videoElement.paused) return;

        if (checkVideoEnded()) {
            console.log('视频已播放完毕，准备播放下一课时');
            window.updateStatus('视频已播放完毕，准备播放下一课时');
            setTimeout(() => playNextVideo(), 500);
        }
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

    // 自动播放下一课程
    function autoPlayNextCourse() {
        if (!config.courseUrls.includes(window.location.href)) {
            if (completed) {
                window.location.href = config.courseUrls[0];
            }
            return;
        }
        console.log('已进入课程列表');
        window.updateStatus('已进入课程列表');
        completed = false;
        const lessonList = document.querySelector('.lesson_list');
        if (!lessonList) return;
        const allLessons = lessonList.querySelectorAll('li');
        for (let lesson of allLessons) {
            const textContent = lesson.lastElementChild.querySelector('.el-progress__text > span').textContent;
            if (textContent !== '100%') {
                lesson.click();
                console.log('已进入下一课程');
                window.updateStatus('已进入下一课程')
                setTimeout(() => {
                    // 点击开始学习按钮
                    document.querySelector('#lessonApp > div.body_width > div.lesson_box_bg.d-flex > div:nth-child(2) > button.el-button.el-button--primary.el-button--small.is-plain').click()
                }, 2000);
                return;
            }
        }
        // 当前页课程已经播放完毕, 尝试跳转到下一页
        console.log('尝试跳转到下一页');
        window.updateStatus('尝试跳转到下一页');
        const buttonNext = document.querySelector("button.btn-next");
        if (buttonNext && buttonNext.getAttribute('aria-disabled') !== 'true') {
            console.log('跳转到下一页成功');
            window.updateStatus('跳转到下一页成功');
            buttonNext.click();
        }
    }

    // 主函数
    function main() {
        console.log('华夏教师研培网视频助手已启动');
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
            // 自动回答问题
            autoAnswerQuestion();
            // 自动恢复播放
            autoResumeVideo();
            // 自动播放下一节
            autoPlayNextVideo();
            // 自动播放下一课程
            autoPlayNextCourse();
        }, config.checkInterval);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();