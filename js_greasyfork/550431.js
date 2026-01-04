// ==UserScript==
// @name         河北省高等学校教师岗前培训课程助手
// @namespace    http://your-namespace-here.com/
// @version      0.8
// @description  自动倍速播放并切换到下一个视频（精简版 + 自动恢复播放）
// @author       阳阳
// @license      MIT
// @match        http://hbgs.study.gspxonline.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550431/%E6%B2%B3%E5%8C%97%E7%9C%81%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E6%95%99%E5%B8%88%E5%B2%97%E5%89%8D%E5%9F%B9%E8%AE%AD%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550431/%E6%B2%B3%E5%8C%97%E7%9C%81%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1%E6%95%99%E5%B8%88%E5%B2%97%E5%89%8D%E5%9F%B9%E8%AE%AD%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*** 配置 ***/
    let PLAYBACK_SPEED = 5;
    let NEXT_DELAY = 4000;
    let CHECK_INTERVAL = 60000; // 自动恢复播放轮询间隔

    let currentIndex = 0;
    let videoList = [];
    let video = null;
    let autoPlayTimer = null;

    /*** 初始化调试面板 ***/
    function createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 99999;
            background: rgba(0,0,0,0.75);
            color: #0f0;
            font-size: 12px;
            padding: 10px;
            border-radius: 6px;
            min-width: 180px;
            max-width: 250px;
            font-family: monospace;
        `;
        panel.innerHTML = `
            <div><b>课程助手调试面板</b></div>
            <div id="status">状态: 待机中</div>
            <div style="margin-top:6px;">
              倍速: <input id="speedInput" type="number" value="${PLAYBACK_SPEED}" style="width:50px;" min="1" max="16" />
              <button id="setSpeedBtn">设置</button>
            </div>
            <div style="margin-top:6px;">
              <button id="initBtn">🔧 初始化课程列表</button>
              <button id="nextBtn">➡️ 下一视频</button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('setSpeedBtn').onclick = () => {
            const val = parseFloat(document.getElementById('speedInput').value);
            if (!isNaN(val) && val > 0) {
                PLAYBACK_SPEED = val;
                if (video) video.playbackRate = PLAYBACK_SPEED;
                logStatus(`倍速已更新为 ${PLAYBACK_SPEED}x`);
            }
        };

        document.getElementById('initBtn').onclick = initializeAndSelect;
        document.getElementById('nextBtn').onclick = handleEnded;
    }

    function logStatus(msg) {
        document.getElementById('status').innerText = "状态: " + msg;
    }

    /*** 初始化未完成课程列表 ***/
    function initializeVideoList() {
        videoList = Array.from(document.querySelectorAll('li')).filter(li => {
            const status = li.querySelector('.learn-status');
            return status && !status.classList.contains('finish');
        });
        logStatus(`找到 ${videoList.length} 个未完成课程`);
    }

    /*** 初始化并选择第一条未完成课程 ***/
    function initializeAndSelect() {
        initializeVideoList();
        if (videoList.length > 0) {
            currentIndex = 0;
            videoList[currentIndex].click();
            setTimeout(playVideo, NEXT_DELAY);
        } else {
            logStatus('没有未完成课程');
        }
    }

    /*** 播放视频 ***/
    function playVideo() {
        video = document.querySelector('video');
        if (!video) {
            logStatus('未找到视频，500ms后重试...');
            setTimeout(playVideo, 500);
            return;
        }

        video.playbackRate = PLAYBACK_SPEED;
        video.muted = true;

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                logStatus(`播放课程 ${currentIndex + 1}/${videoList.length} (x${PLAYBACK_SPEED})`);
                startAutoPlayWatcher();
            }).catch(err => {
                logStatus('播放失败，可能需要用户交互才能播放');
                console.error(err);
            });
        }

        video.removeEventListener('ended', handleEnded);
        video.addEventListener('ended', handleEnded);
    }

    /*** 自动恢复播放监听 ***/
    function startAutoPlayWatcher() {
        stopAutoPlayWatcher();
        autoPlayTimer = setInterval(() => {
            if (video && video.paused) {
                video.play();
            }
        }, CHECK_INTERVAL);
    }

    function stopAutoPlayWatcher() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    /*** 下一视频 ***/
    function handleEnded() {
        stopAutoPlayWatcher();
        currentIndex++;
        if (currentIndex < videoList.length) {
            const next = videoList[currentIndex];
            logStatus(`切换到下一个课程: ${next.innerText}`);
            next.click();
            setTimeout(playVideo, NEXT_DELAY);
        } else {
            logStatus('✅ 所有视频已完成');
        }
    }

    /*** 初始化面板 ***/
    createDebugPanel();

})();
