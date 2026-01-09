// ==UserScript==
// @name         X (Twitter) 动态时间格式化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根据日期智能显示时间：今天(HH:mm)、今年(MM-DD HH:mm)、往年(YYYY-MM-DD HH:mm)
// @author       GeBron
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561824/X%20%28Twitter%29%20%E5%8A%A8%E6%80%81%E6%97%B6%E9%97%B4%E6%A0%BC%E5%BC%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/561824/X%20%28Twitter%29%20%E5%8A%A8%E6%80%81%E6%97%B6%E9%97%B4%E6%A0%BC%E5%BC%8F%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function formatTime() {
        const timeElements = document.querySelectorAll('time');
        const now = new Date();

        timeElements.forEach(timeEl => {
            if (timeEl.dataset.absoluteTimeReady) return;

            const datetime = timeEl.getAttribute('datetime');
            if (datetime) {
                const date = new Date(datetime);
                
                const isToday = date.toDateString() === now.toDateString();
                const isThisYear = date.getFullYear() === now.getFullYear();

                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                let displayTime;

                if (isToday) {
                    // 1. 如果是当天：14:30
                    displayTime = `${hours}:${minutes}`;
                } else if (isThisYear) {
                    // 2. 如果是当年：10-27 14:30
                    displayTime = `${month}-${day} ${hours}:${minutes}`;
                } else {
                    // 3. 如果是往年：2023-10-27 14:30
                    displayTime = `${year}-${month}-${day} ${hours}:${minutes}`;
                }

                const span = timeEl.querySelector('span');
                if (span) {
                    span.textContent = displayTime;
                } else {
                    timeEl.textContent = displayTime;
                }

                timeEl.dataset.absoluteTimeReady = "true";
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                formatTime();
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    formatTime();
})();