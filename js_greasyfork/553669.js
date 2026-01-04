// ==UserScript==
// @name         Auto-click with Delay
// @namespace    http://tampermonkey.net/
// @version      2025-10-25
// @description  Auto click elements with custom delays after page load
// @author       Pb-ctrl
// @match        https://platform.deepseek.com/usage
// @match        https://69yun.top/user
// @match        https://www.youtube.com/*
// @icon         https://s2.loli.net/2024/04/28/WEkjH9iy51z63Of.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553669/Auto-click%20with%20Delay.user.js
// @updateURL https://update.greasyfork.org/scripts/553669/Auto-click%20with%20Delay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置需要自动点击的元素（选择器 + 延迟时间ms）
    const targets = [
        {//deepseek-api
            selector: 'body > div.ds-theme.ds-modal-wrapper > div > div:nth-child(2) > div > div.ds-modal-content__footer > div > div.ds-button.ds-button--secondary.ds-button--filled.ds-button--rect.ds-button--m',
            delay: 1000  // 1秒后点击
        },
        {//69云
            selector: '#index-pop-modal > div > div > div > div.card-header.align-items-center.px-4.py-3 > div.text-right.flex-grow-1 > button',
            delay: 500   // 0.5秒后点击
        },
        {//youtube
            selector: '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > div.ytp-right-controls-right > button.ytp-fullscreen-button.ytp-button',
            delay: 5000  // 2秒后点击
        }
    ];

    // 等待页面完全加载
    function waitForPageLoad() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    // 检查元素是否可见
    function isElementVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }

    // 轮询检测元素并在延迟后点击
    async function startAutoClick() {
        // 等待页面完全加载
        await waitForPageLoad();
        console.log('页面已完全加载，开始监控元素...');

        const checkAndClick = setInterval(() => {
            // 过滤还未处理的目标
            const remainingTargets = targets.filter(target => !target.processed);

            remainingTargets.forEach(target => {
                try {
                    const element = document.querySelector(target.selector);
                    if (element && isElementVisible(element)) {
                        // 标记为已处理
                        target.processed = true;

                        // 延迟指定时间后点击
                        setTimeout(() => {
                            element.click();
                            console.log(`已点击元素 [延迟${target.delay}ms]: ${target.selector}`);
                        }, target.delay);
                    }
                } catch (error) {
                    console.error(`处理元素 ${target.selector} 时出错:`, error);
                }
            });

            // 所有元素都处理完后停止轮询
            if (targets.every(target => target.processed)) {
                clearInterval(checkAndClick);
                console.log('所有目标元素已处理完毕');
            }
        }, 500); // 每500毫秒检查一次
    }

    // 启动自动点击流程
    startAutoClick();
})();