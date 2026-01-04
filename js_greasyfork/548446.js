// ==UserScript==
// @name         云学堂自动答题助手
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.0
// @description  云学堂考试自动答题脚本，支持题目复制和JSON答案导入自动填充
// @match        https://asiainfo.yunxuetang.cn/exam/test*
// @icon         https://picobd.yunxuetang.cn/sys/asiainfo/others/202305/efc8749aa9474334a99be88b3c1131e5.ico
// @author       Assistant
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548446/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/548446/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*
 * 云学堂自动答题助手使用说明：
 * 
 * 1. 进入考试页面：https://asiainfo.yunxuetang.cn/exam/test
 * 2. 点击"复制题目"按钮获取所有题目
 * 3. 将题目发送给AI获取JSON格式答案
 * 4. 将JSON答案粘贴到输入框中
 * 5. 点击"开始答题"按钮自动填充答案
 * 
 * 功能特性：
 * - 智能题目识别和提取
 * - JSON答案导入和自动填充
 * - 反检测机制（随机延时、模拟人工操作）
 * - 可视化控制面板
 * - 答题进度显示
 */

(function () {
    'use strict';

    // 配置选项
    const CONFIG = {
        DEBUG: true // 调试模式
    };

    // 豆包窗口引用，用于后续聚焦/前置
    let doubaoWin = null;

    // 全局状态
    let isRunning = false;
    let currentQuestionIndex = 0;
    let totalQuestions = 0;
    let answeredQuestions = 0;

    // 添加样式
    // @ts-ignore
    GM_addStyle(`
        #auto-answer-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: #fff;
            border: 2px solid #007bff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
        }
        #auto-answer-panel .panel-header {
            background: #007bff;
            color: white;
            padding: 12px;
            font-weight: bold;
            border-radius: 6px 6px 0 0;
            cursor: move;
        }
        #auto-answer-panel .panel-body {
            padding: 15px;
        }
        #auto-answer-panel .config-item {
            margin-bottom: 10px;
        }
        #auto-answer-panel label {
            display: block;
            margin-bottom: 5px;
            font-size: 12px;
            color: #666;
        }
        #auto-answer-panel .config-item label {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 13px;
            color: #333;
        }
        #auto-answer-panel input, #auto-answer-panel select {
            width: 100%;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
        }
        #auto-answer-panel input[type="checkbox"] {
            width: auto;
            margin-right: 8px;
            transform: scale(1.2);
        }
        #auto-answer-panel button {
            width: 100%;
            padding: 10px 8px;
            margin: 5px 0;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            min-height: 36px;
            line-height: 1.2;
            box-sizing: border-box;
        }
        #auto-answer-panel .btn-primary {
            background: #007bff;
            color: white;
        }
        #auto-answer-panel .btn-danger {
            background: #dc3545;
            color: white;
        }
        #auto-answer-panel .btn-secondary {
            background: #6c757d;
            color: white;
        }
        #auto-answer-panel .progress {
            background: #f0f0f0;
            border-radius: 4px;
            height: 20px;
            margin: 10px 0;
            overflow: hidden;
        }
        #auto-answer-panel .progress-bar {
            background: #28a745;
            height: 100%;
            transition: width 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            margin-top: 0;
        }
        #auto-answer-panel .status {
            font-size: 11px;
            color: #666;
            margin: 5px 0;
        }
        #auto-answer-panel .log {
            max-height: 100px;
            overflow-y: auto;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 8px;
            font-size: 11px;
            margin-top: 10px;
        }
        
        /* 豆包AI助手弹窗样式 - 手机端小窗口 */
        #doubao-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            height: 600px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 20000;
            display: none;
            overflow: hidden;
            resize: both;
            min-width: 350px;
            min-height: 500px;
            max-width: 90vw;
            max-height: 90vh;
        }
        
        #doubao-modal.show {
            display: block;
        }
        
        #doubao-container {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        
        #doubao-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            font-size: 14px;
            flex-shrink: 0;
            cursor: move;
        }
        
        #doubao-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
        }
        
        #doubao-close:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        #doubao-iframe {
            width: 100%;
            height: 100%;
            border: none;
            flex: 1;
        }
        
        /* 调整大小手柄 */
        #doubao-modal::-webkit-resizer {
            background: #007bff;
            border-radius: 0 0 12px 0;
        }
    `);

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'auto-answer-panel';
        panel.innerHTML = `
            <div class="panel-header">
                🤖 自动答题助手
                <span style="float: right; cursor: pointer;" onclick="this.parentElement.parentElement.style.display='none'">×</span>
            </div>
            <div class="panel-body">
                <div class="config-item">
                    <label>答案JSON数据:</label>
                    <textarea id="json-answers" placeholder="粘贴JSON格式的答案数据" rows="8" style="width:100%;resize:vertical;font-size:11px;"></textarea>
                </div>
                <div class="config-item">
                    <label>答题延时 (秒):</label>
                    <input type="number" id="delay-time" value="0.5" min="0.1" max="10" step="0.1">
                </div>
                <button class="btn-primary" id="start-btn">开始答题</button>
                <button class="btn-danger" id="stop-btn" style="display:none;">停止答题</button>
                <button class="btn-secondary" id="analyze-btn">分析题目</button>
                <button class="btn-secondary" id="copy-questions-btn">复制题目</button>
                <button class="btn-secondary" id="doubao-btn">豆包AI助手</button>
                <button class="btn-secondary" id="submit-btn">提交答案</button>
                
                <div class="config-item">
                    <label>
                        <input type="checkbox" id="auto-submit-switch" style="width: auto; margin-right: 5px;" checked>
                        答题完成后自动提交
                    </label>
                </div>
                
                <div class="progress">
                    <div class="progress-bar" id="progress-bar" style="width: 0%;">0/0</div>
                </div>
                
                <div class="status" id="status">就绪</div>
                <div class="log" id="log"></div>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        const analyzeBtn = document.getElementById('analyze-btn');
        const copyQuestionsBtn = document.getElementById('copy-questions-btn');
        const doubaoBtn = document.getElementById('doubao-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (startBtn) startBtn.onclick = startAutoAnswer;
        if (stopBtn) stopBtn.onclick = stopAutoAnswer;
        if (analyzeBtn) analyzeBtn.onclick = analyzeQuestions;
        if (copyQuestionsBtn) copyQuestionsBtn.onclick = copyAllQuestions;
        if (doubaoBtn) doubaoBtn.onclick = openDoubaoModal;
        if (submitBtn) submitBtn.onclick = submitExam;

        // 使面板可拖拽
        makeDraggable(panel);
    }

    // 保证存在豆包控制工具条（用于一键前置与快捷键）
    function ensureDoubaoToolbar() {
        if (document.getElementById('doubao-toolbar')) return;
        const bar = document.createElement('div');
        bar.id = 'doubao-toolbar';
        bar.style.cssText = `
            position: fixed; right: 16px; bottom: 16px; z-index: 2147483647;
            background: rgba(0,0,0,0.75); color: #fff; padding: 8px 10px; border-radius: 8px;
            display: flex; gap: 8px; align-items: center; box-shadow: 0 6px 18px rgba(0,0,0,0.3);
            backdrop-filter: saturate(150%) blur(6px); font-size: 12px;
        `;
        bar.innerHTML = `
            <span style="opacity:.85">豆包</span>
            <button id="focus-doubao-btn" style="background:#28a745;border:none;color:#fff;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:bold;">前置豆包 ⌘/Ctrl+Shift+D</button>
            <button id="hide-doubao-toolbar" style="background:#6c757d;border:none;color:#fff;padding:6px 8px;border-radius:6px;cursor:pointer;">隐藏</button>
        `;
        document.body.appendChild(bar);

        const focusBtn = document.getElementById('focus-doubao-btn');
        if (focusBtn) {
            focusBtn.onclick = function () {
                focusDoubaoWindow(true);
            };
        }

        const hideBtn = document.getElementById('hide-doubao-toolbar');
        if (hideBtn) {
            hideBtn.onclick = function () {
                bar.remove();
            };
        }

        // 快捷键：Cmd/Ctrl + Shift + D
        document.addEventListener('keydown', function (e) {
            const isCmd = e.metaKey || e.ctrlKey;
            if (isCmd && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
                focusDoubaoWindow(true);
            }
        });
    }

    // 前置/聚焦豆包窗口，如不存在则重开
    function focusDoubaoWindow(allowReopen = false) {
        try {
            if (doubaoWin && !doubaoWin.closed) {
                try { doubaoWin.blur(); } catch (_) { }
                try { window.focus(); } catch (_) { }
                try { doubaoWin.focus(); } catch (_) { }
                log('已尝试前置豆包窗口', 'success');
                return true;
            }
        } catch (_) { }

        if (allowReopen) {
            openDoubaoModal();
            return true;
        }
        return false;
    }

    // 使面板可拖拽
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('.panel-header');

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 打开豆包AI助手（因目标站点的 CSP 限制，优先以独立小窗打开）
    function openDoubaoModal() {
        try {
            const width = 420;
            const height = 740;
            const left = Math.max(0, (window.screen.width - width) / 2);
            const top = Math.max(0, (window.screen.height - height) / 2);
            const features = `popup=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},left=${left},top=${top}`;

            const win = window.open('https://www.doubao.com/chat/search', 'doubao_ai_assistant', features);
            if (win) {
                doubaoWin = win;
                // 尝试通过焦点切换把小窗带到前面
                try { win.blur(); } catch (_) { }
                try { window.focus(); } catch (_) { }
                try { win.focus(); } catch (_) { }
                log('已在独立小窗中打开豆包AI助手（避免iframe被CSP拦截）', 'success');
                ensureDoubaoToolbar();
                return;
            }
        } catch (_) {
            // 忽略，进入回退逻辑
        }

        // 回退：弹出内嵌提示（无法内嵌豆包，提供按钮新窗口打开）
        let modal = document.getElementById('doubao-modal');
        if (modal) {
            modal.classList.add('show');
            return;
        }

        modal = document.createElement('div');
        modal.id = 'doubao-modal';
        modal.innerHTML = `
            <div id="doubao-container">
                <div id="doubao-header">
                    <span>🤖 豆包AI助手</span>
                    <button id="doubao-close">×</button>
                </div>
                <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:16px;text-align:center;font-size:13px;color:#333;">
                    <div>
                        <div style="margin-bottom:12px;">目标站点已设置安全策略（CSP），禁止被嵌入到 iframe。</div>
                        <button id="open-doubao-newwin" style="background:#007bff;color:#fff;border:none;border-radius:6px;padding:10px 14px;cursor:pointer;font-weight:bold;">在新窗口打开豆包</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = document.getElementById('doubao-close');
        if (closeBtn) {
            closeBtn.onclick = closeDoubaoModal;
        }

        const openBtn = document.getElementById('open-doubao-newwin');
        if (openBtn) {
            openBtn.onclick = () => {
                const width = 420;
                const height = 740;
                const left = Math.max(0, (window.screen.width - width) / 2);
                const top = Math.max(0, (window.screen.height - height) / 2);
                const features = `popup=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},left=${left},top=${top}`;
                window.open('https://www.doubao.com/chat/search', 'doubao_ai_assistant', features);
            };
        }

        makeDoubaoDraggable(modal);

        const escapeHandler = function (e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeDoubaoModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        log('已显示回退提示（CSP 限制无法内嵌），提供新窗口打开按钮', 'warning');
        ensureDoubaoToolbar();
    }

    // 关闭豆包AI助手弹窗
    function closeDoubaoModal() {
        const modal = document.getElementById('doubao-modal');
        if (modal) {
            modal.classList.remove('show');
            // 延迟移除DOM元素，让动画完成
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    }

    // 使豆包弹窗可拖拽
    function makeDoubaoDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('#doubao-header');

        if (!header) return;

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // 计算新位置
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            // 边界检查，防止拖拽到屏幕外
            const maxTop = window.innerHeight - element.offsetHeight;
            const maxLeft = window.innerWidth - element.offsetWidth;

            newTop = Math.max(0, Math.min(newTop, maxTop));
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.transform = "none"; // 移除居中定位
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }



    // 日志输出
    function log(message, type = 'info') {
        const logElement = document.getElementById('log');
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;

        if (logElement) {
            logElement.innerHTML += `<div style="color: ${type === 'error' ? 'red' : type === 'success' ? 'green' : 'black'}">${logEntry}</div>`;
            logElement.scrollTop = logElement.scrollHeight;
        }

        if (CONFIG.DEBUG) {
            console.log(`[自动答题] ${logEntry}`);
        }
    }

    // 更新状态
    function updateStatus(status) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    // 更新进度
    function updateProgress() {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar && totalQuestions > 0) {
            const percentage = (answeredQuestions / totalQuestions) * 100;
            progressBar.style.width = percentage + '%';
            progressBar.textContent = `${answeredQuestions}/${totalQuestions}`;
        }
    }

    // 分析题目
    function analyzeQuestions() {
        const questions = extractQuestions();
        log(`发现 ${questions.length} 道题目`);

        questions.forEach((q, index) => {
            log(`题目 ${index + 1}: ${q.question.substring(0, 50)}...`);
        });

        totalQuestions = questions.length;
        updateProgress();
    }

    // 提交考试
    function submitExam() {
        try {
            log('开始提交考试...', 'info');
            updateStatus('正在提交考试');

            // 查找提交按钮
            const submitButton = document.getElementById('btnSubmit');
            if (!submitButton) {
                log('未找到提交按钮', 'error');
                return;
            }

            // 点击提交按钮
            submitButton.click();
            log('已点击提交按钮', 'success');

            // 等待确认弹窗出现并自动点击确认
            setTimeout(() => {
                const confirmButton = document.getElementById('btnMyConfirm');
                if (confirmButton) {
                    confirmButton.click();
                    log('已确认提交', 'success');
                    updateStatus('考试已提交');
                } else {
                    log('未找到确认按钮，请手动确认提交', 'error');
                }
            }, 1000); // 等待1秒让弹窗出现

        } catch (error) {
            log(`提交考试失败: ${error.message}`, 'error');
            updateStatus('提交失败');
        }
    }

    // 复制所有题目
    function copyAllQuestions() {
        try {
            const questions = extractQuestions();
            if (questions.length === 0) {
                log('未找到题目，请确保页面已加载完成', 'error');
                return;
            }

            // 获取考试标题
            const examTitleElement = document.getElementById('lblExamName');
            const examTitle = examTitleElement && examTitleElement.textContent ? examTitleElement.textContent.trim() : '云学堂考试';

            let formattedText = `=== ${examTitle} ===\n\n`;

            questions.forEach((q, index) => {
                // 题目类型标识
                let typeLabel = '';
                switch (q.type) {
                    case 'single': typeLabel = '[单选题]'; break;
                    case 'multiple': typeLabel = '[多选题]'; break;
                    case 'judge': typeLabel = '[判断题]'; break;
                    default: typeLabel = '[题目]';
                }

                formattedText += `${index + 1}. ${typeLabel} ${q.question}\n`;

                // 添加选项
                q.options.forEach((option, optIndex) => {
                    if (option.text && option.text.trim()) {
                        formattedText += `   ${option.label}. ${option.text}\n`;
                    }
                });

                formattedText += '\n';
            });

            formattedText += '\n=== 使用说明 ===\n';
            formattedText += '请将以上题目发送给AI，要求AI按照以下JSON格式返回答案：\n\n';
            formattedText += '```json\n';
            formattedText += '{\n';
            formattedText += '  "单选题": [\n';
            formattedText += '    {"题号": 1, "答案": "A"},\n';
            formattedText += '    {"题号": 2, "答案": "B"}\n';
            formattedText += '  ],\n';
            formattedText += '  "多选题": [\n';
            formattedText += '    {"题号": 3, "答案": "AB"},\n';
            formattedText += '    {"题号": 4, "答案": "ACD"}\n';
            formattedText += '  ],\n';
            formattedText += '  "判断题": [\n';
            formattedText += '    {"题号": 5, "答案": "正确"},\n';
            formattedText += '    {"题号": 6, "答案": "错误"}\n';
            formattedText += '  ]\n';
            formattedText += '}\n';
            formattedText += '```\n\n';
            // 复制到剪贴板
            navigator.clipboard.writeText(formattedText).then(() => {
                log(`已复制 ${questions.length} 道题目到剪贴板`, 'success');
                updateStatus(`题目已复制到剪贴板，共 ${questions.length} 道题`);
            }).catch(err => {
                // 如果现代API失败，尝试传统方法
                const textArea = document.createElement('textarea');
                textArea.value = formattedText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                log(`已复制 ${questions.length} 道题目到剪贴板（兼容模式）`, 'success');
                updateStatus(`题目已复制到剪贴板，共 ${questions.length} 道题`);
            });

        } catch (error) {
            log(`复制题目失败: ${error.message}`, 'error');
            updateStatus('复制题目失败');
        }
    }

    // 提取题目
    function extractQuestions() {
        const questions = [];
        const questionElements = document.querySelectorAll('li[name="li_Question"]');

        questionElements.forEach((element, index) => {
            try {
                // 提取题目文本 - 根据不同题型结构提取
                const questionTextElement = element.querySelector('.col-18.font-size-16');
                let questionText = '';

                if (questionTextElement) {
                    // 克隆元素以避免修改原DOM
                    const clonedElement = questionTextElement.cloneNode(true);

                    // 移除转码相关的元素
                    if (clonedElement instanceof Element) {
                        const transcodingElements = clonedElement.querySelectorAll('.ote_vedio_wrapfail, .ote-file-status-txt, .hide, .upper-latin-list');
                        transcodingElements.forEach(el => el.remove());

                        // 获取纯文本并清理
                        questionText = clonedElement.textContent || '';
                    }
                    questionText = questionText.replace(/转码中，请稍候|转码失败/g, '').trim();
                }

                // 判断题目类型
                const radioElements = element.querySelectorAll('input[type="radio"]');
                const checkboxElements = element.querySelectorAll('input[type="checkbox"]');
                const optionElements = element.querySelectorAll('.upper-latin-list li');

                let questionType = 'single'; // 默认单选题
                let inputElements = radioElements;

                if (checkboxElements.length > 0) {
                    questionType = 'multiple';
                    inputElements = checkboxElements;
                } else if (optionElements.length === 0 || (radioElements.length === 0 && checkboxElements.length === 0)) {
                    // 没有选项或没有输入元素，判定为判断题
                    questionType = 'judge';
                } else if (radioElements.length === 2) {
                    // 检查是否为判断题（通常只有两个选项：正确/错误）
                    const optionTexts = Array.from(optionElements).map(el =>
                        el && el.textContent ? el.textContent.trim() : ''
                    );
                    if (optionTexts.some(text => text.includes('正确') || text.includes('错误') || text.includes('对') || text.includes('错'))) {
                        questionType = 'judge';
                    }
                }

                // 提取选项
                const options = [];

                if (questionType === 'judge' && optionElements.length === 0) {
                    // 判断题没有选项，创建虚拟的正确/错误选项
                    options.push(
                        {
                            label: 'A',
                            text: '正确',
                            value: 'true',
                            element: null
                        },
                        {
                            label: 'B',
                            text: '错误',
                            value: 'false',
                            element: null
                        }
                    );
                } else {
                    optionElements.forEach((optionElement, optionIndex) => {
                        const optionText = optionElement && optionElement.textContent ? optionElement.textContent.trim() : '';
                        const inputElement = inputElements[optionIndex];
                        const optionValue = (inputElement && 'value' in inputElement) ? inputElement.value : '';

                        options.push({
                            label: String.fromCharCode(65 + optionIndex), // A, B, C, D
                            text: optionText,
                            value: optionValue,
                            element: inputElement
                        });
                    });
                }

                questions.push({
                    index: index + 1,
                    question: questionText,
                    options: options,
                    type: questionType,
                    element: element,
                    answered: false
                });
            } catch (error) {
                log(`提取题目 ${index + 1} 时出错: ${error.message}`, 'error');
            }
        });

        return questions;
    }



    // 解析JSON答案数据
    function parseJsonAnswers() {
        const jsonAnswersInput = document.getElementById('json-answers');
        if (!jsonAnswersInput) return null;

        try {
            const jsonText = jsonAnswersInput && 'value' in jsonAnswersInput ? String(jsonAnswersInput.value).trim() : '';
            if (!jsonText) return null;

            const answersData = JSON.parse(jsonText);
            const allAnswers = [];

            // 处理单选题
            if (answersData.单选题) {
                answersData.单选题.forEach(item => {
                    allAnswers.push({
                        questionNumber: item.题号,
                        answer: item.答案,
                        type: 'single'
                    });
                });
            }

            // 处理多选题
            if (answersData.多选题) {
                answersData.多选题.forEach(item => {
                    allAnswers.push({
                        questionNumber: item.题号,
                        answer: item.答案,
                        type: 'multiple'
                    });
                });
            }

            // 处理判断题
            if (answersData.判断题) {
                answersData.判断题.forEach(item => {
                    allAnswers.push({
                        questionNumber: item.题号,
                        answer: item.答案,
                        type: 'judge'
                    });
                });
            }

            return allAnswers;
        } catch (error) {
            log(`解析JSON答案失败: ${error.message}`, 'error');
            return null;
        }
    }

    // 选择答案
    function selectAnswer(question, answer) {
        if (question.type === 'multiple') {
            // 多选题：选择多个答案
            let selectedCount = 0;
            const answerString = typeof answer === 'string' ? answer : answer.toString();

            // 将答案字符串转换为字符数组 (如"ABCD" -> ["A", "B", "C", "D"])
            const answerLetters = Array.isArray(answer) ? answer : answerString.split('');

            answerLetters.forEach(answerLetter => {
                const option = question.options.find(opt => opt.label === answerLetter);
                if (option && option.element) {
                    option.element.click();
                    const event = new Event('change', { bubbles: true });
                    option.element.dispatchEvent(event);
                    selectedCount++;
                }
            });
            return selectedCount > 0;
        } else if (question.type === 'judge') {
            // 判断题：根据答案文本选择
            const answerText = typeof answer === 'string' ? answer : answer.toString();
            const targetText = answerText === '正确' || answerText === '对' ? '正确' : '错误';

            // 查找页面上实际的判断题选项元素
            const radioElements = question.element.querySelectorAll('input[type="radio"]');
            const optionElements = question.element.querySelectorAll('.upper-latin-list li');

            if (radioElements.length >= 2) {
                // 有实际的单选按钮，尝试匹配选项文本
                let targetIndex = -1;

                // 先通过选项文本匹配
                for (let i = 0; i < optionElements.length; i++) {
                    const optText = optionElements[i].textContent.toLowerCase();
                    if (targetText === '正确') {
                        if (optText.includes('正确') || optText.includes('对') || optText.includes('true') || optText.includes('是')) {
                            targetIndex = i;
                            break;
                        }
                    } else {
                        if (optText.includes('错误') || optText.includes('错') || optText.includes('false') || optText.includes('否')) {
                            targetIndex = i;
                            break;
                        }
                    }
                }

                // 如果文本匹配失败，使用标签匹配（A=正确，B=错误）
                if (targetIndex === -1) {
                    if (answerText === 'A' || (targetText === '正确' && radioElements.length >= 1)) {
                        targetIndex = 0;
                    } else if (answerText === 'B' || (targetText === '错误' && radioElements.length >= 2)) {
                        targetIndex = 1;
                    }
                }

                // 点击对应的单选按钮
                if (targetIndex >= 0 && targetIndex < radioElements.length) {
                    radioElements[targetIndex].click();
                    const event = new Event('change', { bubbles: true });
                    radioElements[targetIndex].dispatchEvent(event);
                    return true;
                }
            }

            return false;
        } else {
            // 单选题：选择单个答案
            const answerLetter = typeof answer === 'string' ? answer : answer.toString();
            const option = question.options.find(opt => opt.label === answerLetter);
            if (option && option.element) {
                option.element.click();
                const event = new Event('change', { bubbles: true });
                option.element.dispatchEvent(event);
                return true;
            }
        }
        return false;
    }

    // 随机延时
    function randomDelay() {
        const delayInput = document.getElementById('delay-time');
        const delayValue = delayInput && 'value' in delayInput ? parseFloat(String(delayInput.value)) : 0.5;
        const delay = delayValue * 1000;
        const randomOffset = Math.random() * 500; // 随机偏移
        return new Promise(resolve => setTimeout(resolve, delay + randomOffset));
    }

    // 开始自动答题
    async function startAutoAnswer() {
        if (isRunning) return;

        // 配置已保存
        isRunning = true;
        currentQuestionIndex = 0;
        answeredQuestions = 0;

        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'block';

        updateStatus('正在答题...');
        log('开始自动答题');

        const questions = extractQuestions();
        totalQuestions = questions.length;

        if (totalQuestions === 0) {
            log('未找到题目', 'error');
            stopAutoAnswer();
            return;
        }

        // 使用JSON答案模式
        const answerMode = 'json';

        if (answerMode === 'json') {
            // JSON答案模式
            const jsonAnswers = parseJsonAnswers();
            if (!jsonAnswers) {
                log('JSON答案数据无效或为空', 'error');
                stopAutoAnswer();
                return;
            }

            log(`共发现 ${totalQuestions} 道题目，使用JSON答案模式`);

            for (let i = 0; i < questions.length && isRunning; i++) {
                const question = questions[i];
                currentQuestionIndex = i + 1;

                try {
                    updateStatus(`正在处理第 ${currentQuestionIndex} 题...`);
                    log(`正在处理第 ${currentQuestionIndex} 题: ${question.question.substring(0, 30)}...`);

                    // 根据题号查找答案
                    const answerData = jsonAnswers.find(ans => ans.questionNumber === question.index);

                    if (answerData) {
                        const answer = answerData.answer;
                        log(`第 ${currentQuestionIndex} 题答案: ${Array.isArray(answer) ? answer.join(',') : answer}`);

                        // 选择答案
                        if (selectAnswer(question, answer)) {
                            log(`第 ${currentQuestionIndex} 题已选择答案`, 'success');
                            answeredQuestions++;
                            question.answered = true;
                        } else {
                            log(`第 ${currentQuestionIndex} 题选择答案失败`, 'error');
                        }
                    } else {
                        log(`第 ${currentQuestionIndex} 题未找到对应答案`, 'error');
                    }

                    updateProgress();

                    // 随机延时
                    if (i < questions.length - 1) {
                        await randomDelay();
                    }

                } catch (error) {
                    log(`第 ${currentQuestionIndex} 题处理失败: ${error.message}`, 'error');
                }
            }
        }

        if (isRunning) {
            updateStatus(`答题完成！已回答 ${answeredQuestions}/${totalQuestions} 题`);
            log(`自动答题完成！已回答 ${answeredQuestions}/${totalQuestions} 题`, 'success');

            // 检查是否需要自动提交
            const autoSubmitSwitch = document.getElementById('auto-submit-switch');
            if (autoSubmitSwitch && 'checked' in autoSubmitSwitch && autoSubmitSwitch.checked) {
                log('自动提交开关已开启，准备自动提交...', 'info');
                setTimeout(() => {
                    submitExam();
                }, 2000); // 等待2秒后自动提交
            } else {
                log('自动提交开关未开启，请手动提交', 'info');
            }
        }

        stopAutoAnswer();
    }

    // 停止自动答题
    function stopAutoAnswer() {
        isRunning = false;

        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        if (startBtn) startBtn.style.display = 'block';
        if (stopBtn) stopBtn.style.display = 'none';

        if (answeredQuestions === 0) {
            updateStatus('已停止');
        }

        log('自动答题已停止');
    }

    // 页面加载完成后初始化
    function init() {
        // 等待页面完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 检查是否在考试页面
        if (!window.location.href.includes('/exam/test')) {
            return;
        }

        // 等待题目加载
        setTimeout(() => {
            const questions = document.querySelectorAll('li[name="li_Question"]');
            if (questions.length > 0) {
                createControlPanel();
                log('自动答题助手已加载');
            } else {
                log('未检测到题目，请刷新页面重试', 'error');
            }
        }, 2000);
    }

    // 启动脚本
    init();

})();