// ==UserScript==
// @name         B站/哔哩哔哩/bilibili视频增强脚本（智能字幕+倍速控制+顶部栏控制）
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  智能字幕选择（支持多种中文格式），提供倍速控制功能（Z/X/C键和1/2/3键），按J键控制顶部栏显示，记忆用户选择
// @author       none
// @icon         https://play-lh.googleusercontent.com/C1tISqYgtW_ejAmnGzvepbaYt7NJLagPelCZ_lzNv06RJPQgBx1_q3VX67z9wc48EgY=s1024
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/list/watchlater*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license GPL-1.0
// @downloadURL https://update.greasyfork.org/scripts/550447/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%EF%BC%88%E6%99%BA%E8%83%BD%E5%AD%97%E5%B9%95%2B%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%2B%E9%A1%B6%E9%83%A8%E6%A0%8F%E6%8E%A7%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550447/B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%EF%BC%88%E6%99%BA%E8%83%BD%E5%AD%97%E5%B9%95%2B%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%2B%E9%A1%B6%E9%83%A8%E6%A0%8F%E6%8E%A7%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const MAX_ATTEMPTS = 10;
    const INITIAL_DELAY = 800;
    const RETRY_DELAY = 2000;
    let attemptCount = 0;
    let isActive = false;
    let isEnabled = GM_getValue('bilibili_subtitle_enabled', true);
    let observer = null;
    let timeoutId = null;
    let playbackRates = [2, 1.5, 1.25, 1, 0.75, 0.5];
    let currentRate = GM_getValue('bilibili_playback_rate', 1);
    let isCustomRate = GM_getValue('bilibili_custom_rate', false);
    let isHeaderHidden = GM_getValue('bilibili_header_hidden', false);
    let lastSubtitle = GM_getValue('bilibili_last_subtitle', '中文'); // 记忆最后选择的字幕
    let subtitleOptions = []; // 存储当前可用的字幕选项

    // 中文字幕的可能名称（按优先级排序）
    const CHINESE_SUBTITLE_PATTERNS = [
        /^中文(（简体）)?$/,
        /^中文(（中国）)?$/,
        /^简体中文$/,
        /^Chinese Simplified$/,
        /^Chinese$/,
        /^中文/
    ];

    // 添加样式
    GM_addStyle(`
       .bpx-player-dm-notice {
      position: absolute;
      top: 10%;
      /* 将提示位置稍微下移，避免遮挡视频内容 */
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.8);
      /* 增加背景不透明度 */
      color: white;
      padding: 12px 20px;
      /* 增加内边距，让提示更大 */
      border-radius: 8px;
      /* 增加圆角 */
      font-size: 18px;
      /* 增大字体大小 */
      font-weight: bold;
      /* 加粗字体 */
      z-index: 9999;
      pointer-events: none;
      animation: fadeInOut 2.5s ease-in-out forwards;
      /* 稍微延长动画时间 */
      min-width: 120px;
      /* 设置最小宽度 */
      text-align: center;
      /* 文字居中 */
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      /* 添加阴影效果 */
    }
        @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
        }
          /* 新增：顶部栏隐藏时的页面调整 */
        body.header-hidden {
            padding-top: 0 !important;
        }
        body.header-hidden #biliMainHeader {
            display: none !important;
        }
    `);

    // 初始化
    function init() {
        console.log(`B站增强脚本已加载，字幕状态: ${isEnabled ? '开启' : '关闭'}, 当前倍速: ${currentRate}x, 顶部栏状态: ${isHeaderHidden ? '隐藏' : '显示'}, 记忆的字幕: ${lastSubtitle}`);

        applyHeaderState();

        const cleanup = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            document.removeEventListener('keydown', handleKeyPress);
        };

        window.addEventListener('beforeunload', cleanup);
        document.addEventListener('keydown', handleKeyPress);
        console.log('快捷键监听器已添加 (Shift+A:字幕, Shift+S:切换字幕, Z/X/C:倍速, 1/2/3:快速倍速, J:顶部栏)');

        setupSPAObserver();

        if (isEnabled) {
            timeoutId = setTimeout(tryClickSubtitle, INITIAL_DELAY);
        }

        timeoutId = setTimeout(applySavedPlaybackRate, INITIAL_DELAY);
    }

    // 设置SPA路由监听
    function setupSPAObserver() {
        let lastUrl = location.href;
        observer = new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                resetState();
                if (isEnabled) {
                    timeoutId = setTimeout(tryClickSubtitle, INITIAL_DELAY);
                }
                timeoutId = setTimeout(applySavedPlaybackRate, INITIAL_DELAY);
            }
        });
        observer.observe(document, { subtree: true, childList: true });
    }

    // 重置状态
    function resetState() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        attemptCount = 0;
        isActive = false;
        subtitleOptions = [];
    }

    // 快捷键处理
    function handleKeyPress(event) {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement &&
              (activeElement.tagName === 'INPUT' ||
               activeElement.tagName === 'TEXTAREA' ||
               activeElement.isContentEditable);
        if (isInputFocused) return;

        // J键切换顶部栏
        if (event.key.toLowerCase() === 'j') {
            event.preventDefault();
            toggleHeader();
            return;
        }

        // Shift+A 切换字幕开关
        if (event.shiftKey && event.key === 'A') {
            event.preventDefault();
            toggleSubtitles();
        }

        // Shift+S 循环切换字幕
        if (event.shiftKey && event.key === 'S') {
            event.preventDefault();
            cycleSubtitles();
        }

        // 倍速控制
        if (!event.ctrlKey && !event.altKey && !event.metaKey && event.location === 0) {
            switch (event.key.toLowerCase()) {
                case 'z':
                    event.preventDefault();
                    setPlaybackRate(1);
                    break;
                case 'x':
                    event.preventDefault();
                    decreasePlaybackRate();
                    break;
                case 'c':
                    event.preventDefault();
                    increasePlaybackRate();
                    break;
                case '1':
                    event.preventDefault();
                    setPlaybackRate(1);
                    break;
                case '2':
                    event.preventDefault();
                    setPlaybackRate(2);
                    break;
                case '3':
                    event.preventDefault();
                    setCustomPlaybackRate(3);
                    break;
            }
        }
    }

    // 切换字幕开关
    function toggleSubtitles() {
        isEnabled = !isEnabled;
        GM_setValue('bilibili_subtitle_enabled', isEnabled);
        console.log(`字幕功能已${isEnabled ? '开启' : '关闭'}`);

        resetState();

        if (isEnabled) {
            timeoutId = setTimeout(tryClickSubtitle, INITIAL_DELAY);
        } else {
            closeSubtitles();
        }
        showRateMessage(`字幕${isEnabled ? '开启' : '关闭'}`);
    }

    // 循环切换字幕
    function cycleSubtitles() {
        if (subtitleOptions.length === 0) {
            loadSubtitleOptions();
        }

        if (subtitleOptions.length === 0) {
            showRateMessage('无可切换的字幕');
            return;
        }

        // 找到当前激活的字幕
        const currentActiveIndex = subtitleOptions.findIndex(option =>
                                                             option.element.classList.contains('bpx-state-active')
                                                            );

        // 计算下一个字幕的索引
        const nextIndex = (currentActiveIndex + 1) % subtitleOptions.length;
        const nextSubtitle = subtitleOptions[nextIndex];

        // 点击下一个字幕
        nextSubtitle.element.click();
        lastSubtitle = nextSubtitle.text;
        GM_setValue('bilibili_last_subtitle', lastSubtitle);

        console.log(`已切换到字幕: ${nextSubtitle.text}`);
        showRateMessage(`字幕: ${nextSubtitle.text}`);
    }

    // 加载字幕选项
    function loadSubtitleOptions() {
        subtitleOptions = [];
        const subtitleItems = document.querySelectorAll('.bpx-player-ctrl-subtitle-major-content .bpx-player-ctrl-subtitle-language-item');//找主字幕


        subtitleItems.forEach(item => {
            const textElement = item.querySelector('.bpx-player-ctrl-subtitle-language-item-text');

            if (textElement) {
                subtitleOptions.push({
                    element: item,
                    text: textElement.textContent.trim()
                });
            }
        });
        return subtitleOptions.length > 0;
    }

    // 尝试点击字幕（改进版）
    function tryClickSubtitle() {
        timeoutId = null;

        if (!isEnabled || isActive || attemptCount >= MAX_ATTEMPTS) {
            return;
        }

        attemptCount++;
        console.log(`尝试设置字幕 (第 ${attemptCount} 次)`);

        // 加载当前可用的字幕选项
        const hasSubtitles = loadSubtitleOptions();
        if (!hasSubtitles) {
            if (attemptCount < MAX_ATTEMPTS) {
                timeoutId = setTimeout(tryClickSubtitle, RETRY_DELAY);
            } else {
                console.log('已达到最大尝试次数，未找到字幕选项');
            }
            return;
        }

        // 1. 首先尝试选择记忆的字幕
        if (lastSubtitle) {
            const lastSubtitleOption = subtitleOptions.find(option => option.text === lastSubtitle
                                                           );

            if (lastSubtitleOption )
            {
                if(!lastSubtitleOption.element.classList.contains('bpx-state-active'))
                {
                    console.log(`找到记忆的字幕 "${lastSubtitle}"，执行点击`);
                    lastSubtitleOption.element.click();
                }else{
                    console.log(`找到记忆的字幕 "${lastSubtitle}", 字幕已激活`);
                }
                isActive = true;
                if(!lastSubtitleOption.text.includes('中文'))
                { showRateMessage(`字幕: ${lastSubtitleOption.text}`);}
                return;
            }
        }

        // 2. 如果没有记忆的字幕或找不到，尝试匹配中文
        for (const option of subtitleOptions) {
            for (const pattern of CHINESE_SUBTITLE_PATTERNS) {
                if (pattern.test(option.text) && !option.element.classList.contains('bpx-state-active')) {
                    console.log(`找到匹配的中文字幕 "${option.text}"，执行点击`);
                    option.element.click();
                    lastSubtitle = option.text;
                    GM_setValue('bilibili_last_subtitle', lastSubtitle);
                    isActive = true;
                    return;
                }
            }
        }

        // 3. 如果没有中文，选择第一个可用的字幕
        if (subtitleOptions.length > 0 && !subtitleOptions[0].element.classList.contains('bpx-state-active')) {
            console.log(`没有找到中文，选择第一个字幕 "${subtitleOptions[0].text}"`);
            subtitleOptions[0].element.click();
            lastSubtitle = subtitleOptions[0].text;
            GM_setValue('bilibili_last_subtitle', lastSubtitle);
            isActive = true;
            return;
        }


        // 如果没有找到合适的字幕，继续尝试
        if (attemptCount < MAX_ATTEMPTS) {
            timeoutId = setTimeout(tryClickSubtitle, RETRY_DELAY);
        }
    }

    // 关闭字幕
    function closeSubtitles() {
        const closeButton = document.querySelector('.bpx-player-ctrl-subtitle-close-switch[data-action="close"]');
        if (closeButton && !closeButton.classList.contains('bpx-state-active')) {
            console.log('找到关闭字幕按钮，执行点击');
            closeButton.click();
            isActive = false;
        } else {
            console.log('关闭字幕按钮已激活或未找到');
        }
    }

    // 显示提示消息
    function showRateMessage(message) {
        const oldNotice = document.querySelector('.bpx-player-dm-notice');
        if (oldNotice) oldNotice.remove();

        const notice = document.createElement('div');
        notice.className = 'bpx-player-dm-notice';
        notice.textContent = message;

        const playerContainer = document.querySelector('.bpx-player-container') || document.body;
        playerContainer.appendChild(notice);

        setTimeout(() => {
            if (notice.parentNode) {
                notice.parentNode.removeChild(notice);
            }
        }, 2000);
    }

    // 倍速控制相关函数（保持不变）
    function setCustomPlaybackRate(rate) {
        const videoElement = document.querySelector('.bpx-player-video-wrap video');
        if (videoElement) {
            videoElement.playbackRate = rate;
            currentRate = rate;
            isCustomRate = true;
            GM_setValue('bilibili_playback_rate', currentRate);
            GM_setValue('bilibili_custom_rate', true);
            showRateMessage(`倍速已设为 ${rate}x (自定义)`);
            console.log(`已设置自定义倍速为 ${rate}x`);
        } else {
            console.log('未找到视频元素');
            showRateMessage('无法设置自定义倍速');
        }
    }

    function applySavedPlaybackRate() {
        if (isCustomRate && currentRate > 2) {
            const videoElement = document.querySelector('.bpx-player-video-wrap video');
            if (videoElement) {
                videoElement.playbackRate = currentRate;
                console.log(`已恢复自定义倍速为 ${currentRate}x`);
                showRateMessage(`倍速已恢复为 ${currentRate}x (自定义)`);
            } else {
                console.log('未找到视频元素，稍后重试');
                if (attemptCount < MAX_ATTEMPTS) {
                    timeoutId = setTimeout(applySavedPlaybackRate, RETRY_DELAY);
                    attemptCount++;
                }
            }
            return;
        }

        const rateMenu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
        if (!rateMenu) {
            if (attemptCount < MAX_ATTEMPTS) {
                timeoutId = setTimeout(applySavedPlaybackRate, RETRY_DELAY);
                attemptCount++;
                return;
            }
            console.log('未找到倍速菜单');
            return;
        }

        const currentActive = rateMenu.querySelector('.bpx-state-active');
        if (currentActive) {
            const activeRate = parseFloat(currentActive.dataset.value);
            if (Math.abs(activeRate - currentRate) > 0.01) {
                console.log(`当前倍速(${activeRate}x)与保存倍速(${currentRate}x)不一致，正在调整`);
                setPlaybackRate(currentRate);
            } else {
                console.log(`当前倍速(${activeRate}x)与保存倍速一致，无需调整`);
            }
        } else {
            console.log('未找到激活的倍速选项，尝试设置');
            setPlaybackRate(currentRate);
        }
    }

    function setPlaybackRate(rate) {
        const supportedRate = playbackRates.find(r => Math.abs(r - rate) < 0.01) || 1;
        currentRate = supportedRate;
        isCustomRate = false;
        GM_setValue('bilibili_playback_rate', currentRate);
        GM_setValue('bilibili_custom_rate', false);

        const rateMenu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
        if (rateMenu) {
            const items = rateMenu.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item');
            let found = false;

            items.forEach(item => {
                const itemRate = parseFloat(item.dataset.value);
                if (Math.abs(itemRate - currentRate) < 0.01) {
                    found = true;
                    if (!item.classList.contains('bpx-state-active')) {
                        item.click();
                        console.log(`已设置倍速为 ${currentRate}x`);
                        showRateMessage(`倍速已设为 ${currentRate}x`);
                    }
                }
            });

            if (!found) {
                console.log(`未找到 ${currentRate}x 的倍速选项`);
            }
        } else {
            console.log('未找到倍速菜单');
            if (attemptCount < MAX_ATTEMPTS) {
                timeoutId = setTimeout(() => setPlaybackRate(rate), RETRY_DELAY);
                attemptCount++;
            }
        }
    }

    function increasePlaybackRate() {
        const currentIndex = playbackRates.findIndex(r => Math.abs(r - currentRate) < 0.01);
        if (currentIndex > 0) {
            const newRate = playbackRates[currentIndex - 1];
            setPlaybackRate(newRate);
        } else {
            showRateMessage('已经是最大倍速 (2x)');
            console.log('已经是最大倍速 (2x)');
        }
    }

    function decreasePlaybackRate() {
        const currentIndex = playbackRates.findIndex(r => Math.abs(r - currentRate) < 0.01);
        if (currentIndex < playbackRates.length - 1) {
            const newRate = playbackRates[currentIndex + 1];
            setPlaybackRate(newRate);
        } else {
            showRateMessage('已经是最小倍速 (0.5x)');
            console.log('已经是最小倍速 (0.5x)');
        }
    }

    // 顶部栏控制（保持不变）
    function applyHeaderState() {
        const header = document.getElementById('biliMainHeader');
        if (header) {
            if (isHeaderHidden) {
                document.body.classList.add('header-hidden');
            } else {
                document.body.classList.remove('header-hidden');
            }
            console.log(`已应用保存的顶部栏状态: ${isHeaderHidden ? '隐藏' : '显示'}`);
        } else {
            console.log('未找到顶部栏元素');
            if (attemptCount < MAX_ATTEMPTS) {
                timeoutId = setTimeout(applyHeaderState, RETRY_DELAY);
                attemptCount++;
            }
        }
    }

    function toggleHeader(showMessage = true) {
        isHeaderHidden = !isHeaderHidden;
        GM_setValue('bilibili_header_hidden', isHeaderHidden);

        const header = document.getElementById('biliMainHeader');
        if (header) {
            if (isHeaderHidden) {
                document.body.classList.add('header-hidden');
            } else {
                document.body.classList.remove('header-hidden');
            }

            if (showMessage) {
                showRateMessage(`顶部栏已${isHeaderHidden ? '隐藏' : '显示'}`);
            }
            console.log(`顶部栏状态已切换: ${isHeaderHidden ? '隐藏' : '显示'}`);
        } else {
            console.log('未找到顶部栏元素');
            if (attemptCount < MAX_ATTEMPTS) {
                timeoutId = setTimeout(() => toggleHeader(showMessage), RETRY_DELAY);
                attemptCount++;
            }
        }
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();