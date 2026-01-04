// ==UserScript==
// @name         四川省继续教育网站尝试修复自动播放
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  网课会自动下一节但是播放列表里面不会变化，导致不能自动切到下一堂课，尝试10分钟刷新一次来规避这个bug（现在会按最短的那节课刷新）
// @match        https://edu.chinahrt.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550729/%E5%9B%9B%E5%B7%9D%E7%9C%81%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%AB%99%E5%B0%9D%E8%AF%95%E4%BF%AE%E5%A4%8D%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/550729/%E5%9B%9B%E5%B7%9D%E7%9C%81%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%AB%99%E5%B0%9D%E8%AF%95%E4%BF%AE%E5%A4%8D%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {

        const delay = 5000; // 延迟 5 秒
        const specialElementSelector = 'div.n-element.__element-q8o5bu.h-3.w-3.bg-gray-500.rounded-1\\/2.mr-1';

        // ------------------ 工具函数 ------------------
        // 将 "hh:mm:ss" 或 "mm:ss" 转换成秒数
        function parseTimeToSeconds(timeStr) {
            const parts = timeStr.split(':').map(Number);
            if (parts.length === 3) {
                return parts[0] * 3600 + parts[1] * 60 + parts[2];
            } else if (parts.length === 2) {
                return parts[0] * 60 + parts[1];
            }
            return 0;
        }

        // 秒数转换为 hh:mm:ss
        function formatSecondsToHMS(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            return [
                h.toString().padStart(2, '0'),
                m.toString().padStart(2, '0'),
                s.toString().padStart(2, '0')
            ].join(':');
        }

        // 获取页面中两类 span 的最小时间（秒）
        function getMinTimeSeconds() {
            const selectors = ['span.chapter-color', 'span.text-gray-500']; // 两类时间 span
            let minSeconds = Infinity;

            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(span => {
                    const seconds = parseTimeToSeconds(span.textContent.trim());
                    if (!isNaN(seconds) && seconds > 0) {
                        minSeconds = Math.min(minSeconds, seconds);
                    }
                });
            });

            return minSeconds === Infinity ? 10 * 60 : minSeconds; // 默认10分钟
        }

        setTimeout(() => {

            let clickedType = null; // 标记点击的是哪种元素

            // 1️⃣ 优先找 canvas
            const fanCanvases = document.querySelectorAll('canvas.fan-canvas.mr-1[data-v-dd237e02]');
            if (fanCanvases.length > 0) {
                const lastCanvas = fanCanvases[fanCanvases.length - 1];
                console.log('找到最后一个 fan-canvas，模拟点击');
                lastCanvas.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                clickedType = "canvas";
            } else {
                // 2️⃣ 没有 canvas，尝试找 specialElement
                const specialElement = document.querySelector(specialElementSelector);
                if (specialElement) {
                    console.log('找到 specialElement，模拟点击');
                    specialElement.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                    clickedType = "specialElement";
                } else {
                    // 3️⃣ 再去找 √
                    console.log('没有找到 canvas 或 specialElement，尝试找 √ 图标');
                    const checkmarkSvgs = document.querySelectorAll('svg.icon-CheckmarkCircleSharp');
                    if (checkmarkSvgs.length > 0) {
                        const lastSvg = checkmarkSvgs[checkmarkSvgs.length - 1];
                        console.log('找到最后一个 √ 图标，模拟点击');
                        lastSvg.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                        clickedType = "checkmark";
                    } else {
                        console.log('没有找到 √ 图标');
                    }
                }
            }

            // 4️⃣ 定义启动刷新计时器（动态刷新时间 + hh:mm:ss）
            const startRefreshTimer = () => {
                const minTimeSeconds = getMinTimeSeconds();
                let remainingTime = minTimeSeconds; // 单位：秒
                console.log('下一次刷新时间（秒）：', minTimeSeconds);

                const progressDiv = document.createElement('div');
                progressDiv.style.position = 'fixed';
                progressDiv.style.bottom = '10px';
                progressDiv.style.right = '10px';
                progressDiv.style.padding = '5px 10px';
                progressDiv.style.background = 'rgba(0,0,0,0.7)';
                progressDiv.style.color = 'white';
                progressDiv.style.borderRadius = '5px';
                progressDiv.style.zIndex = 9999;
                progressDiv.textContent = `刷新倒计时: ${formatSecondsToHMS(remainingTime)}`;
                document.body.appendChild(progressDiv);

                const timer = setInterval(() => {
                    remainingTime -= 1;
                    if (remainingTime <= 0) {
                        clearInterval(timer);
                        location.reload();
                    } else {
                        progressDiv.textContent = `刷新倒计时: ${formatSecondsToHMS(remainingTime)}`;
                    }
                }, 1000);
            };

            // 5️⃣ 刷新逻辑
            if (clickedType === "canvas") {
                const specialElement = document.querySelector(specialElementSelector);
                if (specialElement) {
                    startRefreshTimer();
                } else {
                    const observer = new MutationObserver((mutations, obs) => {
                        const el = document.querySelector(specialElementSelector);
                        if (el) {
                            console.log('元素出现，开始倒计时刷新');
                            obs.disconnect();
                            startRefreshTimer();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            } else if (clickedType === "specialElement") {
                startRefreshTimer();
            } else if (clickedType === "checkmark") {
                console.log('点击 √ 图标，不刷新');
            } else {
                console.log('没有点击到任何目标，不刷新');
            }

        }, delay);

    });
})();
