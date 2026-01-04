// ==UserScript==
// @name         xjtu雨课堂自动学习新脚本
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  辅助完成西安交通大学研究生的美育线上课程，自动处理章节列表和视频播放
// @author       XJ 国家特级不保护废物
// @match        https://www.yuketang.cn/v2/web/studentLog/*
// @match        https://www.yuketang.cn/v2/web/xcloud/video-student/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548990/xjtu%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E6%96%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/548990/xjtu%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E6%96%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 环境检查
    if (typeof window === 'undefined') {
        console.log('此脚本需要在浏览器环境中运行（如 Tampermonkey），请不要在 Node.js 中执行。');
        return;
    }

    // 配置与状态管理
    const config = {
        // 选择器配置
        selectors: {
            // 章节框架
            iframe: '.tab-pane-content-iframe',
            // 章节列表项
            chapterList: '.chapter-list',
            // 小节列表项
            sectionList: '.section-list',
            // 章节数量显示
            chapterCount: '.clearfix',
            // 章节数量文本
            countText: '.fr',
            // 节标题默认选择器
            sectionTitleDefault: '> .content .title',
            // 节标题备选选择器
            sectionTitleAlternative: '#app > div > div.wrap > div > div > div.study-content__container > div.main-box.clearfix > section.section-fr.fr > div:nth-child(2) > div.content > div.el-tooltip.leaf-detail > div.leaf-title.text-ellipsis > span',
            // 节完成状态选择器
            sectionStatus: '.el-tooltip .el-tooltip',
            // 返回按钮
            backButton: '.back > span',
            // 播放按钮
            playButton: 'xt-playbutton.xt_video_player_play_btn',
            // 静音按钮
            muteButton: 'xt-icon.xt_video_player_common_icon',
            // 视频当前播放时长
            currentTimeDisplay: 'span.white',
            // 视频总时长
            totalTimeDisplay: '.xt_video_player_current_time_display > span:nth-child(2)',
            // 播放器
            videoPlayer: 'xt-bigbutton.xt_video_player_big_play_layer'
        },
        // 等待间隔（毫秒）
        waitInterval: 1000,
        // 最大等待时间（毫秒）
        maxWaitTime: 3600000 // 1小时
    };

    // 初始化状态，优先从localStorage读取
    // 状态管理
    const state = {
        // 当前章节索引（从2开始，因为第一章是索引2）
        chapterIndex: parseInt(localStorage.getItem('xjtu_chapter_index')) || 2,
        // 当前小节索引（从1开始）
        sectionIndex: parseInt(localStorage.getItem('xjtu_section_index')) || 1,
        // 脚本状态：idle（空闲）, processing（处理中）, paused（已暂停）, done（已完成）
        status: localStorage.getItem('xjtu_script_status') || 'idle', // idle, processing, paused, done
        // 各章节的小节数量
        chapterSections: JSON.parse(localStorage.getItem('xjtu_chapter_sections') || '{}'),
        // 视频总时长
        totalVideoTime: 0,
        // 视频当前播放时长
        currentVideoTime: 0,
        // 视频播放状态：playing（正在播放）, paused（已暂停）
        videoStatus: 'unknown',
        // 面板信息
        panelInfo: {
            currentChapter: '--',
            currentSection: '--',
            status: '就绪',
            progress: '--:-- / --:--'
        }
    };

    // 尝试从localStorage读取状态，如果可用
    function loadState() {
        try {
            if (typeof localStorage !== 'undefined') {
                state.chapterIndex = parseInt(localStorage.getItem('xjtu_chapter_index') || '2', 10);
                state.sectionIndex = parseInt(localStorage.getItem('xjtu_section_index') || '1', 10);
                state.status = localStorage.getItem('xjtu_script_status') || 'idle';
                state.chapterSections = JSON.parse(localStorage.getItem('xjtu_chapter_sections') || '{}');
                log('状态已从localStorage加载');
            }
        } catch (error) {
            log('加载状态失败: ' + error.message);
            // 继续使用默认值
        }
    }

    // 保存状态到localStorage
    function saveState() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('xjtu_chapter_index', state.chapterIndex);
                localStorage.setItem('xjtu_section_index', state.sectionIndex);
                localStorage.setItem('xjtu_script_status', state.status);
                localStorage.setItem('xjtu_chapter_sections', JSON.stringify(state.chapterSections));
                log('状态已保存');
            }
        } catch (error) {
            log('保存状态失败: ' + error.message);
        }
    };

    // 创建悬浮菜单
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'auto-learn-panel';
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.width = '300px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        panel.style.color = 'white';
        panel.style.padding = '15px';
        panel.style.borderRadius = '8px';
        panel.style.zIndex = '9999';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.fontSize = '12px';
        panel.style.lineHeight = '1.5';
        panel.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        panel.style.backdropFilter = 'blur(5px)';

        // 面板标题
        const title = document.createElement('div');
        title.style.fontSize = '14px';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        title.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
        title.style.paddingBottom = '5px';
        title.textContent = 'xjtu雨课堂自动学习';

        // 章节信息
        const chapterInfo = document.createElement('div');
        chapterInfo.id = 'panel-chapter-info';
        chapterInfo.style.marginBottom = '5px';
        chapterInfo.textContent = `当前章节: ${state.panelInfo.currentChapter} - ${state.panelInfo.currentSection}`;

        // 状态信息
        const statusInfo = document.createElement('div');
        statusInfo.id = 'panel-status-info';
        statusInfo.style.marginBottom = '5px';
        statusInfo.textContent = `状态: ${state.panelInfo.status}`;

        // 进度信息
        const progressInfo = document.createElement('div');
        progressInfo.id = 'panel-progress-info';
        progressInfo.style.marginBottom = '5px';
        progressInfo.textContent = `进度: ${state.panelInfo.progress}`;

        // 指定章节控制区域
        const chapterControl = document.createElement('div');
        chapterControl.style.marginTop = '10px';
        chapterControl.style.padding = '10px';
        chapterControl.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        chapterControl.style.borderRadius = '5px';

        const chapterLabel = document.createElement('div');
        chapterLabel.textContent = '指定章节开始（2即为第一章）';
        chapterLabel.style.marginBottom = '5px';
        chapterLabel.style.fontSize = '11px';
        chapterLabel.style.color = 'rgba(255, 255, 255, 0.8)';

        const chapterInputContainer = document.createElement('div');
        chapterInputContainer.style.display = 'flex';
        chapterInputContainer.style.gap = '5px';
        chapterInputContainer.style.marginBottom = '5px';

        const chapterInput = document.createElement('input');
        chapterInput.type = 'number';
        chapterInput.placeholder = '章节号';
        chapterInput.style.width = '80px';
        chapterInput.style.padding = '3px';
        chapterInput.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        chapterInput.style.borderRadius = '3px';
        chapterInput.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        chapterInput.style.color = 'white';
        chapterInput.value = state.chapterIndex;

        const sectionInput = document.createElement('input');
        sectionInput.type = 'number';
        sectionInput.placeholder = '小节号';
        sectionInput.style.width = '80px';
        sectionInput.style.padding = '3px';
        sectionInput.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        sectionInput.style.borderRadius = '3px';
        sectionInput.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        sectionInput.style.color = 'white';
        sectionInput.value = state.sectionIndex;

        const setChapterBtn = document.createElement('button');
        setChapterBtn.textContent = '设置';
        setChapterBtn.style.flex = '1';
        setChapterBtn.style.padding = '3px';
        setChapterBtn.style.border = 'none';
        setChapterBtn.style.borderRadius = '3px';
        setChapterBtn.style.backgroundColor = '#1dd1a1';
        setChapterBtn.style.color = 'white';
        setChapterBtn.style.cursor = 'pointer';
        setChapterBtn.onclick = () => {
            const chapterNum = parseInt(chapterInput.value, 10);
            const sectionNum = parseInt(sectionInput.value, 10);

            if (!isNaN(chapterNum) && chapterNum > 0 && !isNaN(sectionNum) && sectionNum > 0) {
                if (confirm(`确定要从第${chapterNum}章第${sectionNum}节开始吗？`)) {
                    state.chapterIndex = chapterNum;
                    state.sectionIndex = sectionNum;
                    state.status = 'idle';
                    updatePanelDisplay(`第${chapterNum}章 - 第${sectionNum}节`, '就绪', '--:-- / --:--');
                    saveState();
                    log(`已设置从第${chapterNum}章第${sectionNum}节开始`);
                }
            } else {
                alert('请输入有效的章节号和小节号');
            }
        };

        chapterInputContainer.appendChild(chapterInput);
        chapterInputContainer.appendChild(sectionInput);
        chapterInputContainer.appendChild(setChapterBtn);
        chapterControl.appendChild(chapterLabel);
        chapterControl.appendChild(chapterInputContainer);

        // 控制按钮
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '5px';
        controls.style.marginTop = '10px';

        const pauseBtn = document.createElement('button');
        // 根据当前状态设置按钮文本
        pauseBtn.textContent = state.status === 'paused' ? '继续' : '暂停';
        pauseBtn.style.flex = '1';
        pauseBtn.style.padding = '5px';
        pauseBtn.style.border = 'none';
        pauseBtn.style.borderRadius = '3px';
        pauseBtn.style.backgroundColor = state.status === 'paused' ? '#1dd1a1' : '#ff6b6b';
        pauseBtn.style.color = 'white';
        pauseBtn.style.cursor = 'pointer';
        pauseBtn.onclick = () => {
            state.status = state.status === 'paused' ? 'processing' : 'paused';
            // 更新按钮文本和样式
            pauseBtn.textContent = state.status === 'paused' ? '继续' : '暂停';
            pauseBtn.style.backgroundColor = state.status === 'paused' ? '#1dd1a1' : '#ff6b6b';
            updatePanelDisplay();
            saveState(); // 保存状态到localStorage
            log(state.status === 'paused' ? '脚本已暂停' : '脚本已恢复');
        };

        const resetBtn = document.createElement('button');
        resetBtn.textContent = '重置';
        resetBtn.style.flex = '1';
        resetBtn.style.padding = '5px';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '3px';
        resetBtn.style.backgroundColor = '#48dbfb';
        resetBtn.style.color = 'black';
        resetBtn.style.cursor = 'pointer';
        resetBtn.onclick = () => {
            if (confirm('确定要重置脚本状态吗？')) {
                state.chapterIndex = 2;
                state.sectionIndex = 1;
                state.status = 'idle';
                state.chapterSections = {};
                updatePanelDisplay();
                log('脚本状态已重置');
            }
        };

        controls.appendChild(pauseBtn);
        controls.appendChild(resetBtn);
        panel.appendChild(title);
        panel.appendChild(chapterInfo);
        panel.appendChild(statusInfo);
        panel.appendChild(progressInfo);
        panel.appendChild(chapterControl);
        panel.appendChild(controls);

        document.body.appendChild(panel);

        // 添加拖拽功能
        let isDragging = false;
        let offsetX, offsetY;

        title.style.cursor = 'move';
        title.onmousedown = (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            panel.style.transition = 'none';
        };

        document.onmousemove = (e) => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.right = 'auto';
        };

        document.onmouseup = () => {
            if (isDragging) {
                isDragging = false;
                panel.style.transition = 'all 0.2s ease';
            }
        };
    }

    // 更新面板显示
    function updatePanelDisplay(chapterInfo, statusInfo, progressInfo) {
        if (chapterInfo) {
            state.panelInfo.currentChapter = chapterInfo.split(' - ')[0];
            state.panelInfo.currentSection = chapterInfo.split(' - ')[1] || '--';
        }
        if (statusInfo) {
            state.panelInfo.status = statusInfo;
        }
        if (progressInfo) {
            state.panelInfo.progress = progressInfo;
        }

        const chapterEl = document.getElementById('panel-chapter-info');
        const statusEl = document.getElementById('panel-status-info');
        const progressEl = document.getElementById('panel-progress-info');

        if (chapterEl) {
            chapterEl.textContent = `当前章节: ${state.panelInfo.currentChapter} - ${state.panelInfo.currentSection}`;
        }
        if (statusEl) {
            statusEl.textContent = `状态: ${state.panelInfo.status}`;
        }
        if (progressEl) {
            progressEl.textContent = `进度: ${state.panelInfo.progress}`;
        }
    }

    // 辅助函数
    function log(message) {
        console.log(`[xjtu雨课堂自动学习] ${message}`);
    }

    // 等待元素出现
    function waitForElement(selector, doc = document, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const interval = 500;
            const startTime = Date.now();
            const timer = setInterval(() => {
                const element = doc.querySelector(selector);
                if (element) {
                    clearInterval(timer);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(timer);
                    reject(new Error(`等待元素超时: 未能找到 "${selector}"`));
                }
            }, interval);
        });
    }

    // 等待条件满足
    function waitForCondition(condition, timeout = config.maxWaitTime) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkCondition = async () => {
                try {
                    // 检查脚本是否已暂停
                    if (state.status === 'paused') {
                        reject(new Error('脚本已暂停'));
                        return;
                    }

                    const result = await condition();
                    if (result) {
                        resolve(result);
                        return;
                    }

                    // 检查是否超时
                    if (Date.now() - startTime > timeout) {
                        const timeoutError = new Error(`等待条件满足超时，已等待${Math.round((Date.now() - startTime)/1000)}秒`);
                        timeoutError.code = 'TIMEOUT'; // 添加错误代码以便于特定处理
                        reject(timeoutError);
                        return;
                    }

                    // 继续检查
                    setTimeout(checkCondition, config.waitInterval);
                } catch (error) {
                    // 增强错误处理：记录详细的错误信息
                    log(`条件检查执行出错: ${error.message}`);

                    // 添加错误代码和上下文信息
                    error.code = error.code || 'CONDITION_ERROR';
                    error.originalError = error.originalError || error;

                    reject(error);
                }
            };

            // 开始检查前，先验证condition参数
            if (typeof condition !== 'function') {
                reject(new Error('waitForCondition: condition参数必须是一个函数'));
                return;
            }

            // 启动检查
            checkCondition();
        });
    }

    // 全局错误恢复机制
    async function recoverFromError(error) {
        log(`执行错误恢复程序: ${error.message}`);

        // 保存当前状态
        state.status = 'paused';
        saveState();

        // 根据错误类型执行不同的恢复策略
        if (error.code === 'TIMEOUT' || error.message.includes('超时')) {
            log('检测到超时错误，执行超时恢复策略');

            // 尝试强制刷新页面
            setTimeout(() => {
                log('强制刷新页面以尝试恢复');
                // 显示友好的提示信息
                alert('系统响应超时，正在刷新页面以恢复...');
                location.reload();
            }, 1000);
        } else if (error.code === 'VIDEO_PROCESSING_FAILED') {
            log('检测到视频处理失败错误，执行视频恢复策略');

            // 尝试返回章节列表页
            setTimeout(() => {
                log('尝试返回章节列表页');
                const backButton = document.querySelector(config.selectors.backButton);
                if (backButton) {
                    backButton.click();
                } else {
                    log('未找到返回按钮，强制刷新页面');
                    location.reload();
                }
            }, 1000);
        } else {
            log('检测到其他类型错误，执行通用恢复策略');

            // 显示错误信息并提供重试选项
            setTimeout(() => {
                if (confirm(`脚本执行出错：\n\n${error.message}\n\n是否尝试刷新页面以恢复？`)) {
                    location.reload();
                }
            }, 1000);
        }

        return false;
    }

    // 处理视频页面
    async function handleVideoPage() {
        log('检测到在视频页面，等待完成状态...');
        updatePanelDisplay(`第${state.chapterIndex - 1}章 - 第${state.sectionIndex}节`, `正在加载第${state.chapterIndex - 1}章第${state.sectionIndex}节视频`, '--:-- / --:--');

        if (state.status === 'paused') {
            log('脚本已暂停，等待恢复...');
            setTimeout(handleVideoPage, 2000);
            return;
        }

        // 增加重试机制
        let retries = 0;
        const maxRetries = 5; // 增加重试次数从3次到5次
        let success = false;

        // 添加恢复策略计数器
        const recoveryStrategies = [
            { name: '直接播放', used: false },
            { name: '暂停后播放', used: false },
            { name: '调整播放位置', used: false },
            { name: '刷新视频源', used: false },
            { name: '点击播放按钮', used: false }
        ];

        try {
            while (!success && retries < maxRetries) {
                try {
                    log(`视频页面处理尝试 #${retries + 1}/${maxRetries}`);

                    // 等待播放器加载完成 - 增加等待时间并添加日志
                    log('等待视频播放器加载...');
                    const videoPlayer = await waitForElement(config.selectors.videoPlayer, document, 20000);
                    log('视频播放器已加载完成');

                    // 获取视频总时长 - 增加备选选择器逻辑
                    let totalTimeText = '';
                    try {
                        const totalTimeElement = await waitForElement(config.selectors.totalTimeDisplay, document, 10000);
                        totalTimeText = totalTimeElement.textContent.trim();
                        state.totalVideoTime = parseVideoTime(totalTimeText);
                        log(`获取视频总时长成功: ${totalTimeText} (${state.totalVideoTime}秒)`);
                    } catch (error) {
                        // 如果获取总时长失败，尝试备选方案
                        log(`获取视频总时长失败: ${error.message}，尝试备选方案`);
                        // 假设一个默认时长，避免脚本完全停止
                        state.totalVideoTime = 600; // 默认10分钟
                        log(`使用默认视频时长: 10分钟`);
                    }

                    // 点击静音按钮
                    try {
                        const muteButton = await waitForElement(config.selectors.muteButton, document, 5000);
                        muteButton.click();
                        log('已点击静音按钮');
                    } catch (error) {
                        log(`点击静音按钮失败: ${error.message}`);
                    }

                    // 播放策略管理器：尝试多种方式播放视频
                    let videoElement = null;
                    let videoPlayed = false;

                    // 策略1: 直接查找视频元素并播放
                    try {
                        videoElement = document.querySelector('video');
                        if (videoElement) {
                            videoElement.focus();
                            log('已将焦点设置到视频元素');

                            // 在播放前先检查视频元素的就绪状态
                            if (videoElement.readyState >= 2) { // HAVE_CURRENT_DATA 或更高
                                if (videoElement.paused) {
                                    try {
                                        await videoElement.play();
                                        log('已通过video元素直接调用play方法，视频开始播放');
                                        videoPlayed = true;
                                    } catch (playError) {
                                        log(`直接调用play方法失败: ${playError.message}`);
                                    }
                                } else {
                                    log('视频已经在播放中');
                                    videoPlayed = true;
                                }
                            } else {
                                log('视频元素尚未就绪，状态码: ' + videoElement.readyState);
                                // 如果视频未就绪，添加一个小延迟再尝试
                                await new Promise(resolve => setTimeout(resolve, 500));
                            }
                        } else {
                            log('未找到视频元素');
                        }
                    } catch (error) {
                        log(`查找和播放视频元素时出错: ${error.message}`);
                    }

                    // 策略2: 如果第一种方法失败，使用更具体的选择器查找视频元素
                    if (!videoPlayed) {
                        try {
                            // 使用更通用的选择器尝试找到视频元素
                            videoElement = await waitForElement('video', document, 3000);
                            if (videoElement && videoElement.paused) {
                                try {
                                    await videoElement.play();
                                    log('已通过备选选择器找到并播放视频');
                                    videoPlayed = true;
                                } catch (altPlayError) {
                                    log(`使用备选选择器播放视频失败: ${altPlayError.message}`);
                                }
                            }
                        } catch (altError) {
                            log(`尝试备选播放方法失败: ${altError.message}`);
                        }
                    }

                    // 策略3: 如果前两种方法都失败，尝试触发播放按钮
                    if (!videoPlayed) {
                        try {
                            const playButton = document.querySelector(config.selectors.playButton);
                            if (playButton) {
                                playButton.click();
                                log('已尝试点击播放按钮');
                                // 给播放按钮一点时间响应
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                videoPlayed = true;
                            }
                        } catch (buttonError) {
                            log(`点击播放按钮失败: ${buttonError.message}`);
                        }
                    }

                    if (!videoPlayed) {
                        log('所有播放策略都失败，尝试直接设置状态并继续监控');
                        // 即使播放策略都失败，也继续尝试监控，可能视频实际上在播放
                    }

                    // 监控视频播放进度
                    // 优化：添加配置参数，增加灵活性
                    const PROGRESS_CHECK_INTERVAL = 1000; // 每秒检查一次
                    const STUCK_THRESHOLD = 3000; // 3秒无变化认为可能卡住
                    const MAX_CONSECUTIVE_NO_CHANGE = 3; // 最多允许3次连续无变化

                    let consecutiveNoChange = 0;
                    const previousProgress = { currentTime: 0, timestamp: Date.now() };
                    let progressCheckCount = 0;
                    let recoveryAttempts = 0;
                    const MAX_RECOVERY_ATTEMPTS = 3; // 增加最大恢复尝试次数到3次

                    // 定义恢复策略函数
                    const tryRecoveryStrategy = async (strategyIndex, videoElement) => {
                        // 如果策略已经使用过，则跳过
                        if (recoveryStrategies[strategyIndex].used) {
                            return false;
                        }

                        recoveryStrategies[strategyIndex].used = true;
                        const strategyName = recoveryStrategies[strategyIndex].name;

                        try {
                            log(`尝试恢复策略 #${strategyIndex + 1}: ${strategyName}`);

                            if (!videoElement) {
                                videoElement = document.querySelector('video');
                                if (!videoElement) {
                                    log('未找到视频元素，无法执行恢复策略');
                                    return false;
                                }
                                videoElement.focus();
                            }

                            switch (strategyIndex) {
                                case 0: // 直接播放
                                    await videoElement.play();
                                    log(`恢复策略成功: ${strategyName}`);
                                    return true;
                                case 1: // 暂停后播放
                                    videoElement.pause();
                                    await new Promise(resolve => setTimeout(resolve, 150));
                                    await videoElement.play();
                                    log(`恢复策略成功: ${strategyName}`);
                                    return true;
                                case 2: // 调整播放位置
                                    if (videoElement.currentTime > 0) {
                                        videoElement.currentTime = Math.max(0, videoElement.currentTime - 0.5);
                                        await videoElement.play();
                                        log(`恢复策略成功: ${strategyName}`);
                                        return true;
                                    }
                                    return false;
                                case 3: // 刷新视频源
                                    const originalSrc = videoElement.src;
                                    videoElement.src = '';
                                    await new Promise(resolve => setTimeout(resolve, 100));
                                    videoElement.src = originalSrc;
                                    videoElement.currentTime = state.currentVideoTime;
                                    await videoElement.play();
                                    log(`恢复策略成功: ${strategyName}`);
                                    return true;
                                case 4: // 点击播放按钮
                                    const playButton = document.querySelector(config.selectors.playButton);
                                    if (playButton) {
                                        playButton.click();
                                        log(`恢复策略成功: ${strategyName}`);
                                        return true;
                                    }
                                    return false;
                                default:
                                    return false;
                            }
                        } catch (recoveryError) {
                            log(`恢复策略 ${strategyName} 失败: ${recoveryError.message}`);
                            return false;
                        }
                    };

                    // 添加播放状态检测定时器
                    const playStatusCheckInterval = setInterval(() => {
                        const videoElement = document.querySelector('video');
                        if (videoElement) {
                            // 更新视频播放状态
                            state.videoStatus = videoElement.paused ? 'paused' : 'playing';

                            // 更新面板显示，包含播放状态
                            const formattedCurrentTime = formatTime(state.currentVideoTime);
                            const formattedTotalTime = formatTime(state.totalVideoTime);
                            const statusText = state.videoStatus === 'playing' ? '正在播放' : '已暂停';
                            updatePanelDisplay(null, `${statusText} 视频`, `${formattedCurrentTime} / ${formattedTotalTime}`);
                        }
                    }, 500); // 每500毫秒检查一次播放状态

                    await waitForCondition(async () => {
                        progressCheckCount++;
                        if (progressCheckCount % 10 === 0) { // 每10次检查记录一次日志
                            log(`持续监控视频进度中... 当前进度计数: ${progressCheckCount}`);
                        }

                        try {
                            // 获取当前播放时长 - 增加备选方案
                            let currentTimeElement = document.querySelector(config.selectors.currentTimeDisplay);
                            let currentTimeText = '';

                            // 如果主选择器失败，尝试备选方案
                            if (!currentTimeElement) {
                                log('未找到主进度显示元素，尝试备选方案');
                                const videoElement = document.querySelector('video');
                                if (videoElement) {
                                    state.currentVideoTime = videoElement.currentTime;
                                    log(`通过video元素获取当前时间: ${state.currentVideoTime.toFixed(2)}秒`);
                                } else {
                                    log('未找到视频元素，无法获取当前播放进度');
                                    // 每检查一次，增加一点进度，避免完全卡住
                                    state.currentVideoTime += 1;
                                }
                            } else {
                                currentTimeText = currentTimeElement.textContent.trim();
                                state.currentVideoTime = parseVideoTime(currentTimeText);
                            }

                            // 更新面板显示
                            const formattedCurrentTime = formatTime(state.currentVideoTime);
                            const formattedTotalTime = formatTime(state.totalVideoTime);
                            const statusText = state.videoStatus === 'playing' ? '正在播放' : '已暂停';
                            updatePanelDisplay(null, `${statusText} 视频`, `${formattedCurrentTime} / ${formattedTotalTime}`);

                            // 检查是否播放完成
                            if (state.currentVideoTime >= state.totalVideoTime - 2) { // 允许2秒误差
                                log('视频播放完成');
                                // 清除播放状态检测定时器
                                clearInterval(playStatusCheckInterval);
                                return true;
                            }

                            // 检测播放是否卡住 - 优化逻辑
                            const now = Date.now();

                            // 优化：使用更精确的进度检测，考虑浮点精度问题
                            const isProgressSame = Math.abs(state.currentVideoTime - previousProgress.currentTime) < 0.1; // 允许0.1秒的误差

                            if (isProgressSame && now - previousProgress.timestamp > STUCK_THRESHOLD) {
                                consecutiveNoChange++;
                                log(`视频进度未变化 ${consecutiveNoChange} 次，已超过${STUCK_THRESHOLD/1000}秒`);

                                // 优化版：依次尝试不同的恢复策略
                                recoveryAttempts++;

                                // 获取当前视频元素
                                let currentVideoElement = document.querySelector('video');
                                let recoverySuccess = false;

                                // 依次尝试不同的恢复策略，直到成功或所有策略都尝试过
                                for (let i = 0; i < recoveryStrategies.length && !recoverySuccess; i++) {
                                    recoverySuccess = await tryRecoveryStrategy(i, currentVideoElement);
                                    if (recoverySuccess) {
                                        // 重置连续无变化计数
                                        consecutiveNoChange = 0;
                                        break;
                                    }
                                }

                                // 如果所有恢复策略都失败，记录并准备刷新页面
                                if (!recoverySuccess) {
                                    log(`所有恢复策略都失败，连续无变化${consecutiveNoChange}次，恢复尝试${recoveryAttempts}次`);
                                }

                                // 如果连续多次尝试恢复都失败，考虑刷新页面
                                if (consecutiveNoChange >= MAX_CONSECUTIVE_NO_CHANGE || recoveryAttempts >= MAX_RECOVERY_ATTEMPTS) {
                                    log(`视频播放持续卡住，连续无变化${consecutiveNoChange}次，恢复尝试${recoveryAttempts}次，即将刷新页面`);

                                    // 保存当前状态，以便刷新后可以继续
                                    state.status = 'paused';
                                    saveState();

                                    // 清除播放状态检测定时器
                                    clearInterval(playStatusCheckInterval);

                                    // 添加小延迟再刷新，给最后一次恢复操作一点时间
                                    setTimeout(() => {
                                        log('执行页面刷新以恢复视频播放');
                                        location.reload();
                                    }, 1000);
                                    return false;
                                }
                            } else {
                                // 进度有变化，重置所有计数器
                                consecutiveNoChange = 0;
                                recoveryAttempts = 0;
                                previousProgress.currentTime = state.currentVideoTime;
                                previousProgress.timestamp = now;
                            }
                        } catch (error) {
                            log(`监控视频进度时出错: ${error.message}`);

                            // 特别处理常见错误类型
                            if (error.code === 'TIMEOUT') {
                                log('检测到超时错误，可能是网络问题或页面无响应');
                                // 尝试直接刷新页面
                                setTimeout(() => {
                                    log('因超时而刷新页面');
                                    location.reload();
                                }, 1000);
                            }

                            // 记录错误但继续监控，不中断整个流程
                        }
                        return false;
                    }, 180000); // 增加监控超时时间到3分钟，给视频更多播放时间

                    // 清除播放状态检测定时器
                    clearInterval(playStatusCheckInterval);

                    success = true; // 如果执行到这里，表示处理成功
                } catch (error) {
                    retries++;
                    log(`视频页面处理尝试 #${retries} 失败: ${error.message}`);

                    // 特别处理超时错误
                    if (error.code === 'TIMEOUT' || error.message.includes('超时')) {
                        log('检测到超时错误，尝试更快恢复...');

                        // 立即尝试刷新页面而不是等待下一次重试
                        if (retries >= maxRetries) {
                            log('已达到最大重试次数，执行紧急恢复...');
                            // 调用错误恢复函数
                            return await recoverFromError(error);
                        }
                    }

                    if (retries >= maxRetries) {
                        log('达到最大重试次数，视频页面处理失败');
                        // 增强错误处理：保存状态并提供明确的错误提示
                        state.status = 'paused';
                        saveState();

                        // 创建一个更友好的错误提示
                        const userMessage = `视频页面处理失败，已尝试${maxRetries}次。\n错误信息：${error.message}\n\n建议：\n1. 点击"继续"按钮重新尝试\n2. 刷新页面后再试\n3. 检查网络连接是否正常\n4. 确保您有完整的访问权限`;

                        log(`显示友好错误提示: ${userMessage}`);

                        // 创建自定义错误对象，包含更详细的信息
                        const customError = new Error(`视频页面处理失败，已尝试${maxRetries}次: ${error.message}`);
                        customError.code = 'VIDEO_PROCESSING_FAILED';
                        customError.originalError = error;

                        // 调用错误恢复函数
                        return await recoverFromError(customError);
                    } else {
                        log(`等待2秒后进行第${retries + 1}次尝试...`);
                        // 在重试前重置恢复策略
                        recoveryStrategies.forEach(strategy => {
                            strategy.used = false;
                        });
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
            }
        } catch (error) {
            log(`视频页面处理主循环出错: ${error.message}`);
            // 调用错误恢复函数
            return await recoverFromError(error);
        }

        // 完善视频处理函数结尾部分
        if (success) {
            // 视频播放完成后的处理逻辑
            try {
                await handleVideoCompletion();
            } catch (error) {
                log(`处理视频完成事件时出错: ${error.message}`);
                // 调用错误恢复函数
                return await recoverFromError(error);
            }
        }

        return success;
    }

    // 获取章节的小节数量
    async function getChapterSectionsCount(chapterIndex, iframeDoc) {
        try {
            // 构建选择器
            const countSelector = `${config.selectors.chapterCount}:nth-child(${chapterIndex}) > ${config.selectors.countText}`;
            const countElement = await waitForElement(countSelector, iframeDoc);

            // 提取数字
            const countText = countElement.textContent.trim();
            const match = countText.match(/\d+/);
            const count = match ? parseInt(match[0], 10) : 0;

            // 缓存结果
            state.chapterSections[chapterIndex] = count;
            log(`第 ${chapterIndex - 1} 章有 ${count} 个小节`);
            return count;
        } catch (error) {
            log(`获取第 ${chapterIndex - 1} 章小节数量失败: ${error.message}`);
            return 0;
        }
    }

    // 获取节标题文本
    async function getSectionTitle(chapterIndex, sectionIndex, iframeDoc) {
        try {
            // 首先尝试使用默认选择器
            const defaultSelector = `${config.selectors.chapterList}:nth-child(${chapterIndex}) ${config.selectors.sectionList}:nth-child(${sectionIndex}) ${config.selectors.sectionTitleDefault}`;
            let sectionElement = await waitForElement(defaultSelector, iframeDoc);
            let sectionTitle = sectionElement.textContent.trim();
            log(`使用默认选择器检测到第 ${chapterIndex - 1} 章第 ${sectionIndex} 节: ${sectionTitle}`);
            return {
                element: sectionElement,
                title: sectionTitle,
                selector: 'default'
            };
        } catch (defaultError) {
            log(`默认选择器查找失败: ${defaultError.message}，尝试使用备选选择器`);
            // 当默认选择器失败时，尝试使用备选选择器
            try {
                const alternativeSelector = `${config.selectors.sectionTitleAlternative}`;
                const sectionElement = await waitForElement(alternativeSelector, iframeDoc);
                const sectionTitle = sectionElement.textContent.trim();
                log(`使用备选选择器检测到第 ${chapterIndex - 1} 章: ${sectionTitle}`);
                return {
                    element: sectionElement,
                    title: sectionTitle,
                    selector: 'alternative'
                };
            } catch (alternativeError) {
                // 如果两个选择器都失败，则抛出错误
                throw new Error(`无法找到小节元素，两个选择器都失败：\n1. 默认选择器: ${defaultError.message}\n2. 备选选择器: ${alternativeError.message}`);
            }
        }
    }

    // 获取节的完成状态
    async function getSectionStatus(chapterIndex, sectionIndex, iframeDoc) {
        try {
            const statusSelector = `${config.selectors.chapterList}:nth-child(${chapterIndex}) ${config.selectors.sectionList}:nth-child(${sectionIndex}) ${config.selectors.sectionStatus}`;
            const statusElement = await waitForElement(statusSelector, iframeDoc);
            const statusText = statusElement.textContent.trim();
            log(`第 ${chapterIndex - 1} 章第 ${sectionIndex} 节的完成状态: ${statusText}`);
            return statusText;
        } catch (error) {
            log(`获取第 ${chapterIndex - 1} 章第 ${sectionIndex} 节的完成状态失败: ${error.message}`);
            return '未知';
        }
    }

    // 处理章节列表页面
    async function handleChapterListPage() {
        log(`当前状态: ${state.status} | 章节: ${state.chapterIndex - 1} | 小节: ${state.sectionIndex}`);
        updatePanelDisplay(`第${state.chapterIndex - 1}章`, '正在检查章节完成状态', '--:-- / --:--');

        if (state.status === 'paused') {
            log('脚本已暂停，等待恢复...');
            setTimeout(handleChapterListPage, 2000);
            return;
        }

        try {
            // 获取iframe
            updatePanelDisplay(`第${state.chapterIndex - 1}章`, '正在加载章节列表框架', '--:-- / --:--');
            const iframe = await waitForElement(config.selectors.iframe);
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            // 获取当前章节的小节数量（优先使用缓存）
            updatePanelDisplay(`第${state.chapterIndex - 1}章`, `正在获取第${state.chapterIndex - 1}章小节数量`, '--:-- / --:--');
            let sectionCount;
            // 检查是否已经缓存了该章节的小节数量
            if (state.chapterSections[state.chapterIndex]) {
                sectionCount = state.chapterSections[state.chapterIndex];
                log(`使用缓存的第 ${state.chapterIndex - 1} 章小节数量: ${sectionCount}`);
            } else {
                // 如果没有缓存，才调用函数获取
                sectionCount = await getChapterSectionsCount(state.chapterIndex, iframeDoc);
            }

            // 检查是否需要进入下一章
            if (state.sectionIndex > sectionCount) {
                updatePanelDisplay(`第${state.chapterIndex - 1}章`, `${state.chapterIndex - 1}章处理完毕，进入下一章`, '--:-- / --:--');
                log(`第 ${state.chapterIndex - 1} 章处理完毕，进入下一章`);
                state.chapterIndex++;
                state.sectionIndex = 1;
                setTimeout(handleChapterListPage, 1000);
                return;
            }

            // 获取小节标题
            updatePanelDisplay(`第${state.chapterIndex - 1}章`, `正在检查第${state.chapterIndex - 1}章第${state.sectionIndex}节内容`, '--:-- / --:--');
            const sectionInfo = await getSectionTitle(state.chapterIndex, state.sectionIndex, iframeDoc);
            const sectionTitle = sectionInfo.title;
            const sectionElement = sectionInfo.element;

            // 检查是否为练习题小节
            if (sectionTitle.includes('练习题')) {
                log(`第 ${state.chapterIndex - 1} 章第 ${state.sectionIndex} 节包含练习题，自动跳过`);
                updatePanelDisplay(`第${state.chapterIndex - 1}章 - 第${state.sectionIndex}节`, `跳过第${state.chapterIndex - 1}章第${state.sectionIndex}节（练习题）`, '--:-- / --:--');

                // 增加小节索引
                state.sectionIndex++;
                saveState(); // 保存状态到localStorage

                // 延迟1秒后继续处理下一个小节
                setTimeout(handleChapterListPage, 1000);
                return;
            }

            // 获取节的完成状态
            const sectionStatus = await getSectionStatus(state.chapterIndex, state.sectionIndex, iframeDoc);

            // 判断是否需要进入该节
            if (sectionStatus.includes('已完成')) {
                log(`第 ${state.chapterIndex - 1} 章第 ${state.sectionIndex} 节已完成，自动跳过`);
                updatePanelDisplay(`第${state.chapterIndex - 1}章 - 第${state.sectionIndex}节`, `跳过第${state.chapterIndex - 1}章第${state.sectionIndex}节（已完成）`, '--:-- / --:--');

                // 增加小节索引
                state.sectionIndex++;
                saveState(); // 保存状态到localStorage

                // 延迟1秒后继续处理下一个小节
                setTimeout(handleChapterListPage, 1000);
                return;
            }

            state.status = 'processing';
            updatePanelDisplay(`第${state.chapterIndex - 1}章 - 第${state.sectionIndex}节`, `正在进入第${state.chapterIndex - 1}章第${state.sectionIndex}节`, '--:-- / --:--');

            // 添加超时检查：如果处于"正在进入第x章第y节"状态超过5秒，自动刷新页面
            const startTime = Date.now();
            const statusText = `正在进入第${state.chapterIndex - 1}章第${state.sectionIndex}节`;
            const checkStatusTimeout = setInterval(() => {
                // 检查是否已经过了5秒
                if (Date.now() - startTime > 5000) {
                    // 获取当前面板状态信息以确认是否仍处于目标状态
                    const panelStatusText = document.querySelector('#panel-status-info')?.textContent;
                    const currentUrl = window.location.href;

                    // 优先检查面板状态文本，同时结合URL检查确保准确性
                    if (panelStatusText?.includes(statusText) || (!currentUrl.includes('video-student'))) {
                        log(`${statusText} 状态超时（超过5秒），执行页面刷新`);
                        clearInterval(checkStatusTimeout);
                        location.reload();
                    } else {
                        log(`已成功进入视频页面或状态已更新，清除${statusText}状态的超时检查`);
                        clearInterval(checkStatusTimeout);
                    }
                }
            }, 500); // 每0.5秒检查一次

            sectionElement.click();
        } catch (error) {
            log(`处理章节列表页面失败: ${error.message}`);
            updatePanelDisplay(`第${state.chapterIndex - 1}章`, `处理失败: ${error.message}`, '--:-- / --:--');
            alert(`脚本在章节列表页面遇到错误：\n\n${error.message}`);
            state.status = 'paused';
        }
    }

    // 解析视频时长文本
    function parseVideoTime(timeText) {
        try {
            // 匹配类似 01:23 或 01:23:45 的格式
            const match = timeText.match(/^(\d+):(\d+):(\d+)$|^(\d+):(\d+)$/);
            if (match) {
                let hours = 0;
                let minutes = 0;
                let seconds = 0;

                if (match[1]) {
                    // 格式：时:分:秒
                    hours = parseInt(match[1], 10);
                    minutes = parseInt(match[2], 10);
                    seconds = parseInt(match[3], 10);
                } else {
                    // 格式：分:秒
                    minutes = parseInt(match[4], 10);
                    seconds = parseInt(match[5], 10);
                }

                return hours * 3600 + minutes * 60 + seconds;
            }
        } catch (error) {
            log(`解析视频时长失败: ${error.message}`);
        }
        return 0;
    }

    // 格式化秒数为时间文本
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // 视频播放完成后处理函数
    async function handleVideoCompletion() {
        // 视频播放完成，点击返回按钮
        updatePanelDisplay(`第${state.chapterIndex - 1}章 - 第${state.sectionIndex}节`, '视频播放完成，准备返回', '--:-- / --:--');

        // 记录进入此状态的时间
        const startTime = Date.now();

        // 设置3秒后检查状态，如果仍然在此状态则刷新页面
        const refreshTimer = setTimeout(() => {
            if (document.getElementById('panel-status-info') &&
                document.getElementById('panel-status-info').textContent.includes('视频播放完成，准备返回')) {
                log('视频播放完成状态超过3秒，刷新页面');
                location.reload();
            }
        }, 3000);

        try {
            const backButton = await waitForElement(config.selectors.backButton);
            log('点击返回按钮，返回章节列表');
            backButton.click();

            // 清除刷新计时器
            clearTimeout(refreshTimer);

            // 增加小节索引
            state.sectionIndex++;

            // 设置状态为空闲
            state.status = 'idle';
            saveState(); // 保存状态到localStorage

            // 在返回列表页后2秒刷新页面一次
            setTimeout(() => {
                if (window.location.href.includes('studentLog')) {
                    log('已返回章节列表页，2秒后刷新页面');
                    location.reload();
                }
            }, 2000);
        } catch (error) {
            log(`点击返回按钮失败: ${error.message}`);
            alert(`点击返回按钮失败：\n\n${error.message}`);
            state.status = 'paused';
            saveState(); // 保存状态到localStorage
        }
    }

    // 主函数
    function main() {
        // 加载保存的状态
        loadState();

        // 创建悬浮菜单
        createPanel();

        // 检查当前页面类型
        const currentUrl = window.location.href;

        // 添加全局错误捕获
        try {
            if (currentUrl.includes('studentLog')) {
                // 章节列表页面
                log('检测到章节列表页面，开始处理...');
                updatePanelDisplay('--', '就绪', '--:-- / --:--');
                setTimeout(handleChapterListPage, 1000);
            } else if (currentUrl.includes('video-student')) {
                // 视频页面
                log('检测到视频页面，开始处理...');
                setTimeout(() => {
                    // 先检查是否已经在视频页面停留了一段时间，如果是则尝试返回列表页
                    if (window.location.href.includes('video-student')) {
                        try {
                            // 尝试直接调用handleVideoPage而不是返回列表页
                            handleVideoPage();
                        } catch (error) {
                            log('直接处理视频页面失败，尝试返回列表页');
                            setTimeout(handleChapterListPage, 1000);
                        }
                    }
                }, 1000);
            }
        } catch (error) {
            log(`主函数执行出错: ${error.message}`);
            // 全局错误处理：保存状态并提供恢复机制
            state.status = 'paused';
            saveState();

            // 显示友好的错误信息
            alert(`脚本执行出错：\n\n${error.message}\n\n建议刷新页面后重新开始。`);

            // 添加自动恢复尝试
            setTimeout(() => {
                log('尝试自动恢复脚本状态...');
                location.reload();
            }, 5000);
        }
    }

    // 添加全局错误处理
    window.addEventListener('error', (errorEvent) => {
        log(`全局错误捕获: ${errorEvent.message}`);
        // 可以在这里添加更多的全局错误处理逻辑
    });

    window.addEventListener('unhandledrejection', (event) => {
        log(`未捕获的Promise拒绝: ${event.reason ? event.reason.message || event.reason : '未知原因'}`);
        // 显示更友好的错误信息，防止脚本直接崩溃
        if (event.reason && event.reason.message && event.reason.message.includes('视频页面处理失败')) {
            setTimeout(() => {
                log('尝试从视频页面处理失败中恢复...');
                alert('视频页面处理失败，正在尝试恢复...');
                // 尝试刷新页面来恢复
                location.reload();
            }, 2000);
        } else if (event.reason && event.reason.message && event.reason.message.includes('等待条件满足超时')) {
            // 特别处理等待条件满足超时的情况
            setTimeout(() => {
                log('尝试从等待条件满足超时中恢复...');
                alert('系统响应超时，正在尝试恢复...');
                // 尝试刷新页面来恢复
                location.reload();
            }, 1000);
        }
    });

    // 页面加载完成后执行主函数
    main();

})();