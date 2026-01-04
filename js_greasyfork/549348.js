// ==UserScript==
// @name         青书学堂自动刷课与答题增强版
// @version      0.0.2
// @description  青书学堂自动刷课+自动答题，所有页面控制区域固定在左侧
// @author       综合优化
// @match        https://*.qingshuxuetang.com/*/CourseShow*
// @match        https://*.qingshuxuetang.com/*/CourseStudy*
// @match        https://*.qingshuxuetang.com/*/CourseList*
// @match        https://*.qingshuxuetang.com/*/Student/Home*
// @match        https://*.qingshuxuetang.com/*/ExercisePaper*
// @match        https://*.qingshuxuetang.com/*/ExamPaper*
// @match        https://qingshuxuetang.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=degree.qingshuxuetang.com
// @require      https://unpkg.com/pxmu@1.1.0/dist/web/pxmu.min.js
// @require      https://lib.baomitu.com/lodash.js/latest/lodash.min.js
// @run-at       document-end
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1473469
// @downloadURL https://update.greasyfork.org/scripts/549348/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E4%B8%8E%E7%AD%94%E9%A2%98%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/549348/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E4%B8%8E%E7%AD%94%E9%A2%98%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

;(function () {
    'use strict';

    // 检查是否已存在控制区域，避免重复创建
    if (document.getElementById('qingshu-script-control-panel')) {
        return;
    }

    // 检查功能是否启用（默认都启用）
    let autoPlayEnabled = localStorage.getItem('qingshuAutoPlayEnabled') !== 'false';
    let autoAnswerEnabled = localStorage.getItem('qingshuAutoAnswerEnabled') !== 'false';

    // 如果是从禁用状态切换到启用状态，刷新页面
    if ((autoPlayEnabled && localStorage.getItem('qingshuAutoPlayEnabled') === 'false') ||
        (autoAnswerEnabled && localStorage.getItem('qingshuAutoAnswerEnabled') === 'false')) {
        localStorage.setItem('qingshuAutoPlayEnabled', autoPlayEnabled);
        localStorage.setItem('qingshuAutoAnswerEnabled', autoAnswerEnabled);
        location.reload();
        return;
    }

    // 先处理答题相关页面（仅当自动答题启用时）
    if (autoAnswerEnabled) {
        handleAnswerPages();
    }

    // 如果是答题页面且已处理，不执行后续刷课逻辑
    if ((location.href.indexOf('ExercisePaper') !== -1 || location.href.indexOf('ExamPaper') !== -1) && autoAnswerEnabled) {
        return;
    }

    // 变量初始化（刷课相关）
    let video = null;
    let nextNode = null;
    let playCheckInterval = null;
    let findCoursesTimer = null;
    let findVideoTimer = null;
    let currentVideoTime = null;
    const urlParams = new URLSearchParams(window.location.search);
    const currentNodeId = urlParams.get('nodeId');
    const domain = 'https://degree.qingshuxuetang.com/';
    const url = location.href;
    const host = location.host;
    const isDegree = host.indexOf('degree') > -1;
    let symbol = null;
    const PLAYBACK_RATE = 1; // 播放速度

    // 创建样式表 - 统一左侧定位
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /* 基础控制面板样式 - 所有页面通用，固定在左侧 */
        #qingshu-script-control-panel {
            display: flex;
            flex-direction: column;
            padding: 15px;
            border-radius: 8px;
            background: #ffffff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            z-index: 9999;
            width: 220px;
            box-sizing: border-box;
            border: 1px solid #f0f0f0;
            position: fixed; /* 固定定位 */
            left: 15px;     /* 左侧距离 */
            top: 50%;       /* 垂直居中 */
            transform: translateY(-50%); /* 垂直居中调整 */
        }

        #qingshu-script-control-panel:hover {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }

        .qingshu-status {
            padding: 8px 12px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            font-size: 14px;
            transition: background 0.3s ease;
            width: 100%;
            text-align: center;
            box-sizing: border-box;
            margin: 5px 0;
        }

        .qingshu-toggle-container {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            justify-content: space-between;
            margin: 5px 0;
        }

        .qingshu-toggle-label {
            color: #333;
            font-weight: 500;
            font-size: 14px;
        }

        /* 开关按钮样式 */
        .qingshu-toggle {
            position: relative;
            display: inline-block;
            width: 42px;
            height: 24px;
        }

        .qingshu-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .qingshu-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #e0e0e0;
            transition: .3s;
            border-radius: 24px;
        }

        .qingshu-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
        }

        input:checked + .qingshu-slider {
            background-color: #42b983;
        }

        input:checked + .qingshu-slider:before {
            transform: translateX(18px);
        }

        /* 答题控制按钮样式 */
        .answer-action-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            margin: 10px 0;
        }

        .answer-btn {
            padding: 8px 12px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.2s ease;
            width: 100%;
        }

        .retry-btn {
            background-color: #4285f4;
            color: white;
        }

        .retry-btn:hover {
            background-color: #3367d6;
        }

        /* 所有页面主内容区域都添加左边距，避免被左侧控制面板遮挡 */
        .main-content-offset {
            margin-left: 250px !important;
            transition: margin-left 0.3s ease;
        }

        /* 针对不同页面的主内容容器选择器 */
        .container.main-content-offset,
        .main.main-content-offset,
        .paper-content.main-content-offset,
        .course-content.main-content-offset {
            margin-left: 250px !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // 创建控制区域容器 - 使用唯一ID确保不会重复
    const controlContainer = document.createElement('div');
    controlContainer.id = 'qingshu-script-control-panel'; // 唯一ID，防止重复创建

    // 放置控制区域 - 统一固定在左侧
    function placeControlPanel() {
        // 所有页面都添加到body
        document.body.appendChild(controlContainer);

        // 所有页面主内容区域都添加左边距，避免被遮挡
        const mainContentSelectors = [
            '.container',
            '.main',
            '.paper-content',
            '.course-content',
            '#main-content'
        ];

        // 尝试找到主内容容器并添加偏移
        mainContentSelectors.some(selector => {
            const mainContent = document.querySelector(selector);
            if (mainContent) {
                mainContent.classList.add('main-content-offset');
                return true;
            }
            return false;
        });
    }

    // 创建自动刷课开关
    const createToggle = (labelText, isChecked, storageKey) => {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'qingshu-toggle-container';

        const toggleLabel = document.createElement('span');
        toggleLabel.className = 'qingshu-toggle-label';
        toggleLabel.textContent = labelText;

        const toggleWrapper = document.createElement('label');
        toggleWrapper.className = 'qingshu-toggle';

        const toggleSwitch = document.createElement('input');
        toggleSwitch.type = 'checkbox';
        toggleSwitch.checked = isChecked;
        toggleSwitch.onchange = function() {
            const newState = this.checked;
            localStorage.setItem(storageKey, newState);
            if ((storageKey === 'qingshuAutoPlayEnabled' && newState !== autoPlayEnabled) ||
                (storageKey === 'qingshuAutoAnswerEnabled' && newState !== autoAnswerEnabled)) {
                location.reload();
            }
        };

        const slider = document.createElement('span');
        slider.className = 'qingshu-slider';

        toggleWrapper.appendChild(toggleSwitch);
        toggleWrapper.appendChild(slider);
        toggleContainer.appendChild(toggleLabel);
        toggleContainer.appendChild(toggleWrapper);

        return toggleContainer;
    };

    // 添加自动刷课开关
    controlContainer.appendChild(createToggle('自动刷课', autoPlayEnabled, 'qingshuAutoPlayEnabled'));

    // 添加自动答题开关
    controlContainer.appendChild(createToggle('自动答题', autoAnswerEnabled, 'qingshuAutoAnswerEnabled'));

    // 创建状态提示元素
    const statusDiv = document.createElement('div');
    statusDiv.className = 'qingshu-status';
    statusDiv.textContent = '初始化中...';
    statusDiv.style.background = '#4285f4'; // 谷歌蓝 - 初始状态
    controlContainer.appendChild(statusDiv);

    // 放置控制面板
    placeControlPanel();

    // 如果两个功能都被禁用，显示状态并退出
    if (!autoPlayEnabled && !autoAnswerEnabled) {
        updateStatus('所有功能已禁用', '#f44336'); // 红色 - 禁用状态
        return;
    }

    // 获取学校标识
    if (location.pathname.split('/').length >= 2) {
        symbol = location.pathname.split('/')[1];
    }

    // 页面路由处理（仅当自动刷课启用时）
    if (autoPlayEnabled) {
        if (!isDegree && url.indexOf('MyQingShu') > -1) {
            updateStatus('开始执行，请稍后...', '#4285f4');
            setTimeout(function() {
                if (window.viewMap && window.viewMap.student && window.viewMap.student.data) {
                    window.location.href = window.viewMap.student.data[0].entrance;
                    return;
                }
                updateStatus('未找到学校信息', '#ff9800'); // 橙色 - 警告
            }, 3000);
            return;
        }

        if (!isDegree) {
            updateStatus('仅支持degree页面', '#f44336');
            return;
        }

        if (symbol == null) {
            updateStatus('未找到学校标识', '#f44336');
            return;
        }

        // 首页处理：跳转到课程列表
        if (url.indexOf('Student/Home') > -1) {
            updateStatus('跳转到课程列表...', '#4285f4');
            setTimeout(() => {
                window.location.href = `${domain}${symbol}/Student/Course/CourseList`;
            }, 1000);
            return;
        }

        // 课程列表页处理：选择未完成课程
        if (url.indexOf('Course/CourseList') > -1) {
            updateStatus('获取课程列表...', '#4285f4');
            setTimeout(function() {
                if (window.currentCourse) {
                    sessionStorage.setItem('courses', JSON.stringify(window.currentCourse));
                    let course = getFitCourse();
                    if (course) {
                        updateStatus(`开始学习课程: ${course.courseName}`, '#42b983'); // 绿色 - 正常状态
                        setTimeout(() => {
                            window.location.href = `${domain}${symbol}/Student/Course/CourseStudy?courseId=${course.courseId}&teachPlanId=${course.teachPlanId}&periodId=${course.periodId}`;
                        }, 1000);
                        return;
                    }
                    updateStatus('所有课程已完成', '#ff9800');
                } else {
                    updateStatus('未获取到课程数据', '#f44336');
                }
            }, 3000);
            return;
        }

        // 课程学习页处理：选择下一个视频
        if (url.indexOf('Course/CourseStudy') > -1) {
            updateStatus('获取视频列表...', '#4285f4');
            setTimeout(function() {
                if (window.coursewareMedias) {
                    var videos = [];
                    getVideoNode(window.coursewareMedias, videos);
                    console.log('找到视频:', videos.length);

                    if (videos.length > 0) {
                        let courseId = getQueryString('courseId');
                        let teachPlanId = getQueryString('teachPlanId');
                        let periodId = getQueryString('periodId');
                        let videoMaps = {};
                        videoMaps[courseId] = videos;
                        sessionStorage.setItem('videos', JSON.stringify(videoMaps));

                        updateStatus(`开始播放视频: ${videos[0].title}`, '#42b983');
                        setTimeout(() => {
                            window.location.href = `${domain}${symbol}/Student/Course/CourseShow?teachPlanId=${teachPlanId}&periodId=${periodId}&courseId=${courseId}&nodeId=${videos[0].id}`;
                        }, 1000);
                        return;
                    }
                    updateStatus('该课程没有视频', '#ff9800');
                } else {
                    updateStatus('未获取到视频数据', '#f44336');
                }
            }, 3000);
            return;
        }

        // 课程播放页处理 - 核心功能区
        if (url.indexOf('Course/CourseShow') > -1) {
            // 非视频课程检测
            if (currentNodeId && currentNodeId.includes('jbxx')) {
                updateStatus('⚠ 仅支持视频课程', '#ff9800');
                return;
            }

            // 获取下一节课程信息
            const findCourses = () => {
                const list = document.querySelectorAll('#lessonMenu li a[id]');
                if (list?.length) {
                    clearInterval(findCoursesTimer);

                    const nodeArray = Array.from(list)
                        .filter(item => !item.id.includes('jbxx'))
                        .map(item => ({
                            id: item.id.split('-')[1],
                            title: item.text.trim()
                        }));

                    const currentIndex = nodeArray.findIndex(o => o.id === currentNodeId);
                    if (currentIndex !== -1) {
                        nextNode = nodeArray[currentIndex + 1];
                        updateStatus(nextNode ?
                            `准备中，下一节：${nextNode.title}` :
                            '准备中，当前是最后一节', '#4285f4');
                    }
                }
            };

            findCoursesTimer = setInterval(findCourses, 1000);

            // 初始化自动播放 - 增强后台播放能力
            function initAutoPlay() {
                // 强制静音播放，确保后台运行不打扰用户
                video.muted = true;
                video.volume = 0;

                // 设置播放速度
                video.playbackRate = PLAYBACK_RATE;

                // 尝试播放视频
                function playVideo() {
                    video.play().then(() => {
                        updateStatus(nextNode ?
                            `播放中，下一节：${nextNode.title}` :
                            `播放中，最后一节`, '#42b983');
                    }).catch((error) => {
                        updateStatus('尝试恢复播放...', '#ff9800');
                        console.log('播放失败，尝试恢复:', error);
                        setTimeout(playVideo, 1000);
                    });
                }

                // 初始播放
                playVideo();

                // 页面可见性变化监听
                document.addEventListener("visibilitychange", () => {
                    if (document.hidden) {
                        if (video.paused) playVideo();
                    } else {
                        if (video.paused) playVideo();
                    }
                });

                // 播放状态检查
                playCheckInterval = setInterval(() => {
                    if (video.paused) playVideo();

                    // 显示播放进度
                    const playedTime = formatTime(video.currentTime);
                    const totalTime = formatTime(video.duration || 0);
                    const duration = video.duration || 0;
                    const progress = duration ? Math.round((video.currentTime / duration) * 100) : 0;

                    updateStatus(nextNode ?
                        `播放中 (${progress}%) ${playedTime}/${totalTime}，下一节：${nextNode.title}` :
                        `播放中 (${progress}%) ${playedTime}/${totalTime}，最后一节`, '#42b983');
                }, 2000);

                // 视频卡住检测与恢复
                setInterval(() => {
                    if (!video) return;

                    const currentTime = video.currentTime.toFixed(1);
                    if (currentTime === currentVideoTime && video.currentTime > 0 && !video.paused) {
                        updateStatus('视频卡住，尝试恢复...', '#ff9800');
                        video.play().catch(() => location.reload());
                    }
                    currentVideoTime = currentTime;
                }, 5000);

                // 视频结束处理
                video.addEventListener("ended", () => {
                    clearInterval(playCheckInterval);
                    const courseId = getQueryString('courseId');
                    const teachPlanId = getQueryString('teachPlanId');
                    const periodId = getQueryString('periodId');

                    if (nextNode) {
                        updateStatus(`跳转至下一节: ${nextNode.title}`, '#4285f4');
                        urlParams.set('nodeId', nextNode.id);
                        setTimeout(() => {
                            location.replace(`${window.location.pathname}?${urlParams}`);
                        }, 1000);
                    } else {
                        updateStatus('当前课程章节已完成，寻找下一个课程...', '#4285f4');
                        setTimeout(() => {
                            let courses = JSON.parse(sessionStorage.getItem('courses') || '[]');
                            let nextCourse = getNextCourse(courseId, courses);

                            if (nextCourse) {
                                updateStatus(`开始学习下一个课程: ${nextCourse.courseName}`, '#42b983');
                                setTimeout(() => {
                                    window.location.href = `${domain}${symbol}/Student/Course/CourseStudy?courseId=${nextCourse.courseId}&teachPlanId=${nextCourse.teachPlanId}&periodId=${nextCourse.periodId}`;
                                }, 1000);
                            } else {
                                updateStatus('所有课程已学习完毕', '#ff9800');
                            }
                        }, 2000);
                    }
                });

                // 错误监听
                video.addEventListener('error', (e) => {
                    console.error('视频错误:', e);
                    updateStatus('视频错误，尝试恢复...', '#f44336');
                    setTimeout(() => location.reload(), 3000);
                });
            }

            // 查找视频播放器
            const findVideo = () => {
                video = document.getElementById("vjs_video_3_html5_api") ||
                       document.querySelector('video') ||
                       (window.CoursewarePlayer?.videoPlayer?.player?.el_?.querySelector('video'));

                if (video) {
                    clearInterval(findVideoTimer);
                    initAutoPlay();
                } else {
                    updateStatus('寻找视频...', '#4285f4');
                }
            };

            findVideoTimer = setInterval(findVideo, 1000);

            // 超时处理
            setTimeout(() => {
                if (!video) {
                    clearInterval(findVideoTimer);
                    updateStatus('未找到视频，请刷新', '#f44336');
                }
            }, 15000);
        }
    } else {
        // 如果自动刷课功能被禁用
        updateStatus('自动刷课已禁用', '#f44336');
    }

    // 工具函数：更新状态显示
    function updateStatus(text, color) {
        statusDiv.textContent = text;
        statusDiv.style.background = color;
    }

    // 工具函数：格式化时间
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        const pad = (num) => num.toString().padStart(2, '0');

        return hours > 0 ?
            `${pad(hours)}:${pad(minutes)}:${pad(secs)}` :
            `${pad(minutes)}:${pad(secs)}`;
    }

    // 工具函数：获取未完成的课程
    function getFitCourse() {
        if (!window.currentCourse) return null;

        for (let inx in window.currentCourse) {
            if (window.currentCourse[inx].score < 100) {
                return window.currentCourse[inx];
            }
        }
        return null;
    }

    // 工具函数：获取下一个课程
    function getNextCourse(currentId, courses) {
        let next = null;
        Array.prototype.forEach.call(courses, function (value, index) {
            if (value.courseId == currentId && courses.length - 1 > index) {
                next = courses[index + 1];
                return false;
            }
        });
        return next;
    }

    // 工具函数：递归获取所有视频节点
    function getVideoNode(medias, videos) {
        Array.prototype.forEach.call(medias, function (value) {
            if (value.type === 'video') {
                videos.push(value);
            }
            if (value.nodes != null) {
                getVideoNode(value.nodes, videos);
            }
        });
    }

    // 工具函数：获取URL参数
    function getQueryString(name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        const r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    // 清理资源
    window.addEventListener('beforeunload', () => {
        clearInterval(playCheckInterval);
        clearInterval(findCoursesTimer);
        clearInterval(findVideoTimer);
    });

    // 答题相关函数 - 避免修改页面原有提交功能
    function handleAnswerPages() {
        // 考试页面解除复制限制（不影响提交功能）
        if (location.href.indexOf('ExamPaper') !== -1) {
            $('*').unbind('copy');
            showAnswerNotification('考试页面已解除复制限制');
            return;
        }

        // 作业页面自动答题
        if (location.href.indexOf('ExercisePaper') !== -1) {
            listenSource([
                {
                    fn: () => $('.question-detail-options .question-detail-option').length,
                    callback: autoFillAnswer
                },
            ]);
        }
    }

    // url参数转换为对象
    function UrlSearch() {
        const url = new URL(location.href);
        const params = {};

        // 处理查询字符串参数
        const search = url.search.replace('?', '');
        const searchParams = search.split('&');
        searchParams.forEach(item => {
            const [key, value] = item.split('=');
            if (key) params[key] = value;
        });

        // 处理路径参数
        const pathParts = url.pathname.split('/').filter(part => part !== '');
        params.pathParts = pathParts;

        return params;
    }

    function listenSource(listen = []) {
        function setup() {
            listen.forEach((item, index) => {
                const {fn, callback} = item;
                if (fn()) {
                    callback();
                    listen.splice(index, 1);
                }
            });

            if (listen.length) {
                requestAnimationFrame(setup);
            }
        }

        if (listen.length) {
            requestAnimationFrame(setup);
        }
    }

    // 清除已选答案 - 只操作答案选项，不影响提交按钮
    function clearAnswers() {
        // 清除单选题和多选题的选中状态
        $('.question-detail-option.active').removeClass('active');
        $('input[type="radio"]:checked, input[type="checkbox"]:checked').prop('checked', false);

        showAnswerNotification('已清除所有答案', true);
    }

    // 答案自动填入 - 仅填充答案，不触碰提交相关元素
    function autoFillAnswer() {
        const urlSearch = UrlSearch();

        if (!urlSearch.quizId || !urlSearch.pathParts || !urlSearch.pathParts[0]) {
            showAnswerNotification('无法获取答题信息', false);
            return;
        }

        fetch(`https://degree.qingshuxuetang.com/${urlSearch.pathParts[0]}/Student/DetailData?_t=${new Date().getMilliseconds()}&quizId=${urlSearch.quizId}`, {
            method: 'GET',
            headers: {
                Host: 'degree.qingshuxuetang.com',
                Cookie: Object.entries(Cookies.get()).map(([key, value]) => `${key}=${value}`).join('; '),
                Referer: location.href,
                'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': 'macOS',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
        .then(res => res.json())
        .then(res => {
            if (!res.data || !res.data.paperDetail || !res.data.paperDetail.questions) {
                showAnswerNotification('未获取到答案数据', false);
                return;
            }

            const questions = res.data.paperDetail.questions;
            Object.values(questions).forEach(item => {
                // 处理单选/多选答案填入
                if (item.solution && item.questionId) {
                    for (let i = 0; i < item.solution.length; i++) {
                        $(`#${item.questionId}_${item.solution.charAt(i)}`).click();
                    }
                }
            });

            // 显示完成信息并提供重新答题选项
            showAnswerNotification('答案已自动填入', true, true);
        })
        .catch(err => {
            showAnswerNotification('答案填入失败', false);
            console.error(err);
        });
    }

    // 显示答题相关通知 - 左侧显示
    function showAnswerNotification(msg, isSuccess = true, showActions = false) {
        // 使用脚本专用的控制容器，不干扰页面原有元素
        let statusContainer = document.getElementById('qingshu-script-control-panel');
        if (!statusContainer) {
            statusContainer = document.createElement('div');
            statusContainer.id = 'qingshu-script-control-panel';
            document.body.appendChild(statusContainer);
        }

        let answerStatus = document.querySelector('.answer-status');
        if (!answerStatus) {
            answerStatus = document.createElement('div');
            answerStatus.className = 'qingshu-status answer-status';
            statusContainer.appendChild(answerStatus);
        }

        answerStatus.textContent = `[自动答题] ${msg}`;
        answerStatus.style.background = isSuccess ? '#42b983' : '#f44336';

        // 创建操作按钮容器
        if (showActions) {
            let actionContainer = document.querySelector('.answer-action-buttons');
            if (!actionContainer) {
                actionContainer = document.createElement('div');
                actionContainer.className = 'answer-action-buttons';
                statusContainer.appendChild(actionContainer);
            } else {
                // 清空现有按钮，避免重复创建
                actionContainer.innerHTML = '';
            }

            // 添加重新答题按钮
            const retryBtn = document.createElement('button');
            retryBtn.className = 'answer-btn retry-btn';
            retryBtn.textContent = '重新答题';
            retryBtn.onclick = function() {
                clearAnswers();
                // 2秒后重新填充答案
                setTimeout(autoFillAnswer, 2000);
            };
            actionContainer.appendChild(retryBtn);
        }

        // 同时显示pxmu通知
        if (isSuccess) {
            pxmu.success({ msg: `[自动答题] ${msg}`, bg: '#42b983' });
        } else {
            pxmu.fail({ msg: `[自动答题] ${msg}`, bg: '#f44336' });
        }
    }
})();
