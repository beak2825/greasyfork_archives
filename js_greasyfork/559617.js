// ==UserScript==
// @name         Milkyway Idle 签到
// @namespace    http://tampermonkey.net/
// @version      1.6
// @license      MIT
// @description  在Milkyway Idle中添加签到按钮，支持普通点击和Ctrl+点击两种模式
// @author       kewu
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559617/Milkyway%20Idle%20%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559617/Milkyway%20Idle%20%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 延迟执行以确保DOM完全加载
        setTimeout(initializeScript, 1000);
    });

    function initializeScript() {
        // 找到Header元素（忽略哈希值）
        const headerElements = document.querySelectorAll('[class^="Header_header"]');
        if (headerElements.length === 0) {
            console.log('未找到Header元素');
            return;
        }

        const header = headerElements[0];
        const headerChildren = header.children;

        if (headerChildren.length < 2) {
            console.log('Header元素子元素不足');
            return;
        }

        // 创建签到按钮
        const signInButton = document.createElement('button');
        signInButton.textContent = '签到';
        signInButton.title = '普通点击：仅显示提示\nCtrl+点击：显示提示并模拟Ctrl+点击物品';
        signInButton.style.cssText = `
            margin: 0 10px;
            padding: 5px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
        `;

        // 添加悬停效果
        signInButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#45a049';
        });

        signInButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#4CAF50';
        });

        // 添加点击事件
        signInButton.addEventListener('click', function(event) {
            // 根据是否按下了Ctrl键决定执行哪种签到方式
            const withCtrlClick = event.ctrlKey || event.metaKey;
            signInProcess(withCtrlClick);

            // 阻止默认行为，避免可能的问题
            event.preventDefault();
        });

        // 在第一个和第二个子元素之间插入按钮
        header.insertBefore(signInButton, headerChildren[1]);

        console.log('签到按钮已添加');
    }

    function signInProcess(withCtrlClick) {
        // 1. 找到物品容器
        const inventoryContainer = document.querySelector('[class^="Inventory_items__"]');
        if (!inventoryContainer) {
            showFeedbackMessage('未找到物品容器', 'error', null);
            console.log('未找到物品容器');
            return;
        }

        // 2. 找到所有可点击的物品
        const itemSelectors = [
            '[class^="Item_item__"][class*="Item_clickable__"]',
            '.Item_item__2De2O.Item_clickable__3viV6'
        ];

        let clickableItems = [];

        // 尝试多种选择器来找到物品
        for (const selector of itemSelectors) {
            const items = inventoryContainer.querySelectorAll(selector);
            if (items.length > 0) {
                clickableItems = Array.from(items);
                break;
            }
        }

        if (clickableItems.length === 0) {
            showFeedbackMessage('未找到可点击的物品', 'error', null);
            console.log('未找到可点击的物品');
            return;
        }

        // 3. 随机选择一个物品
        const randomIndex = Math.floor(Math.random() * clickableItems.length);
        const randomItem = clickableItems[randomIndex];

        // 4. 获取物品信息
        const itemLabel = randomItem.querySelector('[aria-label]')?.getAttribute('aria-label') || '未知物品';
        const countElement = randomItem.querySelector('[class*="Item_count__"]');

        if (!countElement) {
            showFeedbackMessage('未找到数量元素', 'error', null);
            console.log('未找到数量元素');
            return;
        }

        const originalCountText = countElement.textContent || '0';

        // 5. 生成1-100的随机数
        const randomAddition = Math.floor(Math.random() * 100) + 1;

        // 6. 解析数量并加随机数，然后更新到库存中
        const newCountText = addRandomToCount(originalCountText, randomAddition);
        countElement.textContent = newCountText;

        console.log(`随机选中物品: ${itemLabel} (原数量: ${originalCountText}, 增加: ${randomAddition}, 新数量: ${newCountText})`);

        // 7. 根据参数决定是否模拟Ctrl键点击选中的物品
        if (withCtrlClick) {
            simulateCtrlClick(randomItem);
            showFeedbackMessage(`签到成功！恭喜获得 ${itemLabel}`, 'success', randomItem, randomAddition);
            console.log('已模拟Ctrl+点击物品');
        } else {
            showFeedbackMessage(`签到成功！恭喜获得 ${itemLabel}`, 'success', randomItem, randomAddition);
            console.log('仅显示提示，未模拟点击物品');
        }
    }

    function addRandomToCount(countText, randomAddition) {
        try {
            // 移除逗号等千位分隔符
            let cleanText = countText.replace(/,/g, '');

            // 解析数字部分和单位部分
            const match = cleanText.match(/^([0-9]+(?:\.[0-9]+)?)([a-zA-Z]*)$/);

            if (match) {
                const numberPart = match[1];
                const unitPart = match[2];
                const numberValue = parseFloat(numberPart);

                // 数字加随机数
                const newNumberValue = numberValue + randomAddition;

                // 重新组合成字符串，保留原格式（如果是整数则不加小数点）
                let newNumberPart;
                if (numberPart.includes('.')) {
                    // 原数字有小数点，保持相同精度
                    const decimalPlaces = numberPart.split('.')[1].length;
                    newNumberPart = newNumberValue.toFixed(decimalPlaces);
                } else {
                    // 原数字是整数
                    newNumberPart = newNumberValue.toString();
                }

                // 移除可能多余的.0
                if (newNumberPart.endsWith('.0')) {
                    newNumberPart = newNumberPart.slice(0, -2);
                }

                return newNumberPart + unitPart;
            } else {
                // 如果无法解析，尝试直接当作数字处理
                const numberValue = parseFloat(cleanText);
                if (!isNaN(numberValue)) {
                    return (numberValue + randomAddition).toString();
                }
            }
        } catch (error) {
            console.warn('解析数量时出错:', error, countText);
        }

        // 如果解析失败，返回原文本
        return countText;
    }

    function simulateCtrlClick(element) {
        // 创建模拟Ctrl键按下的鼠标事件
        const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            ctrlKey: true, // 模拟Ctrl键按下
            buttons: 1 // 左键
        });

        const mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            ctrlKey: true, // 模拟Ctrl键按下
            buttons: 0
        });

        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            ctrlKey: true // 模拟Ctrl键按下
        });

        // 触发事件序列
        try {
            element.dispatchEvent(mouseDownEvent);
            element.dispatchEvent(mouseUpEvent);
            element.dispatchEvent(clickEvent);
        } catch (error) {
            console.error('模拟点击时出错:', error);
        }
    }

    function showFeedbackMessage(message, type = 'success', itemElement = null, randomAddition = null) {
        // 移除之前可能存在的反馈消息
        const existingFeedback = document.getElementById('signin-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // 根据类型设置颜色
        let backgroundColor = '#4CAF50'; // 成功 - 绿色
        if (type === 'error') backgroundColor = '#f44336'; // 错误 - 红色
        if (type === 'info') backgroundColor = '#2196F3'; // 信息 - 蓝色

        // 创建反馈消息元素
        const feedback = document.createElement('div');
        feedback.id = 'signin-feedback';

        // 设置反馈消息样式
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${backgroundColor};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            animation: fadeInOut 3s ease-in-out;
            max-width: 350px;
            word-wrap: break-word;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        // 如果有物品元素，复制物品显示部分
        let itemClone = null;
        if (itemElement) {
            try {
                // 克隆物品元素
                itemClone = itemElement.cloneNode(true);

                // 清理克隆元素的样式和内容
                itemClone.style.cssText = `
                    width: 40px;
                    height: 40px;
                    min-width: 40px;
                    min-height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    padding: 5px;
                `;

                // 移除数量显示
                const countElement = itemClone.querySelector('[class*="Item_count__"]');
                if (countElement) {
                    countElement.style.display = 'none';
                }

                // 调整图标容器大小
                const iconContainer = itemClone.querySelector('[class*="Item_iconContainer__"]');
                if (iconContainer) {
                    iconContainer.style.cssText = `
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    `;
                }

                // 调整SVG大小
                const svgElement = itemClone.querySelector('svg');
                if (svgElement) {
                    svgElement.style.cssText = `
                        width: 30px;
                        height: 30px;
                    `;
                }
            } catch (error) {
                console.warn('克隆物品元素时出错:', error);
            }
        }

        // 创建文本容器
        const textContainer = document.createElement('div');

        // 构建消息文本
        let finalMessage = message;
        if (randomAddition !== null) {
            // 如果有随机增加数量，在消息末尾添加橙色部分
            const baseSpan = document.createElement('span');
            baseSpan.textContent = message;

            const additionSpan = document.createElement('span');
            additionSpan.textContent = ` (+${randomAddition})`;
            additionSpan.style.color = '#ff9800'; // 橙色
            additionSpan.style.fontWeight = 'bold';

            textContainer.appendChild(baseSpan);
            textContainer.appendChild(additionSpan);
        } else {
            // 没有随机增加数量，直接显示消息
            textContainer.textContent = message;
        }

        textContainer.style.flex = '1';
        textContainer.style.minWidth = '0'; // 允许文本容器收缩

        // 组装反馈消息
        if (itemClone) {
            feedback.appendChild(itemClone);
        }
        feedback.appendChild(textContainer);

        // 添加CSS动画
        if (!document.querySelector('#signin-feedback-style')) {
            const style = document.createElement('style');
            style.id = 'signin-feedback-style';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(-20px); }
                    10% { opacity: 1; transform: translateY(0); }
                    90% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(feedback);

        // 3秒后自动移除
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 3000);
    }

    // 如果页面已经加载完成，直接初始化
    if (document.readyState === 'complete') {
        setTimeout(initializeScript, 1000);
    }
})();