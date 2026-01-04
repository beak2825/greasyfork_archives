// ==UserScript==
// @name         优学院DGUT版
// @version      1.6
// @description  适配DGUT优学院（自动静音播放、自动做练习题、自动翻页、修改播放速率）
// @author       Linus
// @match        https://ua.dgut.edu.cn/learnCourse/learnCourse.html*
// @icon         https://lms.dgut.edu.cn/ulearning/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @namespace https://greasyfork.org/users/1540778
// @downloadURL https://update.greasyfork.org/scripts/556678/%E4%BC%98%E5%AD%A6%E9%99%A2DGUT%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/556678/%E4%BC%98%E5%AD%A6%E9%99%A2DGUT%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     *  优学院自动静音播放、自动做练习题、自动翻页、修改播放速率脚本（适配东莞理工学院）
     *  重要提醒：使用风险自负，避免高倍速/长时间挂机，建议非核心课程使用，仅限个人学习使用，禁止商用
     *  基于作者Brush-JIM的脚本“优学院自动静音播放、自动做练习题、自动翻页、修改播放速率（改）”
     *  和作者 luluzzy. 的脚本“DGUT Ulearning Tool”（MIT协议）二次开发重构
     *  原脚本链接：https://greasyfork.org/zh-CN/scripts/555722-dgut-ulearning-tool
     *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */

    // 配置管理中心
    const AppConfig = {
        playbackRate: 1.5,
        autoPlay: true,
        autoMute: true,
        autoAdjustRate: true,
        autoFillAnswers: true,
        showAnswers: true,
        autoAnswerSingle: true,
        autoAnswerMulti: true,
        autoAnswerJudge: true,
        autoAnswerBlank: true,
        maxRetryCount: 7,
        getStorageKey: (key) => `ulearn_${key}`,
        load: function () {
            const prefix = 'ulearn_';
            Object.keys(this).forEach(key => {
                if (typeof this[key] !== 'function' && key !== 'maxRetryCount') {
                    const stored = localStorage.getItem(prefix + key);
                    if (stored !== null) {
                        this[key] = stored === 'true' || (stored !== 'false' && stored);
                    }
                }
            });
        },
        save: function () {
            const prefix = 'ulearn_';
            Object.keys(this).forEach(key => {
                if (typeof this[key] !== 'function' && key !== 'maxRetryCount') {
                    localStorage.setItem(prefix + key, this[key]);
                }
            });
        }
    };

    // 状态管理
    const AppState = {
        isPaused: false,
        isRestarting: false,
        isNavigating: false,
        answerInProgress: false,
        modalChecking: false,
        nextPageRetry: 0,
        reset: function () {
            this.nextPageRetry = 0;
            this.isNavigating = false;
        }
    };

    // 日志工具
    const Logger = {
        element: null,
        init: function (el) {
            this.element = el;
        },
        log: function (message) {
            const timestamp = new Date().toLocaleTimeString();
            const logMsg = `[${timestamp}] ${message}`;
            console.log(`DGUT助手: ${logMsg}`);
            if (this.element) {
                this.element.innerHTML += `${logMsg}<br>`;
                this.element.scrollTop = this.element.scrollHeight;
            }
        }
    };

    // 答案处理服务
    class AnswerService {
        getQuestionType(questionEl) {
            const typeTag = questionEl.querySelector('.question-type-tag');
            if (!typeTag) return null;

            const typeText = typeTag.textContent.trim();
            if (typeText.includes('单选题')) return 'single';
            if (typeText.includes('多选题')) return 'multiple';
            if (typeText.includes('判断题')) return 'judge';
            if (typeText.includes('填空题')) return 'blank';
            return null;
        }

        processQuestion(questionId, answers) {
            if (AppState.isPaused || AppState.isRestarting) return;

            const questionEl = document.querySelector(`#question${questionId}`);
            if (!questionEl) {
                Logger.log(`未找到问题容器: ${questionId}`);
                return;
            }

            const type = this.getQuestionType(questionEl);
            if (!type) {
                Logger.log(`无法识别题型: ${questionId}`);
                return;
            }

            const handlers = {
                single: () => this.handleChoice(questionEl, answers),
                multiple: () => this.handleChoice(questionEl, answers),
                judge: () => this.handleJudge(questionEl, answers),
                blank: () => this.handleBlank(questionEl, answers)
            };

            if (handlers[type]) {
                handlers[type]();
            } else {
                Logger.log(`不支持的题型: ${type}`);
            }
        }

        handleChoice(questionEl, answers) {
            const options = questionEl.querySelectorAll('.choice-item, .option-item, .question-option');
            if (!options.length) {
                Logger.log(`选择题选项未找到: ${questionEl.id}`);
                return;
            }

            options.forEach(option => {
                const optionLabel = option.querySelector('.option')?.textContent?.trim().replace('.', '') ||
                                   option.querySelector('.option-letter')?.textContent?.trim() ||
                                   option.querySelector('span:first-child')?.textContent?.trim().replace('.', '');

                if (optionLabel && answers.includes(optionLabel)) {
                    const selector = option.querySelector('.checkbox, .option-checkbox, .radio');
                    if (selector && !selector.classList.contains('selected')) {
                        option.click();
                        if (!selector.classList.contains('selected')) {
                            selector.click();
                        }
                        Logger.log(`选中选项: ${optionLabel}`);
                    }
                }
            });
        }

        handleJudge(questionEl, answers) {
            const isCorrect = String(answers) === 'true';
            const btnSelector = isCorrect ? '.right-btn' : '.wrong-btn';
            const judgeBtn = questionEl.querySelector(btnSelector);

            if (judgeBtn && !judgeBtn.classList.contains('selected')) {
                judgeBtn.click();
                Logger.log(`判断题选择: ${isCorrect ? '正确' : '错误'}`);
            }
        }

        handleBlank(questionEl, answers) {
            const inputs = questionEl.querySelectorAll('textarea, .blank-input');
            answers.forEach((ans, idx) => {
                if (inputs[idx]) {
                    const cleanedAns = this.cleanHtml(this.escapeHtml(ans));
                    inputs[idx].value = cleanedAns;
                    $(inputs[idx]).trigger('change');
                }
            });
            Logger.log(`填空题已填充: ${answers.join('; ')}`);
        }

        escapeHtml(str) {
            const entities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
            return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, (_, key) => entities[key]);
        }

        cleanHtml(str) {
            return str.replace(/(<[^>]+>|\\n|\\r)/g, ' ');
        }
    }

    // 视频控制服务
    class VideoController {
        constructor() {
            this.observer = null;
        }

        init() {
            this.setupVideoMonitoring();
        }

        setupVideoMonitoring() {
            this.observer = new MutationObserver((mutations) => {
                if (!AppState.isPaused && !AppState.isRestarting) {
                    this.processVideos();
                    this.checkModals();
                }
            });
            this.observer.observe(document.body, { childList: true, subtree: true });
        }

        processVideos(slept = false) {
            if (AppState.isPaused || AppState.isRestarting || !AppConfig.autoPlay) return;

            if (AppState.answerInProgress) {
                setTimeout(() => this.processVideos(true), 1000);
                return;
            }

            if (!slept) {
                setTimeout(() => this.processVideos(true), 3000);
                return;
            }

            const video = document.querySelector("video, mediaelementwrapper video:first-child");
            if (video) {
                video.playbackRate = AppConfig.playbackRate;
                if (AppConfig.autoMute && !video.muted) {
                    video.muted = true;
                    Logger.log("视频已静音");
                }
            }

            const videoWrappers = $('mediaelementwrapper video:first-child');
            const statusIndicators = $('.video-bottom span:first-child');

            if (videoWrappers.length === 0) {
                PageNavigator.goNext();
                return;
            }

            if (videoWrappers.length !== statusIndicators.length) {
                PageNavigator.goNext();
                return;
            }

            const videoStates = [];
            $(videoWrappers).each((idx, el) => {
                const state = $(statusIndicators[idx]).attr('data-bind');
                videoStates.push({
                    element: el,
                    completed: state === 'text: $root.i18nMessageText().finished',
                    currentTime: 0
                });
            });

            videoStates.forEach((state, idx) => {
                state.element.addEventListener('ended', () => {
                    videoStates[idx].completed = true;
                    Logger.log("视频播放完成");
                    PageNavigator.goNext();
                }, { once: true });
            });

            this.controlPlayback(videoStates);
        }

        controlPlayback(videoStates) {
            if (AppState.isPaused || AppState.isRestarting) return;

            if (videoStates.length !== $('mediaelementwrapper video:first-child').length) {
                this.processVideos();
                return;
            }

            videoStates.forEach(state => {
                state.element.playbackRate = AppConfig.playbackRate;
            });

            for (let i = 0; i < videoStates.length; i++) {
                if (videoStates[i].element !== $('mediaelementwrapper video:first-child')[i]) {
                    this.processVideos();
                    return;
                }

                if (!videoStates[i].completed) {
                    const targetVideo = (i > 0 && !videoStates[i - 1].completed) ? videoStates[i - 1] : videoStates[i];

                    if (targetVideo.element.paused || targetVideo.currentTime === targetVideo.element.currentTime) {
                        targetVideo.element.currentTime = Math.max(0, targetVideo.element.currentTime - 3);
                        targetVideo.element.play().catch(err => {
                            Logger.log(`播放失败: ${err.message}`);
                            AppRestarter.restart();
                        });
                    }

                    targetVideo.currentTime = targetVideo.element.currentTime;

                    if (AppConfig.autoMute && !targetVideo.element.muted) {
                        targetVideo.element.muted = true;
                    }

                    if (AppConfig.autoAdjustRate && targetVideo.element.playbackRate !== AppConfig.playbackRate) {
                        targetVideo.element.playbackRate = AppConfig.playbackRate;
                    }

                    setTimeout(() => this.controlPlayback(videoStates), 500);
                    return;
                }
            }

            PageNavigator.goNext();
        }

        checkModals(slept = false) {
            if (AppState.isPaused || AppState.isRestarting || AppState.answerInProgress) return;

            if (!slept) {
                setTimeout(() => this.checkModals(true), 2000);
                return;
            }

            AppState.modalChecking = true;

            const questionPanel = $('.question-wrapper');
            if (questionPanel.length > 0 && AppConfig.autoFillAnswers) {
                AnswerProcessor.processQuiz();
                AppState.modalChecking = false;
                return;
            }

            const statModal = $('#statModal');
            if (statModal.length > 0) {
                const buttons = statModal[0].getElementsByTagName('button');
                if (buttons.length >= 2) buttons[1].click();
            }

            const errorIndicator = $('.mobile-video-error');
            if (errorIndicator && errorIndicator.css('display') !== 'none') {
                $('.try-again').click();
                Logger.log("检测到视频错误，已尝试重试");
            }

            const alertModal = document.getElementById('alertModal');
            if (alertModal && alertModal.className.includes('in')) {
                const operations = $('.modal-operation').children();
                if (operations.length >= 2) {
                    operations[AppConfig.autoFillAnswers ? 0 : 1].click();
                } else {
                    const continueBtn = $('.btn-submit');
                    continueBtn.each((_, btn) => {
                        if ($(btn).text() !== '提交') $(btn).click();
                    });
                }
                if (AppConfig.autoFillAnswers) AnswerProcessor.processQuiz();
            }

            AppState.modalChecking = false;
        }
    }

    // 页面导航器
    const PageNavigator = {
        goNext: function () {
            if (AppState.isNavigating || AppState.isPaused || AppState.isRestarting ||
                AppState.answerInProgress || !AppConfig.autoPlay || AppState.modalChecking) {
                return;
            }

            Logger.log("尝试导航至下一页");
            const nextButtons = $('.mobile-next-page-btn, .next-btn, .btn-next, .nextVideoBtn');

            if (nextButtons.length === 0) {
                AppState.nextPageRetry++;
                Logger.log(`未找到下一页按钮（${AppState.nextPageRetry}/${AppConfig.maxRetryCount}）`);

                if (AppState.nextPageRetry >= AppConfig.maxRetryCount) {
                    AppState.isPaused = true;
                    document.getElementById('toggleScript').innerText = '▶️ 继续运行';
                    document.getElementById('toggleScript').style.backgroundColor = 'rgba(46, 204, 113, 0.5)';
                    Logger.log(`连续${AppConfig.maxRetryCount}次未找到下一页，已暂停`);
                }
                return;
            }

            AppState.nextPageRetry = 0;
            AppState.isNavigating = true;
            Logger.log("锁定导航状态，防止重复操作");

            nextButtons.each((_, btn) => {
                if (!$(btn).hasClass('disabled')) {
                    btn.click();
                    Logger.log("已点击下一页按钮");
                }
            });

            setTimeout(() => {
                Logger.log("导航完成，解除锁定");
                AppState.isNavigating = false;

                setTimeout(() => {
                    if (!AppState.isPaused && !AppState.isRestarting) {
                        videoController.processVideos();
                        videoController.checkModals();
                    }
                }, 1000);
            }, 3000);
        }
    };

    // 答案处理器
    const AnswerProcessor = {
        processQuiz: function () {
            if (AppState.isPaused || AppState.isRestarting || AppState.answerInProgress || !AppConfig.autoFillAnswers) {
                return;
            }

            AppState.answerInProgress = true;
            Logger.log("检测到测验页面，开始处理答案");

            let questionIds = [];
            const questionPanels = $('.question-wrapper');
            const pageItems = $('.page-item');

            const waitForQuestions = setInterval(() => {
                const currentPanels = $('.question-wrapper');
                if (currentPanels.length > 0) {
                    clearInterval(waitForQuestions);

                    currentPanels.each((_, panel) => {
                        const id = $(panel).attr('id');
                        if (id && id.startsWith('question')) {
                            questionIds.push(id.replace('question', ''));
                        } else {
                            Logger.log("发现无效问题ID，已跳过");
                        }
                    });

                    questionIds = [...new Set(questionIds)];
                    Logger.log(`共检测到 ${questionIds.length} 道题目`);

                    let pageId = '';
                    let found = false;
                    pageItems.each((_, item) => {
                        if (found) return;
                        const pageName = $(item).find('.page-name');
                        if (pageName.length > 0 && pageName[0].className.includes('active')) {
                            const idAttr = $(item).attr('id');
                            pageId = idAttr.slice(idAttr.search(/\d/g));
                            found = true;
                        }
                    });

                    if (!found) {
                        AppState.answerInProgress = false;
                        PageNavigator.goNext();
                        return;
                    }

                    if (questionIds.length === 0) {
                        Logger.log("未发现有效题目，跳转至下一页");
                        AppState.answerInProgress = false;
                        PageNavigator.goNext();
                        return;
                    }

                    const answerService = new AnswerService();
                    const total = questionIds.length;
                    let processed = 0;

                    const processNext = (index) => {
                        if (index >= total) {
                            Logger.log(`所有 ${total} 道题目处理完毕`);
                            setTimeout(() => {
                                if (AppConfig.autoPlay) {
                                    $('textarea, .blank-input').trigger('change');
                                    const submitBtn = $('.btn-submit');
                                    if (submitBtn.length > 0) {
                                        submitBtn.click();
                                        Logger.log("已提交答案");
                                    }

                                    const videos = $('video').filter((_, v) => v.src !== "");
                                    if (videos.length === 0) {
                                        AppState.answerInProgress = false;
                                        PageNavigator.goNext();
                                        return;
                                    }
                                }
                                AppState.answerInProgress = false;
                            }, 1000);
                            return;
                        }

                        const qId = questionIds[index];
                        Logger.log(`处理第 ${index + 1}/${total} 题 (ID: ${qId})`);
                        this.fetchAnswer(qId, pageId, answerService, () => {
                            processed++;
                            Logger.log(`第 ${index + 1} 题处理完成 (${processed}/${total})`);
                            processNext(index + 1);
                        });
                    };

                    processNext(0);
                }
            }, 500);

            setTimeout(() => {
                clearInterval(waitForQuestions);
                if (questionIds.length === 0) {
                    Logger.log("超时未检测到题目，跳转至下一页");
                    AppState.answerInProgress = false;
                    PageNavigator.goNext();
                }
            }, 5000);
        },

        fetchAnswer: function (questionId, parentId, answerService, callback) {
            if (AppState.isPaused || AppState.isRestarting) {
                callback();
                return;
            }

            const auth = this.getAuthorization();
            if (!auth) {
                Logger.log("获取认证信息失败，无法请求答案");
                callback();
                return;
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: `https://ua.dgut.edu.cn/uaapi/questionAnswer/${questionId}?parentId=${parentId}`,
                headers: {
                    "UA-AUTHORIZATION": auth,
                    "X-Requested-With": "XMLHttpRequest",
                    "Referer": window.location.href
                },
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        const answers = data.correctAnswerList || data.answer || [];
                        Logger.log(`题目 ${questionId} 答案: ${answers}`);

                        if (answers.length > 0) {
                            answerService.processQuestion(questionId, answers);
                        } else {
                            Logger.log(`题目 ${questionId} 未找到答案`);
                        }
                    } catch (err) {
                        Logger.log(`解析答案失败: ${err.message}`);
                        console.error("答案解析错误:", err);
                    } finally {
                        callback();
                    }
                },
                onerror: (err) => {
                    Logger.log(`请求答案失败: ${err.message}`);
                    console.error("答案请求错误:", err);
                    callback();
                }
            });
        },

        getAuthorization: function () {
            return document.cookie.split(";")
                .map(c => c.trim().split("="))
                .find(([k]) => k === "AUTHORIZATION")?.[1] || "";
        }
    };

    // 应用重启器
    const AppRestarter = {
        restart: function () {
            if (AppState.isRestarting) return;

            AppState.isRestarting = true;
            Logger.log("检测到异常，尝试重启服务...");

            const toggleBtn = document.getElementById('toggleScript');
            if (!AppState.isPaused) {
                toggleBtn.click();
            }

            setTimeout(() => {
                Logger.log("重启中，恢复服务...");
                toggleBtn.click();

                setTimeout(() => {
                    AppState.isRestarting = false;
                    Logger.log("服务重启完成");
                }, 1000);
            }, 2000);
        }
    };

    // UI组件
    class UIController {
        constructor() {
            this.panel = null;
        }

        render() {
            this.loadStyles();
            this.createPanel();
            this.bindEvents();
            AppConfig.load();
            this.syncConfigToUI();
        }

        loadStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .ulearn-panel {position:fixed;top:100px;right:30px;z-index:999999;background:rgba(0,0,0,0.7);color:#fff;padding:10px 12px;border-radius:8px;font-size:14px;width:320px;cursor:move}
                .ulearn-panel:hover {opacity:0.95}
                .drag-handle {cursor:move;padding:5px;text-align:center;background:rgba(255,255,255,0.1);border-radius:4px;margin-bottom:8px}
                .panel-title {text-align:center;margin:5px 0;font-weight:bold}
                .control-btn {margin:4px;padding:3px 8px;cursor:pointer;border:none;border-radius:3px;background:rgba(255,255,255,0.2);color:white}
                .control-btn:hover {background:rgba(255,255,255,0.3)}
                .log-container {height:150px;overflow:auto;background:#111;padding:4px;border-radius:4px;font-size:12px;line-height:1.5;margin-top:8px}
                .setting-group {padding-left:15px;margin:5px 0}
                .setting-item {position:relative;list-style:none;margin:5px 0}
                .setting-input {position:absolute;right:5px}
                .section-title {font-weight:bold;margin-top:10px;margin-bottom:5px;padding-bottom:3px;border-bottom:1px solid rgba(255,255,255,0.2)}
                .pause-state {background:rgba(231, 76, 60, 0.5)!important;margin-top:5px;}
                .resume-state {background:rgba(46, 204, 113, 0.5)!important;margin-top:5px;}
            `;
            document.head.appendChild(style);
        }

        createPanel() {
            const panel = document.createElement('div');
            panel.className = 'ulearn-panel';
            panel.innerHTML = `
                <div class="drag-handle">拖动调整位置</div>
                <div class="panel-title">DGUT 优学院助手</div>

                <button id="toggleScript" class="control-btn pause-state" style="width:100%;">⏸️ 暂停脚本</button>

                <div class="section-title">视频控制</div>
                <div>播放倍速: <span id="rateDisplay">${AppConfig.playbackRate}</span>x（1-15x）</div>
                <button id="speedUp" class="control-btn">➕ 加速</button>
                <button id="speedDown" class="control-btn">➖ 减速</button>

                <div class="section-title">视频设置</div>
                <p style="color:#ff9999;font-size:12px;">提示：播放失败时将自动重启</p>
                <ul class="setting-group">
                    <li class="setting-item">自动播放/翻页?<input class="setting-input" id="autoPlay" type="checkbox" checked></li>
                    <li class="setting-item">自动静音?<input class="setting-input" id="autoMute" type="checkbox" checked></li>
                    <li class="setting-item">自动调整速率?<input class="setting-input" id="autoAdjustRate" type="checkbox" checked></li>
                    <li class="setting-item">播放速率<input class="setting-input" id="rateInput" type="number" value="${AppConfig.playbackRate}" step="1" min="1" max="15"></li>
                </ul>

                <div class="section-title">自动作答</div>
                <ul class="setting-group">
                    <li class="setting-item">自动作答(总开关)?<input class="setting-input" id="autoFillAnswers" type="checkbox" checked></li>
                    <li class="setting-item">显示答案?<input class="setting-input" id="showAnswers" type="checkbox" checked></li>
                    <li class="setting-item">自动答选择题?<input class="setting-input" id="autoAnswerSingle" type="checkbox" checked></li>
                    <li class="setting-item">自动答判断题?<input class="setting-input" id="autoAnswerJudge" type="checkbox" checked></li>
                    <li class="setting-item">自动答填空题?<input class="setting-input" id="autoAnswerBlank" type="checkbox" checked></li>
                </ul>

                <button id="saveSettings" class="control-btn" style="width:100%;margin-top:10px;">保存设置</button>

                <div style="margin-top:8px;">操作日志:</div>
                <div id="logContainer" class="log-container"></div>
            `;
            document.body.appendChild(panel);
            this.panel = panel;
            Logger.init(document.getElementById('logContainer'));
        }

        bindEvents() {
            // 拖动功能
            this.panel.onmousedown = (e) => {
                const offsetX = e.clientX - this.panel.offsetLeft;
                const offsetY = e.clientY - this.panel.offsetTop;

                const moveHandler = (e) => {
                    this.panel.style.left = `${e.clientX - offsetX}px`;
                    this.panel.style.top = `${e.clientY - offsetY}px`;
                    this.panel.style.right = 'auto';
                };

                document.addEventListener('mousemove', moveHandler);
                document.addEventListener('mouseup', () => {
                    document.removeEventListener('mousemove', moveHandler);
                }, { once: true });
            };

            // 速率控制
            document.getElementById('speedUp').addEventListener('click', () => {
                if (AppState.isRestarting) return;
                AppConfig.playbackRate = Math.min(15, AppConfig.playbackRate + 1);
                this.updateRateDisplay();
            });

            document.getElementById('speedDown').addEventListener('click', () => {
                if (AppState.isRestarting) return;
                AppConfig.playbackRate = Math.max(1, AppConfig.playbackRate - 1);
                this.updateRateDisplay();
            });

            // 速率输入框
            const rateInput = document.getElementById('rateInput');
            rateInput.addEventListener('change', () => {
                if (AppState.isRestarting) return;
                let val = parseFloat(rateInput.value);
                val = Math.max(1, Math.min(15, val));
                rateInput.value = val;
                AppConfig.playbackRate = val;
                this.updateRateDisplay();
            });

            // 暂停/继续按钮
            const toggleBtn = document.getElementById('toggleScript');
            toggleBtn.addEventListener('click', () => {
                if (AppState.isRestarting) {
                    Logger.log("重启中，暂不支持操作");
                    return;
                }

                AppState.isPaused = !AppState.isPaused;
                if (AppState.isPaused) {
                    toggleBtn.innerText = '▶️ 继续运行';
                    toggleBtn.className = 'control-btn resume-state';
                    Logger.log("脚本已暂停");
                } else {
                    toggleBtn.innerText = '⏸️ 暂停脚本';
                    toggleBtn.className = 'control-btn pause-state';
                    Logger.log("脚本已恢复运行");
                    videoController.processVideos();
                    videoController.checkModals();
                }
            });

            // 自动播放开关联动
            const autoPlayToggle = document.getElementById('autoPlay');
            autoPlayToggle.addEventListener('change', () => {
                if (AppState.isRestarting) return;
                const autoMute = document.getElementById('autoMute');
                const autoAdjust = document.getElementById('autoAdjustRate');
                if (!autoPlayToggle.checked) {
                    autoMute.checked = false;
                    autoAdjust.checked = false;
                } else {
                    autoMute.checked = true;
                    autoAdjust.checked = true;
                }
            });

            // 自动作答总开关联动
            const autoAnswerToggle = document.getElementById('autoFillAnswers');
            autoAnswerToggle.addEventListener('change', () => {
                if (AppState.isRestarting) return;
                const showAns = document.getElementById('showAnswers');
                const single = document.getElementById('autoAnswerSingle');
                const judge = document.getElementById('autoAnswerJudge');
                const blank = document.getElementById('autoAnswerBlank');

                if (!autoAnswerToggle.checked) {
                    showAns.checked = false;
                    single.checked = false;
                    judge.checked = false;
                    blank.checked = false;
                } else {
                    showAns.checked = true;
                    single.checked = true;
                    judge.checked = true;
                    blank.checked = true;
                }
            });

            // 保存设置
            document.getElementById('saveSettings').addEventListener('click', () => {
                if (AppState.isRestarting) {
                    Logger.log("重启中，暂不支持保存");
                    return;
                }

                AppConfig.autoPlay = document.getElementById('autoPlay').checked;
                AppConfig.autoMute = document.getElementById('autoMute').checked;
                AppConfig.autoAdjustRate = document.getElementById('autoAdjustRate').checked;
                AppConfig.autoFillAnswers = document.getElementById('autoFillAnswers').checked;
                AppConfig.showAnswers = document.getElementById('showAnswers').checked;
                AppConfig.autoAnswerSingle = document.getElementById('autoAnswerSingle').checked;
                AppConfig.autoAnswerJudge = document.getElementById('autoAnswerJudge').checked;
                AppConfig.autoAnswerBlank = document.getElementById('autoAnswerBlank').checked;
                AppConfig.playbackRate = parseFloat(document.getElementById('rateInput').value);

                AppConfig.save();
                localStorage.setItem(AppConfig.getStorageKey('paused'), AppState.isPaused);
                localStorage.setItem(AppConfig.getStorageKey('retryCount'), AppState.nextPageRetry);

                this.updateRateDisplay();
                Logger.log("设置已保存");

                if (!AppState.isPaused) {
                    videoController.processVideos();
                    videoController.checkModals(true);
                }
            });
        }

        syncConfigToUI() {
            document.getElementById('autoPlay').checked = AppConfig.autoPlay;
            document.getElementById('autoMute').checked = AppConfig.autoMute;
            document.getElementById('autoAdjustRate').checked = AppConfig.autoAdjustRate;
            document.getElementById('autoFillAnswers').checked = AppConfig.autoFillAnswers;
            document.getElementById('showAnswers').checked = AppConfig.showAnswers;
            document.getElementById('autoAnswerSingle').checked = AppConfig.autoAnswerSingle;
            document.getElementById('autoAnswerJudge').checked = AppConfig.autoAnswerJudge;
            document.getElementById('autoAnswerBlank').checked = AppConfig.autoAnswerBlank;
            document.getElementById('rateInput').value = AppConfig.playbackRate;

            AppState.isPaused = localStorage.getItem(AppConfig.getStorageKey('paused')) === 'true';
            AppState.nextPageRetry = parseInt(localStorage.getItem(AppConfig.getStorageKey('retryCount')) || '0');

            const toggleBtn = document.getElementById('toggleScript');
            if (AppState.isPaused) {
                toggleBtn.innerText = '▶️ 继续运行';
                toggleBtn.className = 'control-btn resume-state';
            } else {
                toggleBtn.innerText = '⏸️ 暂停脚本';
                toggleBtn.className = 'control-btn pause-state';
            }
        }

        updateRateDisplay() {
            const display = document.getElementById('rateDisplay');
            const input = document.getElementById('rateInput');
            display.innerText = AppConfig.playbackRate;
            input.value = AppConfig.playbackRate;

            const video = document.querySelector("video, mediaelementwrapper video:first-child");
            if (video) video.playbackRate = AppConfig.playbackRate;

            Logger.log(`播放速率已调整为 ${AppConfig.playbackRate}x`);
        }
    }

    // 防检测处理
    function setupAntiDetection() {
        // 模拟用户代理
        unsafeWindow.navigator.__defineGetter__("userAgent", () =>
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36"
        );

        // 模拟鼠标活动
        setInterval(() => {
            if (!AppState.isPaused && !AppState.isRestarting) {
                unsafeWindow.document.dispatchEvent(new Event('mousemove'));
            }
        }, 1000);
    }

    // 初始化应用
    const uiController = new UIController();
    const videoController = new VideoController();

    function initApp() {
        uiController.render();
        videoController.init();
        setupAntiDetection();

        if (!AppState.isPaused && !AppState.isRestarting) {
            videoController.processVideos();
            videoController.checkModals();
        }
    }

    setTimeout(initApp, 3000);
})();