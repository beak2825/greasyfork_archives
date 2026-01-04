// ==UserScript==
// @name         SYSU在线教学平台助手
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  中山大学在线教育平台心理线上课等课程自动跳转。等待页面加载完成后，首先点击播放按钮，检查目标值（播放进度），然后点击下一个视频按钮。若检测到“发表论坛帖子”则直接跳转到下一个活动
// @author       蓝厘榨只因
// @license      MIT
// @match        *://lms.sysu.edu.cn/mod/fsresource/*
// @match        *://lms.sysu.edu.cn/mod/forum/*
// @match        *://lms.sysu.edu.cn/mod/page/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557011/SYSU%E5%9C%A8%E7%BA%BF%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557011/SYSU%E5%9C%A8%E7%BA%BF%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targetValue = 100;  // 设置目标值为 100（例如：观看进度达到 100%）
    const targetSelector = '.number.num-bfjd span';  // 修改后的目标值选择器
    const buttonSelector1 = '#next-activity-link';  // 第一个按钮的选择器（跳转到下一个活动或视频）
    const playButtonSelector = '.prism-big-play-btn';  // 播放按钮的选择器
    const forumPostSelector = 'span.font-weight-normal';  // 用于检测"发表论坛帖子"的选择器

    // 检测“发表论坛帖子”的条件，并立即跳转到下一个视频
    const checkForumPostCondition = () => {
        const forumPostElement = document.querySelector(forumPostSelector);
        if (forumPostElement && forumPostElement.textContent.includes("发表论坛帖子")) {
            const buttonElement1 = document.querySelector(buttonSelector1);
            if (buttonElement1) {
                // 直接点击下一个活动或视频按钮
                buttonElement1.click();
                console.log("检测到'发表论坛帖子'，立即跳转到下一个活动！");
            } else {
                console.log("未找到下一个视频按钮！");
            }
        }
    };

    // 点击播放按钮
    const clickPlayButton = () => {
        const playButtonElement = document.querySelector(playButtonSelector);
        if (playButtonElement) {
            playButtonElement.click();
            console.log("页面加载完成，点击播放按钮！");
        } else {
            console.log("未找到播放按钮！");
        }
    };

    // 检查目标值并点击下一个按钮
    const checkValueAndClickNext = () => {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            const currentValue = parseFloat(targetElement.textContent || targetElement.innerText);
            if (!isNaN(currentValue) && currentValue >= targetValue) {
                const buttonElement1 = document.querySelector(buttonSelector1);
                if (buttonElement1) {
                    // 点击下一个活动或视频按钮
                    buttonElement1.click();
                    console.log(`目标值已达到 ${currentValue}, 点击下一个按钮！`);
                } else {
                    console.log("未找到下一个视频按钮！");
                }
            } else {
                console.log(`目标值未达到：当前值为 ${currentValue}`);
            }
        }
    };

    // 使用 MutationObserver 来监控 DOM 变化
    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                checkForumPostCondition();  // 检查是否符合发表论坛帖子条件
                checkValueAndClickNext();   // 继续检查目标值并点击下一个按钮
            }
        });
    });

    // 配置 observer 监听 DOM 变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 首先点击播放按钮，然后每 2 秒检查一次目标值并点击下一个按钮
    setTimeout(() => {
        checkForumPostCondition();  // 页面加载后立即检查发表论坛帖子条件
        clickPlayButton();  // 先点击播放按钮
        setInterval(checkValueAndClickNext, 6000);  // 启动定时检查目标值
    }, 3000);  // 等待 3 秒，确保页面加载完毕
})();
