// ==UserScript==
// @name         杭州新干线继续教育自动过验证+自动连播
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  显示课程进度百分比+渐进式进度条
// @author       bean0283
// @match        https://learning.hzrs.hangzhou.gov.cn/*
// @grant        GM_xmlhttpRequest
// @connect      learning.hzrs.hangzhou.gov.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555590/%E6%9D%AD%E5%B7%9E%E6%96%B0%E5%B9%B2%E7%BA%BF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E8%BF%87%E9%AA%8C%E8%AF%81%2B%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/555590/%E6%9D%AD%E5%B7%9E%E6%96%B0%E5%B9%B2%E7%BA%BF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E8%BF%87%E9%AA%8C%E8%AF%81%2B%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';


// 设置检测间隔（分钟）
    const checkIntervalMinutes = 1;
    // 将分钟转换为毫秒
    const interval = checkIntervalMinutes * 60 * 1000;

    // 创建日志元素
    const logElement = document.createElement('div');
    logElement.style.cssText = 'position:fixed;top:10px;right:10px;background-color:rgba(0,0,0,0.7);color:white;padding:10px;border-radius:5px;z-index:9999;font-family:Arial, sans-serif;font-size:12px;max-width:300px;';
    document.body.appendChild(logElement);

    function updateLog(message) {
        logElement.innerHTML = `<p>${message}</p><p>下次检测时间: ${new Date(Date.now() + interval).toLocaleTimeString()}</p>`;
    }

    updateLog('开始每分钟检测"确定"按钮...');

    function checkAndClick() {
        // 查找所有包含"确定"文本的按钮
        const buttons = Array.from(document.querySelectorAll('button')).filter(button =>
            button.textContent.includes('确定') || button.innerText.includes('确定')
        );

        if (buttons.length > 0) {
            // 点击第一个匹配的按钮
            buttons[0].click();
            updateLog(`已点击"确定"按钮 (${new Date().toLocaleTimeString()})`);
            console.log("已点击"+new Date(Date.now() + interval).toLocaleTimeString())

            // 添加视觉反馈
            const feedback = buttons[0].cloneNode(true);
            feedback.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background-color:green;color:white;padding:10px 20px;border-radius:5px;z-index:9999;opacity:0;transition:opacity 0.5s;';
            feedback.textContent = '✓ 已点击';
            document.body.appendChild(feedback);
            setTimeout(() => feedback.style.opacity = '1', 10);
            setTimeout(() => {
                feedback.style.opacity = '0';
                setTimeout(() => document.body.removeChild(feedback), 500);
            }, 1500);
        } else {
            console.log("检测时间："+new Date(Date.now() + interval).toLocaleTimeString())
            updateLog('未检测到弹窗，下次检测将在1分钟后进行');
        }
    }

    // 立即执行第一次检测
    checkAndClick();

    // 设置定时器，每分钟执行一次检测
    setInterval(checkAndClick, interval);

    'use strict';

    let isPlaying = false; // 标记是否已成功播放
    const checkInterval = 2000; // 状态检测间隔（2秒）

    function checkAndPlay() {
        const videoElement = document.getElementById('hls_html5_api');
        if (!videoElement) {
            // 未找到元素，继续重试
            setTimeout(checkAndPlay, 1000);
            return;
        }

        // 核心逻辑：如果暂停且已标记为“正在播放中”，则重新播放
        if (videoElement.paused) {
            if (isPlaying) {
                console.log('视频被暂停，尝试重新播放');
                // 重新播放时保持静音（减少被拦截概率）
                videoElement.volume = 0;
                videoElement.play().catch(err => {
                    console.log('重新播放失败，尝试点击', err);
                    videoElement.click();
                });
            } else {
                // 首次播放：静音后尝试播放
                const originalVolume = videoElement.volume;
                videoElement.volume = 0;
                videoElement.play().then(() => {
                    console.log('首次静音播放成功');
                    isPlaying = true; // 标记为已播放
                    // 延迟恢复音量（延长静音状态，降低被反制概率）
                    setTimeout(() => {
                        videoElement.volume = originalVolume;
                        console.log('已恢复音量');
                    }, 3000); // 3秒后恢复音量（可调整）
                }).catch(err => {
                    console.log('首次播放失败，尝试点击', err);
                    videoElement.click();
                    // 点击后再次检测状态
                    setTimeout(() => {
                        if (!videoElement.paused) isPlaying = true;
                    }, 1000);
                });
            }
        } else {
            // 视频正常播放，更新标记
            isPlaying = true;
        }

        // 持续检测（无论当前状态如何，确保后续异常能被处理）
        setTimeout(checkAndPlay, checkInterval);
    }

    // 休眠10秒后开始执行
    setTimeout(checkAndPlay, 1000);




    // 核心配置
    const COURSE_API = "https://learning.hzrs.hangzhou.gov.cn/api/index/Course/index";
    const processedCourses = new Set();
    const CHECK_INTERVAL = 60 * 1000; // 1分钟检测
    let isRunning = false;
    let currentCourse = null;
    let checkTimer = null;
    let allCourses = [];
    const TARGET_ROUTE = '/learn';
    let currentCourseTab = null;

    // 关闭当前标签页
    function closeCurrentTab() {
        console.log('关闭当前课程播放...');
        
        // 调用removeIframePlayer函数移除嵌入的iframe
        if (typeof removeIframePlayer === 'function') {
            removeIframePlayer();
        }
        
        // 保留旧的标签页关闭逻辑作为兼容处理
        if (currentCourseTab && typeof currentCourseTab.close === 'function') {
            try {
                currentCourseTab.close();
                currentCourseTab = null;
            } catch (e) {
                console.warn('关闭标签页失败:', e);
            }
        }
    }

    // ===================== 路由判断与初始化 =====================
    function isTargetRoute() {
        const hash = window.location.hash;
        return hash.startsWith(`#${TARGET_ROUTE}`);
    }

    window.addEventListener('hashchange', function() {
        console.log(`[继续教育脚本] 路由变化：${window.location.hash}`);
        if (isTargetRoute()) {
            renderControlPanel();
        } else {
            removeControlPanel();
            clearInterval(checkTimer);
            isRunning = false;
            currentCourse = null;
            if (currentCourseTab) {
                closeCurrentTab(currentCourseTab); // 替换关闭方法
                console.log('[继续教育脚本] 离开learn页面，关闭当前课程标签页');
            }
            currentCourseTab = null;
            console.log('[继续教育脚本] 已离开learn页面，脚本停止运行');
        }
    });

    window.addEventListener("load", function() {
        console.log('[继续教育脚本] 页面加载完成，检查目标路由');
        if (isTargetRoute()) {
            // 尝试多次获取容器，确保DOM加载完成
            const tryGetContainer = setInterval(() => {
                const container = document.getElementsByClassName('el-table__inner-wrapper')[0];
                if (container) {
                    clearInterval(tryGetContainer);
                    renderControlPanel();
                }
            }, 500);
            // 5秒后超时
            setTimeout(() => clearInterval(tryGetContainer), 5000);
        } else {
            console.log('[继续教育脚本] 非目标路由，不渲染控制面板');
        }
    });

    // ===================== 前端界面渲染 =====================
    function renderControlPanel() {
        if (document.querySelector('.course-control-panel')) {
            console.log('[继续教育脚本] 控制面板已存在，避免重复渲染');
            return;
        }

        // 获取目标容器
        const targetContainer = document.getElementsByClassName('el-table__inner-wrapper')[0];
        if (!targetContainer) {
            console.error('[继续教育脚本] 未找到.el-table__inner-wrapper容器，使用默认位置');
            // 如果找不到目标容器， fallback 到body
            targetContainer = document.body;
        }

        // 样式定义（修复课程名称竖向显示问题）
        const style = document.createElement('style');
        style.textContent = `
            .course-control-panel {
                width: 100%;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 15px rgba(0,0,0,0.15);
                padding: 16px;
                font-family: -apple-system, sans-serif;
                transition: all 0.3s ease;
                min-width: 300px;
                margin-bottom: 20px;
            }
            .panel-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 12px;
                color: #2d3748;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .start-btn {
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                background: #4299e1;
                color: white;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            }
            .start-btn:hover {
                background: #3182ce;
            }
            .course-list {
                max-height: 500px;
                overflow-y: auto;
                margin: 10px 0;
                padding-right: 8px;
            }
            .course-item {
                padding: 10px;
                border-radius: 6px;
                margin-bottom: 8px;
                font-size: 13px;
                border: 1px solid #f0f0f0;
                transition: all 0.2s;
                cursor: pointer;
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .course-item:hover {
                border-color: #dee2e6;
                background: #f8f9fa;
            }
            .course-item.current {
                border-color: #4299e1 !important;
                background: #f0f7ff !important;
                font-weight: 500 !important;
            }
            .course-item.current::before {
                content: "当前播放";
                position: absolute;
                left: 10px;
                top: -8px;
                background: #4299e1;
                color: white;
                font-size: 11px;
                padding: 1px 8px;
                border-radius: 4px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                z-index: 1;
            }
            .course-item.processed {
                opacity: 0.7;
                border-color: #e8f4f8;
                background: #fafafa;
            }
            .course-header {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
            }
            .course-id {
                color: #718096;
                display: inline-block;
                width: 80px;
                flex-shrink: 0;
            }
            .course-name {
                color: #2d3748;
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                min-width: 0; /* 关键修复：防止文字竖向显示 */
            }
            .progress-container {
                width: 100%;
                height: 8px;
                background: #f5f5f5;
                border-radius: 4px;
                overflow: hidden;
            }
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #4299e1 0%, #38b2ac 100%);
                border-radius: 4px;
                transition: width 0.5s ease-in-out;
                width: 0%;
            }
            .progress-text {
                font-size: 11px;
                color: #718096;
                text-align: right;
            }
            .status-text {
                margin-top: 10px;
                font-size: 12px;
                color: #718096;
                text-align: center;
                padding: 4px 0;
            }
            .list-header {
                font-size: 12px;
                color: #9f7aea;
                margin-bottom: 6px;
                display: flex;
                justify-content: space-between;
            }
            .header-main {
                display: flex;
                gap: 8px;
            }
            .header-id {
                width: 80px;
                margin-right: 8px;
            }
            .header-name {
                width: calc(100% - 180px);
                white-space: nowrap;
            }
            .header-progress {
                width: 80px;
                text-align: right;
            }
            /* 当前播放信息区 */
            .current-playing {
                background: #f0f7ff;
                border: 1px solid #4299e1;
                border-radius: 6px;
                padding: 8px;
                margin: 10px 0;
                transition: all 0.3s ease;
            }
            .current-playing .course-name {
                font-size: 13px;
                color: #2d3748;
                font-weight: 500;
                margin-bottom: 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .current-playing .progress-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
            }
            .current-playing .progress-container {
                flex: 1;
                margin-right: 8px;
                height: 6px;
            }
            .current-playing .progress-text {
                color: #718096;
                min-width: 40px;
                text-align: right;
            }
        `;
        document.head.appendChild(style);

        // 控制面板容器
        const panel = document.createElement('div');
        panel.className = 'course-control-panel';
        panel.id = 'courseControlPanel';

        // 标题栏
        const titleBar = document.createElement('div');
        titleBar.className = 'panel-title';
        
        // 标题内容容器
        const titleContent = document.createElement('div');
        titleContent.style.display = 'flex';
        titleContent.style.justifyContent = 'space-between';
        titleContent.style.alignItems = 'center';
        titleContent.innerHTML = `
            <span>继续教育自动播放</span>
            <button class="start-btn" id="startBtn">启动</button>
        `;
        
        titleBar.appendChild(titleContent);

        // 课程列表
        const courseList = document.createElement('div');
        courseList.className = 'course-list';
        courseList.id = 'courseList';
        
        // 创建当前播放信息区
        const currentPlaying = document.createElement('div');
        currentPlaying.className = 'current-playing';
        currentPlaying.id = 'currentPlaying';
        currentPlaying.style.display = 'none'; // 默认隐藏
        
        // 课程列表头部
        const listHeader = document.createElement('div');
        listHeader.className = 'list-header';
        listHeader.innerHTML = `
            <div class="header-main">
                <div class="header-id">课程ID</div>
                <div class="header-name">课程名称</div>
            </div>
        `;

        // 状态提示
        const statusText = document.createElement('div');
        statusText.className = 'status-text';
        statusText.id = 'statusText';
        statusText.textContent = '未启动，点击按钮开始';

        // 组装面板
        panel.appendChild(titleBar);
        panel.appendChild(listHeader);
        panel.appendChild(courseList);
        
        panel.appendChild(statusText);
        
        // 将面板插入到目标容器中
        if (targetContainer.firstChild) {
            targetContainer.insertBefore(panel, targetContainer.firstChild);
        } else {
            targetContainer.appendChild(panel);
        }

        console.log('[继续教育脚本] 控制面板已嵌入到.el-table__inner-wrapper容器');
        document.getElementById('startBtn').addEventListener('click', startScript);
    }

    // 移除控制面板
    function removeControlPanel() {
        const panel = document.querySelector('.course-control-panel');
        if (panel) {
            panel.remove();
            console.log('[继续教育脚本] 控制面板已移除');
        }
        const style = document.querySelector('style');
        if (style) style.remove();
    }

    // ===================== 界面更新函数 =====================
    // 更新当前播放信息区
    function updateCurrentPlaying() {
        const container = document.getElementById('currentPlaying');
        if (!container || !currentCourse) {
            //container.style.display = 'none';
            return;
        }
        
        container.style.display = 'block';
        const course = currentCourse;
        const validStudyTime = parseInt(course.validstudytime || 0);
        const courseTimes = parseInt(course.coursetimes || 0);
        const progressPercent = courseTimes > 0 ? Math.min(Math.round((validStudyTime / courseTimes) * 100), 100) : 0;
        
        container.innerHTML = `
            <div class="course-name">当前播放：${course.coursename}</div>
            <div class="progress-info">
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progressPercent}%"></div>
                </div>
                <div class="progress-text">${progressPercent}%</div>
            </div>
        `;
    }
    
    function updateCourseList() {
        const listContainer = document.getElementById('courseList');
        if (!listContainer) return;

        listContainer.innerHTML = '';
        if (allCourses.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">暂无课程数据</div>';
            console.log('[继续教育脚本] 课程列表为空');
            return;
        }

        console.log(`[继续教育脚本] 共加载 ${allCourses.length} 门课程，开始渲染列表`);
        allCourses.forEach(course => {
            // 计算进度百分比
            const validStudyTime = parseInt(course.validstudytime || 0);
            const courseTimes = parseInt(course.coursetimes || 0);
            const progressPercent = courseTimes > 0 ? Math.min(Math.round((validStudyTime / courseTimes) * 100), 100) : 0;

            const item = document.createElement('div');
            let itemClass = 'course-item';
            if (currentCourse && course.courseid === currentCourse.courseid) {
                itemClass += ' current';
                console.log(`[继续教育脚本] 高亮当前课程：ID=${course.courseid}，名称=${course.coursename}，进度=${progressPercent}%`);
            } else if (processedCourses.has(course.courseid) || progressPercent === 100) {
                itemClass += ' processed';
            }
            item.className = itemClass;

            // 点击课程手动打开
            item.addEventListener('click', () => {
                if (isRunning) {
                    if (currentCourseTab) {
                        closeCurrentTab(currentCourseTab); // 替换关闭方法
                        console.log(`[继续教育脚本] 手动切换课程，关闭旧课程标签页`);
                    }
                    currentCourse = course;
                    processedCourses.add(course.courseid);
                    openCourseTab(course);
                    updateCourseList();
                } else {
                    alert('请先启动脚本后再点击课程');
                }
            });

            // 课程项结构（包含进度条）
            item.innerHTML = `
                <div class="course-header">
                    <span class="course-id">${course.courseid}</span>
                    <span class="course-name">${course.coursename}</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progressPercent}%"></div>
                </div>
                <div class="progress-text">
                    ${validStudyTime}/${courseTimes}  · ${progressPercent}%
                </div>
            `;
            listContainer.appendChild(item);
        });
    }

    function updateStatusText(text) {
        const statusEl = document.getElementById('statusText');
        if (statusEl) {
            statusEl.textContent = text;
            console.log(`[继续教育脚本] 状态更新：${text}`);
        }
    }

    // ===================== 核心功能函数 =====================
    function startScript() {
        const btn = document.getElementById('startBtn');
        if (btn) btn.style.display = 'none';

        isRunning = true;
        updateStatusText('正在运行中...');
        console.log('[继续教育脚本] 脚本已启动，开始获取课程列表');
        fetchCourseList();
        startCourseCheck();
    }

    function fetchCourseList() {
        console.log(`[继续教育脚本] 发起课程列表请求：${COURSE_API}`);
        GM_xmlhttpRequest({
            method: "GET",
            url: COURSE_API,
            responseType: "json",
            onload: function(response) {
                const res = response.response;
                console.log(`[继续教育脚本] 课程列表请求响应：status=${res.status}`);

                if (res.status === -1) {
                    updateStatusText('未登录，请先登录！');
                    isRunning = false;
                    const btn = document.getElementById('startBtn');
                    if (btn) btn.style.display = 'inline-block';
                    return;
                }

                allCourses = res.data?.data || [];
                updateCourseList();

                if (allCourses.length === 0) {
                    updateStatusText('暂无可用课程');
                    return;
                }

                // 筛选未处理且进度未100%的首个课程
                const targetCourse = allCourses.find(course => {
                    const progressPercent = course.coursetimes > 0
                        ? Math.round((parseInt(course.validstudytime || 0) / parseInt(course.coursetimes || 0)) * 100)
                        : 0;
                    return !processedCourses.has(course.courseid) && progressPercent < 100;
                });

                if (targetCourse) {
                    openCourseTab(targetCourse);
                } else {
                    updateStatusText('所有课程已完成学习！');
                    console.log('[继续教育脚本] 所有课程均已完成，脚本停止');
                }
            },
            onerror: function(error) {
                const errMsg = `获取课程失败：${error.message || '网络异常'}`;
                updateStatusText('获取课程失败，请刷新重试');
                console.error(`[继续教育脚本] ${errMsg}`);
                const btn = document.getElementById('startBtn');
                if (btn) btn.style.display = 'inline-block';
            }
        });
    }

    function openCourseTab(course) {
        const { courseid, coursename } = course;
        processedCourses.add(courseid);
        currentCourse = course;

        const playUrl = `https://learning.hzrs.hangzhou.gov.cn/#/class?courseId=${courseid}&coursetitle=${encodeURIComponent(coursename)}`;
        
        // 移除旧的iframe（如果存在）
        removeIframePlayer();
        
        // 创建iframe播放器容器（嵌入到页面底部）
        const iframeContainer = document.createElement('div');
        iframeContainer.className = 'iframe-player-container';
        iframeContainer.id = 'iframePlayerContainer';
        iframeContainer.style.cssText = `
            width: 100%;
            min-height: 500px;
            background: #000;
            margin-top: 20px;
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        // 播放器标题栏
        const iframeHeader = document.createElement('div');
        iframeHeader.className = 'iframe-header';
        iframeHeader.style.cssText = `
            background: #333;
            color: white;
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
        `;
        iframeHeader.innerText = coursename;
        
        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.className = 'iframe-close-btn';
        closeButton.innerText = '关闭';
        closeButton.style.cssText = `
            padding: 6px 12px;
            background: #ff4d4f;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s;
        `;
        closeButton.addEventListener('click', removeIframePlayer);
        
        // 鼠标悬停效果
        closeButton.addEventListener('mouseenter', function() {
            this.style.background = '#ff7875';
        });
        closeButton.addEventListener('mouseleave', function() {
            this.style.background = '#ff4d4f';
        });
        
        // 创建调整大小手柄
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'iframe-resize-handle';
        resizeHandle.style.cssText = `
            width: 100%;
            height: 8px;
            background: #4299e1;
            cursor: ns-resize;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 12px;
        `;
        resizeHandle.title = '拖动调整高度';
        
        // 创建iframe
        const iframe = document.createElement('iframe');
        iframe.src = playUrl;
        iframe.style.width = '100%';
        iframe.style.height = '450px'; // 固定初始高度
        iframe.style.border = 'none';
        iframe.style.backgroundColor = '#000';
        
        // 实现垂直调整大小功能（仅调整高度）
        let isResizing = false;
        let startY, startHeight;
        
        resizeHandle.addEventListener('mousedown', function(e) {
            isResizing = true;
            startY = e.clientY;
            startHeight = iframe.offsetHeight;
            e.preventDefault();
            
            // 临时改变鼠标样式
            document.body.style.cursor = 'ns-resize';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;
            
            const deltaY = e.clientY - startY;
            let newHeight = startHeight + deltaY;
            
            // 限制最小高度
            newHeight = Math.max(300, newHeight);
            
            iframe.style.height = newHeight + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
            }
        });
        
        iframeHeader.appendChild(closeButton);
        
        // 组装并添加到控制面板下方
        iframeContainer.appendChild(iframeHeader);
        iframeContainer.appendChild(iframe);
        iframeContainer.appendChild(resizeHandle);
        
        // 插入到控制面板下方
        const panel = document.querySelector('.course-control-panel');
        if (panel && panel.nextSibling) {
            panel.parentNode.insertBefore(iframeContainer, panel.nextSibling);
        } else if (panel) {
            panel.parentNode.appendChild(iframeContainer);
        } else {
            document.body.appendChild(iframeContainer);
        }
        
        // 滚动到iframe位置
        setTimeout(() => {
            iframeContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
        // 设置当前iframe引用
        currentCourseTab = iframeContainer;
        
        updateStatusText(`当前播放：${coursename}`);
        updateCourseList();
        updateCurrentPlaying(); // 更新播放信息
        console.log(`[继续教育脚本] 已在iframe中加载课程：ID=${courseid}，名称=${coursename}，链接=${playUrl}`);
    }
    
    // 移除iframe播放器
    function removeIframePlayer() {
        console.log('移除iframe播放器...');
        const container = document.getElementById('iframePlayerContainer');
        
        if (container) {
            // 添加淡出动画
            container.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            // 延迟后移除元素
            setTimeout(() => {
                container.remove();
            }, 300);
        }
        
        currentCourseTab = null;
        console.log('[继续教育脚本] iframe播放器已移除');
    }
    
    function startCourseCheck() {
        console.log(`[继续教育脚本] 启动定时检测，间隔${CHECK_INTERVAL/1000}秒`);
        checkTimer = setInterval(() => {
            const now = new Date().toLocaleTimeString();
            console.log(`\n[继续教育脚本] 定时检测触发 - 时间：${now}`);

            GM_xmlhttpRequest({
                method: "GET",
                url: COURSE_API,
                responseType: "json",
                onload: function(response) {
                    const res = response.response;
                    console.log(`[继续教育脚本] 检测请求响应：status=${res.status}`);

                    if (res.status !== 200) {
                        console.warn('[继续教育脚本] 检测请求响应状态异常，跳过本次检测');
                        return;
                    }

                    const latestCourses = res.data?.data || [];
                    console.log(`[继续教育脚本] 最新课程列表共 ${latestCourses.length} 门`);

                    allCourses = latestCourses;

                    if (currentCourse) {
                        // 查找当前课程的最新进度
                        const latestCourse = latestCourses.find(c => c.courseid === currentCourse.courseid);
                        if (latestCourse) {
                            const validStudyTime = parseInt(latestCourse.validstudytime || 0);
                            const courseTimes = parseInt(latestCourse.coursetimes || 0);
                            const progressPercent = courseTimes > 0
                                ? Math.min(Math.round((validStudyTime / courseTimes) * 100), 100)
                                : 0;

                            console.log(`[继续教育脚本] 当前课程进度更新：${progressPercent}%（${validStudyTime}/${courseTimes}）`);

                            // 进度100%视为完成
                            if (progressPercent === 100) {
                                const finishedCourseName = latestCourse.coursename;
                                // 关闭当前课程标签页
                                if (currentCourseTab) {
                                    closeCurrentTab(currentCourseTab); // 替换关闭方法
                                    console.log(`[继续教育脚本] 课程 ${finishedCourseName} 已完成（100%），关闭旧标签页`);
                                    currentCourseTab = null;
                                }
                                updateStatusText(`课程 ${finishedCourseName} 已完成，切换下一个`);
                                console.log(`[继续教育脚本] 课程 ${finishedCourseName}（ID=${latestCourse.courseid}）已完成`);
                                currentCourse = null;
                                fetchCourseList(); // 加载下一个课程
                                return;
                            }
                        } else {
                            // 课程不在列表中，视为已完成
                            const finishedCourseName = currentCourse.coursename;
                            if (currentCourseTab) {
                                closeCurrentTab(currentCourseTab); // 替换关闭方法
                                console.log(`[继续教育脚本] 课程 ${finishedCourseName} 已从列表移除，关闭旧标签页`);
                                currentCourseTab = null;
                            }
                            updateStatusText(`课程 ${finishedCourseName} 已完成，切换下一个`);
                            currentCourse = null;
                            fetchCourseList();
                            return;
                        }
                    } else {
                        console.log('[继续教育脚本] 暂无当前播放课程，尝试加载下一个未处理课程');
                        fetchCourseList();
                    }

                    // 更新课程列表，刷新进度条显示
                    updateCourseList();
                    updateCurrentPlaying(); // 更新播放信息
                },
                onerror: function(error) {
                    console.error(`[继续教育脚本] 检测请求失败：${error.message || '网络异常'}`);
                }
            });
        }, CHECK_INTERVAL);
    }
})();
