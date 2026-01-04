// ==UserScript==
// @name         自动继续学习助手2
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动检测并点击学习提示的确定按钮
// @author       Assistant
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554184/%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B2.user.js
// @updateURL https://update.greasyfork.org/scripts/554184/%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置项 - 可根据需要修改
    const config = {
        // 监控间隔（毫秒）
        checkInterval: 1000,
        // 目标文本（支持正则表达式）
        targetText: /你已学习了\d+分钟,继续学习请按确定，从头学习请按取消/,
        // 按钮文本匹配（可以是字符串、正则表达式或数组）
        buttonText: ['确定', '确认', '继续学习', '是', 'OK', 'Yes'],
        // 是否启用控制台日志
        enableLog: true
    };

    // 日志函数
    function log(...args) {
        if (config.enableLog) {
            console.log('[自动继续学习]', ...args);
        }
    }

    // 查找按钮元素
    function findConfirmButton() {
        // 常见的按钮选择器
        const buttonSelectors = [
            'button',
            'input[type="button"]',
            'input[type="submit"]',
            '.btn',
            '.button',
            '[class*="btn"]',
            '[class*="button"]',
            '[onclick]',
            'a[onclick]'
        ];

        const buttonTexts = Array.isArray(config.buttonText) ? config.buttonText : [config.buttonText];

        for (const selector of buttonSelectors) {
            const buttons = document.querySelectorAll(selector);
            for (const button of buttons) {
                const buttonText = button.textContent?.trim() || button.value || button.getAttribute('title') || '';
                if (!buttonText) continue;
                
                for (const targetText of buttonTexts) {
                    let isMatch = false;
                    if (targetText instanceof RegExp) {
                        isMatch = targetText.test(buttonText);
                    } else {
                        isMatch = buttonText.includes(targetText);
                    }
                    
                    if (isMatch) {
                        // 检查按钮是否可见和可点击
                        const style = window.getComputedStyle(button);
                        if (style.display !== 'none' && style.visibility !== 'hidden' && 
                            !button.disabled && style.opacity !== '0') {
                            return button;
                        }
                    }
                }
            }
        }
        return null;
    }

    // 检查页面是否包含目标文本
    function containsTargetText() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent.trim();
            if (config.targetText instanceof RegExp) {
                if (config.targetText.test(text)) {
                    return true;
                }
            } else if (text.includes(config.targetText)) {
                return true;
            }
        }
        return false;
    }

    // 主检查函数
    function checkAndClick() {
        if (containsTargetText()) {
            log('检测到学习提示框');
            const button = findConfirmButton();
            
            if (button) {
                log('找到确定按钮，准备点击');
                
                // 模拟真实点击事件
                try {
                    // 先触发鼠标事件模拟真实交互
                    button.dispatchEvent(new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                    
                    button.dispatchEvent(new MouseEvent('mouseup', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                    
                    button.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                    
                    // 最后执行实际点击
                    button.click();
                    log('成功点击确定按钮');
                    return true;
                } catch (error) {
                    log('点击过程中发生错误:', error);
                }
            } else {
                log('未找到匹配的确定按钮');
            }
        }
        return false;
    }

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // 延迟检查以确保新内容完全加载
                setTimeout(() => {
                    if (!checkAndClick()) {
                        // 如果初次检查没找到，再尝试一次
                        setTimeout(checkAndClick, 500);
                    }
                }, 300);
            }
        }
    });

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        log('脚本已加载，正在初始化...');
        
        // 开始监听 DOM 变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 初始检查
        setTimeout(checkAndClick, 1000);
        
        // 定时检查（作为备用方案）
        const intervalId = setInterval(checkAndClick, config.checkInterval);
        
        // 页面可见性变化时重新检查
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                setTimeout(checkAndClick, 500);
            }
        });
        
        // 提供手动控制方法（在控制台中使用）
        window.AutoContinueStudy = {
            check: checkAndClick,
            forceClick: function() {
                const button = findConfirmButton();
                if (button) {
                    button.click();
                    log('强制点击按钮');
                }
            }
        };
        
        log('初始化完成，开始监控学习提示...');
    }
})();