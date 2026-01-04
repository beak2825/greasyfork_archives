// ==UserScript==
// @name              YouTube FullWindow
// @name:zh-CN        YouTube网页全屏
// @name:ja           YouTubeフルウィンドウ
// @namespace         http://tampermonkey.net/
// @version           1.3
// @description       Changes YouTube theater mode appearance to fullwindow, press T to enter, T or ESC to exit
// @description:zh-CN 将YouTube影院模式的外观改为网页全屏，按T进入，按T或ESC退出
// @description:ja    YouTubeシアターモードの外観をフルウィンドウに変更、Tで入り、TまたはESCで退出
// @author            jo
// @match             https://www.youtube.com/*
// @icon              https://www.youtube.com/favicon.ico
// @grant             none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/550420/YouTube%20FullWindow.user.js
// @updateURL https://update.greasyfork.org/scripts/550420/YouTube%20FullWindow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isWebFullscreen = false;
    let mastheadObserver = null;
    let isHandlingFullscreenFromTheater = false;
    let doubleClickHandler = null;

    function addFullscreenStyles() {
        if (document.getElementById('yt-web-fullscreen-style')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'yt-web-fullscreen-style';
        style.textContent = `
            /* 影院模式时的全屏样式 */
            ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                z-index: 3000 !important;
                width: 100vw !important;
                height: 100vh !important;
                max-height: 100vh !important;
                background: #000 !important;
            }

            /* 全屏模式样式 */
            ytd-watch-flexy[fullscreen] #full-bleed-container.ytd-watch-flexy {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                z-index: 3000 !important;
                width: 100vw !important;
                height: 100vh !important;
                max-height: 100vh !important;
                background: #000 !important;
            }

            /* 隐藏页面右侧滚动条 */
            .web-fullscreen-active {
                overflow: hidden !important;
                height: 100% !important;
            }

            .web-fullscreen-active body {
                overflow: hidden !important;
                height: 100% !important;
            }

            /* 确保页面内容正常显示 */
            ytd-watch-flexy:not([full-bleed-player]):not([fullscreen]) {
                overflow: visible !important;
            }

            /* 强制显示画中画和影院模式按钮（全屏模式下） */
            .ytp-fullscreen .ytp-pip-button,
            .ytp-fullscreen .ytp-size-button {
                display: inline-block !important;
                opacity: 1 !important;
                visibility: visible !important;
            }

            /* 确保按钮在hover状态下也可见 */
            .ytp-fullscreen .ytp-pip-button:hover,
            .ytp-fullscreen .ytp-size-button:hover {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
        console.log('YouTube网页全屏样式已注入');
    }

    function toggleFullscreenState(enable) {
        if (enable === isWebFullscreen) return;

        if (enable) {
            isWebFullscreen = true;
            document.documentElement.classList.add('web-fullscreen-active');
            console.log('进入网页全屏模式');
        } else {
            isWebFullscreen = false;
            document.documentElement.classList.remove('web-fullscreen-active');
            console.log('退出网页全屏模式');
        }
    }

    // 使用masthead属性检测当前模式
    function getCurrentMode() {
        const masthead = document.getElementById('masthead');
        if (!masthead) return 'default';

        if (masthead.hasAttribute('fullscreen')) return 'fullscreen';
        if (masthead.hasAttribute('theater')) return 'theater';
        return 'default';
    }

    function toggleTheaterMode() {
        const theaterButton = document.querySelector('.ytp-size-button.ytp-button');
        if (theaterButton) {
            theaterButton.click();
            console.log('切换影院模式');
            return true;
        }
        return false;
    }

    function toggleFullscreen() {
        const fullscreenButton = document.querySelector('.ytp-fullscreen-button.ytp-button');
        if (fullscreenButton) {
            fullscreenButton.click();
            console.log('切换全屏模式');
            return true;
        }
        return false;
    }

    function exitTheaterMode() {
        const currentMode = getCurrentMode();
        if (currentMode === 'theater') {
            return toggleTheaterMode();
        }
        return false;
    }

    function handleKeyDown(event) {
        // 检查是否在输入框或文本区域中
        const activeElement = document.activeElement;
        const isTextInput = activeElement.tagName === 'INPUT' ||
              activeElement.tagName === 'TEXTAREA' ||
              activeElement.isContentEditable;

        if (isTextInput) {
            return;
        }

        const currentMode = getCurrentMode();

        // T键处理：切换影院模式（网页全屏）
        if (event.keyCode === 84) { // T key
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            console.log('按T键，当前模式:', currentMode);

            if (currentMode === 'default') {
                // 默认模式 -> 进入影院模式
                toggleTheaterMode();
            } else if (currentMode === 'theater') {
                // 影院模式 -> 退出到默认模式
                toggleTheaterMode();
            } else if (currentMode === 'fullscreen') {
                // 全屏模式 -> 退出全屏，进入影院模式
                toggleFullscreen();
                setTimeout(() => {
                    if (getCurrentMode() === 'default') {
                        toggleTheaterMode();
                    }
                }, 100);
            }
        }

        // F键处理：切换全屏
        if (event.keyCode === 70) { // F key
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            console.log('按F键，当前模式:', currentMode);

            if (currentMode === 'default') {
                // 默认模式 -> 进入全屏模式
                toggleFullscreen();
            } else if (currentMode === 'theater') {
                // 影院模式 -> 先退出影院模式，再进入全屏
                isHandlingFullscreenFromTheater = true;
                exitTheaterMode();
                setTimeout(() => {
                    toggleFullscreen();
                    isHandlingFullscreenFromTheater = false;
                }, 100);
            } else if (currentMode === 'fullscreen') {
                // 全屏模式 -> 退出全屏
                toggleFullscreen();
            }
        }

        // ESC键处理：退出到默认视图
        if (event.keyCode === 27) { // ESC key
            const currentMode = getCurrentMode();

            if (currentMode === 'fullscreen' || currentMode === 'theater') {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                console.log('按ESC键，退出到默认视图');

                if (currentMode === 'fullscreen') {
                    toggleFullscreen();
                } else if (currentMode === 'theater') {
                    toggleTheaterMode();
                }
            }
        }
    }

    function observeMastheadChanges() {
        if (mastheadObserver) {
            mastheadObserver.disconnect();
        }

        const masthead = document.getElementById('masthead');
        if (!masthead) {
            setTimeout(observeMastheadChanges, 1000);
            return;
        }

        let lastMode = getCurrentMode();

        mastheadObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'theater' || mutation.attributeName === 'fullscreen')) {

                    const currentMode = getCurrentMode();
                    console.log('模式变化:', currentMode, '之前模式:', lastMode);

                    // 更新最后模式
                    lastMode = currentMode;

                    // 影院模式或全屏模式都启用网页全屏样式
                    toggleFullscreenState(currentMode !== 'default');

                    // 全屏模式下强制显示按钮
                    if (currentMode === 'fullscreen') {
                        setTimeout(forceShowButtons, 100);
                    }
                }
            });
        });

        mastheadObserver.observe(masthead, {
            attributes: true,
            attributeFilter: ['theater', 'fullscreen']
        });

        // 初始状态检查
        const currentMode = getCurrentMode();
        console.log('初始模式:', currentMode);
        lastMode = currentMode;
        toggleFullscreenState(currentMode !== 'default');
    }

    // 强制显示画中画和影院模式按钮
    function forceShowButtons() {
        const pipButtons = document.querySelectorAll('.ytp-pip-button');
        const sizeButtons = document.querySelectorAll('.ytp-size-button');

        pipButtons.forEach(button => {
            button.style.display = 'inline-block';
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        });

        sizeButtons.forEach(button => {
            button.style.display = 'inline-block';
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        });
    }

    // 监听全屏按钮点击，实现从影院模式进入全屏时的拆解操作
    function setupFullscreenButtonListener() {
        document.addEventListener('click', function(event) {
            const target = event.target;
            const fullscreenButton = target.closest('.ytp-fullscreen-button.ytp-button');

            if (fullscreenButton && getCurrentMode() === 'theater' && !isHandlingFullscreenFromTheater) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                console.log('从影院模式点击全屏按钮，拆解操作');
                isHandlingFullscreenFromTheater = true;

                // 先退出影院模式，再进入全屏
                exitTheaterMode();
                setTimeout(() => {
                    toggleFullscreen();
                    isHandlingFullscreenFromTheater = false;
                }, 100);
            } else if (fullscreenButton) {
                // 普通情况下的全屏按钮点击
                console.log('检测到全屏按钮点击');
                // 延迟确保按钮在全屏模式下显示
                setTimeout(forceShowButtons, 200);
            }
        }, true);
    }

    // 拦截影院模式下的双击全屏
    function setupDoubleClickListener() {
        // 移除之前的监听器
        if (doubleClickHandler) {
            document.removeEventListener('dblclick', doubleClickHandler);
        }

        doubleClickHandler = function(event) {
            const currentMode = getCurrentMode();

            // 如果在影院模式下双击，拦截并执行拆解操作
            if (currentMode === 'theater' && !isHandlingFullscreenFromTheater) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                console.log('拦截影院模式下双击全屏，执行拆解操作');
                isHandlingFullscreenFromTheater = true;

                // 先退出影院模式，再进入全屏
                exitTheaterMode();
                setTimeout(() => {
                    toggleFullscreen();
                    isHandlingFullscreenFromTheater = false;
                }, 100);
            }
        };

        // 使用捕获阶段确保我们先于YouTube处理双击事件
        document.addEventListener('dblclick', doubleClickHandler, true);
    }

    function handlePageChange() {
        console.log('检测到页面变化，重新初始化...');
        toggleFullscreenState(false);
        isHandlingFullscreenFromTheater = false;
        addFullscreenStyles();
        setTimeout(observeMastheadChanges, 500);
        setTimeout(setupFullscreenButtonListener, 1000);
        setTimeout(setupDoubleClickListener, 1000);
    }

    // 初始化函数
    function init() {
        console.log('初始化YouTube网页全屏脚本');

        addFullscreenStyles();
        document.addEventListener('keydown', handleKeyDown, true);
        observeMastheadChanges();
        setupFullscreenButtonListener();
        setupDoubleClickListener();

        // 监听DOM变化
        const domObserver = new MutationObserver(function(mutations) {
            let shouldReinit = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.id === 'masthead') {
                            shouldReinit = true;
                        }
                    });
                }
            });
            if (shouldReinit) setTimeout(handlePageChange, 100);
        });
        domObserver.observe(document.body, { childList: true, subtree: true });
    }

    // 监听URL变化
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            handlePageChange();
        }
    });
    urlObserver.observe(document, { subtree: true, childList: true });

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();