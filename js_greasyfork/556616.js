// ==UserScript==
// @name         苏大双创平台智能刷课系统 v4.3
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  智能检测视频时长+多重验证+状态确认+防暂停+弹窗处理
// @author       Shimamura
// @match        https://suda.wnssedu.com/student/prese/studytasklist.htm*
// @match        https://suda.wnssedu.com/course/newcourse/watch.htm*
// @match        https://suda.wnssedu.com/course/*/watch.htm*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556616/%E8%8B%8F%E5%A4%A7%E5%8F%8C%E5%88%9B%E5%B9%B3%E5%8F%B0%E6%99%BA%E8%83%BD%E5%88%B7%E8%AF%BE%E7%B3%BB%E7%BB%9F%20v43.user.js
// @updateURL https://update.greasyfork.org/scripts/556616/%E8%8B%8F%E5%A4%A7%E5%8F%8C%E5%88%9B%E5%B9%B3%E5%8F%B0%E6%99%BA%E8%83%BD%E5%88%B7%E8%AF%BE%E7%B3%BB%E7%BB%9F%20v43.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 页面类型检测
    function getPageType() {
        const url = window.location.href;
        if (url.includes('/student/prese/studytasklist.htm')) {
            return 'courseList';
        } else if (url.includes('/course/newcourse/watch.htm') || url.includes('/course/') && url.includes('/watch.htm')) {
            return 'video';
        }
        return 'unknown';
    }
    
    class UniversalCourseCompleter {
        constructor() {
            // 绑定方法，确保this上下文正确
            this.startSmartSimulation = this.startSmartSimulation.bind(this);
            this.quickComplete = this.quickComplete.bind(this);
            this.stopSimulation = this.stopSimulation.bind(this);
            this.autoNavigateToFirstCourse = this.autoNavigateToFirstCourse.bind(this);
            
            this.pageType = getPageType();
            this.isInitialized = false;
            
            console.log(`检测到页面类型: ${this.pageType}`);
            this.init();
        }
        
        init() {
            if (this.isInitialized) return;
            
            switch (this.pageType) {
                case 'courseList':
                    this.initCourseListPage();
                    break;
                case 'video':
                    this.initVideoPage();
                    break;
                default:
                    console.log('未知页面类型，跳过初始化');
                    return;
            }
            
            this.isInitialized = true;
        }
        
        // 初始化课程列表页面
        initCourseListPage() {
            console.log('初始化课程列表页面');
            this.createControlPanel();
        }
        
        // 初始化视频播放页面
        initVideoPage() {
            console.log('初始化视频播放页面');
            
            this.courseInfo = this.extractCourseInfo();
            this.actualVideoDuration = 0;
            this.detectedVideoDuration = 0;
            this.isRunning = false;
            this.intervalId = null;
            this.currentProgress = 0;
            this.verificationCount = 0;
            this.apiEndpoints = new Set();
            
            // 新增：弹窗检测相关
            this.popupCheckInterval = null;
            this.playbackCheckInterval = null;
            this.skipButtonCount = 0;
            
            this.detectActualVideoDuration();
            this.monitorAllApiCalls();
            this.createControlPanel();
            this.setupVideoObserver();
            
            // 🔥 新增关键功能
            this.setupVideoProtection(); // 防止视频暂停
            this.startPopupDetection();  // 开始弹窗检测
            
            console.log('视频页面初始化完成');
        }
        
        // 提取课程信息
        extractCourseInfo() {
            const urlParams = new URLSearchParams(window.location.search);
            
            return {
                lCoursewareId: urlParams.get('lCoursewareId') || 'unknown',
                lNewCourseId: urlParams.get('courseId') || 'unknown',
                lVideoId: urlParams.get('lVideoId') || 'unknown',
                type: urlParams.get('type') || '0'
            };
        }
        
        // 智能检测实际视频时长
        detectActualVideoDuration() {
            console.log('开始检测实际视频时长...');
            
            const videoElement = document.querySelector('video');
            if (videoElement) {
                const checkDuration = () => {
                    if (videoElement.duration && videoElement.duration > 0) {
                        this.actualVideoDuration = Math.floor(videoElement.duration);
                        this.detectedVideoDuration = this.actualVideoDuration;
                        console.log('从视频元素检测到时长:', this.actualVideoDuration + '秒');
                        this.updateDurationDisplay();
                    } else {
                        setTimeout(checkDuration, 1000);
                    }
                };
                checkDuration();
                
                videoElement.addEventListener('loadedmetadata', () => {
                    if (videoElement.duration > 0) {
                        this.actualVideoDuration = Math.floor(videoElement.duration);
                        this.detectedVideoDuration = this.actualVideoDuration;
                        console.log('视频元数据加载，时长:', this.actualVideoDuration + '秒');
                        this.updateDurationDisplay();
                    }
                });
            }
            
            this.extractDurationFromPage();
        }
        
        // 从页面文本提取时长
        extractDurationFromPage() {
            const durationPatterns = [
                /(\d+)[:：](\d+)[:：](\d+)/,
                /(\d+)[:：](\d+)/,
                /时长[：:]?\s*(\d+)\s*分钟/,
                /时长[：:]?\s*(\d+)\s*min/,
                /(\d+)\s*分钟\s*(\d+)\s*秒/,
                /duration[：:]?\s*(\d+)/i
            ];
            
            const pageText = document.body.innerText;
            for (const pattern of durationPatterns) {
                const match = pageText.match(pattern);
                if (match) {
                    let seconds = 0;
                    if (match[3]) {
                        seconds = parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
                    } else if (match[2]) {
                        seconds = parseInt(match[1]) * 60 + parseInt(match[2]);
                    } else if (match[1]) {
                        seconds = parseInt(match[1]) * 60;
                    }
                    
                    if (seconds > 0) {
                        this.detectedVideoDuration = seconds;
                        console.log('从页面文本检测到时长:', seconds + '秒');
                        this.updateDurationDisplay();
                        break;
                    }
                }
            }
        }
        
        // 监控所有API调用
        monitorAllApiCalls() {
            console.log('开始监控API调用...');
            
            const originalFetch = window.fetch;
            window.fetch = (...args) => {
                const url = args[0];
                if (typeof url === 'string' && url.includes('/course/')) {
                    console.log('🔍 监控到课程相关API:', url);
                    if (!url.includes('videocc.net')) {
                        this.apiEndpoints.add(url);
                    }
                }
                return originalFetch.apply(this, args);
            };
        }
        
        // 设置视频观察器
        setupVideoObserver() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeName === 'VIDEO' || (node.querySelector && node.querySelector('video'))) {
                                console.log('检测到新视频元素，重新检测时长');
                                setTimeout(() => this.detectActualVideoDuration(), 1000);
                            }
                        });
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        // 🔥 新增：防止视频暂停
        setupVideoProtection() {
            const videoElement = document.querySelector('video');
            if (!videoElement) {
                console.log('未找到视频元素，稍后重试');
                setTimeout(() => this.setupVideoProtection(), 2000);
                return;
            }
            
            console.log('设置视频防暂停保护');
            
            // 阻止暂停事件
            const originalPause = videoElement.pause;
            videoElement.pause = function() {
                console.log('🚫 阻止视频暂停');
                return; // 不执行真正的暂停
            };
            
            // 确保视频始终播放
            const ensurePlayback = () => {
                if (videoElement && videoElement.paused) {
                    console.log('🔄 检测到视频暂停，尝试恢复播放');
                    videoElement.play().catch(e => {
                        console.log('恢复播放失败:', e);
                    });
                }
            };
            
            // 定期检查播放状态
            this.playbackCheckInterval = setInterval(ensurePlayback, 3000);
            
            // 初始检查
            setTimeout(ensurePlayback, 1000);
            
            console.log('视频防暂停保护已启用');
        }
        
        // 🔥 新增：检测并处理选择题弹窗
        detectAndHandlePopups() {
            const popupSelectors = [
                '.dialog', '.modal', '.popup', 
                '[class*="question"]', '[class*="test"]', '[class*="exam"]',
                '.el-dialog', '.ant-modal'
            ];
            
            let popupFound = false;
            
            // 检查常见弹窗选择器
            popupSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (this.isElementVisible(element)) {
                        console.log('🔍 检测到弹窗:', selector);
                        this.handlePopup(element);
                        popupFound = true;
                    }
                });
            });
            
            // 查找跳过按钮
            const skipButtons = this.findSkipButtons();
            if (skipButtons.length > 0 && skipButtons.length !== this.skipButtonCount) {
                console.log('发现跳过按钮，数量:', skipButtons.length);
                this.skipButtonCount = skipButtons.length;
                this.handleSkipButtons(skipButtons);
                popupFound = true;
            }
            
            return popupFound;
        }
        
        // 🔥 新增：查找跳过按钮
        findSkipButtons() {
            const buttons = [];
            const allButtons = document.querySelectorAll('button');
            
            allButtons.forEach(button => {
                const text = (button.textContent || '').trim().toLowerCase();
                if (text.includes('跳过') || text === 'skip') {
                    buttons.push(button);
                }
            });
            
            return buttons;
        }
        
        // 🔥 新增：处理跳过按钮
        handleSkipButtons(buttons) {
            buttons.forEach(button => {
                if (this.isElementVisible(button)) {
                    console.log('🔄 自动点击跳过按钮');
                    button.click();
                    // 多重点击确保生效
                    setTimeout(() => {
                        if (this.isElementVisible(button)) {
                            button.click();
                        }
                    }, 500);
                    setTimeout(() => {
                        if (this.isElementVisible(button)) {
                            button.click();
                        }
                    }, 1000);
                }
            });
        }
        
        // 🔥 新增：处理弹窗
        handlePopup(popupElement) {
            console.log('🔄 处理弹窗元素');
            
            // 尝试关闭弹窗
            const closeSelectors = [
                '.close', '.cancel', '[class*="close"]', 
                'button:contains("关闭")', 'button:contains("取消")',
                '.el-dialog__headerbtn', '.ant-modal-close'
            ];
            
            closeSelectors.forEach(selector => {
                const closeBtn = popupElement.querySelector(selector);
                if (closeBtn && this.isElementVisible(closeBtn)) {
                    console.log('点击关闭按钮');
                    closeBtn.click();
                }
            });
            
            // 直接点击弹窗背景关闭
            if (popupElement.style.display !== 'none') {
                const rect = popupElement.getBoundingClientRect();
                if (rect.width > 100 && rect.height > 100) {
                    // 点击边缘区域尝试关闭
                    const clickEvent = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    popupElement.dispatchEvent(clickEvent);
                }
            }
        }
        
        // 🔥 新增：检查元素是否可见
        isElementVisible(element) {
            if (!element) return false;
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            
            return !!(rect.width && rect.height && 
                     rect.top < window.innerHeight && 
                     rect.bottom > 0 &&
                     style.display !== 'none' &&
                     style.visibility !== 'hidden' &&
                     style.opacity !== '0');
        }
        
        // 🔥 新增：启动弹窗检测
        startPopupDetection() {
            this.popupCheckInterval = setInterval(() => {
                if (this.isRunning) {
                    this.detectAndHandlePopups();
                }
            }, 2000); // 每2秒检查一次弹窗
            
            console.log('弹窗检测系统已启动');
        }
        
        // 创建通用控制面板
        createControlPanel() {
            // 避免重复创建
            if (document.getElementById('smart-course-panel')) {
                return;
            }
            
            const panel = document.createElement('div');
            panel.id = 'smart-course-panel';
            panel.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50px;
                    right: 10px;
                    background: #1a1a1a;
                    color: white;
                    padding: 15px;
                    border-radius: 10px;
                    z-index: 10000;
                    font-family: Arial;
                    width: ${this.pageType === 'video' ? '320px' : '280px'};
                    box-shadow: 0 0 20px rgba(0,0,0,0.8);
                    border: 3px solid #${this.pageType === 'video' ? '9b59b6' : '3498db'};
                ">
                    <div style="font-weight: bold; margin-bottom: 10px; text-align: center; color: #${this.pageType === 'video' ? '9b59b6' : '3498db'}; font-size: 16px;">
                        ${this.pageType === 'video' ? '🧠 视频刷课系统 v4.3' : '📚 课程管理'}
                    </div>
                    
                    ${this.pageType === 'video' ? `
                    <div id="duration-info" style="
                        background: #2c3e50;
                        padding: 8px;
                        border-radius: 5px;
                        margin-bottom: 8px;
                        text-align: center;
                        font-size: 11px;
                        border: 1px solid #34495e;
                    ">
                        <div>视频时长检测中...</div>
                    </div>
                    
                    <div id="api-info" style="
                        background: #2c3e50;
                        padding: 6px;
                        border-radius: 5px;
                        margin-bottom: 8px;
                        text-align: center;
                        font-size: 10px;
                        border: 1px solid #34495e;
                    ">
                        API端点: <span id="api-count">0</span> 个
                    </div>
                    
                    <div id="popup-info" style="
                        background: #2c3e50;
                        padding: 6px;
                        border-radius: 5px;
                        margin-bottom: 8px;
                        text-align: center;
                        font-size: 10px;
                        border: 1px solid #34495e;
                    ">
                        弹窗检测: <span style="color: #2ecc71">✅ 启用</span>
                    </div>
                    
                    <div id="progress-display" style="
                        background: #2c3e50;
                        padding: 10px;
                        border-radius: 5px;
                        margin-bottom: 10px;
                        text-align: center;
                        font-size: 12px;
                        border: 1px solid #34495e;
                    ">
                        <div style="margin-bottom: 5px;">等待开始...</div>
                        <div style="background: #34495e; height: 6px; border-radius: 3px; overflow: hidden;">
                            <div id="progress-bar" style="background: #9b59b6; height: 100%; width: 0%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 5px; margin-bottom: 8px;">
                        <button id="start-smart" style="
                            background: #9b59b6;
                            color: white;
                            border: none;
                            padding: 10px 15px;
                            border-radius: 5px;
                            cursor: pointer;
                            flex: 1;
                            font-size: 12px;
                            font-weight: bold;
                        ">智能刷课</button>
                        <button id="quick-complete" style="
                            background: #e74c3c;
                            color: white;
                            border: none;
                            padding: 10px 15px;
                            border-radius: 5px;
                            cursor: pointer;
                            flex: 1;
                            font-size: 12px;
                            font-weight: bold;
                        ">快速完成</button>
                    </div>
                    
                    <button id="stop-simulation" style="
                        background: #95a5a6;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        width: 100%;
                        font-size: 12px;
                    ">停止</button>
                    ` : `
                    <div style="text-align: center; margin-bottom: 15px; color: #bdc3c7;">
                        已检测到课程列表
                    </div>
                    <button id="auto-navigate" style="
                        background: #3498db;
                        color: white;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        width: 100%;
                        font-size: 12px;
                        font-weight: bold;
                        margin-bottom: 8px;
                    ">自动开始第一个课程</button>
                    <div style="font-size: 10px; color: #7f8c8d; text-align: center;">
                        点击课程进入视频页面后自动刷课
                    </div>
                    `}
                    
                    <div style="font-size: 9px; color: #7f8c8d; text-align: center; margin-top: 8px;">
                        ${this.pageType === 'video' ? '智能检测 | 多重验证 | 弹窗处理' : '课程选择 | 自动导航'}
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
            
            // 使用箭头函数绑定事件，确保this指向正确
            if (this.pageType === 'video') {
                document.getElementById('start-smart').addEventListener('click', () => {
                    console.log('点击智能刷课按钮');
                    this.startSmartSimulation();
                });
                
                document.getElementById('quick-complete').addEventListener('click', () => {
                    console.log('点击快速完成按钮');
                    this.quickComplete();
                });
                
                document.getElementById('stop-simulation').addEventListener('click', () => {
                    console.log('点击停止按钮');
                    this.stopSimulation();
                });
            } else {
                document.getElementById('auto-navigate').addEventListener('click', () => {
                    console.log('点击自动导航按钮');
                    this.autoNavigateToFirstCourse();
                });
            }
        }
        
        // 自动导航到第一个课程
        autoNavigateToFirstCourse() {
            const firstCourseLink = document.querySelector('a[href*="watch.htm"]');
            if (firstCourseLink) {
                console.log('自动导航到第一个课程:', firstCourseLink.href);
                firstCourseLink.click();
            } else {
                alert('未找到课程链接');
            }
        }
        
        // 智能进度计算
        calculateSmartProgress() {
            const baseDuration = this.actualVideoDuration || this.detectedVideoDuration || 665;
            const elapsed = Date.now() - this.startTime;
            const totalTime = Math.min(180, baseDuration) * 1000; // 最多3分钟完成
            
            return Math.min(1, elapsed / totalTime);
        }
        
        // 开始智能模拟
        startSmartSimulation() {
            if (this.isRunning) {
                console.log('模拟已在运行中');
                return;
            }
            
            this.isRunning = true;
            this.startTime = Date.now();
            this.verificationCount = 0;
            
            console.log('开始智能模拟学习');
            this.updateProgressDisplay(0);
            
            // 立即开始
            this.smartProgressLoop();
        }
        
        // 智能进度循环
        smartProgressLoop() {
            if (!this.isRunning) return;
            
            // 🔥 新增：在处理进度前先处理弹窗
            const popupHandled = this.detectAndHandlePopups();
            if (popupHandled) {
                console.log('🛡️ 已处理弹窗干扰，继续学习进度');
            }
            
            const progress = this.calculateSmartProgress();
            const duration = this.actualVideoDuration || this.detectedVideoDuration || 665;
            const currentSeconds = Math.floor(duration * progress);
            
            this.currentProgress = progress;
            
            // 发送学习记录
            this.sendRecordStudy(currentSeconds);
            
            // 定期发送验证请求
            if (this.verificationCount < 3 || progress > 0.5) {
                this.sendVerificationRequests(currentSeconds);
            }
            
            // 更新界面
            this.updateProgressDisplay(progress);
            
            // 检查完成条件
            if (progress >= 0.95) {
                console.log('达到95%进度，开始完成验证');
                this.sendCompletionVerification();
                
                // 多重验证确保完成
                setTimeout(() => {
                    this.sendCompletionVerification();
                }, 5000);
                
                setTimeout(() => {
                    this.sendCompletionVerification();
                    this.stopSimulation();
                    this.showCompletionMessage();
                }, 10000);
            } else {
                // 继续循环
                this.intervalId = setTimeout(() => {
                    this.smartProgressLoop();
                }, 30000); // 30秒间隔
            }
        }
        
        // 发送学习记录
        sendRecordStudy(seconds) {
            const data = new URLSearchParams({
                lCoursewareId: this.courseInfo.lCoursewareId,
                strStartTime: this.startTime.toString(),
                nCurSeconds: seconds.toString(),
                lNewCourseId: this.courseInfo.lNewCourseId
            });
            
            this.sendRequest('/course/Servlet/recordStudy.svl', data.toString(), '学习记录');
        }
        
        // 发送验证请求
        sendVerificationRequests(seconds) {
            this.apiEndpoints.forEach(endpoint => {
                if (endpoint.includes('addCoursePlayTimes') || 
                    endpoint.includes('modifyRecentView') ||
                    endpoint.includes('checkIsLastOneMin')) {
                    
                    const data = new URLSearchParams({
                        courseId: this.courseInfo.lNewCourseId,
                        videoId: this.courseInfo.lVideoId,
                        currentTime: seconds.toString()
                    });
                    
                    this.sendRequest(endpoint, data.toString(), '验证请求');
                }
            });
        }
        
        // 发送完成验证
        sendCompletionVerification() {
            console.log('🔐 发送完成验证请求...');
            
            // 发送最终学习记录
            const finalSeconds = this.actualVideoDuration || this.detectedVideoDuration || 665;
            this.sendRecordStudy(finalSeconds);
            
            this.verificationCount++;
        }
        
        // 通用的请求发送方法
        sendRequest(url, data, type) {
            const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
            
            GM_xmlhttpRequest({
                method: 'POST',
                url: fullUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                data: data,
                onload: (response) => {
                    if (response.status === 200) {
                        console.log(`✅ ${type}成功`);
                    } else {
                        console.log(`⚠️ ${type}响应: ${response.status}`);
                    }
                },
                onerror: (error) => {
                    console.error(`❌ ${type}失败:`, error);
                }
            });
        }
        
        // 快速完成
        quickComplete() {
            console.log('执行快速完成');
            this.stopSimulation();
            
            // 直接发送完成验证
            this.sendCompletionVerification();
            setTimeout(() => this.sendCompletionVerification(), 2000);
            setTimeout(() => {
                this.sendCompletionVerification();
                this.showCompletionMessage();
            }, 5000);
        }
        
        // 停止模拟
        stopSimulation() {
            if (this.intervalId) {
                clearTimeout(this.intervalId);
                this.intervalId = null;
            }
            
            // 清除新增的定时器
            if (this.popupCheckInterval) {
                clearInterval(this.popupCheckInterval);
                this.popupCheckInterval = null;
            }
            
            if (this.playbackCheckInterval) {
                clearInterval(this.playbackCheckInterval);
                this.playbackCheckInterval = null;
            }
            
            this.isRunning = false;
            console.log('模拟已停止');
            this.updateProgressDisplay(this.currentProgress);
        }
        
        // 更新时长显示
        updateDurationDisplay() {
            if (this.pageType !== 'video') return;
            
            const durationElement = document.getElementById('duration-info');
            if (durationElement) {
                const actual = this.actualVideoDuration || '检测中';
                const detected = this.detectedVideoDuration || '未知';
                
                durationElement.innerHTML = `
                    <div>视频时长: ${actual}秒</div>
                    <div style="font-size: 9px; color: #bdc3c7;">检测时长: ${detected}秒</div>
                `;
            }
            
            const apiCountElement = document.getElementById('api-count');
            if (apiCountElement) {
                apiCountElement.textContent = this.apiEndpoints.size;
            }
        }
        
        // 更新进度显示
        updateProgressDisplay(progress) {
            if (this.pageType !== 'video') return;
            
            const progressElement = document.getElementById('progress-display');
            const progressBar = document.getElementById('progress-bar');
            
            if (progressElement && progressBar) {
                const percent = (progress * 100).toFixed(1);
                const duration = this.actualVideoDuration || this.detectedVideoDuration || 665;
                const currentSeconds = Math.floor(duration * progress);
                
                progressElement.innerHTML = `
                    <div style="margin-bottom: 5px;">
                        进度: ${percent}% (${currentSeconds}/${duration}秒)
                    </div>
                    <div style="background: #34495e; height: 6px; border-radius: 3px; overflow: hidden;">
                        <div id="progress-bar" style="background: #9b59b6; height: 100%; width: ${percent}%; transition: width 0.3s;"></div>
                    </div>
                    <div style="font-size: 9px; margin-top: 5px; color: #bdc3c7;">
                        验证次数: ${this.verificationCount} | 跳过弹窗: ${this.skipButtonCount}
                    </div>
                `;
            }
        }
        
        // 显示完成消息
        showCompletionMessage() {
            const progressElement = document.getElementById('progress-display');
            if (progressElement) {
                progressElement.innerHTML = `
                    <div style="color: #9b59b6; font-weight: bold; font-size: 14px;">
                        ✅ 学习完成!
                    </div>
                    <div style="font-size: 10px; margin-top: 5px; color: #bdc3c7;">
                        已完成 ${this.verificationCount} 次验证
                    </div>
                    <div style="font-size: 9px; margin-top: 3px; color: #bdc3c7;">
                        处理了 ${this.skipButtonCount} 个弹窗
                    </div>
                `;
            }
            
            setTimeout(() => {
                if (confirm('🎉 智能刷课完成！\n弹窗防护系统已处理所有干扰。\n\n是否立即刷新确认课程状态？')) {
                    window.location.reload();
                }
            }, 1500);
        }
    }
    
    // 启动系统
    function initializeSystem() {
        console.log('🎯 开始初始化智能刷课系统 v4.3...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    new UniversalCourseCompleter();
                }, 1000);
            });
        } else {
            setTimeout(() => {
                new UniversalCourseCompleter();
            }, 1000);
        }
    }
    
    // 启动系统
    initializeSystem();
    
})();