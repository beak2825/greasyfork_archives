// ==UserScript==
// @name         思齐消息一键已读
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在 NexusPHP 站点的消息页面添加一个“一键已读”按钮，自动将所有未读消息标记为已读，全程无弹窗。
// @author       Your Expert Coder
// @match        *://si-qi.xyz/messages.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556965/%E6%80%9D%E9%BD%90%E6%B6%88%E6%81%AF%E4%B8%80%E9%94%AE%E5%B7%B2%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/556965/%E6%80%9D%E9%BD%90%E6%B6%88%E6%81%AF%E4%B8%80%E9%94%AE%E5%B7%B2%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const SCRIPT_STATE_KEY = 'isReadingAllMessages';
    const BTN_TEXT_START = '一键已读';
    const BTN_TEXT_STOP = '停止阅读';
    const BTN_TEXT_ERROR = '出错，已停止';
    const BTN_TEXT_SUCCESS = '全部已读';
    const UNREAD_MESSAGES_URL = '/messages.php?action=viewmailbox&box=1&unread=yes';

    // --- 查找页面元素 ---
    const searchButton = document.querySelector('input.btn[value="给我搜"]');
    if (!searchButton) {
        return;
    }

    // --- 创建并插入控制按钮 ---
    const controlButton = document.createElement('input');
    controlButton.type = 'button';
    controlButton.className = 'btn';
    searchButton.parentNode.insertBefore(document.createTextNode(' '), searchButton.nextSibling);
    searchButton.parentNode.insertBefore(controlButton, searchButton.nextSibling.nextSibling);

    // --- 状态管理函数 ---
    const getState = async () => await GM_getValue(SCRIPT_STATE_KEY, false);
    const setState = async (value) => await GM_setValue(SCRIPT_STATE_KEY, value);

    // --- 核心功能函数 ---

    /**
     * 开始自动化流程
     */
    const startProcess = () => {
        setState(true).then(() => {
            controlButton.value = BTN_TEXT_STOP;
            window.location.href = UNREAD_MESSAGES_URL;
        });
    };

    /**
     * 停止自动化流程
     * @param {string} finalState - 停止后的按钮状态文本
     */
    const stopProcess = (finalState = BTN_TEXT_START) => {
        // 设置状态为“已停止”，并根据情况更新按钮文本
        setState(false).then(() => {
            controlButton.value = finalState;
        });
    };

    /**
     * 为按钮绑定点击事件
     */
    controlButton.addEventListener('click', async () => {
        const isRunning = await getState();
        if (isRunning) {
            // 如果正在运行，则点击按钮为停止操作
            stopProcess();
        } else {
            // 如果未运行，则点击按钮为开始操作
            startProcess();
        }
    });

    /**
     * 脚本主函数，在每次页面加载时运行
     */
    const main = async () => {
        const isRunning = await getState();

        // 无论如何，先根据当前状态更新按钮的文本
        controlButton.value = isRunning ? BTN_TEXT_STOP : BTN_TEXT_START;

        // 如果脚本不是“运行中”状态，则终止后续操作
        if (!isRunning) {
            return;
        }

        // --- 自动化流程执行中 ---

        // 检查是否所有消息都已读完
        if (document.body.textContent.includes('没有短讯')) {
            stopProcess(BTN_TEXT_SUCCESS);
            // 成功后短暂显示“全部已读”，2秒后恢复
            setTimeout(() => {
                if(controlButton.value === BTN_TEXT_SUCCESS) {
                    controlButton.value = BTN_TEXT_START;
                }
            }, 2000);
            return;
        }

        // 收集当前页面所有消息的 ID
        const messageCheckboxes = document.querySelectorAll('input[type="checkbox"][name="messages[]"]');
        if (messageCheckboxes.length === 0) {
            // 页面上没有消息可选框，可能是一个异常情况，为安全起见停止脚本
            stopProcess(BTN_TEXT_ERROR);
            return;
        }
        const messageIds = Array.from(messageCheckboxes).map(cb => cb.value);

        // 构造表单数据，模拟“设为已读”的提交
        const formData = new URLSearchParams();
        formData.append('action', 'moveordel');
        formData.append('markread', '设为已读');
        formData.append('box', '1');
        messageIds.forEach(id => {
            formData.append('messages[]', id);
        });

        // 使用 GM_xmlhttpRequest 发送后台 POST 请求
        GM_xmlhttpRequest({
            method: "POST",
            url: "/messages.php",
            data: formData.toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                if (response.status === 200) {
                    window.location.reload();
                } else {
                    stopProcess(BTN_TEXT_ERROR);
                }
            },
            onerror: function() {
                stopProcess(BTN_TEXT_ERROR);
            },
            ontimeout: function() {
                stopProcess(BTN_TEXT_ERROR);
            }
        });
    };

    // --- 启动脚本 ---
    main();

})();
