// ==UserScript==
// @name         华南师范大学砺儒云课堂视频自动刷课脚本
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  动态获取课程列表，自动播放视频、自动答题并显示进度面板
// @author       zsh
// @match        https://moodle.scnu.edu.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557973/%E5%8D%8E%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E7%A0%BA%E5%84%92%E4%BA%91%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/557973/%E5%8D%8E%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E7%A0%BA%E5%84%92%E4%BA%91%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // DeepSeek API配置
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

    // 存储完成的任务ID
    const STORAGE_KEY = 'moodle_completed_videos';
    const API_KEY_STORAGE = 'moodle_deepseek_api_key';

    // 获取存储的API Key
    function getApiKey() {
        return GM_getValue(API_KEY_STORAGE, '');
    }

    // 保存API Key
    function saveApiKey(key) {
        GM_setValue(API_KEY_STORAGE, key);
    }

    // ==================== 工具函数 ====================

    // 获取已完成的任务列表
    function getCompletedVideos() {
        const saved = GM_getValue(STORAGE_KEY, '[]');
        return JSON.parse(saved);
    }

    // 保存已完成的任务
    function saveCompletedVideo(videoId) {
        const completed = getCompletedVideos();
        if (!completed.includes(videoId)) {
            completed.push(videoId);
            GM_setValue(STORAGE_KEY, JSON.stringify(completed));
        }
    }

    // 等待元素加载
    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkElement = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkElement);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkElement);
                    reject(new Error(`元素 ${selector} 加载超时`));
                }
            }, 500);
        });
    }

    // 更新状态文本
    function updateStatus(text, progress = null) {
        const statusText = document.getElementById('status-text');
        const progressText = document.getElementById('progress-text');

        if (statusText) statusText.textContent = text;
        if (progress !== null && progressText) progressText.textContent = progress + '%';

        console.log(`[状态] ${text}${progress !== null ? ' - 进度: ' + progress + '%' : ''}`);
    }

    // ==================== 页面检测函数 ====================

    function isVideoPage() {
        return window.location.href.includes('/mod/fsresource/view.php?id=');
    }

    function isQuizPage() {
        return window.location.href.includes('/mod/quiz/');
    }

    function isQuizAttemptPage() {
        return window.location.href.includes('/mod/quiz/attempt.php');
    }

    function isQuizSummaryPage() {
        return window.location.href.includes('/mod/quiz/summary.php');
    }

    function isCoursePage() {
        return window.location.href.includes('/course/view.php?id=');
    }

    function getCurrentVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    function shouldAutoContinue() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('auto_continue') === '1';
    }

    // ==================== 课程列表管理 ====================

    // 从课程索引获取所有课程任务（视频和测验）
    function getCourseItems() {
        const items = [];
        const courseIndex = document.querySelector('#course-index');

        if (!courseIndex) {
            console.log('未找到课程索引');
            return items;
        }

        const allLinks = courseIndex.querySelectorAll('a[href*="/mod/"]');

        allLinks.forEach(link => {
            const href = link.href;
            const title = link.textContent.trim();
            const idMatch = href.match(/id=(\d+)/);
            const id = idMatch ? idMatch[1] : null;

            if (!id) return;

            const parentLi = link.closest('li');
            const completionSpan = parentLi ? parentLi.querySelector('.completioninfo') : null;
            const isCompleted = completionSpan ? completionSpan.classList.contains('completion_complete') : false;

            let type = 'unknown';
            if (href.includes('/mod/fsresource/') && title.toLowerCase().endsWith('.mp4')) {
                type = 'video';
            } else if (href.includes('/mod/quiz/')) {
                type = 'quiz';
            } else {
                return;
            }

            items.push({ id, url: href, title, type, completed: isCompleted });
        });

        console.log(`📋 找到 ${items.filter(i => i.type === 'video').length} 个视频, ${items.filter(i => i.type === 'quiz').length} 个测验`);
        return items;
    }

    // 更新课程列表显示
    function updateCourseList(items) {
        const listDiv = document.getElementById('video-list');
        if (!listDiv) return;

        if (items.length === 0) {
            listDiv.innerHTML = '<div style="color: #999; text-align: center; padding: 10px;">未找到课程内容</div>';
            return;
        }

        const completed = getCompletedVideos();
        let html = '';

        items.forEach((item, index) => {
            const isCompleted = item.completed || completed.includes(item.id);
            const statusIcon = isCompleted ? '✅' : '⏳';
            const typeIcon = item.type === 'video' ? '🎬' : '📝';
            const typeText = item.type === 'video' ? '视频' : '测验';
            const statusText = isCompleted ? '已完成' : '未完成';
            const statusColor = isCompleted ? '#4CAF50' : '#ff9800';

            html += `
                <div style="margin-bottom: 8px; padding: 8px; background: white; border-left: 3px solid ${statusColor}; border-radius: 3px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 16px;">${statusIcon}</span>
                        <span style="font-size: 14px;">${typeIcon}</span>
                        <div style="flex: 1; overflow: hidden;">
                            <div style="font-weight: bold; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.title}">${index + 1}. ${item.title}</div>
                            <div style="font-size: 11px; color: #999; margin-top: 2px;">${typeText} - ${statusText}</div>
                        </div>
                    </div>
                </div>
            `;
        });

        listDiv.innerHTML = html;
    }

    // ==================== 控制面板 ====================

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'moodle-auto-panel';
        panel.innerHTML = `
            <div style="position: fixed; top: 10px; right: 10px; width: 350px; background: white; border: 2px solid #4CAF50; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 10000; font-family: Arial, sans-serif;">
                <div style="background: #4CAF50; color: white; padding: 12px; border-radius: 6px 6px 0 0; cursor: move; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold;">📺 Moodle自动刷课</span>
                    <button id="panel-minimize" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; width: 24px; height: 24px;">−</button>
                </div>
                <div id="panel-content" style="padding: 15px;">
                    <div style="margin-bottom: 10px;">
                        <button id="start-auto" style="width: 100%; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold;">🚀一键刷课答题（无需再按自动答题）</button>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <button id="auto-quiz" style="width: 100%; padding: 10px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold;">🤖 自动答题</button>
                    </div>

                    <!-- API Key配置区域 -->
                    <div style="margin-bottom: 10px; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px;">
                        <div style="font-size: 12px; font-weight: bold; margin-bottom: 8px; color: #333; display: flex; align-items: center; gap: 5px;">
                            🔑 DeepSeek API Key
                            <button id="toggle-api-key" style="background: none; border: none; color: #2196F3; cursor: pointer; font-size: 11px; padding: 2px 6px; border-radius: 3px; text-decoration: underline;">设置</button>
                        </div>
                        <div id="api-key-config" style="display: none;">
                            <input type="password" id="api-key-input" placeholder="输入您的DeepSeek API Key" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px; margin-bottom: 8px; box-sizing: border-box;">
                            <div style="display: flex; gap: 5px;">
                                <button id="save-api-key" style="flex: 1; padding: 6px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">💾 保存</button>
                                <button id="test-api-key" style="flex: 1; padding: 6px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">🧪 测试</button>
                                <button id="clear-api-key" style="flex: 1; padding: 6px; background: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">🗑️ 清除</button>
                            </div>
                            <div id="api-key-status" style="font-size: 11px; margin-top: 5px; color: #666;"></div>
                        </div>
                        <div id="api-key-display" style="font-size: 11px; color: #666;">
                            <span id="api-key-status-text">未配置</span>
                        </div>
                    </div>

                    <div style="margin-bottom: 10px;">
                        <button id="refresh-list" style="width: 100%; padding: 8px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">🔄 刷新课程列表</button>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <button id="clear-history" style="width: 100%; padding: 8px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">🗑️ 清除播放记录</button>
                    </div>
                    <div style="margin-bottom: 10px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">当前状态：<span id="status-text" style="color: #333; font-weight: bold;">就绪</span></div>
                        <div style="font-size: 12px; color: #666;">进度：<span id="progress-text" style="color: #333; font-weight: bold;">0%</span></div>
                    </div>
                    <div style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px; background: #fafafa;">
                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px; color: #333;">📋 课程列表：</div>
                        <div id="video-list" style="font-size: 12px;"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        const minimizeBtn = document.getElementById('panel-minimize');
        const panelContent = document.getElementById('panel-content');
        let isMinimized = false;

        minimizeBtn.onclick = function() {
            isMinimized = !isMinimized;
            panelContent.style.display = isMinimized ? 'none' : 'block';
            minimizeBtn.textContent = isMinimized ? '+' : '−';
        };

        return panel;
    }

    // ==================== 视频处理 ====================

    function getPageProgress() {
        const progressElement = document.querySelector('.num-bfjd span');
        if (progressElement) {
            const progressText = progressElement.textContent.trim();
            return parseFloat(progressText);
        }
        return 0;
    }

    function isVideoCompleted() {
        const statusElement = document.querySelector('.tips-completion');
        if (statusElement) {
            return statusElement.textContent.trim().includes('已完成');
        }
        return false;
    }

    async function playVideo() {
        try {
            // 等待视频元素加载
            await waitForElement('#fsplayer-container-id_html5_api', 10000);
            const video = document.getElementById('fsplayer-container-id_html5_api');

            if (video) {
                // 尝试播放
                try {
                    await video.play();
                    console.log('✅ 视频开始播放');
                    return true;
                } catch (playErr) {
                    // 如果自动播放失败，尝试点击播放按钮
                    console.log('⚠️ 自动播放失败，尝试点击播放按钮');
                    const playButton = document.querySelector('.vjs-big-play-button, .vjs-play-control');
                    if (playButton) {
                        playButton.click();
                        console.log('✅ 已点击播放按钮');
                        return true;
                    }
                }
            }
        } catch (err) {
            console.log('⚠️ 视频元素未找到:', err.message);
        }
        return false;
    }

    async function handleVideoPage(currentVideoId) {
        console.log('='.repeat(50));
        console.log('📺 开始处理视频页面, ID:', currentVideoId);

        updateStatus('正在播放视频...');
        await playVideo();

        try {
            await waitForElement('.xxCard', 20000);
            console.log('✅ 进度卡片已加载');
        } catch (err) {
            console.log('⚠️ 进度卡片加载超时');
        }

        let checkCount = 0;
        let lastProgress = 0;
        let stuckCount = 0;
        const MAX_STUCK_COUNT = 5;
        const CHECK_INTERVAL = 3000;

        const progressInterval = setInterval(async () => {
            checkCount++;
            const progress = getPageProgress();
            const completed = isVideoCompleted();

            updateStatus('播放中...', progress.toFixed(1));
            console.log(`[检测 ${checkCount}] 播放进度: ${progress}% | 完成状态: ${completed ? '已完成' : '未完成'}`);

            if (progress === lastProgress && progress < 95 && !completed) {
                stuckCount++;
                console.log(`⚠️ 进度未变化 (${stuckCount}/${MAX_STUCK_COUNT})`);

                if (stuckCount >= MAX_STUCK_COUNT) {
                    console.log('🔄 检测到进度卡死，尝试重新播放视频...');
                    updateStatus('进度卡死，重新播放...', progress.toFixed(1));

                    const video = document.getElementById('fsplayer-container-id_html5_api');
                    if (video) {
                        try {
                            video.pause();
                            await new Promise(resolve => setTimeout(resolve, 500));
                            await video.play();
                            console.log('✅ 视频已重新播放');
                            updateStatus('已重新播放', progress.toFixed(1));
                        } catch (err) {
                            console.log('⚠️ 重新播放失败:', err);
                            const playButton = document.querySelector('.vjs-play-control, .vjs-big-play-button');
                            if (playButton) {
                                playButton.click();
                                console.log('✅ 已点击播放按钮');
                            }
                        }
                    }
                    stuckCount = 0;
                }
            } else {
                if (progress !== lastProgress) {
                    stuckCount = 0;
                }
            }

            lastProgress = progress;

            if (progress >= 95 || completed) {
                clearInterval(progressInterval);
                console.log('✅ 视频学习完成！');
                saveCompletedVideo(currentVideoId);
                updateStatus('视频已完成，正在查找下一个任务...', 100);

                setTimeout(() => {
                    console.log('🔍 从课程索引查找下一个未完成的任务...');
                    const items = getCourseItems();

                    if (items.length > 0) {
                        console.log(`📋 当前课程列表中共有 ${items.length} 个任务`);
                        const nextItem = items.find(item => !item.completed && item.id !== currentVideoId);

                        if (nextItem) {
                            console.log(`⏭️ 找到下一个任务 [${nextItem.type === 'video' ? '视频' : '测验'}]:`, nextItem.title);
                            updateStatus('跳转到下一个任务...');
                            window.location.href = nextItem.url;
                        } else {
                            console.log('🎉 所有任务已完成！');
                            updateStatus('全部完成！', 100);
                            alert('🎉 恭喜！所有课程任务已完成！');
                        }
                    } else {
                        console.log('⚠️ 未找到课程列表');
                        updateStatus('未找到课程列表');
                        alert('未找到更多任务，请检查课程页面');
                    }
                }, 3000);
            }
        }, CHECK_INTERVAL);

        setTimeout(() => {
            clearInterval(progressInterval);
            console.log('⚠️ 达到最大检测时间');
        }, 2 * 60 * 60 * 1000);
    }

    // ==================== 测验处理 ====================

    async function getAnswerFromDeepSeek(question, options = null, questionType = 'single') {
        const apiKey = getApiKey();
        if (!apiKey || apiKey.trim() === '') {
            console.log('⚠️ 未配置DeepSeek API Key，跳过自动答题');
            return null;
        }

        let prompt;

        if (questionType === 'truefalse') {
            // 判断题
            prompt = `请判断以下陈述是对还是错，只需要返回"对"或"错"，不要有任何其他内容：

