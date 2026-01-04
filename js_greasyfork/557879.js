// ==UserScript==
// @name         文章收藏助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  快速收藏文章精彩片段到指定网站
// @author       www.funnyai.com
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557879/%E6%96%87%E7%AB%A0%E6%94%B6%E8%97%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557879/%E6%96%87%E7%AB%A0%E6%94%B6%E8%97%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 创建收藏按钮
    const collectButton = document.createElement('button');
    collectButton.innerHTML = '&#10024; 收藏';
    collectButton.id = 'collect-button';
    document.body.appendChild(collectButton);

    // 2. 添加按钮样式
    GM_addStyle(`
        #collect-button {
            position: absolute;
            z-index: 9999;
            background-color: #4CAF50; /* Green */
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            display: none; /* 默认隐藏 */
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        }
        #collect-button:hover {
            background-color: #45a049;
        }
    `);

    // 6. 添加用户反馈
    function showNotification(message, isSuccess) {
        const notification = document.createElement('div');
        notification.innerText = message;
        document.body.appendChild(notification);

        GM_addStyle(`
            #collect-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background-color: ${isSuccess ? '#4CAF50' : '#f44336'}; /* Green or Red */
                color: white;
                padding: 15px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: opacity 0.5s;
                opacity: 1;
            }
        `);
        notification.id = 'collect-notification';

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    // 5. 核心收藏逻辑
    function collectText(text) {
        // 获取保存的用户名和token
        const username = GM_getValue('username', '');
        const token = GM_getValue('token', '');

        if (!username || !token) {
            showSettings(); // 使用 showSettings 函数进行设置
            // 首次设置后，如果用户取消或未填写完整，可能不会立即继续收藏，需要用户再次触发
            return;
        }

        if (!text) {
            showNotification('没有选中文本', false);
            return;
        }

        // 准备数据
        const data = {
            username: username,
            token: token,
            title: document.title,
            url: window.location.href,
            selection: text
        };

        // 发送请求
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://www.funnyai.com/collect/collect.php", // 请修改为您的服务器地址
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                console.log('提交成功:', response.responseText);
                showNotification('收藏成功！', true);
                collectButton.style.display = 'none'; // 收藏成功后隐藏按钮
            },
            onerror: function(response) {
                console.error('提交失败:', response.statusText);
                showNotification('收藏失败，请稍后重试。', false);
            }
        });
    }

    function showSettings() {
        const username = GM_getValue('username', '');
        const token = GM_getValue('token', '');

        const newUsername = prompt('请输入用户名:', username);
        if (newUsername === null) return; // 用户取消

        const newToken = prompt('请输入Token:', token);
        if (newToken === null) return; // 用户取消

        if (newUsername && newToken) {
            GM_setValue('username', newUsername);
            GM_setValue('token', newToken);
            showNotification('设置已保存', true);
        } else {
             showNotification('用户名和Token不能为空', false);
        }
    }

    GM_registerMenuCommand('设置用户信息', showSettings);

    // 添加菜单项：收藏选中文字
    GM_registerMenuCommand('收藏选中文字', () => {
        const selection = window.getSelection().toString().trim();
        collectText(selection);
    });

    // 8. 控制按钮显示/隐藏（跟随鼠标）
    document.addEventListener('mouseup', (event) => {
        // 延时一小段时间，确保选区已完成
        setTimeout(() => {
            const selection = window.getSelection().toString().trim();
            if (selection) {
                console.log('Article Collector: Text selected, showing button.');
                const x = event.pageX + 10;
                const y = event.pageY + 10;

                collectButton.style.left = `${x}px`;
                collectButton.style.top = `${y}px`;
                collectButton.style.display = 'block';
            } else {
                // 不要立即隐藏，给用户点击按钮的时间
                // 只有当点击发生在按钮外部时才隐藏（由mousedown处理）
            }
        }, 10);
    });

    // 点击按钮执行收藏
    collectButton.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止触发其他点击事件
        const selection = window.getSelection().toString().trim();
        collectText(selection);
    });

    // 点击文档其他地方隐藏按钮
    document.addEventListener('mousedown', (event) => {
        if (event.target.id !== 'collect-button') {
            collectButton.style.display = 'none';
        }
    });

    // 9. 右键菜单增强（模拟）
    // 当用户右键点击并有选中文字时，确保按钮显示在鼠标附近
    document.addEventListener('contextmenu', (event) => {
        const selection = window.getSelection().toString().trim();
        if (selection) {
            // 稍微调整位置，避免遮挡原生右键菜单
            const x = event.pageX + 20;
            const y = event.pageY + 20;

            collectButton.style.left = `${x}px`;
            collectButton.style.top = `${y}px`;
            collectButton.style.display = 'block';
        }
    });
})();