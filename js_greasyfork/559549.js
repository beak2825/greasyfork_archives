// ==UserScript==
// @name         学习公社云自动学习
// @namespace    http://tampermonkey.net/
// @version      0.9.2
// @description  自动学习网课，支持3倍速播放，自动切换通识课/专业课，江西省中小学（幼儿园）“互联网+教师专业发展”全员培训
// @license      yantianyv deepseek
// @match        https://www.ttcdw.cn/p/uc/myClassroom/*
// @match        https://www.ttcdw.cn/p/course/videorevision/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getValues
// @grant        GM_openInTab
// @grant        window.close
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559549/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E4%BA%91%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/559549/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E4%BA%91%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 初始化日志系统
    const log = (message, type = 'info') => {
        const timestamp = new Date().toLocaleString();
        const logEntry = `${timestamp} [${type}] ${message}`;
        console.log(logEntry);

        // 保存最近的100条日志
        const logs = GM_getValue('logs', []);
        logs.push(logEntry);
        if (logs.length > 100) logs.shift();
        GM_setValue('logs', logs);

        // 更新日志面板
        updateLogPanel(logEntry);
    };

    // 创建页面弹窗
    const showAlert = (message, type = 'error') => {
        const alertId = 'auto-learner-alert-' + Date.now();
        GM_addStyle(`
            #${alertId} {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 20px;
                background: ${type === 'error' ? '#ffebee' : '#e8f5e9'};
                color: ${type === 'error' ? '#c62828' : '#2e7d32'};
                border: 1px solid ${type === 'error' ? '#ef9a9a' : '#a5d6a7'};
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 99999;
                max-width: 80%;
                text-align: center;
            }
            /* 新增炫酷进度条样式 */
            .cool-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #8BC34A);
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
                position: relative;
                overflow: hidden;
                transition: width 0.5s ease;
            }
            .cool-progress-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.3) 50%,
                    rgba(255, 255, 255, 0) 100%
                );
                animation: shine 2s infinite;
            }
            @keyframes shine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            /* 倒计时样式 */
            .countdown {
                font-size: 24px;
                font-weight: bold;
                color: #FF5722;
                text-align: center;
                text-shadow: 0 0 5px rgba(255, 87, 34, 0.5);
                animation: pulse 1s infinite alternate;
            }
            @keyframes pulse {
                from { transform: scale(1); }
                to { transform: scale(1.1); }
            }
            /* 当前课程的进度条样式 */
            .current-course .el-progress-bar__inner {
                background: linear-gradient(90deg, #4CAF50, #8BC34A) !important;
                border-radius: 10px !important;
                box-shadow: 0 0 5px rgba(76, 175, 80, 0.5) !important;
                position: relative !important;
                overflow: hidden !important;
                transition: width 0.5s ease !important;
            }
            .current-course .el-progress-bar__inner::after {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.3) 50%,
                    rgba(255, 255, 255, 0) 100%
                ) !important;
                animation: shine 2s infinite !important;
            }
            #auto-learner-container {
                z-index: 99999;
            }
            #auto-learner-log-panel {
                background: rgba(0,0,0,0.85);
                color: #fff;
                font-family: 'Consolas', 'Monaco', monospace;
                padding: 10px;
                overflow: auto;
                border-radius: 5px;
                font-size: 12px;
                line-height: 1.5;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                max-height: 150px;
            }
            #auto-learner-log-toggle {
                padding: 5px;
                background: rgba(0,0,0,0.7);
                color: #fff;
                border-radius: 5px;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s ease;
            }
            #auto-learner-log-toggle:hover {
                background: rgba(0,0,0,0.8);
            }
            #auto-learner-log-panel::-webkit-scrollbar {
                width: 6px;
            }
            #auto-learner-log-panel::-webkit-scrollbar-track {
                background: rgba(255,255,255,0.1);
                border-radius: 3px;
            }
            #auto-learner-log-panel::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.3);
                border-radius: 3px;
            }
            #auto-learner-log-panel::-webkit-scrollbar-thumb:hover {
                background: rgba(255,255,255,0.4);
            }
            /* 视频页面的日志容器样式 */
            #auto-learner-video-container {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 99998;
                width: 320px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            #auto-learner-video-log-panel {
                background: rgba(0,0,0,0.85);
                color: #fff;
                font-family: 'Consolas', 'Monaco', monospace;
                padding: 10px;
                overflow: auto;
                border-radius: 5px;
                font-size: 12px;
                line-height: 1.5;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                max-height: 150px;
                display: block !important;
            }
            #auto-learner-video-log-toggle {
                padding: 5px;
                background: rgba(0,0,0,0.7);
                color: #fff;
                border-radius: 5px;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s ease;
            }
            #auto-learner-video-log-toggle:hover {
                background: rgba(0,0,0,0.8);
            }
            #auto-learner-video-log-panel::-webkit-scrollbar {
                width: 6px;
            }
            #auto-learner-video-log-panel::-webkit-scrollbar-track {
                background: rgba(255,255,255,0.1);
                border-radius: 3px;
            }
            #auto-learner-video-log-panel::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.3);
                border-radius: 3px;
            }
            #auto-learner-video-log-panel::-webkit-scrollbar-thumb:hover {
                background: rgba(255,255,255,0.4);
            }
            /* 考核信息样式 */
            #assessment-info {
                background: rgba(255,255,255,0.95);
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                border-left: 4px solid #4CAF50;
            }
            #assessment-info h3 {
                margin: 0 0 8px 0;
                color: #333;
                font-size: 16px;
            }
            #assessment-info .info-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 12px;
            }
            #assessment-info .info-label {
                color: #666;
            }
            #assessment-info .info-value {
                color: #333;
                font-weight: bold;
            }
            #assessment-info .completed {
                color: #4CAF50;
            }
            #assessment-info .not-completed {
                color: #FF5722;
            }
            #assessment-info .progress-bar {
                width: 100%;
                height: 8px;
                background: #f0f0f0;
                border-radius: 4px;
                margin: 8px 0;
                overflow: hidden;
            }
            #assessment-info .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #8BC34A);
                border-radius: 4px;
                transition: width 0.5s ease;
            }
            /* 完成状态样式 */
            .completion-banner {
                background: linear-gradient(135deg, #4CAF50, #2E7D32);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin-top: 15px;
                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            }
            .completion-banner h3 {
                color: white;
                margin-bottom: 10px;
                font-size: 20px;
            }
            .completion-banner .completion-icon {
                font-size: 40px;
                margin-bottom: 15px;
            }
            .completion-banner .completion-message {
                font-size: 14px;
                opacity: 0.9;
                margin-top: 10px;
            }
            /* 模块标签样式 */
            #module-info {
                background: rgba(255,255,255,0.95);
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                border-left: 4px solid #2196F3;
            }
            #module-info h3 {
                margin: 0 0 8px 0;
                color: #333;
                font-size: 16px;
            }
            #module-info .module-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 12px;
            }
            #module-info .module-label {
                color: #666;
            }
            #module-info .module-value {
                color: #333;
                font-weight: bold;
            }
            #module-info .module-active {
                color: #4CAF50;
                font-weight: bold;
            }
            #module-info .module-inactive {
                color: #666;
            }
        `);

        const alertDiv = document.createElement('div');
        alertDiv.id = alertId;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);

        // 5秒后自动消失
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);

        return alertDiv;
    };

    // 创建日志面板（课程列表页）
    const createLogPanel = () => {
        let panel = document.getElementById('auto-learner-log-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'auto-learner-log-panel';
            panel.style.display = 'none';
        }
        return panel;
    };

    // 创建视频页日志面板
    const createVideoLogPanel = () => {
        let panel = document.getElementById('auto-learner-video-log-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'auto-learner-video-log-panel';
            panel.style.display = 'block';
        }
        return panel;
    };

    // 更新日志面板
    const updateLogPanel = (message) => {
        let panel = document.getElementById('auto-learner-log-panel');
        if (!panel) {
            panel = createLogPanel();
        }
        panel.innerHTML += message + '<br>';
        panel.scrollTop = panel.scrollHeight;

        // 同时更新视频页日志面板（如果存在）
        let videoPanel = document.getElementById('auto-learner-video-log-panel');
        if (videoPanel) {
            videoPanel.innerHTML += message + '<br>';
            videoPanel.scrollTop = videoPanel.scrollHeight;
        }
    };

    // 工具函数：等待元素出现
    const waitForElement = (selector, timeout = 10000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime >= timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                } else {
                    setTimeout(check, 500);
                }
            };
            check();
        });
    };

    // 工具函数：等待元素可点击
    const waitForClickableElement = (selector, timeout = 10000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                const element = document.querySelector(selector);
                if (element && !element.disabled && element.offsetParent !== null) {
                    resolve(element);
                } else if (Date.now() - startTime >= timeout) {
                    reject(new Error(`Clickable element ${selector} not found within ${timeout}ms`));
                } else {
                    setTimeout(check, 500);
                }
            };
            check();
        });
    };

    // 工具函数：等待指定时间
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 工具函数：等待页面变化
    const waitForPageChange = (originalUrl, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                if (window.location.href !== originalUrl) {
                    resolve();
                } else if (Date.now() - startTime >= timeout) {
                    reject(new Error('页面未发生变化'));
                } else {
                    setTimeout(check, 200);
                }
            };
            check();
        });
    };

    // 工具函数：安全点击元素
    const safeClick = async (selector) => {
        const element = await waitForClickableElement(selector);
        element.click();
        return element;
    };

    // 工具函数：解析时间字符串为秒数
    const parseTimeToSeconds = (timeStr) => {
        if (!timeStr) return 0;

        // 处理格式如: "02:01:08" 或 "01:00:15"
        const parts = timeStr.split(':').map(Number);

        if (parts.length === 3) {
            // 格式: 时:分:秒
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            // 格式: 分:秒
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 1) {
            // 格式: 秒
            return parts[0];
        }

        return 0;
    };

    // 工具函数：解析考核信息
    const parseAssessmentInfo = () => {
        try {
            // 从页面中提取考核信息
            const tipsElement = document.querySelector('.assess-tips');
            if (!tipsElement) return null;

            const text = tipsElement.textContent || tipsElement.innerText;
            log(`考核信息文本: ${text}`);

            // 使用正则表达式提取数字
            const requiredMatch = text.match(/考核要求\s*(\d+(?:\.\d+)?)\s*学时/);
            const selectedMatch = text.match(/已选择\s*(\d+(?:\.\d+)?)\s*学时/);
            const completedMatch = text.match(/已完成\s*(\d+(?:\.\d+)?)\s*学时/);

            if (requiredMatch && selectedMatch && completedMatch) {
                return {
                    required: parseFloat(requiredMatch[1]),
                    selected: parseFloat(selectedMatch[1]),
                    completed: parseFloat(completedMatch[1])
                };
            }
        } catch (error) {
            log(`解析考核信息失败: ${error.message}`, 'error');
        }

        return null;
    };

    // 工具函数：计算课程已学学时
    const calculateCourseCompletedHours = (durationStr, progressPercent) => {
        const totalSeconds = parseTimeToSeconds(durationStr);
        const totalHours = totalSeconds / 3600; // 转换为小时
        return totalHours * (progressPercent / 100);
    };

    // 工具函数：检测当前学习模块类型
    const detectLearningModule = () => {
        try {
            // 查找当前激活的学习模块
            const assessItemPart = document.querySelector('.assessItem-part');
            if (!assessItemPart) {
                log('未找到模块选择区域，使用默认模块');
                return 'unknown';
            }
            
            // 查找激活的模块
            const activeModule = assessItemPart.querySelector('.assess-active');
            if (activeModule) {
                const moduleTitle = activeModule.querySelector('.item-title');
                if (moduleTitle) {
                    const moduleName = moduleTitle.textContent.trim();
                    log(`检测到当前学习模块: ${moduleName}`);
                    return moduleName;
                }
            }
            
            // 如果没有激活的模块，检查所有模块
            const allModules = assessItemPart.querySelectorAll('.item-title');
            for (const module of allModules) {
                const moduleName = module.textContent.trim();
                log(`找到可用模块: ${moduleName}`);
            }
            
            // 默认返回第一个模块的名称
            if (allModules.length > 0) {
                return allModules[0].textContent.trim();
            }
            
        } catch (error) {
            log(`检测学习模块失败: ${error.message}`, 'error');
        }
        
        return 'unknown';
    };

    // 工具函数：切换到专业课学习
    const switchToProfessionalCourse = async () => {
        try {
            log('尝试切换到专业课学习...');
            
            // 查找专业课学习选项卡
            const professionalTab = Array.from(document.querySelectorAll('.assessItem-part .item-title'))
                .find(item => item.textContent.trim() === '专业课学习');
            
            if (professionalTab) {
                const tabElement = professionalTab.closest('.item-one');
                if (tabElement) {
                    // 检查是否已经是当前激活的模块
                    if (tabElement.classList.contains('assess-active')) {
                        log('专业课学习已经是当前模块');
                        return true;
                    }
                    
                    // 点击专业课学习选项卡
                    log('点击专业课学习选项卡...');
                    tabElement.click();
                    
                    // 等待页面刷新/重新加载
                    await delay(3000);
                    
                    // 检查是否切换成功
                    const currentModule = detectLearningModule();
                    if (currentModule === '专业课学习') {
                        log('成功切换到专业课学习');
                        return true;
                    } else {
                        log('切换到专业课学习后，检测到的模块为: ' + currentModule);
                        // 尝试刷新页面
                        log('尝试刷新页面...');
                        location.reload();
                        await delay(3000);
                        return true;
                    }
                }
            } else {
                log('未找到专业课学习选项卡', 'warning');
                
                // 尝试通过URL判断
                if (window.location.href.includes('center')) {
                    log('检测到在项目中心页面，可能需要重新进入');
                }
            }
            
            return false;
        } catch (error) {
            log(`切换到专业课学习失败: ${error.message}`, 'error');
            return false;
        }
    };

    // 从URL中提取用户ID
    const extractUserId = () => {
        // 从当前URL提取用户ID
        const url = window.location.href;
        const match = url.match(/\/p\/uc\/myClassroom\/(\d+)/);
        if (match && match[1]) {
            return match[1];
        }

        // 从iframe的src中提取
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.src) {
            const iframeMatch = iframe.src.match(/\/p\/uc\/myClassroom\/(\d+)/);
            if (iframeMatch && iframeMatch[1]) {
                return iframeMatch[1];
            }
        }

        // 从页面中的链接提取
        const links = document.querySelectorAll('a[href*="/p/uc/myClassroom/"]');
        for (const link of links) {
            const href = link.getAttribute('href');
            if (href) {
                const linkMatch = href.match(/\/p\/uc\/myClassroom\/(\d+)/);
                if (linkMatch && linkMatch[1]) {
                    return linkMatch[1];
                }
            }
        }

        return null;
    };

    // 获取课程列表URL
    const getCourseListUrl = () => {
        // 首先尝试从GM存储中获取
        let courseListUrl = GM_getValue('courseListUrl', '');

        // 如果GM存储中没有，尝试从当前页面提取
        if (!courseListUrl) {
            const userId = extractUserId();
            if (userId) {
                courseListUrl = `https://www.ttcdw.cn/p/uc/myClassroom/${userId}`;
                GM_setValue('courseListUrl', courseListUrl);
                log(`提取到用户ID: ${userId}，课程列表URL: ${courseListUrl}`);
            } else {
                courseListUrl = 'https://www.ttcdw.cn/p/uc/myClassroom';
                log('无法提取用户ID，使用默认课程列表URL');
            }
        }

        return courseListUrl;
    };

    // 保存课程列表URL
    const saveCourseListUrl = () => {
        const userId = extractUserId();
        if (userId) {
            const courseListUrl = `https://www.ttcdw.cn/p/uc/myClassroom/${userId}`;
            GM_setValue('courseListUrl', courseListUrl);
            log(`保存课程列表URL: ${courseListUrl}`);
            return courseListUrl;
        }
        return null;
    };

    // 主逻辑
    const main = async () => {
        log('脚本启动...');
        log(`版本: 0.9.2 - 移除考核完成后的倒计时刷新`);

        try {
            // 如果是课程列表页面，保存课程列表URL
            if (window.location.href.includes('/p/uc/myClassroom/')) {
                const savedUrl = saveCourseListUrl();
                if (savedUrl) {
                    log(`已保存课程列表URL: ${savedUrl}`);
                }
            }

            log(`当前URL: ${window.location.href}`);

            if (window.location.href.includes('/p/uc/myClassroom/')) {
                log('检测到课程列表页');
                await handleCourseListPage();
            } else if (window.location.href.includes('/p/course/v/') || window.location.href.includes('/p/course/videorevision/')) {
                log('检测到视频播放页');
                await handleVideoPage();
            } else {
                log('不支持的页面类型');
            }
        } catch (error) {
            log(`主逻辑出错: ${error.message}`, 'error');
            showAlert(`脚本运行出错: ${error.message}`);
        }
    };

    // 处理课程列表页
    const handleCourseListPage = async () => {
        log('开始处理课程列表页...');
        let retryCount = 0;
        const maxRetries = 3;

        log('准备检查课程列表');

        while (retryCount < maxRetries) {
            try {
                await waitForElement('.el-table__body');
                log('课程表格加载完成');

                // 检查容器是否已存在
                let container = document.getElementById('auto-learner-container');
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'auto-learner-container';
                    container.style.position = 'fixed';
                    container.style.bottom = '20px';
                    container.style.left = '20px';
                    container.style.zIndex = '99999';
                    container.style.width = '350px';
                    container.style.display = 'flex';
                    container.style.flexDirection = 'column';
                    container.style.gap = '10px';
                    document.body.appendChild(container);
                }

                // 添加红包按钮
                let redPacketBtn = document.getElementById('red-packet-btn');
                if (!redPacketBtn) {
                    redPacketBtn = document.createElement('div');
                    redPacketBtn.id = 'red-packet-btn';
                    redPacketBtn.textContent = '🧧 饿了么天天领红包 🧧';
                    redPacketBtn.style.cursor = 'pointer';
                    redPacketBtn.style.textAlign = 'center';
                    redPacketBtn.style.padding = '10px';
                    redPacketBtn.style.backgroundColor = 'rgba(22, 119, 255, 1)';
                    redPacketBtn.style.color = 'hsla(0, 0%, 100%, 1.00)';
                    redPacketBtn.style.borderRadius = '5px';
                    redPacketBtn.style.marginBottom = '15px';
                    redPacketBtn.style.fontWeight = 'bold';
                    redPacketBtn.style.fontSize = '16px';
                    redPacketBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                    redPacketBtn.onclick = () => {
                        GM_openInTab('https://h5.ele.me/adminiappsub/pages/h5/index?configKey=BDLM_ELE_H5_DG_TC&scene=59c780f481ff45b096f427b2312ec45a');
                    };
                    container.insertBefore(redPacketBtn, container.firstChild);
                }

                // 创建日志面板
                const logPanel = createLogPanel();
                if (!logPanel.parentNode) {
                    logPanel.style.backgroundColor = 'rgba(0,0,0,0.85)';
                    logPanel.style.color = '#fff';
                    logPanel.style.padding = '10px';
                    logPanel.style.borderRadius = '5px';
                    logPanel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                    logPanel.style.maxHeight = '150px';
                    logPanel.style.overflow = 'auto';
                    logPanel.style.fontFamily = 'Consolas, Monaco, monospace';
                    logPanel.style.fontSize = '12px';
                    logPanel.style.lineHeight = '1.5';
                    container.appendChild(logPanel);
                }

                // 检查切换按钮是否已存在
                let logToggle = document.getElementById('auto-learner-log-toggle');
                if (!logToggle) {
                    logToggle = document.createElement('div');
                    logToggle.id = 'auto-learner-log-toggle';
                    logToggle.textContent = '隐藏日志 ▲';
                    logToggle.style.cursor = 'pointer';
                    logToggle.style.textAlign = 'center';
                    logToggle.style.padding = '5px';
                    logToggle.style.backgroundColor = 'rgba(0,0,0,0.7)';
                    logToggle.style.color = '#fff';
                    logToggle.style.borderRadius = '5px';
                    logToggle.onclick = () => {
                        logPanel.style.display = logPanel.style.display === 'none' ? 'block' : 'none';
                        logToggle.textContent = logPanel.style.display === 'none' ? '显示日志 ▲' : '隐藏日志 ▼';
                    };
                    container.appendChild(logToggle);
                }

                // 检查进度条容器是否已存在
                let progressContainer = document.getElementById('auto-learner-progress-container');
                if (!progressContainer) {
                    progressContainer = document.createElement('div');
                    progressContainer.id = 'auto-learner-progress-container';
                    progressContainer.style.backgroundColor = 'rgba(255,255,255,0.95)';
                    progressContainer.style.padding = '15px';
                    progressContainer.style.borderRadius = '5px';
                    progressContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                    container.appendChild(progressContainer);
                }

                // 添加初始等待和提示
                showAlert('脚本正在初始化', 'info');
                await delay(500);

                // ============ 检测当前学习模块 ============
                const currentModule = detectLearningModule();
                log(`当前学习模块: ${currentModule}`);
                
                // 显示模块信息
                const assessItemPart = document.querySelector('.assessItem-part');
                let moduleInfoHTML = '';
                if (assessItemPart) {
                    const allModules = assessItemPart.querySelectorAll('.item-title');
                    moduleInfoHTML = `
                        <div id="module-info">
                            <h3>学习模块</h3>
                            ${Array.from(allModules).map(module => {
                                const moduleName = module.textContent.trim();
                                const isActive = module.closest('.item-one').classList.contains('assess-active');
                                return `
                                    <div class="module-item">
                                        <span class="module-label">${moduleName}</span>
                                        <span class="module-value ${isActive ? 'module-active' : 'module-inactive'}">
                                            ${isActive ? '✓ 当前' : ''}
                                        </span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `;
                }

                // ============ 获取考核信息 ============
                const assessmentInfo = parseAssessmentInfo();
                if (assessmentInfo) {
                    log(`考核要求: ${assessmentInfo.required}学时, 已选择: ${assessmentInfo.selected}学时, 已完成: ${assessmentInfo.completed}学时`);

                    // 显示考核信息
                    const assessmentProgress = Math.min(100, (assessmentInfo.completed / assessmentInfo.required) * 100);
                    progressContainer.innerHTML = moduleInfoHTML + `
                        <div id="assessment-info">
                            <h3>考核进度 (${currentModule})</h3>
                            <div class="info-item">
                                <span class="info-label">考核要求:</span>
                                <span class="info-value">${assessmentInfo.required}学时</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">已选择课程:</span>
                                <span class="info-value">${assessmentInfo.selected}学时</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">已完成:</span>
                                <span class="info-value ${assessmentInfo.completed >= assessmentInfo.required ? 'completed' : 'not-completed'}">
                                    ${assessmentInfo.completed}学时 (${assessmentProgress.toFixed(1)}%)
                                </span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${assessmentProgress}%"></div>
                            </div>
                            <div style="text-align: center; font-size: 12px; color: #666;">
                                ${assessmentInfo.completed >= assessmentInfo.required ? '✅ 考核已完成' : `还需完成 ${(assessmentInfo.required - assessmentInfo.completed).toFixed(2)} 学时`}
                            </div>
                        </div>
                    `;

                    // 如果已完成的学时已经达到考核要求
                    if (assessmentInfo.completed >= assessmentInfo.required) {
                        log(`✅ ${currentModule}考核已完成! 已完成 ${assessmentInfo.completed}学时，达到要求 ${assessmentInfo.required}学时`);
                        showAlert(`${currentModule}考核已完成！已完成 ${assessmentInfo.completed}学时，达到要求 ${assessmentInfo.required}学时`, 'success');
                        
                        // 检查当前模块
                        if (currentModule === '通识课学习') {
                            // 通识课完成，尝试切换到专业课
                            log('通识课已完成，尝试切换到专业课学习...');
                            const switched = await switchToProfessionalCourse();
                            
                            if (switched) {
                                log('切换到专业课学习成功，等待页面重新加载...');
                                await delay(3000);
                                
                                // 重新开始处理课程列表页
                                retryCount = 0;
                                continue;
                            } else {
                                log('切换到专业课失败，继续检查其他逻辑', 'warning');
                                
                                // 如果切换失败，显示完成信息
                                progressContainer.innerHTML = moduleInfoHTML + `
                                    <div id="assessment-info">
                                        <h3 style="color: #4CAF50; text-align: center;">✅ 通识课学习已完成</h3>
                                        <div class="info-item">
                                            <span class="info-label">考核要求:</span>
                                            <span class="info-value">${assessmentInfo.required}学时</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">已完成:</span>
                                            <span class="info-value completed">${assessmentInfo.completed}学时</span>
                                        </div>
                                        <div class="completion-banner">
                                            <div class="completion-icon">✅</div>
                                            <h3>通识课学习已完成</h3>
                                            <div class="completion-message">请手动切换到专业课学习，或等待脚本自动切换</div>
                                        </div>
                                    </div>
                                `;
                                return;
                            }
                        } else if (currentModule === '专业课学习') {
                            log('专业课已完成，所有考核完成');
                            // 显示完成信息
                            progressContainer.innerHTML = moduleInfoHTML + `
                                <div id="assessment-info">
                                    <h3 style="color: #4CAF50; text-align: center;">🎉 所有考核已完成</h3>
                                    <div class="info-item">
                                        <span class="info-label">考核要求:</span>
                                        <span class="info-value">${assessmentInfo.required}学时</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">已完成:</span>
                                        <span class="info-value completed">${assessmentInfo.completed}学时</span>
                                    </div>
                                    <div class="completion-banner">
                                        <div class="completion-icon">🎉</div>
                                        <h3>所有学习任务已完成</h3>
                                        <div class="completion-message">您可以继续手动学习其他课程，或关闭此页面</div>
                                    </div>
                                </div>
                            `;
                            return;
                        } else {
                            log(`未知模块 ${currentModule} 已完成，继续处理`);
                        }

                        // 检查下一页按钮
                        try {
                            const nextPageBtn = await waitForClickableElement('.btn-next:not([disabled])', 5000).catch(() => null);
                            if (nextPageBtn) {
                                log('跳转到下一页...');
                                await safeClick('.btn-next:not([disabled])');
                                await waitForElement('.el-table__body', 5000);
                                log('下一页加载完成');
                                retryCount = 0;
                                continue;
                            } else {
                                // 显示完成信息
                                progressContainer.innerHTML = moduleInfoHTML + `
                                    <div id="assessment-info">
                                        <h3 style="color: #4CAF50; text-align: center;">🎉 恭喜！所有考核已完成</h3>
                                        <div class="info-item">
                                            <span class="info-label">考核要求:</span>
                                            <span class="info-value">${assessmentInfo.required}学时</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">已完成:</span>
                                            <span class="info-value completed">${assessmentInfo.completed}学时</span>
                                        </div>
                                        <div class="completion-banner">
                                            <div class="completion-icon">✅</div>
                                            <h3>所有学习任务已完成</h3>
                                            <div class="completion-message">您可以继续手动学习其他课程，或关闭此页面</div>
                                        </div>
                                    </div>
                                `;
                                return;
                            }
                        } catch (error) {
                            log(`翻页失败: ${error.message}`, 'error');
                            throw error;
                        }
                    }
                } else {
                    log('无法获取考核信息，使用旧的逻辑', 'warning');
                    progressContainer.innerHTML = moduleInfoHTML + '<div style="color: #FF5722; padding: 10px;">无法获取考核信息</div>';
                }

                // ============ 获取所有课程 ============
                const allRows = Array.from(document.querySelectorAll('.el-table__row'));
                log(`共找到 ${allRows.length} 个课程`);

                // 找出未完成课程（进度<100%）
                const unfinishedCourses = allRows.filter(row => {
                    const progressTextElement = row.querySelector('.el-progress__text');
                    if (!progressTextElement) {
                        return true;
                    }

                    const progressText = progressTextElement.textContent.trim();
                    const match = progressText.match(/(\d+)/);
                    if (!match) {
                        return true;
                    }

                    const progress = parseInt(match[1], 10);
                    return progress < 100;
                });

                log(`找到 ${unfinishedCourses.length} 个未完成课程`);

                // 检查是否有课程卡在90%-99%进度
                const stuckCourses = allRows.filter(row => {
                    const progressText = row.querySelector('.el-progress__text')?.textContent.trim() || '0%';
                    const match = progressText.match(/(\d+)/);
                    const progressPercent = match ? parseInt(match[1], 10) : 0;
                    return progressPercent >= 90 && progressPercent < 100;
                });

                if (stuckCourses.length > 0) {
                    stuckCourses.forEach(course => {
                        const courseName = course.querySelector('.course-name')?.textContent || '未知课程';
                        const progressText = course.querySelector('.el-progress__text')?.textContent.trim() || '0%';
                        log(`检测到课程可能卡住: ${courseName}，进度: ${progressText}`, 'warning');
                    });
                }

                if (unfinishedCourses.length > 0) {
                    await processUnfinishedCourses(unfinishedCourses, progressContainer, currentModule);
                    return;
                }

                // ============ 翻页检查逻辑 ============
                // 检查下一页按钮
                try {
                    const nextPageBtn = await waitForClickableElement('.btn-next:not([disabled])', 5000).catch(() => null);
                    
                    // 如果没有下一页按钮
                    if (!nextPageBtn) {
                        // 检查是否有添加选修课按钮
                        const addCourseBtn = document.querySelector('.btn.add-course');
                        
                        if (assessmentInfo && assessmentInfo.completed < assessmentInfo.required) {
                            // 未达到考核要求，显示提示
                            progressContainer.innerHTML = `
                                ${moduleInfoHTML}
                                <div id="assessment-info">
                                    <h3>⚠️ 考核未完成，请添加课程</h3>
                                    <div class="info-item">
                                        <span class="info-label">考核要求:</span>
                                        <span class="info-value">${assessmentInfo.required}学时</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">已完成:</span>
                                        <span class="info-value not-completed">${assessmentInfo.completed}学时</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">还需完成:</span>
                                        <span class="info-value not-completed">${(assessmentInfo.required - assessmentInfo.completed).toFixed(2)}学时</span>
                                    </div>
                                    <div style="margin-top: 15px; text-align: center;">
                                        ${addCourseBtn ? 
                                            '<p style="color: #666; margin-bottom: 10px;">当前页没有更多课程，请点击"添加选修课"按钮添加更多课程</p>' : 
                                            '<p style="color: #FF5722; margin-bottom: 10px;">当前页没有未完成课程，且没有更多课程可供学习</p>'}
                                        <div style="color: #888; font-size: 12px; margin-top: 10px;">
                                            当前模块: ${currentModule}
                                        </div>
                                    </div>
                                </div>
                            `;
                            
                            log(`⚠️ 考核未完成: 需要 ${assessmentInfo.required}学时，当前已完成 ${assessmentInfo.completed}学时`);
                            log(`当前页没有更多未完成课程，请添加更多课程`);
                            
                            // 如果有卡住的课程，显示特殊提示
                            if (stuckCourses.length > 0) {
                                const stuckCourseName = stuckCourses[0].querySelector('.course-name')?.textContent || '未知课程';
                                const stuckProgress = stuckCourses[0].querySelector('.el-progress__text')?.textContent.trim();
                                showAlert(`注意: 课程"${stuckCourseName}"可能卡在${stuckProgress}，建议手动检查或添加新课程`, 'warning');
                            }
                            
                            // 停止循环，等待用户操作
                            return;
                        } else if (assessmentInfo && assessmentInfo.completed >= assessmentInfo.required) {
                            // 考核已完成，显示完成信息
                            progressContainer.innerHTML = moduleInfoHTML + `
                                <div id="assessment-info">
                                    <h3 style="color: #4CAF50; text-align: center;">🎉 恭喜！所有考核已完成</h3>
                                    <div class="info-item">
                                        <span class="info-label">考核要求:</span>
                                        <span class="info-value">${assessmentInfo.required}学时</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">已完成:</span>
                                        <span class="info-value completed">${assessmentInfo.completed}学时</span>
                                    </div>
                                    <div class="completion-banner">
                                        <div class="completion-icon">✅</div>
                                        <h3>所有学习任务已完成</h3>
                                        <div class="completion-message">您可以继续手动学习其他课程，或关闭此页面</div>
                                    </div>
                                </div>
                            `;
                            
                            log('🎉 所有考核已完成！');
                            showAlert('所有考核已完成！', 'success');
                            
                            // 停止脚本的进一步执行
                            return;
                        } else {
                            progressContainer.innerHTML = moduleInfoHTML + '<div style="color: #FF5722; font-weight: bold; padding: 20px; text-align: center;">⚠️ 当前页没有未完成课程，但没有下一页</div>';
                            log('当前页没有未完成课程，但没有下一页');
                        }
                    } else {
                        // 有下一页，点击翻页
                        log('跳转到下一页...');
                        await safeClick('.btn-next:not([disabled])');
                        await waitForElement('.el-table__body', 5000);
                        log('下一页加载完成');
                        retryCount = 0;
                        continue;
                    }
                } catch (error) {
                    log(`翻页失败: ${error.message}`, 'error');
                    throw error;
                }

            } catch (error) {
                retryCount++;
                log(`处理出错 (${retryCount}/${maxRetries}): ${error.message}`, 'error');
                if (retryCount >= maxRetries) {
                    showAlert('处理失败: ' + error.message);
                    return;
                }
                await delay(3000);
            }
        }
    };

    // 处理未完成课程
    const processUnfinishedCourses = async (unfinishedCourses, progressContainer, currentModule) => {
        if (unfinishedCourses.length === 0) return;

        const course = unfinishedCourses[0];
        const courseName = course.querySelector('.course-name')?.textContent || '未知课程';
        const durationCell = course.querySelector('.el-table_1_column_2 .cell');
        const duration = durationCell ? durationCell.firstElementChild?.textContent?.trim() : '未知时长';
        const progressText = course.querySelector('.el-progress__text')?.textContent.trim() || '0%';

        const match = progressText.match(/(\d+)/);
        const progressPercent = match ? parseInt(match[1], 10) : 0;

        if (progressPercent >= 100) {
            log(`警告：选择的课程进度已经是 ${progressPercent}%，可能存在显示延迟`);
            log('刷新页面重新检查...');
            await delay(2000);
            location.reload();
            return;
        }

        course.classList.add('current-course');
        log(`开始学习未完成课程: ${courseName}, 时长: ${duration}, 当前进度: ${progressText}, 模块: ${currentModule}`);

        // 如果课程进度已经很高（比如90%以上），跳过它，学习下一个
        if (progressPercent >= 90 && unfinishedCourses.length > 1) {
            log(`课程进度已达到 ${progressPercent}%，跳过此课程，学习下一个`);
            
            // 选择下一个课程
            const nextCourse = unfinishedCourses[1];
            const nextCourseName = nextCourse.querySelector('.course-name')?.textContent || '未知课程';
            log(`将尝试学习下一个课程: ${nextCourseName}`);

            // 点击下一个课程的学习按钮
            const nextStudyBtn = nextCourse.querySelector('.study-btn');
            if (nextStudyBtn) {
                nextStudyBtn.click();
                log(`已点击学习按钮: ${nextCourseName}`);
                await delay(3000);
                return;
            }
        }

        const studyBtn = course.querySelector('.study-btn');
        if (studyBtn) {
            studyBtn.click();
            log('已点击学习按钮');
            await delay(6000);
            return;
        } else {
            log('未找到学习按钮，尝试刷新页面', 'error');
            location.reload();
        }
    };

    // 处理视频播放页
    const handleVideoPage = async () => {
        log('开始处理视频播放页...');

        // 创建视频页日志容器
        const createVideoLogContainer = () => {
            if (document.getElementById('auto-learner-video-container')) return;

            const container = document.createElement('div');
            container.id = 'auto-learner-video-container';
            container.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 99998;
                width: 320px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);

            // 创建日志面板
            const logPanel = createVideoLogPanel();
            if (!logPanel.parentNode) {
                logPanel.style.backgroundColor = 'rgba(0,0,0,0.85)';
                logPanel.style.color = '#fff';
                logPanel.style.padding = '10px';
                logPanel.style.borderRadius = '5px';
                logPanel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                logPanel.style.maxHeight = '150px';
                logPanel.style.overflow = 'auto';
                logPanel.style.fontFamily = 'Consolas, Monaco, monospace';
                logPanel.style.fontSize = '12px';
                logPanel.style.lineHeight = '1.5';
                container.appendChild(logPanel);
            }

            // 创建切换按钮
            let logToggle = document.getElementById('auto-learner-video-log-toggle');
            if (!logToggle) {
                logToggle = document.createElement('div');
                logToggle.id = 'auto-learner-video-log-toggle';
                logToggle.textContent = '隐藏日志 ▲';
                logToggle.style.cursor = 'pointer';
                logToggle.style.textAlign = 'center';
                logToggle.style.padding = '5px';
                logToggle.style.backgroundColor = 'rgba(0,0,0,0.7)';
                logToggle.style.color = '#fff';
                logToggle.style.borderRadius = '5px';
                logToggle.onclick = () => {
                    logPanel.style.display = logPanel.style.display === 'none' ? 'block' : 'none';
                    logToggle.textContent = logPanel.style.display === 'none' ? '显示日志 ▲' : '隐藏日志 ▼';
                };
                container.appendChild(logToggle);
            }

            return container;
        };

        // 创建一个模拟用户交互的函数
        const simulateUserInteraction = async () => {
            log('尝试模拟用户交互...');

            try {
                const body = document.body || document.documentElement;
                if (body) {
                    body.click();
                    log('已点击页面');
                }

                const videoContainer = document.querySelector('.videoBox') ||
                                      document.querySelector('.xgplayer') ||
                                      document.querySelector('#video-Player');

                if (videoContainer) {
                    videoContainer.click();
                    log('已点击视频区域');
                }

                try {
                    const spaceEvent = new KeyboardEvent('keydown', {
                        key: ' ',
                        code: 'Space',
                        keyCode: 32,
                        bubbles: true
                    });
                    document.dispatchEvent(spaceEvent);
                    log('已模拟空格键');
                } catch (e) {
                    log(`键盘事件失败，使用简单方式: ${e.message}`, 'warning');
                }

                log('已模拟用户交互');
                await delay(1000);

            } catch (error) {
                log(`模拟用户交互失败: ${error.message}`, 'error');
            }
        };

        // 增强的视频播放函数
        const tryPlayVideoEnhanced = async () => {
            log('开始尝试播放视频...');

            await simulateUserInteraction();

            let success = false;
            let attempts = 0;
            const maxAttempts = 5;

            while (!success && attempts < maxAttempts) {
                attempts++;
                log(`播放尝试 ${attempts}/${maxAttempts}`);

                try {
                    const videoElement = document.querySelector('#video-Player video') || document.querySelector('video');

                    if (!videoElement) {
                        log('未找到video元素', 'error');
                        await delay(2000);
                        continue;
                    }

                    videoElement.muted = true;
                    log('已设置视频静音');

                    try {
                        await videoElement.play();
                        log('视频播放成功');
                        success = true;
                    } catch (playError) {
                        log(`直接播放失败: ${playError.message}`, 'error');

                        const playBtn = document.querySelector('.xgplayer-play') ||
                                      document.querySelector('.xgplayer-start') ||
                                      document.querySelector('.xgplayer-play .xgplayer-icon') ||
                                      document.querySelector('.xgplayer-start .xgplayer-icon');

                        if (playBtn) {
                            log('尝试点击播放按钮');
                            playBtn.click();

                            await delay(1500);

                            try {
                                await videoElement.play();
                                log('点击播放按钮后播放成功');
                                success = true;
                            } catch (retryError) {
                                log(`重试播放失败: ${retryError.message}`, 'error');
                            }
                        }
                    }

                } catch (error) {
                    log(`播放尝试出错: ${error.message}`, 'error');
                }

                if (!success) {
                    await delay(2000);
                    await simulateUserInteraction();
                }
            }

            if (!success) {
                log(`经过${maxAttempts}次尝试后，无法播放视频`, 'error');
                showAlert('需要手动点击播放按钮开始学习', 'error');
            }

            return success;
        };

        // 切换到指定索引的视频并尝试播放
        const switchToVideoAndPlay = async (index) => {
            const allVideos = Array.from(document.querySelectorAll('.videorevision-catalogue-single'));

            if (index >= 0 && index < allVideos.length) {
                const videoElement = allVideos[index];
                const videoName = videoElement.querySelector('.videorevision-catalogue-single-name')?.textContent || `视频${index + 1}`;

                log(`尝试切换到视频: ${videoName}`);

                if (videoElement.classList.contains('on')) {
                    log('已经是当前视频，尝试直接播放');
                } else {
                    const currentSelected = document.querySelector('.videorevision-catalogue-single.on');
                    if (currentSelected) {
                        currentSelected.classList.remove('on');
                    }

                    try {
                        videoElement.click();
                        videoElement.classList.add('on');
                        log(`已点击切换到: ${videoName}`);

                        await delay(4000);
                    } catch (error) {
                        log(`切换视频失败: ${error.message}`, 'error');
                        return false;
                    }
                }

                return await tryPlayVideoEnhanced();
            }

            return false;
        };

        // 更新状态函数
        const updateStatus = (message) => {
            const statusEl = document.getElementById('video-status');
            if (statusEl) statusEl.textContent = `状态: ${message}`;
        };

        // 返回课程列表的改进函数
        const returnToCourseList = async () => {
            log('准备返回课程列表...');
            updateStatus('返回课程列表...');

            try {
                const courseListUrl = getCourseListUrl();
                log(`返回课程列表URL: ${courseListUrl}`);

                window.location.href = courseListUrl;
            } catch (error) {
                log(`返回课程列表时出错: ${error.message}`, 'error');
                showAlert('自动返回失败，将手动跳转到课程列表', 'warning');
                await delay(2000);
                window.location.href = 'https://www.ttcdw.cn/p/uc/myClassroom';
            }
        };

        // 创建简化控制面板（带隐藏功能）
        const createSimpleControlPanel = () => {
            if (document.getElementById('video-control-panel')) return;

            const panel = document.createElement('div');
            panel.id = 'video-control-panel';
            panel.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(0,0,0,0.85);
                color: white;
                padding: 10px;
                border-radius: 8px;
                z-index: 100000;
                width: 300px;
                font-family: Arial, sans-serif;
                border: 2px solid #4CAF50;
                transition: all 0.3s ease;
            `;

            panel.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="font-weight: bold; color: #4CAF50;">视频控制</div>
                    <button id="toggle-control-panel" style="background: none; border: none; color: #ccc; cursor: pointer; font-size: 16px; padding: 0 5px;" title="隐藏控制面板">▲</button>
                </div>
                <div id="control-panel-content" style="transition: opacity 0.3s ease;">
                    <div style="font-size: 12px; margin-bottom: 8px;" id="video-status">状态: 初始化...</div>
                    <div style="font-size: 10px; color: #ccc; margin-bottom: 8px; word-break: break-all;">
                        课程列表: ${getCourseListUrl()}
                    </div>
                    <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                        <button id="manual-play-btn" style="flex: 1; background: #4CAF50; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            手动播放
                        </button>
                        <button id="refresh-page-btn" style="flex: 1; background: #2196F3; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            刷新页面
                        </button>
                        <button id="mute-btn" style="flex: 1; background: #FF9800; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            静音/取消
                        </button>
                    </div>
                    <div style="margin-top: 8px;">
                        <button id="return-course-btn" style="width: 100%; background: #9C27B0; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold;">
                            返回课程列表
                        </button>
                    </div>
                    <div style="font-size: 10px; color: #ccc; margin-top: 8px; border-top: 1px solid #444; padding-top: 5px;">
                        提示: 如果自动播放失败，请手动点击"播放"按钮
                    </div>
                </div>
            `;

            document.body.appendChild(panel);

            // 添加控制面板隐藏/显示功能
            const toggleBtn = document.getElementById('toggle-control-panel');
            const panelContent = document.getElementById('control-panel-content');
            let isPanelCollapsed = false;

            toggleBtn.addEventListener('click', () => {
                isPanelCollapsed = !isPanelCollapsed;
                
                if (isPanelCollapsed) {
                    panelContent.style.display = 'none';
                    toggleBtn.innerHTML = '▼';
                    toggleBtn.title = '显示控制面板';
                    panel.style.width = '120px';
                    panel.style.height = '40px';
                    panel.style.padding = '5px';
                    panel.style.overflow = 'hidden';
                    log('控制面板已隐藏');
                } else {
                    panelContent.style.display = 'block';
                    toggleBtn.innerHTML = '▲';
                    toggleBtn.title = '隐藏控制面板';
                    panel.style.width = '300px';
                    panel.style.height = 'auto';
                    panel.style.padding = '10px';
                    panel.style.overflow = 'visible';
                    log('控制面板已显示');
                }
            });

            // 添加其他按钮的事件监听
            document.getElementById('manual-play-btn').addEventListener('click', async () => {
                log('手动播放按钮被点击');
                await tryPlayVideoEnhanced();
            });

            document.getElementById('refresh-page-btn').addEventListener('click', () => {
                location.reload();
            });

            document.getElementById('mute-btn').addEventListener('click', () => {
                const video = document.querySelector('#video-Player video') || document.querySelector('video');
                if (video) {
                    video.muted = !video.muted;
                    log(`已${video.muted ? '静音' : '取消静音'}视频`);
                    showAlert(`已${video.muted ? '静音' : '取消静音'}视频`, 'info');
                }
            });

            document.getElementById('return-course-btn').addEventListener('click', async () => {
                log('手动返回课程列表按钮被点击');
                await returnToCourseList();
            });

            return panel;
        };

        try {
            // 创建视频页日志容器
            createVideoLogContainer();

            // 等待播放器加载
            log('等待视频播放器加载...');
            await waitForElement('#video-Player', 15000);
            log('视频播放器加载完成');

            // 创建控制面板
            createSimpleControlPanel();

            // 先模拟一次用户交互
            updateStatus('模拟用户交互...');
            await simulateUserInteraction();

            // 获取所有视频
            const allVideos = Array.from(document.querySelectorAll('.videorevision-catalogue-single'));
            log(`共找到 ${allVideos.length} 个视频章节`);

            // 查找第一个未完成的视频
            let targetVideoIndex = -1;

            for (let i = 0; i < allVideos.length; i++) {
                const video = allVideos[i];
                const progressText = video.querySelector('.videorevision-catalogue-single-progress-text')?.textContent;
                const match = progressText ? progressText.match(/(\d+)%/) : null;
                const progress = match ? parseInt(match[1]) : 0;

                if (progress < 100) {
                    targetVideoIndex = i;
                    log(`找到未完成视频: 索引 ${i}, 进度 ${progress}%`);
                    break;
                }
            }

            if (targetVideoIndex === -1) {
                log('所有视频都已完成，返回课程列表');
                updateStatus('所有视频已完成');
                showAlert('所有视频学习完成，即将返回课程列表', 'success');
                await delay(3000);
                await returnToCourseList();
                return;
            }

            // 切换到未完成的视频并尝试播放
            updateStatus(`切换到视频 ${targetVideoIndex + 1}...`);
            const playSuccess = await switchToVideoAndPlay(targetVideoIndex);

            if (playSuccess) {
                updateStatus(`视频 ${targetVideoIndex + 1} 播放中`);
                log('视频开始播放，开始监控进度');
            } else {
                updateStatus('播放失败，请手动操作');
                log('自动播放失败，等待手动操作', 'warning');
            }

            // 设置监控间隔
            let checkCount = 0;
            const monitorInterval = setInterval(async () => {
                try {
                    checkCount++;

                    // 检查视频是否在播放
                    const videoElement = document.querySelector('#video-Player video') || document.querySelector('video');
                    const isPlaying = videoElement && !videoElement.paused;

                    // 确保视频静音
                    if (videoElement && !videoElement.muted) {
                        videoElement.muted = true;
                        log('检测到视频未静音，已重新设置静音');
                    }

                    if (!isPlaying && checkCount % 3 === 0) {
                        // 每3次检查尝试重新播放
                        log('检测到视频未播放，尝试重新播放');
                        updateStatus('尝试重新播放...');
                        await tryPlayVideoEnhanced();
                    }

                    // 检查当前视频进度
                    const currentVideo = document.querySelector('.videorevision-catalogue-single.on');
                    if (currentVideo) {
                        const progressText = currentVideo.querySelector('.videorevision-catalogue-single-progress-text')?.textContent;
                        const match = progressText ? progressText.match(/(\d+)%/) : null;
                        const progress = match ? parseInt(match[1]) : 0;

                        if (progress >= 100) {
                            log(`当前视频完成 (${progress}%)，准备下一个`);
                            updateStatus(`视频完成 ${progress}%`);

                            const currentIndex = Array.from(allVideos).indexOf(currentVideo);
                            if (currentIndex < allVideos.length - 1) {
                                // 切换到下一个视频
                                const nextIndex = currentIndex + 1;
                                const nextPlaySuccess = await switchToVideoAndPlay(nextIndex);
                                if (nextPlaySuccess) {
                                    // 新视频开始播放后，确保静音
                                    const nextVideoElement = document.querySelector('#video-Player video') || document.querySelector('video');
                                    if (nextVideoElement) {
                                        nextVideoElement.muted = true;
                                        log('切换到新视频，已设置静音');
                                    }
                                }
                            } else {
                                log('所有视频已完成，返回课程列表');
                                updateStatus('所有视频完成');
                                clearInterval(monitorInterval);

                                showAlert('所有视频学习完成，即将返回课程列表', 'success');
                                await delay(3000);
                                await returnToCourseList();
                            }
                        } else {
                            updateStatus(`播放中 (${progress}%)`);
                        }
                    }

                    // 设置倍速为3.0
                    const video = document.querySelector('video') || document.querySelector('#video-Player video');
                    if (video && video.playbackRate !== 3.0 && !isNaN(video.duration)) {
                        video.playbackRate = 3.0;
                        if (checkCount === 1) {
                            log('已设置3倍速播放');
                        }
                    }

                } catch (error) {
                    log(`监控出错: ${error.message}`, 'error');
                }
            }, 10000);

        } catch (error) {
            log(`初始化视频页出错: ${error.message}`, 'error');
            showAlert('初始化视频页失败');
            await delay(5000);
            location.reload();
        }
    };

    // 确保DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();