// ==UserScript==
// @name         21tb new UI AutoPlay Script
// @namespace    http://tampermonkey.net/
// @version      2025-10-28
// @description  21tb Auto-Play Script,Only effective on the new version of the course interface. Automatically jumps after course viewing completion. Automatically selects unviewed chapters. Use in conjunction with other scripts if necessary.
// @author       code support by Gemini
// @match        https://*.21tb.com/courseSetting/courseLearning/play?courseType=*&courseId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=21tb.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554342/21tb%20new%20UI%20AutoPlay%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/554342/21tb%20new%20UI%20AutoPlay%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================================================================================================
    // ⭐️ 全局状态变量 (供所有函数共享)
    // ===================================================================================================
    let allFinished = false;
    let intervalId = null;
    let initialCheckDone = false;

    // ===================================================================================================
    // ⭐️ 配置项
    // ===================================================================================================
    const VIDEO_ITEM_SELECTOR = '.section-item';
    const ACTIVE_CLASS = 'section-item-active';
    const FINISHED_CLASS = 'finish';

    // --- 【函数 1】模拟低级别点击事件 (为跳转做准备) ---
    function simulateClick(element) {
        if (!element) return;
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        element.dispatchEvent(clickEvent);
    }


    // ⚠️ 占位符：心跳监控函数
    function checkVideoProgress(videoElement) {
        console.log("... [Heartbeat Placeholder] 心跳监控启动 ...");
        // 确保在启动新监控前，清除旧的定时器
        if (intervalId) { clearInterval(intervalId); }

        const initialActiveItem = document.querySelector(`.${ACTIVE_CLASS}`);

        // 启动时的播放尝试 (解决浏览器限制)
        // --- 【新增函数】安全调用播放方法 ---
        const safePlay = (element, isMutedAttempt = false) => {
            const playPromise = element.play();

            // 检查返回值是否为 Promise (即是否为 undefined)
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // 播放成功
                }).catch(error => {
                    // 播放被阻止 (通常是静音问题)
                    if (!isMutedAttempt) {
                        console.warn('⚠️ [Heartbeat] 自动播放被阻止，尝试静音回退。');
                        element.muted = true;
                        // 递归调用，尝试静音播放
                        safePlay(element, true);
                    } else {
                        console.error('❌ [Heartbeat] 静音回退失败，需要用户交互。', error);
                    }
                });
            } else {
                // 非 Promise 返回值 (假设播放成功或在后台处理，或者被静默阻止)
                console.log('💡 [Heartbeat] play() 未返回 Promise (旧环境/自定义播放器)。');
            }
        };

        let checkCount = 0;

        intervalId = setInterval(() => {
            checkCount++;
            const duration = videoElement.duration;
            const currentTime = videoElement.currentTime;

            // 🎯 验证点 1：每次执行都打印输出，检查定时器是否持续
            console.log(`[Polling Check] 运行中... 检查次数: ${checkCount}`);

            // ---------------------------------------------
            // 🎯 关键修正：检测是否被手动切换
            // ---------------------------------------------
            const currentActiveItem = document.querySelector(`.${ACTIVE_CLASS}`);

            // 条件：
            // 1. 当前 DOM 中没有活跃项，或
            // 2. 活跃项仍然存在，但它已经不是我们启动心跳时锁定的那个元素
            if (currentActiveItem !== initialActiveItem) {
                // 确认是用户手动切换导致的非正常退出
                console.log("↩️ [Heartbeat] 检测到目录活跃项变更或丢失，判定为用户手动切换。停止心跳，返回主循环。");
                clearInterval(intervalId);
                supervisorLoop(); // 将控制权交回主循环
                return;
            }

            // ---------------------------------------------
            // 🎯 边界检查：视频元素丢失
            // ---------------------------------------------
            if (!videoElement || videoElement.nodeType === 3) {
                console.error("❌ [Heartbeat] 视频元素已丢失或被移除，停止心跳。");
                clearInterval(intervalId);
                // 重新启动主循环，让它重新评估页面状态
                supervisorLoop();
                return;
            }


            // 🎯 验证点 2：检查关键变量的值，用于调试判断条件
            console.log(`[Polling Data] Duration: ${duration.toFixed(1)}s, CurrentTime: ${currentTime.toFixed(1)}s, Paused: ${videoElement.paused}`);

            // ---------------------------------------------
            // 🎯 自动播放 (心跳) 逻辑
            // ---------------------------------------------
            // 如果视频暂停了，并且还没到最后 1 秒，就尝试启动播放
            if (videoElement.paused && currentTime < duration - 1.0 && duration > 0) {
                safePlay(videoElement);
                // .catch(() => {
                //     videoElement.muted = true;
                //     videoElement.play();
                // });
                console.log('💓 [Heartbeat] 视频暂停被检测到，尝试重新启动播放。');
            }

            // ---------------------------------------------
            // 🎯 结束判定逻辑
            // ---------------------------------------------
            // 条件：时长有效 AND 当前时间接近末尾 (0.5秒内) AND 视频已暂停
            if (duration > 0 && currentTime >= duration - 0.5 && videoElement.paused) {

                clearInterval(intervalId); // 停止轮询

                console.log("🎥 [AutoSkip] 视频播放结束事件触发（通过轮询判定）。");

                // 触发跳转逻辑，并将控制权交回给主循环
                handleNextEpisode();
            }

        }, 5000); // 每 500 毫秒检查一次

        safePlay(videoElement);
        console.log("🔄 [AutoSkip] 已启动 500ms 轮询检查视频播放进度。");

    }

    // ⚠️ 占位符：下一集跳转函数
    function handleNextEpisode() {
        console.log("... [Next Episode Placeholder] 触发跳转 ...");
        // 1. 即时查找所有视频列表项
        const allItemsNodeList = document.querySelectorAll(VIDEO_ITEM_SELECTOR);
        if (allItemsNodeList.length === 0) {
            console.error("⚠️ [Next] 目录元素丢失，无法执行跳转。");
            // 尝试重启 supervisorLoop，看目录是否能再次加载
            setTimeout(supervisorLoop, 1000);
            return;
        }
        const allItems = Array.from(allItemsNodeList);

        // 2. 查找第一个未完成的视频项 (无论当前是哪个视频)
        let nextItem = null;
        let nextIndex = -1;
        // 查找第一个不包含 FINISHED_CLASS 的项
        nextIndex = allItems.findIndex(item => !item.classList.contains(FINISHED_CLASS));
        if (nextIndex !== -1) {
            nextItem = allItems[nextIndex];
        }

        // 3. 执行点击跳转
        if (nextItem) {
            // 检查目标是否已经是活跃项
            if (nextItem.classList.contains(ACTIVE_CLASS)) {
                console.log(`✅ [Next] 目标视频（索引 ${nextIndex + 1}）已是活跃项，无需点击。`);
                // 直接将控制权交回给主循环，让监控器启动
                setTimeout(supervisorLoop, 1000);
                return;
            }

            // 模拟点击操作
            simulateClick(nextItem);

            console.log(`🚀 [Next] 视频结束，跳转到目录中第一个未完成视频（索引 ${nextIndex + 1}）。`);

            // 4. 将控制权交回给主循环 (通过延迟调用 supervisorLoop)
            setTimeout(supervisorLoop, 1000); // 极短延迟后立即启动主循环，评估新状态

        } else {
            console.log("🏁 [Next] 播放列表已完全结束，所有后续视频均已完成。");
            allFinished = true; // 标记所有已完成，循环将终止
        }
        // 🚨 跳转后，递归函数应该再次启动！
    }


    // --- 核心函数：递归检查、状态判断和流程控制 ---
    function supervisorLoop() {

        // 如果全局标记所有已完成，则停止整个脚本
        if (allFinished) {
            console.log("🏁 [Supervisor] 所有视频已完成，停止监控循环。");
            return;
        }

        const activeItem = document.querySelector(`.${ACTIVE_CLASS}`);

        // 1. 检查目录是否加载
        if (!activeItem) {
            console.log("⏳ [Supervisor] 目录尚未加载，1秒后重试...");
            setTimeout(supervisorLoop, 1000);
            return;
        }

        // 2. 检查当前活跃项的状态
        if (activeItem) {
            // const directoryArray = Array.from(document.querySelectorAll(VIDEO_ITEM_SELECTOR));
            // console.log("✅ [Loader] 目录加载成功！共找到 ${directoryArray.length} 个视频。");
            const videoElement = document.querySelector('video');

            if (activeItem.classList.contains(FINISHED_CLASS)) {
                // 状态 A：当前视频已完成 (包含 active 和 finish)
                console.log("⏭️ [Supervisor] 当前活跃项已标记为完成，触发跳转。");
                // 立即跳转，不需要心跳监控
                handleNextEpisode();
                return; // 跳转后，在跳转函数内会启动下一次循环或监控

            } else if (videoElement) {
                // 状态 B：当前视频未完成，且 video 元素已找到
                console.log("▶️ [Supervisor] 当前视频未完成，5秒后启动心跳监控。");
                // 启动监控，监控器会负责在视频结束时调用 handleNextEpisode
                    checkVideoProgress(videoElement);
                return; // 监控器启动后，不需要继续递归循环

            } else {
                 // 状态 C：目录已加载，但视频播放器未加载 (常见于单页应用切换)
                console.log("⏳ [Supervisor] 目录就绪但播放器未加载，1秒后重试...");
                setTimeout(supervisorLoop, 1000);
                return;
            }
        }

        // 默认：如果流程未返回，继续递归等待
        console.log("⏳ [Supervisor] 脚本启动失败,正在尝试重启");
        setTimeout(supervisorLoop, 1000);
    }

    // ===================================================================================================
    // 脚本入口
    // ===================================================================================================
    supervisorLoop();

})();