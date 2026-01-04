// ==UserScript==
// @name         HDU英语自测自动答题助手
// @namespace    https://github.com/KimmyXYC/hdu_memorize_words
// @version      1.0.0
// @description  HDU英语自测自动答题，支持本地题库和AI辅助答题
// @author       Kimmy
// @license    	 MIT
// @match        https://skl.hdu.edu.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551830/HDU%E8%8B%B1%E8%AF%AD%E8%87%AA%E6%B5%8B%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/551830/HDU%E8%8B%B1%E8%AF%AD%E8%87%AA%E6%B5%8B%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置区 ====================
    const CONFIG = {
        // 答题配置
        autoClick: true, // 是否自动点击答案
        clickDelay: 1000, // 点击延迟（毫秒）
        waitNextQuestion: 1000, // 等待下一题加载时间（毫秒）
    };

    // AI配置从本地存储读取
    function getAIConfig() {
        return {
            enabled: GM_getValue('ai_enabled', false),
            base_url: GM_getValue('ai_base_url', ''),
            token: GM_getValue('ai_token', ''),
            model: GM_getValue('ai_model', 'gpt-3.5-turbo'),
            temperature: GM_getValue('ai_temperature', 0.2),
            timeout: GM_getValue('ai_timeout', 15000),
            retries: GM_getValue('ai_retries', 3)
        };
    }

    // 保存AI配置到本地存储
    function saveAIConfig(config) {
        GM_setValue('ai_enabled', config.enabled);
        GM_setValue('ai_base_url', config.base_url);
        GM_setValue('ai_token', config.token);
        GM_setValue('ai_model', config.model);
        GM_setValue('ai_temperature', config.temperature);
        GM_setValue('ai_timeout', config.timeout);
        GM_setValue('ai_retries', config.retries);
        console.log('[HDU助手] AI配置已保存');
    }

    // ==================== 题库（可以从questions.json复制） ====================
    let questionBank = GM_getValue('questionBank', {});

    // 示例题库格式（实际使用时请替换为完整题库）
    // questionBank = {
    //     "abandon": "放弃 | 抛弃",
    //     "ability": "能力",
    //     ...
    // };

    // ==================== 工具函数 ====================

    // 规范化文本（用于匹配）
    function normalizeText(text) {
        return text.replace(/\s+/g, '').trim();
    }

    // 保存题库到本地存储
    function saveQuestionBank() {
        GM_setValue('questionBank', questionBank);
        console.log('[HDU助手] 题库已保存到本地存储');
    }

    // 添加或更新题目到题库
    function updateQuestionBank(question, answer) {
        if (!question || !answer) return;

        const existing = questionBank[question];
        if (!existing) {
            questionBank[question] = answer;
            console.log(`[HDU助手] 新增题目: ${question} -> ${answer}`);
        } else {
            // 处理一词多义：使用 | 分隔
            const meanings = existing.split(/\s*[|｜]\s*/).map(s => s.trim());
            const answerNorm = normalizeText(answer);
            const exists = meanings.some(m => normalizeText(m) === answerNorm);

            if (!exists) {
                meanings.push(answer);
                questionBank[question] = meanings.join(' | ');
                console.log(`[HDU助手] 追加含义: ${question} -> ${questionBank[question]}`);
            }
        }
        saveQuestionBank();
    }

    // 从页面提取题目和选项
    function extractQuestion() {
        try {
            // 提取题目
            const questionContainer = document.querySelector('.van-col--17');
            if (!questionContainer) return null;

            const spans = questionContainer.querySelectorAll('span');
            if (spans.length < 2) return null;

            const questionText = spans[1].textContent.trim();
            const question = questionText.slice(0, -2); // 去除末尾标点

            // 提取选项
            const optionElements = document.querySelectorAll('.van-cell__title');
            if (optionElements.length < 4) return null;

            const options = Array.from(optionElements).slice(0, 4).map(el => {
                const text = el.textContent.trim();
                return text.substring(3).replace(/\s./g, ''); // 去除序号和多余字符
            });

            return { question, options };
        } catch (e) {
            console.error('[HDU助手] 提取题目失败:', e);
            return null;
        }
    }

    // 在题库中查找答案
    function findAnswerInBank(question, options) {
        const expected = questionBank[question];
        if (!expected) return -1;

        // 处理一词多义：按顺序匹配
        const meanings = expected.split(/\s*[|｜]\s*/).map(s => s.trim());
        const meaningNorms = meanings.map(m => normalizeText(m));

        // 按含义顺序优先匹配
        for (const meaningNorm of meaningNorms) {
            for (let i = 0; i < options.length; i++) {
                if (normalizeText(options[i]) === meaningNorm) {
                    return i;
                }
            }
        }

        return -1;
    }

    // AI辅助答题
    async function aiChooseAnswer(question, options) {
        const CONFIG = getAIConfig();

        if (!CONFIG.enabled) {
            console.log('[HDU助手] AI未启用');
            return -1;
        }

        if (!CONFIG.base_url || !CONFIG.model) {
            console.warn('[HDU助手] AI配置不完整');
            return -1;
        }

        const userContent = `请根据题目选择最合适的选项，只输出A/B/C/D其中一个字母。
题目：${question}
选项：
A. ${options[0]}
B. ${options[1]}
C. ${options[2]}
D. ${options[3]}
注意：只输出A、B、C或D，不要输出其他任何内容。`;

        const payload = {
            model: CONFIG.model,
            messages: [
                { role: "system", content: "你是英语单词选择题助手。根据题干与四个选项选择正确答案。" },
                { role: "user", content: userContent }
            ],
            temperature: CONFIG.temperature,
            max_tokens: 5
        };

        const totalAttempts = 1 + CONFIG.retries;

        for (let attempt = 1; attempt <= totalAttempts; attempt++) {
            try {
                console.log(`[HDU助手] AI判定中... (第${attempt}/${totalAttempts}次)`);

                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: `${CONFIG.base_url.replace(/\/$/, '')}/chat/completions`,
                        headers: {
                            "Content-Type": "application/json",
                            ...(CONFIG.token && { "Authorization": `Bearer ${CONFIG.token}` })
                        },
                        data: JSON.stringify(payload),
                        timeout: CONFIG.timeout,
                        onload: resolve,
                        onerror: reject,
                        ontimeout: reject
                    });
                });

                if (response.status !== 200) {
                    console.warn(`[HDU助手] AI请求失败 HTTP ${response.status}: ${response.responseText.substring(0, 200)}`);
                    if (attempt < totalAttempts) {
                        await new Promise(r => setTimeout(r, 500));
                        continue;
                    }
                    return -1;
                }

                const data = JSON.parse(response.responseText);
                const content = data.choices[0].message.content.trim().toUpperCase();

                // 解析AI返回的答案
                let answerIndex = -1;
                const letterMatch = content.match(/([ABCD])/);
                if (letterMatch) {
                    const letter = letterMatch[1];
                    answerIndex = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }[letter];
                }

                if (answerIndex === -1) {
                    const numberMatch = content.match(/\b([1-4])\b/);
                    if (numberMatch) {
                        answerIndex = parseInt(numberMatch[1]) - 1;
                    }
                }

                if (answerIndex === -1) {
                    for (let i = 0; i < options.length; i++) {
                        if (content.includes(options[i])) {
                            answerIndex = i;
                            break;
                        }
                    }
                }

                if (answerIndex >= 0 && answerIndex <= 3) {
                    const answerLetter = String.fromCharCode(65 + answerIndex);
                    console.log(`[HDU助手] AI判定答案: ${answerLetter} (${options[answerIndex]})`);
                    return answerIndex;
                } else {
                    console.warn(`[HDU助手] AI返回无法解析: ${content}`);
                    if (attempt < totalAttempts) {
                        await new Promise(r => setTimeout(r, 500));
                    }
                }
            } catch (e) {
                console.error(`[HDU助手] AI请求异常 (第${attempt}/${totalAttempts}次):`, e);
                if (attempt < totalAttempts) {
                    await new Promise(r => setTimeout(r, 500));
                }
            }
        }

        return -1;
    }

    // 点击答案
    function clickAnswer(index) {
        try {
            const options = document.querySelectorAll('.van-cell__title');
            if (options.length < 4) {
                console.error('[HDU助手] 未找到足够的选项元素');
                return false;
            }

            const answerLetter = String.fromCharCode(65 + index);
            console.log(`[HDU助手] 点击答案: ${answerLetter}`);

            options[index].click();
            return true;
        } catch (e) {
            console.error('[HDU助手] 点击答案失败:', e);
            return false;
        }
    }

    // 记录错误题目
    function logError(question, options) {
        const errorLog = GM_getValue('errorLog', []);
        errorLog.push({
            question,
            options,
            timestamp: new Date().toISOString()
        });
        GM_setValue('errorLog', errorLog);
        console.warn(`[HDU助手] 未知题目已记录: ${question}`);
    }

    // ==================== 主流程 ====================

    let isProcessing = false;
    let questionCount = 0;

    async function processQuestion() {
        if (isProcessing) return;
        isProcessing = true;

        try {
            // 提取题目
            const questionData = extractQuestion();
            if (!questionData) {
                console.log('[HDU助手] 未检测到题目');
                isProcessing = false;
                return;
            }

            const { question, options } = questionData;
            questionCount++;

            console.log(`\n[HDU助手] ===== 第 ${questionCount} 题 =====`);
            console.log(`题目: ${question}`);
            console.log(`选项: A.${options[0]} B.${options[1]} C.${options[2]} D.${options[3]}`);

            // 先在题库中查找
            let answerIndex = findAnswerInBank(question, options);

            if (answerIndex !== -1) {
                const answerLetter = String.fromCharCode(65 + answerIndex);
                console.log(`[HDU助手] 题库匹配: ${answerLetter} (${options[answerIndex]})`);
            } else {
                // 题库未匹配，尝试AI
                console.log('[HDU助手] 题库未匹配，尝试AI辅助...');
                answerIndex = await aiChooseAnswer(question, options);

                if (answerIndex !== -1) {
                    // AI判定成功，保存到题库
                    updateQuestionBank(question, options[answerIndex]);
                } else {
                    console.warn('[HDU助手] AI也无法判定，记录错误');
                    logError(question, options);
                }
            }

            // 自动点击答案
            if (answerIndex !== -1 && CONFIG.autoClick) {
                await new Promise(r => setTimeout(r, CONFIG.clickDelay));
                clickAnswer(answerIndex);

                // 等待下一题加载
                await new Promise(r => setTimeout(r, CONFIG.waitNextQuestion));
            }

        } catch (e) {
            console.error('[HDU助手] 处理题目时发生错误:', e);
        } finally {
            isProcessing = false;
        }
    }

    // ==================== 监听页面变化 ====================

    function startMonitoring() {
        console.log('[HDU助手] 自动答题助手已启动');
        console.log('[HDU助手] 当前题库数量:', Object.keys(questionBank).length);

        // 监听DOM变化
        const observer = new MutationObserver(() => {
            // 检测是否在答题页面（包含 /english/detail/ 或 /english/exam）
            if (window.location.hash.includes('/english/detail/') ||
                window.location.hash.includes('/english/exam')) {
                processQuestion();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始检测
        if (window.location.hash.includes('/english/detail/') ||
            window.location.hash.includes('/english/exam')) {
            setTimeout(processQuestion, 1000);
        }
    }

    // ==================== UI控制面板 ====================

    function createControlPanel() {
        // 获取当前AI配置
        const aiConfig = getAIConfig();

        const panel = document.createElement('div');
        panel.id = 'hdu-assistant-panel';
        panel.innerHTML = `
            <div id="hdu-panel-container" style="position: fixed; top: 10px; right: 10px; z-index: 10000; 
                        background: rgba(255,255,255,0.95); border: 2px solid #1989fa;
                        border-radius: 8px; padding: 0; box-shadow: 0 2px 12px rgba(0,0,0,0.2);
                        font-family: Arial, sans-serif; min-width: 200px; max-width: 350px;
                        max-height: 90vh; overflow: hidden; cursor: move;">
                <div id="hdu-panel-header" style="padding: 15px; padding-bottom: 10px; background: #1989fa; color: white; 
                                                   border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; 
                                                   align-items: center; cursor: move; user-select: none;">
                    <div style="font-weight: bold; font-size: 14px;">
                        📚 HDU答题助手
                    </div>
                    <button id="toggle-panel" style="background: rgba(255,255,255,0.2); border: none; 
                                                     color: white; width: 24px; height: 24px; border-radius: 4px; 
                                                     cursor: pointer; font-size: 16px; line-height: 1; padding: 0;">
                        −
                    </button>
                </div>
                <div id="hdu-panel-content" style="padding: 15px; overflow-y: auto; max-height: calc(90vh - 60px);">
                    <div style="font-size: 12px; margin-bottom: 8px;">
                        题库数量: <span id="bank-count">${Object.keys(questionBank).length}</span>
                    </div>
                    <div style="font-size: 12px; margin-bottom: 8px;">
                        已答题数: <span id="question-count">0</span>
                    </div>
                    <div style="font-size: 12px; margin-bottom: 8px;">
                        AI状态: <span id="ai-status" style="color: ${aiConfig.enabled ? 'green' : 'red'}">
                            ${aiConfig.enabled ? '✓ 已启用' : '✗ 未启用'}
                        </span>
                    </div>
                    <button id="toggle-auto" style="width: 100%; padding: 8px; margin-top: 8px; 
                                                     background: #1989fa; color: white; border: none; 
                                                     border-radius: 4px; cursor: pointer; font-size: 12px;">
                        ${CONFIG.autoClick ? '暂停自动答题' : '开始自动答题'}
                    </button>
                    <button id="export-bank" style="width: 100%; padding: 8px; margin-top: 5px; 
                                                    background: #07c160; color: white; border: none; 
                                                    border-radius: 4px; cursor: pointer; font-size: 12px;">
                        导出题库
                    </button>
                    <button id="import-bank" style="width: 100%; padding: 8px; margin-top: 5px; 
                                                    background: #ff976a; color: white; border: none; 
                                                    border-radius: 4px; cursor: pointer; font-size: 12px;">
                        导入题库
                    </button>
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
                        <div style="font-weight: bold; margin-bottom: 8px; color: #333;">AI配置</div>
                        <div>
                            <label style="display: block; margin-top: 5px;">
                                <input type="checkbox" id="ai-enabled" ${aiConfig.enabled ? 'checked' : ''}>
                                启用AI辅助
                            </label>
                        </div>
                        <div>
                            <label style="display: block; margin-top: 5px; font-size: 11px;">
                                API地址：
                                <input type="text" id="ai-base-url" style="width: 100%; padding: 4px; margin-top: 2px; font-size: 11px;" 
                                       placeholder="https://api.openai.com/v1"
                                       value="${aiConfig.base_url}">
                            </label>
                        </div>
                        <div>
                            <label style="display: block; margin-top: 5px; font-size: 11px;">
                                API密钥：
                                <input type="password" id="ai-token" style="width: 100%; padding: 4px; margin-top: 2px; font-size: 11px;" 
                                       placeholder="sk-..."
                                       value="${aiConfig.token}">
                            </label>
                        </div>
                        <div>
                            <label style="display: block; margin-top: 5px; font-size: 11px;">
                                模型名称：
                                <input type="text" id="ai-model" style="width: 100%; padding: 4px; margin-top: 2px; font-size: 11px;" 
                                       placeholder="gpt-3.5-turbo"
                                       value="${aiConfig.model}">
                            </label>
                        </div>
                        <div>
                            <label style="display: block; margin-top: 5px; font-size: 11px;">
                                温度 (0-1)：
                                <input type="number" id="ai-temperature" style="width: 100%; padding: 4px; margin-top: 2px; font-size: 11px;" 
                                       value="${aiConfig.temperature}" step="0.1" min="0" max="1">
                            </label>
                        </div>
                        <div>
                            <label style="display: block; margin-top: 5px; font-size: 11px;">
                                超时（毫秒）：
                                <input type="number" id="ai-timeout" style="width: 100%; padding: 4px; margin-top: 2px; font-size: 11px;" 
                                       value="${aiConfig.timeout}" min="1000" step="1000">
                            </label>
                        </div>
                        <div>
                            <label style="display: block; margin-top: 5px; font-size: 11px;">
                                重试次数：
                                <input type="number" id="ai-retries" style="width: 100%; padding: 4px; margin-top: 2px; font-size: 11px;" 
                                       value="${aiConfig.retries}" min="0" max="10">
                            </label>
                        </div>
                        <button id="save-ai-config" style="width: 100%; padding: 8px; margin-top: 8px; 
                                                        background: #1989fa; color: white; border: none; 
                                                        border-radius: 4px; cursor: pointer; font-size: 12px;">
                            💾 保存AI配置
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // ==================== 拖拽功能 ====================
        const container = document.getElementById('hdu-panel-container');
        const header = document.getElementById('hdu-panel-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // 从localStorage恢复位置
        const savedPosition = GM_getValue('panel_position', null);
        if (savedPosition) {
            container.style.left = savedPosition.left;
            container.style.top = savedPosition.top;
            container.style.right = 'auto';
            // 初始化偏移量为保存的位置
            xOffset = parseInt(savedPosition.left) || 0;
            yOffset = parseInt(savedPosition.top) || 0;
        } else {
            // 如果没有保存的位置，使用当前位置初始化偏移量
            const rect = container.getBoundingClientRect();
            xOffset = rect.left;
            yOffset = rect.top;
        }

        function dragStart(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
                return;
            }

            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
                container.style.cursor = 'grabbing';
            }
        }

        function dragEnd(e) {
            if (isDragging) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                container.style.cursor = 'move';

                // 保存位置
                GM_setValue('panel_position', {
                    left: container.style.left,
                    top: container.style.top
                });
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();

                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }

                xOffset = currentX;
                yOffset = currentY;

                // 确保面板不会被拖出视口
                const rect = container.getBoundingClientRect();
                let newLeft = currentX;
                let newTop = currentY;

                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (newLeft + rect.width > window.innerWidth) {
                    newLeft = window.innerWidth - rect.width;
                }
                if (newTop + rect.height > window.innerHeight) {
                    newTop = window.innerHeight - rect.height;
                }

                container.style.right = 'auto';
                container.style.left = newLeft + 'px';
                container.style.top = newTop + 'px';
            }
        }

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // 触摸事件支持
        header.addEventListener('touchstart', dragStart);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', dragEnd);

        // ==================== 最小化功能 ====================
        const toggleBtn = document.getElementById('toggle-panel');
        const content = document.getElementById('hdu-panel-content');
        let isMinimized = GM_getValue('panel_minimized', false);

        function togglePanel() {
            isMinimized = !isMinimized;
            if (isMinimized) {
                content.style.display = 'none';
                toggleBtn.textContent = '+';
                container.style.cursor = 'move';
            } else {
                content.style.display = 'block';
                toggleBtn.textContent = '−';
                container.style.cursor = 'move';
            }
            GM_setValue('panel_minimized', isMinimized);
        }

        // 应用保存的最小化状态
        if (isMinimized) {
            content.style.display = 'none';
            toggleBtn.textContent = '+';
        }

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePanel();
        });

        // ==================== 原有按钮事件 ====================

        document.getElementById('toggle-auto').addEventListener('click', () => {
            CONFIG.autoClick = !CONFIG.autoClick;
            document.getElementById('toggle-auto').textContent =
                CONFIG.autoClick ? '暂停自动答题' : '开始自动答题';
            console.log(`[HDU助手] 自动答题已${CONFIG.autoClick ? '开启' : '暂停'}`);
        });

        document.getElementById('export-bank').addEventListener('click', () => {
            const dataStr = JSON.stringify(questionBank, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hdu_questions_${Date.now()}.json`;
            a.click();
            console.log('[HDU助手] 题库已导出');
        });

        document.getElementById('import-bank').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        questionBank = { ...questionBank, ...imported };
                        saveQuestionBank();
                        document.getElementById('bank-count').textContent = Object.keys(questionBank).length;
                        console.log('[HDU助手] 题库导入成功，当前题目数:', Object.keys(questionBank).length);
                        alert('题库导入成功！');
                    } catch (err) {
                        console.error('[HDU助手] 题库导入失败:', err);
                        alert('题库导入失败，请检查文件格式！');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });

        document.getElementById('save-ai-config').addEventListener('click', () => {
            const config = {
                enabled: document.getElementById('ai-enabled').checked,
                base_url: document.getElementById('ai-base-url').value.trim(),
                token: document.getElementById('ai-token').value.trim(),
                model: document.getElementById('ai-model').value.trim(),
                temperature: parseFloat(document.getElementById('ai-temperature').value),
                timeout: parseInt(document.getElementById('ai-timeout').value),
                retries: parseInt(document.getElementById('ai-retries').value)
            };

            saveAIConfig(config);

            // 更新AI状态显示
            document.getElementById('ai-status').style.color = config.enabled ? 'green' : 'red';
            document.getElementById('ai-status').textContent = config.enabled ? '✓ 已启用' : '✗ 未启用';

            alert('AI配置已保存！');
            console.log('[HDU助手] AI配置已更新:', config);
        });

        // 定时更新统计
        setInterval(() => {
            document.getElementById('question-count').textContent = questionCount;
            document.getElementById('bank-count').textContent = Object.keys(questionBank).length;
        }, 1000);
    }

    // ==================== 启动 ====================

    function init() {
        console.log('[HDU助手] 脚本初始化中...');
        createControlPanel();
        startMonitoring();
        console.log('[HDU助手] 自动答题助手已启动，请查看右上角控制面板');
    }

    // 确保在页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM已经加载完成，直接初始化
        init();
    }

    // 如果页面使用了SPA路由，监听hash变化
    window.addEventListener('hashchange', () => {
        console.log('[HDU助手] 页面路由变化:', window.location.hash);
    });

})();
