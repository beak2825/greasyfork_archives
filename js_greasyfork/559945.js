// ==UserScript==
// @name         B站视频广告快捷跳过(增强版)
// @namespace    https://space.bilibili.com/397839047?spm_id_from=..0.0
// @version      0.3
// @description  基于弹幕的指路而制作的广告跳过器，支持双击确认跳过和撤回跳转功能
// @author       Shayo|Gemini
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559945/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BF%87%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559945/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BF%87%28%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 新增/修改的全局变量 ---
    let currentEntries = []; // 当前识别到的时间列表
    let preJumpTime = 0;     // 跳转前的时间点
    let undoTimer = null;    // 撤回窗口的倒计时定时器
    let keyPressTimer = null; // 用于检测双击快捷键的定时器
    let undoWindowEl = null;  // 撤回窗口的DOM引用
    let wasPlaying = false;
    let seekerButton = null;
    let seekerButtonWrap = null;

    const modalStyles = `
        #bilibili-danmaku-seeker-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
        }
        #bilibili-danmaku-seeker-modal-content {
            background-color: #fff;
            margin: 15% auto;
            padding: 0;
            border: none;
            border-radius: 8px;
            width: 80%;
            max-width: 500px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
            font-family: 'Helvetica Neue', Helvetica, Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
            overflow: hidden;
        }
        #bilibili-danmaku-seeker-modal-header {
            padding: 16px 20px;
            background-color: #f6f6f6;
            color: #212121;
            font-size: 16px;
            font-weight: 500;
            border-bottom: 1px solid #e5e9ef;
            border-radius: 8px 8px 0 0;
        }
        #bilibili-danmaku-seeker-modal-body {
            padding: 0;
            max-height: 400px;
            overflow-y: auto;
        }
        .bilibili-danmaku-seeker-option {
            padding: 12px 20px;
            cursor: pointer;
            border-bottom: 1px solid #e5e9ef;
            transition: background-color 0.2s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .bilibili-danmaku-seeker-option:hover {
            background-color: #f4f5f7;
        }
        .bilibili-danmaku-seeker-option:last-child {
            border-bottom: none;
        }
        .bilibili-danmaku-seeker-time {
            font-weight: bold;
            color: #fb7299;
        }
        .bilibili-danmaku-seeker-text {
            flex-grow: 1;
            margin-left: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #6d757a;
        }
        #bilibili-danmaku-seeker-modal-footer {
            padding: 12px 20px;
            background-color: #f6f6f6;
            text-align: right;
            border-top: 1px solid #e5e9ef;
            border-radius: 0 0 8px 8px;
        }
        .bilibili-danmaku-seeker-button {
            padding: 6px 12px;
            margin-left: 10px;
            border: 1px solid #ccd0d7;
            border-radius: 4px;
            background-color: #fff;
            color: #6d757a;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .bilibili-danmaku-seeker-button:hover {
            background-color: #f4f5f7;
            color: #212121;
        }

        /* 撤回悬浮窗样式 */
        #bilibili-seeker-undo-window {
            position: fixed;
            bottom: 80px;
            right: 40px;
            z-index: 10001;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: opacity 0.3s;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #bilibili-seeker-undo-window:hover {
            background-color: rgba(0, 0, 0, 0.9);
        }
        #bilibili-seeker-undo-progress {
            font-weight: bold;
            color: #00a1d6;
        }
    `;

    function waitForElm(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            if (timeout > 0) {
                setTimeout(() => {
                    observer.disconnect();
                    reject(new Error(`Timeout waiting for element: ${selector}`));
                }, timeout);
            }
        });
    }

    function parseTimeString(text) {
        let seconds = -1;
        text = text.replace(/：/g, ':');

        const timeHMSRegex = /(?:\D|^)(\d{1,2}):([0-5]?\d):([0-5]?\d)(?=\D|$)/;
        const hmsMatch = text.match(timeHMSRegex);
        if (hmsMatch) {
            const hours = parseInt(hmsMatch[1], 10);
            const minutes = parseInt(hmsMatch[2], 10);
            const secs = parseInt(hmsMatch[3], 10);
            if (hours >= 0 && hours <= 99 && minutes >= 0 && minutes <= 59 && secs >= 0 && secs <= 59) {
                seconds = hours * 3600 + minutes * 60 + secs;
                return { seconds, format: `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${secs < 10 ? '0' + secs : secs}` };
            }
        }

        const timeHMChineseRegex = /(?:\D|^)(\d{1,2})小时([0-5]?\d)分(?=\D|$)/;
        const hmChineseMatch = text.match(timeHMChineseRegex);
        if (hmChineseMatch) {
            const hours = parseInt(hmChineseMatch[1], 10);
            const minutes = parseInt(hmChineseMatch[2], 10);
            if (hours >= 0 && hours <= 99 && minutes >= 0 && minutes <= 59) {
                seconds = hours * 3600 + minutes * 60;
                return { seconds, format: `${hours}小时${minutes}分` };
            }
        }

        const timeHMSChineseRegex = /(?:\D|^)(\d{1,2})小时([0-5]?\d)分([0-5]?\d)秒(?=\D|$)/;
        const hmsChineseMatch = text.match(timeHMSChineseRegex);
        if (hmsChineseMatch) {
            const hours = parseInt(hmsChineseMatch[1], 10);
            const minutes = parseInt(hmsChineseMatch[2], 10);
            const secs = parseInt(hmsChineseMatch[3], 10);
            if (hours >= 0 && hours <= 99 && minutes >= 0 && minutes <= 59 && secs >= 0 && secs <= 59) {
                seconds = hours * 3600 + minutes * 60 + secs;
                return { seconds, format: `${hours}小时${minutes}分${secs}秒` };
            }
        }

        const timeColonRegex = /(?:\D|^)(\d{1,2}):([0-5]?\d)(?=\D|$)/;
        const colonMatch = text.match(timeColonRegex);
        if (colonMatch) {
            const minutes = parseInt(colonMatch[1], 10);
            const secs = parseInt(colonMatch[2], 10);
            if (minutes >= 0 && minutes <= 99 && secs >= 0 && secs <= 59) {
                 seconds = minutes * 60 + secs;
                 return { seconds, format: `${minutes}:${secs < 10 ? '0' + secs : secs}` };
            }
        }

        const timeChineseRegex = /(?:\D|^)(\d{1,3})分([0-5]?\d)秒(?=\D|$)/;
        const chineseMatch = text.match(timeChineseRegex);
        if (chineseMatch) {
            const minutes = parseInt(chineseMatch[1], 10);
            const secs = parseInt(chineseMatch[2], 10);
            if (minutes >= 0 && minutes <= 99 && secs >= 0 && secs <= 59) {
                seconds = minutes * 60 + secs;
                return { seconds, format: `${minutes}分${secs}秒` };
            }
        }

        return { seconds, format: null };
    }

    async function createAndInsertButton() {
        let shareItemWrap = null;
        let attempts = 0;
        const maxAttempts = 50;
        const retryInterval = 300;
        while (!shareItemWrap && attempts < maxAttempts) {
            shareItemWrap = document.querySelector('.toolbar-left-item-wrap:has(.video-share), .toolbar-left-item-wrap:has(.video-share-wrap)');
            if (!shareItemWrap) {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, retryInterval));
            }
        }
        if (!shareItemWrap) {
             console.warn("[B站弹幕跳转] 超时：未能找到分享按钮容器。");
             return;
        }
        if (document.getElementById('bilibili-danmaku-seeker-button-inline')) {
            return;
        }
        seekerButton = document.createElement('button');
        seekerButton.id = 'bilibili-danmaku-seeker-button-inline';
        seekerButton.textContent = '视频跳转';
        seekerButton.title = '根据弹幕跳转 (快捷键 O)';
        Object.assign(seekerButton.style, {
            background: 'none',
            border: 'none',
            borderRadius: '4px',
            padding: '0 4px',
            margin: '0 0 0 4px',
            cursor: 'pointer',
            fontSize: '14px',
            lineHeight: '26px',
            height: '26px',
            color: '#9499a0',
            backgroundColor: 'transparent',
            transition: 'color 0.3s, background-color 0.3s',
            verticalAlign: 'middle',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            flexShrink: '0'
        });
        seekerButton.addEventListener('mouseenter', () => {
            seekerButton.style.color = '#61666d';
            seekerButton.style.backgroundColor = 'rgba(0,0,0,0.05)';
        });
        seekerButton.addEventListener('mouseleave', () => {
            seekerButton.style.color = '#9499a0';
            seekerButton.style.backgroundColor = 'transparent';
        });
        seekerButton.addEventListener('click', () => showTimeSelectionModal());
        seekerButtonWrap = document.createElement('div');
        seekerButtonWrap.className = 'toolbar-left-item-wrap';
        Object.assign(seekerButtonWrap.style, {
             display: 'inline-flex',
             alignItems: 'center',
             height: '32px',
        });
        seekerButtonWrap.appendChild(seekerButton);
        const toolbarLeftMain = shareItemWrap.parentNode;
        if (toolbarLeftMain && toolbarLeftMain.classList.contains('video-toolbar-left-main')) {
            toolbarLeftMain.insertBefore(seekerButtonWrap, shareItemWrap.nextSibling);
        } else if (shareItemWrap.parentNode) {
             shareItemWrap.parentNode.insertBefore(seekerButtonWrap, shareItemWrap.nextSibling);
        }
    }

    // --- 核心逻辑修改：获取弹幕并存储到全局变量 ---
    async function showTimeSelectionModal() {
        console.log("--- 开始显示时间选择模态框 ---");
        const player = getPlayer();
        if (player) {
            try {
                if (typeof player.paused === 'boolean') {
                    wasPlaying = !player.paused;
                } else if (typeof player.getState === 'function') {
                    wasPlaying = player.getState() === 'PLAYING';
                } else {
                    wasPlaying = true;
                }

                if (wasPlaying) {
                    if (typeof player.pause === 'function') player.pause();
                    else if (player.video && typeof player.video.pause === 'function') player.video.pause();
                }
            } catch (e) {
                console.warn("暂停视频时出错:", e);
            }
        }

        const danmakuContainer = document.querySelector('.bpx-player-row-dm-wrap');
        if (!danmakuContainer) {
            alert('未找到弹幕容器，请确保弹幕已开启且正在播放。');
            resumeIfWasPlaying();
            return;
        }

        const danmakuElements = danmakuContainer.querySelectorAll('.bili-danmaku-x-dm');
        if (danmakuElements.length === 0) {
            alert('弹幕容器内未找到弹幕项。');
            resumeIfWasPlaying();
            return;
        }

        const timeEntries = [];
        danmakuElements.forEach((element) => {
            const danmakuText = element.textContent.trim();
            if (danmakuText) {
                const { seconds, format } = parseTimeString(danmakuText);
                if (seconds >= 0 && format) {
                    const displayText = danmakuText.length > 30 ? danmakuText.substring(0, 30) + '...' : danmakuText;
                    timeEntries.push({
                        time: seconds,
                        format: format,
                        fullText: danmakuText,
                        displayText: displayText
                    });
                }
            }
        });

        if (timeEntries.length === 0) {
            alert('当前屏幕上没有找到包含时间的弹幕。');
            resumeIfWasPlaying();
            return;
        }

        // 更新全局列表，供自动跳转使用
        currentEntries = timeEntries;
        createAndShowModal(timeEntries);
    }

    function createAndShowModal(timeEntries) {
        if (!document.getElementById('bilibili-danmaku-seeker-styles')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'bilibili-danmaku-seeker-styles';
            styleSheet.innerText = modalStyles;
            document.head.appendChild(styleSheet);
        }

        // 移除旧的（如果存在）
        const oldModal = document.getElementById('bilibili-danmaku-seeker-modal');
        if (oldModal) closeModal(oldModal);

        const modal = document.createElement('div');
        modal.id = 'bilibili-danmaku-seeker-modal';
        const modalContent = document.createElement('div');
        modalContent.id = 'bilibili-danmaku-seeker-modal-content';
        const modalHeader = document.createElement('div');
        modalHeader.id = 'bilibili-danmaku-seeker-modal-header';
        modalHeader.textContent = '请选择要跳转的时间 (再次按下快捷键V可直接跳转第一项)';
        const modalBody = document.createElement('div');
        modalBody.id = 'bilibili-danmaku-seeker-modal-body';

        // 排序显示，方便用户看，虽然自动跳转逻辑会重新排
        timeEntries.sort((a, b) => a.time - b.time);

        timeEntries.forEach(entry => {
            const option = document.createElement('div');
            option.className = 'bilibili-danmaku-seeker-option';
            option.dataset.time = entry.time;
            const timeSpan = document.createElement('span');
            timeSpan.className = 'bilibili-danmaku-seeker-time';
            timeSpan.textContent = entry.format;
            const textSpan = document.createElement('span');
            textSpan.className = 'bilibili-danmaku-seeker-text';
            textSpan.textContent = entry.displayText;
            textSpan.title = entry.fullText;
            option.appendChild(timeSpan);
            option.appendChild(textSpan);
            option.addEventListener('click', () => {
                closeModal(modal);
                handleJumpWithUndo(parseFloat(option.dataset.time));
            });
            modalBody.appendChild(option);
        });

        const modalFooter = document.createElement('div');
        modalFooter.id = 'bilibili-danmaku-seeker-modal-footer';
        const cancelButton = document.createElement('button');
        cancelButton.className = 'bilibili-danmaku-seeker-button';
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', () => {
            closeModal(modal);
            resumeIfWasPlaying();
        });
        modalFooter.appendChild(cancelButton);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
                resumeIfWasPlaying();
            }
        });
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    function closeModal(modalElement) {
        if (modalElement && modalElement.parentNode) {
            modalElement.parentNode.removeChild(modalElement);
        }
        currentEntries = []; // 清空当前记录
    }

    function getPlayer() {
        let player = null;
        if (window.player && (typeof window.player.seek === 'function' || typeof window.player.currentTime === 'number')) {
             return window.player;
        }
        const playerPaths = ['player', '__INITIAL_STATE__.videoData.player', 'bilibiliPlayer', '__INITIAL_STATE__.player'];
        for (const path of playerPaths) {
            try {
                player = path.split('.').reduce((obj, prop) => obj && obj[prop], window);
                if (player && (typeof player.seek === 'function' || typeof player.currentTime === 'number' || (player.video && typeof player.video.seek === 'function'))) {
                    return player;
                }
            } catch (e) {}
        }
        return null;
    }

    // --- 带撤回功能的跳转逻辑 ---
    function handleJumpWithUndo(targetTime) {
        const player = getPlayer();
        if (!player) return;

        // 1. 记录当前时间
        if (typeof player.getCurrentTime === 'function') {
            preJumpTime = player.getCurrentTime();
        } else if (player.video) {
            preJumpTime = player.video.currentTime;
        } else {
            preJumpTime = player.currentTime;
        }
        console.log(`准备跳转。保存当前时间: ${preJumpTime}s -> 目标: ${targetTime}s`);

        // 2. 执行跳转
        seekToTimeAndResume(targetTime);

        // 3. 显示撤回浮窗
        showUndoWindow();
    }

    function showUndoWindow() {
        // 如果已存在，先移除
        removeUndoWindow();

        undoWindowEl = document.createElement('div');
        undoWindowEl.id = 'bilibili-seeker-undo-window';
        undoWindowEl.innerHTML = `
            <span>撤回跳转</span>
            <span id="bilibili-seeker-undo-progress">(10s)</span>
        `;

        let timeLeft = 10;
        const progressEl = undoWindowEl.querySelector('#bilibili-seeker-undo-progress');

        // 倒计时逻辑
        undoTimer = setInterval(() => {
            timeLeft--;
            if (progressEl) progressEl.textContent = `(${timeLeft}s)`;
            if (timeLeft <= 0) {
                removeUndoWindow(); // 时间到，自动移除，视为确认
            }
        }, 1000);

        // 左键点击：撤回
        undoWindowEl.addEventListener('click', (e) => {
            if (e.button === 0) { // 左键
                performUndo();
            }
        });

        // 右键点击：直接移除（确认跳转）
        undoWindowEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            removeUndoWindow();
        });

        document.body.appendChild(undoWindowEl);
    }

    function performUndo() {
        console.log(`执行撤回，跳回: ${preJumpTime}s`);
        seekToTimeAndResume(preJumpTime);
        removeUndoWindow();
    }

    function removeUndoWindow() {
        if (undoTimer) {
            clearInterval(undoTimer);
            undoTimer = null;
        }
        if (undoWindowEl && undoWindowEl.parentNode) {
            undoWindowEl.parentNode.removeChild(undoWindowEl);
        }
        undoWindowEl = null;
    }

    function seekToTimeAndResume(targetTime) {
        const player = getPlayer();
        if (!player) return;
        try {
            if (typeof player.seek === 'function') {
                player.seek(targetTime);
            } else if (player.video && typeof player.video.seek === 'function') {
                player.video.seek(targetTime);
            } else if (typeof player.currentTime !== 'undefined') {
                player.currentTime = targetTime;
            }

            setTimeout(() => {
                if (wasPlaying) {
                    if (typeof player.play === 'function') player.play();
                    else if (player.video && typeof player.video.play === 'function') player.video.play();
                }
            }, 300);
        } catch (error) {
            console.error("跳转错误:", error);
        }
    }

    function resumeIfWasPlaying(force = false) {
        if (wasPlaying || force) {
            const player = getPlayer();
            if (player) {
                try {
                     if (typeof player.play === 'function') player.play();
                     else if (player.video && typeof player.video.play === 'function') player.video.play();
                } catch (e) {}
            }
        }
    }

    // --- 键盘事件逻辑重写 ---
    function handleKeyDown(event) {
        if ((event.key === 'v' || event.key === 'v' || event.keyCode === 79) &&
            event.target.tagName !== 'INPUT' &&
            event.target.tagName !== 'TEXTAREA' &&
            !event.target.isContentEditable) {

            event.preventDefault(); // 防止可能的冲突

            // 场景1：撤回浮窗存在（用户刚刚跳转完）
            if (undoWindowEl) {
                // 如果已经有一个等待确认的定时器，说明这是0.5秒内的第二次按下 -> 触发撤回
                if (keyPressTimer) {
                    clearTimeout(keyPressTimer);
                    keyPressTimer = null;
                    performUndo(); // 双击撤回
                } else {
                    // 第一次按下，启动0.5秒等待
                    keyPressTimer = setTimeout(() => {
                        // 0.5秒后没有第二次按下 -> 移除浮窗（确认跳转）
                        removeUndoWindow();
                        keyPressTimer = null;
                    }, 500);
                }
                return;
            }

            // 场景2：模态框已经打开（用户想快速自动跳转）
            const modal = document.getElementById('bilibili-danmaku-seeker-modal');
            if (modal && modal.style.display !== 'none') {
                if (currentEntries.length > 0) {
                    // 按照弹幕列表相对更早的一条 -> 排序取第一个
                    currentEntries.sort((a, b) => a.time - b.time);
                    const bestTime = currentEntries[0].time;
                    console.log(`快速跳转触发，自动选择: ${currentEntries[0].format}`);
                    closeModal(modal);
                    handleJumpWithUndo(bestTime);
                }
                return;
            }

            // 场景3：普通状态 -> 打开选择列表
            showTimeSelectionModal();
        }
    }

    document.addEventListener('keydown', handleKeyDown);

    const init = async () => {
        if (document.getElementById('bilibili-danmaku-seeker-button-inline')) return;
        try {
             await createAndInsertButton();
        } catch (e) {
             console.error("初始化按钮时出错:", e);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 2000);
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                if (!document.getElementById('bilibili-danmaku-seeker-button-inline')) {
                    init();
                }
            }, 3000);
        } else {
            if (!document.getElementById('bilibili-danmaku-seeker-button-inline')) {
                 if (!window._seekerButtonCheckTimer) {
                     window._seekerButtonCheckTimer = setTimeout(() => {
                         init();
                         window._seekerButtonCheckTimer = null;
                     }, 2000);
                 }
            }
        }
    }).observe(document, { subtree: true, childList: true });
})();