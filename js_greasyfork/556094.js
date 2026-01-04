// ==UserScript==
// @name        longlong-在线研修个人用
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description    登录，打开学习页面，将自动学习,6倍
// @author       longlong
// @match        https://zy.jsyx.sdedu.net/*
// @icon         https://zy.jsyx.sdedu.net/
// @grant        none
// @icon             https://zxp.rf.gd/img/favicon.ico
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/556094/longlong-%E5%9C%A8%E7%BA%BF%E7%A0%94%E4%BF%AE%E4%B8%AA%E4%BA%BA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556094/longlong-%E5%9C%A8%E7%BA%BF%E7%A0%94%E4%BF%AE%E4%B8%AA%E4%BA%BA%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(function () {
        if (typeof window.interval !== 'undefined') {
            window.interval = 9;
            console.log('油猴脚本：已将视频更新间隔强制设置为 ' + window.interval + ' 秒。');
        } else {
            console.warn('油猴脚本：未能找到全局变量 interval，可能无法修改更新频率。');
        }
    }, 1000); // 延迟 1 秒执行，确保页面原始脚本已运行
    function showScriptStatus(message, isError = false) {
        let statusDiv = document.getElementById('longlong-script-status');

        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'longlong-script-status';

            // 设置样式，使其在页面右上角固定显示
            statusDiv.style.cssText = `
                position: fixed;
                top: 500px;
                left: 20px;
                z-index: 99999;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 14px;
                font-weight: bold;
                color: white;
                background-color: #333;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                opacity: 0.9;
                transition: opacity 0.5s;
            `;
            document.body.appendChild(statusDiv);

            // 首次显示启动信息
            console.log('脚本已开始运行。');
            statusDiv.style.backgroundColor = '#5cb85c'; // 绿色背景表示正常
            statusDiv.innerHTML = '脚本状态: **✅ 运行中**';
            return; // 首次调用只设置运行中状态
        }

        // 更新状态信息
        if (isError) {
            statusDiv.style.backgroundColor = '#d9534f'; // 红色背景表示错误
            statusDiv.innerHTML = `脚本状态: 🛑 停止 (${message})`;
            statusDiv.style.opacity = 1; // 停止时保持完全不透明
        } else {
            statusDiv.style.backgroundColor = '#5cb85c'; // 绿色背景表示正常
            statusDiv.innerHTML = `脚本状态: 🟢 学习中`+message;
        }

    }
    function play() {
        if (typeof ($('video')[0]) != "undefined") {
            let v = $('video')[0];
            v.muted = true;
            v.play();
        }

        var promptText = $(".g-study-prompt p ")[0]?.innerText || "";
        if (promptText.indexOf("作业") >= 0) {
            if (playTimer) {
                clearInterval(playTimer); // 停止定时器
                showScriptStatus("做作业，停止脚本，手动跳往下一章节",true);
            }
            return;
        }

        const nextLink = $("#studySelectAct a")[1]; //检测已完成任务1
        const nextLinkClasses = nextLink ? nextLink.className : '';
        if (promptText.indexOf("您已完成观看") >= 0) {
            if (nextLink.className.includes("btn next disable")) {  //最后一章
                    console.log('任务完成，停止脚本，手动跳往下一章节');
                    showScriptStatus("任务完成，停止脚本，手动跳往下一章节",true);
                    clearInterval(playTimer); // 停止定时器
                    return;
                }else{//点击下一章
                    $("#studySelectAct a")[1]?.click();
                    console.log("学习完成提示出现，已自动跳转到下一章节。");
                    showScriptStatus("学习完成提示出现，已自动跳转到下一章节。");
                    return
                }
        }

        var timer1Element = $(".g-study-prompt p span")[0];//检测已完成任务2
        var timer2Element = $(".g-study-prompt p span")[1];
        if (timer1Element && timer2Element) {
            var timer1 = timer1Element.innerText; // 已观看时间（分钟）
            var timer2 = timer2Element.innerText; // 要求观看时间（分钟）
            if (parseInt(timer1) <= parseInt(timer2)) {
                if (nextLink.className.includes("btn next disable")) {  //最后一章
                    console.log('任务完成，停止脚本，手动跳往下一章节');
                    showScriptStatus("任务完成，停止脚本，手动跳往下一章节",true);
                    clearInterval(playTimer); // 停止定时器
                    return;
                }else{//点击下一章
                    $("#studySelectAct a")[1]?.click();
                    console.log("学习完成提示出现，已自动跳转到下一章节。");
                    showScriptStatus("学习完成提示出现，已自动跳转到下一章节。");
                    return
                }
            }
        }

    }
    showScriptStatus("脚本已开始运行");
    const playTimer = setInterval(play, 2000);
})();