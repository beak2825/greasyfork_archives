// ==UserScript==
// @name         Linux.do 自动点赞 V10.3 
// @namespace    http://tampermonkey.net/
// @version      10.3
// @description  [v10.3 终极优化版] 引入UI更新缓存机制，解决倒计时显示跳动问题并提升性能。增加Cloudflare Turnstile错误过滤器，增强脚本在复杂网络环境下的稳定性。
// @author       AIMYON & GOOGLE GEMINI 2.5 PRO & ANTHROPIC CLAUDE - SONNET 4
// @match        https://linux.do/t/*
// @icon         https://cdn.linux.do/uploads/default/optimized/1X/a2c163351a02241bc56303b6070622a55543c8d1_2_32x32.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548411/Linuxdo%20%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%20V103.user.js
// @updateURL https://update.greasyfork.org/scripts/548411/Linuxdo%20%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%20V103.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.likeBotInstanceRunning) return;
    window.likeBotInstanceRunning = true;

    // =======================================================
    // 1. 配置中心
    // =======================================================
    const CONFIG = {
        maxPostAgeInDays: 7,
        scanIntervalSeconds: 60,
        dailyLikeLimit: 40,
        dailyLimitPopupSelector: ".dialog-body",
        maxLikesPerSession: 5,
        sessionCooldownSeconds: 180,
        minDelayBetweenLikes: 3500,
        maxDelayBetweenLikes: 7500,
        likeRetryAttempts: 3,
    };

    // =======================================================
    // 2. 状态与统计
    // =======================================================
    const stats = {
        totalScanned: 0, totalLiked: 0, totalSkippedOld: 0, totalSkippedUnknown: 0, errors: 0,
        reset() { Object.keys(this).forEach(key => { if (typeof this[key] === 'number') this[key] = 0; }); },
        getReport() { return `S:${stats.totalScanned}|L:${stats.totalLiked}|O:${stats.totalSkippedOld}|U:${stats.totalSkippedUnknown}|E:${stats.errors}`; }
    };
    const dailyCountKey = "likeBot_dailyCount", lastResetKey = "likeBot_lastResetDate", collapsedStateKey = "likeBot_isCollapsed";
    const likeButtonSelector = ".btn-toggle-reaction-like";
    let isPaused = false, isCollapsed = false, isProcessing = false;
    let uiPanel, uiStatus, uiCountdown, uiCounter, uiStats, uiHeader;
    let nextScanTimer = null;
    let navigationObserver = null;
    // 🔥 新增：UI点赞数缓存变量
    let cachedDailyCount = null;
    let lastCountUpdateTime = 0;


    function log(message) { console.log(`[自动点赞脚本 v10.3] ${message}`); }
    function err(message, error) { console.error(`[自动点赞脚本 v10.3] ${message}`, error || ''); }

    // 🔥 优化后的全局错误处理 - 忽略Turnstile错误
    window.addEventListener('error', (e) => {
        const errorMsg = e.error?.message || e.message || '';
        if (errorMsg.includes('TurnstileError') || errorMsg.includes('Turnstile')) {
            console.log(`[自动点赞脚本 v10.3] 忽略Cloudflare验证错误:`, errorMsg);
            return;
        }
        stats.errors++;
        err("捕获到全局错误:", e.error);
        updateUIPanel("错误", "⚠️");
    });
    window.addEventListener('unhandledrejection', (e) => {
        const reason = e.reason?.message || e.reason || '';
        if (reason.includes && (reason.includes('TurnstileError') || reason.includes('Turnstile'))) {
            console.log(`[自动点赞脚本 v10.3] 忽略Turnstile Promise错误:`, reason);
            return;
        }
        stats.errors++;
        err("捕获到未处理的Promise rejection:", e.reason);
        updateUIPanel("错误", "⚠️");
    });


    // =======================================================
    // 3. 核心逻辑
    // =======================================================

    function extractTopicId(url) {
        const match = url.match(/\/t\/[^\/]+\/(\d+)/);
        return match ? match[1] : null;
    }

    function resetProcessingState() {
        isProcessing = false;
        if (nextScanTimer) {
            clearTimeout(nextScanTimer);
            clearInterval(nextScanTimer);
            nextScanTimer = null;
        }
    }

    async function getDailyCount() { const today = new Date().toISOString().slice(0, 10); if (today !== await GM_getValue(lastResetKey, null)) { log(`新的一天，重置点赞计数。`); await GM_setValue(dailyCountKey, 0); await GM_setValue(lastResetKey, today); stats.reset(); return 0; } return await GM_getValue(dailyCountKey, 0); }
    async function setDailyCount(count) { await GM_setValue(dailyCountKey, count); }

    function checkPostAge(postContainer) {
        const recentPatterns = [
            /(\d+)\s*(分|minute|分前)/i, /(\d+)\s*(小时|時間|hour|時間前)/i,
            /(\d+)\s*(秒|second|秒前)/i, /刚刚|now|just now/i,
        ];
        const oldPatterns = [
            /(\d+)\s*(天|日|day|日前)/i, /(\d+)\s*(周|週間|week|週間前)/i,
            /(\d+)\s*(月|ヶ月|month|ヶ月前)/i, /(\d+)\s*(年|year|年前)/i,
        ];
        const dateElement = postContainer.querySelector('a.post-date[data-time]');
        if (dateElement && dateElement.dataset.time) {
            const ageInDays = (Date.now() - parseInt(dateElement.dataset.time, 10)) / 86400000;
            if (ageInDays <= CONFIG.maxPostAgeInDays) {
                return { shouldLike: true, reason: 'timestamp' };
            } else {
                return { shouldLike: false, reason: `Timestamp > ${CONFIG.maxPostAgeInDays}d` };
            }
        }
        const timeTextElement = postContainer.querySelector('.relative-date, .post-date');
        if (timeTextElement) {
            const timeText = timeTextElement.textContent.trim();
            if (oldPatterns.some(p => p.test(timeText))) {
                return { shouldLike: false, reason: `Old keyword: "${timeText}"` };
            }
            if (recentPatterns.some(p => p.test(timeText))) {
                return { shouldLike: true, reason: `Recent keyword: "${timeText}"` };
            }
        }
        return { shouldLike: false, reason: 'Unknown age' };
    }


    async function performLikeWithRetry(button) {
        for (let attempt = 1; attempt <= CONFIG.likeRetryAttempts; attempt++) {
            try {
                let observer, timeoutId;
                const promise = new Promise((resolve) => {
                    observer = new MutationObserver(() => {
                        const popup = document.querySelector(CONFIG.dailyLimitPopupSelector);
                        if (popup && popup.offsetParent &&
                            (popup.textContent.includes('24 時間') || popup.textContent.includes('上限'))) {
                            clearTimeout(timeoutId);
                            resolve({ limitReached: true });
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                    timeoutId = setTimeout(() => resolve({ limitReached: false }), 4000);

                    if (document.body.contains(button)) {
                        button.click();
                    } else {
                        resolve({ limitReached: false, error: 'Button not in DOM' });
                    }
                });
                try {
                    return await promise;
                } finally {
                    if (observer) observer.disconnect();
                }
            } catch (error) {
                stats.errors++;
                err(`点赞失败 (尝试 ${attempt}/${CONFIG.likeRetryAttempts})`, error);
                if (attempt === CONFIG.likeRetryAttempts) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
        return { limitReached: false };
    }

    async function processLikes() {
        if (isProcessing) return;

        resetProcessingState();
        isProcessing = true;

        try {
            await waitForResume();

            if (!location.pathname.startsWith('/t/')) {
                updateUIPanel("非帖子页", "-");
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            const dailyCount = await getDailyCount();
            if (dailyCount >= CONFIG.dailyLikeLimit) {
                updateUIPanel("每日上限", "😴", dailyCount);
                return;
            }

            updateUIPanel("扫描中...", "-", dailyCount);

            const allButtons = Array.from(document.querySelectorAll(likeButtonSelector + ":not(.active)"));
            const targetsQueue = [];

            for (const btn of allButtons) {
                stats.totalScanned++;
                const post = btn.closest('.topic-post');
                if (!post) {
                    stats.totalSkippedUnknown++;
                    continue;
                }
                const result = checkPostAge(post);
                if (result.shouldLike) {
                    targetsQueue.push(btn);
                    log(`发现可点赞帖子: ${result.reason}`);
                } else {
                    if (result.reason.includes('Timestamp >') || result.reason.includes('Old keyword:')) {
                        stats.totalSkippedOld++;
                    } else {
                        stats.totalSkippedUnknown++;
                    }
                    log(`跳过帖子: ${result.reason}`);
                }
            }

            if (targetsQueue.length > 0) {
                log(`发现 ${targetsQueue.length} 个可点赞帖子。`);
                const sessionSize = Math.min(targetsQueue.length, CONFIG.maxLikesPerSession, CONFIG.dailyLikeLimit - dailyCount);
                let sessionLikes = 0;

                for (let i = 0; i < sessionSize; i++) {
                    await waitForResume();
                    const button = targetsQueue[i];
                    if (!document.body.contains(button)) continue;

                    const { limitReached } = await performLikeWithRetry(button);
                    if (limitReached) {
                        await setDailyCount(CONFIG.dailyLikeLimit);
                        updateUIPanel("达到上限", "😴", CONFIG.dailyLikeLimit);
                        return;
                    }
                    stats.totalLiked++;
                    sessionLikes++;
                    updateUIPanel(`点赞中...`, `${sessionLikes}/${sessionSize}`, dailyCount + sessionLikes);

                    if (i < sessionSize - 1) {
                         await new Promise(r => setTimeout(r, getRandomDelay(CONFIG.minDelayBetweenLikes, CONFIG.maxDelayBetweenLikes)));
                    }
                }

                if (sessionLikes > 0) await setDailyCount(dailyCount + sessionLikes);
                scheduleNextScan(CONFIG.sessionCooldownSeconds);
            } else {
                log("未发现可点赞帖子。");
                scheduleNextScan(CONFIG.scanIntervalSeconds);
            }
        } catch (error) {
            stats.errors++;
            err("处理流程异常:", error);
            scheduleNextScan(30);
        } finally {
            isProcessing = false;
        }
    }

    function scheduleNextScan(seconds) {
        resetProcessingState();

        const initialUrl = location.href;
        let remaining = seconds;

        const update = async () => {
            if (location.href !== initialUrl) {
                clearInterval(nextScanTimer);
                nextScanTimer = null;
                log("页面已切换，停止旧的倒计时。");
                return;
            }
            if (isPaused || isProcessing) return;
            if (remaining <= 0) {
                clearInterval(nextScanTimer);
                nextScanTimer = null;
                processLikes();
                return;
            }
            updateUIPanel("等待中...", `${remaining}s`);
            remaining--;
        };

        nextScanTimer = setInterval(update, 1000);
        update();
    }

    // =======================================================
    // 4. UI 和辅助函数
    // =======================================================
    // 🔥 替换为带缓存优化的 updateUIPanel 函数
    async function updateUIPanel(status, countdown = '-', count) {
        if (!uiStatus) return;

        uiStatus.textContent = status;
        uiCountdown.textContent = countdown;

        if (count === undefined || count === null) {
            const now = Date.now();
            if (!cachedDailyCount || now - lastCountUpdateTime > 5000) {
                cachedDailyCount = await getDailyCount();
                lastCountUpdateTime = now;
            }
            count = cachedDailyCount;
        } else {
            cachedDailyCount = count;
            lastCountUpdateTime = Date.now();
        }

        uiCounter.textContent = `${count} / ${CONFIG.dailyLikeLimit}`;
        if (uiStats) uiStats.textContent = stats.getReport();
    }


    function togglePause() {
        isPaused = !isPaused;
        const btn = document.getElementById('like-bot-pause-btn');
        if (btn) btn.textContent = isPaused ? "▶️ 继续" : "⏸️ 暂停";

        if (!isPaused) {
            log("脚本已恢复");
            processLikes();
        } else {
            log("脚本已暂停");
            resetProcessingState();
            updateUIPanel("已暂停", "⏸️");
        }
    }

    async function waitForResume() { while (isPaused) { await new Promise(r => setTimeout(r, 1000)); } }
    function createUIPanel() { if (document.getElementById('like-bot-panel')) return true; const panelHTML = ` <div id="like-bot-panel"> <div id="like-bot-header" title="点击折叠"><strong>自动点赞 V10.3</strong></div> <div id="like-bot-content"> <p><strong>状态:</strong> <span id="like-bot-status">初始化中...</span></p> <p><strong>倒计时:</strong> <span id="like-bot-countdown">-</span></p> <p><strong>今日已赞:</strong> <span id="like-bot-counter">0 / ${CONFIG.dailyLikeLimit}</span></p> <p style="font-size: 11px; color: #888;"><strong>统计:</strong> <span id="like-bot-stats">...</span></p> </div> <div id="like-bot-footer"><button id="like-bot-pause-btn">⏸️ 暂停</button></div> </div>`; document.body.insertAdjacentHTML('beforeend', panelHTML); uiPanel = document.getElementById('like-bot-panel'); uiHeader = document.getElementById('like-bot-header'); uiStatus = document.getElementById('like-bot-status'); uiCountdown = document.getElementById('like-bot-countdown'); uiCounter = document.getElementById('like-bot-counter'); uiStats = document.getElementById('like-bot-stats'); const pauseBtn = document.getElementById('like-bot-pause-btn'); if (uiHeader) uiHeader.addEventListener('click', async () => { isCollapsed = !isCollapsed; uiPanel.classList.toggle('collapsed', isCollapsed); await GM_setValue(collapsedStateKey, isCollapsed); }); if (pauseBtn) pauseBtn.addEventListener('click', togglePause); makeDraggable(uiPanel); return true; }
    function getRandomDelay(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }
    function makeDraggable(element) { let p1=0,p2=0,p3=0,p4=0; const h=document.getElementById("like-bot-header"); if(h){h.onmousedown=d} function d(e){if(e.button!==0)return;e.preventDefault();p3=e.clientX;p4=e.clientY;document.onmouseup=c;document.onmousemove=m} function m(e){e.preventDefault();p1=p3-e.clientX;p2=p4-e.clientY;p3=e.clientX;p4=e.clientY;element.style.top=(element.offsetTop-p2)+"px";element.style.left=(element.offsetLeft-p1)+"px"} function c(){document.onmouseup=null;document.onmousemove=null} }
    function injectStyles() { GM_addStyle(`/* ... 样式保持不变 ... */ #like-bot-panel{position:fixed;bottom:20px;right:20px;width:230px;height:fit-content;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.3);z-index:9999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:14px;overflow:hidden;backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);transition:background .3s ease,border .3s ease,color .3s ease}#like-bot-header{padding:10px;cursor:move;text-align:center;font-weight:700}#like-bot-content{padding:15px}#like-bot-content p{margin:0 0 10px;display:flex;justify-content:space-between;align-items:center}#like-bot-content p:last-child{margin-bottom:0}#like-bot-status,#like-bot-countdown,#like-bot-counter{font-weight:700}#like-bot-footer{padding:10px;text-align:center}#like-bot-pause-btn{color:#fff;border:none;padding:9px 10px;border-radius:10px;cursor:pointer;width:90%;font-size:14px;font-weight:700;transition:all .2s ease}#like-bot-content,#like-bot-footer{transition:all .35s ease-in-out,max-height .35s ease-in-out,padding .35s ease-in-out;max-height:200px;overflow:hidden}#like-bot-panel.collapsed #like-bot-content,#like-bot-panel.collapsed #like-bot-footer{max-height:0;padding-top:0;padding-bottom:0;opacity:0;border-top:none}#like-bot-header{transition:background-color .3s ease}#like-bot-panel.collapsed #like-bot-header{border-bottom:none}@media (prefers-color-scheme:light){#like-bot-panel{background:rgba(255,255,255,.7);border:1px solid rgba(0,0,0,.08)}#like-bot-header,#like-bot-content p{color:#333}#like-bot-header{background-color:rgba(0,0,0,.05);border-bottom:1px solid rgba(0,0,0,.08)}#like-bot-footer{border-top:1px solid rgba(0,0,0,.08)}#like-bot-status{color:#e74c3c}#like-bot-countdown{color:#4285f4}#like-bot-counter{color:#f4b400}#like-bot-pause-btn{background-color:#4285f4}#like-bot-pause-btn:hover{background-color:#3367d6;transform:scale(1.02)}}@media (prefers-color-scheme:dark){#like-bot-panel{background:rgba(34,34,34,.6);border:1px solid rgba(255,255,255,.1)}#like-bot-header,#like-bot-content p{color:#f0f0f0;text-shadow:0 1px 3px rgba(0,0,0,.7)}#like-bot-header{background-color:rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.1)}#like-bot-footer{border-top:1px solid rgba(255,255,255,.1)}#like-bot-status{color:#2ecc71}#like-bot-countdown{color:#3498db}#like-bot-counter{color:#f4b400}#like-bot-pause-btn{background-color:rgba(66,133,244,.8);border:1px solid rgba(255,255,255,.2)}#like-bot-pause-btn:hover{background-color:#4285f4;box-shadow:0 0 15px rgba(66,133,244,.6);transform:scale(1.02)}}`); }

    function setupNavigationObserver() {
        let lastPathname = location.pathname;
        let lastTopicId = extractTopicId(location.href);
        let debounceTimer = null;
        const mainOutlet = document.querySelector('#main-outlet');

        if (!mainOutlet) {
            err("无法找到 #main-outlet，导航观察器启动失败！");
            return;
        }

        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const currentPathname = location.pathname;
                const currentTopicId = extractTopicId(location.href);

                if (currentPathname !== lastPathname || currentTopicId !== lastTopicId) {
                    log(`检测到页面导航: ${lastPathname} -> ${currentPathname}`);
                    lastPathname = currentPathname;
                    lastTopicId = currentTopicId;
                    resetProcessingState();
                    setTimeout(processLikes, 500);
                }
            }, 300);
        });

        observer.observe(mainOutlet, { childList: true, subtree: false });
        log("页面导航观察器已启动。");

        window.addEventListener('beforeunload', () => {
            if (observer) {
                observer.disconnect();
                log("导航观察器已清理。");
            }
            clearTimeout(debounceTimer);
            resetProcessingState();
        });

        return observer;
    }

    // --- 脚本入口 ---
    (async function init() {
        try {
            await new Promise(resolve => (document.body ? resolve() : window.addEventListener('DOMContentLoaded', resolve, { once: true })));
            log("初始化脚本 v10.3...");
            createUIPanel();
            injectStyles();
            isCollapsed = await GM_getValue(collapsedStateKey, false);
            if(uiPanel) uiPanel.classList.toggle('collapsed', isCollapsed);
            navigationObserver = setupNavigationObserver();
            setTimeout(processLikes, 1000);
        } catch (e) {
            err("初始化失败:", e);
        }
    })();
})();