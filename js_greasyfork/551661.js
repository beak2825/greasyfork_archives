// ==UserScript==
// @name         Bilibili直播间自动点赞 (定时+按钮版)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  在B站直播间“点赞”按钮前增加一个控制按钮，点击或按小键盘【-】键可启动持续10分钟的自动点赞（0.3秒/次），期间可再次操作提前停止。
// @author       Gemini
// @match        https://live.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551661/Bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%20%28%E5%AE%9A%E6%97%B6%2B%E6%8C%89%E9%92%AE%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551661/Bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%20%28%E5%AE%9A%E6%97%B6%2B%E6%8C%89%E9%92%AE%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const clickInterval = 300;      // 每次点击的间隔时间（毫秒），300毫秒 = 0.3秒
    const duration = 10 * 60 * 1000; // 自动点赞的总时长（10分钟）

    // --- 全局变量 ---
    let intervalId = null;       // 存储点赞定时器的ID
    let stopTimeoutId = null;    // 存储自动停止的定时器ID
    let toggleButton = null;     // 存储我们创建的按钮元素

    // --- 核心功能：切换自动点赞状态 ---
    function toggleAutoLike() {
        if (intervalId) {
            // 如果正在运行，则停止
            clearInterval(intervalId);
            clearTimeout(stopTimeoutId);
            intervalId = null;
            stopTimeoutId = null;
            console.log('自动点赞已停止。');
            updateButtonState(false); // 更新按钮为“未运行”状态
        } else {
            // 如果未运行，则启动
            console.log(`自动点赞已启动，将持续10分钟。间隔: ${clickInterval}ms`);
            triggerClick(); // 立即执行一次
            intervalId = setInterval(triggerClick, clickInterval);
            updateButtonState(true); // 更新按钮为“运行中”状态

            // 设置10分钟后自动停止
            stopTimeoutId = setTimeout(() => {
                if (intervalId) { // 再次检查以防被手动停止
                    clearInterval(intervalId);
                    intervalId = null;
                    console.log('自动点赞已达到10分钟，自动停止。');
                    updateButtonState(false);
                }
            }, duration);
        }
    }

    // --- 模拟点击操作 ---
    function triggerClick() {
        const likeButton = document.querySelector('.like-btn');
        if (!likeButton) {
            console.log('未找到点赞按钮，任务已停止。');
            if(intervalId) { // 如果找不到按钮，则强制停止所有任务
                toggleAutoLike();
            }
        } else {
            likeButton.click();
        }
    }

    // --- 更新按钮的文本和样式 ---
    function updateButtonState(isRunning) {
        if (toggleButton) {
            if (isRunning) {
                toggleButton.textContent = '停止点赞';
                toggleButton.style.backgroundColor = '#e74c3c'; // 红色
                toggleButton.style.borderColor = '#c0392b';
            } else {
                toggleButton.textContent = '自动赞10min';
                toggleButton.style.backgroundColor = '#3498db'; // 蓝色
                toggleButton.style.borderColor = '#2980b9';
            }
        }
    }

    // --- 创建并插入控制按钮 ---
    function createToggleButton() {
        // 检查按钮是否已存在，或点赞按钮还未加载
        if (document.getElementById('auto-like-toggle-btn') || !document.querySelector('.like-btn')) {
            return;
        }

        const likeButton = document.querySelector('.like-btn');
        toggleButton = document.createElement('button');
        toggleButton.id = 'auto-like-toggle-btn';

        // 设置按钮样式
        Object.assign(toggleButton.style, {
            marginRight: '8px',
            padding: '0 10px',
            border: '1px solid',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            height: likeButton.offsetHeight + 'px', // 高度与原生按钮保持一致
            color: 'white',
            transition: 'background-color 0.3s'
        });

        updateButtonState(false); // 初始化按钮状态

        // 为按钮添加点击事件
        toggleButton.addEventListener('click', toggleAutoLike);

        // 将按钮插入到原生点赞按钮的前面
        likeButton.parentNode.insertBefore(toggleButton, likeButton);
        console.log('自动点赞控制按钮已加载。');
    }

    // --- 事件监听 ---
    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        if (event.code === 'NumpadSubtract') {
            toggleAutoLike();
        }
    });

    // --- 初始化 ---
    // B站页面是动态加载的，所以需要定时检查点赞按钮是否出现，以便插入我们的按钮
    const initInterval = setInterval(() => {
        if (document.querySelector('.like-btn')) {
            createToggleButton();
            clearInterval(initInterval); // 找到并创建按钮后，停止检查
        }
    }, 1000); // 每秒检查一次

})();