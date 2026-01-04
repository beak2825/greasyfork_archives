// ==UserScript==
// @name         XJTLU AMS Sign-in Code 优化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  出现 "Sign-in Code" 输入框时，自动聚焦到输入框，输入小写字母自动转为大写，按Enter提交
// @author       wujinjun
// @license      MIT
// @match        https://ams.xjtlu.edu.cn/studentpc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554689/XJTLU%20AMS%20Sign-in%20Code%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/554689/XJTLU%20AMS%20Sign-in%20Code%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INPUT_SELECTOR_A = '#main > div.content > div.classSchedule > div.el-dialog__wrapper.dialog > div > div.el-dialog__body > div > div.input.el-input > input';     // 自动聚焦和转大写的输入框选择器 (可能出现多次，脚本将聚焦第一个)
    const CLICK_TARGET_SELECTOR_B = '#main > div.content > div.classSchedule > div.el-dialog__wrapper.dialog > div > div.el-dialog__footer > span > button.el-button.el-button--primary'; // 按 Enter 后要点击的选择器 (按钮等)
    const FOCUS_DELAY_MS = 200; // 检查和重新聚焦的延迟时间（毫秒），避免频繁操作

    // ⭐ 新增配置变量：是否启用自动将小写转为大写的功能 (true/false)
    const ENABLE_AUTO_UPPERCASE = true;
    // ----------------------------------------------------

    // 状态变量
    let isFocusSuspended = false;
    let currentInput = null;

    //尝试查找第一个符合条件的输入框并进行聚焦（包含光标设置）
    function tryFocusInput() {
        if (isFocusSuspended) {
            return;
        }

        const inputs = document.querySelectorAll(INPUT_SELECTOR_A);

        if (inputs.length > 0) {
            currentInput = inputs[0];

            // 只有当它不是当前焦点时才进行聚焦
            if (document.activeElement !== currentInput) {
                // 1. 聚焦到元素
                currentInput.focus();

                // 2. 明确设置光标位置到文本末尾
                // 使用 setTimeout(..., 0) 来确保在浏览器的下一个渲染周期中执行，
                // 这有助于在复杂的页面上解决光标不显示的问题。
                setTimeout(() => {
                    // 确保元素仍然是焦点且支持 setSelectionRange（仅限输入框和文本域）
                    if (currentInput === document.activeElement && currentInput.setSelectionRange) {
                        const length = currentInput.value.length;
                        currentInput.setSelectionRange(length, length);
                    }
                }, 0);
            }
        } else {
            currentInput = null;
        }
    }

    /**
     * 处理输入事件：将输入框内容自动转为大写
     * @param {Event} event - 输入事件对象
     */
    function handleInputToUppercase(event) {
        const inputElement = event.target;

        // 确保是我们的目标输入框
        if (inputElement.matches(INPUT_SELECTOR_A)) {
            const oldValue = inputElement.value;
            const newValue = oldValue.toUpperCase();

            // 只有内容发生变化时才更新，并确保光标位置不丢失
            if (oldValue !== newValue) {
                // 记录当前光标位置
                const start = inputElement.selectionStart;
                const end = inputElement.selectionEnd;

                // 更新输入框的值
                inputElement.value = newValue;

                // 恢复光标位置
                inputElement.setSelectionRange(start, end);
            }
        }
    }

    /**
     * 设置事件监听器
     */
    function setupEventListeners() {
        // --- 聚焦/失焦控制 ---
        document.addEventListener('blur', function(event) {
            if (event.target && event.target.matches(INPUT_SELECTOR_A)) {
                isFocusSuspended = true;
            }
        }, true);

        document.addEventListener('focus', function(event) {
            if (event.target && event.target.matches(INPUT_SELECTOR_A)) {
                isFocusSuspended = false;
            }
        }, true);

        // --- 自动大写功能 (条件性启用) ---
        // ⭐ 根据配置变量决定是否注册事件监听器
        if (ENABLE_AUTO_UPPERCASE) {
            document.addEventListener('input', handleInputToUppercase, true);
            console.log("自动大写功能已启用。");
        } else {
            console.log("自动大写功能已禁用。");
        }

        // --- Enter 键触发动作 ---
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                // 必须聚焦在 INPUT_SELECTOR_A 元素上才能触发点击
                if (document.activeElement && document.activeElement.matches(INPUT_SELECTOR_A)) {
                    event.preventDefault();

                    const targetElement = document.querySelector(CLICK_TARGET_SELECTOR_B);

                    if (targetElement) {
                        console.log('检测到 Enter 键并已聚焦在 输入框，正在点击 Confirm...');
                        targetElement.click();
                    } else {
                        console.error('未找到点击目标元素：' + CLICK_TARGET_SELECTOR_B);
                    }
                }
            }
        });
    }

    // 脚本主执行逻辑
    setupEventListeners();

    // 持续检查并尝试聚焦
    setInterval(tryFocusInput, FOCUS_DELAY_MS);

    // 立即执行一次聚焦
    tryFocusInput();

})();