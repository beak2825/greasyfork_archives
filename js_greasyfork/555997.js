// ==UserScript==
// @name         超星学习通自动播放器（章节修复版）
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  修复章节导航逻辑，支持多级章节结构
// @author       Iron_Grey_
// @match        *://mooc1.chaoxing.com/mycourse/studentstudy*
// @match        *://mooc1.chaoxing.com/mooc-ans/mycourse/studentstudy*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555997/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%99%A8%EF%BC%88%E7%AB%A0%E8%8A%82%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555997/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%99%A8%EF%BC%88%E7%AB%A0%E8%8A%82%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .cx-super-player-btn {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 100000 !important;
            padding: 12px 18px !important;
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4) !important;
            color: white !important;
            border: none !important;
            border-radius: 25px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: bold !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
            transition: all 0.3s ease !important;
            font-family: 'Microsoft YaHei', sans-serif !important;
        }
        .cx-super-player-btn:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;
        }
        .cx-super-player-btn:active {
            transform: translateY(-1px) !important;
        }
        .cx-super-player-btn.playing {
            background: linear-gradient(45deg, #4ECDC4, #45B7D1) !important;
            animation: pulse 2s infinite !important;
        }
        .cx-super-player-btn.error {
            background: linear-gradient(45deg, #FF6B6B, #FF8E53) !important;
        }
        .cx-super-player-btn.completed {
            background: linear-gradient(45deg, #A166AB, #5073B8) !important;
        }
        .cx-super-player-btn.skipping {
            background: linear-gradient(45deg, #FFA726, #FF7043) !important;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    let isAutoPlaying = false;
    let controlButton = null;
    let currentProcess = null;

    // 创建控制按钮
    function createControlButton() {
        const existingBtn = document.querySelector('.cx-super-player-btn');
        if (existingBtn) existingBtn.remove();

        const button = document.createElement('button');
        button.className = 'cx-super-player-btn';
        button.innerHTML = '🎬 开始自动播放';

        button.addEventListener('click', toggleAutoPlay);
        document.body.appendChild(button);

        controlButton = button;
        return button;
    }

    // 更新按钮状态
    function updateButtonState(state, text = null) {
        if (!controlButton) return;

        controlButton.className = `cx-super-player-btn ${state}`;

        if (text) {
            controlButton.innerHTML = text;
        } else {
            switch(state) {
                case 'stopped':
                    controlButton.innerHTML = '🎬 开始自动播放';
                    break;
                case 'playing':
                    controlButton.innerHTML = '⏸️ 自动播放中...';
                    break;
                case 'error':
                    controlButton.innerHTML = '❌ 出错 - 重新开始';
                    break;
                case 'completed':
                    controlButton.innerHTML = '✅ 所有任务完成';
                    break;
                case 'skipping':
                    controlButton.innerHTML = '⏭️ 跳过非视频章节...';
                    break;
            }
        }
    }

    // 切换自动播放
    function toggleAutoPlay() {
        if (isAutoPlaying) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    }

    // 停止自动播放
    function stopAutoPlay() {
        isAutoPlaying = false;
        updateButtonState('stopped');

        if (currentProcess) {
            clearTimeout(currentProcess);
            currentProcess = null;
        }

        console.log('自动播放已停止');
    }

    // 开始自动播放
    function startAutoPlay() {
        isAutoPlaying = true;
        updateButtonState('playing');
        autoPlayProcess();
    }

    // 自动播放主流程
    async function autoPlayProcess() {
        try {
            while (isAutoPlaying) {
                console.log('=== 开始处理当前章节 ===');

                await wait(3000);

                const chapterResult = await processCurrentChapter();

                if (chapterResult === 'skip') {
                    console.log('跳过非视频章节，继续下一章节');
                    const hasNext = await goToNextChapter();
                    if (!hasNext) {
                        console.log('所有章节已完成');
                        updateButtonState('completed');
                        isAutoPlaying = false;
                        break;
                    }
                    await wait(3000);
                    continue;
                } else if (chapterResult === 'success') {
                    const hasNext = await goToNextChapter();
                    if (!hasNext) {
                        console.log('所有章节已完成');
                        updateButtonState('completed');
                        isAutoPlaying = false;
                        break;
                    }
                    await wait(5000);
                } else {
                    console.log('当前章节处理失败，等待后重试...');
                    await wait(5000);
                }
            }
        } catch (error) {
            console.error('自动播放出错:', error);
            updateButtonState('error');
            isAutoPlaying = false;
        }
    }

    // 处理当前章节 - 返回 'success', 'skip', 或 'error'
    async function processCurrentChapter() {
        try {
            console.log('步骤1: 查找知识卡片iframe...');

            // 获取第一层iframe (知识卡片iframe)
            const cardIframe = await waitForElement('iframe[src*="/mooc-ans/knowledge/cards"]', 10000);
            if (!cardIframe) {
                console.log('未找到知识卡片iframe，可能是非视频章节');
                return await handleNonVideoChapter();
            }

            await waitForIframeLoad(cardIframe);

            console.log('步骤2: 检查章节内容类型...');
            const chapterType = await detectChapterType(cardIframe);

            if (chapterType === 'video') {
                console.log('检测到视频章节，开始处理视频...');
                return await processVideoChapter(cardIframe);
            } else if (chapterType === 'document' || chapterType === 'text') {
                console.log(`检测到${chapterType === 'document' ? '文档' : '文本'}章节，自动跳过...`);
                return await handleNonVideoChapter();
            } else {
                console.log('未知章节类型，尝试跳过...');
                return await handleNonVideoChapter();
            }

        } catch (error) {
            console.error('处理当前章节出错:', error);
            return 'error';
        }
    }

    // 检测章节类型
    async function detectChapterType(cardIframe) {
        try {
            const cardDoc = getIframeDocument(cardIframe);
            if (!cardDoc) return 'unknown';

            // 检查是否有视频iframe
            const videoIframe = cardDoc.querySelector('iframe[src*="modules/video/index.html"]');
            if (videoIframe) {
                return 'video';
            }

            // 检查是否有文档内容
            const documentElements = cardDoc.querySelectorAll('[class*="doc"], [class*="document"], .ans-cc, .ans-doc');
            if (documentElements.length > 0) {
                return 'document';
            }

            // 检查是否有文本内容
            const textElements = cardDoc.querySelectorAll('.ans-attach-ct, .knowledge, .cata_content');
            if (textElements.length > 0) {
                return 'text';
            }

            // 检查是否有测验
            const quizElements = cardDoc.querySelectorAll('[class*="work"], [class*="quiz"], [class*="test"]');
            if (quizElements.length > 0) {
                return 'quiz';
            }

            return 'unknown';
        } catch (error) {
            console.log('检测章节类型失败:', error);
            return 'unknown';
        }
    }

    // 处理视频章节
    async function processVideoChapter(cardIframe) {
        try {
            // 获取第二层iframe (视频播放iframe)
            const videoIframe = await waitForElementInIframe(cardIframe, 'iframe[src*="modules/video/index.html"]', 10000);
            if (!videoIframe) {
                console.log('未找到视频播放iframe');
                return 'error';
            }

            await waitForIframeLoad(videoIframe);

            console.log('步骤3: 设置播放速度...');
            await setPlaybackSpeed(videoIframe);

            console.log('步骤4: 点击外层防暂停按钮...');
            await clickOuterPreventPause();

            console.log('步骤5: 点击内层播放按钮并开始播放...');
            await clickInnerPlayButtonAndStart(videoIframe);

            console.log('步骤6: 等待任务完成...');
            const completed = await waitForTaskCompletion(cardIframe, videoIframe);

            if (completed) {
                console.log('当前章节任务完成，等待20秒...');
                await wait(20000);
                return 'success';
            } else {
                console.log('任务完成检测超时，继续下一章节');
                await wait(5000);
                return 'success'; // 即使超时也继续下一章节
            }
        } catch (error) {
            console.error('处理视频章节出错:', error);
            return 'error';
        }
    }

    // 处理非视频章节
    async function handleNonVideoChapter() {
        try {
            updateButtonState('skipping');

            console.log('处理非视频章节...');

            // 检查当前章节是否已经完成
            const isCompleted = await checkIfChapterCompleted();

            if (isCompleted) {
                console.log('非视频章节已完成，直接跳过');
                return 'skip';
            } else {
                console.log('非视频章节未完成，尝试标记为完成或等待...');

                // 尝试点击可能存在的完成按钮
                const marked = await tryMarkChapterAsComplete();

                if (marked) {
                    console.log('成功标记非视频章节为完成');
                    await wait(5000); // 等待标记完成
                    return 'skip';
                } else {
                    console.log('无法自动完成非视频章节，等待30秒后跳过');
                    await wait(30000); // 等待30秒让用户手动处理
                    return 'skip';
                }
            }
        } catch (error) {
            console.log('处理非视频章节时出错:', error);
            return 'skip'; // 即使出错也跳过
        }
    }

    // 检查当前章节是否已完成
    async function checkIfChapterCompleted() {
        try {
            // 在主页面查找章节完成状态
            const currentChapter = document.querySelector('.posCatalog_select.posCatalog_active');
            if (!currentChapter) return false;

            // 检查是否有未完成任务点标记
            const unfinishedMark = currentChapter.querySelector('.orangeNew, .catalog_points_yi');
            if (unfinishedMark) {
                console.log('发现未完成任务点标记');
                return false;
            }

            // 检查隐藏的未完成任务点数
            const jobUnfinishCount = currentChapter.querySelector('.jobUnfinishCount');
            if (jobUnfinishCount && jobUnfinishCount.value !== '0') {
                console.log(`还有${jobUnfinishCount.value}个未完成任务点`);
                return false;
            }

            // 检查是否有完成状态的类名
            const completedSelectors = [
                '[class*="finish"]',
                '[class*="complete"]',
                '.ans-job-finished'
            ];

            for (let selector of completedSelectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    console.log('找到完成状态元素');
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.log('检查章节完成状态失败:', error);
            return false;
        }
    }

    // 尝试标记章节为完成
    async function tryMarkChapterAsComplete() {
        try {
            // 尝试在知识卡片iframe中查找完成按钮
            const cardIframe = await waitForElement('iframe[src*="/mooc-ans/knowledge/cards"]', 5000);
            if (!cardIframe) return false;

            const cardDoc = getIframeDocument(cardIframe);
            if (!cardDoc) return false;

            // 查找可能的完成按钮
            const completeButtons = cardDoc.querySelectorAll('button, input[type="button"], a');
            for (let button of completeButtons) {
                const text = button.textContent || button.value || '';
                if (text.includes('完成') || text.includes('提交') || text.includes('确认')) {
                    console.log('点击完成按钮:', text);
                    button.click();
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.log('标记章节完成失败:', error);
            return false;
        }
    }

    // 设置播放速度 - 在视频iframe中
    async function setPlaybackSpeed(videoIframe) {
        try {
            const videoDoc = getIframeDocument(videoIframe);
            if (!videoDoc) return false;

            const speedSelect = videoDoc.querySelector('select');
            if (speedSelect && speedSelect.innerHTML.includes('1.25')) {
                speedSelect.value = '1.25';
                speedSelect.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('✓ 播放速度设置为1.25x');
                return true;
            }

            console.log('未找到速度选择器');
            return false;
        } catch (error) {
            console.log('设置播放速度失败:', error);
            return false;
        }
    }

    // 点击外层防暂停按钮 - 在主页面中
    async function clickOuterPreventPause() {
        try {
            // 在主页面中查找防暂停按钮
            const buttons = document.querySelectorAll('button');
            for (let button of buttons) {
                if (button.textContent.includes('阻止暂停') ||
                    button.textContent.includes('防暂停') ||
                    (button.className && button.className.includes('h_Bbutton'))) {
                    button.click();
                    console.log('✓ 已点击外层防暂停按钮');
                    return true;
                }
            }

            console.log('未找到外层防暂停按钮');
            return false;
        } catch (error) {
            console.log('点击外层防暂停按钮失败:', error);
            return false;
        }
    }

    // 点击内层播放按钮并开始播放 - 在视频iframe中
    async function clickInnerPlayButtonAndStart(videoIframe) {
        try {
            const videoDoc = getIframeDocument(videoIframe);
            if (!videoDoc) return false;

            // 首先点击播放按钮
            const playButton = videoDoc.querySelector('.vjs-big-play-button');
            if (playButton) {
                playButton.click();
                console.log('✓ 已点击内层播放按钮');
                await wait(1000); // 等待播放开始
            } else {
                console.log('未找到内层播放按钮');
            }

            // 确保视频开始播放
            const video = videoDoc.querySelector('video');
            if (video) {
                video.muted = true; // 静音以提高自动播放成功率

                // 如果视频没有在播放，尝试播放
                if (video.paused) {
                    try {
                        await video.play();
                        console.log('✓ 视频开始播放');
                    } catch (playError) {
                        console.log('自动播放被阻止，可能需要手动点击');
                    }
                } else {
                    console.log('✓ 视频已在播放');
                }

                return true;
            }

            console.log('未找到视频元素');
            return false;
        } catch (error) {
            console.log('开始视频播放失败:', error);
            return false;
        }
    }

    // 等待任务完成 - 基于aria-label属性
    async function waitForTaskCompletion(cardIframe, videoIframe) {
        return new Promise((resolve) => {
            console.log('等待任务完成...');
            let checkCount = 0;
            const maxChecks = 1800; // 30分钟超时

            // 使用MutationObserver监听DOM变化
            let observer = null;
            let cardDoc = null;

            try {
                cardDoc = getIframeDocument(cardIframe);
                if (cardDoc) {
                    // 创建MutationObserver监听任务状态变化
                    observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-label') {
                                console.log('检测到aria-label属性变化');
                                if (checkTaskCompleted(cardDoc)) {
                                    observer.disconnect();
                                    resolve(true);
                                }
                            }
                        });
                    });

                    // 观察整个文档的变化，特别关注aria-label属性
                    observer.observe(cardDoc.body, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['class', 'aria-label']
                    });
                }
            } catch (error) {
                console.log('无法创建MutationObserver，使用回退轮询方案');
            }

            function checkCompletion() {
                if (!isAutoPlaying) {
                    if (observer) observer.disconnect();
                    resolve(false);
                    return;
                }

                checkCount++;

                try {
                    // 检查任务完成状态
                    let completed = false;

                    // 方法1: 基于aria-label属性检查任务完成状态
                    if (cardDoc) {
                        completed = checkTaskCompleted(cardDoc);
                    }

                    // 方法2: 检查视频是否播放完毕（备用方案）
                    if (!completed) {
                        const videoDoc = getIframeDocument(videoIframe);
                        if (videoDoc) {
                            const video = videoDoc.querySelector('video');
                            if (video && video.duration && video.currentTime >= video.duration - 10) {
                                completed = true;
                                console.log('✓ 视频播放完毕，认为任务完成');
                            }
                        }
                    }

                    if (completed) {
                        if (observer) observer.disconnect();
                        console.log('✓ 检测到任务完成');
                        resolve(true);
                        return;
                    }

                    if (checkCount >= maxChecks) {
                        if (observer) observer.disconnect();
                        console.log('任务完成检测超时');
                        resolve(false);
                        return;
                    }

                    // 更新等待状态
                    if (checkCount % 60 === 0) {
                        const minutes = Math.floor(checkCount / 60);
                        updateButtonState('playing', `⏳ 播放中... (${minutes}分钟)`);
                    }

                    currentProcess = setTimeout(checkCompletion, 1000);
                } catch (error) {
                    console.log('检查任务状态时出错:', error);
                    currentProcess = setTimeout(checkCompletion, 5000);
                }
            }

            // 辅助函数：基于aria-label属性检查任务完成状态
            function checkTaskCompleted(doc) {
                // 查找所有任务点状态指示器
                const jobIcons = doc.querySelectorAll('.ans-job-icon, .ans-job-icon-clear');

                let allCompleted = true;
                let foundAnyJobIcon = false;

                for (let icon of jobIcons) {
                    const ariaLabel = icon.getAttribute('aria-label');
                    if (ariaLabel) {
                        foundAnyJobIcon = true;

                        if (ariaLabel.includes('任务点未完成')) {
                            console.log('发现未完成任务点:', ariaLabel);
                            allCompleted = false;
                            break;
                        } else if (ariaLabel.includes('任务点已完成')) {
                            console.log('发现已完成任务点:', ariaLabel);
                            // 继续检查其他任务点
                        } else {
                            console.log('发现未知状态任务点:', ariaLabel);
                            // 如果有未知状态，保守起见认为未完成
                            allCompleted = false;
                        }
                    }
                }

                // 如果没有找到任何任务点指示器，检查其他完成标志
                if (!foundAnyJobIcon) {
                    console.log('未找到任务点指示器，检查其他完成标志');

                    // 检查是否有完成状态的元素
                    const completedSelectors = [
                        '.ans-job-finished',
                        '[class*="finished"]',
                        '[class*="completed"]',
                        '.jobUnfinishCount[value="0"]'
                    ];

                    for (let selector of completedSelectors) {
                        const elements = doc.querySelectorAll(selector);
                        if (elements.length > 0) {
                            console.log(`✓ 找到完成状态元素: ${selector}`);
                            return true;
                        }
                    }

                    // 如果没有明确完成标志，保守起见认为未完成
                    return false;
                }

                return allCompleted;
            }

            // 立即检查一次，然后启动轮询或依赖Observer
            const initialCheck = checkTaskCompleted(cardDoc);
            if (initialCheck) {
                if (observer) observer.disconnect();
                resolve(true);
            } else {
                if (!observer) {
                    // 如果没有Observer，使用轮询方案
                    checkCompletion();
                }
            }
        });
    }

    // 切换到下一章节 - 完全重写，支持多级章节结构
    async function goToNextChapter() {
        try {
            // 获取所有可点击的章节元素（包括所有层级的）
            const allChapterItems = document.querySelectorAll('.posCatalog_select:not(.firstLayer)');

            if (allChapterItems.length === 0) {
                console.log('未找到任何章节');
                return false;
            }

            // 查找当前选中的章节
            let currentChapterIndex = -1;
            for (let i = 0; i < allChapterItems.length; i++) {
                if (allChapterItems[i].classList.contains('posCatalog_active')) {
                    currentChapterIndex = i;
                    break;
                }
            }

            if (currentChapterIndex === -1) {
                console.log('未找到当前选中的章节，尝试选择第一个未完成章节');
                // 如果没有当前选中章节，选择第一个有未完成任务点的章节
                for (let i = 0; i < allChapterItems.length; i++) {
                    const chapter = allChapterItems[i];
                    const hasUnfinished = chapter.querySelector('.orangeNew, .catalog_points_yi, .jobUnfinishCount[value!="0"]');
                    if (hasUnfinished) {
                        const chapterName = chapter.querySelector('.posCatalog_name');
                        if (chapterName) {
                            const chapterTitle = chapterName.textContent.trim();
                            console.log(`✓ 选择第一个未完成章节: ${chapterTitle}`);
                            chapterName.click();
                            return true;
                        }
                    }
                }
                return false;
            }

            // 查找下一章节（当前章节的下一个）
            const nextChapterIndex = currentChapterIndex + 1;

            if (nextChapterIndex >= allChapterItems.length) {
                console.log('已经是最后一个章节，没有下一章节了');
                return false;
            }

            const nextChapter = allChapterItems[nextChapterIndex];

            // 点击下一章节
            const chapterName = nextChapter.querySelector('.posCatalog_name');
            if (chapterName) {
                const chapterTitle = chapterName.textContent.trim();
                console.log(`✓ 切换到下一章节: ${chapterTitle}`);
                chapterName.click();
                return true;
            } else {
                console.log('未找到下一章节的名称元素');
                return false;
            }

        } catch (error) {
            console.log('切换章节时出错:', error);
            return false;
        }
    }

    // 工具函数：等待元素出现
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            function check() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime >= timeout) {
                    resolve(null);
                } else {
                    setTimeout(check, 500);
                }
            }

            check();
        });
    }

    // 工具函数：在iframe中等待元素出现
    function waitForElementInIframe(iframe, selector, timeout = 10000) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            function check() {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    const element = doc.querySelector(selector);
                    if (element) {
                        resolve(element);
                    } else if (Date.now() - startTime >= timeout) {
                        resolve(null);
                    } else {
                        setTimeout(check, 500);
                    }
                } catch (error) {
                    if (Date.now() - startTime >= timeout) {
                        resolve(null);
                    } else {
                        setTimeout(check, 500);
                    }
                }
            }

            check();
        });
    }

    // 工具函数：等待iframe加载完成
    function waitForIframeLoad(iframe) {
        return new Promise((resolve) => {
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                resolve();
            } else {
                iframe.addEventListener('load', () => resolve());
            }
        });
    }

    // 工具函数：安全获取iframe文档
    function getIframeDocument(iframe) {
        try {
            return iframe.contentDocument || iframe.contentWindow.document;
        } catch (error) {
            console.log('无法访问iframe文档:', error);
            return null;
        }
    }

    // 工具函数：等待指定时间
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 初始化
    function init() {
        console.log('超星学习通自动播放器（章节修复版）初始化...');
        createControlButton();

        const observer = new MutationObserver(() => {
            if (!document.querySelector('.cx-super-player-btn')) {
                createControlButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('自动播放器已就绪');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();