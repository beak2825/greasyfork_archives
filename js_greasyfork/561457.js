// ==UserScript==
// @name         Linux.do 循序点赞助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在 linux.do 话题页面逐个点赞，精准检测 24 小时上限弹窗并停止
// @author       Gemini
// @match        https://linux.do/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561457/Linuxdo%20%E5%BE%AA%E5%BA%8F%E7%82%B9%E8%B5%9E%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561457/Linuxdo%20%E5%BE%AA%E5%BA%8F%E7%82%B9%E8%B5%9E%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // --- 精准检测弹窗逻辑 ---
    function checkLimitReached() {
        // 使用你提供的精准选择器
        const dialogBody = document.querySelector('#dialog-holder > div.dialog-content > div.dialog-body');

        if (dialogBody) {
            const text = dialogBody.innerText;
            if (text.includes('24 小时点赞上限') || text.includes('分享很多爱')) {
                console.log('⚠️ 检测到点赞上限弹窗，停止任务');
                return true;
            }
        }
        return false;
    }

    async function doBatchLike() {
        if (isRunning) return;

        const likeButtons = Array.from(document.querySelectorAll('button[title="点赞此帖子"]'))
                                 .filter(btn => !btn.classList.contains('has-like'));

        if (likeButtons.length === 0) {
            updateStatus('⚠️ 无新帖', '#6c757d');
            return;
        }

        isRunning = true;
        const originalText = '❤️';

        for (let i = 0; i < likeButtons.length; i++) {
            // 每次点击前先检查一次是否已经弹窗
            if (checkLimitReached()) {
                stopWithLimit();
                return;
            }

            const btn = likeButtons[i];
            if (!btn.classList.contains('has-like')) {
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                btn.click();

                updateStatus(`⏳ 点赞中 (${i + 1}/${likeButtons.length})`, '#fd7e14');

                // 点击后等待，给系统反应和弹窗弹出的时间
                await sleep(800);

                // 点击后再检查一次，捕获刚弹出的提示
                if (checkLimitReached()) {
                    stopWithLimit();
                    return;
                }
            }
        }

        updateStatus(`✅ 完成 ${likeButtons.length}个`, '#28a745');
        isRunning = false;

        setTimeout(() => {
            updateStatus(originalText, '#0088cc');
        }, 3000);
    }

    // 封装因达到上限而停止的 UI 处理
    function stopWithLimit() {
        updateStatus('🚫 已达上限', '#dc3545');
        isRunning = false;
        // 自动关闭弹窗（可选，如果不想手动点确定的话可以取消注释）
        // document.querySelector('#dialog-holder .btn-primary')?.click();
    }

    function createButton() {
        if (document.getElementById('linux-do-batch-like-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'linux-do-batch-like-btn';
        btn.innerHTML = '❤️';

        btn.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 9999;
            padding: 10px;
            width: 45px;
            height: 45px;
            background-color: #0088cc;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-weight: bold;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-family: sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            white-space: nowrap;
        `;

        btn.onmouseover = () => { if(!isRunning) btn.style.transform = 'scale(1.1)'; };
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
        btn.onclick = doBatchLike;

        document.body.appendChild(btn);
    }

    function updateStatus(text, color) {
        const mainBtn = document.getElementById('linux-do-batch-like-btn');
        if (mainBtn) {
            mainBtn.innerHTML = text;
            mainBtn.style.backgroundColor = color;

            if (text !== '❤️') {
                mainBtn.style.width = 'auto';
                mainBtn.style.paddingLeft = '18px';
                mainBtn.style.paddingRight = '18px';
            } else {
                mainBtn.style.width = '45px';
                mainBtn.style.padding = '10px';
            }
        }
    }

    // 路由监听逻辑
    setTimeout(createButton, 2000);
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (url.includes('/t/')) {
                setTimeout(createButton, 1000);
            }
        }
    }).observe(document, {subtree: true, childList: true});

})();