题目：${question}

请直接返回"对"或"错"：`;
        } else if (questionType === 'single') {
            prompt = `请回答以下单选题，只需要返回正确选项的字母（A、B、C或D），不要有任何其他内容：

问题：${question}

选项：
${options.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`).join('\n')}

请直接返回答案字母（A/B/C/D）：`;
        } else if (questionType === 'multiple') {
            prompt = `请回答以下多选题，返回所有正确选项的字母，用逗号分隔（例如：A,C 或 B,D），不要有其他内容：

问题：${question}

选项：
${options.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`).join('\n')}

请直接返回答案字母（格式：A,C）：`;
        } else if (questionType === 'fill') {
            prompt = `请回答以下填空题。题目中的空白处用[空1]、[空2]等表示。请按顺序返回所有空白处的答案，每个答案用"|"分隔，不要有其他内容。

题目：${question}

请直接返回答案，用"|"分隔（例如：理性人|经济人|人）：`;
        }

        try {
            console.log('🤖 正在调用DeepSeek API...');
            const response = await fetch(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.3,
                    max_tokens: questionType === 'fill' ? 100 : 20
                })
            });

            if (!response.ok) {
                console.log('❌ API调用失败:', response.status);
                return null;
            }

            const data = await response.json();
            const answer = data.choices[0].message.content.trim();

            if (questionType === 'truefalse') {
                // 判断是"对"还是"错"
                if (answer.includes('对') || answer.toLowerCase().includes('true')) {
                    console.log('✅ DeepSeek返回答案: 对');
                    return 'true';
                } else if (answer.includes('错') || answer.toLowerCase().includes('false')) {
                    console.log('✅ DeepSeek返回答案: 错');
                    return 'false';
                }
            } else if (questionType === 'single') {
                const match = answer.toUpperCase().match(/[ABCD]/);
                if (match) {
                    console.log('✅ DeepSeek返回答案:', match[0]);
                    return match[0];
                }
            } else if (questionType === 'multiple') {
                const matches = answer.toUpperCase().match(/[ABCD]/g);
                if (matches && matches.length > 0) {
                    console.log('✅ DeepSeek返回答案:', matches);
                    return matches;
                }
            } else if (questionType === 'fill') {
                const answers = answer.split('|').map(a => a.trim());
                console.log('✅ DeepSeek返回填空答案:', answers);
                return answers;
            }

            return null;
        } catch (err) {
            console.log('❌ DeepSeek API调用出错:', err);
            return null;
        }
    }

    function getQuestionInfo(questionElement) {
        // 先尝试获取formulation容器
        const formulation = questionElement.querySelector('.formulation');

        if (!formulation) {
            return null;
        }

        // 检测题目类型
        const radioInputs = questionElement.querySelectorAll('input[type="radio"]');
        const checkboxInputs = questionElement.querySelectorAll('input[type="checkbox"]');
        const textInputs = questionElement.querySelectorAll('input[type="text"]');

        // 判断题（对/错）- 通过class检测
        if (questionElement.classList.contains('truefalse')) {
            const qtext = questionElement.querySelector('.qtext');
            if (!qtext) return null;

            const question = qtext.textContent.trim();
            const trueInput = questionElement.querySelector('input[id*="answertrue"]');
            const falseInput = questionElement.querySelector('input[id*="answerfalse"]');

            if (trueInput && falseInput) {
                return {
                    type: 'truefalse',
                    question,
                    inputs: {
                        true: trueInput,
                        false: falseInput
                    }
                };
            }
        }

        // 单选题
        if (radioInputs.length > 0 && !questionElement.classList.contains('truefalse')) {
            const qtext = questionElement.querySelector('.qtext');
            const answerDivs = questionElement.querySelectorAll('.answer .d-flex[data-region="answer-label"]');

            if (!qtext || answerDivs.length === 0) {
                return null;
            }

            const question = qtext.textContent.trim();
            const options = Array.from(answerDivs).map(div => {
                const textDiv = div.querySelector('.flex-fill');
                return textDiv ? textDiv.textContent.trim() : '';
            });

            return {
                type: 'single',
                question,
                options,
                inputs: Array.from(radioInputs).filter(input => input.value !== '-1')
            };
        }

        // 多选题
        if (checkboxInputs.length > 0) {
            const qtext = questionElement.querySelector('.qtext');
            const answerDivs = questionElement.querySelectorAll('.answer .d-flex[data-region="answer-label"]');

            if (!qtext || answerDivs.length === 0) {
                return null;
            }

            const question = qtext.textContent.trim();
            const options = Array.from(answerDivs).map(div => {
                const textDiv = div.querySelector('.flex-fill');
                return textDiv ? textDiv.textContent.trim() : '';
            });

            return {
                type: 'multiple',
                question,
                options,
                inputs: Array.from(checkboxInputs)
            };
        }

        // 填空题（内嵌式）
        if (textInputs.length > 0) {
            // 克隆节点以便处理
            const formulationClone = formulation.cloneNode(true);

            // 移除隐藏元素和标签
            const hiddenElements = formulationClone.querySelectorAll('.accesshide, input[type="hidden"], h4');
            hiddenElements.forEach(el => el.remove());

            // 将input替换为占位符
            const inputs = formulationClone.querySelectorAll('input[type="text"]');
            inputs.forEach((input, index) => {
                const placeholder = document.createElement('span');
                placeholder.textContent = `[空${index + 1}]`;
                input.parentNode.replaceChild(placeholder, input);
            });

            const questionText = formulationClone.textContent.trim();

            return {
                type: 'fill',
                question: questionText,
                inputs: Array.from(textInputs),
                blankCount: textInputs.length
            };
        }

        return null;
    }

    async function autoAnswerQuiz(autoSubmit = false) {
        console.log('📝 开始自动答题...');
        updateStatus('正在自动答题...');

        const questions = document.querySelectorAll('.formulation');
        console.log(`📋 找到 ${questions.length} 道题目`);

        let answeredCount = 0;

        for (let i = 0; i < questions.length; i++) {
            const questionElement = questions[i].closest('.que');
            const info = getQuestionInfo(questionElement);

            if (!info) {
                console.log(`⚠️ 第 ${i + 1} 题：无法解析题目`);
                continue;
            }

            const typeText = info.type === 'single' ? '单选题' : info.type === 'multiple' ? '多选题' : info.type === 'truefalse' ? '判断题' : '填空题';
            console.log(`\n📌 第 ${i + 1} 题 [${typeText}]：${info.question.substring(0, 40)}...`);

            // 判断题处理
            if (info.type === 'truefalse') {
                const alreadySelected = info.inputs.true.checked || info.inputs.false.checked;
                if (alreadySelected) {
                    console.log('✓ 已选择，跳过');
                    answeredCount++;
                    continue;
                }

                const answer = await getAnswerFromDeepSeek(info.question, null, 'truefalse');

                if (answer === 'true') {
                    info.inputs.true.click();
                    console.log(`✅ 已选择答案: 对`);
                    answeredCount++;
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else if (answer === 'false') {
                    info.inputs.false.click();
                    console.log(`✅ 已选择答案: 错`);
                    answeredCount++;
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    console.log('❌ 未获取到答案，跳过此题');
                }
            }

            // 单选题处理
            else if (info.type === 'single') {
                const alreadySelected = info.inputs.some(input => input.checked);
                if (alreadySelected) {
                    console.log('✓ 已选择，跳过');
                    answeredCount++;
                    continue;
                }

                const answer = await getAnswerFromDeepSeek(info.question, info.options, 'single');

                if (answer) {
                    const answerIndex = answer.charCodeAt(0) - 65;

                    if (answerIndex >= 0 && answerIndex < info.inputs.length) {
                        info.inputs[answerIndex].click();
                        console.log(`✅ 已选择答案: ${answer}`);
                        answeredCount++;
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } else {
                        console.log('❌ 答案索引超出范围');
                    }
                } else {
                    console.log('❌ 未获取到答案，跳过此题');
                }
            }

            // 多选题处理
            else if (info.type === 'multiple') {
                const alreadySelected = info.inputs.some(input => input.checked);
                if (alreadySelected) {
                    console.log('✓ 已选择，跳过');
                    answeredCount++;
                    continue;
                }

                const answers = await getAnswerFromDeepSeek(info.question, info.options, 'multiple');

                if (answers && Array.isArray(answers)) {
                    let clickedCount = 0;
                    for (const answer of answers) {
                        const answerIndex = answer.charCodeAt(0) - 65;

                        if (answerIndex >= 0 && answerIndex < info.inputs.length) {
                            info.inputs[answerIndex].click();
                            clickedCount++;
                            await new Promise(resolve => setTimeout(resolve, 200));
                        }
                    }
                    if (clickedCount > 0) {
                        console.log(`✅ 已选择 ${clickedCount} 个答案: ${answers.join(', ')}`);
                        answeredCount++;
                        await new Promise(resolve => setTimeout(resolve, 300));
                    } else {
                        console.log('❌ 未能选择答案，跳过此题');
                    }
                } else {
                    console.log('❌ 未获取到答案，跳过此题');
                }
            }

            // 填空题处理
            else if (info.type === 'fill') {
                const alreadyFilled = info.inputs.every(input => input.value.trim() !== '');
                if (alreadyFilled) {
                    console.log('✓ 已填写，跳过');
                    answeredCount++;
                    continue;
                }

                const answers = await getAnswerFromDeepSeek(info.question, null, 'fill');

                if (answers && Array.isArray(answers)) {
                    let filledCount = 0;
                    for (let j = 0; j < Math.min(answers.length, info.inputs.length); j++) {
                        if (answers[j]) {
                            info.inputs[j].value = answers[j];
                            info.inputs[j].dispatchEvent(new Event('input', { bubbles: true }));
                            info.inputs[j].dispatchEvent(new Event('change', { bubbles: true }));
                            filledCount++;
                        }
                    }
                    if (filledCount > 0) {
                        console.log(`✅ 已填写 ${filledCount}/${info.blankCount} 个空:`, answers.slice(0, filledCount));
                        answeredCount++;
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } else {
                        console.log('❌ 未能填写答案，跳过此题');
                    }
                } else {
                    console.log('❌ 未获取到填空答案，跳过此题');
                }
            }
        }

        console.log(`\n✅ 自动答题完成！共回答 ${answeredCount}/${questions.length} 题`);
        updateStatus(`答题完成 ${answeredCount}/${questions.length}`);

        // 检查是否有"全部提交并结束"按钮
        const submitAllBtn = document.querySelector('button[type="submit"].btn-primary[id*="single_button"]');
        if (submitAllBtn && submitAllBtn.textContent.includes('全部提交')) {
            console.log('🎯 检测到"全部提交并结束"按钮');
            await new Promise(resolve => setTimeout(resolve, 1000));
            submitAllBtn.click();
            console.log('✅ 已点击"全部提交并结束"按钮');

            // 等待确认弹窗并点击确认
            await new Promise(resolve => setTimeout(resolve, 1000));
            const confirmBtn = document.querySelector('.modal-footer button[data-action="save"]');
            if (confirmBtn) {
                confirmBtn.click();
                console.log('✅ 已确认提交');
                return 'submitted';
            }
        }

        // 否则查找"下一页"按钮
        console.log('🚀 点击下一页按钮...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const nextBtn = document.querySelector('input[type="submit"][name="next"], input.mod_quiz-next-nav');
        if (nextBtn) {
            nextBtn.click();
            console.log('✅ 已点击下一页');
            return true;
        } else {
            console.log('⚠️ 未找到下一页按钮');
            return false;
        }
    }

    async function handleQuizPage(currentQuizId) {
        console.log('='.repeat(50));
        console.log('📝 开始处理测验页面, ID:', currentQuizId);

        updateStatus('准备答题...');

        try {
            await waitForElement('.formulation', 10000);
            console.log('✅ 题目已加载');
        } catch (err) {
            console.log('⚠️ 题目加载超时');
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        // 自动答题并点击下一页或提交
        const result = await autoAnswerQuiz(true);

        if (result === 'submitted') {
            // 已经提交了整个测验
            console.log('✅ 测验已全部提交，等待跳转...');
            saveCompletedVideo(currentQuizId);

            await new Promise(resolve => setTimeout(resolve, 5000));

            const items = getCourseItems();
            const nextItem = items.find(item => !item.completed && item.id !== currentQuizId);

            if (nextItem) {
                console.log(`⏭️ 跳转到下一个任务 [${nextItem.type === 'video' ? '视频' : '测验'}]:`, nextItem.title);
                updateStatus('跳转到下一个任务...');
                window.location.href = nextItem.url;
            } else {
                console.log('🎉 所有任务已完成！');
                updateStatus('全部完成！', 100);
                alert('🎉 恭喜！所有课程任务已完成！');
            }
        } else if (result === true) {
            // 点击了下一页
            console.log('✅ 已跳转到下一页/题，等待加载...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            // 检查是否还在答题页面
            if (isQuizAttemptPage()) {
                console.log('🔄 检测到还有题目，继续答题...');
                handleQuizPage(currentQuizId);
            } else {
                // 已经提交完成，跳转到下一个任务
                console.log('✅ 测验已全部完成');
                saveCompletedVideo(currentQuizId);

                await new Promise(resolve => setTimeout(resolve, 2000));

                const items = getCourseItems();
                const nextItem = items.find(item => !item.completed && item.id !== currentQuizId);

                if (nextItem) {
                    console.log(`⏭️ 跳转到下一个任务 [${nextItem.type === 'video' ? '视频' : '测验'}]:`, nextItem.title);
                    updateStatus('跳转到下一个任务...');
                    window.location.href = nextItem.url;
                } else {
                    console.log('🎉 所有任务已完成！');
                    updateStatus('全部完成！', 100);
                    alert('🎉 恭喜！所有课程任务已完成！');
                }
            }
        } else {
            // 没有找到按钮
            console.log('⚠️ 未找到下一页或提交按钮');
            saveCompletedVideo(currentQuizId);

            await new Promise(resolve => setTimeout(resolve, 2000));

            const items = getCourseItems();
            const nextItem = items.find(item => !item.completed && item.id !== currentQuizId);

            if (nextItem) {
                console.log(`⏭️ 跳转到下一个任务 [${nextItem.type === 'video' ? '视频' : '测验'}]:`, nextItem.title);
                updateStatus('跳转到下一个任务...');
                window.location.href = nextItem.url;
            } else {
                console.log('🎉 所有任务已完成！');
                updateStatus('全部完成！', 100);
                alert('🎉 恭喜！所有课程任务已完成！');
            }
        }
    }

    // ==================== 主函数 ====================

    function init() {
        console.log('🚀 Moodle自动刷课脚本已加载');

        setTimeout(() => {
            createControlPanel();
            const items = getCourseItems();
            updateCourseList(items);

            // 初始化API Key显示
            const savedApiKey = getApiKey();
            const apiKeyStatusText = document.getElementById('api-key-status-text');
            const apiKeyInput = document.getElementById('api-key-input');

            if (savedApiKey) {
                apiKeyStatusText.textContent = `已配置 (${savedApiKey.substring(0, 8)}...${savedApiKey.substring(savedApiKey.length - 4)})`;
                apiKeyStatusText.style.color = '#4CAF50';
                apiKeyInput.value = savedApiKey;
            } else {
                apiKeyStatusText.textContent = '未配置';
                apiKeyStatusText.style.color = '#f44336';
            }

            // API Key配置面板切换
            document.getElementById('toggle-api-key').onclick = function() {
                const configDiv = document.getElementById('api-key-config');
                const displayDiv = document.getElementById('api-key-display');
                if (configDiv.style.display === 'none') {
                    configDiv.style.display = 'block';
                    displayDiv.style.display = 'none';
                } else {
                    configDiv.style.display = 'none';
                    displayDiv.style.display = 'block';
                }
            };

            // 保存API Key
            document.getElementById('save-api-key').onclick = function() {
                const apiKey = apiKeyInput.value.trim();
                if (apiKey) {
                    saveApiKey(apiKey);
                    apiKeyStatusText.textContent = `已配置 (${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)})`;
                    apiKeyStatusText.style.color = '#4CAF50';
                    document.getElementById('api-key-status').textContent = '✅ API Key已保存';
                    document.getElementById('api-key-status').style.color = '#4CAF50';
                    setTimeout(() => {
                        document.getElementById('api-key-config').style.display = 'none';
                        document.getElementById('api-key-display').style.display = 'block';
                    }, 1500);
                } else {
                    document.getElementById('api-key-status').textContent = '❌ 请输入API Key';
                    document.getElementById('api-key-status').style.color = '#f44336';
                }
            };

            // 测试API Key
            document.getElementById('test-api-key').onclick = async function() {
                const apiKey = apiKeyInput.value.trim();
                if (!apiKey) {
                    document.getElementById('api-key-status').textContent = '❌ 请先输入API Key';
                    document.getElementById('api-key-status').style.color = '#f44336';
                    return;
                }

                document.getElementById('api-key-status').textContent = '🔄 测试中...';
                document.getElementById('api-key-status').style.color = '#2196F3';

                try {
                    const response = await fetch(DEEPSEEK_API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: 'deepseek-chat',
                            messages: [{ role: 'user', content: '测试' }],
                            max_tokens: 10
                        })
                    });

                    if (response.ok) {
                        document.getElementById('api-key-status').textContent = '✅ API Key有效';
                        document.getElementById('api-key-status').style.color = '#4CAF50';
                    } else {
                        const errorData = await response.json();
                        document.getElementById('api-key-status').textContent = `❌ 无效: ${errorData.error?.message || response.statusText}`;
                        document.getElementById('api-key-status').style.color = '#f44336';
                    }
                } catch (err) {
                    document.getElementById('api-key-status').textContent = `❌ 测试失败: ${err.message}`;
                    document.getElementById('api-key-status').style.color = '#f44336';
                }
            };

            // 清除API Key
            document.getElementById('clear-api-key').onclick = function() {
                if (confirm('确定要清除API Key吗？')) {
                    saveApiKey('');
                    apiKeyInput.value = '';
                    apiKeyStatusText.textContent = '未配置';
                    apiKeyStatusText.style.color = '#f44336';
                    document.getElementById('api-key-status').textContent = '🗑️ 已清除';
                    document.getElementById('api-key-status').style.color = '#666';
                }
            };

            document.getElementById('start-auto').onclick = function() {
                const items = getCourseItems();
                const firstIncomplete = items.find(item => !item.completed);

                if (firstIncomplete) {
                    console.log(`🎬 开始自动刷课，跳转到 [${firstIncomplete.type === 'video' ? '视频' : '测验'}]:`, firstIncomplete.title);
                    window.location.href = firstIncomplete.url;
                } else {
                    alert('所有任务已完成！');
                }
            };

            document.getElementById('auto-quiz').onclick = function() {
                if (isQuizAttemptPage()) {
                    autoAnswerQuiz(false);
                } else {
                    alert('当前不在测验答题页面！请先开始测验。');
                }
            };

            document.getElementById('refresh-list').onclick = function() {
                const items = getCourseItems();
                updateCourseList(items);
                updateStatus('列表已刷新');
            };

            document.getElementById('clear-history').onclick = function() {
                if (confirm('确定要清除所有完成记录吗？')) {
                    GM_setValue(STORAGE_KEY, '[]');
                    const items = getCourseItems();
                    updateCourseList(items);
                    updateStatus('记录已清除');
                }
            };

        }, 1000);

        if (isVideoPage()) {
            const currentId = getCurrentVideoId();
            setTimeout(() => {
                handleVideoPage(currentId);
            }, 2000);
        } else if (isQuizSummaryPage()) {
            // 测验汇总页面，直接提交
            setTimeout(() => {
                console.log('📊 检测到测验汇总页面，准备提交...');
                const submitBtn = document.querySelector('#single_button69328f16a20e510, button.btn-primary[type="submit"]');
                if (submitBtn && submitBtn.textContent.includes('全部提交')) {
                    console.log('🎯 找到"全部提交并结束"按钮，准备点击...');
                    setTimeout(() => {
                        submitBtn.click();
                        console.log('✅ 已点击提交按钮');

                        // 等待确认弹窗
                        setTimeout(() => {
                            const confirmBtn = document.querySelector('.modal-footer button[data-action="save"]');
                            if (confirmBtn) {
                                confirmBtn.click();
                                console.log('✅ 已确认提交');

                                // 提交后跳转下一个任务
                                const currentId = getCurrentVideoId();
                                saveCompletedVideo(currentId);

                                setTimeout(() => {
                                    const items = getCourseItems();
                                    const nextItem = items.find(item => !item.completed && item.id !== currentId);

                                    if (nextItem) {
                                        console.log(`⏭️ 跳转到下一个任务 [${nextItem.type === 'video' ? '视频' : '测验'}]:`, nextItem.title);
                                        window.location.href = nextItem.url;
                                    } else {
                                        console.log('🎉 所有任务已完成！');
                                        alert('🎉 恭喜！所有课程任务已完成！');
                                    }
                                }, 3000);
                            }
                        }, 1000);
                    }, 1000);
                } else {
                    console.log('⚠️ 未找到提交按钮');
                }
            }, 2000);
        } else if (isQuizPage() && !isQuizAttemptPage()) {
            setTimeout(() => {
                console.log('📝 检测到测验页面，查找开始按钮...');

                let hasClicked = false;
                const checkStartButton = setInterval(() => {
                    let startBtn = document.getElementById('id_submitbutton');

                    if (!startBtn) {
                        startBtn = document.querySelector('input[type="submit"][value="开始答题"]');
                    }

                    if (!startBtn) {
                        const buttons = document.querySelectorAll('button[type="submit"], input[type="submit"]');
                        for (const btn of buttons) {
                            if (btn.textContent.includes('开始') || btn.value.includes('开始')) {
                                startBtn = btn;
                                break;
                            }
                        }
                    }

                    if (startBtn && !hasClicked) {
                        hasClicked = true;
                        clearInterval(checkStartButton);
                        console.log('🚀 找到开始答题按钮，准备点击...');
                        setTimeout(() => {
                            startBtn.click();
                            console.log('✅ 已点击开始答题按钮');
                        }, 1000);
                    }
                }, 500);

                setTimeout(() => {
                    clearInterval(checkStartButton);
                    if (!hasClicked) {
                        console.log('⚠️ 未找到开始按钮，跳过此测验，查找下一个任务...');
                        updateStatus('未找到开始按钮，跳过测验');

                        // 标记当前测验为已完成(跳过)
                        const currentId = getCurrentVideoId();
                        saveCompletedVideo(currentId);

                        // 查找下一个任务
                        setTimeout(() => {
                            const items = getCourseItems();
                            const nextItem = items.find(item => !item.completed && item.id !== currentId);

                            if (nextItem) {
                                console.log(`⏭️ 跳转到下一个任务 [${nextItem.type === 'video' ? '视频' : '测验'}]:`, nextItem.title);
                                updateStatus('跳转到下一个任务...');
                                window.location.href = nextItem.url;
                            } else {
                                console.log('🎉 所有任务已完成！');
                                updateStatus('全部完成！', 100);
                                alert('🎉 恭喜！所有课程任务已完成！');
                            }
                        }, 1000);
                    }
                }, 10000);
            }, 2000);
        } else if (isQuizAttemptPage()) {
            const currentId = getCurrentVideoId();
            setTimeout(() => {
                handleQuizPage(currentId);
            }, 2000);
        }
    }

    init();

})();