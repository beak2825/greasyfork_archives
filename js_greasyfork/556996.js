// ==UserScript==
// @name         优学院答题助手 V15.5
// @namespace    https://thewinds.me/
// @version      15.5
// @description  双核驱动 | 自动刷课 | 修复视频循环播放问题 | 自动答题 | 自动提交
// @author       Winds
// @license      CC-BY-NC-4.0
// @match        *://*.ulearning.cn/*
// @connect      homeworkapi.ulearning.cn
// @connect      workers.dev
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/556996/%E4%BC%98%E5%AD%A6%E9%99%A2%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%20V155.user.js
// @updateURL https://update.greasyfork.org/scripts/556996/%E4%BC%98%E5%AD%A6%E9%99%A2%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%20V155.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    const USER_API_URL = GM_getValue('UL_AI_URL', '');
    let VIDEO_SPEED = parseFloat(GM_getValue('UL_VIDEO_SPEED', 2.0));

    const CONFIG = {
        get aiBaseUrl() { return USER_API_URL; },
 interval: 2000,

 selectors: {
     // --- 视频学习相关 ---
     courseContainer: ".catalog-list-scroller",
     videoPlayer: "video",
     nextPageBtn: ".next-page-btn",
     // 进度完成标志 (V15.5新增)
     videoProgressComplete: ".video-progress.complete",

     // --- 视频内嵌测验 ---
     courseQuizContainer: ".question-view",
     courseQuizItem: ".question-element-node",
     courseQuizWrapper: ".question-wrapper",
     courseQuizTitle: ".question-title-html",
     courseQuizType: ".question-type-tag",

     // 选项与按钮
     courseQuizTrueBtn: ".choice-btn.right-btn",
     courseQuizFalseBtn: ".choice-btn.wrong-btn",
     courseQuizChoiceItem: ".choice-item",
     courseQuizOptionLabel: ".option",
     courseQuizOptionContent: ".content .text",

     // 提交按钮
     courseQuizSubmitSingle: ".btn-submit",
     courseQuizSubmitGlobal: ".question-operation-area .btn-submit",

     // --- 作业/讨论区通用 ---
     listContainer: ".table-homework",
     writeBtn: ".item-operation .button-red-solid",
     nextPageBtnHomework: ".pagination-wrap .next",
     questionContainer: ".question-choice, .question-gap-filling, .question-short-answer",
     startQuizBtn: ".ul-button--primary",
     discussionTopic: ".contentTopText",
     submitDiscussionBtn: ".el-button.submit.el-button--primary"
 }
    };

    let isRunning = false;
    let isPaused = false;
    let videoTimer = null;
    let quizLock = false;
    let isJumping = false; // V15.5 新增：跳转锁定状态

    // ================= UI 样式 =================
    GM_addStyle(`
    #ai-panel {
    position: fixed; top: 20px; right: 20px; width: 320px; height: 480px;
    background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    border-radius: 12px; z-index: 99999; font-family: sans-serif;
    border: 1px solid #ebeef5; display: flex; flex-direction: column;
    transition: all 0.3s; overflow: hidden;
    }
    #ai-header {
    padding: 12px 15px; background: #8e44ad; color: white;
    height: 44px; box-sizing: border-box; font-weight: 600;
    display: flex; justify-content: space-between; align-items: center; cursor: move;
    }
    #ai-content { padding: 15px; overflow-y: auto; flex-grow: 1; display: flex; flex-direction: column; }
    .ai-btn {
        background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.6);
        color: white; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: 5px;
    }
    .ai-input-group { display: flex; align-items: center; margin-bottom: 10px; font-size: 13px; color: #666; }
    .ai-input-group input { width: 50px; margin-left: 10px; padding: 3px; border: 1px solid #ddd; border-radius: 4px; text-align: center; }
    .reasoning { color: #666; font-style: italic; background: #f8f9fa; padding: 8px; margin-bottom: 10px; font-size: 12px; border-left: 3px solid #ddd; }
    .answer { color: #333; font-weight: 600; white-space: pre-wrap; }
    #ai-panel.minimized {
    width: 50px !important; height: 50px !important; border-radius: 50%;
    cursor: pointer; background-color: #8e44ad;
    }
    #ai-panel.minimized #ai-content, #ai-panel.minimized #ai-header { opacity: 0; pointer-events: none; }
    #ai-panel.minimized::after { content: "📺"; font-size: 24px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; }
    `);

    // ================= UI 创建 =================
    function createUI() {
        if (document.getElementById('ai-panel')) return;
        const hasApiConfig = !!GM_getValue('UL_AI_URL', '');
        const apiStatus = hasApiConfig ? "✅ AI已配置" : "⚪ 仅客观题";

        const panel = document.createElement('div');
        panel.id = 'ai-panel';
        panel.innerHTML = `
        <div id="ai-header">
        <span>🤖 优学院 V15.5</span>
        <div>
        <button class="ai-btn" id="btn-settings" title="设置">⚙️</button>
        <button class="ai-btn" id="btn-pause" style="display:none;">⏸</button>
        <button class="ai-btn" id="btn-stop" style="display:none; background:#e74c3c;">⏹</button>
        <button class="ai-btn" id="btn-action">▶ 启动</button>
        <button class="ai-btn" id="btn-minimize">❌</button>
        </div>
        </div>
        <div id="ai-content">
        <div style="font-size:12px; color:#7f8c8d; margin-bottom:10px;">状态: ${apiStatus}</div>
        <div class="ai-input-group" id="speed-control-area" style="display:none;">
        <label>⚡ 视频倍速:</label>
        <input type="number" id="video-speed-input" value="${VIDEO_SPEED}" step="0.5" min="1" max="16">
        </div>
        <div id="status-text" style="color:#666; text-align:center; margin-top:5px;">等待操作...</div>
        <div id="ai-log" style="margin-top:15px; flex-grow:1;"></div>
        </div>
        `;
        document.body.appendChild(panel);

        const actionBtn = panel.querySelector('#btn-action');
        const pauseBtn = panel.querySelector('#btn-pause');
        const stopBtn = panel.querySelector('#btn-stop');
        const minimizeBtn = panel.querySelector('#btn-minimize');
        const speedInput = panel.querySelector('#video-speed-input');
        const settingsBtn = panel.querySelector('#btn-settings');

        minimizeBtn.onclick = (e) => { e.stopPropagation(); panel.classList.add('minimized'); };
        panel.addEventListener('click', () => { if (panel.classList.contains('minimized')) panel.classList.remove('minimized'); });

        speedInput.onchange = function() {
            let val = parseFloat(this.value);
            if(val < 0.5) val = 1;
            VIDEO_SPEED = val;
            GM_setValue('UL_VIDEO_SPEED', val);
            document.querySelector('#ai-log').innerHTML += `<div class="reasoning">倍速设为 ${val}x</div>`;
        };

        settingsBtn.onclick = () => {
            const current = GM_getValue('UL_AI_URL', '');
            const newUrl = prompt("AI API 地址:", current);
            if (newUrl !== null) { GM_setValue('UL_AI_URL', newUrl.trim()); location.reload(); }
        };

        pauseBtn.onclick = togglePause;
        stopBtn.onclick = stopQueue;

        if (isCoursePage()) {
            document.querySelector('#speed-control-area').style.display = 'flex';
            actionBtn.innerText = "▶ 刷课";
            actionBtn.onclick = startCourseLoop;
            if (GM_getValue('UL_COURSE_MODE', false)) {
                setTimeout(startCourseLoop, 1500);
            }
        } else if (isListPage()) {
            actionBtn.innerText = "▶ 队列"; actionBtn.onclick = startListQueue;
            if (GM_getValue('UL_QUEUE_MODE', false)) {
                actionBtn.style.display = 'none'; stopBtn.style.display = 'inline-block';
                setTimeout(processListPage, 2000);
            }
        } else if (isPotentialQuizPage()) {
            actionBtn.innerText = "▶ 答题"; actionBtn.onclick = () => startQuiz(false);
        }

        // 拖拽
        const header = panel.querySelector('#ai-header');
        let isDragging = false, startX, startY, initLeft, initTop;
        header.onmousedown = (e) => { isDragging = true; startX = e.clientX; startY = e.clientY; const rect = panel.getBoundingClientRect(); initLeft = rect.left; initTop = rect.top; };
        document.onmousemove = (e) => { if(isDragging) { panel.style.left = (initLeft + e.clientX - startX) + 'px'; panel.style.top = (initTop + e.clientY - startY) + 'px'; } };
        document.onmouseup = () => isDragging = false;
    }

    // ================= 状态检测 =================
    const isListPage = () => document.querySelector(CONFIG.selectors.listContainer) !== null;
    const isCoursePage = () => document.querySelector(CONFIG.selectors.courseContainer) !== null || document.querySelector(CONFIG.selectors.nextPageBtn) !== null;
    const isPotentialQuizPage = () => document.querySelectorAll(CONFIG.selectors.questionContainer).length > 0;

    // ================= 视频刷课主逻辑 (修复循环问题) =================
    function startCourseLoop() {
        isRunning = true;
        isPaused = false;
        isJumping = false; // 重置跳转锁
        GM_setValue('UL_COURSE_MODE', true);
        document.querySelector('#btn-action').style.display = 'none';
        document.querySelector('#btn-pause').style.display = 'inline-block';
        document.querySelector('#btn-stop').style.display = 'inline-block';
        processCoursePage();
    }

    function processCoursePage() {
        if (!isRunning || isPaused) return;

        // V15.5 核心修复：如果已经处于跳转状态，绝对禁止任何播放操作
        if (isJumping) return;

        // 如果正在答题，等待答题逻辑自行处理
        if (quizLock) return;

        const statusText = document.querySelector('#status-text');
        const video = document.querySelector(CONFIG.selectors.videoPlayer);

        // -------------------------
        // 1. 优先检测题目
        // -------------------------
        const hasQuiz = document.querySelector(CONFIG.selectors.courseQuizItem + ":not(.finished) .question-wrapper:not(.finished)");
        if (hasQuiz) {
            statusText.innerText = "📝 检测到题目，准备作答...";
            if (videoTimer) { clearInterval(videoTimer); videoTimer = null; }
            handleCourseQuiz();
            return;
        }

        // -------------------------
        // 2. 检测视频是否完成 (判定逻辑加强)
        // -------------------------
        const completeMarker = document.querySelector(CONFIG.selectors.videoProgressComplete); // 直接检查 .complete 类
        const finishText = document.querySelector(".video-progress .text");
        const isTextFinished = finishText && (finishText.innerText.includes("已看完") || finishText.innerText.includes("Finished"));
        const water = document.querySelector(".video-progress .water");
        const isBarFull = water && water.style.height === '100%';
        const isVideoEnded = video && (video.ended || (video.duration > 0 && video.currentTime >= video.duration - 0.5));

        // 只要满足任意一个完成条件，立即进入跳转流程
        if (completeMarker || isTextFinished || isBarFull || isVideoEnded) {
            triggerJump("✅ 检测到完成标志");
            return;
        }

        // -------------------------
        // 3. 视频播放控制
        // -------------------------
        if (video) {
            statusText.innerText = `📺 播放中 (${VIDEO_SPEED}x)...`;

            // 绑定一次性的原生 ended 事件，防止定时器漏抓
            if (!video.getAttribute('data-ai-listened')) {
                video.addEventListener('ended', () => {
                    triggerJump("✅ 原生事件捕获：播放结束");
                });
                video.setAttribute('data-ai-listened', 'true');
            }

            if (!videoTimer) {
                video.muted = true;
                videoTimer = setInterval(() => {
                    if (!isRunning || isPaused || isJumping) return; // 再次检查锁

                    // 循环内再次检测题目
                    const activeQuiz = document.querySelector(CONFIG.selectors.courseQuizItem + ":not(.finished) .question-wrapper:not(.finished)");
                    if (activeQuiz) {
                        processCoursePage();
                        return;
                    }

                    // 强制播放逻辑 (V15.5 优化：增加 isJumping 检查)
                    if (video.playbackRate !== VIDEO_SPEED) video.playbackRate = VIDEO_SPEED;

                    // 只有当未跳转且未结束时，才尝试播放
                    // 避免视频结束后重置到0时被误判为暂停从而重新播放
                    if (video.paused && !video.ended && !isJumping) {
                        // 额外检查：如果进度条满了但状态是 paused，不要点播放，直接跳转
                        const w = document.querySelector(".video-progress .water");
                        if (w && w.style.height === '100%') {
                            triggerJump("✅ 进度条已满");
                            return;
                        }
                        video.play().catch(()=>{});
                    }
                }, 1000);
            }
        } else {
            statusText.innerText = "📄 非视频页，3秒后跳转";
            setTimeout(() => triggerJump("📄 非视频页"), 3000);
        }
    }

    // V15.5 新增：统一跳转触发器
    function triggerJump(reason) {
        if (isJumping) return; // 防止重复触发
        isJumping = true; // 立即上锁

        if (videoTimer) { clearInterval(videoTimer); videoTimer = null; }

        // 强制暂停视频，防止网页自动重播
        const video = document.querySelector(CONFIG.selectors.videoPlayer);
        if (video) video.pause();

        document.querySelector('#ai-log').innerHTML += `<div class="reasoning">${reason}，跳转下一页...</div>`;
        goToNextCoursePage();
    }

    // ================= 视频内测验处理 =================
    function handleCourseQuiz() {
        if (quizLock) return;

        const allActiveQuestions = Array.from(document.querySelectorAll(CONFIG.selectors.courseQuizItem)).filter(node => {
            const wrapper = node.querySelector(CONFIG.selectors.courseQuizWrapper);
            return wrapper && !wrapper.classList.contains('finished');
        });

        if (allActiveQuestions.length === 0) {
            checkAndSubmitGlobal();
            return;
        }

        const activeQuestion = allActiveQuestions[0];
        quizLock = true;

        const logDiv = document.querySelector('#ai-log');
        const titleEl = activeQuestion.querySelector(CONFIG.selectors.courseQuizTitle);
        const typeEl = activeQuestion.querySelector(CONFIG.selectors.courseQuizType);

        if (!titleEl) { quizLock = false; return; }

        const questionText = titleEl.innerText.trim();
        const questionType = typeEl ? typeEl.innerText.trim() : "题目";

        let choicesText = "";
        const choiceItems = Array.from(activeQuestion.querySelectorAll(CONFIG.selectors.courseQuizChoiceItem));
        if (choiceItems.length > 0) {
            choiceItems.forEach(item => {
                const label = item.querySelector(CONFIG.selectors.courseQuizOptionLabel)?.innerText || "";
                const content = item.querySelector(CONFIG.selectors.courseQuizOptionContent)?.innerText || "";
                choicesText += `${label} ${content}\n`;
            });
        }

        logDiv.innerHTML += `<div class="reasoning">做题中: ${questionType}...</div>`;

        let prompt = `题目：${questionText}\n`;
        if (choicesText) prompt += `选项：\n${choicesText}\n`;
        if (questionType.includes("判断")) prompt += "请直接回答“正确”或“错误”。";
        else prompt += "请直接回答正确选项的字母（如A、B、C），不要多余解释。";

        callAI(prompt, (answer) => {
            const cleanAnswer = answer.trim();
            logDiv.innerHTML += `<div class="answer">AI: ${cleanAnswer}</div>`;

            try {
                if (questionType.includes("判断")) {
                    const isTrue = cleanAnswer.includes("正确") || cleanAnswer.includes("是") || cleanAnswer.includes("对");
                    const btn = isTrue ?
                    activeQuestion.querySelector(CONFIG.selectors.courseQuizTrueBtn) :
                    activeQuestion.querySelector(CONFIG.selectors.courseQuizFalseBtn);
                    if (btn) btn.click();
                } else {
                    const match = cleanAnswer.match(/[A-G]/i);
                    if (match) {
                        const targetLetter = match[0].toUpperCase();
                        const targetChoice = choiceItems.find(item => {
                            const label = item.querySelector(CONFIG.selectors.courseQuizOptionLabel)?.innerText;
                            return label && label.includes(targetLetter);
                        });
                        if (targetChoice) targetChoice.click();
                    }
                }

                setTimeout(() => {
                    const singleSubmit = activeQuestion.querySelector(CONFIG.selectors.courseQuizSubmitSingle);
                    if(singleSubmit) singleSubmit.click();
                    quizLock = false;
                    setTimeout(processCoursePage, 1000);
                }, 800);

            } catch (e) {
                console.error(e);
                quizLock = false;
            }
        });
    }

    function checkAndSubmitGlobal() {
        const globalSubmit = document.querySelector(CONFIG.selectors.courseQuizSubmitGlobal);
        if (globalSubmit && globalSubmit.offsetParent !== null && !globalSubmit.disabled) {
            document.querySelector('#ai-log').innerHTML += `<div class="reasoning">提交本组题目...</div>`;
            globalSubmit.click();
            setTimeout(() => { processCoursePage(); }, 3000);
        } else {
            processCoursePage();
        }
    }

    function goToNextCoursePage() {
        if (!isRunning || isPaused) return;
        const nextBtn = document.querySelector(CONFIG.selectors.nextPageBtn);
        if (nextBtn && !nextBtn.classList.contains("disabled")) {
            nextBtn.click();
            // 翻页后必须重置跳转锁，否则新页面无法播放
            setTimeout(() => {
                isJumping = false;
                processCoursePage();
            }, 3000);
        } else {
            document.querySelector('#status-text').innerText = "🎉 课程结束！";
            stopQueue();
            GM_setValue('UL_COURSE_MODE', false);
        }
    }

    // ================= 通用功能 =================
    function startListQueue() { GM_setValue('UL_LIST_URL', window.location.href); GM_setValue('UL_QUEUE_MODE', true); location.reload(); }

    function processListPage() {
        if (!isListPage() || !GM_getValue('UL_QUEUE_MODE', false) || isPaused) return;
        document.querySelector('#btn-action').style.display = 'none';
        document.querySelector('#btn-stop').style.display = 'inline-block';

        const allBtns = Array.from(document.querySelectorAll(CONFIG.selectors.writeBtn));
        const todo = allBtns.find(b => b.innerText.includes("写作业") || b.innerText.includes("继续"));
        if (todo) { setTimeout(() => todo.click(), 2000); return; }

        const nextBtn = document.querySelector(CONFIG.selectors.nextPageBtnHomework);
        if (nextBtn && !nextBtn.classList.contains('disabled')) { nextBtn.click(); setTimeout(processListPage, 3000); }
        else { stopQueue(); }
    }

    function callAI(prompt, callback) {
        if (!CONFIG.aiBaseUrl) return;
        GM_xmlhttpRequest({
            method: "POST", url: CONFIG.aiBaseUrl, headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ prompt: prompt }),
                          responseType: 'text',
                          onload: function(response) {
                              const text = response.responseText.replace(/^data: /gm, '').replace(/\[DONE\]/g, '');
                              let full = "";
                              try {
                                  const lines = text.split('\n');
                                  lines.forEach(l => { if(l.trim()) full += JSON.parse(l).choices[0].delta.content || ""; });
                              } catch(e) { full = text; }
                              callback(full);
                          }
        });
    }

    function stopQueue() {
        isRunning = false; isPaused = false;
        GM_setValue('UL_QUEUE_MODE', false); GM_setValue('UL_COURSE_MODE', false);
        if(videoTimer) clearInterval(videoTimer);
        document.querySelector('#status-text').innerText = "❌ 已停止";
        document.querySelector('#btn-action').style.display = 'inline-block';
        document.querySelector('#btn-stop').style.display = 'none';
        document.querySelector('#btn-pause').style.display = 'none';
    }

    function togglePause() {
        isPaused = !isPaused;
        const btn = document.querySelector('#btn-pause');
        if (isPaused) { btn.innerText = "▶"; btn.style.background = "#27ae60"; document.querySelector('video')?.pause(); }
        else { btn.innerText = "⏸"; btn.style.background = ""; if(isCoursePage()) processCoursePage(); }
    }

    function startQuiz(isAuto){}

    window.addEventListener('load', () => setTimeout(createUI, 2000));
})();
