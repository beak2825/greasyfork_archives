// ==UserScript==
// @name         气象继续教育
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      3.48
// @description  气象学习综合工具：课程列表显示 + 视频播放控制 + 自动下一节 + 进度追踪
// @author       You
// @match        http://www.cmatc.cn/lms/app/lms/student/Userselectlesson/show.do*
// @match        http://www.cmatc.cn/lms/app/lms/student/Learn/enter.do*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563110/%E6%B0%94%E8%B1%A1%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/563110/%E6%B0%94%E8%B1%A1%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数 - 从本地存储读取或使用默认值
    let CONFIG = {
        // 视频控制配置
        CHECK_INTERVAL: 1000, // 检查视频状态的间隔时间（毫秒）
        DEFAULT_DELAY: GM_getValue('defaultDelay', 8), // 默认延时（分钟），从本地存储读取
        UPDATE_INTERVAL: 1000, // 倒计时更新间隔（毫秒）

        // 会话保持配置（秒）
        SESSION_KEEPALIVE_MIN: GM_getValue('sessionKeepaliveMin', 300), // 最小间隔（秒），从本地存储读取
        SESSION_KEEPALIVE_MAX: GM_getValue('sessionKeepaliveMax', 600), // 最大间隔（秒），从本地存储读取
        
        // 保持会话的请求URL列表，随机切换
        SESSION_KEEPALIVE_URLS: [
            'http://www.cmatc.cn/lms/app/lms/student/Userdashboardinfo/show.do', // 学院首页
            'http://www.cmatc.cn/lms/app/lms/lesson/Lesson/lookupLessonlist.do', // 资源中心
            'http://www.cmatc.cn/lms/app/tms/sfi/StudyContent/year.do', // 个人中心
            'http://www.cmatc.cn/lms/app/appsecurity/user/Student/self.do' // 个人信息
        ],
        
        // 日志显示配置
        LOG_LEVEL: GM_getValue('logLevel', 'simple'), // 日志级别，从本地存储读取
        SHOW_LEARN_TIME_LOGS: true, // 是否显示视频学习播放提交日志
        
        // 自动播放配置
        AUTO_PLAY_NEXT: GM_getValue('autoPlayNext', true), // 是否自动播放下一节
        AUTO_PLAY_DELAY: GM_getValue('autoPlayDelay', 10), // 自动播放下一节的延迟时间（秒），从本地存储读取
        SKIP_COMPLETED: GM_getValue('skipCompleted', true), // 是否跳过已完成的视频
        
        // 调试配置
        DEBUG_MODE: GM_getValue('debugMode', false) // 是否开启调试模式
    };

    // 全局变量
    let currentPageType = ''; // 当前页面类型：'courseList' 或 'videoPlay'
    let videoElement = null;
    let videoDuration = 0; // 视频总时长（秒）
    let remainingTime = 0; // 剩余倒计时时间（秒）
    let countdownInterval = null;
    let isCountdownRunning = false;
    let initialPlaybackTime = 0; // 记录倒计时开始时的播放时间
    let delayMinutes = GM_getValue('delayMinutes', CONFIG.DEFAULT_DELAY); // 存储当前设置的延时（分钟），从本地存储读取
    let isVideoEnded = false; // 标记视频是否已结束
    let countdownStartTime = 0; // 倒计时开始时间戳
    let totalLearntime = 0; // 累计学习时长（秒）
    let broadcastChannel = null; // 用于页面间通信
    let lastSentProgress = -1; // 上一次发送的进度，用于限制发送频率
    let isCourseCompleted = false; // 标记课程是否已完成（进度达到100%）
    
    // 课程相关变量
    let currentCourseIndex = -1; // 当前课程索引
    let courseList = []; // 课程列表
    
    // 日志去重和时间管理
    let lastLogTime = 0;
    let lastLogContent = '';
    
    // 检测当前页面类型
    function detectPageType() {
        const currentUrl = window.location.href;
        
        // 明确的课程列表页面
        if (currentUrl.includes('Userselectlesson/show.do')) {
            return 'courseList';
        }
        
        // 明确的Learn/enter.do页面，直接标记为videoPlay
        if (currentUrl.includes('Learn/enter.do')) {
            return 'videoPlay';
        }
        

        
        return 'unknown';
    }
    
    // 初始化广播频道
    function initBroadcastChannel() {
        broadcastChannel = new BroadcastChannel('cmc-video-learning');
        
        broadcastChannel.addEventListener('message', function(e) {
            const data = e.data;
            
            // 课程列表页面接收消息
            if (currentPageType === 'courseList') {
                if (data.type === 'videoCompleted') {
                    // 处理视频完成消息
                    console.log('收到视频完成消息:', data);
                    handleVideoCompleted(data);
                } else if (data.type === 'progressUpdate') {
                    // 处理进度更新消息
                    console.log('收到进度更新消息:', data);
                    updateCourseProgress(data);
                } else if (data.type === 'requestCourseList') {
                    // 收到请求课程列表消息，重新发送课程列表就绪消息
                    console.log('收到请求课程列表消息，重新发送课程列表就绪消息');
                    sendCourseListReadyMessage();
                }
            }
            
            // 视频播放页面接收消息
            if (currentPageType === 'videoPlay') {
                if (data.type === 'courseListReady') {
                    // 处理课程列表就绪消息
                    console.log('收到课程列表就绪消息:', data);
                    
                    // 获取当前视频播放页的lessonId
                    const currentUrl = window.location.href;
                    const currentLessonId = currentUrl.match(/lessonId=(\d+)/)?.[1] || 'unknown';
                    
                    // 只有当消息中的currentLessonId与当前视频播放页的lessonId一致时，才处理该消息
                    // 这样可以避免收到其他课程列表的消息
                    if (data.currentLessonId && currentLessonId && data.currentLessonId !== currentLessonId) {
                        console.log('收到的课程列表lessonId（', data.currentLessonId, '）与当前视频播放页lessonId（', currentLessonId, '）不一致，忽略该消息');
                        return;
                    }
                    
                    // 只有当收到的课程列表数量大于当前课程列表数量，或者当前课程列表为空时，才更新课程列表
                    // 避免课程列表被覆盖为更小的列表
                    if (data.courseList.length > courseList.length || courseList.length === 0) {
                        courseList = data.courseList;
                        updateCurrentCourseIndex();
                        console.log('已更新课程列表，共', courseList.length, '个课程');
                        // 打印课程列表信息到控制台
                        console.log('课程列表详情:', courseList);
                        
                        // 存储课程列表到本地存储，使用当前课程的lessonId作为前缀
                        const storageKey = `courseList_${currentLessonId}`;
                        GM_setValue(storageKey, JSON.stringify(courseList));
                        console.log('已将课程列表存储到本地存储，存储key:', storageKey);
                        
                        // 更新课程列表显示
                        updateCourseListDisplay();
                    } else {
                        console.log('收到的课程列表数量（', data.courseList.length, '）不大于当前课程列表数量（', courseList.length, '），忽略该消息');
                    }
                }
            }
        });
        
        console.log('广播频道已初始化');
    }
    
    // 更新当前课程索引
    function updateCurrentCourseIndex() {
        if (courseList.length === 0) return;
        
        const currentUrl = window.location.href;
        for (let i = 0; i < courseList.length; i++) {
            if (currentUrl.includes(courseList[i].lessonId) && 
                currentUrl.includes(courseList[i].coursewareId)) {
                currentCourseIndex = i;
                console.log(`当前课程索引：${currentCourseIndex}，课程：${courseList[i].title}`);
                break;
            }
        }
    }
    
    // 处理视频完成消息，支持没有currentIndex但有lessonId的情况
    function handleVideoCompleted(data) {
        console.log('收到视频完成消息，准备处理：', data);
        
        // 只在课程列表页面显示课程完成提示，不再显示倒计时弹框和打开新窗口
        // 新视频的播放由视频播放页面自己处理
        console.log('视频播放页面会自行处理下一个视频播放，列表页面不做处理');
        
        // 如果没有找到下一个课程，显示课程完成提示
        if (currentPageType === 'courseList') {
            console.log('在列表页面收到视频完成消息，不执行自动播放操作');
        }
    }
    
    // 更新课程进度，只使用URL中的唯一标识符匹配，不使用标题匹配
    function updateCourseProgress(data) {
        const courseIdentifier = data.uniqueCourseTitle || data.courseTitle;
        console.log(`课程 ${courseIdentifier} 进度更新：${data.progress}%`);
        
        // 查找对应的课程项
        const courseItems = document.querySelectorAll('#course-list-content div[data-lesson-id]');
        let foundItem = null;
        
        // 只使用URL中的唯一标识符组合匹配课程：lessonId、coursewareId、lessonGkey
        // 不使用标题匹配，因为播放页标题可能相同
        if (data.lessonId && data.coursewareId) {
            console.log(`尝试使用唯一标识符匹配课程：lessonId=${data.lessonId}, coursewareId=${data.coursewareId}`);
            courseItems.forEach(item => {
                // 获取课程项的唯一标识符
                const itemLessonId = item.getAttribute('data-lesson-id');
                const itemCoursewareId = item.getAttribute('data-courseware-id');
                const itemLessonGkey = item.getAttribute('data-lesson-gkey');
                
                // 使用完整的唯一标识符组合匹配
                if (itemLessonId === data.lessonId && itemCoursewareId === data.coursewareId) {
                    // 如果有lessonGkey，也需要匹配
                    if (!data.lessonGkey || itemLessonGkey === data.lessonGkey) {
                        foundItem = item;
                        console.log(`找到匹配的课程项：lessonId=${itemLessonId}, coursewareId=${itemCoursewareId}`);
                    }
                }
            });
        }
        
        // 移除标题匹配作为备选方案，因为播放页标题可能相同
        /*
        // 2. 如果没有找到，使用课程标题匹配作为备选方案
        if (!foundItem) {
            console.log(`未找到匹配的唯一标识符，尝试使用标题匹配：${courseIdentifier}`);
            courseItems.forEach(item => {
                const itemText = item.textContent;
                // 使用更精确的匹配方式：包含完整标题或唯一标题
                if (itemText.includes(courseIdentifier) || 
                    (data.uniqueCourseTitle && itemText.includes(data.uniqueCourseTitle))) {
                    foundItem = item;
                    console.log(`找到匹配的课程项：${itemText}`);
                }
            });
        }
        */
        
        // 更新找到的课程项的进度
        if (foundItem) {
            // 更新进度条
            const progressBar = foundItem.querySelector('.progress-bar');
            const progressPercentage = foundItem.querySelector('.progress-percentage');
            
            if (progressBar && progressPercentage) {
                progressBar.style.width = `${data.progress}%`;
                progressPercentage.textContent = `${data.progress}%`;
                console.log(`已更新课程进度为 ${data.progress}%`);
            }
        } else {
            console.log(`未找到对应课程项，无法更新进度。课程信息：`, data);
            console.log(`当前页面课程项数量：${courseItems.length}`);
            // 显示所有课程项的唯一标识符，便于调试
            courseItems.forEach((item, index) => {
                const itemLessonId = item.getAttribute('data-lesson-id');
                const itemCoursewareId = item.getAttribute('data-courseware-id');
                const itemLessonGkey = item.getAttribute('data-lesson-gkey');
                console.log(`课程项 ${index + 1}：lessonId=${itemLessonId}, coursewareId=${itemCoursewareId}, lessonGkey=${itemLessonGkey}`);
            });
        }
    }
    
    // 发送视频完成消息，支持没有currentCourseIndex的情况
    function sendVideoCompletedMessage() {
        if (broadcastChannel) {
            // 准备消息数据
            const messageData = {
                type: 'videoCompleted',
                currentTime: Date.now()
            };
            
            // 如果有currentCourseIndex，添加到消息中
            if (currentCourseIndex !== -1) {
                messageData.currentIndex = currentCourseIndex;
            }
            
            // 添加课程唯一标识符，确保列表页能识别是哪个课程完成了
            const courseIdentifier = parseCourseIdentifierFromUrl();
            messageData.lessonId = courseIdentifier.lessonId;
            messageData.coursewareId = courseIdentifier.coursewareId;
            messageData.lessonGkey = courseIdentifier.lessonGkey;
            
            broadcastChannel.postMessage(messageData);
            console.log(`已发送视频完成消息，lessonId：${courseIdentifier.lessonId}`);
        }
    }
    
    // 添加窗口关闭事件监听，只有当课程真正完成时才发送视频完成消息
    function addWindowCloseListener() {
        window.addEventListener('beforeunload', function() {
            console.log('窗口即将关闭，检查课程是否已完成');
            if (isCourseCompleted) {
                console.log('课程已完成，发送视频完成消息');
                sendVideoCompletedMessage();
            } else {
                console.log('课程未完成，不发送视频完成消息');
            }
        });
    }
    
    // 从URL解析课程唯一标识符
    function parseCourseIdentifierFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            lessonId: urlParams.get('lessonId') || '',
            coursewareId: urlParams.get('coursewareId') || '',
            lessonGkey: urlParams.get('lessonGkey') || ''
        };
    }
    
    // 发送进度更新消息，包含唯一课程标识符
    function sendProgressUpdateMessage(progress) {
        // 本地保存课程进度，不发送广播消息
        const courseIdentifier = parseCourseIdentifierFromUrl();
        const uniqueKey = `courseProgress_${courseIdentifier.lessonId}_${courseIdentifier.coursewareId}_${courseIdentifier.lessonGkey}`;
        GM_setValue(uniqueKey, progress);
        console.log(`已保存课程进度：${progress}%，存储key：${uniqueKey}`);
        
        // 当进度达到100%时，标记课程已完成
        if (progress >= 100) {
            isCourseCompleted = true;
            console.log('课程已完成，进度达到100%');
        }
        
        // 更新本地课程列表中的进度
        if (currentCourseIndex !== -1 && courseList[currentCourseIndex]) {
            courseList[currentCourseIndex].progress = progress;
            console.log(`已更新本地课程列表中当前课程的进度为 ${progress}%`);
            // 更新课程列表显示
            updateCourseListDisplay();
        }
    }
    
    // 发送课程列表就绪消息
    function sendCourseListReadyMessage() {
        if (broadcastChannel && courseList.length > 0) {
            // 获取课程列表中第一个课程的lessonId作为当前lessonId
            // 避免从课程列表页面URL中获取，因为课程列表页面URL中没有lessonId参数
            const currentLessonId = courseList[0].lessonId || 'unknown';
            
            broadcastChannel.postMessage({
                type: 'courseListReady',
                courseList: courseList,
                currentLessonId: currentLessonId,
                currentTime: Date.now()
            });
            console.log('已发送课程列表就绪消息，使用第一个课程的lessonId:', currentLessonId);
            
            // 存储课程列表到本地存储，使用第一个课程的lessonId作为前缀，避免不同课程之间的冲突
            GM_setValue(`courseList_${currentLessonId}`, JSON.stringify(courseList));
            console.log('已将课程列表存储到本地存储，存储key:', `courseList_${currentLessonId}`);
        }
    }
    
    // 显示自动播放倒计时弹框
    function showAutoPlayCountdown(nextCourse, delaySeconds) {
        // 检查是否已存在弹框，如果存在则移除
        let countdownDialog = document.getElementById('auto-play-countdown');
        if (countdownDialog) {
            countdownDialog.remove();
        }
        
        // 创建弹框容器
        countdownDialog = document.createElement('div');
        countdownDialog.id = 'auto-play-countdown';
        countdownDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            color: #333333;
            padding: 25px 30px;
            border-radius: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 9999999;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(200, 200, 200, 0.3);
            text-align: center;
            min-width: 350px;
            animation: entrance 0.5s ease-out;
        `;
        
        // 创建标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
        `;
        title.textContent = '自动播放下一节';
        countdownDialog.appendChild(title);
        
        // 创建课程信息
        const courseInfo = document.createElement('div');
        courseInfo.style.cssText = `
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 20px;
            line-height: 1.5;
        `;
        courseInfo.innerHTML = `将播放：<br><strong style="color: #667eea;">${nextCourse.title}</strong>`;
        countdownDialog.appendChild(courseInfo);
        
        // 创建倒计时显示
        const countdownDisplay = document.createElement('div');
        countdownDisplay.id = 'countdown-timer';
        countdownDisplay.style.cssText = `
            font-size: 48px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 25px;
            text-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
        `;
        countdownDisplay.textContent = delaySeconds;
        countdownDialog.appendChild(countdownDisplay);
        
        // 创建提示信息
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 13px;
            color: #718096;
            margin-bottom: 20px;
        `;
        message.textContent = '倒计时结束后将自动打开下一节视频';
        countdownDialog.appendChild(message);
        
        // 创建立即播放按钮
        const playNowButton = document.createElement('button');
        playNowButton.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            margin-right: 10px;
        `;
        playNowButton.textContent = '立即播放';
        playNowButton.addEventListener('click', () => {
            clearInterval(countdownInterval);
            countdownDialog.remove();
            // 用户主动点击，在本标签打开新视频
            window.location.href = nextCourse.playUrl;
        });
        countdownDialog.appendChild(playNowButton);
        
        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.style.cssText = `
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
            color: #4a5568;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(100, 100, 100, 0.1);
        `;
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', () => {
            clearInterval(countdownInterval);
            countdownDialog.remove();
        });
        countdownDialog.appendChild(cancelButton);
        
        // 添加到页面
        document.body.appendChild(countdownDialog);
        
        // 开始倒计时
        let remainingSeconds = delaySeconds;
        const countdownInterval = setInterval(() => {
            remainingSeconds--;
            countdownDisplay.textContent = remainingSeconds;
            
            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                countdownDialog.remove();
                // 倒计时结束，尝试打开下一个视频
                // 使用setTimeout延迟，确保DOM操作完成
                setTimeout(() => {
                    try {
                        // 在本标签打开新视频
                        window.location.href = nextCourse.playUrl;
                    } catch (error) {
                        console.error('打开新标签页失败:', error);
                        alert('打开新标签页失败，请手动点击\'立即播放\'按钮');
                    }
                }, 100);
            }
        }, 1000);
    }
    
    // 显示课程完成提示
    function showCourseCompletedMessage() {
        // 检查是否已存在弹框，如果存在则移除
        let completedDialog = document.getElementById('course-completed-dialog');
        if (completedDialog) {
            completedDialog.remove();
        }
        
        // 创建弹框容器
        completedDialog = document.createElement('div');
        completedDialog.id = 'course-completed-dialog';
        completedDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            color: #333333;
            padding: 30px 40px;
            border-radius: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 9999999;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 2px solid #667eea;
            text-align: center;
            min-width: 400px;
            animation: entrance 0.5s ease-out;
        `;
        
        // 创建标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 20px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 20px;
        `;
        title.textContent = '🎉 课程学习完成';
        completedDialog.appendChild(title);
        
        // 创建完成信息
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 25px;
            line-height: 1.6;
        `;
        message.textContent = '恭喜您已完成本课程的所有视频学习！';
        completedDialog.appendChild(message);
        
        // 创建关闭按钮（虽然不消失，但还是提供关闭选项）
        const closeButton = document.createElement('button');
        closeButton.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        `;
        closeButton.textContent = '知道了';
        closeButton.addEventListener('click', () => {
            completedDialog.remove();
            // 关闭当前标签页
            window.close();
        });
        completedDialog.appendChild(closeButton);
        
        // 添加到页面
        document.body.appendChild(completedDialog);
    }
    
    // 视频播放页面相关函数
    
    // 创建UI元素（视频播放页面）
    // 更新下一个待播放视频显示
    function updateCourseListDisplay() {
        const nextCourseContent = document.getElementById('next-course-content');
        if (!nextCourseContent) return;
        
        if (courseList.length === 0) {
            nextCourseContent.innerHTML = '<div style="color: #666; font-style: italic;">暂无下一个视频</div>';
            return;
        }
        
        // 查找下一个待播放视频
        let nextCourseIndex = -1;
        
        // 如果当前有课程在播放，查找下一个课程
        if (currentCourseIndex !== -1) {
            nextCourseIndex = currentCourseIndex + 1;
            
            // 如果启用了跳过已完成视频，寻找下一个未完成的视频
            if (CONFIG.SKIP_COMPLETED) {
                for (let i = nextCourseIndex; i < courseList.length; i++) {
                    const courseProgress = GM_getValue(`courseProgress_${courseList[i].lessonId}_${courseList[i].coursewareId}_${courseList[i].lessonGkey}`, 0);
                    if (courseProgress < 100) {
                        nextCourseIndex = i;
                        break;
                    }
                }
            }
        } else {
            // 如果没有当前课程，默认显示第一个课程
            nextCourseIndex = 0;
        }
        
        // 检查下一个课程索引是否有效
        if (nextCourseIndex < 0 || nextCourseIndex >= courseList.length) {
            nextCourseContent.innerHTML = '<div style="color: #666; font-style: italic;">暂无下一个视频</div>';
            return;
        }
        
        // 获取下一个待播放视频信息
        const nextCourse = courseList[nextCourseIndex];
        
        // 更新显示内容
        nextCourseContent.innerHTML = `
            <div style="font-weight: 600; color: #2d3748;">待播放：${nextCourse.title}(${nextCourseIndex + 1}/${courseList.length})</div>
        `;
    }
    
    function createVideoUI() {
        // 创建左侧综合面板
        const combinedPanel = document.createElement('div');
        combinedPanel.id = 'combined-panel';
        combinedPanel.style.cssText = `
            position: fixed;
            top: auto;
            right: 10px;
            bottom: 10px;
            left: auto;
            background: white;
            color: #333333;
            padding: 15px 20px;
            border-radius: 15px;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 999998;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(200, 200, 200, 0.4);
            width: 300px;
            max-width: 300px;
            height: auto;
            max-height: calc(100vh - 50px);
            box-sizing: border-box;
            overflow-y: auto;
            overflow-x: hidden;
            transform-origin: bottom right;
            transition: all 0.3s ease;
            margin: 0;
            outline: none;
        `;
        
        // 添加日志滚动条样式
        combinedPanel.innerHTML += `
            <style>
                /* 日志区域滚动条 */
                #learn-time-log::-webkit-scrollbar {
                    width: 6px;
                }
                #learn-time-log::-webkit-scrollbar-track {
                    background: rgba(200, 200, 200, 0.2);
                    border-radius: 3px;
                }
                #learn-time-log::-webkit-scrollbar-thumb {
                    background: rgba(102, 126, 234, 0.5);
                    border-radius: 3px;
                }
                #learn-time-log::-webkit-scrollbar-thumb:hover {
                    background: rgba(102, 126, 234, 0.7);
                }
            </style>
        `;
        
        // 创建面板控制按钮，固定在右下角
        const panelControl = document.createElement('button');
        panelControl.id = 'panel-control-btn';
        panelControl.textContent = '−';
        panelControl.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: 2px solid white;
            border-radius: 50%;
            font-size: 28px;
            line-height: 1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            z-index: 1000000; /* 确保按钮在最前面 */
            transform-origin: center center;
            text-align: center;
            padding: 0;
            margin: 0;
            font-weight: bold;
        `;
        
        // 添加悬停效果
        panelControl.onmouseenter = function() {
            this.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 1), rgba(118, 75, 162, 1))';
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.5)';
        };
        
        panelControl.onmouseleave = function() {
            this.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))';
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
        };
        
        // 面板折叠状态变量 - 从本地存储读取初始状态
        let isPanelCollapsed = GM_getValue('isPanelCollapsed', false);
        
        // 面板折叠/展开函数
        function togglePanelCollapse() {
            const panel = document.getElementById('combined-panel');
            
            if (isPanelCollapsed) {
                // 展开面板
                panel.style.width = '300px';
                panel.style.maxWidth = '300px';
                panel.style.height = 'auto';
                panel.style.maxHeight = 'calc(100vh - 50px)';
                panel.style.padding = '15px 20px';
                panel.style.borderRadius = '15px';
                panel.style.overflow = 'hidden';
                panel.style.overflowY = 'auto';
                panel.style.overflowX = 'hidden';
                panel.style.transform = 'none';
                panel.style.opacity = '1';
                panel.style.visibility = 'visible';
                panel.style.pointerEvents = 'auto';
                panel.style.top = 'auto';
                panel.style.right = '10px';
                panel.style.bottom = '10px';
                panel.style.left = 'auto';
                
                // 显示面板内容
                const children = panel.children;
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (child.id !== 'panel-control-btn') {
                        child.style.display = '';
                        child.style.transform = 'none';
                    }
                }
                
                panelControl.textContent = '−';
                isPanelCollapsed = false;
                // 保存状态到本地存储
                GM_setValue('isPanelCollapsed', isPanelCollapsed);
            } else {
                // 收起面板，隐藏面板内容，只显示按钮
                // 隐藏面板
                panel.style.opacity = '0';
                panel.style.visibility = 'hidden';
                panel.style.pointerEvents = 'none';
                
                panelControl.textContent = '+';
                isPanelCollapsed = true;
                // 保存状态到本地存储
                GM_setValue('isPanelCollapsed', isPanelCollapsed);
            }
        }
        
        // 添加按钮点击事件，触发折叠/展开
        panelControl.addEventListener('click', togglePanelCollapse);
        
        // 添加面板双击事件，双击空白位置触发折叠/展开
        combinedPanel.addEventListener('dblclick', function(e) {
            // 只有当点击的是面板本身（不是按钮或其他子元素）时才触发折叠
            if (e.target === combinedPanel) {
                togglePanelCollapse();
            }
        });
        
        // 面板控制按钮应该直接添加到document.body，而不是combinedPanel内部
        document.body.appendChild(panelControl);
        
        // 视频时长显示
        const videoInfo = document.createElement('div');
        videoInfo.id = 'video-info';
        videoInfo.innerHTML = `视频时长：--:-- / --:--`;
        videoInfo.style.marginBottom = '8px';
        videoInfo.style.fontWeight = '500';
        combinedPanel.appendChild(videoInfo);

        // 倒计时设置
        const countdownSettings = document.createElement('div');
        
        // 构建基础HTML内容
        let countdownHtml = `
            <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 500;">延时设置：</span>
                    <input type="number" id="delay-input" value="${delayMinutes}"
                           min="0" max="120" style="width: 80px; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 6px; padding: 4px 6px; font-size: 13px; outline: none; transition: all 0.2s ease;">
                    <span>分钟</span>
                </div>
                <div id="countdown-display" style="font-weight: 600; font-size: 15px; color: #2d3748;">倒计时：--:--:--</div>
            </div>
            
            <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 500;">日志显示设置：</span>
                <select id="log-level-select" style="background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 6px; padding: 4px 6px; font-size: 13px; outline: none; transition: all 0.2s ease; cursor: pointer;">
                    <option value="simple" ${CONFIG.LOG_LEVEL === 'simple' ? 'selected' : ''}>简单日志</option>
                    <option value="full" ${CONFIG.LOG_LEVEL === 'full' ? 'selected' : ''}>完整日志</option>
                </select>
            </div>
            
            <!-- 会话保持配置 -->
            <div style="margin: 12px 0 8px 0; padding: 10px; background: rgba(240, 240, 240, 0.7); border-radius: 8px; font-size: 13px;">
                <div style="margin-bottom: 8px; font-weight: 600; color: #4a5568;">会话保持配置（秒）</div>
                <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <span>最小间隔：</span>
                        <input type="number" id="session-min-input" value="${CONFIG.SESSION_KEEPALIVE_MIN}"
                               min="5" max="300" style="width: 80px; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 6px; padding: 4px 6px; font-size: 13px; outline: none; transition: all 0.2s ease;">
                        <span>秒</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <span>最大间隔：</span>
                        <input type="number" id="session-max-input" value="${CONFIG.SESSION_KEEPALIVE_MAX}"
                               min="10" max="600" style="width: 80px; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 6px; padding: 4px 6px; font-size: 13px; outline: none; transition: all 0.2s ease;">
                        <span>秒</span>
                    </div>
                </div>
            </div>
            
            <!-- 自动播放配置 -->
            <div style="margin: 12px 0 8px 0; padding: 10px; background: rgba(240, 240, 240, 0.7); border-radius: 8px; font-size: 13px;">
                <div style="margin-bottom: 8px; font-weight: 600; color: #4a5568;">自动播放配置</div>
                <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="auto-play-next" ${CONFIG.AUTO_PLAY_NEXT ? 'checked' : ''} style="width: 15px; height: 15px; cursor: pointer;">
                        <label for="auto-play-next" style="cursor: pointer; font-size: 13px;">自动播放下一节</label>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="skip-completed" ${CONFIG.SKIP_COMPLETED ? 'checked' : ''} style="width: 15px; height: 15px; cursor: pointer;">
                        <label for="skip-completed" style="cursor: pointer; font-size: 13px;">跳过已完成视频</label>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                        <span>播放延迟：</span>
                        <input type="number" id="auto-play-delay" value="${CONFIG.AUTO_PLAY_DELAY}"
                               min="1" max="60" style="width: 80px; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(150, 150, 150, 0.3); color: #333333; border-radius: 6px; padding: 4px 6px; font-size: 13px; outline: none; transition: all 0.2s ease;">
                        <span>秒</span>
                    </div>
                </div>
            </div>`;
        
        // 根据DEBUG_MODE条件添加模拟按钮，放到原来倒计时的位置，居中显示
        if (CONFIG.DEBUG_MODE) {
            countdownHtml += `
            <div style="margin: 12px 0 15px 0; display: flex; justify-content: center; gap: 10px;">
                <button id="end-countdown" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); transition: all 0.2s ease;">模拟结束</button>
                <button id="debug-submit" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3); transition: all 0.2s ease;">模拟时长</button>
            </div>`;
        } else {
            countdownHtml += `
            <div style="margin-bottom: 15px;"></div>`;
        }
        
        countdownHtml += `
        `;
        
        countdownSettings.innerHTML = countdownHtml;
        combinedPanel.appendChild(countdownSettings);
        
        // 下一个待播放视频标题和内容合并区域
        const nextCourseContent = document.createElement('div');
        nextCourseContent.id = 'next-course-content';
        nextCourseContent.style.cssText = `
            margin-bottom: 15px;
            padding: 12px;
            background: rgba(250, 250, 250, 0.75);
            border-radius: 10px;
            font-size: 13px;
            line-height: 1.5;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            text-align: center;
        `;
        // 初始显示空内容
        nextCourseContent.innerHTML = '<div style="color: #666; font-style: italic;">暂无下一个视频</div>';
        combinedPanel.appendChild(nextCourseContent);
        
        // 添加学习时长提交日志区域
        const learnTimeLog = document.createElement('div');
        learnTimeLog.id = 'learn-time-log';
        learnTimeLog.style.cssText = `
            max-height: 180px;
            min-height: 120px;
            overflow-y: auto;
            margin-top: 12px;
            margin-bottom: 15px;
            padding: 12px;
            border-top: 1px solid rgba(200, 200, 200, 0.3);
            background: rgba(250, 250, 250, 0.75);
            border-radius: 10px;
            font-size: 12px;
            line-height: 1.6;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.08);
        `;
        learnTimeLog.innerHTML = '';
        combinedPanel.appendChild(learnTimeLog);
        
        // 创建全屏提醒
        const fullscreenDiv = document.createElement('div');
        fullscreenDiv.id = 'fullscreen-notification';
        fullscreenDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, rgba(255, 0, 0, 0.4), rgba(255, 255, 0, 0.4));
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 80px;
            font-weight: bold;
            z-index: 9999999;
            display: none;
            animation: pulse 1s infinite alternate;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% {
                    box-shadow: 0 0 100px rgba(255, 0, 0, 1), 0 0 50px rgba(255, 255, 0, 1);
                    transform: scale(1);
                }
                100% {
                    box-shadow: 0 0 150px rgba(255, 0, 0, 1), 0 0 100px rgba(255, 255, 0, 1);
                    transform: scale(1.05);
                }
            }

            @keyframes blink {
                0%, 100% {
                    opacity: 1;
                    text-shadow: 0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ff0000, 0 0 40px #ff0000, 0 0 50px #ff0000;
                }
                50% {
                    opacity: 0.8;
                    text-shadow: 0 0 5px #ffff00, 0 0 10px #ffff00, 0 0 15px #ff0000;
                }
            }

            @keyframes entrance {
                0% {
                    opacity: 0;
                    transform: scale(0.5) rotate(-10deg);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                }
            }

            @keyframes float {
                0% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-10px);
                }
                100% {
                    transform: translateY(0px);
                }
            }

            /* 扫描线效果 */
            @keyframes scanline {
                0% {
                    background-position: 0 0;
                }
                100% {
                    background-position: 0 100vh;
                }
            }

            /* 跳舞效果 */
            @keyframes dance {
                0% {
                    transform: translate(0, 0) rotate(0deg) scale(1);
                }
                10% {
                    transform: translate(10px, -10px) rotate(5deg) scale(1.05);
                }
                20% {
                    transform: translate(-10px, -5px) rotate(-3deg) scale(0.95);
                }
                30% {
                    transform: translate(15px, 5px) rotate(2deg) scale(1.1);
                }
                40% {
                    transform: translate(-5px, 10px) rotate(-5deg) scale(0.9);
                }
                50% {
                    transform: translate(20px, -15px) rotate(7deg) scale(1.15);
                }
                60% {
                    transform: translate(-15px, -10px) rotate(-2deg) scale(0.95);
                }
                70% {
                    transform: translate(10px, 10px) rotate(3deg) scale(1.05);
                }
                80% {
                    transform: translate(-10px, 5px) rotate(-4deg) scale(0.98);
                }
                90% {
                    transform: translate(15px, -5px) rotate(5deg) scale(1.02);
                }
                100% {
                    transform: translate(0, 0) rotate(0deg) scale(1);
                }
            }

            /* 轻微跳舞效果（适合副标题） */
            @keyframes gentleDance {
                0% {
                    transform: translate(0, 0) rotate(0deg) scale(1);
                }
                25% {
                    transform: translate(5px, -5px) rotate(2deg) scale(1.02);
                }
                50% {
                    transform: translate(-3px, 3px) rotate(-1deg) scale(0.98);
                }
                75% {
                    transform: translate(3px, 2px) rotate(1deg) scale(1.01);
                }
                100% {
                    transform: translate(0, 0) rotate(0deg) scale(1);
                }
            }
        `;
        document.head.appendChild(style);

        fullscreenDiv.innerHTML = `
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(0deg, rgba(0, 0, 0, 0.1) 0%, transparent 100%); background-size: 100% 4px; animation: scanline 3s linear infinite; pointer-events: none;"></div>
            <div style="padding: 30px 60px; border-radius: 15px; border: 4px solid #ffff00; box-shadow: 0 0 50px rgba(255, 255, 0, 0.8); color: #ffffff; text-shadow: 0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ff0000, 0 0 40px #ff0000, 0 0 50px #ff0000; animation: blink 1s infinite, entrance 1s ease-out, dance 3s ease-in-out infinite;">视频已播放完毕</div>
            <div style="font-size: 40px; margin-top: 30px; opacity: 1; padding: 15px 30px; border-radius: 10px; border: 2px solid #ffff00; box-shadow: 0 0 30px rgba(255, 255, 0, 0.6); color: #ffffff; text-shadow: 0 0 8px #ffff00, 0 0 15px #ffff00, 0 0 25px #ff0000; animation: blink 1.5s infinite, entrance 1s ease-out 0.3s both, gentleDance 4s ease-in-out infinite;">点击任意位置关闭</div>
        `;

        document.body.appendChild(combinedPanel);
        document.body.appendChild(fullscreenDiv);
        
        // 根据初始状态设置面板样式
        if (isPanelCollapsed) {
            // 初始状态为折叠
            combinedPanel.style.opacity = '0';
            combinedPanel.style.visibility = 'hidden';
            combinedPanel.style.pointerEvents = 'none';
            panelControl.textContent = '+';
        } else {
            // 初始状态为展开
            combinedPanel.style.opacity = '1';
            combinedPanel.style.visibility = 'visible';
            combinedPanel.style.pointerEvents = 'auto';
            panelControl.textContent = '−';
        }
        
        // 初始更新课程列表显示
        updateCourseListDisplay();

        // 添加事件监听
        
        // 基础事件监听（始终添加）
        document.getElementById('delay-input').addEventListener('input', handleDelayChange);
        document.getElementById('log-level-select').addEventListener('change', function() {
            // 更新日志级别配置
            CONFIG.LOG_LEVEL = this.value;
            // 保存到本地存储
            GM_setValue('logLevel', CONFIG.LOG_LEVEL);
            console.log(`日志级别已切换为：${CONFIG.LOG_LEVEL}`);
        });
        
        // 会话保持最小间隔输入事件
        document.getElementById('session-min-input').addEventListener('input', function() {
            // 获取输入值
            let value = parseInt(this.value) || CONFIG.SESSION_KEEPALIVE_MIN;
            // 确保值在有效范围内
            value = Math.max(5, Math.min(300, value));
            // 更新配置
            CONFIG.SESSION_KEEPALIVE_MIN = value;
            // 保存到本地存储
            GM_setValue('sessionKeepaliveMin', CONFIG.SESSION_KEEPALIVE_MIN);
            // 更新输入框显示（如果输入值超出范围）
            this.value = value;
            console.log(`会话保持最小间隔已更新为：${CONFIG.SESSION_KEEPALIVE_MIN}秒`);
        });
        
        // 会话保持最大间隔输入事件
        document.getElementById('session-max-input').addEventListener('input', function() {
            // 获取输入值
            let value = parseInt(this.value) || CONFIG.SESSION_KEEPALIVE_MAX;
            // 确保值在有效范围内
            value = Math.max(10, Math.min(600, value));
            // 确保最大值不小于最小值
            if (value < CONFIG.SESSION_KEEPALIVE_MIN) {
                value = CONFIG.SESSION_KEEPALIVE_MIN;
            }
            // 更新配置
            CONFIG.SESSION_KEEPALIVE_MAX = value;
            // 保存到本地存储
            GM_setValue('sessionKeepaliveMax', CONFIG.SESSION_KEEPALIVE_MAX);
            // 更新输入框显示（如果输入值超出范围）
            this.value = value;
            console.log(`会话保持最大间隔已更新为：${CONFIG.SESSION_KEEPALIVE_MAX}秒`);
        });
        
        // 自动播放下一节选项
        document.getElementById('auto-play-next').addEventListener('change', function() {
            CONFIG.AUTO_PLAY_NEXT = this.checked;
            GM_setValue('autoPlayNext', CONFIG.AUTO_PLAY_NEXT);
            console.log(`自动播放下一节已${CONFIG.AUTO_PLAY_NEXT ? '开启' : '关闭'}`);
        });
        
        // 跳过已完成视频选项
        document.getElementById('skip-completed').addEventListener('change', function() {
            CONFIG.SKIP_COMPLETED = this.checked;
            GM_setValue('skipCompleted', CONFIG.SKIP_COMPLETED);
            console.log(`跳过已完成视频已${CONFIG.SKIP_COMPLETED ? '开启' : '关闭'}`);
        });
        
        // 自动播放延迟时间输入事件
        document.getElementById('auto-play-delay').addEventListener('input', function() {
            // 获取输入值
            let value = parseInt(this.value) || CONFIG.AUTO_PLAY_DELAY;
            // 确保值在有效范围内
            value = Math.max(1, Math.min(60, value));
            // 更新配置
            CONFIG.AUTO_PLAY_DELAY = value;
            // 保存到本地存储
            GM_setValue('autoPlayDelay', CONFIG.AUTO_PLAY_DELAY);
            // 更新输入框显示（如果输入值超出范围）
            this.value = value;
            console.log(`自动播放延迟时间已更新为：${CONFIG.AUTO_PLAY_DELAY}秒`);
        });
        
        // 根据DEBUG_MODE条件添加模拟按钮事件监听
        if (CONFIG.DEBUG_MODE) {
            // 模拟结束按钮事件
            const endCountdownBtn = document.getElementById('end-countdown');
            if (endCountdownBtn) {
                endCountdownBtn.addEventListener('click', endCountdown);
            }
            
            // 调试提交按钮事件
            const debugSubmitBtn = document.getElementById('debug-submit');
            if (debugSubmitBtn) {
                debugSubmitBtn.addEventListener('click', function() {
                    // 模拟提交学习记录
                    console.log('调试提交：模拟提交学习记录');
                    
                    // 构建模拟的学习时长提交数据
                    const simulatedLearnTime = Math.floor(Math.random() * 100 + 60); // 1-2分钟的随机时长
                    const newTotalTime = totalLearntime + simulatedLearnTime;
                    
                    // 计算进度百分比
                    const progress = Math.min(100, Math.floor((newTotalTime / videoDuration) * 100));
                    
                    // 构建日志内容，添加进度百分比
                    const logSuffix = videoDuration > 0 && newTotalTime >= videoDuration ? ' （视频已播放完毕，可以立即结束播放）' : '';
                    const logContent = `提交学习时长 ${formatSeconds(simulatedLearnTime)}，累计 ${formatSeconds(newTotalTime)}，进度 ${progress}%${logSuffix}`;
                    
                    // 显示模拟提交日志
                    displayDebugLog(logContent);
                    
                    // 更新累计时长
                    totalLearntime += simulatedLearnTime;
                    
                    // 发送进度更新消息
                    sendProgressUpdateMessage(progress);
                    
                    // 检查是否播放完毕
                    if (videoDuration > 0 && newTotalTime >= videoDuration) {
                        console.log('模拟学习时长已超过视频总时长，准备发送视频完成消息');
                        
                        // 发送视频完成消息
                        sendVideoCompletedMessage();
                        
                        // 标记课程已完成
                        isCourseCompleted = true;
                        
                        // 触发播放下一节视频逻辑
                        const nextCourse = findNextCourse();
                        if (nextCourse) {
                            console.log('将播放下一个课程：', nextCourse.title);
                            showVideoEndCountdown(nextCourse);
                        } else {
                            console.log('已播放完所有课程或没有找到下一个未完成的课程');
                            // 显示课程完成提示
                            showCourseCompletedMessage();
                        }
                    }
                    
                    console.log('调试提交完成');
                });
            }
        }
    }
    
    // 显示调试日志
    function displayDebugLog(logContent) {
        const now = new Date();
        const timeDisplay = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const logArea = document.getElementById('learn-time-log');
        if (logArea) {
            const logEntry = document.createElement('div');
            logEntry.style.cssText = `
                margin: 4px 0;
                padding: 5px 8px;
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.85);
                color: #333333;
                font-size: 12px;
                text-align: left;
                line-height: 1.5;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                transition: all 0.2s ease;
            `;
            logEntry.onmouseenter = function() {
                this.style.background = 'rgba(245, 245, 245, 0.9)';
            };
            
            logEntry.onmouseleave = function() {
                this.style.background = 'rgba(255, 255, 255, 0.85)';
            };
            
            logEntry.textContent = `${timeDisplay} - 调试：${logContent}`;
            logArea.appendChild(logEntry);
            logArea.scrollTop = logArea.scrollHeight;
            
            // 限制日志数量，最多保留50条
            const logEntries = logArea.querySelectorAll('div');
            if (logEntries.length > 51) { // 50条日志 + 1条标题
                // 只移除最旧的1条日志
                logEntries[1].remove();
            }
        }
    }
    
    // 查找视频元素
    function findVideoElement() {
        // 1. 首先尝试直接在页面中查找视频元素
        let video = document.querySelector('video');
        if (video) {
            return video;
        }

        // 2. 尝试查找常见播放器结构
        const commonVideoSelectors = [
            '#videoplayer video',
            '.video-player video',
            '.player video',
            '#video-player video',
            '.video-container video',
            '.video-wrapper video',
            '#main-video video',
            '.main-video video',
            '#content video',
            '.content video',
            '#player-container video',
            '.player-container video'
        ];
        
        for (const selector of commonVideoSelectors) {
            video = document.querySelector(selector);
            if (video) {
                return video;
            }
        }
        
        // 3. 尝试使用更通用的选择器
        const genericSelectors = [
            'div[id*="video"] video',
            'div[class*="video"] video',
            'div[id*="player"] video',
            'div[class*="player"] video',
            'section video',
            'article video',
            'main video',
            '#video video',
            '#player video'
        ];
        
        for (const selector of genericSelectors) {
            video = document.querySelector(selector);
            if (video) {
                return video;
            }
        }

        // 4. 尝试在iframe中查找视频元素
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                
                // 直接查找iframe中的视频元素
                video = iframeDoc.querySelector('video');
                if (video) {
                    return video;
                }
                
                // 尝试在iframe中查找常见播放器结构
                for (const selector of commonVideoSelectors) {
                    video = iframeDoc.querySelector(selector);
                    if (video) {
                        return video;
                    }
                }
            } catch (e) {
                // 跨域iframe无法访问，忽略
            }
        }
        
        // 5. 最终检查，再次尝试直接查找video元素
        video = document.querySelector('video');
        if (video) {
            return video;
        }

        return null;
    }
    
    // 添加MutationObserver监听视频元素的动态添加
    function addVideoMutationObserver() {
        
        const observer = new MutationObserver((mutationsList, observer) => {
            // 如果视频元素已经存在，跳过查找
            if (videoElement) {
                observer.disconnect();
                return;
            }
            
            const video = findVideoElement();
            if (video) {
                // 停止监听
                observer.disconnect();
                
                // 初始化视频元素
                initVideoElement();
            }
        });
        
        // 配置观察选项
        const config = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'class', 'id']
        };
        
        // 如果视频元素已经存在，直接返回，不启动监听
        if (videoElement) {
            return;
        }
        
        // 启动观察
        observer.observe(document.body, config);
        
        // 10秒后停止观察，避免长时间监听
        setTimeout(() => {
            observer.disconnect();
        }, 10000);
    }

    // 格式化时间显示
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) seconds = 0;
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // 更新视频信息显示
    function updateVideoInfo() {
        const videoInfoElement = document.getElementById('video-info');
        if (!videoInfoElement) {
            console.log('视频信息元素未找到，无法更新视频时长');
            return;
        }
        
        if (!videoElement) {
            videoInfoElement.textContent = '视频时长：--:-- / --:--';
            return;
        }

        const currentTime = videoElement.currentTime;
        const duration = videoElement.duration;

        // 更新视频总时长
        if (duration > 0) {
            videoDuration = duration;

            // 如果视频时长已可用且倒计时未运行，则自动启动倒计时
            if (!isCountdownRunning) {
                startCountdown();
            }
        }

        // 检测视频是否结束
        if (duration > 0 && currentTime >= duration - 0.1 && !isVideoEnded) {
            // 视频已结束，开始独立倒计时
            isVideoEnded = true;
            countdownStartTime = Date.now();
            console.log('视频已结束，开始独立倒计时');
            
            // 标记课程已完成
            isCourseCompleted = true;
            console.log('视频已结束，标记课程为已完成');
            
            // 直接将当前课程进度设置为100%并保存到本地存储
            sendProgressUpdateMessage(100);
            
            // 发送视频完成消息
            sendVideoCompletedMessage();
            
            // 在视频播放页面显示下一节播放提示
            const nextCourse = findNextCourse();
            if (nextCourse) {
                console.log('将播放下一个课程：', nextCourse.title);
                showVideoEndCountdown(nextCourse);
            } else {
                console.log('已播放完所有课程或没有找到下一个未完成的课程');
                // 显示课程完成提示
                showCourseCompletedMessage();
            }

            // 让视频在延迟时间内保持播放状态（循环播放或继续播放）
            try {
                // 设置视频循环播放
                videoElement.loop = true;
                // 重新开始播放视频
                videoElement.currentTime = 0;
                videoElement.play().catch(error => {
                    console.log('视频循环播放失败:', error);
                });
                console.log('视频已设置为循环播放，保持播放状态');
            } catch (e) {
                console.log('设置视频循环播放时出错:', e);
            }
        }

        videoInfoElement.textContent = 
            `视频时长：${formatTime(currentTime)} / ${formatTime(duration)}`;
        
        // 更新倒计时显示
        updateCountdown();
    }
    
    // 注释掉实时进度更新，只在课程时长提交时发送更新
    // 进度条更新应该只有在课程时长提交时才触发，而不是实时触发
    /*
    if (duration > 0) {
        const progress = Math.floor((currentTime / duration) * 100);
        // 只在进度变化时发送更新，避免频繁发送
        if (lastSentProgress !== progress) {
            sendProgressUpdateMessage(progress);
            lastSentProgress = progress;
        }
    }
    */

    // 更新倒计时显示
    function updateCountdown() {
        const countdownElement = document.getElementById('countdown-display');
        if (!countdownElement) {
            console.log('倒计时元素未找到，无法更新倒计时');
            return;
        }
        
        if (!isCountdownRunning || !videoElement) {
            countdownElement.textContent = `倒计时：--:--:--`;
            return;
        }

        let totalRemainingSeconds;

        if (isVideoEnded) {
            // 视频已结束，使用独立倒计时
            const elapsedSeconds = Math.floor((Date.now() - countdownStartTime) / 1000);
            totalRemainingSeconds = (delayMinutes * 60) - elapsedSeconds;
        } else {
            // 视频未结束，基于视频播放时间计算
            const currentPlaybackTime = videoElement.currentTime;
            const remainingVideoTime = videoDuration - currentPlaybackTime;
            totalRemainingSeconds = remainingVideoTime + (delayMinutes * 60);
        }

        remainingTime = Math.max(0, Math.floor(totalRemainingSeconds));

        countdownElement.textContent = 
            `倒计时：${formatTime(remainingTime)}`;

        // 检查倒计时是否结束
        if (remainingTime <= 0 && isCountdownRunning) {
            endCountdown();
        }
    }

    // 开始倒计时
    function startCountdown() {
        // 停止之前的倒计时
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        // 重置视频结束标记
        isVideoEnded = false;

        // 获取当前视频播放时间
        initialPlaybackTime = videoElement.currentTime;

        isCountdownRunning = true;

        // 更新显示
        updateCountdown();

        // 启动定时器，更新显示包括视频时长和倒计时
        countdownInterval = setInterval(() => {
            updateCountdown();
            updateVideoInfo();
        }, CONFIG.UPDATE_INTERVAL);

        // 计算初始剩余时长
        const remainingVideoTime = videoDuration - initialPlaybackTime;
        const totalSeconds = remainingVideoTime + (delayMinutes * 60);
        console.log(`倒计时已启动，初始剩余时长：${formatTime(totalSeconds)}`);
    }

    // 处理延时设置变化
    function handleDelayChange() {
        delayMinutes = parseInt(document.getElementById('delay-input').value) || CONFIG.DEFAULT_DELAY;
        // 保存到本地存储
        GM_setValue('delayMinutes', delayMinutes);
        // 更新显示
        updateCountdown();
        console.log(`延时设置已更新为：${delayMinutes}分钟`);
    }

    // 处理视频播放进度变化
    function handlePlaybackProgressChange() {
        if (!isCountdownRunning || !videoElement) return;

        // 更新显示
        updateCountdown();
    }

    // 取消倒计时
    function cancelCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        isCountdownRunning = false;
        remainingTime = 0;
        updateCountdown();

        console.log('倒计时已取消');
    }

    // 查找下一个要播放的视频
    function findNextCourse() {
        if (courseList.length === 0) return null;
        
        let nextIndex = -1;
        let currentIndex = -1;
        
        // 1. 如果有currentCourseIndex，直接使用它
        if (currentCourseIndex !== -1) {
            currentIndex = currentCourseIndex;
            nextIndex = currentCourseIndex + 1;
        }
        // 2. 如果没有currentCourseIndex但有当前URL，查找当前课程在列表中的位置
        else {
            const currentUrl = window.location.href;
            for (let i = 0; i < courseList.length; i++) {
                if (currentUrl.includes(courseList[i].lessonId) && 
                    currentUrl.includes(courseList[i].coursewareId)) {
                    currentIndex = i;
                    nextIndex = i + 1;
                    break;
                }
            }
        }
        
        console.log('当前课程索引：', currentIndex, '，下一个开始索引：', nextIndex, '，课程总数：', courseList.length);
        
        // 如果找到了当前课程的位置
        if (currentIndex !== -1) {
            let foundNext = false;
            let finalNextIndex = -1;
            
            // 如果启用了跳过已完成视频，寻找下一个未完成的视频
            if (CONFIG.SKIP_COMPLETED) {
                console.log('启用了跳过已完成视频，寻找下一个未完成的视频');
                // 从当前课程的下一个开始查找
                for (let i = nextIndex; i < courseList.length; i++) {
                    const nextCourse = courseList[i];
                    // 这里假设进度小于100%视为未完成
                    const uniqueKey = `courseProgress_${nextCourse.lessonId}_${nextCourse.coursewareId}_${nextCourse.lessonGkey}`;
                    const courseProgress = GM_getValue(uniqueKey, 0);
                    console.log(`检查课程 ${i}：${nextCourse.title}，进度：${courseProgress}%`);
                    if (courseProgress < 100) {
                        foundNext = true;
                        finalNextIndex = i;
                        console.log('找到未完成的课程：', nextCourse.title);
                        break;
                    }
                }
            } else {
                // 不跳过已完成视频，直接播放下一个
                console.log('未启用跳过已完成视频，直接播放下一个');
                if (nextIndex < courseList.length) {
                    foundNext = true;
                    finalNextIndex = nextIndex;
                    console.log('直接播放下一个课程，索引：', finalNextIndex);
                }
            }
            
            if (foundNext && finalNextIndex !== -1) {
                console.log('返回下一个课程：', courseList[finalNextIndex].title);
                return courseList[finalNextIndex];
            } else {
                console.log('没有找到下一个视频，所有视频都已完成或已播放完所有视频');
            }
        } else {
            console.log('无法确定当前课程位置，无法自动播放下一个课程');
        }
        
        return null;
    }
    
    // 显示视频播放页面的结束倒计时弹框
    function showVideoEndCountdown(nextCourse) {
        // 检查是否已存在弹框，如果存在则移除
        let countdownDialog = document.getElementById('video-end-countdown');
        if (countdownDialog) {
            countdownDialog.remove();
        }
        
        // 创建弹框容器
        countdownDialog = document.createElement('div');
        countdownDialog.id = 'video-end-countdown';
        countdownDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            color: #333333;
            padding: 25px 30px;
            border-radius: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 9999999;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(200, 200, 200, 0.3);
            text-align: center;
            min-width: 350px;
            animation: entrance 0.5s ease-out;
        `;
        
        // 创建标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
        `;
        title.textContent = '本视频播放完毕';
        countdownDialog.appendChild(title);
        
        // 创建课程信息
        const courseInfo = document.createElement('div');
        courseInfo.style.cssText = `
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 20px;
            line-height: 1.5;
        `;
        courseInfo.innerHTML = `即将播放：<br><strong style="color: #667eea;">${nextCourse.title}</strong>`;
        countdownDialog.appendChild(courseInfo);
        
        // 创建倒计时显示
        const countdownDisplay = document.createElement('div');
        countdownDisplay.id = 'countdown-timer';
        countdownDisplay.style.cssText = `
            font-size: 48px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 25px;
            text-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
        `;
        countdownDisplay.textContent = CONFIG.AUTO_PLAY_DELAY;
        countdownDialog.appendChild(countdownDisplay);
        
        // 创建提示信息
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 13px;
            color: #718096;
            margin-bottom: 20px;
        `;
        message.textContent = '倒计时结束后将自动播放下一节视频';
        countdownDialog.appendChild(message);
        
        // 创建立即播放按钮
        const playNowButton = document.createElement('button');
        playNowButton.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            margin-right: 10px;
        `;
        playNowButton.textContent = '立即播放';
        playNowButton.addEventListener('click', () => {
            clearInterval(countdownInterval);
            countdownDialog.remove();
            // 用户主动点击，在本标签打开新视频
            window.location.href = nextCourse.playUrl;
            // 关闭当前视频页
            // window.close();
        });
        countdownDialog.appendChild(playNowButton);
        
        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.style.cssText = `
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
            color: #4a5568;
            border: none;
            padding: 10px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(100, 100, 100, 0.1);
        `;
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', () => {
            clearInterval(countdownInterval);
            countdownDialog.remove();
        });
        countdownDialog.appendChild(cancelButton);
        
        // 添加到页面
        document.body.appendChild(countdownDialog);
        
        // 开始倒计时
        let remainingSeconds = CONFIG.AUTO_PLAY_DELAY;
        const countdownInterval = setInterval(() => {
            remainingSeconds--;
            countdownDisplay.textContent = remainingSeconds;
            
            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                countdownDialog.remove();
                // 倒计时结束，尝试打开下一个视频
                setTimeout(() => {
                    try {
                        // 在本标签打开新视频
                        window.location.href = nextCourse.playUrl;
                        // 关闭当前视频页
                        // window.close();
                    } catch (error) {
                        console.error('打开新标签页失败:', error);
                        alert('打开新标签页失败，请手动点击\'立即播放\'按钮');
                    }
                }, 100);
            }
        }, 1000);
    }
    
    // 结束倒计时
    function endCountdown() {
        cancelCountdown();
        console.log('倒计时结束，准备处理视频完成');
        
        // 标记课程已完成
        isCourseCompleted = true;
        
        // 直接将当前课程进度设置为100%并保存到本地存储
        sendProgressUpdateMessage(100);
        
        // 发送视频完成消息
        sendVideoCompletedMessage();
        
        // 在视频播放页面显示下一节播放提示
        if (currentPageType === 'videoPlay') {
            const nextCourse = findNextCourse();
            if (nextCourse) {
                console.log('将播放下一个课程：', nextCourse.title);
                showVideoEndCountdown(nextCourse);
            } else {
                console.log('已播放完所有课程或没有找到下一个未完成的课程');
                // 显示课程完成提示
                showCourseCompletedMessage();
            }
        }
        
        console.log('视频完成消息已发送，调试阶段不自动关闭标签页');
    }

    // 格式化秒数为分钟和秒的格式
    function formatSeconds(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}分${secs}秒`;
    }

    // 生成指定范围内的随机数（毫秒）
    function getRandomMs(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 从URL列表中随机选择一个URL
    function getRandomUrl() {
        const urls = CONFIG.SESSION_KEEPALIVE_URLS;
        const randomIndex = Math.floor(Math.random() * urls.length);
        return urls[randomIndex];
    }

    // 发送会话保持请求
    function sendSessionKeepaliveRequest(url, urlDesc) {
        // 获取当前页面的referer
        const referer = window.location.href;
        
        // url和urlDesc由调用方传入，确保日志显示与实际请求一致
        
        // 构建请求头
        const headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Referer': referer,
            'User-Agent': navigator.userAgent
        };
        
        // 根据配置决定是否显示详细日志
        if (CONFIG.LOG_LEVEL === 'full') {
            // 显示详细请求信息
            console.log('=== 会话保持请求详情 ===');
            console.log(`请求URL：${url}（${urlDesc}）`);
            console.log(`请求方法：GET`);
            console.log(`请求凭据模式：include`);
            console.log(`当前页面Referer：${referer}`);
            console.log(`请求头：`, JSON.stringify(headers, null, 2));
        }
        
        // 发送GET请求到选定的页面，保持会话活跃
        fetch(url, {
            method: 'GET',
            credentials: 'include', // 包含当前域名的所有cookie
            headers: headers
        }).then(response => {
            // 根据配置决定是否显示详细日志
            if (CONFIG.LOG_LEVEL === 'full') {
                console.log('=== 会话保持响应详情 ===');
                console.log(`请求URL：${url}（${urlDesc}）`);
                console.log(`响应状态码：${response.status}`);
                console.log(`响应状态文本：${response.statusText}`);
                console.log(`响应头：`, JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
            }
            
            // 总是显示重要的成功/失败日志
            if (response.ok) {
                console.log(`✅  请求【${urlDesc}】成功`);
            } else {
                console.log(`❌  请求【${urlDesc}】失败`);
            }
            
            // 请求完成后，启动下一次会话保持定时器
            startSessionKeepalive();
        }).catch(error => {
            // 根据配置决定是否显示详细日志
            if (CONFIG.LOG_LEVEL === 'full') {
                console.log('=== 会话保持请求错误 ===');
                console.log(`请求URL：${url}（${urlDesc}）`);
                console.log(`错误信息：`, error);
            }
            
            // 总是显示重要的错误日志
            console.log(`❌  请求【${urlDesc}】发生错误：`, error);
            
            // 请求完成后，启动下一次会话保持定时器
            startSessionKeepalive();
        });
    }

    // 启动会话保持定时器
    function startSessionKeepalive() {
        // 将配置的秒转换为毫秒
        const minMs = CONFIG.SESSION_KEEPALIVE_MIN * 1000;
        const maxMs = CONFIG.SESSION_KEEPALIVE_MAX * 1000;
        
        // 生成随机间隔时间（毫秒）
        const intervalMs = getRandomMs(minMs, maxMs);
        const intervalSeconds = Math.round(intervalMs / 1000);
        
        // 计算下次执行的具体时间
        const nextExecutionTime = new Date();
        nextExecutionTime.setMilliseconds(nextExecutionTime.getMilliseconds() + intervalMs);
        
        // 格式化时间显示
        const timeStr = nextExecutionTime.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // 提前选择下一次要请求的URL
        const randomIndex = Math.floor(Math.random() * CONFIG.SESSION_KEEPALIVE_URLS.length);
        const url = CONFIG.SESSION_KEEPALIVE_URLS[randomIndex];
        
        // 获取URL的描述信息
        const urlDesc = {
            'http://www.cmatc.cn/lms/app/lms/student/Userdashboardinfo/show.do': '学院首页页面',
            'http://www.cmatc.cn/lms/app/lms/lesson/Lesson/lookupLessonlist.do': '资源中心页面',
            'http://www.cmatc.cn/lms/app/tms/sfi/StudyContent/year.do': '个人中心页面',
            'http://www.cmatc.cn/lms/app/appsecurity/user/Student/self.do': '个人信息页面'
        }[url] || '未知页面';
        
        // 使用新的日志格式
        console.log(`将在 ${intervalSeconds} 秒后${timeStr} 请求【${urlDesc}】`);
        
        // 设置定时器
        setTimeout(() => {
            // 发送会话保持请求，传递选定的URL
            sendSessionKeepaliveRequest(url, urlDesc);
        }, intervalMs);
    }

    // 初始化视频元素
    function initVideoElement() {
        // 如果视频元素不存在，尝试查找
        if (!videoElement) {
            videoElement = findVideoElement();
        }
        
        if (videoElement) {
            // 设置静音
            if (!videoElement.muted) {
                videoElement.muted = true;
            }
            
            // 尝试自动播放
            try {
                if (videoElement.paused) {
                    videoElement.play().catch(error => {
                        // 忽略播放失败的错误
                    });
                }
            } catch (error) {
                // 忽略播放错误
            }
            
            // 确保不重复添加事件监听器
            if (!videoElement.hasEventListenersAdded) {
                // 标记事件监听器已添加
                videoElement.hasEventListenersAdded = true;

                // 监听视频加载完成事件，获取准确时长
                videoElement.addEventListener('loadedmetadata', () => {
                    videoDuration = videoElement.duration;
                    
                    // 确保视频静音
                    if (!videoElement.muted) {
                        videoElement.muted = true;
                    }
                    
                    // 视频加载完成后自动开始倒计时
                    startCountdown();
                    // 更新视频信息显示
                    updateVideoInfo();
                    
                    // 只显示关键信息：视频查找成功、时长、静音状态
                    console.log(`视频查找成功，时长：${formatTime(videoDuration)}，已设置静音`);
                });
                
                // 监听视频播放进度变化事件，同时更新视频信息
                videoElement.addEventListener('timeupdate', () => {
                    handlePlaybackProgressChange();
                    updateVideoInfo();
                });
                
                // 监听视频播放事件，确保倒计时启动和静音
                videoElement.addEventListener('play', () => {
                    // 确保视频静音
                    if (!videoElement.muted) {
                        videoElement.muted = true;
                    }
                    
                    if (videoElement.duration > 0 && !isCountdownRunning) {
                        startCountdown();
                    }
                    // 更新视频信息显示
                    updateVideoInfo();
                });
                
                // 监听视频结束事件
                videoElement.addEventListener('ended', () => {
                    isVideoEnded = true;
                    countdownStartTime = Date.now();
                    
                    // 检测是否为多视频页面
                    checkMultiVideoPage(videoElement);
                });
            }
            
            // 立即检查视频是否已加载完成
            if (videoElement.duration > 0) {
                videoDuration = videoElement.duration;
                if (!isCountdownRunning) {
                    startCountdown();
                }
            }
            
            // 立即更新视频信息和倒计时显示
            updateVideoInfo();
            updateCountdown();
        }
    }
    
    // 检测是否为多视频页面
    function checkMultiVideoPage(video) {
        // 检查是否存在章节目录元素
        const introdiv = document.getElementById('introdiv');
        if (introdiv) {
            // 检测到多视频页面，检查当前播放的是否为最后一个视频
            checkIfLastVideo(video);
        } else {
            // 单视频页面，直接标记课程完成
            completeCourse();
        }
    }
    
    // 检查当前播放的是否为最后一个视频
    function checkIfLastVideo(video) {
        // 获取章节目录列表
        const playerlist = document.getElementById('playerlist');
        if (!playerlist) {
            // 未找到章节目录列表，按单视频处理
            completeCourse();
            return;
        }
        
        // 获取所有视频章节
        const videoChapters = playerlist.querySelectorAll('li');
        
        // 获取当前正在播放的视频索引
        let currentIndex = -1;
        
        // 查找显示播放图标的视频（display: inline）
        for (let i = 0; i < videoChapters.length; i++) {
            const chapter = videoChapters[i];
            const img = chapter.querySelector('img.dhimg');
            if (img && img.style.display === 'inline') {
                currentIndex = i;
                break;
            }
        }
        
        // 或者通过id解析索引
        if (currentIndex === -1) {
            for (let i = 0; i < videoChapters.length; i++) {
                const chapter = videoChapters[i];
                if (chapter.id.startsWith('vli_')) {
                    const index = parseInt(chapter.id.replace('vli_', ''));
                    // 检查是否有其他标记
                    if (chapter.style.fontWeight === 'bold' || chapter.style.color === 'red') {
                        currentIndex = index;
                        break;
                    }
                }
            }
        }
        
        // 检查是否为最后一个视频
        if (currentIndex === videoChapters.length - 1) {
            // 当前视频是最后一个视频，所有视频播放完毕
            completeCourse();
        } else {
            // 还有后续视频，等待自动播放
            waitForNextVideo();
        }
    }
    
    // 等待下一个视频开始播放
    function waitForNextVideo() {
        // 重新初始化视频元素，等待下一个视频加载
        setTimeout(() => {
            initVideoElement();
        }, 2000);
    }
    
    // 完成课程处理
    function completeCourse() {
        // 标记课程已完成
        isCourseCompleted = true;
        
        // 直接将当前课程进度设置为100%并保存到本地存储
        sendProgressUpdateMessage(100);
        
        // 发送视频完成消息
        sendVideoCompletedMessage();
    }

    // 显示日志到右侧日志框
    function displayConsoleLog(...args) {
        // 获取当前时间
        const now = new Date();
        const timeDisplay = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // 格式化日志内容
        let logString = args.join(' ');

        // 移除日志末尾可能的行号信息（如：recordLearnTime.do:16:10）
        logString = logString.replace(/\s+\S+:\d+:\d+$/g, '');

        let finalLog = null;
        let isLearnTimeLog = false;
        let seconds = 0;

        // 处理_submitLearnTime日志
        if (logString.includes('=========_submitLearnTime')) {
            if (CONFIG.SHOW_LEARN_TIME_LOGS) {
                const timeMatch = logString.match(/learntime====([^\s]+)/);
                if (timeMatch && timeMatch[1]) {
                    seconds = parseInt(timeMatch[1]);
                    const newTotalTime = totalLearntime + seconds;
                    
                    // 计算进度百分比
                    const progress = Math.min(100, Math.floor((newTotalTime / videoDuration) * 100));
                    
                    let logSuffix = '';
                    // 检查累计时长是否超过视频时长
                    if (videoDuration > 0 && newTotalTime >= videoDuration) {
                        logSuffix = ' （视频已播放完毕，可以立即结束播放）';
                        // 学习时长已超过视频总时长，发送视频完成消息
                        console.log('学习时长已超过视频总时长，发送视频完成消息');
                        sendVideoCompletedMessage();
                    }
                    finalLog = `提交学习时长 ${formatSeconds(seconds)}，累计 ${formatSeconds(newTotalTime)}，进度 ${progress}%${logSuffix}`;
                    isLearnTimeLog = true;
                }
            }
        }

        // 处理completed日志（学习时长相关）
        else if (logString.includes('completed')) {
            if (CONFIG.SHOW_LEARN_TIME_LOGS) {
                const timeMatch = logString.match(/time====([^\s]+)/);
                if (timeMatch && timeMatch[1]) {
                    seconds = parseInt(timeMatch[1]);
                    const newTotalTime = totalLearntime + seconds;
                    
                    // 计算进度百分比
                    const progress = Math.min(100, Math.floor((newTotalTime / videoDuration) * 100));
                    
                    let logSuffix = '';
                    // 检查累计时长是否超过视频时长
                    if (videoDuration > 0 && newTotalTime >= videoDuration) {
                        logSuffix = ' （视频已播放完毕，可以立即结束播放）';
                        // 学习时长已超过视频总时长，发送视频完成消息
                        console.log('学习时长已超过视频总时长，发送视频完成消息');
                        sendVideoCompletedMessage();
                    }
                    finalLog = `完成学习时长计算，总计 ${formatSeconds(seconds)}，累计 ${formatSeconds(newTotalTime)}，进度 ${progress}%${logSuffix}`;
                    isLearnTimeLog = true;
                }
            }
        }

        // 处理其他所有日志（控制台日志）
        else {
            // 检查是否为会话保持相关的日志
            // 1. 定时器启动日志：将在 X秒后XX:XX:XX 请求【XXX】
            // 2. 请求结果日志：✅  请求【XXX】成功/失败
            const isTimerLog = logString.includes('将在') && logString.includes('请求【');
            const isResultLog = logString.startsWith('✅  请求【') || logString.startsWith('❌  请求【');
            const isSessionKeepaliveLog = isTimerLog || isResultLog;
            
            // 检查是否为配置变更日志
            const isConfigLog = logString.includes('已切换为') || 
                               logString.includes('已更新为');
            
            if (isSessionKeepaliveLog) {
                // 请求结果日志在所有模式下都显示，定时器日志只在完整日志模式下显示
                if (CONFIG.LOG_LEVEL === 'full' || isResultLog) {
                    finalLog = logString;
                    isLearnTimeLog = false;
                }
            } else if (isConfigLog) {
                // 配置变更日志在所有模式下都显示
                finalLog = logString;
                isLearnTimeLog = false;
            } else if (CONFIG.LOG_LEVEL === 'full') {
                // 非会话保持、非配置变更日志只在完整日志模式下显示
                finalLog = logString;
                isLearnTimeLog = false;
            }
        }

        // 如果最终没有要显示的日志，直接返回
        if (!finalLog) {
            return;
        }

        // 日志去重：只对完全相同的日志进行去重，不同时间戳的日志都应显示
        const nowTime = Date.now();

        // 检查是否为重复日志（完全相同的内容且时间间隔极短）
        if (logString === lastLogContent && nowTime - lastLogTime < 1000) {
            return; // 1秒内完全相同的日志不重复记录
        }

        // 更新累计时长（仅对学习时长日志）
        if (isLearnTimeLog) {
            totalLearntime += seconds;
            
            // 计算进度百分比
            const progress = Math.min(100, Math.floor((totalLearntime / videoDuration) * 100));
            
            // 每次进度更新时都保存进度到本地存储
            sendProgressUpdateMessage(progress);
            
            // 检查是否播放完毕
            if (videoDuration > 0 && totalLearntime >= videoDuration) {
                console.log('学习时长已超过视频总时长，准备发送视频完成消息');
                
                // 发送视频完成消息
                sendVideoCompletedMessage();
                
                // 标记课程已完成
                isCourseCompleted = true;
                
                // 触发播放下一节视频逻辑
                const nextCourse = findNextCourse();
                if (nextCourse) {
                    console.log('将播放下一个课程：', nextCourse.title);
                    showVideoEndCountdown(nextCourse);
                } else {
                    console.log('已播放完所有课程或没有找到下一个未完成的课程');
                    // 显示课程完成提示
                    showCourseCompletedMessage();
                }
            }
        }

        // 更新最后日志信息
        lastLogTime = nowTime;
        lastLogContent = logString;

        // 获取日志区域
        const logArea = document.getElementById('learn-time-log');
        if (!logArea) return; // 日志区域不存在，跳过

        // 创建日志条目
        const logEntry = document.createElement('div');

        // 设置统一的日志样式，去掉不同颜色和晃动效果
        logEntry.style.cssText = `
            margin: 4px 0;
            padding: 5px 8px;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.85);
            color: #333333;
            font-size: 12px;
            text-align: left;
            line-height: 1.5;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
        `;
        
        // 移除悬停效果，避免晃动
        logEntry.onmouseenter = function() {
            this.style.background = 'rgba(245, 245, 245, 0.9)';
        };
        
        logEntry.onmouseleave = function() {
            this.style.background = 'rgba(255, 255, 255, 0.85)';
        };

        logEntry.textContent = `${timeDisplay} - ${finalLog}`;

        // 添加到日志区域
        logArea.appendChild(logEntry);

        // 滚动到底部，显示最新日志
        logArea.scrollTop = logArea.scrollHeight;

        // 限制日志数量，最多保留50条
        const logEntries = logArea.querySelectorAll('div');
        if (logEntries.length > 51) { // 50条日志 + 1条标题
            // 只移除最旧的1条日志，避免清空大量日志
            logEntries[1].remove();
        }
    }

    // 重写指定window对象的console方法
    function overrideConsoleMethods(windowObj) {
        // 保存原始console方法
        const originalLog = windowObj.console.log;
        const originalWarn = windowObj.console.warn;
        const originalError = windowObj.console.error;
        const originalInfo = windowObj.console.info;

        // 重写console.log
        windowObj.console.log = function() {
            originalLog.apply(windowObj.console, arguments);
            displayConsoleLog.apply(this, arguments);
        };

        // 重写console.warn
        windowObj.console.warn = function() {
            originalWarn.apply(windowObj.console, arguments);
            displayConsoleLog.apply(this, arguments);
        };

        // 重写console.error
        windowObj.console.error = function() {
            originalError.apply(windowObj.console, arguments);
            displayConsoleLog.apply(this, arguments);
        };

        // 重写console.info
        windowObj.console.info = function() {
            originalInfo.apply(windowObj.console, arguments);
            displayConsoleLog.apply(this, arguments);
        };
    }

    // 拦截AJAX请求，捕获学习时长提交
    function interceptAjaxRequests() {
        // 保存原始XMLHttpRequest
        const originalXHR = XMLHttpRequest;

        // 重写XMLHttpRequest
        XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;

            // 重写open方法，记录请求URL
            xhr.open = function() {
                this._url = arguments[1];
                return originalOpen.apply(this, arguments);
            };

            // 重写send方法，检查请求参数
            xhr.send = function(data) {
                // 检查是否是学习时长提交请求
                if (this._url && this._url.includes('recordLearnTimePro.do')) {
                    // 尝试解析请求数据
                    if (typeof data === 'string') {
                        const learnTimeMatch = data.match(/learntime=(\d+)/);
                        if (learnTimeMatch && learnTimeMatch[1]) {
                            const seconds = parseInt(learnTimeMatch[1]);
                            // 去重检查：只对完全相同的请求进行去重，不同时间的请求都应显示
                            const nowTime = Date.now();
                            // 使用原始请求数据作为去重依据，不包含累计时间
                            const originalRequestKey = data;

                            // 只有完全相同的内容且时间间隔极短才视为重复
                                if (!(originalRequestKey === lastLogContent && nowTime - lastLogTime < 1000)) {
                                    // 更新累计时长
                                    totalLearntime += seconds;
                                    
                                    // 计算进度百分比
                                    const progress = Math.min(100, Math.floor((totalLearntime / videoDuration) * 100));
                                    
                                    // 检查累计时长是否超过视频时长
                                    let logSuffix = '';
                                    if (videoDuration > 0 && totalLearntime >= videoDuration) {
                                        logSuffix = ' （视频已播放完毕，可以立即结束播放）';
                                    }
                                    // 构造日志内容，添加进度百分比
                                    const logContent = `提交学习时长 ${formatSeconds(seconds)}，累计 ${formatSeconds(totalLearntime)}，进度 ${progress}%${logSuffix}`;

                                    // 直接显示学习时长提交日志
                                    const now = new Date();
                                    const timeDisplay = now.toLocaleTimeString('zh-CN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    });

                                    const logArea = document.getElementById('learn-time-log');
                                    if (logArea) {
                                        const logEntry = document.createElement('div');
                                        logEntry.style.cssText = `
                                            margin: 4px 0;
                                            padding: 5px 8px;
                                            border-radius: 6px;
                                            background: linear-gradient(135deg, rgba(220, 218, 212, 0.8), rgba(200, 198, 192, 0.6));
                                            color: #000000;
                                            font-size: 12px;
                                            text-align: left;
                                            line-height: 1.5;
                                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                                            transition: all 0.2s ease;
                                        `;
                                        logEntry.onmouseenter = function() {
                                            this.style.background = 'linear-gradient(135deg, rgba(200, 198, 192, 0.9), rgba(180, 178, 172, 0.7));';
                                            this.style.transform = 'translateX(2px)';
                                        };
                                        
                                        logEntry.onmouseleave = function() {
                                            this.style.background = 'linear-gradient(135deg, rgba(220, 218, 212, 0.8), rgba(200, 198, 192, 0.6))';
                                            this.style.transform = 'translateX(0)';
                                        };
                                        logEntry.textContent = `${timeDisplay} - ${logContent}`;
                                        logArea.appendChild(logEntry);
                                        logArea.scrollTop = logArea.scrollHeight;

                                        // 更新最后日志信息，使用原始请求数据作为去重依据
                                        lastLogTime = nowTime;
                                        lastLogContent = originalRequestKey;

                                        // 限制日志数量，最多保留50条
                                        const logEntries = logArea.querySelectorAll('div');
                                        if (logEntries.length > 51) { // 50条日志 + 1条标题
                                            // 只移除最旧的1条日志
                                            logEntries[1].remove();
                                        }
                                    }
                                    
                                    // 当进度达到100%时，触发播放下一节视频逻辑
                                    if (videoDuration > 0 && totalLearntime >= videoDuration) {
                                        console.log('真实学习时长已超过视频总时长，触发下一节视频播放');
                                        
                                        // 发送视频完成消息
                                        sendVideoCompletedMessage();
                                        
                                        // 标记课程已完成
                                        isCourseCompleted = true;
                                        
                                        // 触发播放下一节视频逻辑
                                        const nextCourse = findNextCourse();
                                        if (nextCourse) {
                                            console.log('将播放下一个课程：', nextCourse.title);
                                            showVideoEndCountdown(nextCourse);
                                        } else {
                                            console.log('已播放完所有课程或没有找到下一个未完成的课程');
                                            // 显示课程完成提示
                                            showCourseCompletedMessage();
                                        }
                                    }
                                }
                        }
                    }
                }
                return originalSend.apply(this, arguments);
            };

            return xhr;
        };

        XMLHttpRequest.prototype = originalXHR.prototype;
        XMLHttpRequest.DONE = originalXHR.DONE;
    }

    // 监听控制台日志，显示所有日志
    function initConsoleListener() {
        // 重写主窗口的console方法
        overrideConsoleMethods(window);

        // 定期检查并重写iframe的console方法
        setInterval(() => {
            try {
                // 检查主窗口的contentFrame
                if (window.parent && window.parent.contentFrame) {
                    overrideConsoleMethods(window.parent.contentFrame);
                }

                // 检查所有iframe
                const iframes = document.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    try {
                        if (iframe.contentWindow) {
                            overrideConsoleMethods(iframe.contentWindow);
                        }
                    } catch (e) {
                        // 跨域iframe无法访问，忽略
                    }
                });
            } catch (e) {
                // 忽略可能的跨域错误
            }
        }, 3000);

        // 拦截AJAX请求，捕获学习时长提交
        interceptAjaxRequests();
    }
    
    // 课程列表页面相关函数
    
    // 创建右侧课程列表面板
    function createCoursePanel() {
        // 检查面板是否已存在
        let panel = document.getElementById('course-list-panel');
        if (panel) {
            // 清空现有内容
            panel.innerHTML = '';
            return panel;
        }
        
        // 创建面板容器
        panel = document.createElement('div');
        panel.id = 'course-list-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 320px;
            max-height: 90vh;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(200, 200, 200, 0.3);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
        `;
        
        // 创建面板标题
        const title = document.createElement('div');
        title.style.cssText = `
            padding: 15px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
        `;
        title.textContent = '课程列表';
        panel.appendChild(title);
        
        // 创建课程列表容器
        const courseListContent = document.createElement('div');
        courseListContent.id = 'course-list-content';
        courseListContent.style.cssText = `
            padding: 15px;
            max-height: calc(90vh - 60px);
            overflow-y: auto;
        `;
        panel.appendChild(courseListContent);
        
        // 添加到页面
        document.body.appendChild(panel);
        
        return panel;
    }
    
    // 添加课程项到右侧面板，使用唯一标识符
    function addCourseToPanel(courseInfo) {
        const courseListContent = document.getElementById('course-list-content');
        if (!courseListContent) return;
        
        // 创建课程项容器
        const courseItem = document.createElement('div');
        courseItem.style.cssText = `
            margin-bottom: 12px;
            padding: 12px;
            background: rgba(245, 245, 245, 0.8);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid rgba(200, 200, 200, 0.2);
        `;
        // 设置唯一标识符：lessonId、coursewareId、lessonGkey
        courseItem.setAttribute('data-lesson-id', courseInfo.lessonId);
        courseItem.setAttribute('data-courseware-id', courseInfo.coursewareId);
        courseItem.setAttribute('data-lesson-gkey', courseInfo.lessonGkey);
        // 保留原有的data-course-id以便兼容
        courseItem.setAttribute('data-course-id', courseInfo.lessonId);
        
        // 添加悬停效果
        courseItem.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(230, 230, 230, 0.9)';
            this.style.transform = 'translateX(-5px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
        
        courseItem.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(245, 245, 245, 0.8)';
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });
        
        // 添加点击事件：在新标签打开视频播放页
        courseItem.addEventListener('click', function() {
            // 保存当前课程索引，用于自动播放
            GM_setValue('currentCourseIndex', courseInfo.index);
            window.open(courseInfo.playUrl, '_blank');
            console.log(`已在新标签打开课程：${courseInfo.title}`);
        });
        
        // 创建课程标题
        const courseTitle = document.createElement('div');
        courseTitle.style.cssText = `
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            margin-bottom: 6px;
            line-height: 1.4;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        courseTitle.textContent = courseInfo.title;
        courseItem.appendChild(courseTitle);
        
        // 创建学习时长和进度条容器
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            margin: 8px 0;
            font-size: 11px;
        `;
        
        // 创建学习时长显示
        const learnTimeDisplay = document.createElement('div');
        learnTimeDisplay.className = 'learn-time-display';
        learnTimeDisplay.style.cssText = `
            color: #666666;
            margin-bottom: 4px;
        `;
        learnTimeDisplay.textContent = '学习时长：--:-- / --:--';
        progressContainer.appendChild(learnTimeDisplay);
        
        // 创建进度条容器
        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.cssText = `
            height: 6px;
            background: rgba(200, 200, 200, 0.5);
            border-radius: 3px;
            overflow: hidden;
        `;
        
        // 创建进度条
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
            width: ${courseInfo.progress || 0}%;
            transition: width 0.3s ease;
            border-radius: 3px;
        `;
        progressBarContainer.appendChild(progressBar);
        progressContainer.appendChild(progressBarContainer);
        
        // 创建进度百分比显示
        const progressPercentage = document.createElement('div');
        progressPercentage.className = 'progress-percentage';
        progressPercentage.style.cssText = `
            color: #667eea;
            font-weight: 500;
            margin-top: 2px;
            text-align: right;
            font-size: 10px;
        `;
        progressPercentage.textContent = `${courseInfo.progress || 0}%`;
        progressContainer.appendChild(progressPercentage);
        
        courseItem.appendChild(progressContainer);
        
        // 创建课程信息行
        const courseInfoRow = document.createElement('div');
        courseInfoRow.style.cssText = `
            font-size: 11px;
            color: #666666;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
        `;
        
        // 创建序号
        const courseNumber = document.createElement('span');
        courseNumber.textContent = `第 ${courseInfo.index + 1} 节`;
        courseNumber.style.cssText = `
            padding: 2px 6px;
            background: rgba(102, 126, 234, 0.2);
            color: #667eea;
            border-radius: 4px;
            font-weight: 500;
        `;
        courseInfoRow.appendChild(courseNumber);
        
        // 创建播放图标
        const playIcon = document.createElement('span');
        playIcon.innerHTML = '▶';
        playIcon.style.cssText = `
            color: #667eea;
            font-size: 12px;
            margin-left: 8px;
        `;
        courseInfoRow.appendChild(playIcon);
        
        courseItem.appendChild(courseInfoRow);
        
        // 添加到课程列表
        courseListContent.appendChild(courseItem);
    }
    
    // 主函数：获取课程列表并构建播放URL
    function getCourseList() {
        console.log('=== 开始获取课程列表 ===');
        
        // 清空全局课程列表，避免重复添加
        courseList = [];
        
        // 尝试多种选择器匹配课程列表，只保留包含学习按钮的有效课程项
        let courseItems = [];
        
        // 1. 查找所有学习按钮
        const allLearnButtons = document.querySelectorAll('.learn');
        console.log(`找到 ${allLearnButtons.length} 个学习按钮`);
        
        if (allLearnButtons.length > 0) {
            // 遍历每个学习按钮，找到其对应的课程行
            courseItems = Array.from(allLearnButtons).map(button => {
                // 找到按钮所在的课程行（tr元素）
                let courseRow = button.parentElement;
                
                // 向上查找，直到找到tr元素或达到根元素
                while (courseRow && courseRow.tagName.toLowerCase() !== 'tr') {
                    courseRow = courseRow.parentElement;
                    // 防止无限循环
                    if (!courseRow) break;
                }
                
                return courseRow;
            }).filter(Boolean); // 过滤掉null值
            
            console.log(`通过学习按钮关联找到 ${courseItems.length} 个课程行`);
        }
        
        // 2. 如果没有找到课程行，尝试直接从学习按钮构建课程项
        if (courseItems.length === 0 && allLearnButtons.length > 0) {
            courseItems = Array.from(allLearnButtons).map(button => {
                // 获取按钮所在的单元格（td）
                const td = button.parentElement;
                if (td && td.tagName.toLowerCase() === 'td') {
                    // 查找同一行的标题单元格
                    const tr = td.parentElement;
                    if (tr && tr.tagName.toLowerCase() === 'tr') {
                        // 获取第一个td（标题单元格）
                        const titleTd = tr.querySelector('td:first-child');
                        if (titleTd) {
                            const title = titleTd.textContent.trim();
                            return { title: title, button: button };
                        }
                    }
                }
                return null;
            }).filter(Boolean); // 过滤掉null值
            
            console.log(`通过直接构建找到 ${courseItems.length} 个课程项`);
        }
        
        // 去重处理：确保每个课程项唯一
        const uniqueCourseItems = [];
        const processedButtons = new Set();
        
        courseItems.forEach(item => {
            // 获取学习按钮
            let button;
            if (item.button) {
                // 自定义对象类型
                button = item.button;
            } else if (item.querySelector) {
                // DOM元素类型
                button = item.querySelector('.learn');
            }
            
            // 确保按钮存在且未被处理过
            if (button && !processedButtons.has(button)) {
                processedButtons.add(button);
                uniqueCourseItems.push(item);
            }
        });
        
        courseItems = uniqueCourseItems;
        console.log(`去重后剩余 ${courseItems.length} 个有效课程项`);
        
        if (courseItems.length === 0) {
            console.error('未找到课程列表');
            console.log('页面HTML结构预览：', document.body.innerHTML.substring(0, 1000) + '...');
            return;
        }
        
        console.log(`共找到 ${courseItems.length} 个课程项`);
        
        // 遍历课程项，获取课程信息
        courseItems.forEach((item, index) => {
            let courseTitle = '未知课程';
            let learnButton = null;
            
            // 处理不同类型的课程项
            if (item.title && item.button) {
                // 自定义对象类型
                courseTitle = item.title;
                learnButton = item.button;
            } else if (item.querySelector) {
                // DOM元素类型
                // 获取学习按钮
                learnButton = item.querySelector('.learn');
                
                // 直接从学习按钮所在行的td:first-child中的a标签获取课程标题
                const titleCell = item.querySelector('td:first-child');
                if (titleCell) {
                    const courseLink = titleCell.querySelector('a');
                    if (courseLink) {
                        courseTitle = courseLink.textContent.trim();
                    }
                }
            }
            
            if (!learnButton) {
                console.log(`课程 ${index + 1}：${courseTitle} - 未找到学习按钮`);
                return;
            }
            
            // 获取onclick事件中的startLesson函数调用
            const onclickAttr = learnButton.getAttribute('onclick');
            if (!onclickAttr) {
                console.log(`课程 ${index + 1}：${courseTitle} - 学习按钮无onclick事件`);
                return;
            }
            
            // 解析startLesson函数的参数
            // 匹配模式：startLesson(lessonId,coursewareId,'lessonGkey')
            const paramMatch = onclickAttr.match(/startLesson\((\d+),([^,]+),['"]([^'"]+)['"]\)/);
            if (!paramMatch) {
                console.log(`课程 ${index + 1}：${courseTitle} - 无法解析startLesson参数，onclick: ${onclickAttr}`);
                return;
            }
            
            const lessonId = paramMatch[1];
            const coursewareId = paramMatch[2].trim();
            const lessonGkey = paramMatch[3];
            
            // 构建视频播放页面URL
            const playUrl = `http://www.cmatc.cn/lms/app/lms/student/Learn/enter.do?lessonId=${lessonId}&coursewareId=${coursewareId}&lessonGkey=${lessonGkey}&tclessonId=0&lessonOrigin=selflearn`;
            
            // 每次刷新页面都从页面获取原有进度
            let actualProgress = 0;
            
            // 查找页面上的课件章节列表，跳过表头行
            const lessonRows = document.querySelectorAll('.table-list tr');
            
            // 遍历所有行，从第二行开始（跳过表头）
            for (let i = 1; i < lessonRows.length; i++) {
                const row = lessonRows[i];
                
                // 获取当前行的所有单元格
                const cells = row.querySelectorAll('td');
                if (cells.length < 3) continue; // 确保至少有3个单元格
                
                // 第一列：课程标题
                const titleCell = cells[0];
                const titleText = titleCell.textContent.trim();
                
                // 精确匹配课程标题，只匹配完全一致的标题
                // 或者匹配标题的前几个字符，确保能准确匹配
                if (titleText === courseTitle || titleText.startsWith(courseTitle.split(' ')[0])) {
                    // 第二列：进度信息
                    const progressCell = cells[1];
                    
                    // 从进度单元格的title属性获取进度
                    if (progressCell.title && progressCell.title.includes('%')) {
                        const titleMatch = progressCell.title.match(/(\d+)%/);
                        if (titleMatch && titleMatch[1]) {
                            actualProgress = parseInt(titleMatch[1]);
                            console.log(`从单元格title属性获取到课程 ${courseTitle} 进度：${actualProgress}%`);
                            break;
                        }
                    }
                    
                    // 从进度单元格的文本内容获取进度
                    const progressText = progressCell.textContent.trim();
                    if (progressText.includes('%')) {
                        const textMatch = progressText.match(/(\d+)%/);
                        if (textMatch && textMatch[1]) {
                            actualProgress = parseInt(textMatch[1]);
                            console.log(`从单元格文本获取到课程 ${courseTitle} 进度：${actualProgress}%`);
                            break;
                        }
                    }
                    
                    // 从进度条元素获取进度
                    const jinduBG = progressCell.querySelector('.jinduBG');
                    if (jinduBG) {
                        const jinduGreen = jinduBG.querySelector('.jindu_green');
                        if (jinduGreen) {
                            const widthStyle = jinduGreen.style.width;
                            if (widthStyle) {
                                const styleMatch = widthStyle.match(/(\d+)%/);
                                if (styleMatch && styleMatch[1]) {
                                    actualProgress = parseInt(styleMatch[1]);
                                    console.log(`从进度条样式获取到课程 ${courseTitle} 进度：${actualProgress}%`);
                                    break;
                                }
                            }
                        }
                    }
                    
                    console.log(`无法从页面获取课程 ${courseTitle} 进度，使用默认值 0%`);
                    break;
                }
            }
            
            // 从本地存储获取已保存的进度，使用唯一key：lessonId_coursewareId_lessonGkey
            const uniqueKey = `courseProgress_${lessonId}_${coursewareId}_${lessonGkey}`;
            const savedProgress = GM_getValue(uniqueKey, -1);
            
            // 刷新页面时，优先显示页面原有进度，不被本地存储覆盖
            // 只有在播放过程中更新的进度才会保存到本地存储
            let finalProgress = actualProgress;
            
            console.log(`课程 ${courseTitle} 页面进度：${actualProgress}%，本地存储进度：${savedProgress === -1 ? '无' : savedProgress}%，存储key：${uniqueKey}`);
            
            // 首次访问时，保存页面进度到本地存储
            if (savedProgress === -1) {
                GM_setValue(uniqueKey, actualProgress);
                console.log(`已将课程 ${courseTitle} 初始进度 ${actualProgress}% 保存到本地存储，存储key：${uniqueKey}`);
            }
            
            // 保存课程信息到全局列表
            const courseInfo = {
                index: index,
                title: courseTitle,
                lessonId: lessonId,
                coursewareId: coursewareId,
                lessonGkey: lessonGkey,
                playUrl: playUrl,
                progress: finalProgress
            };
            courseList.push(courseInfo);
            
            // 打印课程信息和播放URL
            console.log(`\n课程 ${index + 1}：`);
            console.log(`  标题：${courseTitle}`);
            console.log(`  lessonId：${lessonId}`);
            console.log(`  coursewareId：${coursewareId}`);
            console.log(`  lessonGkey：${lessonGkey}`);
            console.log(`  播放URL：${playUrl}`);
            console.log(`  页面原有进度：${actualProgress}%`);
            console.log(`  本地保存进度：${savedProgress}%`);
            console.log(`  最终显示进度：${finalProgress}%`);
            
            // 在原有学习按钮后添加自动学习按钮
            if (learnButton) {
                // 隐藏原有学习按钮
                learnButton.style.display = 'none';
                
                // 创建自动学习按钮
                const autoLearnButton = document.createElement('a');
                autoLearnButton.className = 'auto-learn';
                autoLearnButton.textContent = '自动学习';
                autoLearnButton.style.cssText = `
                    margin-left: 8px;
                    padding: 4px 8px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 4px;
                    text-decoration: none;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                `;
                
                // 添加悬停效果
                autoLearnButton.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-1px)';
                    this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                });
                
                autoLearnButton.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                });
                
                // 添加点击事件，新标签打开视频播放页面
                autoLearnButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    // 保存当前课程索引，用于自动播放
                    GM_setValue('currentCourseIndex', index);
                    // 在新标签打开视频播放页面
                    window.open(courseInfo.playUrl, '_blank');
                    console.log(`已在新标签打开自动学习课程：${courseTitle}`);
                });
                
                // 将自动学习按钮添加到原有学习按钮的父元素中
                learnButton.parentNode.insertBefore(autoLearnButton, learnButton.nextSibling);
            }
        });
        
        // 发送课程列表就绪消息
        sendCourseListReadyMessage();
        
        console.log('\n=== 课程列表获取完成 ===');
    }
    
    // 等待课程内容加载
    function waitForCourseContent() {
        console.log('=== 等待课程内容加载 ===');
        
        // 检查是否有课程列表
        const hasCourseList = document.querySelector('.table-list') || 
                             document.querySelectorAll('.learn').length > 0;
        
        if (hasCourseList) {
            getCourseList();
        } else {
            // 等待2秒后重试，最多重试5次
            let retryCount = 0;
            const maxRetries = 5;
            
            const retryInterval = setInterval(() => {
                retryCount++;
                console.log(`重试获取课程列表 (${retryCount}/${maxRetries})`);
                
                const hasCourseListNow = document.querySelector('.table-list') || 
                                      document.querySelectorAll('.learn').length > 0;
                
                if (hasCourseListNow || retryCount >= maxRetries) {
                    clearInterval(retryInterval);
                    if (hasCourseListNow) {
                        getCourseList();
                    } else {
                        console.error('超时未找到课程列表，尝试直接获取学习按钮');
                        // 直接尝试获取所有学习按钮
                        const learnButtons = document.querySelectorAll('.learn');
                        if (learnButtons.length > 0) {
                            console.log(`找到 ${learnButtons.length} 个学习按钮，尝试解析`);
                            getCourseList();
                        } else {
                            console.error('未找到任何学习按钮');
                        }
                    }
                }
            }, 2000);
        }
    }
    
    // 视频播放页面初始化
    function initVideoPlayPage() {
        console.log('视频播放页面初始化');
        
        // 初始化广播频道
        initBroadcastChannel();
        
        // 立即重写console方法，确保能捕获所有日志
        initConsoleListener();
        
        // 添加窗口关闭事件监听
        addWindowCloseListener();
        
        // 从本地存储读取课程列表，使用当前课程的lessonId作为前缀
        const currentUrl = window.location.href;
        const currentLessonId = currentUrl.match(/lessonId=(\d+)/)?.[1] || 'unknown';
        
        // 尝试使用当前lessonId读取课程列表
        const savedCourseList = GM_getValue(`courseList_${currentLessonId}`, null);
        if (savedCourseList) {
            try {
                courseList = JSON.parse(savedCourseList);
                
                // 从本地存储中恢复每个课程的进度
                courseList.forEach((course, index) => {
                    // 使用唯一key：lessonId_coursewareId_lessonGkey
                    const uniqueKey = `courseProgress_${course.lessonId}_${course.coursewareId}_${course.lessonGkey}`;
                    const savedProgress = GM_getValue(uniqueKey, -1);
                    if (savedProgress !== -1) {
                        course.progress = savedProgress;
                        console.log(`已从本地存储恢复课程 "${course.title}" 的进度为 ${savedProgress}%，存储key: ${uniqueKey}`);
                    }
                });
                
                updateCurrentCourseIndex();
                console.log('从本地存储读取课程列表，共', courseList.length, '个课程，存储key:', `courseList_${currentLessonId}`);
                console.log('课程列表详情:', courseList);
                // 更新课程列表显示
                updateCourseListDisplay();
            } catch (error) {
                console.error('从本地存储读取课程列表失败:', error);
                courseList = [];
            }
        } else {
            console.log('本地存储中没有找到匹配当前课程的课程列表，将尝试请求课程列表');
        }
        
        // 等待DOM加载完成后再执行DOM相关操作
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                // 创建UI
                createVideoUI();
                
                // 初始化视频元素
                initVideoElement();
                
                // 如果没有找到视频元素，尝试定期查找
                if (!videoElement) {
                    let searchAttempts = 0;
                    const maxAttempts = 20; // 最多尝试20次，每次间隔1秒
                    const videoCheckInterval = setInterval(() => {
                        searchAttempts++;
                        
                        // 检查视频元素是否已经存在
                        if (videoElement) {
                            clearInterval(videoCheckInterval);
                            console.log('视频元素已存在，停止定期查找');
                            return;
                        }
                        
                        // 检查是否已经尝试了足够次数
                        if (searchAttempts >= maxAttempts) {
                            clearInterval(videoCheckInterval);
                            console.log('已尝试多次查找视频元素，仍未找到');
                            return;
                        }
                        
                        videoElement = findVideoElement();
                        if (videoElement) {
                            clearInterval(videoCheckInterval);
                            
                            // 直接调用initVideoElement函数，避免重复代码
                            initVideoElement();
                        }
                    }, CONFIG.CHECK_INTERVAL);
                }
                
                // 启动会话保持
                startSessionKeepalive();
                
                // 启动视频元素变化监听
                addVideoMutationObserver();
                
                // 如果本地存储中没有课程列表，主动请求课程列表
                if (courseList.length === 0) {
                    console.log('本地存储中没有课程列表，主动请求课程列表');
                    if (broadcastChannel) {
                        broadcastChannel.postMessage({
                            type: 'requestCourseList',
                            currentTime: Date.now()
                        });
                    }
                }
            });
        } else {
            // DOM已加载完成，直接执行
            // 创建UI
            createVideoUI();
            
            // 初始化视频元素
            initVideoElement();
            
            // 启动视频元素变化监听
            addVideoMutationObserver();
            
            // 如果没有找到视频元素，尝试定期查找
            if (!videoElement) {
                let searchAttempts = 0;
                const maxAttempts = 20; // 最多尝试20次，每次间隔1秒
                const videoCheckInterval = setInterval(() => {
                    searchAttempts++;
                    
                    // 检查视频元素是否已经存在
                    if (videoElement) {
                        clearInterval(videoCheckInterval);
                        return;
                    }
                    
                    // 检查是否已经尝试了足够次数
                    if (searchAttempts >= maxAttempts) {
                        clearInterval(videoCheckInterval);
                        console.log('已尝试多次查找视频元素，仍未找到');
                        return;
                    }
                    
                    videoElement = findVideoElement();
                    if (videoElement) {
                        clearInterval(videoCheckInterval);
                        
                        // 直接调用initVideoElement函数，避免重复代码
                        initVideoElement();
                    }
                }, CONFIG.CHECK_INTERVAL);
            }
            
            // 启动会话保持
            startSessionKeepalive();
            
            // 如果本地存储中没有课程列表，主动请求课程列表
            if (courseList.length === 0) {
                console.log('本地存储中没有课程列表，主动请求课程列表');
                if (broadcastChannel) {
                    broadcastChannel.postMessage({
                        type: 'requestCourseList',
                        currentTime: Date.now()
                    });
                }
            }
        }
    }
    
    // 课程列表页面初始化
    function initCourseListPage() {
        console.log('课程列表页面初始化');
        
        // 初始化广播频道
        initBroadcastChannel();
        
        // 等待DOM加载完成后再执行DOM相关操作
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                waitForCourseContent();
            });
        } else {
            // DOM已加载完成，直接执行
            waitForCourseContent();
        }
        
        // 添加DOM变化监听，确保动态加载内容也能被捕获
        const observer = new MutationObserver(() => {
            // 当DOM发生变化时，检查是否有新的学习按钮添加
            const learnButtons = document.querySelectorAll('.learn');
            if (learnButtons.length > 0) {
                console.log('检测到DOM变化，可能有新的课程内容加载');
                observer.disconnect(); // 停止监听
                getCourseList();
            }
        });
        
        // 监听课程内容区域的变化
        const contentContainer = document.querySelector('.contbox') || document.body;
        observer.observe(contentContainer, { 
            childList: true, 
            subtree: true, 
            attributes: false 
        });
        
        console.log('气象课程列表获取器已启动，正在等待课程内容加载...');
    }
    
    // 主初始化函数
    function init() {
        // 获取当前页面URL
        const currentUrl = window.location.href;
        
        // 检查是否已经创建了面板
        if (document.getElementById('combined-panel')) {
            console.log('气象学习综合工具：已经创建了面板，不再重复创建');
            return;
        }
        
        // 检查是否在iframe中执行，只在顶层窗口执行
        if (window.self !== window.top) {
            console.log('气象学习综合工具：在iframe中执行，已自动退出');
            return;
        }
        
        console.log('气象学习综合工具已启动');
        
        // 检测当前页面类型
        currentPageType = detectPageType();
        console.log(`当前页面类型：${currentPageType}`);
        
        // 根据页面类型执行不同的初始化操作
        if (currentPageType === 'videoPlay') {
            // 视频播放页面
            initVideoPlayPage();
        } else if (currentPageType === 'courseList') {
            // 课程列表页面
            initCourseListPage();
        } else {
            console.log('当前页面不是目标页面，脚本将不执行任何操作');
        }
    }
    
    // 启动脚本
    init();
})();