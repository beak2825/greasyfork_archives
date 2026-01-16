// ==UserScript==
// @name         浙江省高校教师培训-刷网课
// @namespace    https://courseresource.zhihuishu.com/
// @version      3.0
// @description  1.引入2秒容错阈值解决1秒误差重播问题 2.支持1-16倍速 3.随机答题 4.顺序步进跳转
// @author       Modified for ZJAFU Teacher
// @match        *://courseresource.zhihuishu.com/courseDetailOther/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562714/%E6%B5%99%E6%B1%9F%E7%9C%81%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD-%E5%88%B7%E7%BD%91%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/562714/%E6%B5%99%E6%B1%9F%E7%9C%81%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD-%E5%88%B7%E7%BD%91%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = true;
    let currentSpeed = 1.0;
    let lastJumpTime = 0;
    let timer = null;
    const ERROR_THRESHOLD = 1; // 允许1秒的时间误差

    // --- 1. 控制面板 (功能保持 V2.9 一致)  ---
    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;top:10%;left:10px;z-index:999999;padding:15px;background:#fff;border:1px solid #ddd;border-radius:10px;box-shadow:0 4px 15px rgba(0,0,0,0.3);width:170px;';
    panel.innerHTML = `
        <div style="font-weight:bold;margin-bottom:10px;text-align:center;border-bottom:1px solid #eee;padding-bottom:5px;">控制台 V3.0</div>
        <button id="main-switch" style="width:100%;padding:8px;background:#67c23a;color:#fff;border:none;border-radius:5px;cursor:pointer;margin-bottom:10px;font-weight:bold;">脚本：运行中</button>
        <div id="speed-box" style="display:grid;grid-template-columns: 1fr 1fr;gap:6px;">
            <button class="s-btn" data-s="1">1x</button>
            <button class="s-btn" data-s="2">2x</button>
            <button class="s-btn" data-s="4">4x</button>
            <button class="s-btn" data-s="8">8x</button>
            <button class="s-btn" data-s="12">12x</button>
            <button class="s-btn" data-s="16" style="grid-column: span 2; background:#f56c6c; color:#fff;">16x</button>
        </div>
    `;
    document.body.appendChild(panel);

    document.getElementById('main-switch').onclick = function() {
        isRunning = !isRunning;
        this.innerHTML = isRunning ? '脚本：运行中' : '脚本：已暂停';
        this.style.background = isRunning ? '#67c23a' : '#909399';
    };

    document.querySelectorAll('.s-btn').forEach(btn => {
        btn.style.cssText = 'padding:6px;border:1px solid #dcdfe6;background:#fff;cursor:pointer;border-radius:4px;';
        btn.onclick = function() {
            currentSpeed = parseFloat(this.getAttribute('data-s'));
            document.querySelectorAll('.s-btn').forEach(b => b.style.borderColor = '#dcdfe6');
            this.style.borderColor = '#409eff';
            console.log(`[设置] 播放速度切换至: ${currentSpeed}x`);
        };
    });

    // 屏蔽无意义报错 [cite: 18, 19]
    const originalConsoleError = console.error;
    console.error = function(...args) {
        if (args[0] && typeof args[0] === 'string' && (args[0].includes('attribute d') || args[0].includes('NaN') || args[0].includes('catch'))) return;
        originalConsoleError.apply(console, args);
    };

    function timeToSeconds(timeStr) {
        if (!timeStr) return 0;
        const parts = timeStr.trim().replace(/[^\d:]/g, '').split(':').map(Number);
        return parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
    }

    // --- 2. 核心工作循环 ---
    function doWork() {
        if (!isRunning) return;

        const video = document.querySelector('video');
        const testDialog = document.querySelector('.el-dialog.dialog-test');

        // A. 智能答题处理 (多选随机/单选随机) [cite: 23, 24, 25]
        if (testDialog && testDialog.style.display !== 'none') {
            const options = testDialog.querySelectorAll('.topic-item');
            const titleText = testDialog.querySelector('.topic-title')?.innerText || "";
            if (options.length > 0) {
                if (titleText.includes('多选题')) {
                    const pickCount = Math.floor(Math.random() * (options.length - 1)) + 2;
                    const indices = Array.from({length: options.length}, (_, i) => i).sort(() => Math.random() - 0.5);
                    indices.slice(0, pickCount).forEach(idx => options[idx].click());
                } else {
                    options[Math.floor(Math.random() * options.length)].click();
                }
                setTimeout(() => {
                    const closeBtn = Array.from(document.querySelectorAll('.dialog-footer, .el-dialog__headerbtn'))
                                          .find(el => el.textContent.includes('关闭') || el.tagName === 'BUTTON');
                    if (closeBtn) closeBtn.click();
                }, 2000);
            }
            return;
        }

        // B. 视频控制与跳转判定 [cite: 31, 32, 33]
        if (video) {
            if (video.playbackRate !== currentSpeed) video.playbackRate = currentSpeed;
            if (video.paused && !document.querySelector('.el-dialog.dialog-test')) {
                video.muted = true;
                const p = video.play();
                if (p && typeof p.catch === 'function') p.catch(()=>{});
            }

            // --- 核心改进：引入误差补偿的进度对比 ---
            const currentChapter = document.querySelector('.current-chapter');
            if (currentChapter) {
                const durationNode = currentChapter.querySelector('.video-info span:not(.video-time)');
                const watchNode = currentChapter.querySelector('.right .timeT');

                if (durationNode && watchNode) {
                    const totalSec = timeToSeconds(durationNode.innerText);
                    const watchSec = timeToSeconds(watchNode.innerText);

                    // 容错逻辑：观看时间 >= (总时间 - 阈值) 或 视频已自然结束 [cite: 33, 34]
                    if (totalSec > 0 && (watchSec >= (totalSec - ERROR_THRESHOLD) || video.ended)) {
                        const now = Date.now();
                        if (now - lastJumpTime > 5000) {
                            lastJumpTime = now;
                            console.log(`[容错跳转] 进度符合阈值(${watchSec}/${totalSec})，准备进入下一节...`);
                            playNextSequentially();
                        }
                    }
                }
            }
        }
    }

    // --- 3. 顺序跳转实现 ---
    function playNextSequentially() {
        const allNodes = Array.from(document.querySelectorAll('.ant-tree-treenode'));
        const currentWrap = document.querySelector('.current-chapter');
        if (!currentWrap) return;

        const currentNode = currentWrap.closest('.ant-tree-treenode');
        const currentIndex = allNodes.indexOf(currentNode);

        let found = false;
        for (let i = currentIndex + 1; i < allNodes.length; i++) {
            const nextNode = allNodes[i];
            const videoInfo = nextNode.querySelector('.video-info');
            // 只寻找带有时长信息的有效视频节点 [cite: 35]
            const hasDuration = videoInfo && /\d{2}:\d{2}/.test(videoInfo.innerText);

            if (hasDuration) {
                const nextTitle = nextNode.querySelector('.chapter-title')?.innerText || "未名章节";
                console.log(`[跳转] 成功！下一节: ${nextTitle}`);

                const clickTarget = nextNode.querySelector('.ant-tree-node-content-wrapper');
                if (clickTarget) {
                    clickTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    clickTarget.click();
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            console.log("[完结] 列表后方已无更多视频，脚本已自动挂起。");
            isRunning = false;
            clearInterval(timer); // 彻底停止循环 [cite: 42, 43]
            document.getElementById('main-switch').innerHTML = '全部课程已播完';
            document.getElementById('main-switch').disabled = true;
            document.getElementById('main-switch').style.background = '#909399';
        }
    }

    timer = setInterval(doWork, 2500);
})();