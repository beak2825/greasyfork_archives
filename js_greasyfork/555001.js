// ==UserScript==
// @name         无尽冬日领取兑换码
// @namespace    http://clang.cn/
// @version      0.0.5
// @description  无尽冬日半自动领取兑换码
// @author       Clang
// @match        https://wjdr-giftcode.centurygames.cn/
// @icon         https://wjdr-giftcode.centurygames.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555001/%E6%97%A0%E5%B0%BD%E5%86%AC%E6%97%A5%E9%A2%86%E5%8F%96%E5%85%91%E6%8D%A2%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/555001/%E6%97%A0%E5%B0%BD%E5%86%AC%E6%97%A5%E9%A2%86%E5%8F%96%E5%85%91%E6%8D%A2%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let game_id_value = [];
    let game_cdk_value = '';
    let list_number = 0;
    let isProcessing = false; // 防止重复触发的锁

    // 创建按钮（样式不变，略）
    var gameIdButton = document.createElement('button');
    gameIdButton.innerHTML = '用户ID';
    var gameCdkButton = document.createElement('button');
    gameCdkButton.innerHTML = '兑换码';
    var startBtn = document.createElement('button');
    startBtn.innerHTML = '开始领取';
    var nextBtn = document.createElement('button');
    nextBtn.innerHTML = '下一个';

    // 设置按钮样式和位置（同上，略）
    gameIdButton.style = 'position:fixed; top:5px; right:10px; z-index:9999; width:80px; height: 40px;';
    gameCdkButton.style = 'position:fixed; top:60px; right:10px; z-index:9999; width:80px; height: 40px;';
    nextBtn.style = 'position:fixed; top:600px; right:10px; z-index:9999; width:80px; height: 40px;';
    nextBtn.disabled = true;
    startBtn.style = 'position:fixed; top:540px; right:10px; z-index:9999; width:80px; height: 40px;';

    document.body.appendChild(gameIdButton);
    document.body.appendChild(gameCdkButton);
    document.body.appendChild(startBtn);
    document.body.appendChild(nextBtn);

    // 输入用户ID和CDK（逻辑不变，略）
    gameIdButton.addEventListener('click', function() {
        console.log("添加game_id");
        var inputValue = prompt('请输入id组（英文逗号或空格分隔）：');
        if (inputValue){
            game_id_value = inputValue.split(/[ ,\n]+/);
            console.log(game_id_value);
            console.log(game_id_value.length);
        }
    });
    gameCdkButton.addEventListener('click', function() {
        var cdk_input = prompt('请输入兑换码：');
        if (cdk_input) game_cdk_value = cdk_input;
        console.log( "兑换码：" + game_cdk_value);
    });

    // 核心改进：等待元素出现的工具函数（解决元素找不到问题）
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const checkInterval = 100; // 每100ms检查一次
            const maxChecks = timeout / checkInterval;
            let checks = 0;

            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element); // 找到元素，返回
                } else if (checks >= maxChecks) {
                    reject(new Error(`超时未找到元素：${selector}`)); // 超时失败
                } else {
                    checks++;
                    setTimeout(check, checkInterval); // 继续检查
                }
            };
            check(); // 立即开始检查
        });
    }

    // 触发登录按钮（使用等待函数）
    async function simulateButtonClick() {
        try {
            const loginBtn = await waitForElement('.btn.login_btn'); // 等待按钮出现
            loginBtn.click();
            console.log('登录按钮点击成功');
        } catch (err) {
            console.log('登录按钮操作失败：', err.message);
        }
    }

    // 触发关闭对话框按钮（使用等待函数）
    async function simulate_textbox() {
        try {
            const closeBtn = await waitForElement('.close_btn');
            closeBtn.click();
            console.log('关闭对话框成功');
        } catch (err) {
            console.log('关闭对话框失败：', err.message);
        }
    }

    // 触发登出按钮（使用等待函数）
    async function simulate_exit() {
        try {
            const exitBtn = await waitForElement('.exit_icon');
            exitBtn.click();
            console.log('登出按钮点击成功');
        } catch (err) {
            console.log('登出按钮操作失败：', err.message);
        }
    }

    // 填写CDK（使用等待函数）
    async function cdk_set_value() {
        try {
            const cdkInput = await waitForElement('input'); // 等待兑换码输入框
            cdkInput.focus();
            cdkInput.value = game_cdk_value;
            cdkInput.dispatchEvent(new Event('input'));
            console.log('兑换码填写成功');
        } catch (err) {
            console.log('兑换码填写失败：', err.message);
        }
    }

    // 填写角色ID（使用等待函数）
    async function setInputWrapValue() {
        try {
            const idInput = await waitForElement('input[placeholder="角色ID"]');
            idInput.focus();
            idInput.value = game_id_value[list_number];
            idInput.dispatchEvent(new Event('input'));
            console.log('角色ID填写成功：', game_id_value[list_number]);
        } catch (err) {
            console.log('角色ID填写失败：', err.message);
        }
    }

    // 登出流程（确保完全完成后再继续）
    async function handleExit() {
        console.log('开始登出流程');
        await simulate_textbox(); // 关闭对话框
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待关闭动画
        await simulate_exit(); // 点击登出
        await new Promise(resolve => setTimeout(resolve, 2000)); // 等待登出完成（关键延迟）
        console.log('登出流程完成');
    }

    // 开始按钮逻辑
    startBtn.addEventListener('click', async function() {
        if (isProcessing || game_id_value.length === 0) return;
        isProcessing = true;
        startBtn.disabled = true;

        console.log('开始第一个账号操作');
        await setInputWrapValue(); // 填ID
        await new Promise(resolve => setTimeout(resolve, 300));
        await simulateButtonClick(); // 登录
        await new Promise(resolve => setTimeout(resolve, 800));
        await cdk_set_value(); // 填CDK

        list_number++;
        nextBtn.disabled = list_number >= game_id_value.length;
        isProcessing = false;
    });

    // 下一个按钮逻辑（核心优化：严格按顺序执行）
    nextBtn.addEventListener('click', async function() {
        if (isProcessing || list_number >= game_id_value.length) return;
        isProcessing = true;
        nextBtn.disabled = true;

        console.log(`开始第${list_number+1}个账号操作`);
        await handleExit(); // 先等登出完成（必须等待）
        await setInputWrapValue(); // 填新ID（此时页面已回到登录状态）
        await new Promise(resolve => setTimeout(resolve, 300));
        await simulateButtonClick(); // 登录新账号
        await new Promise(resolve => setTimeout(resolve, 800));
        await cdk_set_value(); // 填CDK

        list_number++;
        nextBtn.disabled = list_number >= game_id_value.length;
        isProcessing = false;
    });
})();