// ==UserScript==
// @name         Gemini 助手：净化引用 + 宽屏调节 (带开关版)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  二合一脚本：1. 强力移除 Gemini 回答中的引用来源上标和底部列表；2. 添加右上角滑块实时调节对话框宽度。支持分别控制开关，修复 TrustedHTML 报错。
// @author       You
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563206/Gemini%20%E5%8A%A9%E6%89%8B%EF%BC%9A%E5%87%80%E5%8C%96%E5%BC%95%E7%94%A8%20%2B%20%E5%AE%BD%E5%B1%8F%E8%B0%83%E8%8A%82%20%28%E5%B8%A6%E5%BC%80%E5%85%B3%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563206/Gemini%20%E5%8A%A9%E6%89%8B%EF%BC%9A%E5%87%80%E5%8C%96%E5%BC%95%E7%94%A8%20%2B%20%E5%AE%BD%E5%B1%8F%E8%B0%83%E8%8A%82%20%28%E5%B8%A6%E5%BC%80%E5%85%B3%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 配置区域
    // ==========================================
    const STORAGE_WIDTH_VAL = 'gemini_helper_width_val';      // 存储宽度数值
    const STORAGE_PURIFY_ON = 'gemini_helper_purify_on';      // 存储净化开关状态
    const STORAGE_WIDE_ON = 'gemini_helper_wide_on';          // 存储宽屏开关状态

    const DEFAULT_WIDTH = 65;
    const UI_ID = 'gemini-helper-ui-v5';

    // 类名常量，用于控制 CSS 生效
    const CLASS_PURIFY = 'gh-purify-active';
    const CLASS_WIDE = 'gh-wide-active';

    // ==========================================
    // 1. 初始化状态
    // ==========================================
    // 读取配置，默认都为 true (开启)
    const isPurifyOn = (localStorage.getItem(STORAGE_PURIFY_ON) !== 'false');
    const isWideOn = (localStorage.getItem(STORAGE_WIDE_ON) !== 'false');
    const savedWidth = localStorage.getItem(STORAGE_WIDTH_VAL) || DEFAULT_WIDTH;

    // 辅助函数：安全地操作 body class
    function updateBodyClass(className, isActive) {
        if (!document.body) return;
        if (isActive) {
            document.body.classList.add(className);
        } else {
            document.body.classList.remove(className);
        }
    }

    // 初始化 CSS 变量
    try {
        if (document.documentElement) {
            document.documentElement.style.setProperty('--gemini-force-width', savedWidth + '%');
        }
    } catch (e) {}

    // ==========================================
    // 2. 注入 CSS 样式 (基于 Class 动态生效)
    // ==========================================
    const combinedCss = `
        /* >>>>>>>>> 功能模块 A: 净化引用 (依赖 body.gh-purify-active) <<<<<<<<< */

        /* 只有当 body 有 gh-purify-active 类时，以下规则才生效 */
        body.${CLASS_PURIFY} source-footnote,
        body.${CLASS_PURIFY} .source-footnote {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            pointer-events: none !important;
        }

        body.${CLASS_PURIFY} response-element:has(source-footnote) {
            display: none !important;
        }

        body.${CLASS_PURIFY} span:has(> response-element > source-footnote),
        body.${CLASS_PURIFY} span:has(> span > response-element > source-footnote) {
            display: none !important;
        }

        body.${CLASS_PURIFY} sources-carousel-inline,
        body.${CLASS_PURIFY} .sources-carousel-inline,
        body.${CLASS_PURIFY} sources-list {
            display: none !important;
        }

        body.${CLASS_PURIFY} .button-container:has(button[aria-controls="sources"]),
        body.${CLASS_PURIFY} button[aria-controls="sources"] {
            display: none !important;
        }

        /* >>>>>>>>> 功能模块 B: 宽屏适配 (依赖 body.gh-wide-active) <<<<<<<<< */

        body.${CLASS_WIDE} .conversation-container,
        body.${CLASS_WIDE} model-response > div,
        body.${CLASS_WIDE} user-query > span,
        body.${CLASS_WIDE} .input-area-container .input-area,
        body.${CLASS_WIDE} .input-area-v2 {
            max-width: var(--gemini-force-width) !important;
            width: var(--gemini-force-width) !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }

        body.${CLASS_WIDE} .input-area-container,
        body.${CLASS_WIDE} .input-area-wrapper,
        body.${CLASS_WIDE} form {
             max-width: 100% !important;
        }

        /* >>>>>>>>> 功能模块 C: 控制面板 UI 样式 <<<<<<<<< */
        #${UI_ID} {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 999999;
            background: rgba(30, 31, 32, 0.9);
            backdrop-filter: blur(10px);
            padding: 10px 15px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.1);
            display: flex;
            flex-direction: column; /* 改为垂直布局以容纳更多选项 */
            gap: 8px;
            color: #e3e3e3;
            font-family: 'Google Sans', sans-serif;
            font-size: 13px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            transition: opacity 0.3s;
            user-select: none;
            min-width: 140px;
        }

        #${UI_ID}:hover {
            opacity: 1;
        }

        body:not(:hover) #${UI_ID} {
            opacity: 0.3;
        }

        /* 内部行布局 */
        #${UI_ID} .gh-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }

        /* Checkbox 样式微调 */
        #${UI_ID} input[type="checkbox"] {
            cursor: pointer;
            accent-color: #8ab4f8;
            width: 16px;
            height: 16px;
        }

        #${UI_ID} label {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* 滑块控件样式 */
        #${UI_ID} input[type=range] {
            width: 100%;
            cursor: pointer;
            accent-color: #4da6ff;
            margin-top: 5px;
        }

        /* 隐藏元素辅助类 */
        .gh-hidden {
            display: none !important;
        }
    `;

    GM_addStyle(combinedCss);

    // ==========================================
    // 3. 构建 UI 界面
    // ==========================================
    function createUI() {
        if (!document.body) return;
        if (document.getElementById(UI_ID)) return;

        // --- 应用初始状态到 body ---
        updateBodyClass(CLASS_PURIFY, isPurifyOn);
        updateBodyClass(CLASS_WIDE, isWideOn);

        // --- 创建主容器 ---
        const container = document.createElement('div');
        container.id = UI_ID;

        // --- 第一行：净化开关 ---
        const rowPurify = document.createElement('div');
        rowPurify.className = 'gh-row';

        const labelPurify = document.createElement('label');
        const checkPurify = document.createElement('input');
        checkPurify.type = 'checkbox';
        checkPurify.checked = isPurifyOn;
        labelPurify.appendChild(checkPurify);
        labelPurify.appendChild(document.createTextNode('🛡️ 净化引用'));

        rowPurify.appendChild(labelPurify);
        container.appendChild(rowPurify);

        // --- 第二行：宽屏开关 ---
        const rowWide = document.createElement('div');
        rowWide.className = 'gh-row';

        const labelWide = document.createElement('label');
        const checkWide = document.createElement('input');
        checkWide.type = 'checkbox';
        checkWide.checked = isWideOn;
        labelWide.appendChild(checkWide);
        labelWide.appendChild(document.createTextNode('↔️ 宽屏调节'));

        rowWide.appendChild(labelWide);
        container.appendChild(rowWide);

        // --- 第三行：滑块 (容器) ---
        const sliderContainer = document.createElement('div');
        sliderContainer.style.marginTop = '4px';
        // 如果初始没开启宽屏，就隐藏滑块
        if (!isWideOn) sliderContainer.classList.add('gh-hidden');

        // 数值显示
        const valueRow = document.createElement('div');
        valueRow.className = 'gh-row';
        valueRow.style.fontSize = '12px';
        valueRow.style.color = '#aaa';
        const valLabel = document.createElement('span');
        valLabel.textContent = '宽度占比:';
        const valDisplay = document.createElement('span');
        valDisplay.textContent = savedWidth + '%';

        valueRow.appendChild(valLabel);
        valueRow.appendChild(valDisplay);
        sliderContainer.appendChild(valueRow);

        // 滑块本体
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '30';
        slider.max = '100';
        slider.value = savedWidth;
        slider.title = '双击文字重置默认';
        sliderContainer.appendChild(slider);

        container.appendChild(sliderContainer);
        document.body.appendChild(container);

        // ==========================================
        // 事件绑定
        // ==========================================

        // 1. 净化开关事件
        checkPurify.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            updateBodyClass(CLASS_PURIFY, isChecked);
            localStorage.setItem(STORAGE_PURIFY_ON, isChecked);
        });

        // 2. 宽屏开关事件
        checkWide.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            updateBodyClass(CLASS_WIDE, isChecked);
            localStorage.setItem(STORAGE_WIDE_ON, isChecked);

            // 切换滑块的显示/隐藏
            if (isChecked) {
                sliderContainer.classList.remove('gh-hidden');
            } else {
                sliderContainer.classList.add('gh-hidden');
            }
        });

        // 3. 滑块拖动事件
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            valDisplay.textContent = val + '%';
            document.documentElement.style.setProperty('--gemini-force-width', val + '%');
            localStorage.setItem(STORAGE_WIDTH_VAL, val);
        });

        // 4. 双击重置
        valLabel.addEventListener('dblclick', () => {
            slider.value = DEFAULT_WIDTH;
            slider.dispatchEvent(new Event('input'));
        });
    }

    // ==========================================
    // 启动逻辑
    // ==========================================
    window.addEventListener('load', createUI);
    document.addEventListener('DOMContentLoaded', createUI);

    // 守护进程：确保动态加载后样式依然生效
    const observer = new MutationObserver((mutations) => {
        if (document.body) {
            createUI();
            // 确保 Class 不会因为页面重绘被冲掉
            // 这里我们只在 UI 不存在时重新添加，避免死循环。
            // 实际上 body class 一般不会被 Gemini 移除，但为了保险：
            const panel = document.getElementById(UI_ID);
            if (panel) {
                // 读取当前 Checkbox 状态来同步 body class
                const checkPurify = panel.querySelector('input[type="checkbox"]:nth-of-type(1)'); // 这种选择器不太稳，改用逻辑同步
                // 由于我们有全局变量 isPurifyOn 是初始值，不能代表当前值。
                // 简化逻辑：每次 createUI 保证了 UI 存在，事件绑定保证了 class 存在。
            }
        }
    });

    if (document.documentElement) {
        observer.observe(document.documentElement, { childList: true, subtree: true });
    } else {
        setTimeout(() => {
             observer.observe(document, { childList: true, subtree: true });
        }, 500);
    }

    console.log('Gemini 助手 V5 (带开关) 已启动');

})();