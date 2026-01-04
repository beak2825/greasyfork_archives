// ==UserScript==
// @name         pt魔力交换自动提交助手
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0xMi44OSAxMS4xYy0xLjc4LS41OS0yLjY0LS45Ni0yLjY0LTEuOWMwLTEuMDIgMS4xMS0xLjM5IDEuODEtMS4zOWMxLjMxIDAgMS43OS45OSAxLjkgMS4zNGwxLjU4LS42N2MtLjE1LS40NS0uODItMS45Mi0yLjU0LTIuMjRWNWgtMnYxLjI2Yy0yLjQ4LjU2LTIuNDkgMi44Ni0yLjQ5IDIuOTZjMCAyLjI3IDIuMjUgMi45MSAzLjM1IDMuMzFjMS41OC41NiAyLjI4IDEuMDcgMi4yOCAyLjAzYzAgMS4xMy0xLjA1IDEuNjEtMS45OCAxLjYxYy0xLjgyIDAtMi4zNC0xLjg3LTIuNC0yLjA5bC0xLjY2LjY3Yy42MyAyLjE5IDIuMjggMi43OCAyLjkgMi45NlYxOWgydi0xLjI0Yy40LS4wOSAyLjktLjU5IDIuOS0zLjIyYzAtMS4zOS0uNjEtMi42MS0zLjAxLTMuNDRNMyAyMUgxdi02aDZ2Mkg0LjUyYzEuNjEgMi40MSA0LjM2IDQgNy40OCA0YTkgOSAwIDAgMCA5LTloMmMwIDYuMDgtNC45MiAxMS0xMSAxMWMtMy43MiAwLTcuMDEtMS44NS05LTQuNjd6bS0yLTlDMSA1LjkyIDUuOTIgMSAxMiAxYzMuNzIgMCA3LjAxIDEuODUgOSA0LjY3VjNoMnY2aC02VjdoMi40OEMxNy44NyA0LjU5IDE1LjEyIDMgMTIgM2E5IDkgMCAwIDAtOSA5eiIvPjwvc3ZnPg==
// @namespace    https://greasyfork.org/
// @version      1.6
// @description  在提交按钮旁添加自动按钮，12秒后自动提交，支持状态恢复和取消功能
// @author       leo_lin
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle

// @include *://*.hdsky.me/mybonus*
// @include *://hdsky.me/mybonus*
// @include *://*.m-team.cc/mybonus*
// @include *://m-team.cc/mybonus*
// @include *://*.ptchdbits.co/mybonus*
// @include *://ptchdbits.co/mybonus*
// @include *://*.totheglory.im/mybonus*
// @include *://totheglory.im/mybonus*
// @include *://*.open.cd/mybonus*
// @include *://open.cd/mybonus*
// @include *://*.hdhome.org/mybonus*
// @include *://hdhome.org/mybonus*
// @include *://*.hhanclub.top/mybonus*
// @include *://hhanclub.top/mybonus*
// @include *://*.springsunday.net/mybonus*
// @include *://springsunday.net/mybonus*
// @include *://*.audiences.me/mybonus*
// @include *://audiences.me/mybonus*
// @include *://*.keepfrds.com/mybonus*
// @include *://keepfrds.com/mybonus*
// @include *://*.ourbits.club/mybonus*
// @include *://ourbits.club/mybonus*
// @include *://*.pterclub.com/mybonus*
// @include *://pterclub.com/mybonus*
// @include *://*.hddolby.com/mybonus*
// @include *://hddolby.com/mybonus*
// @include *://*.ubits.club/mybonus*
// @include *://ubits.club/mybonus*
// @include *://*.tjupt.org/mybonus*
// @include *://tjupt.org/mybonus*
// @include *://*.blutopia.cc/mybonus*
// @include *://blutopia.cc/mybonus*
// @include *://*.btschool.club/mybonus*
// @include *://btschool.club/mybonus*
// @include *://*.hdarea.club/mybonus*
// @include *://hdarea.club/mybonus*
// @include *://*.zmpt.cc/mybonus*
// @include *://zmpt.cc/mybonus*
// @include *://*.pthome.net/mybonus*
// @include *://pthome.net/mybonus*
// @include *://*.haidan.video/mybonus*
// @include *://haidan.video/mybonus*
// @include *://*.hdfans.org/mybonus*
// @include *://hdfans.org/mybonus*
// @include *://*.ptvicomo.net/mybonus*
// @include *://ptvicomo.net/mybonus*
// @include *://*.cyanbug.net/mybonus*
// @include *://cyanbug.net/mybonus*
// @include *://*.soulvoice.club/mybonus*
// @include *://soulvoice.club/mybonus*
// @include *://*.qingwapt.com/mybonus*
// @include *://qingwapt.com/mybonus*
// @include *://*.piggo.me/mybonus*
// @include *://piggo.me/mybonus*
// @include *://*.u2.dmhy.org/mybonus*
// @include *://u2.dmhy.org/mybonus*
// @include *://*.monikadesign.uk/mybonus*
// @include *://monikadesign.uk/mybonus*
// @include *://*.azusa.wiki/mybonus*
// @include *://azusa.wiki/mybonus*
// @include *://*.tu88.men/mybonus*
// @include *://tu88.men/mybonus*
// @include *://*.hdkyl.in/mybonus*
// @include *://hdkyl.in/mybonus*
// @include *://*.agsvpt.com/mybonus*
// @include *://agsvpt.com/mybonus*
// @include *://*.agsvpt.cn/mybonus*
// @include *://agsvpt.cn/mybonus*
// @include *://*.dragonhd.xyz/mybonus*
// @include *://dragonhd.xyz/mybonus*
// @include *://*.et8.org/mybonus*
// @include *://et8.org/mybonus*
// @include *://*.eastgame.org/mybonus*
// @include *://eastgame.org/mybonus*
// @include *://*.star-space.net/mybonus*
// @include *://star-space.net/mybonus*
// @include *://*.discfan.net/mybonus*
// @include *://discfan.net/mybonus*
// @include *://*.carpt.net/mybonus*
// @include *://carpt.net/mybonus*
// @include *://*.hdtime.org/mybonus*
// @include *://hdtime.org/mybonus*
// @include *://*.ptcafe.club/mybonus*
// @include *://ptcafe.club/mybonus*
// @include *://*.crabpt.vip/mybonus*
// @include *://crabpt.vip/mybonus*
// @include *://*.hdupt.com/mybonus*
// @include *://hdupt.com/mybonus*
// @include *://*.ptsbao.club/mybonus*
// @include *://ptsbao.club/mybonus*
// @include *://*.hdcity.city/mybonus*
// @include *://hdcity.city/mybonus*
// @include *://*.lemonhd.club/mybonus*
// @include *://lemonhd.club/mybonus*
// @include *://*.zhuque.in/mybonus*
// @include *://zhuque.in/mybonus*
// @include *://*.pandapt.net/mybonus*
// @include *://pandapt.net/mybonus*
// @include *://*.pttime.org/mybonus*
// @include *://pttime.org/mybonus*
// @include *://*.rousi.zip/mybonus*
// @include *://rousi.zip/mybonus*
// @include *://*.ilolicon.com/mybonus*
// @include *://ilolicon.com/mybonus*
// @include *://*.nicept.net/mybonus*
// @include *://nicept.net/mybonus*
// @include *://*.greatposterwall.com/mybonus*


