// ==UserScript==
// @name         LLM-Chat-Collapser-Sidebar
// @name:zh-CN   LLM 聊天折叠器 + 问题侧栏
// @namespace    https://github.com/CaO_U_May/llm-chat-collapser
// @version      0.91
// @description  Make Gemini/ChatGPT code blocks and long user messages collapsible, and provide question boxes for clicking to jump to relevant sections.
// @description:zh-CN  让 Gemini / ChatGPT 的代码块和长用户消息可折叠，提供问题框以供点击跳转，并在流式输出结束后自动折叠长代码。
// @author       miniyu157 (original) , CaO_U_May (fork & modifications)
// @license      MIT
// @homepageURL  https://github.com/CaOUMay/LLM-Chat-Collapser-Sidebar
// @match        https://gemini.google.com/*
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557767/LLM-Chat-Collapser-Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/557767/LLM-Chat-Collapser-Sidebar.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== 默认配置 =====
    const DEFAULT_MIN_CODE_LINES = 10;          // 代码超过多少行折叠
    const DEFAULT_USER_TEXT_LINES = 3;          // 用户消息超过多少行折叠
    const DEFAULT_QUESTION_PREVIEW_CHARS = 50;  // 默认宽度下的问题预览字数
    const USER_SINGLE_LINE_MAX_LENGTH = 200;    // 单行太长也折叠

    const DEFAULT_QUESTION_LIST_WIDTH = 260;    // 问题侧栏默认宽度
    const DEFAULT_QUESTION_LIST_HEIGHT = 260;   // 默认高度（px）

    const DEFAULT_QUESTION_THEME = 'dark';      // 主题：light / dark / black

    const processAttribute = 'data-ucc-processed';

    // 针对 ChatGPT <pre> 的延时处理 map（防抖）
    const pendingPreTimers = new WeakMap();

    // 记录每个 <pre> 的流式检查状态（限频 + 只提前折叠一次）
    const preStreamState = new WeakMap();

    // 重建问题列表的防抖定时器
    let rebuildTimer = null;

    // ===== GM 简单封装 =====
    function gmGet(key, defaultValue) {
        try {
            if (typeof GM_getValue === 'function') {
                return GM_getValue(key, defaultValue);
            }
        } catch (e) {
            console.warn('[LLM Collapser] GM_getValue error', e);
        }
        return defaultValue;
    }

    function gmSet(key, value) {
        try {
            if (typeof GM_setValue === 'function') {
                GM_setValue(key, value);
            }
        } catch (e) {
            console.warn('[LLM Collapser] GM_setValue error', e);
        }
    }

    // ===== 当前配置（可被 UI 修改） =====
    let MIN_CODE_LINES         = Number(gmGet('ucc_minCodeLines', DEFAULT_MIN_CODE_LINES)) || DEFAULT_MIN_CODE_LINES;
    let USER_TEXT_MAX_LINES    = Number(gmGet('ucc_userTextMaxLines', DEFAULT_USER_TEXT_LINES)) || DEFAULT_USER_TEXT_LINES;
    let QUESTION_PREVIEW_CHARS = Number(gmGet('ucc_questionPreviewChars', DEFAULT_QUESTION_PREVIEW_CHARS)) || DEFAULT_QUESTION_PREVIEW_CHARS;
    let QUESTION_THEME         = (gmGet('ucc_questionTheme', DEFAULT_QUESTION_THEME) || DEFAULT_QUESTION_THEME).toString();

    let questionListWidth  = Number(gmGet('ucc_questionWidth', DEFAULT_QUESTION_LIST_WIDTH)) || DEFAULT_QUESTION_LIST_WIDTH;
    let questionListHeight = Number(gmGet('ucc_questionHeight', 0)) || 0;  // 0 = 自动高度

    let collapsedRaw = gmGet('ucc_questionCollapsed', 0);
    let questionListCollapsed =
        collapsedRaw === true || collapsedRaw === 'true' || collapsedRaw === 1 || collapsedRaw === '1';

    // 位置记忆：left/top
    let questionListLeft = Number(gmGet('ucc_questionLeft', NaN));
    let questionListTop  = Number(gmGet('ucc_questionTop', NaN));

    // ===== 问题侧栏 DOM 状态 =====
    let questionListContainer = null;
    let questionListBody      = null;
    let questionToggleButton  = null;
    let questionCounter       = 0;

    let resizeState = null;
    let dragState   = null;

    // 用 URL 表示当前对话 key
    function getConversationKey() {
        return window.location.pathname + window.location.search;
    }
    let lastConversationKey = getConversationKey();

    // ===== 工具函数 =====
    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    // ===== 样式 =====
    GM_addStyle(`
    .ucc-collapsible-header {
        cursor: pointer;
        position: relative;
    }
    .ucc-arrow-indicator::before {
        content: '▶';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 10px;
        color: var(--mat-sys-color-on-surface-variant, #888);
        transition: transform 0.2s ease-in-out;
    }
    .ucc-header-expanded::before {
        transform: translateY(-50%) rotate(90deg);
    }
    .gemini-header-padding {
        padding-left: 32px !important;
    }
    .gemini-arrow-pos::before {
        left: 12px;
    }
    .chatgpt-header-padding {
        padding-left: 24px !important;
    }
    .chatgpt-arrow-pos::before {
        left: 8px;
    }
    .ucc-user-text-clamp {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }

    /* 设置按钮 & 面板 */
    #ucc-settings-button {
        position: fixed;
        right: 16px;
        bottom: 16px;
        width: 32px;
        height: 32px;
        border-radius: 9999px;
        border: none;
        background: rgba(15, 23, 42, 0.85);
        color: #fff;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        cursor: pointer;
        z-index: 2147483647;
        padding: 0;
    }
    #ucc-settings-button:hover {
        background: rgba(30, 64, 175, 0.95);
    }

    #ucc-settings-panel {
        position: fixed;
        right: 16px;
        bottom: 56px;
        min-width: 260px;
        max-width: 320px;
        background: rgba(15, 23, 42, 0.97);
        color: #e5e7eb;
        border-radius: 10px;
        padding: 10px 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.35);
        z-index: 2147483647;
        font-size: 12px;
        line-height: 1.4;
        display: none;
        box-sizing: border-box;
    }
    #ucc-settings-panel h3 {
        margin: 0 0 6px 0;
        font-size: 13px;
        font-weight: 600;
    }
    #ucc-settings-panel .ucc-settings-row {
        margin-bottom: 8px;
    }
    #ucc-settings-panel label {
        display: flex;
        align-items: center;
        gap: 4px;
        justify-content: space-between;
    }
    #ucc-settings-panel .ucc-input-wrap {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    #ucc-settings-panel input[type="number"],
    #ucc-settings-panel select {
        width: 90px;
        padding: 2px 4px;
        border-radius: 4px;
        border: 1px solid #4b5563;
        background: #020617;
        color: #e5e7eb;
        font-size: 12px;
    }
    #ucc-settings-panel input[type="number"]:focus,
    #ucc-settings-panel select:focus {
        outline: none;
        border-color: #60a5fa;
        box-shadow: 0 0 0 1px rgba(96,165,250,0.5);
    }
    #ucc-settings-panel .ucc-settings-footer {
        display: flex;
        justify-content: flex-end;
        gap: 6px;
        margin-top: 6px;
    }
    #ucc-settings-panel button {
        border-radius: 4px;
        border: none;
        padding: 4px 8px;
        font-size: 12px;
        cursor: pointer;
    }
    #ucc-settings-save {
        background: #2563eb;
        color: #fff;
    }
    #ucc-settings-save:hover {
        background: #1d4ed8;
    }
    #ucc-settings-cancel {
        background: #374151;
        color: #e5e7eb;
    }
    #ucc-settings-cancel:hover {
        background: #4b5563;
    }
    #ucc-settings-note {
        margin-top: 4px;
        font-size: 11px;
        color: #9ca3af;
    }

    /* 问题列表侧栏：使用 CSS 变量控制主题 */
    #ucc-question-list {
        position: fixed;
        right: 16px;
        top: 80px;
        width: ${DEFAULT_QUESTION_LIST_WIDTH}px;
        max-height: 60vh;
        border-radius: 12px;
        padding: 10px 12px 16px 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.35);
        z-index: 2147483647;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        box-sizing: border-box;

        background: var(--ucc-bg, rgba(15,23,42,0.97));
        color: var(--ucc-text, #e5e7eb);

        cursor: default;
    }
    #ucc-question-list-header {
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        cursor: move; /* 标题区域用来拖动 */
    }
    #ucc-question-body {
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
        min-height: 40px;
    }
    .ucc-question-item {
        width: 100%;
        text-align: left;
        border-radius: 8px;
        border: none;
        padding: 6px 8px;
        cursor: pointer;
        font-size: 12px;
        line-height: 1.4;
        box-sizing: border-box;

        background: var(--ucc-item-bg, #e5e7eb);
        color: var(--ucc-item-text, #111827);
    }
    .ucc-question-item:hover {
        background: var(--ucc-item-bg-hover, #d1d5db);
    }
    .ucc-question-empty {
        font-size: 11px;
        color: #9ca3af;
    }
    .ucc-question-highlight {
        outline: 2px solid #f97316;
        outline-offset: 4px;
        transition: outline-color 0.5s ease;
    }

    #ucc-question-toggle {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 12px;
        padding: 0 4px;
        color: var(--ucc-toggle-color, #9ca3af);
    }
    #ucc-question-toggle:hover {
        color: var(--ucc-toggle-hover-color, #e5e7eb);
    }

    /* 折叠态：只保留标题栏 */
    #ucc-question-list.ucc-question-list-collapsed {
        height: auto !important;
        max-height: none;
        padding-bottom: 10px;
    }
    #ucc-question-list.ucc-question-list-collapsed #ucc-question-body {
        display: none;
    }
    #ucc-question-list.ucc-question-list-collapsed #ucc-question-resize-handle-left,
    #ucc-question-list.ucc-question-list-collapsed #ucc-question-resize-handle-right {
        display: none;
    }

    /* 左下角缩放把手：向左下拖 => 左边界向左，右边界不变 */
    #ucc-question-resize-handle-left {
        position: absolute;
        left: 6px;
        bottom: 4px;
        width: 14px;
        height: 14px;
        cursor: nwse-resize;
        border-left: 2px solid var(--ucc-resize-color, #6b7280);
        border-bottom: 2px solid var(--ucc-resize-color, #6b7280);
        opacity: 0.8;
    }
    #ucc-question-resize-handle-left:hover {
        opacity: 1;
    }

    /* 右下角缩放把手：向右下拖 => 右边界向右，左边界不变 */
    #ucc-question-resize-handle-right {
        position: absolute;
        right: 6px;
        bottom: 4px;
        width: 14px;
        height: 14px;
        cursor: nesw-resize;
        border-right: 2px solid var(--ucc-resize-color, #6b7280);
        border-bottom: 2px solid var(--ucc-resize-color, #6b7280);
        opacity: 0.8;
    }
    #ucc-question-resize-handle-right:hover {
        opacity: 1;
    }

    /* 主题：深色 */
    #ucc-question-list.ucc-qtheme-dark {
        --ucc-bg: rgba(15,23,42,0.97);
        --ucc-text: #e5e7eb;
        --ucc-item-bg: #e5e7eb;
        --ucc-item-text: #111827;
        --ucc-item-bg-hover: #d1d5db;
        --ucc-toggle-color: #9ca3af;
        --ucc-toggle-hover-color: #e5e7eb;
        --ucc-resize-color: #6b7280;
    }

    /* 主题：亮色 */
    #ucc-question-list.ucc-qtheme-light {
        --ucc-bg: rgba(249,250,251,0.97);
        --ucc-text: #111827;
        --ucc-item-bg: #f3f4f6;
        --ucc-item-text: #111827;
        --ucc-item-bg-hover: #e5e7eb;
        --ucc-toggle-color: #6b7280;
        --ucc-toggle-hover-color: #111827;
        --ucc-resize-color: #9ca3af;
    }

    /* 主题：黑色 */
    #ucc-question-list.ucc-qtheme-black {
        --ucc-bg: rgba(0,0,0,0.97);
        --ucc-text: #f9fafb;
        --ucc-item-bg: #111827;
        --ucc-item-text: #f9fafb;
        --ucc-item-bg-hover: #1f2937;
        --ucc-toggle-color: #9ca3af;
        --ucc-toggle-hover-color: #f9fafb;
        --ucc-resize-color: #6b7280;
    }
    `);

    // ===== 预览字数：根据宽度缩放 =====
    function getEffectivePreviewLimit() {
        let width = questionListWidth || DEFAULT_QUESTION_LIST_WIDTH;
        if (questionListContainer) {
            const rect = questionListContainer.getBoundingClientRect();
            if (rect.width > 0) width = rect.width;
        }
        const ratio = width / DEFAULT_QUESTION_LIST_WIDTH;
        const raw = QUESTION_PREVIEW_CHARS * ratio;
        return Math.max(10, Math.round(raw));
    }

    function updateAllQuestionItemPreviews() {
        if (!questionListBody) return;
        const limit = getEffectivePreviewLimit();
        const items = questionListBody.querySelectorAll('.ucc-question-item');
        items.forEach((item) => {
            const full = item.dataset.uccFullText || '';
            if (!full) return;
            const index = item.dataset.uccIndex || '';
            const label = index ? index + '. ' : '';
            const shortened = full.length > limit ? full.slice(0, limit) + '…' : full;
            item.textContent = label + shortened;
        });
    }

    // ===== 主题应用 =====
    function applyQuestionTheme(theme) {
        if (!questionListContainer) return;
        const themes = ['light', 'dark', 'black'];
        if (!themes.includes(theme)) {
            theme = DEFAULT_QUESTION_THEME;
        }
        themes.forEach((t) => {
            questionListContainer.classList.remove('ucc-qtheme-' + t);
        });
        questionListContainer.classList.add('ucc-qtheme-' + theme);
    }

    // ===== 设置 UI =====
    function createSettingsUI() {
        if (document.getElementById('ucc-settings-button')) return;

        const btn = document.createElement('button');
        btn.id = 'ucc-settings-button';
        btn.title = 'LLM Chat Collapser 设置';
        btn.textContent = '⚙';

        const panel = document.createElement('div');
        panel.id = 'ucc-settings-panel';
        panel.innerHTML = `
            <h3>LLM Chat Collapser 设置</h3>
            <div class="ucc-settings-row">
                <label>
                    <span>代码超过</span>
                    <span class="ucc-input-wrap">
                        <input type="number" id="ucc-input-code-lines" min="1" />
                        <span>行折叠</span>
                    </span>
                </label>
            </div>
            <div class="ucc-settings-row">
                <label>
                    <span>用户消息超过</span>
                    <span class="ucc-input-wrap">
                        <input type="number" id="ucc-input-user-lines" min="1" />
                        <span>行折叠</span>
                    </span>
                </label>
            </div>
            <div class="ucc-settings-row">
                <label>
                    <span>问题预览基础字数</span>
                    <span class="ucc-input-wrap">
                        <input type="number" id="ucc-input-preview-chars" min="5" />
                        <span>字</span>
                    </span>
                </label>
            </div>
            <div class="ucc-settings-row">
                <label>
                    <span>问题框主题</span>
                    <span class="ucc-input-wrap">
                        <select id="ucc-input-theme">
                            <option value="dark">深色</option>
                            <option value="light">亮色</option>
                            <option value="black">黑色</option>
                        </select>
                    </span>
                </label>
            </div>
            <div id="ucc-settings-note">
                保存后，新内容和问题列表预览将使用新的配置；主题会立即生效。
            </div>
            <div class="ucc-settings-footer">
                <button id="ucc-settings-cancel">关闭</button>
                <button id="ucc-settings-save">保存</button>
            </div>
        `;

        document.body.appendChild(btn);
        document.body.appendChild(panel);

        const inputCode    = panel.querySelector('#ucc-input-code-lines');
        const inputUser    = panel.querySelector('#ucc-input-user-lines');
        const inputPreview = panel.querySelector('#ucc-input-preview-chars');
        const inputTheme   = panel.querySelector('#ucc-input-theme');
        const saveBtn      = panel.querySelector('#ucc-settings-save');
        const cancelBtn    = panel.querySelector('#ucc-settings-cancel');

        function openPanel() {
            inputCode.value    = MIN_CODE_LINES;
            inputUser.value    = USER_TEXT_MAX_LINES;
            inputPreview.value = QUESTION_PREVIEW_CHARS;
            inputTheme.value   = QUESTION_THEME;
            panel.style.display = 'block';
        }

        function closePanel() {
            panel.style.display = 'none';
        }

        btn.addEventListener('click', () => {
            if (panel.style.display === 'block') {
                closePanel();
            } else {
                openPanel();
            }
        });

        cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closePanel();
        });

        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const codeLines    = parseInt(inputCode.value, 10);
            const userLines    = parseInt(inputUser.value, 10);
            const previewChars = parseInt(inputPreview.value, 10);
            let theme          = inputTheme.value;

            if (!Number.isFinite(codeLines) || codeLines <= 0) {
                alert('代码折叠行数必须是大于 0 的数字');
                return;
            }
            if (!Number.isFinite(userLines) || userLines <= 0) {
                alert('用户消息折叠行数必须是大于 0 的数字');
                return;
            }
            if (!Number.isFinite(previewChars) || previewChars < 5) {
                alert('预览字数上限必须是 ≥ 5 的数字');
                return;
            }
            if (!['light', 'dark', 'black'].includes(theme)) {
                theme = DEFAULT_QUESTION_THEME;
            }

            MIN_CODE_LINES         = codeLines;
            USER_TEXT_MAX_LINES    = userLines;
            QUESTION_PREVIEW_CHARS = previewChars;
            QUESTION_THEME         = theme;

            gmSet('ucc_minCodeLines', MIN_CODE_LINES);
            gmSet('ucc_userTextMaxLines', USER_TEXT_MAX_LINES);
            gmSet('ucc_questionPreviewChars', QUESTION_PREVIEW_CHARS);
            gmSet('ucc_questionTheme', QUESTION_THEME);

            applyQuestionTheme(QUESTION_THEME);
            updateAllQuestionItemPreviews();
            alert('设置已保存。新的内容将按新的配置折叠 / 预览。');
            closePanel();
        });

        // 点击面板外关闭
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== btn) {
                closePanel();
            }
        }, true);
    }

    // ===== 问题侧栏：折叠 / 缩放 / 拖动 =====
    function setQuestionListCollapsed(collapsed) {
        questionListCollapsed = collapsed;
        if (questionListContainer) {
            if (collapsed) {
                questionListContainer.classList.add('ucc-question-list-collapsed');
            } else {
                questionListContainer.classList.remove('ucc-question-list-collapsed');
            }
        }
        if (questionToggleButton) {
            questionToggleButton.textContent = collapsed ? '+' : '–';
            questionToggleButton.title = collapsed ? '展开问题列表' : '折叠问题列表';
        }
        gmSet('ucc_questionCollapsed', collapsed ? 1 : 0);
    }

    function ensureQuestionListUI() {
        if (questionListContainer) return;

        const container = document.createElement('div');
        container.id = 'ucc-question-list';
        container.innerHTML = `
            <div id="ucc-question-list-header">
                <span>问题列表</span>
                <button id="ucc-question-toggle" type="button" title="折叠问题列表">–</button>
            </div>
            <div id="ucc-question-body">
                <div class="ucc-question-empty">还没有问题哦~</div>
            </div>
            <div id="ucc-question-resize-handle-left"></div>
            <div id="ucc-question-resize-handle-right"></div>
        `;
        document.body.appendChild(container);

        questionListContainer = container;
        questionListBody      = container.querySelector('#ucc-question-body');
        questionToggleButton  = container.querySelector('#ucc-question-toggle');

        // 位置 & 尺寸恢复
        if (!isNaN(questionListLeft) && !isNaN(questionListTop)) {
            container.style.left = questionListLeft + 'px';
            container.style.top  = questionListTop + 'px';
            container.style.right = 'auto';
        } else {
            // 默认靠右上方
            container.style.right = '16px';
            container.style.top   = '80px';
        }

        if (questionListWidth > 0)  container.style.width  = questionListWidth + 'px';
        if (questionListHeight > 0) container.style.height = questionListHeight + 'px';

        // 应用主题 & 折叠状态
        applyQuestionTheme(QUESTION_THEME);
        setQuestionListCollapsed(questionListCollapsed);

        if (questionToggleButton) {
            questionToggleButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const newCollapsed = !questionListCollapsed;
                setQuestionListCollapsed(newCollapsed);
            });
        }

        setupQuestionResize(container);
        setupQuestionDrag(container);
        updateAllQuestionItemPreviews();
    }

    // ===== 每次重建问题列表 =====
    function rebuildQuestionList() {
        ensureQuestionListUI();
        if (!questionListBody) return;

        const oldScrollTop = questionListBody.scrollTop;

        questionListBody.innerHTML = '';
        questionCounter = 0;

        const userMessages = document.querySelectorAll('div[data-message-author-role="user"]');
        const limit = getEffectivePreviewLimit();

        userMessages.forEach((element) => {
            const textNode = element.querySelector('.whitespace-pre-wrap');
            if (!textNode) return;

            const fullText = textNode.textContent.trim();
            if (!fullText) return;

            questionCounter += 1;
            const index = questionCounter;
            const id = 'ucc-question-' + index;

            element.dataset.uccQuestionId    = id;
            element.dataset.uccQuestionIndex = String(index);

            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'ucc-question-item';
            item.dataset.uccTargetId = id;
            item.dataset.uccFullText = fullText;
            item.dataset.uccIndex    = String(index);

            const shortened = fullText.length > limit ? fullText.slice(0, limit) + '…' : fullText;
            item.textContent = index + '. ' + shortened;

            item.addEventListener('click', () => {
                const target = document.querySelector('[data-ucc-question-id="' + id + '"]');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    target.classList.add('ucc-question-highlight');
                    setTimeout(() => {
                        target.classList.remove('ucc-question-highlight');
                    }, 1200);
                }
            });

            questionListBody.appendChild(item);
        });

        if (questionCounter === 0) {
            const empty = document.createElement('div');
            empty.className = 'ucc-question-empty';
            empty.textContent = '还没有问题哦~';
            questionListBody.appendChild(empty);
        }

        // 尽量保持原来的滚动位置
        questionListBody.scrollTop = oldScrollTop;
    }

    function scheduleRebuildQuestions() {
        if (rebuildTimer) clearTimeout(rebuildTimer);
        rebuildTimer = setTimeout(() => {
            rebuildTimer = null;
            rebuildQuestionList();
        }, 200);
    }

    // ===== 问题侧栏：缩放（左下 / 右下） =====
    function setupQuestionResize(container) {
        const handleLeft  = container.querySelector('#ucc-question-resize-handle-left');
        const handleRight = container.querySelector('#ucc-question-resize-handle-right');
        if (!handleLeft && !handleRight) return;

        function onMouseDown(e, type) {
            e.preventDefault();
            e.stopPropagation();
            const rect = container.getBoundingClientRect();
            resizeState = {
                type,
                startX: e.clientX,
                startY: e.clientY,
                startWidth: rect.width,
                startHeight: rect.height,
                startLeft: rect.left,
                startTop: rect.top
            };
            document.addEventListener('mousemove', onResizeMove);
            document.addEventListener('mouseup', onResizeEnd);
        }

        if (handleLeft) {
            handleLeft.addEventListener('mousedown', (e) => onMouseDown(e, 'left'));
        }
        if (handleRight) {
            handleRight.addEventListener('mousedown', (e) => onMouseDown(e, 'right'));
        }
    }

    function onResizeMove(e) {
        if (!resizeState || !questionListContainer) return;

        const minWidth  = 180;
        const maxWidthFixed  = 420;
        const minHeight = 100;

        const startLeft = resizeState.startLeft;
        const startTop  = resizeState.startTop;
        const startWidth  = resizeState.startWidth;
        const startHeight = resizeState.startHeight;

        const viewportWidth  = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const margin = 16;

        let newWidth  = startWidth;
        let newHeight = startHeight;
        let newLeft   = startLeft;
        const type    = resizeState.type;

        // 垂直方向：向下拖动 => 高度变大，顶部不动
        const dy = e.clientY - resizeState.startY;
        const maxHeight = viewportHeight - startTop - margin;
        newHeight = clamp(startHeight + dy, minHeight, maxHeight);

        if (type === 'left') {
            // 左下角：向左拖 => 左边界往左，右边界不变
            const dx = e.clientX - resizeState.startX; // 向左拖 => dx < 0
            let deltaWidth = -dx;
            if (deltaWidth < 0) deltaWidth = 0;

            const right = startLeft + startWidth;
            let candidateWidth = startWidth + deltaWidth;

            const maxWidthGeom = right;
            const maxWidth = Math.min(maxWidthFixed, maxWidthGeom);

            newWidth = clamp(candidateWidth, minWidth, maxWidth);
            newLeft  = right - newWidth;
        } else if (type === 'right') {
            // 右下角：向右拖 => 右边界往右，左边界不动
            const dx = e.clientX - resizeState.startX; // 向右拖 => dx > 0
            let candidateWidth = startWidth + dx;

            const maxWidthGeom = viewportWidth - startLeft - margin;
            const maxWidth = Math.min(maxWidthFixed, maxWidthGeom);

            newWidth = clamp(candidateWidth, minWidth, maxWidth);
            newLeft  = startLeft;
        }

        questionListContainer.style.width  = newWidth + 'px';
        questionListContainer.style.height = newHeight + 'px';
        questionListContainer.style.left   = newLeft + 'px';
        questionListContainer.style.right  = 'auto';

        questionListWidth  = newWidth;
        questionListHeight = newHeight;
        questionListLeft   = newLeft;
        questionListTop    = startTop;

        updateAllQuestionItemPreviews();
    }

    function onResizeEnd() {
        if (resizeState) {
            gmSet('ucc_questionWidth',  questionListWidth);
            gmSet('ucc_questionHeight', questionListHeight);
            gmSet('ucc_questionLeft',   questionListLeft);
            gmSet('ucc_questionTop',    questionListTop);
        }
        resizeState = null;
        document.removeEventListener('mousemove', onResizeMove);
        document.removeEventListener('mouseup', onResizeEnd);
    }

    // ===== 问题侧栏：拖动整个窗口（通过标题栏） =====
    function setupQuestionDrag(container) {
        const header = container.querySelector('#ucc-question-list-header');
        if (!header) return;

        header.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();
            const rect = container.getBoundingClientRect();
            dragState = {
                startX: e.clientX,
                startY: e.clientY,
                startLeft: rect.left,
                startTop: rect.top
            };
            document.addEventListener('mousemove', onDragMove);
            document.addEventListener('mouseup', onDragEnd);
        });
    }

    function onDragMove(e) {
        if (!dragState || !questionListContainer) return;
        const dx = e.clientX - dragState.startX;
        const dy = e.clientY - dragState.startY;

        const viewportWidth  = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const rect = questionListContainer.getBoundingClientRect();

        let newLeft = dragState.startLeft + dx;
        let newTop  = dragState.startTop + dy;

        const margin = 8;
        const maxLeft = viewportWidth - rect.width - margin;
        const maxTop  = viewportHeight - rect.height - margin;

        newLeft = clamp(newLeft, margin, maxLeft);
        newTop  = clamp(newTop, margin, maxTop);

        questionListContainer.style.left = newLeft + 'px';
        questionListContainer.style.top  = newTop + 'px';
        questionListContainer.style.right = 'auto';

        questionListLeft = newLeft;
        questionListTop  = newTop;
    }

    function onDragEnd() {
        if (dragState) {
            gmSet('ucc_questionLeft', questionListLeft);
            gmSet('ucc_questionTop',  questionListTop);
        }
        dragState = null;
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
    }

    // ===== 折叠逻辑（代码 / 文本） =====
    function applyDisplayCollapse(header, content, startCollapsed) {
        header.classList.add('ucc-collapsible-header', 'ucc-arrow-indicator');

        if (startCollapsed) {
            content.style.display = 'none';
        } else {
            content.style.display = '';
            header.classList.add('ucc-header-expanded');
        }

        header.addEventListener('click', (event) => {
            if (event.target.closest('button, a')) return;
            if (window.getSelection().toString().length > 0) return;

            const wasCollapsed = content.style.display === 'none';

            if (wasCollapsed) {
                // 展开
                content.style.display = '';
                header.classList.add('ucc-header-expanded');
            } else {
                // 折叠
                content.style.display = 'none';
                header.classList.remove('ucc-header-expanded');
            }

            // 记录用户偏好（只对 ChatGPT 的 <pre> 有意义）
            const pre = header.closest('pre');
            if (pre) {
                const expandedAfter = content.style.display !== 'none';
                pre.dataset.uccUserPref = expandedAfter ? 'open' : 'closed';
            }
        });
    }

    function applyLineClampCollapse(header, content) {
        header.classList.add('ucc-collapsible-header', 'ucc-arrow-indicator');
        content.classList.add('ucc-user-text-clamp');

        header.addEventListener('click', (event) => {
            if (event.target.closest('button, a')) return;
            if (window.getSelection().toString().length > 0) return;

            header.classList.toggle('ucc-header-expanded');
            content.classList.toggle('ucc-user-text-clamp');
        });
    }

    // ===== 站点处理 =====
    function processGeminiCodeBlock(element) {
        if (element.hasAttribute(processAttribute)) return;

        const header  = element.querySelector('.code-block-decoration');
        const content = element.querySelector('.formatted-code-block-internal-container');
        if (!header || !content) return;

        element.setAttribute(processAttribute, 'true');
        header.classList.add('gemini-header-padding', 'gemini-arrow-pos');

        const lineCount = content.textContent.split('\n').length;
        const shouldCollapse = lineCount > MIN_CODE_LINES;

        applyDisplayCollapse(header, content, shouldCollapse);
    }

    // ★★★ ChatGPT 代码块处理（流式兼容 + 尊重用户点击）★★★
    function processChatGPTCodeBlock(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

        // 新版 UI：header 是语言栏，content 是 .overflow-y-auto.p-4
        const header  = element.querySelector('.rounded-t-2xl');
        const content = element.querySelector('.overflow-y-auto.p-4, .p-4');
        if (!header || !content) return;

        const codeText  = content.textContent || '';
        const lineCount = codeText.split(/\r\n|\r|\n/).length;
        if (lineCount <= 1) return;

        const shouldCollapse   = lineCount > MIN_CODE_LINES;
        const alreadyProcessed = element.hasAttribute(processAttribute);
        const userPref         = element.dataset.uccUserPref; // 用户手动选择（open / closed）

        if (!alreadyProcessed) {
            element.setAttribute(processAttribute, 'true');
            header.classList.add('chatgpt-header-padding', 'chatgpt-arrow-pos');
            applyDisplayCollapse(header, content, shouldCollapse);
        } else {
            // 如果用户手动指定了展开 / 折叠，就优先尊重用户
            if (userPref === 'open') {
                content.style.display = '';
                header.classList.add('ucc-header-expanded');
                return;
            } else if (userPref === 'closed') {
                content.style.display = 'none';
                header.classList.remove('ucc-header-expanded');
                return;
            }

            // 否则按行数阈值自动处理
            if (shouldCollapse) {
                content.style.display = 'none';
                header.classList.remove('ucc-header-expanded');
            } else {
                content.style.display = '';
                header.classList.add('ucc-header-expanded');
            }
        }
    }

    function processChatGPTUserMessage(element) {
        if (element.hasAttribute(processAttribute)) return;
        element.setAttribute(processAttribute, 'true');

        const textContainer = element.querySelector('.whitespace-pre-wrap');
        if (!textContainer) return;

        const lineCount = textContainer.textContent.split('\n').length;
        const isLong =
            lineCount > USER_TEXT_MAX_LINES ||
            (lineCount === 1 && textContainer.textContent.length > USER_SINGLE_LINE_MAX_LENGTH);

        if (isLong) {
            const bubble = element.querySelector('.user-message-bubble-color');
            if (bubble) {
                bubble.classList.add('chatgpt-header-padding', 'chatgpt-arrow-pos');
                applyLineClampCollapse(bubble, textContainer);
            }
        }

        // 用户消息出现或更新，重建问题列表
        scheduleRebuildQuestions();
    }

    // ===== 针对 <pre> 的延时调度（流式输出 + 结束兜底） =====
    function scheduleProcessPre(pre) {
        if (!pre || pre.nodeType !== Node.ELEMENT_NODE) return;

        // 取 / 初始化当前 <pre> 的流式状态
        let state = preStreamState.get(pre);
        if (!state) {
            state = {
                lastCheck: 0,        // 上次“流式提前检查”的时间戳
                collapsedOnce: false // 是否已经在流式过程中折叠过一次
            };
            preStreamState.set(pre, state);
        }

        const now = (window.performance && performance.now)
            ? performance.now()
            : Date.now();

        // 1）流式中：限频检查，超过阈值就提前折叠一次
        if (!state.collapsedOnce && now - state.lastCheck > 300) {
            state.lastCheck = now;

            const content = pre.querySelector('.overflow-y-auto.p-4, .p-4');
            if (content) {
                const text = content.textContent || '';
                const lineCount = text.split(/\r\n|\r|\n/).length;

                if (lineCount > MIN_CODE_LINES) {
                    // 已经达到阈值：提前折叠一次，并标记
                    const existing = pendingPreTimers.get(pre);
                    if (existing) clearTimeout(existing);
                    pendingPreTimers.delete(pre);

                    processChatGPTCodeBlock(pre);
                    state.collapsedOnce = true;
                }
            }
        }

        // 2）无论是否提前折叠，都保留“结束兜底”的 800ms 定时器
        const existing = pendingPreTimers.get(pre);
        if (existing) clearTimeout(existing);

        const id = setTimeout(() => {
            pendingPreTimers.delete(pre);
            preStreamState.delete(pre); // 本轮结束，状态清理，下次重新统计
            processChatGPTCodeBlock(pre);  // 最终状态再算一遍行数，决定是否折叠
        }, 800);

        pendingPreTimers.set(pre, id);
    }

    // ===== 通用扫描入口 =====
    function scanAndProcess(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return;

        const host = window.location.hostname;
        const selectorMap = {
            'gemini.google.com': {
                [`code-block:not([${processAttribute}])`]: processGeminiCodeBlock
            },
            'chatgpt.com': {
                [`div[data-message-author-role="user"]:not([${processAttribute}])`]: processChatGPTUserMessage,
                [`pre`]: (el) => scheduleProcessPre(el) // 统一交给防抖调度
            }
        };

        for (const hostKey in selectorMap) {
            if (host.includes(hostKey)) {
                for (const selector in selectorMap[hostKey]) {
                    const elements = node.matches(selector)
                        ? [node]
                        : node.querySelectorAll(selector);
                    elements.forEach(selectorMap[hostKey][selector]);
                }
            }
        }
    }

    // ===== MutationObserver =====
    const observer = new MutationObserver((mutations) => {
        let needRebuild = false;

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            scanAndProcess(node);

                            // 新增节点里如果包含 <pre>，触发一次调度
                            const pre = node.matches('pre')
                                ? node
                                : (node.querySelector && node.querySelector('pre'));
                            if (pre) scheduleProcessPre(pre);

                            // 新增用户消息 => 重建问题列表
                            if (
                                node.matches &&
                                node.matches('div[data-message-author-role="user"]')
                            ) {
                                needRebuild = true;
                            } else if (
                                node.querySelector &&
                                node.querySelector('div[data-message-author-role="user"]')
                            ) {
                                needRebuild = true;
                            }
                        }
                    });
                }

                // 即便只是往已有元素里追加子节点（流式），也要看它是否在 <pre> 里
                if (mutation.target && mutation.target.nodeType === Node.ELEMENT_NODE) {
                    const preParent = mutation.target.closest && mutation.target.closest('pre');
                    if (preParent) {
                        scheduleProcessPre(preParent);
                    }

                    const inUser = mutation.target.closest &&
                                   mutation.target.closest('div[data-message-author-role="user"]');
                    if (inUser) {
                        needRebuild = true;
                    }
                }
            }

            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target && target.nodeType === Node.ELEMENT_NODE) {
                    // 忽略我们自己加的高亮类，避免点击问题项时重建导致问题框回到顶部
                    const isHighlight = target.classList &&
                        target.classList.contains('ucc-question-highlight');
                    if (!isHighlight) {
                        const preParent = target.closest && target.closest('pre');
                        if (preParent) {
                            scheduleProcessPre(preParent);
                        }

                        const inUser = target.closest &&
                                       target.closest('div[data-message-author-role="user"]');
                        if (inUser) {
                            needRebuild = true;
                        }
                    }

                    scanAndProcess(target);
                }
            }
        }

        if (needRebuild) {
            scheduleRebuildQuestions();
        }
    });

    // ===== 对话切换：URL 变了就重置问题列表和计数，再重建 + 折叠所有代码 =====
    function handleConversationChange() {
        lastConversationKey = getConversationKey();
        questionCounter = 0;
        if (questionListBody) {
            questionListBody.innerHTML = '<div class="ucc-question-empty">还没有问题哦~</div>';
        }
        // 重建问题列表（新对话的用户消息）
        scheduleRebuildQuestions();

        // 等新对话 DOM 渲染完后，统一再跑一遍扫描 + 折叠所有长代码
        setTimeout(() => {
            scanAndProcess(document.body);
        }, 800);
    }

    function startConversationWatcher() {
        let key = getConversationKey();
        setInterval(() => {
            const current = getConversationKey();
            if (current !== key) {
                key = current;
                handleConversationChange();
            }
        }, 1000);
    }

    // ===== 初始化 =====
    function init() {
        if (!document.body) return;

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        // 首次加载时扫描整个页面（含所有 <pre>）
        scanAndProcess(document.body);
        createSettingsUI();
        ensureQuestionListUI();
        rebuildQuestionList();
        startConversationWatcher();

        window.addEventListener('resize', () => {
            if (!questionListContainer) return;
            const rect = questionListContainer.getBoundingClientRect();
            const maxHeight = window.innerHeight - rect.top - 20;
            if (rect.height > maxHeight) {
                questionListContainer.style.height = maxHeight + 'px';
                questionListHeight = maxHeight;
                gmSet('ucc_questionHeight', questionListHeight);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
