// ==UserScript==
// @license MIT
// @name         统一评教助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  单一按钮处理所有评教表单
// @author       You
// @match        https://jwnew.hait.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hait.edu.cn
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/560587/%E7%BB%9F%E4%B8%80%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560587/%E7%BB%9F%E4%B8%80%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 全局唯一按钮标识
    const BUTTON_ID = 'tm-global-eval-btn';

    // 添加全局样式（只添加一次）
    if (!document.getElementById('tm-eval-style')) {
        const style = document.createElement('style');
        style.id = 'tm-eval-style';
        style.textContent = `
            #${BUTTON_ID} {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 12px 20px;
                background: linear-gradient(to right, #4CAF50, #2E7D32);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                z-index: 99999;
                font-size: 16px;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transition: transform 0.2s, box-shadow 0.2s;
                font-family: 'Microsoft YaHei', sans-serif;
            }
            #${BUTTON_ID}:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 15px rgba(0,0,0,0.4);
            }

            .tm-eval-status {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 15px;
                background: #4CAF50;
                color: white;
                border-radius: 4px;
                z-index: 99999;
                display: none;
                font-family: 'Microsoft YaHei', sans-serif;
            }
        `;
        document.head.appendChild(style);
    }

    // 创建唯一主按钮（只在顶层页面创建）
    function createMainButton() {
        // 确保只存在一个主按钮
        removeElement(BUTTON_ID);

        // 创建按钮
        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.textContent = '一键好评';
        document.body.appendChild(button);

        // 添加点击事件
        button.addEventListener('click', handleEvalClick);
    }

    // 移除元素函数
    function removeElement(id) {
        const element = document.getElementById(id);
        if (element) element.remove();
    }

    // 主点击处理函数
    function handleEvalClick() {
        // 尝试在当前窗口寻找评教内容
        let evalResult = processCurrentDocument();

        // 如果当前窗口没有，尝试在iframe中寻找
        if (!evalResult.success) {
            evalResult = findAndProcessIFrames();
        }

        // 显示处理结果
        showStatus(evalResult.message, evalResult.color);
    }

    // 在当前文档中处理评教
    function processCurrentDocument(doc = document) {
        const containers = doc.querySelectorAll('td[id^="pjxx"]');
        let count = 0;

        containers.forEach(container => {
            const radios = container.querySelectorAll('input[type="radio"]');
            if (radios.length > 0 && !radios[0].checked) {
                radios[0].click();
                count++;
            }
        });

        if (count > 0) {
            return {
                success: true,
                message: `成功选中 ${count} 个评教项`,
                color: "#4CAF50"
            };
        }

        // 检查评教弹窗是否存在
        if (doc.getElementById('kingoDialog')) {
            return {
                success: false,
                message: "请点击打开评教表单",
                color: "#ff9800"
            };
        }

        return {
            success: false,
            message: "未找到评教内容",
            color: "#ff5722"
        };
    }

    // 在iframe中查找评教内容
    function findAndProcessIFrames() {
        const iframes = document.querySelectorAll('iframe');

        for (const iframe of iframes) {
            try {
                // 尝试访问iframe内容
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const result = processCurrentDocument(iframeDoc);

                if (result.success) {
                    return {
                        success: true,
                        message: "成功处理iframe中的评教内容",
                        color: "#4CAF50"
                    };
                }
            } catch (e) {
                // 忽略跨域错误
                console.debug("无法访问iframe:", e);
            }
        }

        return {
            success: false,
            message: "未找到评教内容",
            color: "#ff5722"
        };
    }

    // 显示状态消息（单次实例）
    function showStatus(message, color) {
        // 清理旧状态
        const oldStatus = document.querySelector('.tm-eval-status');
        if (oldStatus) oldStatus.remove();

        // 创建新状态
        const status = document.createElement('div');
        status.className = 'tm-eval-status';
        status.textContent = message;
        status.style.background = color;
        document.body.appendChild(status);

        // 显示并自动消失
        status.style.display = 'block';
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }

    // 初始化（仅在顶层运行）
    if (window.self === window.top) {
        window.addEventListener('load', createMainButton);

        // 监听URL变化（如SPA页面跳转）
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                createMainButton();
            }
        }, 1000);
    }
})();