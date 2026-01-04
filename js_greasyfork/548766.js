// ==UserScript==
// @name         酷学院自动刷课脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动播放酷学院视频，自动跳到下一个zt
// @author       ZZM-User
// @license MIT
// @match        *://*.coolcollege.cn/*
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/548766/%E9%85%B7%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/548766/%E9%85%B7%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ################################################## 样式区域 #######################################################
    GM_addStyle(`
        .my-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            width: 15vw;
            height: 15vh;
            background: rgba(0,0,0,0.5);
            color: #fff;
            padding: 10px;
            border-radius: 8px;
            font-family: sans-serif;
            font-size: 16px;
            overflow: auto;
        }
        .my-panel.running { background-color: green !important; }
        .my-panel.paused { background-color: red !important; }
        .my-btn:hover { background: #0d86c4; }
        #toggleAuto {
            background-color: #0ea5e9;
            width: 100%;
            text-align: center;
        }
        #toggleAuto.running{
            background-color: #0ea5e9;
        }
        #toggleAuto.paused{
         background-color: red;
        }
    `);
    // ################################################## 样式区域 #######################################################


    // ################################################## 方法区域 #######################################################
    function showToast(message, duration = 2000) {
        console.log('酷学院：', message);

        const toast = document.createElement('div');
        toast.innerText = message;
        toast.style.cssText = `
        position: fixed;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 999999;
        opacity: 0;
        transition: opacity 0.3s;
    `;
        document.body.appendChild(toast);
        // 触发动画
        requestAnimationFrame(() => toast.style.opacity = 1);

        setTimeout(() => {
            toast.style.opacity = 0;
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    }

    // ################################################## 方法区域 #######################################################

    // ################################################## 变量定义区域 #######################################################

    const runningHtml = "<span style='color: green'>【运行中】</span>"
    const pausedHtml = "<span style='color: red'>【未开始】</span>"

    let autoMode = GM_getValue('autoMode', false); // 初始为暂停
    // ################################################## 变量定义区域 #######################################################

    // 创建控制按钮
    const panel = document.createElement("div");
    panel.className = "my-panel";

    panel.innerHTML = `
  <p>自动刷课状态 <span id="statusText">${autoMode ? runningHtml : pausedHtml}</span></p>
  <button id="toggleAuto">${autoMode ? "暂停" : "开始"}</button>
  <span style="color: #10b981;">请从视频播放页或者任务详情的列表页开始使用脚本</span>
`;
    document.body.appendChild(panel);

    // 切换自动刷课状态
    document.getElementById("toggleAuto").onclick = () => {
        autoMode = !autoMode;
        GM_setValue('autoMode', autoMode);
        var toggleAutoButton = document.getElementById("toggleAuto")
        toggleAutoButton.className = autoMode ? "paused":"running";
        toggleAutoButton.innerText = autoMode
            ? "暂停"
            : "开始";
        document.getElementById("statusText").innerHTML = autoMode
            ? runningHtml
            : pausedHtml;
    };

    // 反作弊监听
    setInterval(() => {
        if (!autoMode) return; // 暂停时不执行

        const buttons = document.querySelectorAll('.ant-btn.ant-btn-primary');
        for (const b of buttons) {
            const span = b.querySelector('span');
            if (span && b.offsetParent !== null) {
                setTimeout(() => {
                    b.click();
                    const video = document.querySelector("video");
                    if (video && video.paused) {
                        video.play();
                    }
                    showToast('监测到反作弊弹窗， 已点击继续播放', 2000)
                }, 100 + Math.random() * 200);

                break;
            }
        }
    }, 2000);

    // 播放下一个视频监听
    setInterval(() => {
        if (!autoMode) return; // 暂停时不执行

        // 列表页主动下一个，播放页面跳回来再下一个
        let task_content_table = document.querySelector(".task-view__content__table");
        if (task_content_table){
            showToast('已进入列表页， 尝试自动播放下一个视频……', 2000)
        }else {
            let currentTime = document.querySelector(".current-time").innerText;
            let duration = document.querySelector(".duration").innerText;
            if (!currentTime || !duration) return; // 防止元素未加载报错
            if (currentTime !== duration) return; // 视频未播放完就返回
            showToast('当前视频播放完成， 即将自动播放下一个视频', 2000)

            // 1、回到列表页
            const cancelBtn = document.querySelector(".new-watch-task-page__header__btn"); // 按钮选择器
            if (cancelBtn && cancelBtn.offsetParent !== null) {
                setTimeout(() => cancelBtn.click(), 200 + Math.random() * 300);
                showToast('当前视频播放完成， 即将转回列表继续下一个待播视频', 2000)
            }
        }

        // 2、找下一个视频，有的话就点进去
        var hasNextVideo = false
        // 查找所有未完成进度行
        setInterval(() => {
            const progressElems = document.querySelectorAll('.ant-progress-status-normal');
            for (const progress of progressElems) {
                const tr = progress.closest('tr');
                if (!tr) continue;
                const btn = tr.querySelector('span.cl-primary');
                if (btn && btn.offsetParent !== null) {
                    hasNextVideo = true;
                    setTimeout(() => {
                        btn.click();
                        showToast('开始播放下一个视频……', 2000);
                    }, 200 + Math.random() * 300);
                    break; // 找到第一个就停止循环
                }
            }
        }, 2000);

        if (! hasNextVideo){
            // 如果没有视频需要播放，就自动关闭，取消状态
            GM_setValue('autoMode', false);
        }

    }, 2000);

})();