// @downloadURL https://update.greasyfork.org/scripts/550583/pt%E9%AD%94%E5%8A%9B%E4%BA%A4%E6%8D%A2%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550583/pt%E9%AD%94%E5%8A%9B%E4%BA%A4%E6%8D%A2%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .auto-submit-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin-left: 10px;
            transition: all 0.3s;
            font-size: 14px;
        }
        .auto-btn {
            background: linear-gradient(to bottom, #4CAF50, #2E7D32);
            color: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .auto-btn:hover {
            background: linear-gradient(to bottom, #43A047, #1B5E20);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .cancel-btn {
            background: linear-gradient(to bottom, #F44336, #C62828);
            color: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .cancel-btn:hover {
            background: linear-gradient(to bottom, #E53935, #B71C1C);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .auto-timer {
            display: inline-block;
            margin-left: 10px;
            font-weight: bold;
            font-size: 14px;
            color: #1a2a6c;
            min-width: 50px;
            padding: 2px 8px;
            background: rgba(26, 42, 108, 0.1);
            border-radius: 4px;
        }
        .auto-status {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
    `);

    const host = window.location.host;
    const href = window.location.href;
    const timeint = 12*1000;//12000毫秒

    // 存储键名前缀
    const storageKey = host+'_autoSubmit';

    if(href.indexOf("mybonus")<0){
        return;
    }

    // 显示状态消息
    function showStatus(message, duration = 3000) {
        // 移除旧的状态消息
        const oldStatus = document.getElementById('auto-submit-status');
        if (oldStatus) oldStatus.remove();

        const statusDiv = document.createElement('div');
        statusDiv.id = 'auto-submit-status';
        statusDiv.className = 'auto-status';
        statusDiv.textContent = message;
        document.body.appendChild(statusDiv);

        if (duration > 0) {
            setTimeout(() => {
                statusDiv.style.opacity = '0';
                setTimeout(() => statusDiv.remove(), 500);
            }, duration);
        }
    }

    // 添加自动按钮
    function addAutoButtons() {
        const submitButtons = document.querySelectorAll('input[type="submit"]');

        submitButtons.forEach(button => {
             // 检查是否可点击
            if (button.disabled) {
                return;
            }

            // 检查是否已添加自动按钮
            if (button.nextElementSibling && button.nextElementSibling.classList.contains('auto-submit-btn')) {
                return;
            }

            // 获取唯一标识（使用按钮所在行的内容）
            const row = button.closest('tr');
            let identifier=Array.from(button.parentNode.parentNode.children).map(node => node.textContent.trim()).join('_').replace(/(\r\n|\n|\s)/gm, "").substring(0, 20);
//             if (row) {
//                 //identifier = Array.from(row.cells).map(cell => cell.textContent.trim()).join('_');
//                 identifier = row.cells[0].textContent.trim();
//             } else {
//                 identifier = Array.from(button.parentNode.parentNode.children).map(node => node.textContent.trim()).join('_').toString(0,20);
//             }
            console.log(identifier);

            // 创建自动按钮
            const autoBtn = document.createElement('button');
            autoBtn.className = 'auto-submit-btn auto-btn';
            autoBtn.textContent = '自动';

            // 检查存储中是否有未完成的自动提交
            const storedData = GM_getValue(storageKey, null);

            if (storedData && storedData.identifier == identifier) {
                // 恢复之前的自动提交状态
                autoBtn.textContent = '取消';
                autoBtn.classList.replace('auto-btn', 'cancel-btn');
                // 插入按钮
                button.parentNode.insertBefore(autoBtn, button.nextSibling);
                const remainingTime = storedData.endTime - Date.now();

                startCountdown(button, autoBtn, identifier, storedData.endTime);
            }
            else{
                // 插入按钮
                button.parentNode.insertBefore(autoBtn, button.nextSibling);
            }



            // 添加事件监听器
            autoBtn.addEventListener('click', function() {
                if (this.textContent === '自动') {
                    // 开始自动提交
                    this.textContent = '取消';
                    this.classList.replace('auto-btn', 'cancel-btn');

                    const endTime = Date.now() + timeint; // n秒后
                    GM_setValue(storageKey, {
                        endTime,
                        identifier,
                        buttonValue: button.value
                    });

                    startCountdown(button, autoBtn, identifier, endTime);
                    showStatus(`已为 "${button.value+identifier}" 设置自动提交，10秒后执行`);
                } else {
                    // 取消自动提交
                    cancelAutoSubmit(button, autoBtn, identifier);
                    showStatus(`已取消 "${button.value+identifier}" 的自动提交`);
                }
            });
        });
    }

    // 启动倒计时
    function startCountdown(submitBtn, autoBtn, identifier, endTime) {
        const remainingTime = endTime - Date.now();

        // showStatus(identifier, 5000);

        if (remainingTime <= 0) {
            // 时间已到，立即提交
            completeAutoSubmit(submitBtn,identifier);
            submitBtn.click();
            return;
        }

        // 创建倒计时显示
        let timerDisplay = autoBtn.nextElementSibling;
        if (!timerDisplay || !timerDisplay.classList.contains('auto-timer')) {
            timerDisplay = document.createElement('span');
            timerDisplay.className = 'auto-timer';
            autoBtn.parentNode.insertBefore(timerDisplay, autoBtn.nextSibling);
        }

        // 更新倒计时
        function updateTimer() {
            const timeLeft = endTime - Date.now();

            if (timeLeft <= 0) {
                timerDisplay.textContent = '';
                completeAutoSubmit(submitBtn,identifier);
                submitBtn.click();
                return;
            }

            timerDisplay.textContent = (timeLeft / 1000).toFixed(1) + '秒';

            // 存储timeout ID以便取消
            autoBtn.dataset.timeoutId = setTimeout(updateTimer, 100);
        }

        // 开始倒计时
        autoBtn.dataset.timeoutId = setTimeout(updateTimer, 100);
    }


     // 完成自动提交
    function completeAutoSubmit(submitBtn,identifier) {
        const storedData = GM_getValue(storageKey, null);

        if (storedData) {
           let endTime = Date.now()+timeint;
                GM_setValue(storageKey, {
                        endTime,
                        identifier,
                        buttonValue: submitBtn.value
                    });
        }
    }

    // 取消自动提交
    function cancelAutoSubmit(submitBtn, autoBtn, identifier) {

        // 清除倒计时
        if (autoBtn.dataset.timeoutId) {
            clearTimeout(parseInt(autoBtn.dataset.timeoutId));
            delete autoBtn.dataset.timeoutId;
        }

        // 移除倒计时显示
        const timerDisplay = autoBtn.nextElementSibling;
        if (timerDisplay && timerDisplay.classList.contains('auto-timer')) {
            timerDisplay.remove();
        }

        // 恢复按钮状态
        autoBtn.textContent = '自动';
        autoBtn.classList.replace('cancel-btn', 'auto-btn');

        // 删除存储
        GM_deleteValue(storageKey);

    }

    // 初始化
    window.addEventListener('load', function() {
        // 添加自动按钮
        addAutoButtons();

        // 处理动态内容
        const observer = new MutationObserver(function(mutations) {
            for (let mutation of mutations) {
                if (mutation.addedNodes.length) {
                    addAutoButtons();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // 显示当前状态
        const storedData = GM_getValue(storageKey, null);
        if (storedData) {
            showStatus(`检测到 ${storedData.buttonValue+storedData.identifier} 的自动提交任务`, 5000);
        }
    });
})();