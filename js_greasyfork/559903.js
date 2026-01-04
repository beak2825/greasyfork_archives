// ==UserScript==
// @name          SuperMario 国家开放大学自动学习
// @namespace     https://smartadmin.cn
// @version       1.1
// @description   超级马里奥（SuperMario）国开大学自动脚本
// @author        小马哥（mawd86）
// @match         *://*.ouchn.cn/*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         unsafeWindow
// @grant         none
// @license       MIT
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/559903/SuperMario%20%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/559903/SuperMario%20%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ----------------------------------------------------
    // 【版本号与配置区域】
    // ----------------------------------------------------
    // 版本号与脚本头部同步
    const SCRIPT_VERSION = '1.1'; // <<< 版本号更新

    const PRIMARY_SELECTOR = '.next-btn';
    const SECONDARY_SELECTORS = ['#next-page-btn', '.next-button', '.button.medium.button-green'];
    const NEXT_BUTTON_TEXTS = ['下一个', '下一步', '完成', '继续'];
    const CLICK_DELAY_MS = 5000; // 默认回退延迟 (5 秒)
    const TARGET_PLAYBACK_RATE = 2.0; // 目标播放速度
    const VIDEO_CHECK_INTERVAL_MS = 1000; // 视频检测频率 (1 秒)

    // 播放器控制按钮选择器。
    const VIDEO_CONTROL_SELECTORS = {
        // mvp-fonts-play 代表“未播放”，是我们想要点击的状态
        PLAY_BUTTON: ['.mvp-fonts-play', '.vjs-play-control', '.play-button', '.prism-play-btn', '.art-control-play'],
        MUTE_BUTTON: ['.vjs-mute-control', '.mute-button', '.prism-volume-btn', '.art-control-volume']
    };

    // 全局控制变量
    let observer = null;
    let clickTimer = null;
    let videoCheckTimer = null;
    let processingVideoElement = null;
    let initialScrollPerformed = false; // 控制首次滚动是否已执行

    // >>>>>>>>>>>>>>>>>>>> 代码执行开始标记 <<<<<<<<<<<<<<<<<<<<
    console.log(`[SuperMario] 脚本执行开始 V${SCRIPT_VERSION} (滚动日志增强版)。`);

    // ----------------------------------------------------
    // 通用函数 (查找、循环控制、Observer)
    // ----------------------------------------------------

    /** 查找下一页按钮，三重查找机制。*/
    function findNextButton(doc) {
        let nextButton = null;
        const allSelectors = [PRIMARY_SELECTOR, ...SECONDARY_SELECTORS];
        for (const selector of allSelectors) {
            nextButton = doc.querySelector(selector);
            if (nextButton) return nextButton;
        }
        for (const text of NEXT_BUTTON_TEXTS) {
            const xpath = `//*[self::button or self::a or self::div][contains(., '${text}') and not(ancestor::script) and not(ancestor::style) and not(ancestor::textarea)]`;
            const result = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (result.singleNodeValue) return result.singleNodeValue;
        }
        return null;
    }

    /** 页面滚动到底部。*/
    function scrollToBottom(doc) {
        // 确保 doc.body 和 doc.defaultView 存在
        if (doc.documentElement && doc.body && doc.defaultView) {
            const scrollTarget = doc.body.scrollHeight;
            const currentPosition = doc.defaultView.scrollY;

            // 增加日志输出，方便调试
            console.log(`[SuperMario] 滚动日志：当前位置 Y=${currentPosition}，目标滚动高度：${scrollTarget}。`);

            // 使用 smooth 行为，模拟用户滚动，并滚动到文档最大高度
            doc.defaultView.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
            });
            console.log('[SuperMario] 动作：已触发页面自动滚动到底部的动作。');
        } else {
             console.warn('[SuperMario] 警告：无法执行页面滚动操作，文档或窗口对象不可用。');
        }
    }


    /** 启动/重启整个观察和点击流程 */
    function restartObservation(isImmediate = false, delayMs = CLICK_DELAY_MS) {
        if (clickTimer) clearTimeout(clickTimer);
        if (videoCheckTimer) clearInterval(videoCheckTimer);

        const finalDelay = isImmediate ? 100 : delayMs;

        if (isImmediate) {
             console.log('[SuperMario] 流程控制：视频播放完毕，等待 100ms 立即检查点击。');
        } else {
             console.log(`[SuperMario] 流程控制：启动 ${finalDelay / 1000} 秒倒计时...`);
        }

        clickTimer = setTimeout(() => startClickProcess(isImmediate), finalDelay);
    }

    /** 设置 MutationObserver 监听页面的 DOM 变化 */
    function setupObserver() {
        // 由于 @run-at document-start，DOM可能尚未完全加载，但我们先注册观察器
        restartObservation();
        if (observer) return;

        observer = new MutationObserver(function(mutations) {
            // 每次DOM变化后，重启流程计时器
            restartObservation();
        });

        const config = { childList: true, subtree: true, attributes: true };
        observer.observe(document.body, config);
        console.log('[SuperMario] 状态：启动 DOM 观察器，脚本将持续运行。');
    }

    // ----------------------------------------------------
    // 【视频检测与播放模块 V1.1 核心】
    // ----------------------------------------------------

    /**
     * 查找并模拟点击播放器控制按钮，并输出日志。
     */
    function simulateControlClick(doc, selectors, type) {
        let clicked = false;

        // 确保输出日志，表明意图
        console.log(`[SuperMario] 动作：尝试模拟点击 ${type} 按钮 (使用鼠标事件序列模拟)...`);

        for (const selector of selectors) {
            const button = doc.querySelector(selector);

            // 确保元素存在、可见且尚未点击
            if (button && button.offsetWidth > 0 && button.offsetHeight > 0 && !clicked) {

                // *** 模拟鼠标点击事件序列 ***
                // 发送 mousedown 和 mouseup 模拟真实用户交互
                const clickEvents = ['mousedown', 'mouseup'];
                clickEvents.forEach(eventType => {
                    const event = new MouseEvent(eventType, {
                        bubbles: true,
                        cancelable: true,
                        view: doc.defaultView
                    });
                    button.dispatchEvent(event);
                });

                // 确保事件处理器被触发 (作为兼容性兜底)
                button.click();

                // 成功日志
                console.log(`[SuperMario] 日志：成功执行 模拟点击 ${type} 按钮的动作 (${selector})。`);
                clicked = true;
                break;
            }
        }
        if (!clicked) {
             // 失败日志
             console.warn(`[SuperMario] 警告：未找到 ${type} 按钮或按钮不可见，模拟点击失败。`);
        }
        return clicked;
    }

    /**
     * 每秒执行一次，检查视频是否播放完毕。
     */
    function checkVideoStatus() {
        const video = processingVideoElement;

        if (!video || video.readyState < 3 || isNaN(video.duration) || video.duration <= 0) {
            return;
        }

        // 视频播放完成的判断逻辑：currentTime 接近 duration (预留 0.5 秒误差)
        const isFinished = video.currentTime >= video.duration - 0.5;

        if (isFinished) {
            console.log('[SuperMario] 日志：视频播放完毕。');

            // 清理轮询状态
            if (videoCheckTimer) clearInterval(videoCheckTimer);
            videoCheckTimer = null;
            processingVideoElement = null;

            restartObservation(true);
        } else {
             const current = Math.floor(video.currentTime);
             const duration = Math.floor(video.duration);
             console.log(`[SuperMario] 进度：${current}s / ${duration}s。`);
        }
    }


    /**
     * 核心视频处理逻辑：模拟点击、强制属性、启动轮询。
     */
    function processVideo(doc) {
        const videoElement = doc.querySelector('video');

        if (videoElement) {
            console.log('[SuperMario] 日志：检测到视频网页。');

            if (videoElement.ended) {
                 console.log('[SuperMario] 状态：视频已处于播放完毕状态，无需处理。');
                 return false;
            }

            if (processingVideoElement === videoElement) {
                 console.log('[SuperMario] 状态：视频正在轮询检测中，无需重复处理。');
                 return true;
            }

            // --- 阶段 1: 模拟点击 (优化逻辑顺序：先静音，后播放) ---

            // 1. 模拟点击静音按钮 (避免出声，优先执行)
            simulateControlClick(doc, VIDEO_CONTROL_SELECTORS.MUTE_BUTTON, '静音');

            // 2. 模拟点击播放按钮 (使用精准状态判断)

            // 检查是否存在 mvp-fonts-play (未播放状态)
            const playIcon = doc.querySelector('.mvp-fonts-play');
            const pauseIcon = doc.querySelector('.mvp-fonts-pause');

            // ** 精准判断逻辑 **
            if (playIcon) {
                // 如果找到 mvp-fonts-play (未播放图标)，说明播放器处于暂停状态，需要点击。
                console.log('[SuperMario] 状态：检测到 mvp-fonts-play 图标，执行播放点击。');
                simulateControlClick(doc, VIDEO_CONTROL_SELECTORS.PLAY_BUTTON, '播放');
            } else if (pauseIcon) {
                 // 如果找到 mvp-fonts-pause (正在播放图标)，说明正在播放，跳过点击。
                 console.log('[SuperMario] 状态：检测到 mvp-fonts-pause 图标，跳过播放点击。');
            } else if (videoElement.paused) {
                 // 如果找不到特定图标，则回退到原生 video 标签的 paused 属性来判断。
                 console.warn('[SuperMario] 警告：未找到 mvp 播放图标，回退到 videoElement.paused 判断。');
                 simulateControlClick(doc, VIDEO_CONTROL_SELECTORS.PLAY_BUTTON, '播放');
            } else {
                 console.log('[SuperMario] 状态：视频正在播放中，跳过播放点击。');
            }


            // --- 阶段 2: 强制属性设置 (确保功能生效) ---

            // 1. 强制静音 (作为兜底)
            videoElement.muted = true;
            console.log('[SuperMario] 日志：已强制执行静音功能。');

            // 2. 强制倍速
            if (typeof videoElement.playbackRate !== 'undefined') {
                 videoElement.playbackRate = TARGET_PLAYBACK_RATE;
                 console.log(`[SuperMario] 日志：已强制执行 ${TARGET_PLAYBACK_RATE} 倍速播放。`);
            } else {
                 console.warn('[SuperMario] 警告：视频播放器不支持倍速播放。');
            }

            // --- 阶段 3: 播放和启动轮询 ---

            // 尝试调用 play() (作为属性回退和最终确认)
            console.log('[SuperMario] 日志：尝试调用 video.play() (最终播放确认)...');
            videoElement.play().then(() => {
                console.log('[SuperMario] 状态：视频开始自动播放。');
            }).catch(e => {
                console.warn('[SuperMario] 警告：video.play() 失败 (模拟点击或属性设置可能已生效)。');
            });

            // 启动 1 秒轮询
            if (videoCheckTimer) clearInterval(videoCheckTimer);
            processingVideoElement = videoElement;
            videoCheckTimer = setInterval(checkVideoStatus, VIDEO_CHECK_INTERVAL_MS);

            return true;
        }
        return false;
    }


    // ----------------------------------------------------
    // 【核心流程控制】
    // ----------------------------------------------------

    /** 核心流程控制：遍历 IFrame，处理视频或点击按钮。 */
    function startClickProcess(isImmediateCheck = false) {
        if (clickTimer) clearTimeout(clickTimer);

        let actionHandled = false;
        const iframes = document.querySelectorAll('iframe');

        // --- 阶段 1: 视频检测和播放 ---
        [document, ...Array.from(iframes)].forEach(el => {
            if (actionHandled) return;
            try {
                // 如果是 iframe，尝试获取其内容文档
                const doc = (el === document) ? document : (el.contentDocument || el.contentWindow.document);
                if (doc && processVideo(doc)) {
                    actionHandled = true;
                }
            } catch (e) { /* 忽略跨域错误 */ }
        });

        // --- 阶段 1.5: 视频页面滚动到底部 (加载完并延迟 5 秒后，且只执行一次) ---
        if (actionHandled && !initialScrollPerformed) {
            scrollToBottom(document);
            initialScrollPerformed = true;
        }

        // --- 阶段 2: 按钮点击 ---
        // 如果视频处理已完成，并且不是即时检查点击（即不是视频结束触发），则等待下一次轮询
        if (actionHandled && !isImmediateCheck) {
            return;
        }

        let buttonClicked = false;

        [document, ...Array.from(iframes)].forEach(el => {
            if (buttonClicked) return;
            try {
                const doc = (el === document) ? document : (el.contentDocument || el.contentWindow.document);
                const nextButton = findNextButton(doc);

                if (nextButton && !nextButton.disabled && nextButton.getAttribute('disabled') === null) {
                    // 模拟点击下一页按钮
                    nextButton.click();
                    buttonClicked = true;
                }
            } catch (e) { /* 忽略 */ }
        });

        // --- 结果处理 ---
        if (buttonClicked) {
            console.log('[SuperMario] 状态：成功点击了下一页按钮。');
            restartObservation();
        } else if (isImmediateCheck) {
            console.warn('[SuperMario] 警告：视频播放完毕后，立即点击下一页失败，恢复 5 秒轮询。');
            restartObservation();
        } else {
            console.warn(`[SuperMario] 状态：${CLICK_DELAY_MS / 1000}秒延迟后，未找到或无法点击下一页按钮。`);
        }
    }


    // ----------------------------------------------------
    // 启动逻辑
    // 由于 @run-at document-start，我们先设置观察器，让它在 DOM 变化时检查
    setupObserver();

    // >>>>>>>>>>>>>>>>>>>> 代码执行结束标记 <<<<<<<<<<<<<<<<<<<<

})();