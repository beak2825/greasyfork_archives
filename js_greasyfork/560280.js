// ==UserScript==
// @name         腾讯文档抢填神器
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  腾讯文档表单自动填写 + 自动提交 + 抢填模式
// @author       You
// @match        https://docs.qq.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560280/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E6%8A%A2%E5%A1%AB%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560280/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E6%8A%A2%E5%A1%AB%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置 ====================
    let answers = GM_getValue('answers', []);
    let refreshInterval = GM_getValue('refreshInterval', 300);
    let autoSubmit = GM_getValue('autoSubmit', true);

    // ==================== UI 创建 ====================
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'form-filler-panel';
        panel.innerHTML = `
            <style>
                #form-filler-panel {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    width: 320px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: white;
                    overflow: hidden;
                }
                #form-filler-panel .header {
                    padding: 15px;
                    background: rgba(0,0,0,0.2);
                    font-size: 16px;
                    font-weight: 600;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                }
                #form-filler-panel .content {
                    padding: 15px;
                }
                #form-filler-panel .input-group {
                    margin-bottom: 12px;
                }
                #form-filler-panel label {
                    display: block;
                    margin-bottom: 5px;
                    font-size: 12px;
                    opacity: 0.9;
                }
                #form-filler-panel textarea {
                    width: 100%;
                    height: 100px;
                    border: none;
                    border-radius: 8px;
                    padding: 10px;
                    font-size: 13px;
                    resize: vertical;
                    box-sizing: border-box;
                    background: rgba(255,255,255,0.95);
                    color: #333;
                }
                #form-filler-panel input[type="number"] {
                    width: 100%;
                    border: none;
                    border-radius: 8px;
                    padding: 10px;
                    font-size: 13px;
                    box-sizing: border-box;
                    background: rgba(255,255,255,0.95);
                    color: #333;
                }
                #form-filler-panel .checkbox-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                }
                #form-filler-panel .checkbox-group input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                }
                #form-filler-panel .checkbox-group label {
                    margin: 0;
                    cursor: pointer;
                }
                #form-filler-panel .btn-group {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                #form-filler-panel button {
                    flex: 1;
                    min-width: 80px;
                    padding: 10px 15px;
                    border: none;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                #form-filler-panel .btn-primary {
                    background: #4CAF50;
                    color: white;
                }
                #form-filler-panel .btn-primary:hover {
                    background: #45a049;
                    transform: translateY(-1px);
                }
                #form-filler-panel .btn-warning {
                    background: #ff9800;
                    color: white;
                }
                #form-filler-panel .btn-warning:hover {
                    background: #f57c00;
                }
                #form-filler-panel .btn-danger {
                    background: #f44336;
                    color: white;
                }
                #form-filler-panel .btn-danger:hover {
                    background: #d32f2f;
                }
                #form-filler-panel .btn-secondary {
                    background: rgba(255,255,255,0.2);
                    color: white;
                }
                #form-filler-panel .btn-secondary:hover {
                    background: rgba(255,255,255,0.3);
                }
                #form-filler-panel .status {
                    margin-top: 12px;
                    padding: 10px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                    font-size: 12px;
                    text-align: center;
                }
                #form-filler-panel .status.success {
                    background: rgba(76, 175, 80, 0.5);
                }
                #form-filler-panel .status.running {
                    background: rgba(255, 152, 0, 0.5);
                    animation: pulse 1.5s infinite;
                }
                #form-filler-panel .status.error {
                    background: rgba(244, 67, 54, 0.5);
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                #form-filler-panel .minimize-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
                #form-filler-panel.minimized .content {
                    display: none;
                }
            </style>
            <div class="header">
                <span>🚀 腾讯文档抢填神器 v9.0</span>
                <button class="minimize-btn" id="minimize-btn">−</button>
            </div>
            <div class="content">
                <div class="input-group">
                    <label>📝 答案 (每行一个)</label>
                    <textarea id="answers-input" placeholder="第1题答案&#10;第2题答案&#10;第3题答案&#10;..."></textarea>
                </div>
                <div class="input-group">
                    <label>⏱️ 刷新间隔 (毫秒)</label>
                    <input type="number" id="refresh-interval" value="300" min="100" max="5000">
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="auto-submit-checkbox" checked>
                    <label for="auto-submit-checkbox">🔄 自动提交</label>
                </div>
                <div class="btn-group">
                    <button class="btn-primary" id="fill-btn">📝 立即填写</button>
                    <button class="btn-warning" id="snipe-btn">🎯 抢填模式</button>
                </div>
                <div class="btn-group" style="margin-top: 8px;">
                    <button class="btn-secondary" id="submit-btn">✅ 提交表单</button>
                    <button class="btn-secondary" id="save-btn">💾 保存配置</button>
                </div>
                <div class="status" id="status-box">状态: 就绪</div>
            </div>
        `;
        document.body.appendChild(panel);
        initPanelEvents();
        loadSavedConfig();
    }

    // ==================== 事件绑定 ====================
    function initPanelEvents() {
        const panel = document.getElementById('form-filler-panel');
        const minimizeBtn = document.getElementById('minimize-btn');
        const answersInput = document.getElementById('answers-input');
        const intervalInput = document.getElementById('refresh-interval');
        const autoSubmitCheckbox = document.getElementById('auto-submit-checkbox');

        minimizeBtn.addEventListener('click', () => {
            panel.classList.toggle('minimized');
            minimizeBtn.textContent = panel.classList.contains('minimized') ? '+' : '−';
        });

        // 拖拽（同时支持鼠标和触摸）
        let isDragging = false, offsetX, offsetY;
        const header = panel.querySelector('.header');

        // 鼠标事件
        header.addEventListener('mousedown', (e) => {
            if (e.target === minimizeBtn) return;
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = (e.clientX - offsetX) + 'px';
                panel.style.right = 'auto';
                panel.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        document.addEventListener('mouseup', () => { isDragging = false; });

        // 触摸事件（手机端支持）
        header.addEventListener('touchstart', (e) => {
            if (e.target === minimizeBtn) return;
            const touch = e.touches[0];
            isDragging = true;
            offsetX = touch.clientX - panel.offsetLeft;
            offsetY = touch.clientY - panel.offsetTop;
        }, { passive: true });
        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const touch = e.touches[0];
                panel.style.left = (touch.clientX - offsetX) + 'px';
                panel.style.right = 'auto';
                panel.style.top = (touch.clientY - offsetY) + 'px';
            }
        }, { passive: true });
        document.addEventListener('touchend', () => { isDragging = false; });

        answersInput.addEventListener('input', updateAnswersFromInput);
        intervalInput.addEventListener('input', () => {
            refreshInterval = parseInt(intervalInput.value) || 300;
        });
        autoSubmitCheckbox.addEventListener('change', () => {
            autoSubmit = autoSubmitCheckbox.checked;
        });

        document.getElementById('fill-btn').addEventListener('click', () => {
            updateAnswersFromInput();
            fillForm();
        });
        document.getElementById('snipe-btn').addEventListener('click', toggleSnipeMode);
        document.getElementById('submit-btn').addEventListener('click', submitForm);
        document.getElementById('save-btn').addEventListener('click', saveConfig);
    }

    // ==================== 配置管理 ====================
    function updateAnswersFromInput() {
        const input = document.getElementById('answers-input');
        if (input) {
            answers = input.value.split('\n').filter(a => a.trim() !== '');
        }
    }

    function loadSavedConfig() {
        const savedAnswers = GM_getValue('answers', []);
        const savedInterval = GM_getValue('refreshInterval', 300);
        const savedAutoSubmit = GM_getValue('autoSubmit', true);

        if (savedAnswers.length > 0) {
            document.getElementById('answers-input').value = savedAnswers.join('\n');
            answers = savedAnswers;
        }
        document.getElementById('refresh-interval').value = savedInterval;
        refreshInterval = savedInterval;
        document.getElementById('auto-submit-checkbox').checked = savedAutoSubmit;
        autoSubmit = savedAutoSubmit;
    }

    function saveConfig() {
        updateAnswersFromInput();
        GM_setValue('answers', answers);
        GM_setValue('refreshInterval', refreshInterval);
        GM_setValue('autoSubmit', autoSubmit);
        updateStatus('✅ 配置已保存！', 'success');
    }

    function updateStatus(message, type = '') {
        const statusBox = document.getElementById('status-box');
        if (statusBox) {
            statusBox.textContent = message;
            statusBox.className = 'status ' + type;
        }
        console.log('[状态]', message);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==================== 核心：逐字符模拟输入 ====================
    async function typeText(element, text) {
        // 聚焦元素
        element.focus();
        element.click();

        // 清空现有内容
        element.select && element.select();
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);

        // 尝试直接设置值
        if ('value' in element) {
            element.value = '';
        }

        await delay(50);

        // 逐字符输入
        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            // KeyboardEvent
            const keydownEvent = new KeyboardEvent('keydown', {
                key: char,
                code: 'Key' + char.toUpperCase(),
                charCode: char.charCodeAt(0),
                keyCode: char.charCodeAt(0),
                which: char.charCodeAt(0),
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(keydownEvent);

            const keypressEvent = new KeyboardEvent('keypress', {
                key: char,
                code: 'Key' + char.toUpperCase(),
                charCode: char.charCodeAt(0),
                keyCode: char.charCodeAt(0),
                which: char.charCodeAt(0),
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(keypressEvent);

            // 使用 execCommand 插入文本（最可靠的方式）
            document.execCommand('insertText', false, char);

            // InputEvent
            const inputEvent = new InputEvent('input', {
                data: char,
                inputType: 'insertText',
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(inputEvent);

            const keyupEvent = new KeyboardEvent('keyup', {
                key: char,
                code: 'Key' + char.toUpperCase(),
                charCode: char.charCodeAt(0),
                keyCode: char.charCodeAt(0),
                which: char.charCodeAt(0),
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(keyupEvent);

            await delay(5); // 每个字符间隔5ms
        }

        // 触发 change 事件
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));

        console.log(`输入完成: "${text}"`);
    }

    // 备用方法：直接修改属性 + 强制触发React更新
    function forceSetValue(element, value) {
        // 方法1: 使用原生 setter
        const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value') ||
            Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
        if (descriptor && descriptor.set) {
            descriptor.set.call(element, value);
        } else {
            element.value = value;
        }

        // 方法2: 直接修改属性
        element.setAttribute('value', value);

        // 触发所有可能的事件
        ['focus', 'input', 'change', 'blur'].forEach(eventType => {
            element.dispatchEvent(new Event(eventType, { bubbles: true }));
        });

        // 触发 React 的合成事件
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(element, value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // ==================== 获取输入框 ====================
    function getFormInputs() {
        let inputs = [];

        // 方法1: 精确匹配 placeholder="请输入"（腾讯文档表单的标准占位符）
        document.querySelectorAll('[placeholder="请输入"]').forEach(el => {
            if (!el.closest('#form-filler-panel') && isVisible(el) && !inputs.includes(el)) {
                inputs.push(el);
            }
        });

        // 如果找到了就直接返回（这是最可靠的）
        if (inputs.length > 0) {
            inputs.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
            console.log('通过placeholder找到输入框:', inputs.length, inputs);
            return inputs;
        }

        // 方法2: 只查找表单区域内的输入框（排除顶部导航）
        document.querySelectorAll('input[type="text"], input:not([type]), textarea').forEach(el => {
            if (el.closest('#form-filler-panel')) return;
            if (!isVisible(el)) return;

            // 排除顶部区域（Y < 150px 可能是导航栏/头部）
            const rect = el.getBoundingClientRect();
            if (rect.top < 150) return;

            if (!inputs.includes(el)) {
                inputs.push(el);
            }
        });

        // 按位置排序
        inputs.sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectA.top - rectB.top;
        });

        console.log('找到输入框:', inputs);
        return inputs;
    }

    function isVisible(el) {
        if (!el) return false;
        if (el.disabled || el.readOnly) return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    // ==================== 填写表单 ====================
    async function fillForm() {
        updateStatus('🔄 正在填写...', 'running');

        const inputs = getFormInputs();
        let filledCount = 0;

        if (inputs.length === 0) {
            updateStatus('⚠️ 未找到输入框！尝试其他方法...', 'error');
            // 尝试备用方法
            filledCount = await fillFormAlternative();
            if (filledCount === 0) {
                return false;
            }
        } else {
            for (let i = 0; i < answers.length && i < inputs.length; i++) {
                try {
                    const input = inputs[i];
                    const answer = answers[i].trim();

                    console.log(`填写第 ${i + 1} 题: "${answer}" 到`, input);

                    // 点击激活
                    input.click();
                    input.focus();
                    await delay(100);

                    // 尝试多种方法
                    await typeText(input, answer);

                    // 如果没有成功，尝试备用方法
                    if (input.value !== answer) {
                        forceSetValue(input, answer);
                    }

                    filledCount++;
                    await delay(100);
                } catch (e) {
                    console.error(`填写第 ${i + 1} 题失败:`, e);
                }
            }
        }

        updateStatus(`✅ 已填写 ${filledCount}/${answers.length} 个字段`, 'success');

        if (autoSubmit && filledCount > 0) {
            await delay(500);
            await submitForm();
        }

        return filledCount > 0;
    }

    // 备用填写方法：直接操作 DOM
    async function fillFormAlternative() {
        updateStatus('🔄 使用备用方法...', 'running');
        let filledCount = 0;

        // 查找所有 "请输入" 相关的容器
        const containers = document.querySelectorAll('[class*="question"], [class*="item"], [class*="field"]');
        let questionIndex = 0;

        for (const container of containers) {
            if (questionIndex >= answers.length) break;
            if (container.closest('#form-filler-panel')) continue;

            // 在容器内查找输入元素
            const input = container.querySelector('input, textarea, [contenteditable="true"]');
            if (input && isVisible(input)) {
                try {
                    const answer = answers[questionIndex].trim();

                    input.click();
                    input.focus();
                    await delay(100);

                    // 模拟输入
                    await typeText(input, answer);

                    filledCount++;
                    questionIndex++;
                    await delay(100);
                } catch (e) {
                    console.error('备用方法填写失败:', e);
                }
            }
        }

        return filledCount;
    }

    // ==================== 提交表单 ====================
    async function submitForm() {
        updateStatus('🔄 正在提交...', 'running');

        let submitted = false;

        // 方法1: 优先查找 button 元素
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            const text = (btn.innerText || btn.textContent || '').trim();
            console.log('检查按钮:', text, btn);
            if (text.includes('提交') && !btn.disabled) {
                console.log('找到提交按钮，点击:', btn);
                btn.click();
                submitted = true;
                break;
            }
        }

        // 方法2: 如果没找到button，查找其他可点击元素
        if (!submitted) {
            const allElements = document.querySelectorAll('[role="button"], a, span, div');
            for (const el of allElements) {
                const text = (el.innerText || el.textContent || '').trim();
                if (text.includes('提交') && isVisible(el)) {
                    console.log('找到提交元素，点击:', el);
                    el.click();
                    submitted = true;
                    break;
                }
            }
        }

        if (submitted) {
            // 等待弹窗出现，多次尝试点击确认按钮
            for (let attempt = 0; attempt < 5; attempt++) {
                await delay(500);

                // 查找弹窗中的确认按钮
                const confirmTexts = ['确认', '确定', '好的', 'OK', '是'];
                let confirmed = false;

                // 优先在弹窗/对话框中查找
                const dialogs = document.querySelectorAll('[class*="dialog"], [class*="modal"], [class*="popup"], [role="dialog"]');
                for (const dialog of dialogs) {
                    const btns = dialog.querySelectorAll('button, [role="button"], span, div');
                    for (const btn of btns) {
                        const text = (btn.innerText || '').trim();
                        if (confirmTexts.includes(text) && isVisible(btn)) {
                            console.log('在弹窗中找到确认按钮:', text, btn);
                            btn.click();
                            confirmed = true;
                            break;
                        }
                    }
                    if (confirmed) break;
                }

                // 如果弹窗中没找到，全局查找
                if (!confirmed) {
                    const allBtns = document.querySelectorAll('button, [role="button"]');
                    for (const btn of allBtns) {
                        const text = (btn.innerText || '').trim();
                        // 精确匹配"确认"，避免误点击其他按钮
                        if (text === '确认' || text === '确定') {
                            console.log('找到确认按钮:', text, btn);
                            btn.click();
                            confirmed = true;
                            break;
                        }
                    }
                }

                if (confirmed) {
                    console.log('确认按钮已点击');
                    break;
                }

                console.log(`等待确认弹窗... 尝试 ${attempt + 1}/5`);
            }

            updateStatus('✅ 已提交！', 'success');
        } else {
            updateStatus('⚠️ 未找到提交按钮', 'error');
        }

        return submitted;
    }

    // ==================== 抢填模式 ====================
    function isFormReady() {
        const pageText = document.body.innerText || '';
        if (pageText.includes('未开始') || pageText.includes('已结束') || pageText.includes('已截止')) {
            return false;
        }

        // 检查提交按钮
        for (const el of document.querySelectorAll('button, [role="button"]')) {
            if ((el.innerText || '').includes('提交') && isVisible(el)) {
                return true;
            }
        }

        return getFormInputs().length > 0;
    }

    function toggleSnipeMode() {
        const snipeBtn = document.getElementById('snipe-btn');
        const wasSnipeMode = GM_getValue('isSnipeMode', false);

        if (wasSnipeMode) {
            GM_setValue('isSnipeMode', false);
            snipeBtn.textContent = '🎯 抢填模式';
            snipeBtn.classList.remove('btn-danger');
            snipeBtn.classList.add('btn-warning');
            updateStatus('已停止抢填', '');
        } else {
            updateAnswersFromInput();
            if (answers.length === 0) {
                updateStatus('⚠️ 请先输入答案！', 'error');
                return;
            }

            GM_setValue('isSnipeMode', true);
            GM_setValue('answers', answers);
            GM_setValue('refreshInterval', refreshInterval);
            GM_setValue('autoSubmit', autoSubmit);
            GM_setValue('refreshCount', 0);
            GM_setValue('startTime', Date.now());

            snipeBtn.textContent = '⏹️ 停止抢填';
            snipeBtn.classList.remove('btn-warning');
            snipeBtn.classList.add('btn-danger');

            updateStatus('🔄 抢填模式启动中...', 'running');
            setTimeout(() => location.reload(), refreshInterval);
        }
    }

    // ==================== 切换到填写页面 ====================
    async function switchToFillTab() {
        // 检测是否在非"填写"页面（如"统计"或"设置"页面）
        // 查找顶部的标签页导航
        const tabs = document.querySelectorAll('[class*="tab"], [role="tab"], nav a, nav span, [class*="nav"] a, [class*="nav"] span');

        for (const tab of tabs) {
            const text = (tab.innerText || tab.textContent || '').trim();
            // 如果找到"填写"标签，点击它
            if (text === '填写') {
                // 检查是否已经在填写页面（通常激活的tab会有特殊class）
                const isActive = tab.classList.contains('active') ||
                    tab.classList.contains('selected') ||
                    tab.getAttribute('aria-selected') === 'true' ||
                    tab.closest('[class*="active"]') ||
                    tab.querySelector('[class*="active"]');

                if (!isActive) {
                    console.log('检测到不在填写页面，点击切换到填写页...');
                    tab.click();
                    await delay(500); // 等待页面切换
                    return true; // 表示进行了切换
                }
                break;
            }
        }

        // 备用方法：通过更广泛的选择器查找
        const allClickables = document.querySelectorAll('span, div, a, button');
        for (const el of allClickables) {
            const text = (el.innerText || el.textContent || '').trim();
            if (text === '填写' && isVisible(el)) {
                // 检查附近是否有"统计"文字，确认这是标签页导航
                const parent = el.parentElement?.parentElement;
                const parentText = parent?.innerText || '';
                if (parentText.includes('统计') || parentText.includes('设置')) {
                    console.log('通过备用方法找到填写标签，点击切换...');
                    el.click();
                    await delay(500);
                    return true;
                }
            }
        }

        return false; // 没有进行切换（可能已经在填写页面）
    }

    async function checkSnipeMode() {
        const wasSnipeMode = GM_getValue('isSnipeMode', false);
        if (!wasSnipeMode) return;

        answers = GM_getValue('answers', []);
        refreshInterval = GM_getValue('refreshInterval', 300);
        autoSubmit = GM_getValue('autoSubmit', true);

        // 更新UI
        const answersInput = document.getElementById('answers-input');
        if (answersInput) answersInput.value = answers.join('\n');

        const snipeBtn = document.getElementById('snipe-btn');
        if (snipeBtn) {
            snipeBtn.textContent = '⏹️ 停止抢填';
            snipeBtn.classList.remove('btn-warning');
            snipeBtn.classList.add('btn-danger');
        }

        await delay(500);

        // 检测并切换到"填写"页面（解决创建者看到统计页面的问题）
        const switched = await switchToFillTab();
        if (switched) {
            console.log('已切换到填写页面，等待页面加载...');
            await delay(500);
        }

        // 获取统计信息
        const count = GM_getValue('refreshCount', 0) + 1;
        const startTimeStamp = GM_getValue('startTime', Date.now());
        const elapsed = Math.floor((Date.now() - startTimeStamp) / 1000);
        const currentTime = new Date().toLocaleTimeString('zh-CN');
        GM_setValue('refreshCount', count);

        if (isFormReady()) {
            GM_setValue('isSnipeMode', false);

            updateStatus('🎯 表单已开启！填写中...', 'success');
            await delay(300);

            const filled = await fillForm();
            if (filled) {
                updateStatus(`🎉 抢填完成！用时${elapsed}s，刷新${count}次`, 'success');
            }

            if (snipeBtn) {
                snipeBtn.textContent = '🎯 抢填模式';
                snipeBtn.classList.remove('btn-danger');
                snipeBtn.classList.add('btn-warning');
            }
        } else {
            // 表单未开启，继续刷新
            updateStatus(`🔄 ${currentTime} | 第${count}次 | 用时${elapsed}s | 等待开启...`, 'running');
            console.log(`表单未开启，${refreshInterval}ms后刷新 (第${count}次)`);

            setTimeout(() => location.reload(), refreshInterval);
        }
    }

    // ==================== 初始化 ====================
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(initApp, 500));
        } else {
            setTimeout(initApp, 500);
        }
    }

    function initApp() {
        createPanel();
        checkSnipeMode();
        console.log('🚀 腾讯文档抢填神器 v8.0 已加载！');
    }

    init();
})();
