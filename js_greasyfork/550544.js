// ==UserScript==
// @name         NovelAI 批量Roll图助手
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  从本地TXT文件读取提示词，全自动批量生成图像。支持顺序/随机模式，可自动记忆，生成失败自动重试。优化版：添加失焦折叠、默认折叠、性能优化
// @author       Takoro
// @match        https://novelai.net/image
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550544/NovelAI%20%E6%89%B9%E9%87%8FRoll%E5%9B%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550544/NovelAI%20%E6%89%B9%E9%87%8FRoll%E5%9B%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 全局变量 ==========
    let promptsArray = [];
    let filteredPromptsArray = [];
    let currentPromptIndex = 0;
    let isAutoRunning = false;
    let promptsProcessedThisRun = 0;
    let titleElement;
    let panelElement;

    // DOM元素缓存
    const domCache = {
        generateButton: null,
        promptEditableDiv: null,
        lastCacheTime: 0,
        cacheTimeout: 5000 // 5秒缓存过期
    };

    const STORAGE_KEYS = {
        START_INDEX: 'nai_helper_start_index',
        PROMPT_TEMPLATE: 'nai_helper_prompt_template',
        CHARACTER_PROMPT_TEMPLATE: 'nai_helper_char_template',
        LAST_FILE_NAME: 'nai_helper_last_file_name',
        LAST_FILE_CONTENT: 'nai_helper_last_file_content',
        RANDOM_MODE: 'nai_helper_random_mode',
        RANDOM_COUNT: 'nai_helper_random_count',
        FILTER_KEYWORD: 'nai_helper_filter_keyword',
        PANEL_COLLAPSED: 'nai_helper_panel_collapsed'
    };

    // ========== 工具函数 ==========
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    function getElementByXPath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    async function waitForElement(selector, parent = document, timeout = 5000) {
        return new Promise((resolve) => {
            const interval = 100;
            let elapsed = 0;
            const timer = setInterval(() => {
                const element = parent.querySelector(selector);
                if (element) {
                    clearInterval(timer);
                    resolve(element);
                }
                elapsed += interval;
                if (elapsed >= timeout) {
                    clearInterval(timer);
                    resolve(null);
                }
            }, interval);
        });
    }

    function adjustTextareaHeight(el) {
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    }

    // 清除DOM缓存
    function clearDomCache() {
        domCache.generateButton = null;
        domCache.promptEditableDiv = null;
        domCache.lastCacheTime = 0;
    }

    // ========== 面板折叠相关（优化版 - 低性能开销）==========
    function togglePanel(forceState = null) {
        if (!panelElement) return;

        const shouldCollapse = forceState !== null ? forceState : !panelElement.classList.contains('collapsed');

        if (shouldCollapse) {
            panelElement.classList.add('collapsed');
            GM_setValue(STORAGE_KEYS.PANEL_COLLAPSED, true);
        } else {
            panelElement.classList.remove('collapsed');
            GM_setValue(STORAGE_KEYS.PANEL_COLLAPSED, false);
        }
    }

    // 优化的失焦折叠 - 降低灵敏度，减少性能开销
    let collapseTimeout = null;
    let lastInteractionTime = 0;

    function setupClickOutsideHandler() {
        // 使用单一的点击监听器，性能开销最小
        document.addEventListener('mousedown', (e) => {
            if (!panelElement) return;

            // 如果面板已折叠，不处理
            if (panelElement.classList.contains('collapsed')) return;

            // 如果点击的是面板内部，清除定时器并记录交互时间
            if (panelElement.contains(e.target)) {
                if (collapseTimeout) {
                    clearTimeout(collapseTimeout);
                    collapseTimeout = null;
                }
                lastInteractionTime = Date.now();
                return;
            }

            // 如果刚刚与面板交互过（800ms内），不折叠
            const timeSinceLastInteraction = Date.now() - lastInteractionTime;
            if (timeSinceLastInteraction < 800) {
                return;
            }

            // 清除之前的定时器
            if (collapseTimeout) {
                clearTimeout(collapseTimeout);
            }

            // 延迟800ms后折叠，给用户充足的反应时间
            collapseTimeout = setTimeout(() => {
                // 再次检查是否刚交互过
                if (Date.now() - lastInteractionTime >= 800) {
                    togglePanel(true);
                }
                collapseTimeout = null;
            }, 800);
        }, { passive: true }); // 使用passive提升性能
    }

    // ========== UI创建 ==========
    function createUIPanel() {
        const panel = document.createElement('div');
        panel.id = 'nai-prompt-helper-panel';
        panel.innerHTML = `
            <h3>提示词批量助手</h3>
            <div class="content-wrapper">
                <div class="file-controls">
                    <label for="prompt-file-input" class="custom-file-button" title="选择新的 .txt 文件">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px"><path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"></path></svg>
                    </label>
                    <input type="file" id="prompt-file-input" accept=".txt" style="display: none;">
                    <div id="file-info-display">当前未加载文件</div>
                </div>
                <div class="control-group">
                    <label for="preset-prompt-input">1. 提示词模板</label>
                    <textarea id="preset-prompt-input" rows="1" placeholder="脚本会从本地txt选择一组Prompt来替换该输入框中的 [替换词] 后填入NAI的主提示词框。\n写法：\nartist1, artist2, [替换词], very aesthetic, masterpiece, no text"></textarea>
                </div>
                <div class="control-group">
                    <label for="character-prompt-input">2. 角色模板</label>
                    <textarea id="character-prompt-input" rows="1" placeholder="以主动换行为一条，随机抽取，留空则会清空页面上的角色框内容。"></textarea>
                </div>

                <div class="control-group filter-controls">
                    <label id="filter-label" for="filter-keyword-input">3. 从文件中筛选 (未启用)</label>
                    <div class="input-with-button">
                        <input type="text" id="filter-keyword-input" placeholder="输入关键词筛选">
                        <button id="apply-filter-btn">应用</button>
                    </div>
                </div>

                <hr>
                <div class="heading-with-control">
                    <label>4. 自动化设置</label>
                    <div class="toggle-switch-wrapper">
                        <label class="toggle-switch-label" for="random-mode-checkbox">随机模式</label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="random-mode-checkbox">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                <div class="control-group settings">
                    <div>
                        <label for="start-index-input" id="start-index-label">文件行数:</label>
                        <input type="number" id="start-index-input" value="1" min="1">
                    </div>
                    <div>
                        <label for="images-per-prompt-input">每条张数:</label>
                        <input type="number" id="images-per-prompt-input" value="1" min="1">
                    </div>
                    <div>
                        <label for="delay-input">延迟(秒):</label>
                        <input type="number" id="delay-input" value="2" min="0" step="0.5">
                    </div>
                    <div>
                        <label for="max-retries-input">重试次数:</label>
                        <input type="number" id="max-retries-input" value="5" min="0">
                    </div>
                </div>
                <hr>
                <button id="main-control-btn">▶️ 开始执行</button>
                <div id="status-display">状态：等待操作...</div>
                <div id="run-counter-display">本次运行: 0 条</div>
            </div>`;
        document.body.appendChild(panel);

        panelElement = panel;
        titleElement = panel.querySelector('h3');

        addEventListeners();
        loadSettings();
        setupClickOutsideHandler();

        // 设置初始折叠状态（默认折叠）
        const savedCollapsedState = GM_getValue(STORAGE_KEYS.PANEL_COLLAPSED, true);
        togglePanel(savedCollapsedState);
    }

    // ========== NAI页面元素查找（优化版）==========
    function removeUnwantedElement() {
        const xpath = '//*[@id="__next"]/div[2]/div[3]/div[3]/div/div[1]/div[5]/div[2]';
        const interval = 3000;
        let attempts = 0;
        const maxAttempts = 3;

        const checker = setInterval(() => {
            attempts++;
            const element = getElementByXPath(xpath);
            if (element) {
                element.remove();
                clearInterval(checker);
            }
            if (attempts >= maxAttempts) {
                clearInterval(checker);
            }
        }, interval);
    }

    async function switchToCharacterPromptTab() {
        let promptButton = Array.from(document.querySelectorAll('button'))
            .find(btn => btn.textContent.trim() === 'Prompt');

        if (!promptButton) {
            try {
                const xpath = '//*[@id="__next"]/div[2]/div[3]/div[3]/div/div[1]/div[3]/div[2]/div/div[3]/div[3]/div[2]/div[1]/div[1]/div[1]/button';
                promptButton = getElementByXPath(xpath);
            } catch (e) {
                console.error('切换到Prompt标签失败:', e);
            }
        }

        if (promptButton) {
            promptButton.click();
            await sleep(200);
            return true;
        }
        return false;
    }

    async function addCharacterSlot() {
        const addCharButton = Array.from(document.querySelectorAll('button'))
            .find(btn => btn.textContent.trim() === 'Add Character');

        if (!addCharButton) return false;

        addCharButton.click();
        const popperMenu = await waitForElement('div[data-popper-placement]');
        if (!popperMenu) return false;

        let otherButton = Array.from(popperMenu.querySelectorAll('button'))
            .find(b => b.textContent.trim().toLowerCase().includes('other'));

        if (!otherButton) {
            try {
                otherButton = getElementByXPath('/html/body/div[11]/button[3]');
            } catch (e) {
                return false;
            }
        }

        if (!otherButton) return false;

        otherButton.click();
        await sleep(300);
        return true;
    }

    async function handleCharacterPrompt() {
        const charTemplate = document.getElementById('character-prompt-input').value.trim();
        const addCharButton = Array.from(document.querySelectorAll('button'))
            .find(btn => btn.textContent.trim() === 'Add Character');

        if (!addCharButton) return true;

        const characterInputs = document.querySelectorAll('[class*="character-prompt-input"] [contenteditable="true"] p');

        if (!charTemplate) {
            if (characterInputs.length > 0) {
                characterInputs.forEach(p => {
                    if (p.textContent) {
                        p.textContent = '';
                        p.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
            }
            return true;
        }

        await switchToCharacterPromptTab();

        const charPrompts = charTemplate.split(/\r?\n/).filter(line => line.trim() !== '');
        if (charPrompts.length === 0) return true;

        const randomCharPrompt = charPrompts[Math.floor(Math.random() * charPrompts.length)];

        let promptElement = document.querySelector('[class*="character-prompt-input-1"] [contenteditable="true"] p');

        if (!promptElement) {
            if (!(await addCharacterSlot())) return false;
            promptElement = await waitForElement('[class*="character-prompt-input-1"] [contenteditable="true"] p');
            if (!promptElement) return false;
        }

        if (promptElement.textContent !== randomCharPrompt) {
            promptElement.textContent = randomCharPrompt;
            promptElement.dispatchEvent(new Event('input', { bubbles: true }));
        }

        return true;
    }

    function findPromptEditableDiv() {
        const now = Date.now();
        if (domCache.promptEditableDiv && (now - domCache.lastCacheTime < domCache.cacheTimeout)) {
            if (document.contains(domCache.promptEditableDiv)) {
                return domCache.promptEditableDiv;
            }
        }

        const element = document.querySelector('[class*="prompt-input-box-prompt"] [contenteditable="true"], [class*="prompt-input-box-base-prompt"] [contenteditable="true"]');

        if (element) {
            domCache.promptEditableDiv = element;
            domCache.lastCacheTime = now;
        }

        return element;
    }

    async function fillPrompt(promptText) {
        let promptEditableDiv = findPromptEditableDiv();

        if (!promptEditableDiv) {
            let basePromptButton = Array.from(document.querySelectorAll('button'))
                .find(btn => btn.textContent.trim() === 'Base Prompt');

            if (!basePromptButton) {
                try {
                    const xpath = '//*[@id="__next"]/div[2]/div[3]/div[3]/div/div[1]/div[3]/div[2]/div/div[1]/div[1]/div[1]/div[2]/button';
                    basePromptButton = getElementByXPath(xpath);
                } catch (e) {
                    console.error('查找Base Prompt按钮失败:', e);
                }
            }

            if (basePromptButton) {
                basePromptButton.click();
                await sleep(500);
                clearDomCache();
                promptEditableDiv = findPromptEditableDiv();
            }
        }

        if (!promptEditableDiv) {
            updateStatus('错误: 找不到主提示词输入框', 'error');
            return false;
        }

        const paragraphs = promptEditableDiv.querySelectorAll('p');
        if (paragraphs.length > 1) {
            for (let i = 1; i < paragraphs.length; i++) {
                paragraphs[i].remove();
            }
        }

        const promptElement = promptEditableDiv.querySelector('p') || document.createElement('p');
        if (!promptElement.parentNode) {
            promptEditableDiv.appendChild(promptElement);
        }

        const template = document.getElementById('preset-prompt-input').value;
        promptElement.textContent = template.includes('[替换词]')
            ? template.replace('[替换词]', promptText)
            : promptText;

        promptEditableDiv.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
    }

    function findGenerateButton() {
        const now = Date.now();
        if (domCache.generateButton && (now - domCache.lastCacheTime < domCache.cacheTimeout)) {
            if (document.contains(domCache.generateButton)) {
                return domCache.generateButton;
            }
        }

        const button = Array.from(document.querySelectorAll('button'))
            .find(btn => btn.textContent.trim().toLowerCase().startsWith('generate'));

        if (button) {
            domCache.generateButton = button;
            domCache.lastCacheTime = now;
        }

        return button;
    }

    async function waitForGeneration() {
        return new Promise((resolve, reject) => {
            const timeout = 20000;
            const interval = 500;
            let elapsed = 0;

            const id = setInterval(() => {
                elapsed += interval;
                const generateBtn = findGenerateButton();

                if (generateBtn && !generateBtn.disabled) {
                    clearInterval(id);
                    resolve();
                    return;
                }

                if (elapsed >= timeout) {
                    clearInterval(id);
                    reject(new Error('生成超时 (20秒)'));
                }
            }, interval);
        });
    }

    async function checkForNAIError() {
        await sleep(500);
        const errorNotification = document.querySelector('.Toastify__toast--error');
        return !!errorNotification;
    }

    // ========== 核心处理逻辑（添加进度显示）==========
    async function processSinglePrompt(promptText, statusMsg, imagesPerPrompt, delay, maxRetries, currentIndex, totalCount) {
        for (let i = 0; i < imagesPerPrompt; i++) {
            if (!isAutoRunning) return false;

            let generationSuccessful = false;

            for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
                if (!isAutoRunning) return false;

                try {
                    const attemptMsg = attempt > 1 ? ` (重试 ${attempt - 1}/${maxRetries})` : '';
                    updateStatus(`${statusMsg}, 生成第 ${i + 1}/${imagesPerPrompt} 张...${attemptMsg}`);

                    // 更新标题进度
                    if (titleElement) {
                        titleElement.textContent = `提示词批量助手 [${currentIndex}/${totalCount} 运行中...]`;
                    }

                    if (!await handleCharacterPrompt()) {
                        throw new Error('处理角色模板失败');
                    }

                    if (!(await fillPrompt(promptText))) {
                        throw new Error('填充主提示词失败');
                    }

                    await sleep(200);

                    const generateButton = findGenerateButton();
                    if (!generateButton || generateButton.disabled) {
                        throw new Error('生成按钮不可用');
                    }

                    generateButton.click();
                    await waitForGeneration();

                    if (await checkForNAIError()) {
                        throw new Error('检测到NAI错误提示');
                    }

                    generationSuccessful = true;
                    break;

                } catch (error) {
                    console.error('生成失败:', error);
                    updateStatus(`错误: ${error.message}, 正在准备重试...`, 'error');

                    if (attempt > maxRetries) {
                        updateStatus(`错误: ${error.message}，重试次数已用尽，任务中止`, 'error');
                        stopAutomation();
                        return false;
                    }

                    clearDomCache();
                    await sleep(3000);
                }
            }

            if (!generationSuccessful) {
                updateStatus(`处理提示词失败，任务已停止。`, 'error');
                stopAutomation();
                return false;
            }

            if (!isAutoRunning) return false;

            updateStatus(`${statusMsg}, 第 ${i + 1}/${imagesPerPrompt} 张图生成完毕，等待 ${delay / 1000} 秒...`);
            await sleep(delay);
        }

        promptsProcessedThisRun++;
        document.getElementById('run-counter-display').textContent = `本次运行: ${promptsProcessedThisRun} 条`;
        return true;
    }

    // ========== 筛选功能 ==========
    function applyFilter() {
        const keyword = document.getElementById('filter-keyword-input').value.trim();
        const labelEl = document.getElementById('filter-label');
        labelEl.className = '';

        if (promptsArray.length === 0) {
            filteredPromptsArray = [];
            labelEl.textContent = '3. 从文件中筛选 (请先加载文件)';
            labelEl.classList.add('error');
            return;
        }

        if (!keyword) {
            filteredPromptsArray = [...promptsArray];
            labelEl.textContent = '3. 从文件中筛选 (未启用)';
            GM_setValue(STORAGE_KEYS.FILTER_KEYWORD, '');
            return;
        }

        filteredPromptsArray = promptsArray.filter(p =>
            p.trim().toLowerCase().includes(keyword.toLowerCase())
        );
        GM_setValue(STORAGE_KEYS.FILTER_KEYWORD, keyword);

        labelEl.textContent = `3. 从文件中筛选: ${keyword} (${filteredPromptsArray.length}条)`;

        if (filteredPromptsArray.length > 0) {
            labelEl.classList.add('done');
        } else {
            labelEl.classList.add('error');
        }
    }

    // ========== 设置加载 ==========
    function loadSettings() {
        const isRandom = GM_getValue(STORAGE_KEYS.RANDOM_MODE, true);
        document.getElementById('random-mode-checkbox').checked = isRandom;
        toggleRandomModeUI(isRandom);

        const presetPromptTextarea = document.getElementById('preset-prompt-input');
        presetPromptTextarea.value = GM_getValue(STORAGE_KEYS.PROMPT_TEMPLATE, '');
        presetPromptTextarea.scrollTop = 0;

        const charPromptTextarea = document.getElementById('character-prompt-input');
        charPromptTextarea.value = GM_getValue(STORAGE_KEYS.CHARACTER_PROMPT_TEMPLATE, '');
        charPromptTextarea.scrollTop = 0;

        setTimeout(() => {
            adjustTextareaHeight(presetPromptTextarea);
            adjustTextareaHeight(charPromptTextarea);
        }, 100);

        document.getElementById('filter-keyword-input').value = GM_getValue(STORAGE_KEYS.FILTER_KEYWORD, '');

        const savedFileName = GM_getValue(STORAGE_KEYS.LAST_FILE_NAME);
        const savedFileContent = GM_getValue(STORAGE_KEYS.LAST_FILE_CONTENT);

        if (savedFileName && savedFileContent) {
            promptsArray = savedFileContent.split(/\r?\n/).filter(line => line.trim() !== '');
            if (promptsArray.length > 0) {
                document.getElementById('start-index-input').max = promptsArray.length;
                updateFileInfoDisplay(savedFileName, promptsArray.length);
                updateStatus(`已自动加载记忆的文件`, 'info');
                applyFilter();
            }
        }
    }

    // ========== 事件监听 ==========
    function addEventListeners() {
        document.getElementById('prompt-file-input').addEventListener('change', handleFileSelect);
        document.getElementById('main-control-btn').addEventListener('click', mainButtonHandler);
        document.getElementById('apply-filter-btn').addEventListener('click', applyFilter);

        document.getElementById('filter-keyword-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') applyFilter();
        });

        // 标题点击切换折叠
        if (titleElement) {
            titleElement.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePanel();
                lastInteractionTime = Date.now(); // 记录交互时间
            });
        }

        // 面板内部点击时记录交互时间
        if (panelElement) {
            panelElement.addEventListener('click', () => {
                lastInteractionTime = Date.now();
            });
        }

        const mainInput = document.getElementById('start-index-input');
        mainInput.addEventListener('change', () => {
            const isRandom = document.getElementById('random-mode-checkbox').checked;
            GM_setValue(isRandom ? STORAGE_KEYS.RANDOM_COUNT : STORAGE_KEYS.START_INDEX, mainInput.value);
        });

        const presetPromptTextarea = document.getElementById('preset-prompt-input');
        presetPromptTextarea.addEventListener('input', (e) => {
            GM_setValue(STORAGE_KEYS.PROMPT_TEMPLATE, e.target.value);
            adjustTextareaHeight(e.target);
        });

        const charPromptTextarea = document.getElementById('character-prompt-input');
        charPromptTextarea.addEventListener('input', (e) => {
            GM_setValue(STORAGE_KEYS.CHARACTER_PROMPT_TEMPLATE, e.target.value);
            adjustTextareaHeight(e.target);
        });

        const randomCheckbox = document.getElementById('random-mode-checkbox');
        randomCheckbox.addEventListener('change', (e) => {
            toggleRandomModeUI(e.target.checked);
            GM_setValue(STORAGE_KEYS.RANDOM_MODE, e.target.checked);
        });
    }

    function toggleRandomModeUI(isRandom) {
        const input = document.getElementById('start-index-input');
        const label = document.getElementById('start-index-label');

        if (isRandom) {
            label.textContent = "随机次数:";
            input.value = GM_getValue(STORAGE_KEYS.RANDOM_COUNT, '50');
            input.max = 999;
        } else {
            label.textContent = "文件行数:";
            input.value = GM_getValue(STORAGE_KEYS.START_INDEX, '1');
            input.max = promptsArray.length > 0 ? promptsArray.length : 9999;
        }
    }

    // ========== 文件处理 ==========
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            promptsArray = content.split(/\r?\n/).filter(line => line.trim() !== '');

            if (promptsArray.length > 0) {
                if (!document.getElementById('random-mode-checkbox').checked) {
                    document.getElementById('start-index-input').max = promptsArray.length;
                }
                updateFileInfoDisplay(file.name, promptsArray.length);
                updateStatus(`新文件加载成功，准备就绪`, 'info');
                GM_setValue(STORAGE_KEYS.LAST_FILE_NAME, file.name);
                GM_setValue(STORAGE_KEYS.LAST_FILE_CONTENT, content);
                applyFilter();
            } else {
                updateFileInfoDisplay('文件为空或格式错误', 0, true);
                updateStatus('请选择一个有效的 .txt 文件', 'error');
            }

            event.target.value = null;
        };

        reader.onerror = () => {
            updateStatus('文件读取失败', 'error');
        };

        reader.readAsText(file);
    }

    function updateFileInfoDisplay(fileName, count, isError = false) {
        const display = document.getElementById('file-info-display');
        display.textContent = isError ? fileName : `文件: ${fileName} (${count}条)`;
        display.style.color = isError ? '#e06c75' : '#98c379';
    }

    // ========== 自动化控制 ==========
    function mainButtonHandler() {
        isAutoRunning ? stopAutomation() : startAutomation();
    }

    function startAutomation() {
        const fileContent = GM_getValue(STORAGE_KEYS.LAST_FILE_CONTENT, '');
        promptsArray = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');

        if (promptsArray.length === 0) {
            alert('请先选择或自动加载一个有效的提示词文件！');
            return;
        }

        applyFilter();

        if (filteredPromptsArray.length === 0) {
            alert('筛选结果为空，无法开始任务！请更改或清空筛选词。');
            return;
        }

        isAutoRunning = true;
        promptsProcessedThisRun = 0;
        clearDomCache();

        document.getElementById('run-counter-display').textContent = '本次运行: 0 条';
        document.getElementById('main-control-btn').textContent = '⏹️ 停止执行';
        document.getElementById('main-control-btn').className = 'running';

        const imagesPerPrompt = parseInt(document.getElementById('images-per-prompt-input').value, 10);
        const delay = parseFloat(document.getElementById('delay-input').value) * 1000;
        const isRandom = document.getElementById('random-mode-checkbox').checked;
        const maxRetries = parseInt(document.getElementById('max-retries-input').value, 10);

        if (isRandom) {
            const randomCount = parseInt(document.getElementById('start-index-input').value, 10);
            runRandomAutomation(randomCount, imagesPerPrompt, delay, maxRetries);
        } else {
            const startIndex = Math.max(0, parseInt(document.getElementById('start-index-input').value, 10) - 1);
            const sequenceToProcess = filteredPromptsArray.filter(prompt => {
                const originalIndex = promptsArray.indexOf(prompt);
                return originalIndex >= startIndex;
            });

            if (sequenceToProcess.length === 0) {
                alert(`从第 ${startIndex + 1} 行开始，未找到符合筛选条件的提示词。`);
                stopAutomation();
                return;
            }

            runSequentialAutomation(sequenceToProcess, imagesPerPrompt, delay, maxRetries);
        }
    }

    function stopAutomation() {
        isAutoRunning = false;
        document.getElementById('main-control-btn').textContent = '▶️ 开始执行';
        document.getElementById('main-control-btn').className = '';

        if (titleElement) {
            titleElement.textContent = '提示词批量助手';
        }

        updateStatus('任务已手动停止', 'info');
    }

    async function runSequentialAutomation(sequenceToProcess, imagesPerPrompt, delay, maxRetries) {
        for (let i = 0; i < sequenceToProcess.length; i++) {
            if (!isAutoRunning) break;

            const currentPrompt = sequenceToProcess[i];
            const originalIndex = promptsArray.indexOf(currentPrompt);
            const statusMsg = `顺序(筛选后): 第 ${i + 1}/${sequenceToProcess.length} 条 (原文件第 ${originalIndex + 1} 行)`;

            if (!await processSinglePrompt(currentPrompt, statusMsg, imagesPerPrompt, delay, maxRetries, i + 1, sequenceToProcess.length)) {
                return;
            }

            if (isAutoRunning) {
                const nextIndex = originalIndex + 1;
                document.getElementById('start-index-input').value = nextIndex + 1;
                GM_setValue(STORAGE_KEYS.START_INDEX, (nextIndex + 1).toString());
            }
        }

        if (isAutoRunning) {
            updateStatus(`顺序(筛选后)任务处理完毕！`, 'done');
            stopAutomation();
        }
    }

    async function runRandomAutomation(randomCount, imagesPerPrompt, delay, maxRetries) {
        for (let i = 0; i < randomCount; i++) {
            if (!isAutoRunning) break;

            const randomFilteredIndex = Math.floor(Math.random() * filteredPromptsArray.length);
            const selectedPrompt = filteredPromptsArray[randomFilteredIndex];
            const originalIndex = promptsArray.indexOf(selectedPrompt);
            const statusMsg = `随机 (筛选后): 第 ${i + 1}/${randomCount} 次 (抽中原文件第 ${originalIndex + 1} 行)`;

            if (!await processSinglePrompt(selectedPrompt, statusMsg, imagesPerPrompt, delay, maxRetries, i + 1, randomCount)) {
                return;
            }
        }

        if (isAutoRunning) {
            updateStatus(`随机任务 ${randomCount} 次已全部完成！`, 'done');
            stopAutomation();
        }
    }

    function updateStatus(message, type = 'info') {
        const el = document.getElementById('status-display');
        if (el) {
            el.textContent = message;
            el.className = type;
        }
    }

    // ========== 样式 ==========
    GM_addStyle(`
    #nai-prompt-helper-panel {
        position: fixed;
        top: 70px;
        right: 25px;
        z-index: 9999;
        width: 320px;
        background: #1c1f26;
        color: #c8ccd4;
        border-radius: 12px;
        border: 1px solid #3a414f;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        font-family: "Segoe UI", sans-serif;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
    }

    #nai-prompt-helper-panel.collapsed {
        transform: translateY(calc(100vh - 180px));
        opacity: 0.85;
    }

    #nai-prompt-helper-panel.collapsed:hover {
        opacity: 1;
    }

    #nai-prompt-helper-panel h3 {
        padding: 12px 16px;
        border-bottom: 1px solid #3a414f;
        cursor: pointer;
        user-select: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #82aaff;
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        transition: background-color 0.2s;
    }

    #nai-prompt-helper-panel h3:hover {
        background-color: rgba(130, 170, 255, 0.1);
    }

    #nai-prompt-helper-panel.collapsed h3 {
        border-bottom: none;
    }

    #nai-prompt-helper-panel h3::after {
        content: '−';
        font-size: 20px;
        transition: transform 0.3s;
    }

    #nai-prompt-helper-panel.collapsed h3::after {
        content: '+';
        transform: rotate(90deg);
    }

    #nai-prompt-helper-panel .content-wrapper {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        max-height: calc(80vh - 15px);
        overflow-y: auto;
        overflow-x: hidden;
        transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
    }

    #nai-prompt-helper-panel .content-wrapper::-webkit-scrollbar {
        width: 8px;
    }

    #nai-prompt-helper-panel .content-wrapper::-webkit-scrollbar-track {
        background: #282c34;
        border-radius: 4px;
    }

    #nai-prompt-helper-panel .content-wrapper::-webkit-scrollbar-thumb {
        background: #4f586a;
        border-radius: 4px;
    }

    #nai-prompt-helper-panel .content-wrapper::-webkit-scrollbar-thumb:hover {
        background: #5a657a;
    }

    #nai-prompt-helper-panel.collapsed .content-wrapper {
        max-height: 0;
        padding: 0 16px;
        opacity: 0;
    }

    #nai-prompt-helper-panel hr {
        border: none;
        border-top: 1px solid #3a414f;
        margin: 4px 0;
    }

    #nai-prompt-helper-panel .control-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    #nai-prompt-helper-panel .file-controls {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    #nai-prompt-helper-panel label {
        font-size: 14px;
        color: #a6accd;
        transition: color 0.2s;
    }

    #nai-prompt-helper-panel .custom-file-button {
        background-color: #4f586a;
        border-radius: 6px;
        padding: 0;
        cursor: pointer;
        transition: all 0.2s;
        width: 38px;
        height: 38px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
    }

    #nai-prompt-helper-panel .custom-file-button:hover {
        background-color: #5a657a;
        transform: scale(1.05);
    }

    #nai-prompt-helper-panel #file-info-display {
        font-size: 13px;
        text-align: left;
        padding: 6px 10px;
        background-color: #282c34;
        border-radius: 6px;
        border: 1px dashed #4f586a;
        word-break: break-all;
        margin-top: 0;
        flex-grow: 1;
        transition: all 0.3s;
    }

    #nai-prompt-helper-panel .heading-with-control {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #nai-prompt-helper-panel .toggle-switch-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    #nai-prompt-helper-panel .toggle-switch-label {
        font-size: 14px;
        color: #a6accd;
    }

    #nai-prompt-helper-panel .toggle-switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 22px;
    }

    #nai-prompt-helper-panel .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    #nai-prompt-helper-panel .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #4f586a;
        border-radius: 22px;
        transition: .3s;
    }

    #nai-prompt-helper-panel .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        border-radius: 50%;
        transition: .3s;
    }

    #nai-prompt-helper-panel input:checked + .slider {
        background-color: #82aaff;
    }

    #nai-prompt-helper-panel input:checked + .slider:before {
        transform: translateX(18px);
    }

    #nai-prompt-helper-panel input,
    #nai-prompt-helper-panel textarea,
    #nai-prompt-helper-panel button {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        font-size: 14px;
        border-radius: 6px;
        border: 1px solid #4f586a;
        background-color: #282c34;
        color: #c8ccd4;
        transition: all 0.2s;
    }

    #nai-prompt-helper-panel input:focus,
    #nai-prompt-helper-panel textarea:focus {
        outline: none;
        border-color: #82aaff;
        box-shadow: 0 0 0 2px rgba(130, 170, 255, 0.2);
    }

    #nai-prompt-helper-panel textarea {
        resize: vertical;
    }

    #nai-prompt-helper-panel #preset-prompt-input {
        min-height: 100px;
        max-height: 140px;
    }

    #nai-prompt-helper-panel #character-prompt-input {
        min-height: 45px;
        max-height: 60px;
    }

    #nai-prompt-helper-panel .settings {
        flex-direction: row;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
    }

    #nai-prompt-helper-panel .settings > div {
        flex-basis: calc(25% - 6px);
        text-align: center;
    }

    #nai-prompt-helper-panel .settings label {
        font-size: 13px;
        margin-bottom: 4px;
        display: block;
    }

    #nai-prompt-helper-panel .settings input {
        width: 100%;
        padding: 8px;
        text-align: center;
    }

    #nai-prompt-helper-panel #main-control-btn {
        font-weight: bold;
        color: #f1f1f1;
        background-color: #82aaff;
        border-color: #82aaff;
        cursor: pointer;
        transition: all 0.2s;
    }

    #nai-prompt-helper-panel #main-control-btn:hover {
        background-color: #90b8ff;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(130, 170, 255, 0.3);
    }

    #nai-prompt-helper-panel #main-control-btn.running {
        background-color: #e06c75;
        border-color: #e06c75;
    }

    #nai-prompt-helper-panel #main-control-btn.running:hover {
        background-color: #f07f88;
    }

    #nai-prompt-helper-panel #status-display {
        padding: 10px;
        border-radius: 6px;
        font-size: 13px;
        text-align: center;
        word-wrap: break-word;
        line-height: 1.4;
        background-color: #282c34;
        transition: all 0.3s;
    }

    #nai-prompt-helper-panel #run-counter-display {
        font-size: 13px;
        text-align: center;
        color: #98c379;
    }

    #nai-prompt-helper-panel #status-display.error {
        background-color: rgba(224, 108, 117, 0.2);
        color: #e06c75;
        font-weight: bold;
        border: 1px solid #e06c75;
    }

    #nai-prompt-helper-panel #filter-label.error {
        color: #e06c75 !important;
    }

    #nai-prompt-helper-panel #status-display.done {
        background-color: rgba(152, 195, 121, 0.2);
        color: #98c379;
        font-weight: bold;
        border: 1px solid #98c379;
    }

    #nai-prompt-helper-panel #filter-label.done {
        color: #98c379 !important;
    }

    #nai-prompt-helper-panel .input-with-button {
        display: flex;
        gap: 8px;
    }

    #nai-prompt-helper-panel #filter-keyword-input {
        flex-grow: 1;
    }

    #nai-prompt-helper-panel #apply-filter-btn {
        flex-grow: 0;
        flex-shrink: 0;
        width: auto;
        padding: 0 15px;
        background-color: #4f586a;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
    }

    #nai-prompt-helper-panel #apply-filter-btn:hover {
        background-color: #5a657a;
        transform: scale(1.05);
    }
    `);

    // ========== 初始化 ==========
    function waitForNAI() {
        let attempts = 0;
        const maxAttempts = 30;

        const checkInterval = setInterval(() => {
            attempts++;
            const generateBtn = findGenerateButton();

            if (generateBtn) {
                clearInterval(checkInterval);
                createUIPanel();
                removeUnwantedElement();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.error("NAI 提示词批量助手：等待界面超时");
                alert("NAI 提示词批量助手：等待界面超时，脚本可能需要更新。");
            }
        }, 2000);
    }

    waitForNAI();
})();