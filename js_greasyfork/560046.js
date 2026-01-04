// ==UserScript==
// @name         青书学堂 青书作业考试小助手 QQ 5327216
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  青书学堂考试/作业自动答题助手
// @author       Helper
// @match        *://*.qingshuxuetang.com/*
// @match        *://degree.qingshuxuetang.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560046/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%20%E9%9D%92%E4%B9%A6%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95%E5%B0%8F%E5%8A%A9%E6%89%8B%20QQ%205327216.user.js
// @updateURL https://update.greasyfork.org/scripts/560046/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%20%E9%9D%92%E4%B9%A6%E4%BD%9C%E4%B8%9A%E8%80%83%E8%AF%95%E5%B0%8F%E5%8A%A9%E6%89%8B%20QQ%205327216.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        autoAnswer: true,
        answerDelay: 500,
        randomDelay: true,
        maxRandomDelay: 1000,
        autoSubmit: false,
        showPanel: true,
        logEnabled: true,
    };

    // ==================== 样式 ====================
    GM_addStyle(`
        @keyframes qs-gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @keyframes qs-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        @keyframes qs-shine {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        #qs-helper-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 340px;
            background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
            background-size: 400% 400%;
            animation: qs-gradient 15s ease infinite;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset;
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif;
            color: white;
            overflow: hidden;
            backdrop-filter: blur(10px);
        }
        #qs-helper-panel .panel-header {
            padding: 18px 22px;
            background: rgba(0,0,0,0.25);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        #qs-helper-panel .panel-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        #qs-helper-panel .panel-header h3 .version {
            font-size: 10px;
            background: rgba(255,255,255,0.25);
            padding: 3px 8px;
            border-radius: 12px;
            font-weight: 500;
        }
        #qs-helper-panel .panel-header .close-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            transition: all 0.3s ease;
        }
        #qs-helper-panel .panel-header .close-btn:hover {
            background: rgba(255,255,255,0.35);
            transform: rotate(90deg);
        }
        #qs-helper-panel .panel-body {
            padding: 22px;
        }
        #qs-helper-panel .stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 18px;
        }
        #qs-helper-panel .stat-item {
            background: rgba(255,255,255,0.15);
            padding: 16px;
            border-radius: 12px;
            text-align: center;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.3s ease;
        }
        #qs-helper-panel .stat-item:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
        }
        #qs-helper-panel .stat-item .value {
            font-size: 32px;
            font-weight: 800;
            text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        #qs-helper-panel .stat-item .label {
            font-size: 12px;
            opacity: 0.85;
            margin-top: 6px;
            font-weight: 500;
        }
        #qs-helper-panel .btn-group {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
        }
        #qs-helper-panel .btn {
            flex: 1;
            padding: 14px 16px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 700;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        #qs-helper-panel .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
        }
        #qs-helper-panel .btn:hover::before {
            animation: qs-shine 0.8s ease;
        }
        #qs-helper-panel .btn-primary {
            background: linear-gradient(135deg, #00c853, #00e676);
            color: white;
            box-shadow: 0 4px 15px rgba(0, 200, 83, 0.4);
        }
        #qs-helper-panel .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 200, 83, 0.5);
        }
        #qs-helper-panel .btn-secondary {
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.2);
        }
        #qs-helper-panel .btn-secondary:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        #qs-helper-panel .log-area {
            background: rgba(0,0,0,0.35);
            border-radius: 12px;
            padding: 14px;
            max-height: 140px;
            overflow-y: auto;
            font-size: 11px;
            font-family: 'Monaco', 'Consolas', monospace;
            border: 1px solid rgba(255,255,255,0.1);
            margin-bottom: 16px;
        }
        #qs-helper-panel .log-area::-webkit-scrollbar {
            width: 6px;
        }
        #qs-helper-panel .log-area::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.1);
            border-radius: 3px;
        }
        #qs-helper-panel .log-area::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.3);
            border-radius: 3px;
        }
        #qs-helper-panel .log-area .log-item {
            padding: 4px 0;
            border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        #qs-helper-panel .log-area .log-item:last-child {
            border-bottom: none;
        }
        #qs-helper-panel .log-area .log-success { color: #69f0ae; }
        #qs-helper-panel .log-area .log-error { color: #ff5252; }
        #qs-helper-panel .log-area .log-info { color: #40c4ff; }
        #qs-helper-panel .toggle-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        #qs-helper-panel .toggle-row span {
            font-weight: 500;
        }
        #qs-helper-panel .toggle-switch {
            position: relative;
            width: 52px;
            height: 28px;
        }
        #qs-helper-panel .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        #qs-helper-panel .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255,255,255,0.25);
            transition: .4s;
            border-radius: 28px;
        }
        #qs-helper-panel .toggle-slider:before {
            position: absolute;
            content: "";
            height: 22px;
            width: 22px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #qs-helper-panel .toggle-switch input:checked + .toggle-slider {
            background: linear-gradient(135deg, #00c853, #00e676);
        }
        #qs-helper-panel .toggle-switch input:checked + .toggle-slider:before {
            transform: translateX(24px);
        }
        #qs-helper-panel .ad-banner {
            background: linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,165,0,0.3));
            border-radius: 10px;
            padding: 12px;
            margin-top: 12px;
            text-align: center;
            border: 1px dashed rgba(255,215,0,0.5);
            position: relative;
            overflow: hidden;
        }
        #qs-helper-panel .ad-banner::before {
            content: '⭐';
            position: absolute;
            top: 5px;
            left: 10px;
            font-size: 12px;
        }
        #qs-helper-panel .ad-banner::after {
            content: '⭐';
            position: absolute;
            top: 5px;
            right: 10px;
            font-size: 12px;
        }
        #qs-helper-panel .ad-banner .ad-title {
            font-size: 13px;
            font-weight: 700;
            color: #ffd700;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3);
            margin-bottom: 6px;
        }
        #qs-helper-panel .ad-banner .ad-desc {
            font-size: 11px;
            opacity: 0.9;
            line-height: 1.5;
        }
        #qs-helper-panel .ad-banner .ad-watermark {
            position: absolute;
            bottom: -5px;
            right: 5px;
            font-size: 8px;
            opacity: 0.5;
            transform: rotate(-5deg);
        }
        #qs-helper-mini {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
            background-size: 400% 400%;
            animation: qs-gradient 15s ease infinite;
            border-radius: 50%;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
            z-index: 99999;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            color: white;
            transition: all 0.3s ease;
        }
        #qs-helper-mini:hover {
            transform: scale(1.15) rotate(10deg);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
        }
    `);

    // ==================== 工具函数 ====================
    const log = (msg, type = 'info') => {
        if (!CONFIG.logEnabled) return;
        console.log(`[青书小助手] ${msg}`);
        const logArea = document.querySelector('#qs-log-area');
        if (logArea) {
            const item = document.createElement('div');
            item.className = `log-item log-${type}`;
            item.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            logArea.appendChild(item);
            logArea.scrollTop = logArea.scrollHeight;
        }
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const getRandomDelay = () => {
        if (!CONFIG.randomDelay) return CONFIG.answerDelay;
        return CONFIG.answerDelay + Math.random() * CONFIG.maxRandomDelay;
    };

    // ==================== 答案解析 ====================
    let paperData = null;
    let answeredCount = 0;
    let totalCount = 0;

    // 从URL获取quizId
    const getQuizIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        let quizId = urlParams.get('quizId');
        if (!quizId) {
            const match = window.location.href.match(/quizId[=\/]([a-f0-9]+)/i);
            if (match) quizId = match[1];
        }
        return quizId;
    };

    // 手动获取试卷数据
    const fetchPaperData = async () => {
        const quizId = getQuizIdFromUrl();
        if (!quizId) {
            log('未找到quizId，请确认在答题页面', 'error');
            return false;
        }

        log(`正在获取试卷数据...`, 'info');

        const pathMatch = window.location.pathname.match(/^\/([^\/]+)\//);
        const schoolCode = pathMatch ? pathMatch[1] : '';
        const apiUrl = `${window.location.origin}/${schoolCode}/Student/DetailData?quizId=${quizId}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                credentials: 'include',
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            const data = await response.json();
            if (data.hr === 0 && data.data && data.data.paperDetail) {
                paperData = data.data.paperDetail;
                totalCount = paperData.questionCount || paperData.questions?.length || 0;
                log(`获取成功: ${totalCount}题`, 'success');
                updateStats();
                return true;
            } else {
                log(`获取失败: ${data.message || 'unknown'}`, 'error');
                return false;
            }
        } catch (e) {
            log(`请求失败: ${e.message}`, 'error');
            return false;
        }
    };

    // 拦截XHR
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        xhr.open = function(method, url) {
            this._url = url;
            return originalOpen.apply(this, arguments);
        };

        xhr.send = function() {
            this.addEventListener('load', function() {
                if (this._url && this._url.includes('DetailData')) {
                    try {
                        const response = JSON.parse(this.responseText);
                        if (response.hr === 0 && response.data && response.data.paperDetail) {
                            paperData = response.data.paperDetail;
                            totalCount = paperData.questionCount || paperData.questions?.length || 0;
                            log(`自动获取: ${totalCount}题`, 'success');
                            updateStats();
                        }
                    } catch (e) {}
                }
            });
            return originalSend.apply(this, arguments);
        };

        return xhr;
    };

    // 拦截fetch
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        return originalFetch.apply(this, arguments).then(response => {
            const clonedResponse = response.clone();
            if (url && typeof url === 'string' && url.includes('DetailData')) {
                clonedResponse.json().then(data => {
                    if (data.hr === 0 && data.data && data.data.paperDetail) {
                        paperData = data.data.paperDetail;
                        totalCount = paperData.questionCount || paperData.questions?.length || 0;
                        log(`自动获取: ${totalCount}题`, 'success');
                        updateStats();
                    }
                }).catch(() => {});
            }
            return response;
        });
    };

    // ==================== 自动答题核心 ====================

    // 点击选项 - 增强版
    const clickOption = async (option) => {
        // 方法1: 直接点击
        option.click();
        await delay(50);

        // 方法2: 如果是li，找内部的input或label
        if (option.tagName === 'LI') {
            const input = option.querySelector('input[type="radio"], input[type="checkbox"]');
            if (input) {
                input.checked = true;
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
            const label = option.querySelector('label');
            if (label) label.click();
        }

        // 方法3: 如果是INPUT
        if (option.tagName === 'INPUT') {
            option.checked = true;
            option.dispatchEvent(new Event('change', { bubbles: true }));
            option.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // 方法4: 触发mousedown/mouseup事件
        option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        option.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        option.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

        // 方法5: 触发jQuery事件
        if (typeof jQuery !== 'undefined' || typeof $ !== 'undefined') {
            try {
                const jq = jQuery || $;
                jq(option).trigger('click').trigger('change').trigger('mousedown').trigger('mouseup');
                const input = jq(option).find('input');
                if (input.length) {
                    input.prop('checked', true).trigger('change');
                }
            } catch (e) {}
        }
    };

    // 跳转到指定题目
    const goToQuestion = async (index) => {
        // 方法1: 点击答题卡
        const sheetSelectors = [
            '.answer-sheet-item',
            '.answer-sheet li',
            '[class*="sheet"] li',
            '[class*="answer-card"] li',
            '.question-nav li',
            '.question-list li',
            '.quiz-answer-sheet li'
        ];

        for (const selector of sheetSelectors) {
            const items = document.querySelectorAll(selector);
            if (items[index]) {
                items[index].click();
                await delay(400);
                return true;
            }
        }

        // 方法2: 使用quiz对象
        if (typeof window.quiz !== 'undefined' && window.quiz.seek) {
            try {
                window.quiz.seek(index);
                await delay(400);
                return true;
            } catch (e) {}
        }

        // 方法3: jQuery触发
        if (typeof jQuery !== 'undefined' || typeof $ !== 'undefined') {
            try {
                const jq = jQuery || $;
                jq('.answer-sheet-item').eq(index).trigger('click');
                await delay(400);
                return true;
            } catch (e) {}
        }

        return false;
    };

    // 答当前显示的题目
    const answerCurrentDisplayedQuestion = async (question, index) => {
        const solution = question.solution;
        if (!solution) {
            log(`第${index + 1}题: 无答案`, 'error');
            return false;
        }

        const typeId = question.typeId;

        // 查找当前显示的选项
        const optionSelectors = [
            '.answer-area li',
            '.option-list li',
            '.options li',
            '[class*="option-item"]',
            '[class*="quiz-option"]',
            '.question-view li',
            '.question-item li'
        ];

        let options = [];
        for (const selector of optionSelectors) {
            const found = document.querySelectorAll(selector);
            if (found.length >= 2 && found.length <= 10) {
                options = found;
                break;
            }
        }

        if (options.length === 0) {
            // 尝试查找input
            const inputs = document.querySelectorAll('input[type="radio"]:not(:checked), input[type="checkbox"]');
            if (inputs.length > 0) {
                options = inputs;
            }
        }

        if (options.length === 0) {
            return false;
        }

        // 答题
        if (typeId === 1 || typeId === 6) {
            // 单选题 / 判断题
            const optionLabel = solution;
            const optIndex = optionLabel.charCodeAt(0) - 65;

            if (options[optIndex]) {
                await clickOption(options[optIndex]);
                log(`第${index + 1}题: 选择 ${optionLabel}`, 'success');
                answeredCount++;
                updateStats();
                return true;
            }
        } else if (typeId === 2) {
            // 多选题
            const solutionLabels = solution.split('');

            for (const label of solutionLabels) {
                const optIndex = label.charCodeAt(0) - 65;
                if (options[optIndex]) {
                    await clickOption(options[optIndex]);
                    await delay(150);
                }
            }
            log(`第${index + 1}题: 选择 ${solution}`, 'success');
            answeredCount++;
            updateStats();
            return true;
        }

        return false;
    };

    const startAutoAnswer = async () => {
        if (!paperData || !paperData.questions) {
            log('请先获取试卷数据', 'error');
            return;
        }

        log(`开始答题，共${paperData.questions.length}题...`, 'info');
        answeredCount = 0;

        for (let i = 0; i < paperData.questions.length; i++) {
            const question = paperData.questions[i];

            // 跳转到该题
            await goToQuestion(i);
            await delay(300);

            // 答题
            const success = await answerCurrentDisplayedQuestion(question, i);
            if (!success) {
                log(`第${i + 1}题: 跳过`, 'error');
            }

            await delay(getRandomDelay());
        }

        log(`完成! 成功: ${answeredCount}/${totalCount}`, 'success');
    };

    const showAnswers = () => {
        if (!paperData || !paperData.questions) {
            log('请先获取试卷数据', 'error');
            return;
        }

        let answerText = '=== 答案列表 ===\n';
        paperData.questions.forEach((q, i) => {
            const typeMap = {1: '单选', 2: '多选', 6: '判断'};
            answerText += `${i + 1}. [${typeMap[q.typeId] || '未知'}] ${q.solution || '无'}\n`;
        });

        console.log(answerText);
        alert(answerText);
        log('答案已显示', 'info');
    };

    // ==================== UI ====================
    const updateStats = () => {
        const totalEl = document.querySelector('#qs-stat-total');
        const answeredEl = document.querySelector('#qs-stat-answered');
        if (totalEl) totalEl.textContent = totalCount;
        if (answeredEl) answeredEl.textContent = answeredCount;
    };

    const createPanel = () => {
        const panel = document.createElement('div');
        panel.id = 'qs-helper-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>📚 青书小助手 <span class="version">v2.0</span></h3>
                <button class="close-btn" id="qs-minimize">−</button>
            </div>
            <div class="panel-body">
                <div class="stats">
                    <div class="stat-item">
                        <div class="value" id="qs-stat-total">0</div>
                        <div class="label">总题数</div>
                    </div>
                    <div class="stat-item">
                        <div class="value" id="qs-stat-answered">0</div>
                        <div class="label">已完成</div>
                    </div>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" id="qs-start-btn">🚀 一键答题</button>
                    <button class="btn btn-secondary" id="qs-show-btn">📋 查看答案</button>
                </div>
                <div class="btn-group">
                    <button class="btn btn-secondary" id="qs-fetch-btn">🔄 获取数据</button>
                </div>
                <div class="log-area" id="qs-log-area">
                    <div class="log-item log-info">[${new Date().toLocaleTimeString()}] 助手已就绪</div>
                </div>
                <div class="toggle-row">
                    <span>⚡ 自动提交</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="qs-auto-submit" ${CONFIG.autoSubmit ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="ad-banner">
                    <div class="ad-title">🔥 专业定制化批量云挂机软件</div>
                    <div class="ad-desc">支持多平台 · 稳定高效 · 7×24小时运行<br>联系定制专属解决方案</div>
                    <div class="ad-desc">QQ：5327216</div>
                    <div class="ad-watermark">© 青书小助手</div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 迷你按钮
        const mini = document.createElement('div');
        mini.id = 'qs-helper-mini';
        mini.innerHTML = '📚';
        mini.style.display = 'none';
        document.body.appendChild(mini);

        // 事件绑定
        document.getElementById('qs-minimize').addEventListener('click', () => {
            panel.style.display = 'none';
            mini.style.display = 'flex';
        });

        mini.addEventListener('click', () => {
            panel.style.display = 'block';
            mini.style.display = 'none';
        });

        document.getElementById('qs-start-btn').addEventListener('click', startAutoAnswer);
        document.getElementById('qs-show-btn').addEventListener('click', showAnswers);
        document.getElementById('qs-fetch-btn').addEventListener('click', fetchPaperData);

        document.getElementById('qs-auto-submit').addEventListener('change', (e) => {
            CONFIG.autoSubmit = e.target.checked;
            log(`自动提交: ${CONFIG.autoSubmit ? '开启' : '关闭'}`, 'info');
        });

        // 拖拽功能
        let isDragging = false;
        let offsetX, offsetY;
        const header = panel.querySelector('.panel-header');

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = (e.clientX - offsetX) + 'px';
                panel.style.top = (e.clientY - offsetY) + 'px';
                panel.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    };

    // ==================== 初始化 ====================
    const init = () => {
        const isQuizPage = window.location.href.includes('ExercisePaper') ||
                          window.location.href.includes('Quiz') ||
                          window.location.href.includes('Exam') ||
                          document.querySelector('.quiz-container, .paper-container');

        if (isQuizPage || CONFIG.showPanel) {
            createPanel();
            log('初始化完成', 'success');
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
