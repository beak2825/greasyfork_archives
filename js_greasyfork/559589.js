// ==UserScript==
// @name         四川执业药师-金航联平台
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  针对 sc.mtnet.com.cn（四川执业药师-金航联平台） 网站设计的自动化刷课脚本，实现自动导航、静音、后台播放以及功能更强大的AI自动考试助手。请注意倍速不可用！！！自该版本(1.5.1)起更新了协议
// @author       Coren
// @match        *://sc.mtnet.com.cn/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.deepseek.com
// @license CC BY-NC-SA 4.0
// license: https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh
// @downloadURL https://update.greasyfork.org/scripts/559589/%E5%9B%9B%E5%B7%9D%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88-%E9%87%91%E8%88%AA%E8%81%94%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559589/%E5%9B%9B%E5%B7%9D%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88-%E9%87%91%E8%88%AA%E8%81%94%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================================================================================
    // --- 脚本配置 (Script Configuration) ---
    // ===================================================================================
    const CONFIG = {
        VIDEO_PLAYBACK_RATE: 16.0, // 默认视频播放倍速
        API_PROMPT: "你是一个乐于助人的问题回答助手。聚焦于执业药师相关的内容，请根据用户提出的问题，提供准确、清晰的解答。注意回答时仅仅包括答案，不允许其他额外任何解释，输出为一行一道题目的答案，答案只能是题目序号:字母选项，不能包含文字内容。单选输出示例：1.A。多选输出示例：1.ABC。",
    };

    // --- 脚本全局状态 (Global States) ---
    let isServiceActive = GM_getValue('mtnet_service_active', true);
    let currentPlaybackRate = GM_getValue('mtnet_playback_rate', CONFIG.VIDEO_PLAYBACK_RATE);
    let isMuted = GM_getValue('mtnet_is_muted', true);
    let deepseekApiKey = GM_getValue('deepseek_api_key', '');
    let isAutoExamMode = GM_getValue('mtnet_auto_exam_mode', false);
    let isPanelCreated = false;
    let chapterCheckInterval = null;
    let storedAnswers = null;

    // ===================================================================================
    // --- 辅助函数 (Helper Functions) ---
    // ===================================================================================

    function findElementByText(selector, text) {
        try {
            return Array.from(document.querySelectorAll(selector)).find(el => el.innerText.trim().includes(text.trim()));
        } catch (e) {
            console.error(`[脚本错误] 查找元素失败: selector="${selector}", text="${text}"`, e);
            return null;
        }
    }

    function clickElement(element, description) {
        if (element && typeof element.click === 'function') {
            console.log(`[脚本操作] 正在点击: ${description}`, element);
            element.click();
            return true;
        } else {
            console.warn(`[脚本警告] 尝试点击一个不存在或不可点击的元素: ${description}`, element);
            return false;
        }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // ===================================================================================
    // --- UI面板管理 (UI Panel Management) ---
    // ===================================================================================

    function createControlPanel() {
        if (isPanelCreated) return;
        isPanelCreated = true;

        GM_addStyle(`
            #control-panel { position: fixed; bottom: 20px; right: 20px; width: 240px; background-color: #fff; border: 1px solid #007bff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); z-index: 10000; font-family: 'Microsoft YaHei', sans-serif; }
            #control-panel-header { padding: 8px 12px; background-color: #007bff; color: white; cursor: move; user-select: none; border-top-left-radius: 7px; border-top-right-radius: 7px;}
            #control-panel-content { padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
            .panel-btn { padding: 8px 16px; font-size: 14px; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s; width: 100%; box-sizing: border-box; }
            .service-btn-active { background-color: #28a745; }
            .service-btn-paused { background-color: #dc3545; }
            .mute-btn-on { background-color: #ffc107; color: black; }
            .mute-btn-off { background-color: #6c757d; }
            .nav-btn { background-color: #17a2b8; }
            .exam-btn { background-color: #fd7e14; }
            .panel-divider { width: 100%; height: 1px; background-color: #eee; margin: 5px 0; }
            .setting-row { display: flex; flex-direction: column; width: 100%; align-items: center; gap: 5px; }
            .setting-row > label { font-size: 14px; font-weight: bold; }
            .speed-slider-container { display: flex; align-items: center; width: 100%; gap: 10px; }
            #speed-slider { flex-grow: 1; }
            #speed-display { font-weight: bold; font-size: 14px; color: #007bff; min-width: 45px; text-align: right; }
            #api-key-input { width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box; }
        `);

        const panel = document.createElement('div');
        panel.id = 'control-panel';
        panel.innerHTML = `
            <div id="control-panel-header"><span>刷课/考试控制面板 v3.5.0</span></div>
            <div id="control-panel-content">
                <div class="setting-row">
                    <label>总开关 (点击刷新)</label>
                    <button id="service-toggle-btn" class="panel-btn"></button>
                </div>
                <div class="panel-divider"></div>
                <div class="setting-row">
                    <label>播放设置</label>
                    <button id="mute-toggle-btn" class="panel-btn"></button>
                    <div class="speed-slider-container" style="margin-top: 5px;">
                         <input type="range" id="speed-slider" min="1" max="16" step="0.5" value="${currentPlaybackRate}">
                         <span id="speed-display">x${currentPlaybackRate}</span>
                    </div>
                </div>
                <div class="panel-divider"></div>
                 <div class="setting-row">
                    <label>DeepSeek API Key</label>
                    <input type="password" id="api-key-input" placeholder="在此输入你的API Key" value="${deepseekApiKey}">
                </div>
                <div class="panel-divider"></div>
                <div class="setting-row">
                    <label>快速导航</label>
                    <button id="nav-specialized-video-btn" class="panel-btn nav-btn">专业课-视频</button>
                    <button id="nav-public-video-btn" class="panel-btn nav-btn" style="margin-top: 5px;">公需科目-视频</button>
                    <button id="nav-specialized-exam-btn" class="panel-btn exam-btn" style="margin-top: 5px;">专业课-考试</button>
                    <button id="nav-public-exam-btn" class="panel-btn exam-btn" style="margin-top: 5px;">公需课-考试</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // --- Event Listeners ---
        const serviceBtn = document.getElementById('service-toggle-btn');
        const muteBtn = document.getElementById('mute-toggle-btn');
        const speedSlider = document.getElementById('speed-slider');
        const speedDisplay = document.getElementById('speed-display');
        const apiKeyInput = document.getElementById('api-key-input');
        const navSpecializedBtn = document.getElementById('nav-specialized-video-btn');
        const navPublicBtn = document.getElementById('nav-public-video-btn');
        const navSpecializedExamBtn = document.getElementById('nav-specialized-exam-btn');
        const navPublicExamBtn = document.getElementById('nav-public-exam-btn'); // 新增按钮

        const updateServiceButton = (isActive) => { serviceBtn.innerText = isActive ? '服务运行中' : '服务已暂停'; serviceBtn.className = 'panel-btn ' + (isActive ? 'service-btn-active' : 'service-btn-paused'); };
        const updateMuteButton = (isMutedState) => { muteBtn.innerText = isMutedState ? '静音模式' : '正常音量'; muteBtn.className = 'panel-btn ' + (isMutedState ? 'mute-btn-on' : 'mute-btn-off'); };

        updateServiceButton(isServiceActive);
        updateMuteButton(isMuted);

        serviceBtn.onclick = () => { GM_setValue('mtnet_service_active', !isServiceActive); window.location.reload(); };
        muteBtn.onclick = async () => {
            isMuted = !isMuted;
            GM_setValue('mtnet_is_muted', isMuted);
            updateMuteButton(isMuted);
            const video = await findVideo();
            if (video) video.muted = isMuted;
        };
        speedSlider.addEventListener('input', () => { speedDisplay.textContent = `x${speedSlider.value}`; });
        speedSlider.addEventListener('change', () => { currentPlaybackRate = parseFloat(speedSlider.value); GM_setValue('mtnet_playback_rate', currentPlaybackRate); });
        apiKeyInput.addEventListener('change', () => { deepseekApiKey = apiKeyInput.value.trim(); GM_setValue('deepseek_api_key', deepseekApiKey); });
        navSpecializedBtn.onclick = () => { GM_setValue('mtnet_target_task', 'specialized_video'); window.location.href = 'http://sc.mtnet.com.cn/user/courses'; };
        navPublicBtn.onclick = () => { GM_setValue('mtnet_target_task', 'public_video'); window.location.href = 'http://sc.mtnet.com.cn/user/courses'; };
        navSpecializedExamBtn.onclick = () => { GM_setValue('mtnet_target_task', 'specialized_exam'); window.location.href = 'http://sc.mtnet.com.cn/user/courses'; };
        // 新增按钮的点击事件
        navPublicExamBtn.onclick = () => { GM_setValue('mtnet_target_task', 'public_exam'); window.location.href = 'http://sc.mtnet.com.cn/user/courses'; };

        makeDraggable(panel, document.getElementById('control-panel-header'));
    }

    function makeDraggable(panel, header) {
        let isDragging = false, offsetX, offsetY;
        header.addEventListener('mousedown', (e) => { isDragging = true; offsetX = e.clientX - panel.offsetLeft; offsetY = e.clientY - panel.offsetTop; header.style.cursor = 'grabbing'; });
        document.addEventListener('mousemove', (e) => { if (!isDragging) return; panel.style.left = `${e.clientX - offsetX}px`; panel.style.top = `${e.clientY - offsetY}px`; });
        document.addEventListener('mouseup', () => { isDragging = false; header.style.cursor = 'move'; });
    }

    // ===================================================================================
    // --- 页面逻辑处理 (Page-Specific Logic) ---
    // ===================================================================================

    async function handleCourseListPage() {
        console.log('[脚本流程] 进入课程列表页面处理流程...');
        try {
            const targetTask = GM_getValue('mtnet_target_task', 'specialized_video');
            // 逻辑已足够通用，无需修改
            const courseType = targetTask.includes('specialized') ? '专业科目' : '公需科目';
            const isExamTask = targetTask.includes('exam');
            const filterType = isExamTask ? '待考试' : '未完成';
            const actionButtonSelector = isExamTask ? '.indexTextBtn.onlineTest' : '.indexTextBtn';
            const actionButtonText = isExamTask ? '在线考试' : '进入学习';

            const courseTab = findElementByText('span.gxkn', courseType);
            if (courseTab && !courseTab.classList.contains('active')) { clickElement(courseTab, `"${courseType}" 标签`); await delay(2000); }
            const filterBtn = findElementByText('a.screenItem', filterType);
            if (filterBtn && !filterBtn.classList.contains('active')) { clickElement(filterBtn, `"${filterType}" 筛选按钮`); await delay(2000); }

            const courseList = document.querySelectorAll('.indexCourseListSLi');
            for (const course of courseList) {
                const actionBtn = course.querySelector(actionButtonSelector);
                if (actionBtn && actionBtn.innerText.trim() === actionButtonText) {
                    clickElement(actionBtn, `第一个课程的 "${actionButtonText}" 按钮`); return;
                }
            }
            console.log(`[脚本完成] 在 "${courseType}" 的 "${filterType}" 列表中未找到任何可操作的课程。`);
        } catch (error) { console.error('[脚本错误] 处理课程列表页面时出错:', error); }
    }

    async function handleVideoPage() {
        console.log('[脚本流程] 进入视频学习页面处理流程...');
        if (chapterCheckInterval) clearInterval(chapterCheckInterval);
        try {
            chapterCheckInterval = setInterval(() => {
                if (!window.location.href.includes('/video/')) { clearInterval(chapterCheckInterval); return; }
                const totalProgressElement = document.querySelector('.courseProgress .gkjd span[style*="color: rgb(255, 148, 102)"]');
                if (totalProgressElement && totalProgressElement.innerText.trim().includes('100')) {
                    clearInterval(chapterCheckInterval); window.location.href = 'http://sc.mtnet.com.cn/user/courses'; return;
                }
                const chapters = document.querySelectorAll('.detailRightC .chapterList li');
                const nextChapter = Array.from(chapters).find(ch => !ch.querySelector('span.chapterPro.floatR.currPlay')?.innerText.trim().includes('100'));
                if (nextChapter && !nextChapter.classList.contains('active')) {
                    clickElement(nextChapter.querySelector('a'), '下一个未完成的章节');
                } else if (!nextChapter) {
                    clearInterval(chapterCheckInterval); window.location.href = 'http://sc.mtnet.com.cn/user/courses';
                }
            }, 5000);
        } catch (error) { console.error('[脚本错误] 处理视频学习页面时出错:', error); }
    }

    async function handleExamPage() {
        console.log('[脚本流程] 进入考试页面处理流程...');
        const existingPanel = document.getElementById('exam-helper-panel');
        if (existingPanel) existingPanel.remove();
        createExamHelperUI();
    }

    // ===================================================================================
    // --- AI考试助手 (AI Exam Helper) ---
    // ===================================================================================

    function createExamHelperUI() {
        GM_addStyle(`
            #exam-helper-panel { position: fixed; top: 20px; left: 20px; width: 450px; background: #f9f9f9; border: 1px solid #007bff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 10001; font-family: 'Microsoft YaHei', sans-serif; display: flex; flex-direction: column; max-height: 90vh; }
            #exam-helper-header { padding: 10px 15px; background-color: #007bff; color: white; cursor: move; border-top-left-radius: 7px; border-top-right-radius: 7px; font-size: 16px; flex-shrink: 0; }
            #exam-helper-content { padding: 15px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto; }
            #exam-action-btn { color: white; padding: 10px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; transition: background-color 0.3s; }
            #exam-action-btn:disabled { background-color: #ccc; cursor: not-allowed; }
            #exam-status { margin-top: 5px; padding: 10px; background-color: #e9ecef; border-radius: 5px; text-align: center; font-size: 14px; color: #495057; min-height: 20px; }
            .auto-mode-switch { display: flex; align-items: center; gap: 8px; background: #e9ecef; padding: 8px; border-radius: 5px; }
            .display-area { border: 1px solid #ddd; background: #fff; padding: 10px; border-radius: 5px; max-height: 200px; overflow-y: auto; }
            .display-area h4 { margin: 0 0 10px 0; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .display-area pre { white-space: pre-wrap; word-wrap: break-word; font-size: 12px; margin: 0; }
            #manual-ask-container { display: flex; flex-direction: column; gap: 10px; }
            #manual-question-input { width: 100%; min-height: 60px; padding: 8px; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box; }
            #manual-ask-btn { background-color: #5a6268; color: white; padding: 8px; border: none; border-radius: 5px; cursor: pointer; }
        `);

        const panel = document.createElement('div');
        panel.id = 'exam-helper-panel';
        panel.innerHTML = `
            <div id="exam-helper-header"><span>AI 答题助手 v3.5</span></div>
            <div id="exam-helper-content">
                <div class="auto-mode-switch">
                    <input type="checkbox" id="auto-mode-checkbox" ${isAutoExamMode ? 'checked' : ''}>
                    <label for="auto-mode-checkbox">自动答题模式 (开启后将全自动答题并交卷)</label>
                </div>
                <button id="exam-action-btn">开始自动答题</button>
                <div id="exam-status">请先在主控制面板输入API Key。</div>
                <div id="qa-display-container" style="display: flex; gap: 10px;">
                    <div id="question-display" class="display-area" style="flex: 1;"><h4>提取的题目:</h4><pre></pre></div>
                    <div id="answer-display" class="display-area" style="flex: 1;"><h4>AI 回答:</h4><pre></pre></div>
                </div>
                <div id="manual-ask-container">
                    <h4>手动提问区</h4>
                    <textarea id="manual-question-input" placeholder="可在此输入单个问题向AI提问..."></textarea>
                    <button id="manual-ask-btn">手动提问</button>
                    <div id="manual-answer-display" class="display-area" style="display: none;"><h4>手动提问结果:</h4><pre></pre></div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        const actionBtn = document.getElementById('exam-action-btn');
        const statusDiv = document.getElementById('exam-status');
        const autoModeCheckbox = document.getElementById('auto-mode-checkbox');
        const questionPre = document.querySelector('#question-display pre');
        const answerPre = document.querySelector('#answer-display pre');
        const manualInput = document.getElementById('manual-question-input');
        const manualAskBtn = document.getElementById('manual-ask-btn');
        const manualAnswerDiv = document.getElementById('manual-answer-display');
        const manualAnswerPre = document.querySelector('#manual-answer-display pre');

        let examState = 'initial';

        const updateBtnState = (state, text, color, disabled) => { examState = state; actionBtn.innerText = text; actionBtn.style.backgroundColor = color; actionBtn.disabled = disabled; };
        updateBtnState('initial', '开始自动答题', '#28a745', false);

        autoModeCheckbox.addEventListener('change', () => {
            isAutoExamMode = autoModeCheckbox.checked;
            GM_setValue('mtnet_auto_exam_mode', isAutoExamMode);
            statusDiv.innerText = `自动模式已${isAutoExamMode ? '开启' : '关闭'}`;
        });

        const runFullAuto = async () => {
            try {
                updateBtnState('fetching', '正在提取题目...', '#ffc107', true);
                statusDiv.innerText = '自动模式: 正在提取题目...';
                const questionsText = extractQuestions();
                if (!questionsText) throw new Error('未能提取到任何题目。');
                questionPre.innerText = questionsText;

                statusDiv.innerText = '自动模式: 正在请求AI...';
                const answers = await getAnswersFromAI(questionsText);
                if (!answers) throw new Error('AI未能返回有效答案。');
                answerPre.innerText = answers;
                storedAnswers = answers;

                statusDiv.innerText = '自动模式: 正在填写答案...';
                await fillAnswers(storedAnswers);

                statusDiv.innerText = '自动模式: 即将自动交卷...';
                await delay(2000);
                const submitBtn = document.querySelector('span.loginBtn.btn');
                if (clickElement(submitBtn, '"交卷"按钮')) {
                    statusDiv.innerText = '已交卷！即将返回课程列表...';
                    await delay(3000);
                    // 保持当前任务类型，以便循环考试
                    const currentTask = GM_getValue('mtnet_target_task', 'specialized_exam');
                    GM_setValue('mtnet_target_task', currentTask);
                    window.location.href = 'http://sc.mtnet.com.cn/user/courses';
                } else { throw new Error('未找到交卷按钮！'); }
            } catch (error) {
                console.error('[AI考试助手-自动模式] 发生错误:', error);
                statusDiv.innerText = `自动模式错误: ${error.message}`;
                statusDiv.style.color = 'red';
                updateBtnState('initial', '重新开始答题', '#28a745', false);
            }
        };

        actionBtn.onclick = async () => {
            if (deepseekApiKey === '') { statusDiv.innerText = '错误：API Key为空！'; statusDiv.style.color = 'red'; return; }
            if (autoModeCheckbox.checked) { runFullAuto(); return; }

            try {
                if (examState === 'initial') {
                    updateBtnState('fetching', '正在请求AI...', '#ffc107', true);
                    statusDiv.innerText = '正在提取题目并请求AI分析...';
                    const questionsText = extractQuestions();
                    if (!questionsText) throw new Error('未能提取到任何题目。');
                    questionPre.innerText = questionsText;
                    storedAnswers = await getAnswersFromAI(questionsText);
                    if (!storedAnswers) throw new Error('AI未能返回有效答案。');
                    answerPre.innerText = storedAnswers;
                    updateBtnState('ready_to_fill', '确认并填写答案', '#17a2b8', false);
                    statusDiv.innerText = 'AI分析完成！请点击按钮填写答案。';
                    statusDiv.style.color = '#007bff';
                } else if (examState === 'ready_to_fill') {
                    updateBtnState('filling', '正在填写...', '#ffc107', true);
                    statusDiv.innerText = '正在自动填写答案...';
                    await fillAnswers(storedAnswers);
                    updateBtnState('ready_to_submit', '确认并交卷', '#dc3545', false);
                    statusDiv.innerText = '所有答案已填写！请点击按钮确认交卷。';
                    statusDiv.style.color = 'green';
                } else if (examState === 'ready_to_submit') {
                    updateBtnState('submitting', '正在交卷...', '#6c757d', true);
                    const submitBtn = document.querySelector('span.loginBtn.btn');
                    if (clickElement(submitBtn, '"交卷"按钮')) {
                        statusDiv.innerText = '已点击交卷！即将返回课程列表...';
                        await delay(3000);
                        const currentTask = GM_getValue('mtnet_target_task', 'specialized_exam');
                        GM_setValue('mtnet_target_task', currentTask);
                        window.location.href = 'http://sc.mtnet.com.cn/user/courses';
                    } else { throw new Error('未找到交卷按钮！'); }
                }
            } catch (error) {
                console.error('[AI考试助手-手动模式] 发生错误:', error);
                statusDiv.innerText = `发生错误: ${error.message}`;
                statusDiv.style.color = 'red';
                updateBtnState('initial', '重新开始答题', '#28a745', false);
            }
        };

        manualAskBtn.onclick = async () => {
            const question = manualInput.value.trim();
            if (!question) { alert('请输入问题！'); return; }
            if (!deepseekApiKey) { alert('请输入API Key！'); return; }
            manualAskBtn.disabled = true;
            manualAskBtn.innerText = '正在思考...';
            manualAnswerDiv.style.display = 'block';
            manualAnswerPre.innerText = '...';
            try {
                const answer = await getAnswersFromAI(question);
                manualAnswerPre.innerText = answer;
            } catch (error) {
                manualAnswerPre.innerText = `请求失败: ${error.message}`;
            } finally {
                manualAskBtn.disabled = false;
                manualAskBtn.innerText = '手动提问';
            }
        };

        makeDraggable(panel, document.getElementById('exam-helper-header'));
    }

    function extractQuestions() {
        const questionElements = document.querySelectorAll('div[id^="q"]');
        if (questionElements.length === 0) {
            console.error('[AI考试助手] 错误：未能使用选择器 `div[id^="q"]` 找到任何问题容器。');
            return null;
        }
        let fullText = '';
        let questionCounter = 1;
        questionElements.forEach(q => {
            const questionTextEl = q.querySelector('p');
            if (!questionTextEl) return;
            const originalText = questionTextEl.innerText.trim().replace(/^\d+\.\s*/, '');
            fullText += `${questionCounter}. ${originalText}\n`;
            const options = q.querySelectorAll('.el-radio__label, .el-checkbox__label');
            options.forEach(opt => {
                fullText += opt.innerText + '\n';
            });
            fullText += '\n';
            questionCounter++;
        });
        console.log('[AI考试助手] v3.4 修正后提取的题目内容:\n', fullText);
        return fullText;
    }

    function getAnswersFromAI(questions) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.deepseek.com/chat/completions',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${deepseekApiKey}` },
                data: JSON.stringify({ model: 'deepseek-chat', messages: [{ "role": "system", "content": CONFIG.API_PROMPT }, { "role": "user", "content": questions }], stream: false }),
                onload: (response) => {
                    if (response.status === 200) {
                        const result = JSON.parse(response.responseText);
                        resolve(result.choices[0].message.content);
                    } else { reject(new Error(`API请求失败, 状态码: ${response.status}`)); }
                },
                onerror: (error) => { reject(new Error('网络请求错误')); }
            });
        });
    }

    async function fillAnswers(answerText) {
        const answerMap = new Map();
        answerText.trim().split('\n').forEach(line => {
            const match = line.match(/(\d+)\s*\.\s*([A-Z]+)/i);
            if (match) answerMap.set(parseInt(match[1], 10), match[2].toUpperCase());
        });
        console.log('[AI考试助手] v3.4 修正后解析的答案 Map:', answerMap);
        const allQuestions = document.querySelectorAll('div[id^="q"]');
        for (let i = 0; i < allQuestions.length; i++) {
            const questionEl = allQuestions[i];
            const questionNum = i + 1;
            if (answerMap.has(questionNum)) {
                const answerChars = answerMap.get(questionNum);
                console.log(`[AI考试助手] 正在为第 ${questionNum} 个问题 (容器ID: ${questionEl.id}) 填写答案: ${answerChars}`);
                for (const optionChar of answerChars.split('')) {
                    const labels = questionEl.querySelectorAll('.el-radio, .el-checkbox');
                    let optionClicked = false;
                    for (const label of labels) {
                        const labelText = label.querySelector('.el-radio__label, .el-checkbox__label')?.innerText.trim();
                        if (labelText && labelText.startsWith(optionChar)) {
                            clickElement(label, `第 ${questionNum} 个问题的选项 ${optionChar}`);
                            await delay(200);
                            optionClicked = true;
                        }
                    }
                    if (!optionClicked) {
                         console.warn(`[AI考试助手] 在问题 ${questionNum} 中未找到选项 ${optionChar}`);
                    }
                }
            } else {
                console.warn(`[AI考试助手] AI未提供第 ${questionNum} 个问题的答案。`);
            }
        }
    }


    // ===================================================================================
    // --- 核心修复 (Core Fixes) ---
    // ===================================================================================

    const findVideo = async (timeout = 15000) => {
        let elapsedTime = 0;
        const intervalTime = 500;
        while (elapsedTime < timeout) {
            let foundVideo = document.querySelector('video');
            if (foundVideo) return foundVideo;
            const iframe = document.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
                try {
                    foundVideo = iframe.contentWindow.document.querySelector('video');
                    if (foundVideo) return foundVideo;
                } catch (e) { /* cross-origin */ }
            }
            await delay(intervalTime);
            elapsedTime += intervalTime;
        }
        return null;
    };

    function initializeAntiPauseFixes() {
        try {
            Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
            Object.defineProperty(document, 'hidden', { value: false, configurable: true });
            document.dispatchEvent(new Event('visibilitychange'));
        } catch (e) { console.error('[脚本错误] 伪装页面可见性失败:', e); }
        setInterval(async () => {
            if (!isServiceActive || !window.location.href.includes('/video/')) return;
            const video = await findVideo();
            if (video) {
                if (video.paused && !video.ended) video.play().catch(e => {});
                if (video.playbackRate !== currentPlaybackRate) video.playbackRate = currentPlaybackRate;
                if (video.muted !== isMuted) video.muted = isMuted;
            }
        }, 2000);
    }

    // ===================================================================================
    // --- 主循环与启动器 (Main Loop & Initiator) ---
    // ===================================================================================

    function router() {
        if (!isServiceActive) return;
        if (chapterCheckInterval) clearInterval(chapterCheckInterval);
        const url = window.location.href;
        console.log(`[脚本路由] 当前URL: ${url}`);
        if (url.includes('/user/courses')) { handleCourseListPage(); }
        else if (url.includes('/video/')) { handleVideoPage(); }
        else if (url.includes('/examination/')) { handleExamPage(); }
        else { console.log('[脚本路由] 未匹配到特定页面，脚本空闲。'); }
    }

    window.addEventListener('load', () => {
        console.log(`[脚本加载] 新版MTNet刷课脚本 v3.5.0 (功能扩展版) 已启动。`);
        createControlPanel();
        initializeAntiPauseFixes();
        if (isServiceActive) {
            let currentUrl = window.location.href;
            setTimeout(router, 2000);
            setInterval(() => {
                if (window.location.href !== currentUrl) { currentUrl = window.location.href; router(); }
            }, 1000);
        } else { console.log(`[脚本主循环] 服务已暂停，请在控制面板中开启。`); }
    });

})();
