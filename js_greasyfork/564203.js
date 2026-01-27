// ==UserScript==
// @name         RockyIdle 杀手任务自动脚本
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动执行 RockyIdle 杀手任务
// @author       You
// @match        https://rockyidle.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564203/RockyIdle%20%E6%9D%80%E6%89%8B%E4%BB%BB%E5%8A%A1%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/564203/RockyIdle%20%E6%9D%80%E6%89%8B%E4%BB%BB%E5%8A%A1%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let toggleButton;

    // 创建悬浮按钮
    function createToggleButton() {
        toggleButton = document.createElement('div');
        toggleButton.innerHTML = '杀手任务<br>▶ 开始';
        toggleButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 90px;
            height: 45px;
            background: #667eea;
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: move;
            z-index: 10000;
            font-weight: 600;
            font-size: 13px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            user-select: none;
            text-align: center;
            line-height: 1.3;
            will-change: transform;
        `;

        // 拖动功能 - 优化版
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        toggleButton.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            // 获取当前位置
            const rect = toggleButton.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            // 移除 transition 以实现流畅拖动
            toggleButton.style.transition = 'none';
            toggleButton.style.right = 'auto';

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            // 使用 transform 代替 left/top，性能更好
            toggleButton.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;

            isDragging = false;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // 应用最终位置
            toggleButton.style.left = (startLeft + deltaX) + 'px';
            toggleButton.style.top = (startTop + deltaY) + 'px';
            toggleButton.style.transform = '';

            // 判断是否为点击
            if (moveDistance < 5) {
                toggleScript();
            }
        });

        document.body.appendChild(toggleButton);
    }

    // 切换脚本运行状态
    function toggleScript() {
        isRunning = !isRunning;
        if (isRunning) {
            toggleButton.innerHTML = '杀手任务<br>⏸ 暂停';
            toggleButton.style.background = '#f5576c';
            console.log('脚本已启动');
            runScript();
        } else {
            toggleButton.innerHTML = '杀手任务<br>▶ 开始';
            toggleButton.style.background = '#667eea';
            console.log('脚本已暂停');
        }
    }

    // 等待函数
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 查找并点击元素
    function clickElement(selector, altText = null) {
        let element;
        if (altText) {
            const images = document.querySelectorAll('img');
            for (let img of images) {
                if (img.alt === altText) {
                    element = img;
                    break;
                }
            }
        } else {
            element = document.querySelector(selector);
        }

        if (element) {
            // 点击父级 <a> 标签而不是 img 本身
            const parentLink = element.closest('a');
            if (parentLink) {
                parentLink.click();
            } else {
                element.click();
            }
            return true;
        }
        return false;
    }

    // 检查元素是否存在
    function checkElement(altText) {
        const images = document.querySelectorAll('img');
        for (let img of images) {
            if (img.alt === altText) {
                return true;
            }
        }
        return false;
    }

    // 主脚本逻辑
    async function runScript() {
        while (isRunning) {
            try {
                // 步骤1: 检查杀手怪物分页图标是否存在
                console.log('步骤1: 检查杀手怪物分页图标是否存在');
                let monsterIconExists = checkElement('Slayer Monster Category');
                await wait(1000);

                if (monsterIconExists) {
                    // 步骤2: 如果在任务中，等待5秒后再次检查
                    console.log('步骤2: 杀手怪物分页图标存在，任务进行中，等待5秒');
                    await wait(5000);

                    const stillExists = checkElement('Slayer Monster Category');

                    if (!stillExists) {
                        // 任务完成，需要重新获取
                        console.log('任务已完成，准备重新获取任务');
                        continue;
                    } else {
                        // 任务还在进行，继续循环
                        console.log('任务继续中...');
                        continue;
                    }
                } else {
                    // 步骤3: 杀手怪物分页图标不存在，点击进入杀手界面
                    console.log('步骤3: 杀手怪物分页图标不存在，点击进入杀手界面');
                    const slayerIconPrefix = 'data:image/webp;base64,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';

                    const skillImages = document.querySelectorAll('img[alt="skillId"]');
                    let slayerSkillClicked = false;

                    for (let img of skillImages) {
                        if (img.src.startsWith(slayerIconPrefix)) {
                            const parentA = img.closest('a');
                            if (parentA) {
                                parentA.click();
                                slayerSkillClicked = true;
                                console.log('找到并点击了杀手技能图标');
                                break;
                            }
                        }
                    }

                    if (!slayerSkillClicked) {
                        console.log('警告：未找到杀手技能图标');
                    }
                    await wait(1000);

                    // 步骤4: 点击获取任务按钮
                    console.log('步骤4: 点击获取任务');
                    const buttons = document.querySelectorAll('button');
                    let getTaskButton = null;
                    for (let btn of buttons) {
                        if (btn.textContent.includes('获取任务')) {
                            getTaskButton = btn;
                            break;
                        }
                    }
                    if (getTaskButton) {
                        getTaskButton.click();
                        console.log('已点击获取任务按钮');
                        await wait(1000);
                    } else {
                        console.log('警告：未找到获取任务按钮');
                    }

                    // 步骤5: 点击杀手怪物分页图标
                    console.log('步骤5: 点击杀手怪物分页图标');
                    clickElement(null, 'Slayer Monster Category');
                    await wait(1000);

                    // 步骤6: 点击第一个战斗按钮
                    console.log('步骤6: 点击战斗按钮');
                    const battleButtons = document.querySelectorAll('button');
                    for (let btn of battleButtons) {
                        if (btn.textContent.includes('战斗') && btn.classList.contains('bg-green-700')) {
                            btn.click();
                            console.log('已点击战斗按钮');
                            break;
                        }
                    }
                    await wait(1000);
                }

                // 步骤7: 从头开始循环
                console.log('步骤7: 准备重新循环');

            } catch (error) {
                console.error('脚本执行出错:', error);
                await wait(2000);
            }
        }
    }

    // 初始化
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createToggleButton);
        } else {
            createToggleButton();
        }
    }

    init();
})();