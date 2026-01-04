// ==UserScript==
// @name         华医网自动化考试助手 (V1.4 功能增强版)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  修复跳转URL；UI增强：显示当前课程和待考队列名，可独立清空队列；全自动识别、排队、考试、重试、切换。
// @author       Gemini
// @match        *://*.91huayi.com/pages/course.aspx*
// @match        *://*.91huayi.com/pages/exam.aspx*
// @match        *://*.91huayi.com/pages/exam_result.aspx*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561218/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8C%96%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%20%28V14%20%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561218/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8C%96%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%20%28V14%20%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const BASE_ANSWER_DELAY_MS = 500;
    const BASE_SUBMIT_DELAY_MS = 2000;
    const BASE_RETRY_DELAY_MS = 3000;
    const SCRIPT_STATE_KEY = 'exam_script_state_v4';
    const COURSE_LIST_URL_FRAGMENT = '/pages/course.aspx';

    // --- 辅助函数 ---
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const getRandomDelay = (base, range = 1500) => base + Math.random() * range;

    // --- 数据存储模块 (使用JSON序列化) ---
    const db = {
        load: (key, defaultValue) => {
            const value = GM_getValue(key);
            return value === undefined ? defaultValue : JSON.parse(value);
        },
        save: (key, data) => GM_setValue(key, JSON.stringify(data)),
        clear: (key) => GM_deleteValue(key)
    };

    const correctAnswersDB = { key: 'correct_answers_db_v4', get: () => db.load(correctAnswersDB.key, {}), set: (data) => db.save(correctAnswersDB.key, data) };
    const wrongAttemptsDB = { key: 'wrong_attempts_db_v4', get: () => db.load(wrongAttemptsDB.key, {}), set: (data) => db.save(wrongAttemptsDB.key, data), clear: () => db.clear(wrongAttemptsDB.key) };
    const examQueueDB = { key: 'exam_queue_db_v4', get: () => db.load(examQueueDB.key, []), set: (data) => db.save(examQueueDB.key, data), clear: () => db.clear(examQueueDB.key) };
    const returnUrlDB = { key: 'return_url_db_v4', get: () => db.load(returnUrlDB.key, null), set: (data) => db.save(returnUrlDB.key, data), clear: () => db.clear(returnUrlDB.key) };

    // --- 核心逻辑 ---

    function normalizeQuestion(text) { return text.trim().replace(/^\d+、\s*/, ''); }
    function normalizeOption(text) { return text.trim().replace(/^[A-Z]、\s*/, ''); }

    function handleCourseListPage() {
        console.log("脚本：进入课程列表页面。");
        const allCourses = document.querySelectorAll('.course');
        if (allCourses.length === 0) return;

        const pendingExams = [];
        allCourses.forEach(courseEl => {
            const statusSpan = courseEl.querySelector('h3 > span');
            const link = courseEl.querySelector('h3 > a.f14blue');
            if (link && statusSpan && !statusSpan.innerText.includes('已完成')) {
                const courseName = link.innerText.trim();
                const href = link.getAttribute('href');
                const cwidMatch = href.match(/cwid=([a-f0-9-]+)/);
                if (cwidMatch && cwidMatch[1]) {
                    // **升级**: 存储对象而非字符串
                    pendingExams.push({ cwid: cwidMatch[1], name: courseName });
                    console.log(`[待考队列+] 添加课程: ${courseName}`);
                }
            }
        });

        if (pendingExams.length > 0) {
            console.log(`脚本：发现 ${pendingExams.length} 个待考课程。已创建考试队列。`);
            examQueueDB.set(pendingExams);
            returnUrlDB.set(window.location.href);
            updatePanel();
            processNextInQueue();
        } else {
            console.log("脚本：所有课程均已完成，无需操作。");
           
            setScriptState(false);
            updatePanel();
        }
    }

    async function handleExamPage() {
        console.log("脚本：进入考试页面。开始模拟作答...");
        const correctAnswers = correctAnswersDB.get();
        const wrongAttempts = wrongAttemptsDB.get();
        const questions = document.querySelectorAll('.tablestyle');

        for (const questionEl of Array.from(questions)) {
            const questionText = normalizeQuestion(questionEl.querySelector('.q_name').innerText);
            const options = questionEl.querySelectorAll('tbody tr');
            let isAnswered = false;

            if (correctAnswers[questionText]) {
                const correctAnswerText = correctAnswers[questionText];
                for (const optionEl of options) {
                    if (normalizeOption(optionEl.querySelector('label').innerText) === correctAnswerText) {
                        optionEl.querySelector('input.qo_name').click(); isAnswered = true; break;
                    }
                }
            }
            if (!isAnswered) {
                const knownWrongOptions = wrongAttempts[questionText] || [];
                for (const optionEl of options) {
                    if (!knownWrongOptions.includes(normalizeOption(optionEl.querySelector('label').innerText))) {
                        optionEl.querySelector('input.qo_name').click(); isAnswered = true; break;
                    }
                }
            }
            if (!isAnswered && options.length > 0) {
                 options[0].querySelector('input.qo_name').click(); isAnswered = true;
            }
            if (!isAnswered) {
                console.error("脚本错误：有题目未能作答，流程停止。"); setScriptState(false); updatePanel(); return;
            }
            await sleep(getRandomDelay(BASE_ANSWER_DELAY_MS, 1000));
        }

        const submitDelay = getRandomDelay(BASE_SUBMIT_DELAY_MS, 2000);
        console.log(`脚本：作答完毕，将在约 ${(submitDelay / 1000).toFixed(1)} 秒后提交...`);
        await sleep(submitDelay);
        document.getElementById('btn_submit')?.click();
    }

    async function handleResultPage() {
        console.log("脚本：进入结果页面。");
        const isPassed = document.querySelector('.tips_text')?.innerText.includes('考试通过');

        if (isPassed) {
            console.log("考试通过！准备处理下一个课程...");
            const cwidMatch = window.location.href.match(/cwid=([a-f0-9-]+)/);
            if (cwidMatch) {
                const completedCwid = cwidMatch[1];
                let queue = examQueueDB.get();
                // **升级**: 按对象属性过滤
                queue = queue.filter(exam => exam.cwid !== completedCwid);
                examQueueDB.set(queue);
                console.log(`[队列-] 课程已移出。剩余 ${queue.length} 个。`);
            }
            await sleep(1000);
            processNextInQueue();
        } else {
            console.log("考试未通过。正在更新错题本并准备重试...");
            const correctAnswers = correctAnswersDB.get();
            const wrongAttempts = wrongAttemptsDB.get();
            document.querySelectorAll('.state_cour_ul .state_cour_lis').forEach(item => {
                const questionText = normalizeQuestion(item.querySelector('.state_lis_text:first-of-type').title);
                const userAnswerText = normalizeOption(item.querySelectorAll('.state_lis_text')[1].title.replace(/【您的答案：|】/g, ''));
                const isCorrect = item.querySelector('.state_error').src.includes('bar_img.png');
                if (isCorrect) {
                    if (!correctAnswers[questionText]) correctAnswers[questionText] = userAnswerText;
                    if (wrongAttempts[questionText]) delete wrongAttempts[questionText];
                } else {
                    if (!wrongAttempts[questionText]) wrongAttempts[questionText] = [];
                    if (!wrongAttempts[questionText].includes(userAnswerText)) wrongAttempts[questionText].push(userAnswerText);
                }
            });
            correctAnswersDB.set(correctAnswers);
            wrongAttemptsDB.set(wrongAttempts);
            await sleep(getRandomDelay(BASE_RETRY_DELAY_MS, 2000));
            document.querySelector('input[value="重新考试"]')?.click();
        }
    }

    function processNextInQueue() {
        const queue = examQueueDB.get();
        if (queue.length > 0) {
            const nextExam = queue[0];
            console.log(`脚本：正在导航到下一个考试，课程名: ${nextExam.name}`);
            // **修复**: 修正跳转URL
            window.location.href = `/pages/exam.aspx?cwid=${nextExam.cwid}`;
        } else {
            console.log("队列已清空！所有考试均已完成！");
            const returnUrl = returnUrlDB.get();
            examQueueDB.clear();
            returnUrlDB.clear();
            wrongAttemptsDB.clear();
            setScriptState(false);
            
            setTimeout(() => { if (returnUrl) window.location.href = returnUrl; }, 2000);
        }
    }

    // --- UI 控制面板 ---
    function setupUI() {
        if (document.getElementById('exam-helper-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'exam-helper-panel';
        document.body.appendChild(panel);
        GM_addStyle(`
            #exam-helper-panel { position: fixed; bottom: 20px; right: 20px; background-color: #f0f9ff; border: 2px solid #1e90ff; border-radius: 8px; padding: 15px; z-index: 9999; font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.15); width: 260px; font-size: 14px; }
            #exam-helper-panel h3 { margin: 0 0 12px 0; color: #1e90ff; text-align: center; font-size: 16px; }
            #exam-helper-panel button { width: 100%; padding: 8px; margin-bottom: 10px; border: none; border-radius: 5px; color: white; cursor: pointer; font-size: 14px; transition: background-color 0.2s; }
            #exam-helper-panel button:hover { opacity: 0.9; }
            #toggle-script-btn { background-color: #28a745; }
            #toggle-script-btn.running { background-color: #dc3545; }
            #clear-queue-btn { background-color: #007bff; }
            #clear-db-btn { background-color: #ffc107; }
            #exam-helper-panel p { margin: 5px 0; line-height: 1.4; }
            #exam-helper-panel strong { color: #333; }
            #script-status, #current-exam-status { font-weight: bold; }
            #queue-list-container { background-color: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 5px 10px; margin-top: 10px; max-height: 150px; overflow-y: auto; font-size: 12px; }
            #queue-list-container ol { margin: 0; padding-left: 20px; }
            #queue-list-container li { margin-bottom: 5px; color: #555; }
            #queue-list-container .empty-queue { color: #888; text-align: center; font-style: italic; }
        `);
        updatePanel();
    }

    function updatePanel() {
        const panel = document.getElementById('exam-helper-panel');
        if (!panel) return;
        const isRunning = getScriptState();
        const queue = examQueueDB.get();
        const currentExam = queue.length > 0 ? queue[0].name : "无";
        const remainingQueue = queue.slice(1);

        let queueHtml = '<p class="empty-queue">队列为空</p>';
        if (remainingQueue.length > 0) {
            queueHtml = '<ol>' + remainingQueue.map(exam => `<li>${exam.name}</li>`).join('') + '</ol>';
        }

        panel.innerHTML = `
            <h3>自动考试控制</h3>
            <button id="toggle-script-btn">${isRunning ? '暂停自动考试' : '开始自动考试'}</button>
            <button id="clear-queue-btn">清空队列</button>
            <button id="clear-db-btn">清除全部数据(含答案)</button>
            <p><strong>脚本状态:</strong> <span id="script-status" style="color: ${isRunning ? '#28a745' : '#dc3545'};">${isRunning ? '运行中' : '已停止'}</span></p>
            <p><strong>当前操作:</strong> <span id="current-exam-status" style="color: #007bff;">${currentExam}</span></p>
            <strong>待考列表:</strong>
            <div id="queue-list-container">${queueHtml}</div>
        `;

        if (isRunning) panel.querySelector('#toggle-script-btn').classList.add('running');

        panel.querySelector('#toggle-script-btn').addEventListener('click', toggleScript);

        panel.querySelector('#clear-queue-btn').addEventListener('click', () => {
             if (confirm('确定要清空当前的考试队列吗？这不会删除已保存的答案。')) {
                examQueueDB.clear();
                returnUrlDB.clear();
                console.log("脚本：用户清空了考试队列。");
                updatePanel();
            }
        });

        panel.querySelector('#clear-db-btn').addEventListener('click', () => {
            if (confirm('【警告】确定要清除所有本地数据吗？包括已保存的答案、错题记录和考试队列！')) {
                db.clear(correctAnswersDB.key);
                db.clear(wrongAttemptsDB.key);
                db.clear(examQueueDB.key);
                db.clear(returnUrlDB.key);
                alert('所有数据已清除！');
                console.log("脚本：用户清除了所有本地数据。");
                updatePanel();
            }
        });
    }

    function getScriptState() { return db.load(SCRIPT_STATE_KEY, false); }
    function setScriptState(isRunning) { db.save(SCRIPT_STATE_KEY, isRunning); }

    function toggleScript() {
        const currentState = getScriptState();
        setScriptState(!currentState);
        if (!currentState) main(); else console.log("脚本已由用户暂停。");
        updatePanel();
    }

    function main() {
        setupUI();
        if (!getScriptState()) {
            console.log("脚本当前为停止状态，请在课程列表页点击【开始自动考试】按钮启动。");
            return;
        }
        const urlPath = window.location.pathname;
        if (urlPath.includes(COURSE_LIST_URL_FRAGMENT)) handleCourseListPage();
        else if (urlPath.includes('/exam.aspx')) handleExamPage();
        else if (urlPath.includes('/exam_result.aspx')) handleResultPage();
    }

    main();
})();