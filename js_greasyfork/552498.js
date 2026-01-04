// ==UserScript==
// @name         智慧树自动学习脚本
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动看视频和自动答题
// @author       Raind
// @license      MIT
// @match        https://*.zhihuishu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552498/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/552498/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 一些可调整的常数，单位为毫秒
    const intervalTime = 2000; // 检测间隔
    const waitTime = 500; // 等待间隔
    const startTime = 5000; // 启动间隔

    /**
     * 源代码。请勿修改，除非你知道你在做什么
     */
    let isAnswering = false;
    let videoInterval;
    let questionInterval;
    let popupInterval;

    // 检测视频并自动播放
    function startVideoPlayback() {
        videoInterval = setInterval(() => {
            const video = document.querySelector('video');
            // 视频结束，播放下一个视频
            if (video && video.ended) {
                queryAndClick('#nextBtn');
            }
            // 视频暂停且不处于答题页面，继续播放
            if (video && video.paused && !isAnswering) {
                video.play();
            }
        }, intervalTime);
    }

    // 检测题目并自动做题
    function startQuestionDetection() {
        questionInterval = setInterval(() => {
            const optionsContainer = document.querySelector('div.options');
            if (optionsContainer && !isAnswering) {
                // 开始答题
                isAnswering = true;
                handleQuestions();
            }
        }, intervalTime);
    }

    // 检测弹窗并自动关闭
    function startPopupDetection() {
        popupInterval = setInterval(() => {
            const popupBtn = document.querySelector("div.ai-notice-wrapper-right > div");
            if (popupBtn && popupBtn.checkVisibility()) {
                popupBtn.click();
            }
        }, intervalTime);
    }

    // 处理题目
    function handleQuestions() {
        // 等待一下确保题目完全加载
        setTimeout(() => {
            // 获取题目类型：多选、单选、判断
            const typeElement = document.querySelector('span.type');
            const questionType = typeElement ? typeElement.textContent : '';

            if (questionType.includes('多选')) {
                handleMultipleChoice();
            } else {
                handleSingleChoice();
            }

            // 提交答案
            submitAnswer();
        }, waitTime);
    }

    // 处理单选题和判断题
    function handleSingleChoice() {
        const options = document.querySelectorAll('span.class-question-select:not(.isSelect)');
        // 选择第 1 个选项
        options[0].click();
    }

    // 处理多选题
    function handleMultipleChoice() {
        const options = document.querySelectorAll('span.class-question-select:not(.isSelect)');
        // 选择前 2 个选项
        for (let i = 0; i < 2; i++) {
            options[i].click();
        }
    }

    // 提交答案并关闭
    function submitAnswer() {
        // 等待一下确保题目都被选中
        setTimeout(() => {
            queryAndClick('span.submits');
            closeQuestionBox();
        }, waitTime);
    }

    // 关闭答题界面
    function closeQuestionBox() {
        // 等待一下确保回答已提交
        setTimeout(() => {
            queryAndClick('div.close-box > svg');
            isAnswering = false;
        }, waitTime);
    }

    // 查询元素并点击
    function queryAndClick(selector) {
        const element = document.querySelector(selector);
        const events = jQuery._data(element, 'events');
        if (events && events.click) {
            // 如果有 jQuery 点击事件，则模拟 jQuery 点击
            events.click.forEach(handler => {
                handler.handler.call(element, jQuery.Event('click'));
            });
        } else if (element.click) {
            // 如果有原生的点击事件，则使用原生事件
            element.click();
        } else {
            // 什么都没有，则原地构造一个点击事件
            element.dispatchEvent(new MouseEvent('click'));
        }
    }

    // 开始自动学习
    function start() {
        startVideoPlayback();
        startQuestionDetection();
        startPopupDetection();
    }

    // 停止自动学习
    function stop() {
        clearInterval(videoInterval);
        clearInterval(questionInterval);
        clearInterval(popupInterval);
    }

    // 创建按钮
    function createButton() {
        // 等待一下确保页面加载完成
        setTimeout(() => {
            const startButton = document.createElement('button');
            startButton.textContent = "开始自动学习";
            startButton.onclick = start;

            const stopButton = document.createElement('button');
            stopButton.textContent = "停止自动学习";
            stopButton.onclick = stop;

            const navBox = document.getElementsByClassName('header-nav-box')[0];
            navBox.appendChild(startButton);
            navBox.appendChild(stopButton);
        }, startTime);
    }

    // 页面加载完成后自动显示按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createButton);
    } else {
        createButton();
    }

    // 刷新或关闭页面时自动停止
    window.addEventListener('beforeunload', stop);
})();