// ==UserScript==
// @name         B站单集循环控制按钮
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  在B站播放器右侧添加单集循环控制按钮，默认强制关闭单集循环，按钮默认隐藏一半
// @author       Your Name
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548207/B%E7%AB%99%E5%8D%95%E9%9B%86%E5%BE%AA%E7%8E%AF%E6%8E%A7%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/548207/B%E7%AB%99%E5%8D%95%E9%9B%86%E5%BE%AA%E7%8E%AF%E6%8E%A7%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待元素或条件满足
    function waitFor(condition, callback, interval = 300, timeout = 15000) {
        const start = Date.now();
        const checkInterval = setInterval(() => {
            if (condition()) {
                clearInterval(checkInterval);
                callback();
            } else if (Date.now() - start > timeout) {
                clearInterval(checkInterval);
                console.log('等待超时');
            }
        }, interval);
    }

    // 查找单集循环复选框
    function getLoopCheckbox() {
        return document.querySelector('.bui-switch-input[aria-label="单集循环"]');
    }

    // 查找单集循环开关容器
    function getLoopSwitch() {
        const checkbox = getLoopCheckbox();
        return checkbox ? checkbox.closest('.bui-switch') : null;
    }

    // 检查当前单集循环状态（以UI为准）
    function isLoopEnabled() {
        const checkbox = getLoopCheckbox();
        return checkbox ? checkbox.checked : false;
    }

    // 强制设置单集循环状态
    function setLoopState(enabled) {
        const currentState = isLoopEnabled();
        if (currentState !== enabled) {
            const switchEl = getLoopSwitch();
            if (switchEl) {
                // 先尝试直接设置复选框状态
                const checkbox = getLoopCheckbox();
                if (checkbox) {
                    checkbox.checked = enabled;
                    // 触发change事件
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // 再模拟点击确保生效
                setTimeout(() => {
                    if (isLoopEnabled() !== enabled) {
                        switchEl.click();
                    }
                }, 100);

                return true;
            }
        }
        return false;
    }

    // 确保单集循环处于关闭状态（核心功能）
    function ensureLoopOff() {
        // 多次尝试确保关闭成功
        let attempts = 0;
        const maxAttempts = 5;

        function tryDisable() {
            if (isLoopEnabled()) {
                setLoopState(false);
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(tryDisable, 500);
                } else {
                    console.log('已尝试多次关闭单集循环');
                }
            }
        }

        tryDisable();
    }

    // 更新按钮显示状态
    function updateButtonState() {
        const button = document.getElementById('custom-loop-button');
        if (button) {
            const isOn = isLoopEnabled();
            button.textContent = `${isOn ? '↩️' : '🔄'}`;
            button.style.backgroundColor = isOn ? '#FB7299' : '#1c1e25';
        }
    }

    // 创建悬浮按钮
    function createFloatButton() {
        // 移除已存在的按钮
        const existingButton = document.getElementById('custom-loop-button');
        if (existingButton) {
            existingButton.remove();
        }

        const button = document.createElement('button');
        button.id = 'custom-loop-button';
        button.textContent = '🔄';
        button.style.position = 'fixed';
        // 默认隐藏一半在右侧边缘
        button.style.right = '-15px'; // 负数值让一半在屏幕外
        button.style.top = '58%';
        button.style.transform = 'translateY(-50%)';
        button.style.zIndex = '9999';
        button.style.padding = '10px 10px'; // 增加右侧内边距，确保点击区域足够
        button.style.backgroundColor = '#FB7299';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '50%';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        button.style.transition = 'all 0.3s ease'; // 平滑过渡效果
        button.style.fontWeight = 'bold';
        button.style.fontSize = '14px';
        // 防止按钮被选中
        button.style.userSelect = 'none';

        // 按钮悬停效果 - 完全显示
        button.addEventListener('mouseover', () => {
            button.style.right = '8px'; // 完全显示时的位置
            button.style.transform = 'translateY(-50%) scale(1.05)';
        });

        // 鼠标离开时恢复隐藏一半的状态
        button.addEventListener('mouseout', () => {
            button.style.right = '-15px';
            button.style.transform = 'translateY(-50%)';
        });

        // 点击事件 - 切换单集循环状态
        button.addEventListener('click', () => {
            const currentState = isLoopEnabled();
            setLoopState(!currentState);
            // 延迟更新按钮状态，确保状态已生效
            setTimeout(updateButtonState, 200);
        });

        document.body.appendChild(button);
        console.log('已添加单集循环控制按钮');
        updateButtonState();
    }

    // 初始化函数
    function init() {
        // 等待单集循环控件加载完成
        waitFor(
            () => getLoopCheckbox() !== null,
            () => {
                console.log('检测到单集循环控件，开始初始化');
                // 确保默认关闭
                ensureLoopOff();
                // 创建控制按钮
                createFloatButton();

                // 监听单集循环状态变化，同步按钮显示
                const observer = new MutationObserver(updateButtonState);
                const checkbox = getLoopCheckbox();
                if (checkbox) {
                    observer.observe(checkbox, { attributes: true });
                }

                // 定期检查状态，确保同步
                setInterval(updateButtonState, 1000);
            }
        );
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

    // 监听URL变化，处理视频切换
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            // 延迟初始化，等待新页面加载完成
            setTimeout(init, 1500);
        }
    }, 500);
})();