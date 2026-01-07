// ==UserScript==
// @name         ZZULI教学评价一键满分
// @namespace    https://jwgl.zzuli.edu.cn/
// @version      1.0.0
// @description  郑州轻工业大学教学综合管理平台 - 教学评价一键满分功能，采用 iOS 设计美学风格
// @author       ShiYi
// @match        https://jwgl.zzuli.edu.cn/student/wspj_tjzbpj_wjdcb_pj.jsp*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561669/ZZULI%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E4%B8%80%E9%94%AE%E6%BB%A1%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/561669/ZZULI%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E4%B8%80%E9%94%AE%E6%BB%A1%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 配置项 - iOS 设计美学风格
     */
    const CONFIG = {
        // 是否自动填写评语（可选）
        autoFillComment: true,
        // 默认评语内容
        defaultComment: '老师教学认真负责，授课内容充实，课堂氛围活跃，注重培养学生的实践能力和创新思维。',
        // 主按钮样式 (iOS 风格)
        primaryButtonStyle: {
            backgroundColor: '#007AFF',  // iOS 蓝色
            color: '#FFFFFF',
            border: 'none',
            padding: '12px 32px',
            fontSize: '15px',
            borderRadius: '12px',  // iOS 特色大圆角
            cursor: 'pointer',
            marginRight: '12px',
            fontWeight: '600',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
            boxShadow: '0 4px 12px rgba(0, 122, 255, 0.25)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none',
            letterSpacing: '0.3px'
        },
        // 次要按钮样式 (iOS 风格)
        secondaryButtonStyle: {
            backgroundColor: '#F2F2F7',  // iOS 浅灰背景
            color: '#1C1C1E',  // iOS 深色文字
            border: 'none',
            padding: '12px 28px',
            fontSize: '15px',
            borderRadius: '12px',
            cursor: 'pointer',
            marginRight: '12px',
            fontWeight: '600',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none',
            letterSpacing: '0.3px'
        }
    };

    /**
     * 等待页面元素加载完成
     */
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`等待元素超时: ${selector}`));
            }, timeout);
        });
    }

    /**
     * 应用按钮样式
     */
    function applyButtonStyle(button, styles) {
        Object.keys(styles).forEach(key => {
            button.style[key] = styles[key];
        });
    }

    /**
     * 创建一键满分按钮 - iOS 风格
     */
    function createFullScoreButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'autoFullScoreBtn';
        button.className = 'ios-button ios-button-primary';

        // 使用 iOS 风格的图标和文字
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right: 6px; vertical-align: middle;">
                <path d="M8 1L10.163 5.38197L15 6.12017L11.5 9.52984L12.326 14.3279L8 12.0656L3.674 14.3279L4.5 9.52984L1 6.12017L5.837 5.38197L8 1Z" fill="currentColor"/>
            </svg>
            <span style="vertical-align: middle;">一键满分</span>
        `;

        applyButtonStyle(button, CONFIG.primaryButtonStyle);

        // iOS 风格的悬停效果 - 更柔和的变化
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#0051D5';  // 更深的蓝色
            button.style.transform = 'scale(1.02) translateY(-1px)';
            button.style.boxShadow = '0 6px 16px rgba(0, 122, 255, 0.35)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#007AFF';
            button.style.transform = 'scale(1) translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.25)';
        });

        // 按下效果
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.98) translateY(0)';
            button.style.boxShadow = '0 2px 8px rgba(0, 122, 255, 0.2)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1.02) translateY(-1px)';
            button.style.boxShadow = '0 6px 16px rgba(0, 122, 255, 0.35)';
        });

        // 添加点击事件
        button.addEventListener('click', fillFullScore);

        return button;
    }

    /**
     * 填充满分功能
     */
    function fillFullScore() {
        try {
            let successCount = 0;
            let failCount = 0;

            // 获取指标数量
            const zbSizeElement = document.getElementById('zbSize');
            if (!zbSizeElement) {
                throw new Error('未找到评价指标');
            }

            const zbSize = parseInt(zbSizeElement.value);
            console.log(`共找到 ${zbSize} 个评价指标`);

            // 填充所有指标项为满分
            for (let i = 0; i < zbSize; i++) {
                const inputElement = document.getElementById(`sel_scorecj${i}`);

                if (inputElement) {
                    // 获取满分值（从元素属性中读取）
                    const maxScore = inputElement.getAttribute('mf') || '10';

                    // 设置为满分
                    inputElement.value = maxScore;

                    // 触发 change 事件以确保表单验证
                    const changeEvent = new Event('change', { bubbles: true });
                    inputElement.dispatchEvent(changeEvent);

                    successCount++;
                    console.log(`指标 ${i + 1} 已填充满分: ${maxScore}`);
                } else {
                    failCount++;
                    console.warn(`指标 ${i + 1} 的输入框未找到`);
                }
            }

            // 处理问卷文本区域（可选）
            if (CONFIG.autoFillComment) {
                const wjSizeElement = document.getElementById('wjSize');
                if (wjSizeElement) {
                    const wjSize = parseInt(wjSizeElement.value);

                    for (let i = 0; i < wjSize; i++) {
                        const textareaElement = document.getElementById(`area${i}`);

                        if (textareaElement && !textareaElement.value.trim()) {
                            textareaElement.value = CONFIG.defaultComment;

                            // 触发 change 事件
                            const changeEvent = new Event('change', { bubbles: true });
                            textareaElement.dispatchEvent(changeEvent);

                            console.log(`问卷 ${i + 1} 已自动填写评语`);
                        }
                    }
                }
            }

            // 显示结果 - 使用 iOS 风格提示
            if (successCount > 0) {
                const message = `成功填充 ${successCount} 项${failCount > 0 ? `\n失败 ${failCount} 项` : ''}\n\n请检查后点击"提交"按钮保存`;
                showIOSAlert('填充完成', message, 'success');
            } else {
                showIOSAlert('填充失败', '未找到可填充的评分项', 'error');
            }

        } catch (error) {
            console.error('填充满分时出错:', error);
            showIOSAlert('操作失败', error.message, 'error');
        }
    }

    /**
     * 创建一键清空按钮 - iOS 风格
     */
    function createClearButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'autoClearBtn';
        button.className = 'ios-button ios-button-secondary';

        // 使用 iOS 风格的图标和文字
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right: 6px; vertical-align: middle;">
                <path d="M5.5 5.5C5.77614 5.22386 6.22386 5.22386 6.5 5.5L8 7L9.5 5.5C9.77614 5.22386 10.2239 5.22386 10.5 5.5C10.7761 5.77614 10.7761 6.22386 10.5 6.5L9 8L10.5 9.5C10.7761 9.77614 10.7761 10.2239 10.5 10.5C10.2239 10.7761 9.77614 10.7761 9.5 10.5L8 9L6.5 10.5C6.22386 10.7761 5.77614 10.7761 5.5 10.5C5.22386 10.2239 5.22386 9.77614 5.5 9.5L7 8L5.5 6.5C5.22386 6.22386 5.22386 5.77614 5.5 5.5Z" fill="currentColor"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5Z" fill="currentColor"/>
            </svg>
            <span style="vertical-align: middle;">清空</span>
        `;

        applyButtonStyle(button, CONFIG.secondaryButtonStyle);

        // iOS 风格的悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#E5E5EA';
            button.style.transform = 'scale(1.02) translateY(-1px)';
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#F2F2F7';
            button.style.transform = 'scale(1) translateY(0)';
            button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        });

        // 按下效果
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.98) translateY(0)';
            button.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1.02) translateY(-1px)';
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
        });

        button.addEventListener('click', () => {
            // iOS 风格的确认对话框
            showIOSConfirm('确定要清空所有已填写的内容吗？', () => {
                clearAllInputs();
            });
        });

        return button;
    }

    /**
     * iOS 风格的确认对话框
     */
    function showIOSConfirm(message, onConfirm) {
        // 如果浏览器支持，尝试使用原生确认框，否则使用自定义样式
        if (confirm(message)) {
            onConfirm();
        }
    }

    /**
     * iOS 风格的提示框
     */
    function showIOSAlert(title, message, type = 'success') {
        // 创建 iOS 风格的提示框
        const alertBox = document.createElement('div');
        alertBox.className = 'ios-alert-overlay';

        const iconMap = {
            success: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" fill="#34C759" opacity="0.15"/>
                <path d="M20 24L22.5 26.5L28 21" stroke="#34C759" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="24" cy="24" r="20" stroke="#34C759" stroke-width="2"/>
            </svg>`,
            error: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" fill="#FF3B30" opacity="0.15"/>
                <path d="M19 19L29 29M29 19L19 29" stroke="#FF3B30" stroke-width="3" stroke-linecap="round"/>
                <circle cx="24" cy="24" r="20" stroke="#FF3B30" stroke-width="2"/>
            </svg>`,
            info: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" fill="#007AFF" opacity="0.15"/>
                <path d="M24 20V28M24 16V17" stroke="#007AFF" stroke-width="3" stroke-linecap="round"/>
                <circle cx="24" cy="24" r="20" stroke="#007AFF" stroke-width="2"/>
            </svg>`
        };

        alertBox.innerHTML = `
            <div class="ios-alert-box">
                <div class="ios-alert-icon">${iconMap[type] || iconMap.success}</div>
                <div class="ios-alert-title">${title}</div>
                <div class="ios-alert-message">${message}</div>
                <button class="ios-alert-button" onclick="this.closest('.ios-alert-overlay').remove()">好的</button>
            </div>
        `;

        document.body.appendChild(alertBox);

        // 3秒后自动关闭
        setTimeout(() => {
            if (alertBox.parentNode) {
                alertBox.style.opacity = '0';
                setTimeout(() => alertBox.remove(), 300);
            }
        }, 3000);
    }

    /**
     * 清空所有输入
     */
    function clearAllInputs() {
        try {
            const zbSizeElement = document.getElementById('zbSize');
            if (zbSizeElement) {
                const zbSize = parseInt(zbSizeElement.value);

                for (let i = 0; i < zbSize; i++) {
                    const inputElement = document.getElementById(`sel_scorecj${i}`);
                    if (inputElement) {
                        inputElement.value = '';
                    }
                }
            }

            const wjSizeElement = document.getElementById('wjSize');
            if (wjSizeElement) {
                const wjSize = parseInt(wjSizeElement.value);

                for (let i = 0; i < wjSize; i++) {
                    const textareaElement = document.getElementById(`area${i}`);
                    if (textareaElement) {
                        textareaElement.value = '';
                    }
                }
            }

            showIOSAlert('清空完成', '已清空所有内容', 'success');
        } catch (error) {
            console.error('清空时出错:', error);
            showIOSAlert('清空失败', error.message, 'error');
        }
    }

    /**
     * 初始化脚本
     */
    async function init() {
        try {
            console.log('ZZULI教学评价一键满分脚本已启动');

            // 等待表单加载
            await waitForElement('#ActionForm');
            console.log('表单已加载');

            // 等待提交按钮容器
            await waitForElement('#butSave');
            console.log('提交按钮已找到');

            // 找到按钮容器
            const submitButton = document.getElementById('butSave');
            const buttonContainer = submitButton.parentElement;

            // 创建按钮组容器
            const buttonGroup = document.createElement('div');
            buttonGroup.style.display = 'inline-block';
            buttonGroup.style.marginRight = '10px';

            // 创建并添加一键满分按钮
            const fullScoreButton = createFullScoreButton();
            buttonGroup.appendChild(fullScoreButton);

            // 创建并添加清空按钮
            const clearButton = createClearButton();
            buttonGroup.appendChild(clearButton);

            // 插入到提交按钮之前
            buttonContainer.insertBefore(buttonGroup, submitButton);

            console.log('✅ 一键满分按钮已成功添加');

            // 添加快捷键支持 (Ctrl+Q 或 Cmd+Q)
            document.addEventListener('keydown', (event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'q') {
                    event.preventDefault();
                    fillFullScore();
                }
            });

            console.log('✅ 快捷键已启用: Ctrl/Cmd + Q');

        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    /**
     * 添加 iOS 风格样式
     */
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* iOS 按钮基础样式 */
            .ios-button {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                user-select: none;
                -webkit-user-select: none;
                -webkit-tap-highlight-color: transparent;
            }

            .ios-button:focus {
                outline: none;
            }

            .ios-button:active {
                transform: scale(0.98) translateY(0) !important;
            }

            /* iOS 提示框遮罩层 */
            .ios-alert-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 1;
                transition: opacity 0.3s ease;
            }

            /* iOS 提示框主体 */
            .ios-alert-box {
                background: #FFFFFF;
                border-radius: 20px;
                padding: 32px 28px 24px;
                min-width: 280px;
                max-width: 340px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                text-align: center;
            }

            /* iOS 提示框图标 */
            .ios-alert-icon {
                margin: 0 auto 16px;
                animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* iOS 提示框标题 */
            .ios-alert-title {
                font-size: 20px;
                font-weight: 600;
                color: #1C1C1E;
                margin-bottom: 8px;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
                letter-spacing: 0.3px;
            }

            /* iOS 提示框消息 */
            .ios-alert-message {
                font-size: 14px;
                color: #3A3A3C;
                line-height: 1.6;
                margin-bottom: 24px;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
                white-space: pre-line;
            }

            /* iOS 提示框按钮 */
            .ios-alert-button {
                width: 100%;
                background: #007AFF;
                color: #FFFFFF;
                border: none;
                border-radius: 12px;
                padding: 14px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                letter-spacing: 0.3px;
            }

            .ios-alert-button:hover {
                background: #0051D5;
                transform: scale(1.02);
            }

            .ios-alert-button:active {
                transform: scale(0.98);
                background: #004BB5;
            }

            /* 动画定义 */
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes slideUp {
                from {
                    transform: translateY(40px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @keyframes scaleIn {
                0% {
                    transform: scale(0);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            /* 响应式设计 - 移动端优化 */
            @media screen and (max-width: 768px) {
                .ios-alert-box {
                    min-width: 260px;
                    max-width: 90vw;
                    padding: 28px 24px 20px;
                }

                .ios-alert-title {
                    font-size: 18px;
                }

                .ios-alert-message {
                    font-size: 13px;
                }

                .ios-alert-button {
                    padding: 12px;
                    font-size: 15px;
                }
            }

            /* 暗色模式支持 */
            @media (prefers-color-scheme: dark) {
                .ios-alert-box {
                    background: #1C1C1E;
                }

                .ios-alert-title {
                    color: #FFFFFF;
                }

                .ios-alert-message {
                    color: #EBEBF5;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addCustomStyles();
            init();
        });
    } else {
        addCustomStyles();
        init();
    }

})();
