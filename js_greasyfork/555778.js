// ==UserScript==
// @name         自动学习助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动学习课程，监控视频进度，处理弹窗
// @author       Safer
// @match        https://agzx.ejkedu.com/agryjxjy/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555778/%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555778/%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        setTimeout(initScript, 1000);
    }

    function initScript() {
        console.log('启动自动化学习脚本...');

        // 检查是否已经注入过脚本
        if (window.autoStudy) {
            console.log('脚本已存在，重新启动...');
            window.autoStudy.restart();
            return;
        }

        // 配置参数
        const config = {
            checkInterval: 3000,
            waitAfterPopup: 5000,
            waitAfterVideoClick: 8000,
            videoProgressCheckInterval: 20000,
            clickDelay: 2000,
            timeout: 3600000
        };

        // 状态管理
        let currentState = 'courseList';
        let currentCourseIndex = 1;
        let currentVideoId = null;
        let isProcessing = false;
        let startTime = Date.now();
        let processedVideos = new Set();
        let processedCourses = new Set();
        let videoCheckTimer = null;
        let mainInterval = null;
        let videoProgressInterval = null;
        let lastPlayCheckTime = 0;
        let videoStartTime = 0;

        // 动态选择器构建
        const selectors = {
            courseList: {
                courseRow: (index) => `#app > div.main > div > div.user_select_course > div.course_list > div.el-table.el-table--fit.el-table--enable-row-hover.el-table--enable-row-transition.el-table--mini > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr:nth-child(${index})`,

                chapter: (rowElement) => {
                    const selectors = [
                        'td.el-table_6_column_28.is-center.el-table__cell > div',
                        'td.el-table_4_column_18.is-center.el-table__cell > div',
                        'td.el-table_28_column_139.is-center.el-table__cell > div',
                        'td:nth-child(1) > div',
                        'td:nth-child(2) > div'
                    ];

                    for (let selector of selectors) {
                        const element = rowElement.querySelector(selector);
                        if (element && element.textContent.trim()) {
                            return element;
                        }
                    }
                    return null;
                },

                progress: (rowElement) => {
                    const selectors = [
                        'td.el-table_4_column_19.is-center.el-table__cell > div > p', // 课程进度
                        'td.el-table_6_column_29.is-center.el-table__cell > div > p', // 备用进度路径
                        'td.el-table_28_column_140.is-center.el-table__cell > div > p'
                    ];

                    console.log('=== 查找进度元素 ===');

                    for (let i = 0; i < selectors.length; i++) {
                        const selector = selectors[i];
                        const element = rowElement.querySelector(selector);
                        console.log(`尝试选择器: "${selector}"`);

                        if (element) {
                            const text = element.textContent.trim();
                            console.log(`✅ 找到候选元素，文本: "${text}"`);

                            // 明确判断：进度文本要么为空，要么包含百分比
                            if (text === '' || text.includes('%')) {
                                console.log('✅ 确认是进度元素（空文本或百分比）');
                                return element;
                            } else {
                                console.log('❌ 不是进度元素，跳过（既不是空文本也不包含百分比）');
                            }
                        } else {
                            console.log('❌ 未找到元素');
                        }
                    }

                    console.log('❌ 未找到进度元素');
                    return null;
                },

                studyButton: (rowElement) => {
                    const selectors = [
                        'td.el-table_4_column_20.is-center.el-table__cell > div > button',
                        'td.el-table_28_column_141.is-center.el-table__cell > div > button',
                        'td:last-child > div > button',
                        'button'
                    ];

                    for (let selector of selectors) {
                        const element = rowElement.querySelector(selector);
                        if (element && (element.textContent.includes('学习') || element.textContent.includes('开始') || element.textContent.includes('继续'))) {
                            return element;
                        }
                    }
                    return rowElement.querySelector('button');
                }
            },

            courseDetail: {
                backButton: '#app > div > div.course-head > a',
                videoItem: '[id^="ware-item-"]',
                videoProgress: (videoId) => `#${videoId} > div > div > span`,
                watchButton: (videoId) => `#${videoId} > div`
            },

            videoPlayer: {
                playButton: '#player-box > div > div.pv-skin-blue.pv-video-bottom.pv-subtitle-hide.pv-base-panel.pv-stream-hide > div > div.pv-controls-left > button'
            },

            popup: {
                confirmButton: '#app > div > div.course_rate_main > div.course_rate > div.course_rate_footer > div.course_rate_btn.course_rate_right_btn'
            }
        };

        // 工具函数
        function parseProgress(progressText) {
            if (!progressText || progressText.trim() === '') {
                return { progress: 0, completed: false, isEmpty: true };
            }

            const text = progressText.trim();
            console.log('解析进度文本: "' + text + '"');

            // 修复：支持两位小数的百分比格式 (如 "85.71%")
            const percentMatch = text.match(/(\d+(?:\.\d+)?)%/);
            if (percentMatch) {
                const progress = parseFloat(percentMatch[1]);
                return { progress: progress, completed: progress >= 100, isEmpty: false };
            }

            // 如果文本不为空但不包含百分比，说明可能是其他元素，按未完成处理
            console.log('警告：进度文本不为空但不包含百分比，按未完成处理');
            return { progress: 0, completed: false, isEmpty: false };
        }

        function isElementVisible(element) {
            return element && element.offsetParent !== null && element.offsetWidth > 0 && element.offsetHeight > 0;
        }

        // 改进的播放状态检查 - 只在明确未播放时才操作
        function shouldClickPlayButton() {
            const playButton = document.querySelector(selectors.videoPlayer.playButton);
            if (!playButton || !isElementVisible(playButton)) {
                console.log('播放按钮不存在或不可见，不进行操作');
                return false;
            }

            // 获取按钮的详细状态信息
            const buttonHtml = playButton.innerHTML || '';
            const buttonText = playButton.textContent || '';
            const buttonClass = playButton.className || '';

            console.log('播放按钮状态检查:');
            console.log('- 文本:', buttonText);
            console.log('- HTML:', buttonHtml.substring(0, 100));
            console.log('- 类名:', buttonClass);

            // 明确识别播放状态（需要点击的情况）
            const playIndicators = [
                buttonText.includes('播放'),
                buttonHtml.includes('play'),
                buttonHtml.includes('开始播放'),
                buttonClass.includes('play'),
            ];

            // 明确识别暂停状态（不需要点击的情况）
            const pauseIndicators = [
                buttonText.includes('暂停'),
                buttonHtml.includes('pause'),
                buttonHtml.includes('暂停播放'),
                buttonClass.includes('pause'),
            ];

            // 如果有明确的暂停指示器，说明正在播放，不点击
            if (pauseIndicators.some(indicator => indicator)) {
                console.log('检测到明确的暂停状态，视频正在播放，不点击');
                return false;
            }

            // 如果有明确的播放指示器，说明需要点击播放
            if (playIndicators.some(indicator => indicator)) {
                console.log('检测到明确的播放状态，需要点击播放');
                return true;
            }

            // 如果无法确定状态，默认不操作，避免干扰正在播放的视频
            console.log('无法确定播放状态，保守策略：不进行操作');
            return false;
        }

        // 阶段一：学习列表页扫描
        function processCourseList() {
            console.log('正在扫描学习列表页...');
            isProcessing = true;

            const courseRows = document.querySelectorAll(selectors.courseList.courseRow(1).replace('nth-child(1)', 'nth-child(n)'));
            console.log(`发现 ${courseRows.length} 个课程`);

            let allCompleted = true;
            let foundIncompleteCourse = false;

            for (let i = 0; i < courseRows.length; i++) {
                const row = courseRows[i];
                const courseIndex = i + 1;

                if (processedCourses.has(courseIndex)) {
                    console.log(`课程 ${courseIndex} 已处理过，跳过`);
                    continue;
                }

                const chapterElement = selectors.courseList.chapter(row);
                const progressElement = selectors.courseList.progress(row);
                const studyButton = selectors.courseList.studyButton(row);

                const chapterText = chapterElement ? chapterElement.textContent.trim() : '';
                const progressText = progressElement ? progressElement.textContent.trim() : '';
                const progressInfo = parseProgress(progressText);

                console.log(`课程 ${courseIndex}: 章节="${chapterText}", 进度文本="${progressText}", 解析进度=${progressInfo.progress}%`);

                // 决策逻辑
                if (chapterText && chapterText !== '') {
                    if (!progressInfo.completed && progressInfo.progress < 100) {
                        console.log(`课程 ${courseIndex}: 有章节且进度未完成 → 点击学习`);
                        allCompleted = false;

                        if (!foundIncompleteCourse && studyButton) {
                            studyButton.click();
                            currentCourseIndex = courseIndex;
                            processedCourses.add(courseIndex);
                            foundIncompleteCourse = true;

                            setTimeout(() => {
                                currentState = 'courseDetail';
                                isProcessing = false;
                                console.log('进入学习详情页');
                            }, config.clickDelay);
                            return;
                        }
                    } else if (progressInfo.completed) {
                        console.log(`课程 ${courseIndex}: 有章节但已完成 → 跳过`);
                        processedCourses.add(courseIndex);
                    } else if (progressInfo.isEmpty) {
                        console.log(`课程 ${courseIndex}: 有章节但无进度信息 → 点击学习`);
                        allCompleted = false;

                        if (!foundIncompleteCourse && studyButton) {
                            studyButton.click();
                            currentCourseIndex = courseIndex;
                            processedCourses.add(courseIndex);
                            foundIncompleteCourse = true;

                            setTimeout(() => {
                                currentState = 'courseDetail';
                                isProcessing = false;
                                console.log('进入学习详情页');
                            }, config.clickDelay);
                            return;
                        }
                    }
                } else {
                    console.log(`课程 ${courseIndex}: 无章节 → 跳过`);
                    processedCourses.add(courseIndex);
                }
            }

            if (allCompleted) {
                console.log('所有课程已完成！脚本停止');
                stopScript();
            } else if (!foundIncompleteCourse) {
                console.log('未找到可学习的课程，等待下次检查');
                isProcessing = false;
            }
        }

        // 阶段二：学习详情页扫描
        function processCourseDetail() {
            console.log('正在扫描学习详情页视频...');
            isProcessing = true;

            // 验证是否在详情页
            const backButton = document.querySelector(selectors.courseDetail.backButton);
            if (!backButton) {
                console.log('未找到返回按钮，可能不在学习详情页，返回列表页');
                currentState = 'courseList';
                isProcessing = false;
                return;
            }

            // 扫描所有视频
            const videoElements = document.querySelectorAll(selectors.courseDetail.videoItem);
            console.log(`发现 ${videoElements.length} 个视频`);

            let allVideosCompleted = true;
            let foundIncompleteVideo = false;

            for (let videoElement of videoElements) {
                const videoId = videoElement.id;

                if (processedVideos.has(videoId)) {
                    continue;
                }

                const videoData = checkVideoProgress(videoId);
                if (videoData.exists && videoData.isVisible) {
                    // 修复：使用解析后的进度信息
                    if (!videoData.completed && videoData.progress < 100) {
                        console.log(`视频 ${videoId}: 进度 ${videoData.progress}% → 需要观看`);
                        allVideosCompleted = false;

                        if (!foundIncompleteVideo) {
                            startVideoWatching(videoId);
                            foundIncompleteVideo = true;
                            return;
                        }
                    } else if (videoData.completed) {
                        console.log(`视频 ${videoId}: 进度 ${videoData.progress}% → 已完成`);
                        processedVideos.add(videoId);
                    }
                }
            }

            if (allVideosCompleted) {
                console.log('当前课程所有视频已完成，返回学习列表页');
                backButton.click();
                processedVideos.clear();
                currentState = 'courseList';
                setTimeout(() => { isProcessing = false; }, config.clickDelay);
            } else if (!foundIncompleteVideo) {
                console.log('未找到可观看的视频，等待下次检查');
                isProcessing = false;
            }
        }

        function checkVideoProgress(videoId) {
            const progressSelector = selectors.courseDetail.videoProgress(videoId);
            const watchButtonSelector = selectors.courseDetail.watchButton(videoId);

            const progressElement = document.querySelector(progressSelector);
            const watchButton = document.querySelector(watchButtonSelector);

            if (progressElement && watchButton) {
                const progressText = progressElement.textContent.trim();
                const progressInfo = parseProgress(progressText);

                return {
                    exists: true,
                    progress: progressInfo.progress,
                    completed: progressInfo.completed,
                    element: watchButton,
                    isVisible: isElementVisible(watchButton),
                    rawText: progressText // 保留原始文本用于调试
                };
            }

            return {
                exists: false,
                progress: 0,
                completed: false,
                element: null,
                isVisible: false,
                rawText: ''
            };
        }

        // 阶段三：视频播放处理
        function startVideoWatching(videoId) {
            console.log(`点击视频 ${videoId} 的观看按钮`);
            currentVideoId = videoId;
            videoStartTime = Date.now();
            lastPlayCheckTime = 0;

            const watchButton = document.querySelector(selectors.courseDetail.watchButton(videoId));
            if (watchButton) {
                watchButton.click();
                processedVideos.add(videoId);

                setTimeout(() => {
                    startVideoProgressMonitoring();
                }, config.waitAfterVideoClick);
            } else {
                console.log(`无法找到视频 ${videoId} 的观看按钮`);
                currentState = 'courseDetail';
                isProcessing = false;
            }
        }

        function startVideoProgressMonitoring() {
            console.log('启动视频进度监控...');
            currentState = 'watchingVideo';

            // 只在视频开始后30秒检查一次播放状态
            setTimeout(() => {
                checkInitialPlayback();
            }, 30000);

            // 启动进度检查
            startVideoProgressCheck();
        }

        function checkInitialPlayback() {
            console.log('初始播放状态检查...');
            const now = Date.now();

            if (shouldClickPlayButton()) {
                console.log('初始检查：视频未播放，点击播放按钮');
                const playButton = document.querySelector(selectors.videoPlayer.playButton);
                if (playButton) {
                    playButton.click();
                }
            } else {
                console.log('初始检查：视频正在播放或状态未知，不进行操作');
            }
            lastPlayCheckTime = now;
        }

        function startVideoProgressCheck() {
            console.log('启动视频进度检查...');

            if (videoProgressInterval) {
                clearInterval(videoProgressInterval);
            }

            let progressCheckCount = 0;
            const maxProgressChecks = 999;

            videoProgressInterval = setInterval(() => {
                if (!currentVideoId) {
                    clearInterval(videoProgressInterval);
                    return;
                }

                progressCheckCount++;
                const videoData = checkVideoProgress(currentVideoId);

                if (videoData.exists) {
                    // 修复：使用解析后的进度信息显示
                    console.log(`视频 ${currentVideoId} 当前进度: ${videoData.progress}%`);

                    if (videoData.completed || videoData.progress >= 100) {
                        console.log(`🎉 视频 ${currentVideoId} 已完成 (${videoData.progress}%)`);
                        clearInterval(videoProgressInterval);
                        processedVideos.add(currentVideoId);

                        handleVideoCompletion();
                    } else {
                        // 只在进度长时间不变化时才检查播放状态
                        if (progressCheckCount % 8 === 0) { // 每8次检查一次（约6分钟）
                            const now = Date.now();
                            if (now - lastPlayCheckTime > 300000) { // 至少间隔5分钟
                                console.log('长时间播放检查...');
                                if (shouldClickPlayButton()) {
                                    console.log('长时间检查：视频可能暂停，点击播放');
                                    const playButton = document.querySelector(selectors.videoPlayer.playButton);
                                    if (playButton) {
                                        playButton.click();
                                    }
                                }
                                lastPlayCheckTime = now;
                            }
                        }
                    }
                } else {
                    console.log('视频元素不存在，返回详情页');
                    clearInterval(videoProgressInterval);
                    currentState = 'courseDetail';
                    isProcessing = false;
                }

                if (progressCheckCount >= maxProgressChecks) {
                    console.log('视频进度检查超时，返回详情页');
                    clearInterval(videoProgressInterval);
                    currentState = 'courseDetail';
                    isProcessing = false;
                }
            }, config.videoProgressCheckInterval);
        }

        // 视频完成后的弹窗处理
        function handleVideoCompletion() {
            console.log('视频完成，等待系统自动处理...');

            setTimeout(() => {
                console.log('检查弹窗状态...');
                const popupElement = document.querySelector(selectors.popup.confirmButton);
                if (popupElement && isElementVisible(popupElement)) {
                    console.log('发现弹窗，点击确定按钮');
                    popupElement.click();

                    setTimeout(() => {
                        currentState = 'courseDetail';
                        currentVideoId = null;
                        isProcessing = false;
                        console.log('弹窗已处理，返回详情页继续下一个视频');
                    }, config.waitAfterPopup);
                } else {
                    console.log('未发现弹窗，直接返回详情页');
                    currentState = 'courseDetail';
                    currentVideoId = null;
                    isProcessing = false;
                }
            }, 8000);
        }

        // 主控制器
        function mainController() {
            if (isProcessing) return;
            if (Date.now() - startTime > config.timeout) {
                console.log('脚本超时，自动停止');
                stopScript();
                return;
            }

            switch (currentState) {
                case 'courseList': processCourseList(); break;
                case 'courseDetail': processCourseDetail(); break;
                case 'watchingVideo': break;
            }
        }

        function stopScript() {
            if (mainInterval) clearInterval(mainInterval);
            if (videoCheckTimer) clearTimeout(videoCheckTimer);
            if (videoProgressInterval) clearInterval(videoProgressInterval);
            console.log('自动化学习脚本已停止');
            isProcessing = false;
        }

        // 启动脚本
        mainInterval = setInterval(mainController, config.checkInterval);
        setTimeout(mainController, 1000);

        // 暴露接口到全局
        window.autoStudy = {
            stop: stopScript,
            getStatus: () => {
                return {
                    currentState: currentState,
                    currentCourse: currentCourseIndex,
                    currentVideo: currentVideoId,
                    processedVideos: Array.from(processedVideos),
                    processedCourses: Array.from(processedCourses),
                    runningTime: Math.round((Date.now() - startTime) / 1000) + '秒',
                    isProcessing: isProcessing
                };
            },
            forceState: (state) => {
                currentState = state;
                isProcessing = false;
                console.log('强制切换到状态: ' + state);
            },
            restart: () => {
                stopScript();
                setTimeout(() => {
                    console.log('重新启动脚本');
                    currentState = 'courseList';
                    currentCourseIndex = 1;
                    currentVideoId = null;
                    isProcessing = false;
                    processedVideos.clear();
                    processedCourses.clear();
                    startTime = Date.now();
                    mainInterval = setInterval(mainController, config.checkInterval);
                    setTimeout(mainController, 1000);
                }, 1000);
            },
            // 调试函数
            checkPlayback: () => {
                console.log('手动播放状态检查...');
                const result = shouldClickPlayButton();
                console.log('需要点击播放:', result);
                return result;
            },
            checkVideoProgress: (videoId) => {
                console.log('手动检查视频进度:', videoId);
                return checkVideoProgress(videoId);
            }
        };

        console.log('自动化学习脚本已启动');
        console.log('查看状态: autoStudy.getStatus()');
        console.log('停止脚本: autoStudy.stop()');
        console.log('重新启动: autoStudy.restart()');
        console.log('调试功能:');
        console.log('- autoStudy.checkPlayback() - 检查播放状态');
        console.log('- autoStudy.checkVideoProgress("视频ID") - 检查指定视频进度');
    }
})();