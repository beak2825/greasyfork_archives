// ==UserScript==
// @name         中山教师研修-Tan自动秒刷
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  适用于中山教师研修(m.zsjsjy.com)，为课程视频提供秒刷功能。此为离线整合版本。
// @author       zzzzzzys (Original) & AI Merger
// @match        https://m.zsjsjy.com/teacher/train/train/online/study.do*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552239/%E4%B8%AD%E5%B1%B1%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE-Tan%E8%87%AA%E5%8A%A8%E7%A7%92%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/552239/%E4%B8%AD%E5%B1%B1%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE-Tan%E8%87%AA%E5%8A%A8%E7%A7%92%E5%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 状态标志，防止重复点击
    let isRunning = false;

    /**
     * 暂停函数
     * @param {number} ms - 暂停的毫秒数
     */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * 向服务器发送学习进度更新请求
     * @param {object} data - 包含进度信息的对象
     * @returns {Promise<object>} - 服务器返回的JSON响应
     * @throws {Error} - 如果请求失败或服务器返回错误代码
     */
    const updateProgress = async (data) => {
        // 构建带查询参数的URL
        const url = "https://m.zsjsjy.com/teacher/course/chapter/saveCourseChapterLog.do?" + new URLSearchParams(data);

        let res = await fetch(url, {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "x-requested-with": "XMLHttpRequest",
                "sec-ch-ua": "Not(A:Brand;v=99, Microsoft Edge;v=133, Chromium;v=133",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "Windows",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": location.href,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        if (res.ok) {
            const jsonResponse = await res.json();
            console.log("服务器响应:", jsonResponse);
            if (jsonResponse.responseCode !== "00") {
                // 如果服务器返回非成功代码，则抛出错误
                throw new Error(`服务器错误: ${jsonResponse.responseMsg || '未知错误'}`);
            }
            return jsonResponse;
        } else {
            throw new Error(`网络请求失败: ${res.status} ${res.statusText}`);
        }
    };

    /**
     * 核心秒刷功能函数
     */
    const startFastForward = async () => {
        if (isRunning) {
            console.warn("秒刷任务已在运行中，请勿重复点击。");
            return;
        }
        isRunning = true;

        try {
            // 使用jQuery从页面DOM中获取必要的ID
            const courseId = $('.g-mv-con .g-top').find("#courseId").val();
            const chapterId = $('.g-mv-con .g-top').find("#chapterId").val();
            const trainId = $("#trainId").val();
            const userId = $("#userId").val();

            if (!courseId || !chapterId || !trainId || !userId) {
                throw new Error("未能获取到课程或用户信息，请确保在正确的课程播放页面使用。");
            }

            const video = document.querySelector('video');
            if (!video || isNaN(video.duration) || video.duration === 0) {
                 // 延迟一会再试，因为视频可能还没加载好
                await sleep(2000);
                const videoRetry = document.querySelector('video');
                 if (!videoRetry || isNaN(videoRetry.duration) || videoRetry.duration === 0) {
                    throw new Error("未能找到视频或视频时长无效。");
                 }
                 return startFastForward(); // 重新调用
            }

            const maxTime = Math.ceil(video.duration);
            let currentTime = Math.floor(video.currentTime);

            // 暂停视频以防止干扰
            video.pause();

            const baseData = {
                "projectCode": "online",
                "trainId": trainId,
                "courseId": courseId,
                "chapterId": chapterId,
                "userId": userId,
                "duration": 0
            };

            console.log(`开始秒刷: 总时长 ${maxTime}s, 当前进度 ${currentTime}s`);

            while (currentTime < maxTime) {
                currentTime += 30; // 每次快进30秒
                if (currentTime >= maxTime) {
                    currentTime = maxTime;
                    baseData.isFinished = "01"; // 标记为完成
                }
                baseData.duration = currentTime;
                console.log(`发送进度: ${currentTime}s / ${maxTime}s`);
                await updateProgress(baseData);
                await sleep(500); // 短暂延迟，避免请求过于频繁
            }

            alert("Tan当前视频秒刷完成！请刷新页面或手动切换到下一个视频查看进度。");
            console.log("秒刷任务成功完成！");

        } catch (error) {
            console.error("秒刷过程中发生错误:", error);
            alert(`秒刷失败: ${error.message}\n请检查控制台获取详细信息。`);
        } finally {
            isRunning = false; // 任务结束，重置标志
        }
    };

    /**
     * 创建并注入一个功能按钮到页面中
     */
    function createActionButton() {
        const button = document.createElement('button');
        button.textContent = 'Tan秒刷当前视频';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.fontSize = '14px';
        button.style.color = 'white';
        button.style.backgroundColor = '#007BFF';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        button.addEventListener('click', async () => {
            if (isRunning) return;
            button.textContent = 'Tan正在秒刷...';
            button.disabled = true;
            await startFastForward();
            button.textContent = 'Tan秒刷当前视频';
            button.disabled = false;
        });

        document.body.appendChild(button);
        console.log("秒刷按钮已加载。");
    }

    // 当页面加载完成后，注入按钮
    createActionButton();

})();