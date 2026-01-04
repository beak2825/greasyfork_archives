// ==UserScript==
// @name         Twitter 批量定时-🐱
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  批量发布大量定时推文、API日志显示当前时间、结束弹窗显示时间戳。
// @author       ols & los
// @match        https://x.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/552246/Twitter%20%E6%89%B9%E9%87%8F%E5%AE%9A%E6%97%B6-%F0%9F%90%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/552246/Twitter%20%E6%89%B9%E9%87%8F%E5%AE%9A%E6%97%B6-%F0%9F%90%B1.meta.js
// ==/UserScript==

// Copyright © 2025 ols & los
//
// This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/
//
// 本作品采用知识共享署名-非商业性使用-禁止演绎 4.0 国际许可协议进行许可。
// 要查看该许可协议的副本，请访问 http://creativecommons.org/licenses/by-nc-nd/4.0/


(function() {
    'use strict';

    let uploadedTweets = [];
    let originalFileName = 'tweets.txt';
    let filePrefixNumber = '0';

    // --- 模块 1: API 处理器 ---
    const apiHandler = {
        csrfToken: null,
        rateLimit: { limit: null, remaining: null, reset: null },
        initialize: function() {
            const csrfTokenMatch = document.cookie.match(/ct0=([a-zA-Z0-9]+)/);
            if (!csrfTokenMatch) { console.error("初始化失败：无法找到 ct0 (x-csrf-token)。"); return false; }
            this.csrfToken = csrfTokenMatch[1];
            return true;
        },
        sendRequest: async function(tweetText, timestamp) {
            if (!this.csrfToken) throw new Error("API处理器未初始化或Token无效。");
            const response = await fetch('https://x.com/i/api/graphql/LCVzRQGxOaGnOnYH01NQXg/CreateScheduledTweet', {
                method: 'POST',
                headers: {
                    'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
                    'content-type': 'application/json', 'x-csrf-token': this.csrfToken,
                    'x-twitter-active-user': 'yes', 'x-twitter-auth-type': 'OAuth2Session',
                },
                body: JSON.stringify({
                    variables: { post_tweet_request: { status: tweetText, media_ids: [] }, execute_at: String(timestamp) },
                    queryId: 'LCVzRQGxOaGnOnYH01NQXg'
                })
            });
            this.rateLimit.limit = response.headers.get("x-rate-limit-limit");
            this.rateLimit.remaining = response.headers.get("x-rate-limit-remaining");
            this.rateLimit.reset = response.headers.get("x-rate-limit-reset");
            console.log(`[API 信息] Limit: ${this.rateLimit.limit}, Remaining: ${this.rateLimit.remaining}, Reset: ${new Date(this.rateLimit.reset * 1000).toLocaleString()}`);//, 当前时间: ${new Date().toLocaleString()}
            return response.json();
        }
    };

    // --- 模块 2: UI 和主逻辑 ---
    function setupUI() {
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed; top:100px; left:10px; z-index:9999; display:flex; flex-direction:column; gap:10px; background: rgba(255,255,255,0.9); padding: 10px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);';
        const fileInput = document.createElement('input');
        fileInput.type = 'file'; fileInput.accept = '.txt'; fileInput.onchange = handleFileUpload;

        const numberSelectorContainer = document.createElement('div');
        numberSelectorContainer.style.cssText = 'display: flex; align-items: center; gap: 5px;';
        const numberLabel = document.createElement('label');
        numberLabel.textContent = '下载文件名前缀:';
        numberLabel.style.fontSize = '12px';
        const numberSelect = document.createElement('select');
        numberSelect.style.cssText = 'padding: 5px; border-radius: 5px; border: 1px solid #ccc;';
        for (let i = 0; i <= 9; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            numberSelect.appendChild(option);
        }
        numberSelect.onchange = (e) => {
            filePrefixNumber = e.target.value;
        };
        numberSelectorContainer.appendChild(numberLabel);
        numberSelectorContainer.appendChild(numberSelect);

        const scheduleButton = document.createElement('button');
        scheduleButton.textContent = '批量定时发布';
        scheduleButton.style.cssText = 'background-color:#1DA1F2; color:white; border:none; padding:10px; cursor:pointer; border-radius: 5px;';
        scheduleButton.onclick = scheduleTweetsInBatch;

        container.appendChild(fileInput);
        container.appendChild(numberSelectorContainer); 
        container.appendChild(scheduleButton);
        document.body.appendChild(container);
    }

    function handleFileUpload(event) {
        const file = event.target.files[0]; if (!file) return;
        originalFileName = file.name; 
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedTweets = e.target.result.split('\n').filter(line => line.trim() !== '');
            alert(uploadedTweets.length > 0 ? `文件 '${originalFileName}' 加载成功！共 ${uploadedTweets.length} 条推文。` : '文件为空或格式不正确。');
        };
        reader.readAsText(file);
    }

    function downloadRemainingTweets() {
        if (uploadedTweets.length === 0) { alert("没有剩余的推文可供下载。"); return; }
        const textContent = uploadedTweets.join('\n');
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filePrefixNumber}-${originalFileName}`;
        a.click(); URL.revokeObjectURL(url); a.remove();
    }

    function showCompletionModal({ successCount, duration, reason, resetTime, lastSuccessTimestamp }) {
        const oldModal = document.getElementById('tampermonkey-result-modal'); if (oldModal) oldModal.remove();
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'tampermonkey-result-modal';
        modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;';
        const modalContent = document.createElement('div');
        modalContent.style.cssText = 'background: white; padding: 25px; border-radius: 8px; text-align: left; color: black; max-width: 400px;';
        let html = `<h3 style="margin: 0 0 15px 0; text-align: center;">批量任务结束</h3>
                    <p><strong>结束原因:</strong> ${reason}</p>
                    <p>成功调度: <strong>${successCount}</strong> 条推文</p>
                    <p>总计耗时: <strong>${duration}</strong> 秒</p>
                    <p>剩余待发布文案: <strong>${uploadedTweets.length}</strong> 条</p>`;

        if (lastSuccessTimestamp) {
            html += `<p>最后成功请求时间: <strong>${new Date(lastSuccessTimestamp * 1000).toLocaleString()} (时间戳: ${lastSuccessTimestamp})</strong></p>`;
        }

        if (resetTime) { html += `<p style="color: #dc3545; font-weight: bold;">API配额将在 ${resetTime} 重置。</p>`; }
        modalContent.innerHTML = html;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'text-align: center; margin-top: 20px;';
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '下载剩余文案';
        downloadBtn.style.cssText = 'background-color: #28a745; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer;';
        downloadBtn.onclick = downloadRemainingTweets;
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = 'background-color: #6c757d; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;';
        closeBtn.onclick = () => modalOverlay.remove();
        buttonContainer.appendChild(downloadBtn);
        buttonContainer.appendChild(closeBtn);
        modalContent.appendChild(buttonContainer);
        modalOverlay.appendChild(modalContent); document.body.appendChild(modalOverlay);
    }

    async function scheduleTweetsInBatch() {
        if (uploadedTweets.length === 0) return alert('错误：请先上传 .txt 文件！');
        if (!apiHandler.initialize()) return alert('初始化失败，无法获取 CSRF Token，请刷新页面重试。');

        const startTime = performance.now();
        const successfullyScheduledTexts = new Set();
        let lastSuccessTimestamp = null; // 新增：用于追踪最后一次成功的请求时间

        try {
            const TAGS_URL = 'https://gist.githubusercontent.com/wonderingcat927/aab74a5f7a8fd793443deaefd8e8165d/raw/CSTTag_1.txt';
            const TIME_URL = 'https://gist.githubusercontent.com/wonderingcat927/aab74a5f7a8fd793443deaefd8e8165d/raw/CSTTag_1_time.json';
            const [tags, timeDataJson] = await Promise.all([
                new Promise(r => GM_xmlhttpRequest({ method: "GET", url: TAGS_URL, onload: res => r(res.responseText) })),
                new Promise(r => GM_xmlhttpRequest({ method: "GET", url: TIME_URL, onload: res => r(res.responseText) }))
            ]);
            const timeData = JSON.parse(timeDataJson);
            const cloudStartTime = parseInt(timeData.start, 10), cloudEndTime = parseInt(timeData.end, 10);
            const rawTags = tags.trim();
            if (!rawTags) throw new Error("云端词条为空。");

            const userInputStart = prompt(`请输入起始时间的Unix时间戳`, cloudStartTime);
            const userInputInterval = prompt("请输入发布间隔秒数:", "3600");
            const userInputEnd = prompt(`请输入结束时间的Unix时间戳`, cloudEndTime);

            if (!userInputStart || !userInputInterval || !userInputEnd) return;
            const userStartTime = parseInt(userInputStart, 10), userInterval = parseInt(userInputInterval, 10), userEndTime = parseInt(userInputEnd, 10);
            if (isNaN(userStartTime) || isNaN(userInterval) || isNaN(userEndTime) || userInterval <= 0 || userStartTime >= userEndTime) throw new Error("输入的时间或间隔无效。");

            let plannedRequests = Math.min(Math.floor((userEndTime - userStartTime) / userInterval) + 1, uploadedTweets.length);
            if (plannedRequests <= 0) return alert("根据您的设置，没有可执行的任务。");

            // --- 步骤 1: 发送首个任务并探测API速率 ---
            const firstTimestamp = userStartTime;
            // 更新：在控制台打印任务及其预定时间
            console.log(`发送首个任务（#1）并探测 API 速率... 预定时间: ${new Date(firstTimestamp * 1000).toLocaleString()}`);
            const firstTweetText = uploadedTweets[0];
            const firstFinalTweet = `${firstTweetText}\n\n${rawTags}`;
            let actualRequests = 0;
            let stopReason = "所有计划内任务均已完成。";

            const firstResult = await apiHandler.sendRequest(firstFinalTweet, firstTimestamp);
            if (firstResult.errors) throw new Error(`首个任务发送失败: ${JSON.stringify(firstResult.errors)}，任务终止。`);

            console.log(`[任务 1] 调度成功!`);
            successfullyScheduledTexts.add(firstTweetText);
            lastSuccessTimestamp = firstTimestamp; // 记录首次成功的时间戳

            // --- 步骤 2: 计算本轮总限额 ---
            const remainingQuota = parseInt(apiHandler.rateLimit.remaining, 10);
            if (isNaN(remainingQuota)) throw new Error("获取有效的 API 剩余配额失败。");
            const totalPermitted = 1 + remainingQuota;
            actualRequests = Math.min(plannedRequests, totalPermitted);
            console.log(`探测成功！本轮总配额为 ${totalPermitted} 次，计划执行 ${actualRequests} 次。`);
            if (plannedRequests > totalPermitted) {
                alert(`警告：您计划发送 ${plannedRequests} 条，但当前 API 配额仅允许再发送 ${remainingQuota} 条 (共 ${totalPermitted} 条)。\n\n任务将自动调整。`);
                stopReason = "已达到 API 速率限制上限。";
            } else if (actualRequests < plannedRequests) {
                 stopReason = "所有上传的文案已用完。";
            }

            // --- 步骤 3: 循环执行剩余的任务 ---
            for (let i = 1; i < actualRequests; i++) {
                const timestamp = userStartTime + (i * userInterval);
                const currentTweetText = uploadedTweets[i];
                const finalTweet = `${currentTweetText}\n\n${rawTags}`;
                // 更新：在控制台打印每个任务及其预定时间
                console.log(`[任务 ${i + 1}/${actualRequests}] 调度中... 发布时间: ${new Date(timestamp * 1000).toLocaleString()}`);
                try {
                    const result = await apiHandler.sendRequest(finalTweet, timestamp);
                    if (result.errors) {
                        console.error(`[任务 ${i + 1}] 调度失败:`, result.errors);
                    } else {
                        console.log(`[任务 ${i + 1}] 调度成功!`);
                        successfullyScheduledTexts.add(currentTweetText);
                        lastSuccessTimestamp = timestamp; // 更新为最近一次成功的时间戳
                    }
                } catch (e) { console.error(`[任务 ${i + 1}] 网络请求错误:`, e); }

                if (i < actualRequests - 1) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }

            // --- 步骤 4: 任务结束，显示结果 ---
            uploadedTweets = uploadedTweets.filter(tweet => !successfullyScheduledTexts.has(tweet));
            const endTime = performance.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            let resetTime = null;
            if (stopReason === "已达到 API 速率限制上限。") {
                resetTime = new Date(apiHandler.rateLimit.reset * 1000).toLocaleString();
            }

            showCompletionModal({
                successCount: successfullyScheduledTexts.size,
                duration: duration,
                reason: stopReason,
                resetTime: resetTime,
                lastSuccessTimestamp: lastSuccessTimestamp
            });

        } catch (error) {
            console.error('执行过程中发生严重错误:', error);
            alert(`操作失败: ${error.message}`);
        }
    }

    window.setTimeout(setupUI, 5000);
})();

