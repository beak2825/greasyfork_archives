// ==UserScript==
// @name         AI聊天对话框宽度调整
// @namespace    http://tampermonkey.net/
// @version      2025-09-29
// @description  调整AI聊天对话消息列宽度.目前涵盖ChatGPT和DeepSeek。
// @author       Bilibili@橘猫压倒炕
// @match        https://chat.deepseek.com/*
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550380/AI%E8%81%8A%E5%A4%A9%E5%AF%B9%E8%AF%9D%E6%A1%86%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/550380/AI%E8%81%8A%E5%A4%A9%E5%AF%B9%E8%AF%9D%E6%A1%86%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从本地存储获取保存的宽度值，如果没有则使用默认值1600
    const getSavedWidth = () => {
        const saved = localStorage.getItem('deepseek_chat_width');
        return saved ? parseInt(saved) : 1600;
    };

    // 保存宽度到本地存储
    const saveWidth = (width) => {
        localStorage.setItem('deepseek_chat_width', width.toString());
    };

    // 应用宽度样式
    const applyWidth = (width) => {
        const style = document.getElementById('deepseek-width-style');
        if (style) {
            style.textContent = `
                :root {
                    --message-list-max-width: ${width}px !important;
                    --thread-content-max-width: ${width}px !important;
                }
                * {
                    --message-list-max-width: ${width}px !important;
                    --thread-content-max-width: ${width}px !important;
                }
            `;
        }
    };

    // 创建控制面板
    const createControlPanel = () => {
        // 创建样式元素
        const style = document.createElement('style');
        style.id = 'deepseek-width-style';
        document.head.appendChild(style);

        // 应用保存的宽度
        const savedWidth = getSavedWidth();
        applyWidth(savedWidth);

        // 创建控制面板容器
        const panel = document.createElement('div');
        panel.id = 'deepseek-width-panel';
        panel.innerHTML = `
            <div id="width-input-container" class="input-container">
                <input type="number" id="width-input" placeholder="宽度(px)" min="840" max="3640">
            </div>
            <div id="width-toggle-btn" class="width-btn">宽</div>
        `;

        // 添加到页面
        document.body.appendChild(panel);

        // 添加控制面板样式
        const panelStyle = document.createElement('style');
        panelStyle.textContent = `
            #deepseek-width-panel {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                display: flex;
                align-items: center;
            }

            .width-btn {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                transition: all 0.3s ease;
                border: 2px solid rgba(255, 255, 255, 0.3);
                flex-shrink: 0;
            }

            .width-btn:hover {
                background: rgba(0, 0, 0, 0.9);
                border-color: rgba(255, 255, 255, 0.6);
            }

            .width-btn.apply-mode {
                background: #28a745;
                border-color: #218838;
            }

            .width-btn.apply-mode:hover {
                background: #218838;
                transform: scale(1.05);
            }

            .input-container {
                display: none;
                margin-right: 10px;
                background: rgba(0, 0, 0, 0.8);
                padding: 6px 10px;
                border-radius: 16px;
                animation: slideIn 0.3s ease;
                align-items: center;
                height: 32px;
                box-sizing: border-box;
            }

            @keyframes slideIn {
                from { opacity: 0; transform: translateX(10px); }
                to { opacity: 1; transform: translateX(0); }
            }

            #width-input {
                width: 70px;
                padding: 4px 6px;
                border: 1px solid #ccc;
                border-radius: 12px;
                background: white;
                color: #333;
                font-size: 11px;
                outline: none;
                transition: border-color 0.3s ease;
                height: 20px;
                box-sizing: border-box;
            }

            #width-input:focus {
                border-color: #007bff;
                box-shadow: 0 0 3px rgba(0, 123, 255, 0.3);
            }

            #width-input.invalid {
                border-color: #dc3545;
                box-shadow: 0 0 3px rgba(220, 53, 69, 0.3);
            }

            .input-container.show {
                display: flex;
            }
        `;
        document.head.appendChild(panelStyle);

        // 获取DOM元素
        const toggleBtn = document.getElementById('width-toggle-btn');
        const inputContainer = document.getElementById('width-input-container');
        const widthInput = document.getElementById('width-input');

        // 设置输入框的初始值为当前保存的宽度
        widthInput.value = savedWidth;

        let isEditing = false;
        let autoCloseTimeout = null;
        let isMouseDownOnInput = false;

        // 切换按钮点击事件
        toggleBtn.addEventListener('click', () => {
            if (!isEditing) {
                // 进入编辑模式：展开输入框，按钮变为√
                startEditing();
            } else {
                // 应用设置：收起输入框，按钮变回宽
                applyWidthSetting();
                endEditing();
            }
        });

        // 开始编辑模式
        function startEditing() {
            isEditing = true;
            inputContainer.classList.add('show');
            toggleBtn.textContent = '√';
            toggleBtn.classList.add('apply-mode');
            widthInput.focus();
            widthInput.select();

            // 清除之前的定时器
            if (autoCloseTimeout) {
                clearTimeout(autoCloseTimeout);
            }
        }

        // 结束编辑模式
        function endEditing() {
            isEditing = false;
            inputContainer.classList.remove('show');
            toggleBtn.textContent = '宽';
            toggleBtn.classList.remove('apply-mode');
            widthInput.classList.remove('invalid');

            // 清除定时器
            if (autoCloseTimeout) {
                clearTimeout(autoCloseTimeout);
                autoCloseTimeout = null;
            }
        }

        // 设置自动关闭定时器
        function setAutoCloseTimer() {
            if (autoCloseTimeout) {
                clearTimeout(autoCloseTimeout);
            }
            autoCloseTimeout = setTimeout(() => {
                if (isEditing) {
                    applyWidthSetting();
                    endEditing();
                }
            }, 5000); // 5秒后自动关闭
        }

        // 输入框鼠标按下事件（用于检测文本选择）
        widthInput.addEventListener('mousedown', () => {
            isMouseDownOnInput = true;
        });

        // 输入框鼠标抬起事件
        widthInput.addEventListener('mouseup', () => {
            isMouseDownOnInput = false;
        });

        // 输入框回车键事件
        widthInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyWidthSetting();
                // 不退出编辑模式，只清除输入框选中状态
                widthInput.blur();
            }
        });

        // 输入框获得焦点事件
        widthInput.addEventListener('focus', () => {
            if (isEditing) {
                // 获得焦点时清除自动关闭定时器
                if (autoCloseTimeout) {
                    clearTimeout(autoCloseTimeout);
                }
            }
        });

        // 输入框失去焦点事件
        widthInput.addEventListener('blur', () => {
            if (isEditing) {
                // 短暂延迟，避免在文本选择时误触发
                setTimeout(() => {
                    // 检查是否正在文本选择过程中
                    if (!isMouseDownOnInput) {
                        applyWidthSetting();
                        // 重新启动5秒自动关闭定时器
                        setAutoCloseTimer();
                    }
                }, 100);
            }
        });

        // 应用宽度设置的函数
        function applyWidthSetting() {
            let newWidth = parseInt(widthInput.value);
            let adjusted = false;

            // 检查并调整宽度范围
            if (newWidth < 840) {
                newWidth = 840;
                adjusted = true;
            } else if (newWidth > 3640) {
                newWidth = 3640;
                adjusted = true;
            }

            if (!isNaN(newWidth) && newWidth >= 840 && newWidth <= 3640) {
                // 如果调整过数值，更新输入框显示
                if (adjusted) {
                    widthInput.value = newWidth;
                }

                applyWidth(newWidth);
                saveWidth(newWidth);

                if (adjusted) {
                    showMessage(`宽度已自动调整为 ${newWidth}px（范围：840-3640）`);
                } else {
                    showMessage(`宽度已设置为 ${newWidth}px`);
                }
            } else {
                // 输入无效
                widthInput.classList.add('invalid');
                showMessage('请输入840-3640之间的数字');
                widthInput.focus();
                widthInput.select();
            }
        }

        // 显示提示消息
        function showMessage(text) {
            // 移除已有的消息
            const existingMsg = document.getElementById('width-message');
            if (existingMsg) existingMsg.remove();

            const msg = document.createElement('div');
            msg.id = 'width-message';
            msg.textContent = text;
            msg.style.cssText = `
                position: fixed;
                bottom: 60px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 6px 10px;
                border-radius: 4px;
                font-size: 11px;
                z-index: 10001;
                animation: fadeOut 2s ease 1s forwards;
            `;

            const fadeStyle = document.createElement('style');
            fadeStyle.textContent = `
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; display: none; }
                }
            `;
            document.head.appendChild(fadeStyle);

            document.body.appendChild(msg);

            // 3秒后自动移除
            setTimeout(() => {
                if (msg.parentNode) {
                    msg.remove();
                }
            }, 3000);
        }

        // 点击页面其他区域的事件处理
        document.addEventListener('mousedown', (e) => {
            if (isEditing && !panel.contains(e.target)) {
                // 检查是否正在输入框内进行文本选择
                if (!isMouseDownOnInput) {
                    // 延迟处理，避免与输入框的blur事件冲突
                    setTimeout(() => {
                        if (isEditing && document.activeElement !== widthInput) {
                            applyWidthSetting();
                            // 点击外部区域时不退出编辑模式，只启动5秒定时器
                            setAutoCloseTimer();
                        }
                    }, 10);
                }
            }
        });
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createControlPanel);
    } else {
        createControlPanel();
    }
})();