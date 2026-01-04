// ==UserScript==
// @name              Bilibili FullWindow Optimize
// @name:zh-CN        B站网页全屏优化
// @name:ja           Bilibiliフルウィンドウ最適化
// @namespace         http://tampermonkey.net/
// @version           1.1
// @description       Hide widescreen button, always show fullwindow button, T key to enter fullwindow, T or ESC to exit
// @description:zh-CN 隐藏宽屏模式按钮，始终显示网页全屏按钮，T键进入网页全屏，T或ESC退出
// @description:ja    ワイドスクリーンボタンを非表示にし、常にフルウィンドウボタンを表示。Tキーでフルウィンドウに入り、TまたはESCで終了
// @author            jo
// @match             https://www.bilibili.com/*
// @icon              https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant             none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/550422/Bilibili%20FullWindow%20Optimize.user.js
// @updateURL https://update.greasyfork.org/scripts/550422/Bilibili%20FullWindow%20Optimize.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 状态标志，防止重复处理
    let isHandlingClick = false;
    let isHandlingKey = false;

    function initScript() {
        // 添加CSS样式来控制按钮显示
        const style = document.createElement('style');
        style.textContent = `
            .bpx-player-ctrl-wide {
                display: none !important;
            }
            .bpx-player-ctrl-web {
                display: flex !important;
            }
        `;
        document.head.appendChild(style);

        // 核心函数：获取当前播放器状态
        function getPlayerScreenState() {
            const container = document.querySelector('.bpx-player-container');
            return container ? container.getAttribute('data-screen') : 'normal';
        }

        // 核心函数：设置按钮可见性
        function setButtonVisibility() {
            const wideBtn = document.querySelector('.bpx-player-ctrl-wide');
            const webBtn = document.querySelector('.bpx-player-ctrl-web');

            if (wideBtn) {
                wideBtn.style.display = 'none';
            }
            if (webBtn) {
                webBtn.style.display = 'flex';
            }
        }

        // 核心逻辑：拦截并处理全屏按钮点击
        function setupFullscreenButtonHandler() {
            const fullscreenBtn = document.querySelector('.bpx-player-ctrl-full');
            // 如果按钮不存在或已绑定过事件，则返回
            if (!fullscreenBtn || fullscreenBtn.hasAttribute('data-handler-attached')) {
                return;
            }

            fullscreenBtn.setAttribute('data-handler-attached', 'true');

            fullscreenBtn.addEventListener('click', function(e) {
                const currentState = getPlayerScreenState();

                // 关键判断：如果当前是网页全屏模式，我们需要特殊处理
                if (currentState === 'web' && !isHandlingClick) {
                    e.stopPropagation();
                    e.preventDefault();
                    isHandlingClick = true;

                    console.log('检测到从网页全屏进入全屏，开始顺序操作...');

                    // 第一步：先点击网页全屏按钮，退出网页全屏模式，回到normal状态
                    const webBtn = document.querySelector('.bpx-player-ctrl-web');
                    if (webBtn) {
                        webBtn.click();
                    }

                    // 第二步：等待状态稳定后，再点击全屏按钮进入全屏
                    setTimeout(() => {
                        const newFullscreenBtn = document.querySelector('.bpx-player-ctrl-full');
                        if (newFullscreenBtn) {
                            newFullscreenBtn.click();
                        }
                        isHandlingClick = false;
                    }, 150); // 这个延迟很重要，确保B站有足够时间处理状态转换

                    return false;
                }
                // 如果不是从网页全屏进入全屏，则让事件正常进行
            }, true); // 使用捕获阶段以确保先执行
        }

        // 监听键盘事件 - 增强版
        document.addEventListener('keydown', function(event) {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                return;
            }

            const currentState = getPlayerScreenState();

            // T键切换网页全屏
            if (event.keyCode === 84) { // T key
                event.preventDefault();
                const webBtn = document.querySelector('.bpx-player-ctrl-web');
                if (webBtn) {
                    webBtn.click();
                }
            }

            // F键切换全屏 - 增强处理
            if (event.keyCode === 70) { // F key
                // 如果当前是网页全屏模式，需要特殊处理
                if (currentState === 'web' && !isHandlingKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    isHandlingKey = true;

                    console.log('拦截到从网页全屏按F键，开始顺序操作...');

                    // 第一步：先退出网页全屏
                    const webBtn = document.querySelector('.bpx-player-ctrl-web');
                    if (webBtn) {
                        webBtn.click();
                    }

                    // 第二步：短暂延迟后，再触发全屏
                    setTimeout(() => {
                        const fullscreenBtn = document.querySelector('.bpx-player-ctrl-full');
                        if (fullscreenBtn) {
                            fullscreenBtn.click();
                        }
                        isHandlingKey = false;
                    }, 150);
                }
                // 如果当前不是网页全屏（是normal或full状态），则不拦截，让B站原生逻辑处理
            }
        });

        // 使用MutationObserver监控播放器容器和控件的变化
        const observer = new MutationObserver(function(mutations) {
            let shouldUpdateButtons = false;
            let shouldSetupHandler = false;

            mutations.forEach(function(mutation) {
                // 监控data-screen属性的变化
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-screen') {
                    console.log('播放器状态变化:', mutation.oldValue, '->', mutation.target.getAttribute('data-screen'));
                    shouldUpdateButtons = true;
                }

                // 监控样式变化，重新应用按钮显示规则
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    shouldUpdateButtons = true;
                }

                // 监控子节点变化，检查是否有新的控制按钮出现
                if (mutation.type === 'childList') {
                    shouldSetupHandler = true;
                    shouldUpdateButtons = true;
                }
            });

            if (shouldUpdateButtons) {
                setButtonVisibility();
            }
            if (shouldSetupHandler) {
                setTimeout(setupFullscreenButtonHandler, 100);
            }
        });

        // 开始观察页面变化
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-screen', 'style'],
            childList: true,
            subtree: true
        });

        // 初始设置
        setButtonVisibility();
        setupFullscreenButtonHandler();

        console.log('B站网页全屏快捷键脚本已加载，正在监控播放器状态...');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
})();