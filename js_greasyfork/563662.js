// ==UserScript==
// @name         抖音自动清屏与网页全屏
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动点击清屏和网页全屏
// @author       yingming006
// @match        https://www.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/563662/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E6%B8%85%E5%B1%8F%E4%B8%8E%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/563662/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E6%B8%85%E5%B1%8F%E4%B8%8E%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CLEAR_SCREEN_DELAY = 2000;
    const processingClearScreens = new WeakSet();

    function simulateClick(element) {
        if (!element) return;
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            element.dispatchEvent(new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        });
    }

    function isElementInViewport(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const verticalCenter = rect.top + rect.height / 2;

        return (
            verticalCenter > 0 &&
            verticalCenter < windowHeight &&
            rect.width > 0 &&
            rect.height > 0
        );
    }

    setInterval(() => {
        try {
            const floatingElements = document.querySelectorAll('.x6CkPbQ5');
            floatingElements.forEach(el => {
                if (el.style.display !== 'none') {
                    el.style.display = 'none';
                    console.log('已隐藏左上角悬浮框');
                }
            });

            const allWebFullBtns = document.querySelectorAll('.xgplayer-page-full-screen');
            allWebFullBtns.forEach(container => {
                if (isElementInViewport(container)) {
                    const btnText = container.textContent || "";
                    if (btnText.includes('网页全屏') && !btnText.includes('退出')) {
                        const clickTarget = container.querySelector('.xgplayer-icon');
                        if (clickTarget) {
                            simulateClick(clickTarget);
                        }
                    }
                }
            });

            const allClearBtns = document.querySelectorAll('.xgplayer-immersive-switch-setting');

            allClearBtns.forEach(container => {
                if (isElementInViewport(container)) {
                    const switchBtn = container.querySelector('.xg-switch');

                    if (switchBtn && !switchBtn.classList.contains('xg-switch-checked')) {

                        if (!processingClearScreens.has(container)) {
                            processingClearScreens.add(container);

                            console.log(`已检测到新视频，将在 ${CLEAR_SCREEN_DELAY/1000} 秒后清屏...`);

                            setTimeout(() => {
                                processingClearScreens.delete(container);

                                if (isElementInViewport(container)) {
                                    if (!switchBtn.classList.contains('xg-switch-checked')) {
                                        console.log('倒计时结束，执行清屏点击');
                                        switchBtn.click();
                                    }
                                } else {
                                    console.log('视频已划走，取消清屏操作');
                                }
                            }, CLEAR_SCREEN_DELAY);
                        }
                    }
                }
            });

        } catch (e) {
        }

    }, 1000);

})();