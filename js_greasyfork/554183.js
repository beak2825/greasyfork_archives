// ==UserScript==
// @name         自动继续学习助手
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  自动检测并点击“您已学习10分钟，是否继续学习”的确定按钮
// @author       Assistant
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554183/%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/554183/%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项 - 可根据需要修改
    const config = {
        // 监控间隔（毫秒）
        checkInterval: 2000,
        // 目标文本（支持正则表达式）
        targetText: /您已学习10分钟，是否继续学习/,
        // 按钮文本匹配（可以是字符串、正则表达式或数组）
        buttonText: ['确定', '确认', '继续学习', '是', 'OK', 'Yes'],
        // 是否启用控制台日志
        enableLog: true,
        // 最大重试次数
        maxRetries: 3
    };

    let retryCount = 0;
    let isMonitoring = false;

    // 日志函数
    function log(...args) {
        if (config.enableLog) {
            console.log('[自动继续学习]', ...args);
        }
    }

    // 查找包含指定文本的元素
    function findElementByText(selector, textPattern) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
            const elementText = element.textContent.trim();
            if (textPattern instanceof RegExp) {
                if (textPattern.test(elementText)) {
                    return element;
                }
            } else if (elementText.includes(textPattern)) {
                return element;
            }
        }
        return null;
    }

    // 查找按钮元素
    function findButton() {
        // 常见的按钮选择器
        const buttonSelectors = [
            'button',
            'input[type="button"]',
            'input[type="submit"]',
            '.btn',
            '.button',
            '[class*="btn"]',
            '[class*="button"]',
            '[onclick*="confirm"]',
            '[onclick*="continue"]'
        ];

        const buttonTexts = Array.isArray(config.buttonText) ? config.buttonText : [config.buttonText];

        for (const selector of buttonSelectors) {
            const buttons = document.querySelectorAll(selector);
            for (const button of buttons) {
                const buttonText = button.textContent.trim() || button.value || '';
                for (const targetText of buttonTexts) {
                    if (targetText instanceof RegExp) {
                        if (targetText.test(buttonText)) {
                            return button;
                        }
                    } else if (buttonText.includes(targetText)) {
                        return button;
                    }
                }
            }
        }
        return null;
    }

    // 检查并点击确定按钮
    function checkAndClick() {
        // 查找提示文本
        const textElements = document.querySelectorAll('body *:not(script):not(style)');
        let foundPrompt = false;

        for (const element of textElements) {
            if (element.children.length === 0) {
                const text = element.textContent.trim();
                if (config.targetText instanceof RegExp) {
                    if (config.targetText.test(text)) {
                        foundPrompt = true;
                        break;
                    }
                } else if (text.includes(config.targetText)) {
                    foundPrompt = true;
                    break;
                }
            }
        }

        if (foundPrompt) {
            log('检测到继续学习提示框');
            const button = findButton();
            
            if (button) {
                log('找到按钮:', button.textContent || button.value);
                
                // 模拟真实点击
                try {
                    button.click();
                    log('成功点击确定按钮');
                    retryCount = 0;
                    return true;
                } catch (error) {
                    log('点击失败:', error);
                }
            } else {
                log('未找到匹配的按钮，尝试备用方案');
                
                // 备用方案：尝试通过事件触发
                const event = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                
                const allButtons = document.querySelectorAll('button, input[type="button"]');
                for (const btn of allButtons) {
                    const btnText = btn.textContent.trim() || btn.value || '';
                    if (btnText && (btnText.includes('确定') || btnText.includes('确认'))) {
                        btn.dispatchEvent(event);
                        log('通过备用方案点击按钮');
                        return true;
                    }
                }
                
                retryCount++;
                if (retryCount >= config.maxRetries) {
                    log(`已达到最大重试次数 (${config.maxRetries})，停止监控`);
                    stopMonitoring();
                }
            }
        }
        return false;
    }

    // 开始监控
    function startMonitoring() {
        if (!isMonitoring) {
            isMonitoring = true;
            log('开始监控继续学习提示框...');
            
            // 初始检查
            checkAndClick();
            
            // 定时检查
            const intervalId = setInterval(() => {
                if (!isMonitoring) {
                    clearInterval(intervalId);
                    return;
                }
                checkAndClick();
            }, config.checkInterval);
        }
    }

    // 停止监控
    function stopMonitoring() {
        isMonitoring = false;
        log('停止监控');
    }

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        if (!isMonitoring) return;
        
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // 延迟检查以确保新内容完全加载
                setTimeout(() => {
                    checkAndClick();
                }, 500);
            }
        }
    });

    // 页面加载完成后初始化
    window.addEventListener('load', function() {
        log('脚本已加载，正在初始化...');
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        startMonitoring();
    });

    // 页面可见性变化时重新检查
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(() => {
                checkAndClick();
            }, 1000);
        }
    });

    // 提供手动控制方法（在控制台中使用）
    window.AutoContinueStudy = {
        start: startMonitoring,
        stop: stopMonitoring,
        check: checkAndClick,
        config: config
    };

    log('自动继续学习脚本已加载完成');
})();