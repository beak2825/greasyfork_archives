// ==UserScript==
// @name         BOSS直聘自动删除消息
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动化删除BOSS直聘聊天消息
// @author       You
// @match        https://www.zhipin.com/web/geek/chat*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554894/BOSS%E7%9B%B4%E8%81%98%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E6%B6%88%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/554894/BOSS%E7%9B%B4%E8%81%98%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E6%B6%88%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let deleteCount = 0;

    // 创建开始按钮
    function createStartButton() {
        const button = document.createElement('button');
        button.id = 'auto-delete-btn';
        button.textContent = '开始自动删除';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 20px;
            background-color: #00b38a;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;

        button.addEventListener('click', toggleAutoDelete);
        document.body.appendChild(button);

        // 创建计数显示
        const counter = document.createElement('div');
        counter.id = 'delete-counter';
        counter.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            z-index: 9999;
            padding: 8px 16px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;
        counter.textContent = `已删除: ${deleteCount}`;
        document.body.appendChild(counter);
    }

    // 切换自动删除状态
    function toggleAutoDelete() {
        isRunning = !isRunning;
        const button = document.getElementById('auto-delete-btn');

        if (isRunning) {
            button.textContent = '停止删除';
            button.style.backgroundColor = '#ff4d4f';
            startAutoDelete();
        } else {
            button.textContent = '开始自动删除';
            button.style.backgroundColor = '#00b38a';
        }
    }

    // 更新计数显示
    function updateCounter() {
        const counter = document.getElementById('delete-counter');
        if (counter) {
            counter.textContent = `已删除: ${deleteCount}`;
        }
    }

    // 等待元素出现
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
                reject(new Error('元素未找到: ' + selector));
            }, timeout);
        });
    }

    // 延迟函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 执行单次删除流程
    async function performDelete() {
        try {
            // 第一步：点击第一个聊天项
            console.log('步骤1: 点击聊天项...');
            const chatItem = document.querySelector("#container > div > div > div.list-warp.v2 > div > div.chat-content > div > div > ul:nth-child(2) > li:nth-child(1) > div > div > div.text > div.title-box");
            if (!chatItem) {
                console.log('没有找到聊天项，可能已全部删除');
                return false;
            }
            chatItem.click();
            await sleep(1000);

            // 第二步：点击下拉菜单
            console.log('步骤2: 打开下拉菜单...');
            const dropdownBtn = document.querySelector("#container > div > div > div.chat-conversation.v2 > div.top-info-content > div.user-info-wrap > div > div.right-content > div > div.ui-dropmenu-label > div");
            if (!dropdownBtn) {
                console.log('未找到下拉菜单按钮');
                return false;
            }
            dropdownBtn.click();
            await sleep(500);

            // 第三步：点击删除选项
            console.log('步骤3: 点击删除选项...');
            const deleteOption = document.querySelector("#container > div > div > div.chat-conversation.v2 > div.top-info-content > div.user-info-wrap > div > div.right-content > div > div.ui-dropmenu-list > div > ul > li:nth-child(5) > span");
            if (!deleteOption) {
                console.log('未找到删除选项');
                return false;
            }
            deleteOption.click();
            await sleep(500);

            // 第四步：等待确认对话框并点击确定
            console.log('步骤4: 等待确认对话框...');
            const confirmBtn = await waitForElement('.boss-dialog__footer .boss-dialog__button:not(.button-outline)', 3000);
            if (!confirmBtn) {
                console.log('未找到确认按钮');
                return false;
            }
            confirmBtn.click();

            deleteCount++;
            updateCounter();
            console.log(`成功删除第 ${deleteCount} 条消息`);

            return true;
        } catch (error) {
            console.error('删除过程出错:', error);
            return false;
        }
    }

    // 开始自动删除循环
    async function startAutoDelete() {
        while (isRunning) {
            const success = await performDelete();

            if (!success) {
                console.log('删除失败或已完成，停止自动删除');
                isRunning = false;
                const button = document.getElementById('auto-delete-btn');
                button.textContent = '开始自动删除';
                button.style.backgroundColor = '#00b38a';
                break;
            }

            // 等待3-5秒后继续
            const waitTime = 3000 + Math.random() * 2000;
            console.log(`等待 ${(waitTime/1000).toFixed(1)} 秒后继续...`);
            await sleep(waitTime);
        }
    }

    // 页面加载完成后创建按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createStartButton);
    } else {
        createStartButton();
    }

})();
