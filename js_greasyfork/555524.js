// ==UserScript==
// @name         通用自动填写助手
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description    通用自动填写助手：录制表单填写规则，实现一键自动填写。支持多语言、悬浮按钮、批量设置规则和唯一性识别模式。
// @description:en  Universal Auto Fill Assistant: Record form filling rules to achieve one-click auto fill. Supports multiple languages, floating button, batch rule setting and unique recognition mode.
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @author       QqMorning
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555524/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555524/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
        // 状态变量
    let isRecording = false;
    let isSelecting = false;
    let currentRules = {};
    let menuCommands = [];
    let uniqueMode = true; // 默认开启唯一性识别
    let pageMatchMode = 'strict'; // 页面匹配模式

        // 配置
        const CONFIG = {
            panelPosition: 'right',
            highlightColor: '#3498db',
            recordedColor: '#2ecc71',
            language: 'zh-CN', // 默认语言
            pageMatchMode: 'strict' // strict: 严格模式, loose: 宽松模式
        };

        // 语言资源
        const i18n = {
            'zh-CN': {
                title: '自动填写助手',
                ready: '准备就绪',
                startRecording: '开始录制',
                stopRecording: '停止录制',
                autoFill: '自动填写',
                manageRules: '管理规则',
                clearRules: '清除规则',
                hideRules: '隐藏规则',
                currentRules: '当前规则',
                noRules: '暂无规则',
                recordingMode: '录制模式已开启，点击要自动填写的表单元素',
                recordingStopped: '录制已停止，规则已保存',
                clickToRecord: '点击要录制的表单元素',
                enterValue: '输入值并确认',
                fillSuccess: '成功填写 ${count} 个字段！',
                fillWarning: '没有找到匹配的字段进行填写',
                noRulesWarning: '当前页面没有保存的填写规则',
                clearConfirm: '确定要清除当前页面的所有填写规则吗？',
                clearedSuccess: '已清除当前页面的所有规则',
                uniqueMode: '唯一模式',
                uniqueModeOn: '开启',
                uniqueModeOff: '关闭',
                uniqueModeNotification: '唯一性识别模式 ${status}',
                batchFill: '批量填写',
                uniqueFill: '唯一填写',
                pageMatchMode: '页面匹配',
                strictMode: '严格',
                looseMode: '宽松',
                pageMatchModeNotification: '页面匹配模式已切换为 ${mode} 模式',
                strictModeDesc: '严格模式：区分所有URL',
                looseModeDesc: '宽松模式：忽略URL中的变化部分'
            },
            'en': {
                title: 'Auto Fill Assistant',
                ready: 'Ready',
                startRecording: 'Start Recording',
                stopRecording: 'Stop Recording',
                autoFill: 'Auto Fill',
                manageRules: 'Manage Rules',
                clearRules: 'Clear Rules',
                hideRules: 'Hide Rules',
                currentRules: 'Current Rules',
                noRules: 'No rules yet',
                recordingMode: 'Recording mode enabled, click form elements to record',
                recordingStopped: 'Recording stopped, rules saved',
                clickToRecord: 'Click form elements to record',
                enterValue: 'Enter value and confirm',
                fillSuccess: 'Successfully filled ${count} fields!',
                fillWarning: 'No matching fields found to fill',
                noRulesWarning: 'No saved fill rules for current page',
                clearConfirm: 'Are you sure you want to clear all rules for this page?',
                clearedSuccess: 'All rules for current page cleared',
                uniqueMode: 'Unique Mode',
                uniqueModeOn: 'ON',
                uniqueModeOff: 'OFF',
                uniqueModeNotification: 'Unique mode ${status}',
                batchFill: 'Batch Fill',
                uniqueFill: 'Unique Fill',
                pageMatchMode: 'Page Match',
                strictMode: 'Strict',
                looseMode: 'Loose',
                pageMatchModeNotification: 'Page match mode switched to ${mode}',
                strictModeDesc: 'Strict mode: Distinguish all URLs',
                looseModeDesc: 'Loose mode: Ignore variable parts in URLs'
            }
        };

    // 切换唯一性模式
    function toggleUniqueMode() {
        uniqueMode = !uniqueMode;
        GM_setValue('autoFillUniqueMode', uniqueMode);

        const uniqueBtn = document.getElementById('af-unique-mode');
        if (uniqueBtn) {
            uniqueBtn.textContent = `${t('uniqueMode')}: ${t(uniqueMode ? 'uniqueModeOn' : 'uniqueModeOff')}`;
            uniqueBtn.classList.toggle('af-btn-active', uniqueMode);
        }

        showNotification(t('uniqueModeNotification', { status: t(uniqueMode ? 'uniqueModeOn' : 'uniqueModeOff') }));
    }

    // 加载唯一性模式设置
    function loadUniqueMode() {
        uniqueMode = GM_getValue('autoFillUniqueMode', true);
    }

    // 加载页面匹配模式设置
    function loadPageMatchMode() {
        pageMatchMode = GM_getValue('autoFillPageMatchMode', 'strict');
    }

    // 切换页面匹配模式
    function togglePageMatchMode() {
        pageMatchMode = pageMatchMode === 'strict' ? 'loose' : 'strict';
        GM_setValue('autoFillPageMatchMode', pageMatchMode);

        const modeBtn = document.getElementById('af-page-match-mode');
        if (modeBtn) {
            modeBtn.textContent = `${t('pageMatchMode')}: ${t(pageMatchMode === 'strict' ? 'strictMode' : 'looseMode')}`;
            modeBtn.classList.toggle('af-btn-active', pageMatchMode === 'loose');
        }

        showNotification(t('pageMatchModeNotification', { mode: t(pageMatchMode === 'strict' ? 'strictMode' : 'looseMode') }));
    }


    // 获取当前语言
    function getCurrentLanguage() {
        return GM_getValue('autoFillLanguage', CONFIG.language);
    }

    // 设置语言
    function setLanguage(lang) {
        GM_setValue('autoFillLanguage', lang);
        CONFIG.language = lang;
        // 重新创建面板以应用新语言
        createControlPanel();
    }

    // 翻译函数
    function t(key, params = {}) {
        const lang = getCurrentLanguage();
        let text = i18n[lang]?.[key] || i18n['zh-CN'][key] || key;

        // 替换参数
        Object.keys(params).forEach(param => {
            text = text.replace(`\${${param}}`, params[param]);
        });

        return text;
    }


    // 创建控制面板
    function createControlPanel() {
        // 如果已存在面板，先移除
        const existingPanel = document.getElementById('auto-fill-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'auto-fill-panel';

        const positionStyle = CONFIG.panelPosition === 'right' ?
              'right: 20px; left: auto;' : 'left: 20px; right: auto;';

        panel.innerHTML = `
            <div class="af-panel" style="${positionStyle}">
                <div class="af-header">
                    <h3>${t('title')}</h3>
                    <div class="af-language-switcher">
                        <button class="af-lang-btn ${getCurrentLanguage() === 'zh-CN' ? 'active' : ''}" data-lang="zh-CN">中</button>
                        <button class="af-lang-btn ${getCurrentLanguage() === 'en' ? 'active' : ''}" data-lang="en">EN</button>
                    </div>
                    <button class="af-close" id="af-close">×</button>
                </div>
                <div class="af-body">
                    <div class="af-status" id="af-status">
                        <span class="af-status-indicator"></span>
                        <span class="af-status-text" id="af-status-text">${t('ready')}</span>
                    </div>
                    <div class="af-buttons">
                        <button class="af-btn" id="af-start-recording">${t('startRecording')}</button>
                        <button class="af-btn af-btn-stop" id="af-stop-recording" style="display:none;">${t('stopRecording')}</button>
                        <button class="af-btn af-btn-fill" id="af-auto-fill">${t('autoFill')}</button>
                        <button class="af-btn af-btn-manage" id="af-manage-rules">${t('manageRules')}</button>
                        <button class="af-btn af-btn-clear" id="af-clear-rules">${t('clearRules')}</button>
                        <button class="af-btn af-btn-mode" id="af-page-match-mode">${t('pageMatchMode')}: ${t(pageMatchMode === 'strict' ? 'strictMode' : 'looseMode')}</button>
                    </div>
                    <div class="af-rules-list" id="af-rules-list" style="display:none;">
                        <h4>${t('currentRules')}:</h4>
                        <ul id="af-rules-container"></ul>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        setupEventListeners();
        loadRulesForPage();
        updateRulesList();

        // 添加面板样式
        addPanelStyles();
    }
    // 添加面板样式
    function addPanelStyles() {
        // 如果样式已存在，先移除
        const existingStyle = document.getElementById('auto-fill-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'auto-fill-styles';
       style.textContent = `
    #auto-fill-panel {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 13px;
    }
    .af-panel {
        position: fixed;
        top: 50px;
        background: white;
        padding: 0;
        border-radius: 6px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        width: 220px;
        overflow: hidden;
        border: 1px solid #e0e0e0;
    }
    .af-header {
        background: #3498db;
        color: white;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .af-header h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: white;
    }
    .af-close {
        background: none;
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .af-body {
        padding: 12px;
    }
    .af-status {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        padding: 6px 10px;
        background: #f8f9fa;
        border-radius: 3px;
        font-size: 12px;
    }
    .af-status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #6c757d;
        margin-right: 6px;
    }
    .af-status.recording .af-status-indicator {
        background: #e74c3c;
        animation: af-pulse 1.5s infinite;
    }
    .af-status.selecting .af-status-indicator {
        background: #f39c12;
        animation: af-pulse 1.5s infinite;
    }
    @keyframes af-pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
    .af-buttons {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .af-btn {
        padding: 7px 10px;
        border: none;
        border-radius: 3px;
        background: #3498db;
        color: white;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.2s;
    }
    .af-btn:hover {
        background: #2980b9;
    }
    .af-btn-stop {
        background: #e74c3c;
    }
    .af-btn-stop:hover {
        background: #c0392b;
    }
    .af-btn-fill {
        background: #2ecc71;
    }
    .af-btn-fill:hover {
        background: #27ae60;
    }
    .af-btn-manage {
        background: #9b59b6;
    }
    .af-btn-manage:hover {
        background: #8e44ad;
    }
    .af-btn-clear {
        background: #e67e22;
    }
    .af-btn-clear:hover {
        background: #d35400;
    }
    .af-rules-list {
        margin-top: 12px;
        border-top: 1px solid #e0e0e0;
        padding-top: 12px;
    }
    .af-rules-list h4 {
        margin: 0 0 8px 0;
        font-size: 13px;
        color: #555;
    }
    .af-rules-list ul {
        margin: 0;
        padding: 0;
        list-style: none;
        max-height: 150px;
        overflow-y: auto;
        font-size: 11px;
    }
    .af-rules-list li {
        padding: 3px 0;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
    }
    .af-rule-value {
        color: #777;
        font-style: italic;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .af-highlight {
        outline: 2px solid ${CONFIG.highlightColor} !important;
        background-color: rgba(52, 152, 219, 0.1) !important;
    }
    .af-recorded {
        outline: 2px solid ${CONFIG.recordedColor} !important;
        background-color: rgba(46, 204, 113, 0.1) !important;
    }
    .af-btn-active {
        background: #e67e22 !important;
    }
    .af-btn-active:hover {
        background: #d35400 !important;
    }
    .af-language-switcher {
        display: flex;
        gap: 4px;
    }
    .af-lang-btn {
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 1px 4px;
        border-radius: 2px;
        cursor: pointer;
        font-size: 10px;
    }
    .af-lang-btn.active {
        background: rgba(255,255,255,0.4);
        font-weight: bold;
    }
     .af-btn-mode {
        background: #16a085;
    }
    .af-btn-mode:hover {
        background: #1abc9c;
    }
`;
        document.head.appendChild(style);
    }

    // 创建悬浮按钮
    function createFloatingButton() {
        const existingBtn = document.getElementById('af-floating-btn');
        if (existingBtn) return;

        const floatBtn = document.createElement('div');
        floatBtn.id = 'af-floating-btn';
        floatBtn.innerHTML = '🔧';
        floatBtn.title = t('title');

        document.body.appendChild(floatBtn);

        // 添加悬浮按钮样式
        addFloatingButtonStyles();

        // 事件监听
        floatBtn.addEventListener('click', togglePanel);
    }

    // 添加悬浮按钮样式
    function addFloatingButtonStyles() {
        const style = document.createElement('style');
        style.id = 'af-floating-styles';
        style.textContent = `
            #af-floating-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: #3498db;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                user-select: none;
                opacity: 0.2;
            }
            #af-floating-btn:hover {
                background: #2980b9;
                transform: scale(1.1);
                opacity: 0.6;
            }
            .af-language-switcher {
                display: flex;
                gap: 5px;
            }
            .af-lang-btn {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 2px 6px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            }
            .af-lang-btn.active {
                background: rgba(255,255,255,0.4);
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    // 切换面板显示/隐藏
    function togglePanel() {
        const panel = document.getElementById('auto-fill-panel');
        if (panel) {
            hidePanel();
        } else {
            createControlPanel();
        }
    }

    // 设置事件监听器
    function setupEventListeners() {
        const pageMatchBtn = document.getElementById('af-page-match-mode');
        if (pageMatchBtn) pageMatchBtn.addEventListener('click', togglePageMatchMode);

        const uniqueBtn = document.getElementById('af-unique-mode');
        if (uniqueBtn) uniqueBtn.addEventListener('click', toggleUniqueMode);
        // 添加语言切换按钮事件
        const langButtons = document.querySelectorAll('.af-lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                setLanguage(lang);
            });
        });

        // 使用更安全的方法添加事件监听器
        const startBtn = document.getElementById('af-start-recording');
        const stopBtn = document.getElementById('af-stop-recording');
        const fillBtn = document.getElementById('af-auto-fill');
        const manageBtn = document.getElementById('af-manage-rules');
        const clearBtn = document.getElementById('af-clear-rules');
        const closeBtn = document.getElementById('af-close');

        if (startBtn) startBtn.addEventListener('click', startRecording);
        if (stopBtn) stopBtn.addEventListener('click', stopRecording);
        if (fillBtn) fillBtn.addEventListener('click', autoFill);
        if (manageBtn) manageBtn.addEventListener('click', toggleRulesList);
        if (clearBtn) clearBtn.addEventListener('click', clearRules);
        if (closeBtn) closeBtn.addEventListener('click', hidePanel);

        // 添加全局键盘快捷键
        document.addEventListener('keydown', handleKeydown);
    }

    // 处理键盘快捷键
    function handleKeydown(e) {
        // Shift+R 开始/停止录制
        if (e.shiftKey && e.key === 'R') {
            e.preventDefault();
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        }

        // Shift+W 自动填写
        if (e.shiftKey && e.key === 'W') {
            e.preventDefault();
            autoFill();
        }

        // Esc 停止录制或隐藏面板
        if (e.key === 'Escape') {
            if (isRecording) {
                stopRecording();
            } else {
                hidePanel();
            }
        }
    }
    // 开始录制
    function startRecording() {
        isRecording = true;
        isSelecting = true;

        // 更新UI - 使用更安全的方法
        const startBtn = document.getElementById('af-start-recording');
        const stopBtn = document.getElementById('af-stop-recording');
        const status = document.getElementById('af-status');
        const statusText = document.getElementById('af-status-text');

        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'block';
        if (status) status.classList.add('recording');
        if (statusText) statusText.textContent = t('clickToRecord');
        showNotification(t('recordingMode'));

        // 高亮所有表单元素
        highlightFormElements();

        // 添加点击事件监听器
        document.addEventListener('click', handleElementClick, true);

        showNotification('录制模式已开启，点击要自动填写的表单元素');
    }

    // 停止录制
    function stopRecording() {
        isRecording = false;
        isSelecting = false;

        // 更新UI - 使用更安全的方法
        const startBtn = document.getElementById('af-start-recording');
        const stopBtn = document.getElementById('af-stop-recording');
        const status = document.getElementById('af-status');
        const statusText = document.getElementById('af-status-text');

        if (startBtn) startBtn.style.display = 'block';
        if (stopBtn) stopBtn.style.display = 'none';
        if (status) {
            status.classList.remove('recording');
            status.classList.remove('selecting');
        }
        if (statusText) statusText.textContent = t('recordingStopped');
        showNotification(t('recordingStopped'));

        // 移除高亮
        removeHighlights();

        // 移除事件监听器
        document.removeEventListener('click', handleElementClick, true);

        // 保存规则
        saveRules();

        // 更新规则列表
        updateRulesList();

        showNotification('录制已停止，规则已保存');
    }
    // 高亮表单元素
    function highlightFormElements() {
        const formElements = document.querySelectorAll('input, textarea, select');
        formElements.forEach(el => {
            // 检查这个元素是否已经有规则
            const selector = generateSelector(el);
            if (currentRules[selector]) {
                el.classList.add('af-recorded');
            } else {
                el.classList.add('af-highlight');
            }
        });
    }

    // 移除高亮
    function removeHighlights() {
        const formElements = document.querySelectorAll('input, textarea, select');
        formElements.forEach(el => {
            el.classList.remove('af-highlight');
            // 保留已录制元素的高亮
            if (!currentRules[generateSelector(el)]) {
                el.classList.remove('af-recorded');
            }
        });
    }

    // 处理元素点击
    function handleElementClick(e) {
        if (!isSelecting) return;

        const element = e.target;
        if (element.matches('input, textarea, select')) {
            e.preventDefault();
            e.stopPropagation();

            isSelecting = false;
            const status = document.getElementById('af-status');
            const statusText = document.getElementById('af-status-text');

            if (status) status.classList.add('selecting');
            if (statusText) statusText.textContent = t('enterValue');

            const selector = generateSelector(element);
            console.log('最终生成的选择器:', selector);
             let currentValue = currentRules[selector] || element.value || '';

            // 弹出对话框让用户输入值
            // const value = prompt(`请输入要为该元素填写的值:\n\n元素: ${selector}`, currentValue);

             // 为复选框和单选按钮提供更好的提示
            let promptMessage = `请输入要为该元素填写的值:\n\n元素: ${selector}`;

            if (element.type === 'checkbox' || element.type === 'radio') {
                promptMessage += `\n\n提示：对于复选框/单选按钮，可以输入：\n- "true" 或 "checked" 表示选中\n- "false" 表示取消选中\n- 或者输入选项的实际值`;

                // 如果当前是选中的，设置默认值为 true
                if (element.checked) {
                    currentValue = 'true';
                }
            }

        const value = prompt(promptMessage, currentValue);

            if (value !== null) {
                currentRules[selector] = value;
                element.classList.remove('af-highlight');
                element.classList.add('af-recorded');
                showNotification(`已为元素设置值: ${value}`);
            }

            isSelecting = true;
            if (status) status.classList.remove('selecting');
            if (statusText) statusText.textContent = t('clickToRecord');
        }
    }
        // 生成元素选择器
        function generateSelector(element) {
            console.log('=== 生成选择器调试 ===');
            console.log('元素信息:', {
                tagName: element.tagName,
                id: element.id,
                name: element.name,
                className: element.className,
                placeholder: element.placeholder,
                type: element.type
            });

            // 1. 首先尝试生成当前元素的选择器
            let selector = generateElementSelector(element);
            console.log('初始选择器:', selector);

             // 2. 如果开启了唯一性模式，检查选择器的唯一性
            if (uniqueMode) {
                let elements = findElementsBySelector(selector);
                console.log('初始选择器匹配元素数量:', elements.length);

                // 3. 如果选择器不唯一，尝试向上查找父元素来生成更精确的选择器
                if (elements.length > 1) {
                    console.log('选择器不唯一，尝试向上查找更精确的选择器');
                    selector = findUniqueSelector(element);
                    console.log('最终选择器:', selector);
                }
            }
            return selector;
        }

        // 生成当前元素的选择器（不过滤临时类）
        function generateElementSelector(element) {
            // 优先使用ID
            if (element.id) {
                return `#${escapeCSS(element.id)}`;
            }

            // 使用name属性
            if (element.name) {
                return `[name="${escapeCSS(element.name)}"]`;
            }

            // 检查各种可能的唯一属性（新增）
            const uniqueAttributes = ['prop', 'data-id', 'name', 'field', 'key', 'data-prop', 'v-model', 'ng-model'];
            for (const attr of uniqueAttributes) {
                if (element.hasAttribute(attr)) {
                    const attrValue = element.getAttribute(attr);
                    if (attrValue) {
                        const attrSelector = `[${attr}="${escapeCSS(attrValue)}"]`;
                        if (isSelectorUnique(attrSelector)) {
                            return attrSelector;
                        }
                    }
                }
            }

            // 使用类名和标签名
            if (element.className && typeof element.className === 'string') {
                const classes = element.className.split(' ')
                    .filter(c => c && !c.includes('af-highlight') && !c.includes('af-recorded'))
                    .join('.');
                if (classes) {
                    return `${element.tagName.toLowerCase()}.${escapeCSS(classes)}`;
                }
            }

            // 使用标签名和属性
            let selector = element.tagName.toLowerCase();
            if (element.placeholder) {
                return `${selector}[placeholder="${escapeCSS(element.placeholder)}"]`;
            }

            if (element.type) {
                return `${selector}[type="${escapeCSS(element.type)}"]`;
            }

            // 最后使用标签名
            return selector;
        }

        // 检查选择器是否唯一
        function isSelectorUnique(selector) {
            try {
                const elements = document.querySelectorAll(selector);
                return elements.length === 1;
            } catch (error) {
                console.error('选择器唯一性检查错误:', selector, error);
                return false;
            }
        }

        // 查找唯一选择器
        function findUniqueSelector(element, maxDepth = 5) {
            let currentElement = element;
            let depth = 0;

            // 首先检查元素本身是否有唯一属性
            const directSelector = generateElementSelector(element);
            if (isSelectorUnique(directSelector)) {
                return directSelector;
            }

            // 检查prop属性（单独处理）
            if (element.hasAttribute('prop')) {
                const propValue = element.getAttribute('prop');
                const propSelector = `[prop="${escapeCSS(propValue)}"]`;
                if (isSelectorUnique(propSelector)) {
                    return propSelector;
                }
            }

            // 向上查找父元素
            while (currentElement && depth < maxDepth) {
                // 尝试生成当前元素的选择器
                let selector = generateElementSelector(currentElement);

                // 如果当前元素有ID，直接返回（ID应该是唯一的）
                if (currentElement.id) {
                    return `#${escapeCSS(currentElement.id)} ${element.tagName.toLowerCase()}`;
                }

                // 检查选择器的唯一性
                let elements = findElementsBySelector(selector);
                if (elements.length === 1) {
                    // 如果当前元素选择器唯一，但我们需要定位到原始元素
                    // 添加后代选择器来定位原始元素
                    return getPathSelector(currentElement, element);
                }

                // 向上查找父元素
                currentElement = currentElement.parentElement;
                depth++;
            }

            // 如果所有尝试都失败，返回原始元素的选择器
            return generateElementSelector(element);
        }

        // 获取从父元素到子元素的路径选择器
        function getPathSelector(parentElement, targetElement) {
            let path = [];
            let current = targetElement;

            // 构建从目标元素到父元素的路径
            while (current && current !== parentElement) {
                path.unshift(generateElementSelector(current));
                current = current.parentElement;
            }

            // 添加父元素选择器
            if (parentElement) {
                path.unshift(generateElementSelector(parentElement));
            }

            return path.join(' ');
        }

        // 通过选择器查找元素
        function findElementsBySelector(selector) {
            try {
                if (selector.startsWith('//')) {
                    // XPath选择器
                    const result = document.evaluate(
                        selector,
                        document,
                        null,
                        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                        null
                    );

                    const elements = [];
                    for (let i = 0; i < result.snapshotLength; i++) {
                        elements.push(result.snapshotItem(i));
                    }
                    return elements;
                } else {
                    // CSS选择器
                    return document.querySelectorAll(selector);
                }
            } catch (error) {
                console.error('选择器查找错误:', selector, error);
                return [];
            }
        }

    // CSS转义函数
    function escapeCSS(str) {
        return str.replace(/([\\'"])/g, '\\$1');
    }
    // 生成XPath
    function getXPath(element) {
        if (element.id) return `//*[@id="${element.id}"]`;
        if (element === document.body) return '/html/body';

        let ix = 0;
        const siblings = element.parentNode.childNodes;

        for (let i = 0; i < siblings.length; i++) {
            const sibling = siblings[i];
            if (sibling === element) {
                return `${getXPath(element.parentNode)}/${element.tagName}[${ix + 1}]`;
            }
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                ix++;
            }
        }
    }

    // 保存规则
    function saveRules() {
        const pageUrl = getPageIdentifier();
        const allRules = JSON.parse(GM_getValue('autoFillRules', '{}'));

        allRules[pageUrl] = currentRules;
        GM_setValue('autoFillRules', JSON.stringify(allRules));
    }

    // 获取页面标识符
    function getPageIdentifier() {
     //   return window.location.hostname + window.location.pathname;
          const url = window.location.href;
        if (pageMatchMode === 'loose') {
            // 宽松模式：提取页面特征，忽略变化的部分
            return extractPageSignature(url);
        } else {
            // 严格模式：使用完整URL
            return url;
        }
    }

    // 提取页面特征签名
    function extractPageSignature(url) {
        try {
            const urlObj = new URL(url);
            let signature = urlObj.hostname + urlObj.pathname;

            // 移除路径中的UUID和长数字ID
            signature = signature.replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\//gi, '/*/');
            signature = signature.replace(/\/\d{8,}\//g, '/*/');

            // 移除查询参数中的特定键值对（可选）
            // 可以根据需要添加更多规则

            console.log('页面特征签名:', signature);
            return signature;
        } catch (error) {
            console.error('提取页面特征失败，使用完整URL:', error);
            return url;
        }
    }

    // 加载当前页面的规则
    function loadRulesForPage() {
        const pageUrl = getPageIdentifier();
        const allRules = JSON.parse(GM_getValue('autoFillRules', '{}'));
        currentRules = allRules[pageUrl] || {};

        // 高亮已录制的元素
        highlightRecordedElements();
    }
    // 高亮已录制的元素
    function highlightRecordedElements() {
        Object.keys(currentRules).forEach(selector => {
            try {
                let elements;

                if (selector.startsWith('//')) {
                    // XPath选择器
                    const result = document.evaluate(
                        selector,
                        document,
                        null,
                        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                        null
                    );

                    for (let i = 0; i < result.snapshotLength; i++) {
                        const element = result.snapshotItem(i);
                        if (element) element.classList.add('af-recorded');
                    }
                } else {
                    // CSS选择器
                    elements = document.querySelectorAll(selector);
                    elements.forEach(el => el.classList.add('af-recorded'));
                }
            } catch (error) {
                console.warn(`无法高亮元素: ${selector}`, error);
            }
        });
    }

    // 自动填写
    function autoFill() {
        let filledCount = 0;
        const pageUrl = getPageIdentifier();
        const allRules = JSON.parse(GM_getValue('autoFillRules', '{}'));
        const rules = allRules[pageUrl] || {};
        // 调试：打印当前页面的规则
        console.log('=== 自动填写调试信息 ===');
        console.log('当前页面URL:', pageUrl);
        console.log('所有规则:', allRules);
        console.log('当前页面规则:', rules);
        console.log('规则数量:', Object.keys(rules).length);

        if (Object.keys(rules).length === 0) {
            showNotification(t('noRulesWarning'), 'warning');
            return;
        }

        Object.keys(rules).forEach(selector => {
            console.log('处理选择器:', selector);

            try {
                let elements = findElementsBySelector(selector);
                console.log('找到元素数量:', elements.length);

                if (elements.length === 0) {
                    console.warn('没有找到匹配的元素，选择器可能已失效:', selector);
                    return; // 跳过这个选择器
                }

                if (elements.length > 1) {
                    console.warn('找到多个匹配元素，可能填写错误:', selector);
                }

                // 为所有匹配的元素填写值
                elements.forEach(element => {
                    const value = rules[selector];

                    if (element.tagName === 'SELECT') {
                        // 处理下拉框
                        let optionFound = false;
                        Array.from(element.options).some(option => {
                            if (option.text === value || option.value === value) {
                                option.selected = true;
                                optionFound = true;
                                element.dispatchEvent(new Event('change', { bubbles: true }));
                                return true;
                            }
                            return false;
                        });

                        if (optionFound) filledCount++;
                    } else if (element.type === 'checkbox') {
                    // 改进的复选框处理逻辑
                    const checkboxValue = element.value.toLowerCase();
                    const targetValue = value.toLowerCase();

                    // 多种匹配方式
                    const shouldCheck =
                        targetValue === 'true' ||
                        targetValue === 'checked' ||
                        targetValue === '1' ||
                        targetValue === 'on' ||
                        targetValue === checkboxValue ||
                        (element.nextElementSibling &&
                         element.nextElementSibling.textContent &&
                         element.nextElementSibling.textContent.toLowerCase().includes(targetValue));

                    element.checked = shouldCheck;
                    if (shouldCheck) {
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                        filledCount++;
                    }
                } else if (element.type === 'radio') {
                    // 改进的单选按钮处理逻辑
                    const radioValue = element.value.toLowerCase();
                    const targetValue = value.toLowerCase();

                    // 多种匹配方式
                    const shouldSelect =
                        targetValue === 'true' ||
                        targetValue === 'checked' ||
                        targetValue === '1' ||
                        targetValue === 'on' ||
                        targetValue === radioValue ||
                        (element.nextElementSibling &&
                         element.nextElementSibling.textContent &&
                         element.nextElementSibling.textContent.toLowerCase().includes(targetValue));

                    if (shouldSelect) {
                        element.checked = true;
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                        filledCount++;
                    }
                } else {
                        // 处理输入框和文本域
                        element.value = value;
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                        filledCount++;
                    }
                });
            } catch (error) {
                console.error(`自动填写失败 - 选择器: ${selector}`, error);
            }
        });

        if (filledCount > 0) {
            showNotification(t('fillSuccess', { count: filledCount }), 'success');
        } else {
            showNotification(t('fillWarning'), 'warning');
        }
    }
    // 切换规则列表显示
    function toggleRulesList() {
        const rulesList = document.getElementById('af-rules-list');
        const manageBtn = document.getElementById('af-manage-rules');

        if (rulesList && manageBtn) {
            if (rulesList.style.display === 'none') {
                rulesList.style.display = 'block';
                manageBtn.textContent = '隐藏规则';
            } else {
                rulesList.style.display = 'none';
                manageBtn.textContent = '管理规则';
            }
        }
    }

    // 更新规则列表
    function updateRulesList() {
        const container = document.getElementById('af-rules-container');
        if (!container) return;

        container.innerHTML = '';

        if (Object.keys(currentRules).length === 0) {
            const li = document.createElement('li');
            li.textContent = t('noRules');
            li.style.color = '#999';
            li.style.fontStyle = 'italic';
            container.appendChild(li);
            return;
        }

        Object.keys(currentRules).forEach(selector => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="af-rule-selector" title="${selector}">${truncateText(selector, 30)}</span>
                <span class="af-rule-value" title="${currentRules[selector]}">${truncateText(currentRules[selector], 20)}</span>
            `;
            container.appendChild(li);
        });
    }

    // 清除当前页面的规则
    function clearRules() {
        if (!confirm(t('clearConfirm'))) {
            return;
        }

        const pageUrl = getPageIdentifier();
        const allRules = JSON.parse(GM_getValue('autoFillRules', '{}'));

        delete allRules[pageUrl];
        GM_setValue('autoFillRules', JSON.stringify(allRules));

        currentRules = {};
        removeHighlights();
        updateRulesList();

        showNotification(t('clearedSuccess'), 'success');
    }
    // 截断文本
    function truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        // 移除现有通知
        const existingNotification = document.getElementById('af-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'af-notification';
        notification.textContent = message;

        // 根据类型设置样式
        let bgColor = '#3498db';
        if (type === 'success') bgColor = '#2ecc71';
        if (type === 'warning') bgColor = '#f39c12';
        if (type === 'error') bgColor = '#e74c3c';

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            font-size: 14px;
            transition: opacity 0.3s;
            max-width: 80%;
            text-align: center;
        `;

        document.body.appendChild(notification);

        // 3秒后自动消失
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    // 隐藏面板
    function hidePanel() {
        const panel = document.getElementById('auto-fill-panel');
        if (panel) {
            panel.remove();
        }

        // 移除所有高亮
        removeHighlights();

        // 如果正在录制，停止录制
        if (isRecording) {
            stopRecording();
        }
    }

    // 注册菜单命令
    function registerMenuCommands() {
        // 清理之前的菜单命令
        menuCommands.forEach(cmd => {
            try {
                GM_unregisterMenuCommand(cmd);
            } catch (e) {
                // 忽略取消注册错误
            }
        });
        menuCommands = [];

        // 注册新命令
        try {
            menuCommands.push(GM_registerMenuCommand('显示自动填写面板', createControlPanel));
            menuCommands.push(GM_registerMenuCommand('开始录制规则', startRecording));
            menuCommands.push(GM_registerMenuCommand('自动填写表单', autoFill));
        } catch (e) {
            console.warn('注册菜单命令失败:', e);
        }
    }

    // 初始化
    function init() {
        // 注册菜单命令
        registerMenuCommands();

        // 总是创建悬浮按钮
        createFloatingButton();

        loadUniqueMode();
        loadPageMatchMode();

        // 对于表单密集的页面，自动显示面板
        const formCount = document.querySelectorAll('form, input, textarea, select').length;
        if (formCount > 2) {
            setTimeout(createControlPanel, 1000);
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();