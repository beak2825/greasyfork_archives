// ==UserScript==
// @name         广东学法考试自动刷学时
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  广东省学法考试系统刷指定章节学时
// @match        *://xfks-study.gdsf.gov.cn/study/course/*/chapter/*
// @run-at       document-end
// @grant        unsafeWindow
// @license      
// @downloadURL https://update.greasyfork.org/scripts/555516/%E5%B9%BF%E4%B8%9C%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%88%B7%E5%AD%A6%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/555516/%E5%B9%BF%E4%B8%9C%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%88%B7%E5%AD%A6%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRandomDelay() {
        return Math.random() * 500 + 1500; // 随机延迟1500毫秒+ 0-500毫秒，根据自己需要修改就好，不建议小于1s
    }

    function callSubmitLearn() {
        // 方法1：直接通过window对象调用
        if (typeof window.submitLearn === 'function') {
            console.log('通过window对象调用submitLearn()');
            window.submitLearn();
            return true;
        }

        if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.submitLearn === 'function') {
            console.log('通过unsafeWindow调用submitLearn()');
            unsafeWindow.submitLearn();
            return true;
        }

        return false;
    }

    function clickNextChapter() {
        const nextChapterBtn = document.querySelector('.next_chapter');
        if (nextChapterBtn) {
            console.log('找到.next_chapter元素，准备点击');
            nextChapterBtn.click();
            setTimeout(() => {
                clickNextChapter();
            }, getRandomDelay());
        } else {
            console.log('未找到.next_chapter元素，循环结束');
        }
    }

    function mainExecution() {
        if (callSubmitLearn()) {
            console.log('submitLearn()调用成功，准备执行下一章节点击');
            setTimeout(() => {
                clickNextChapter();
            }, getRandomDelay());
        } else {
            console.log('submitLearn()函数未找到，无法继续执行');
        }
    }

    function tryExecuteWithRetry(maxRetries = 5, interval = 1000) {
        let retries = 0;
        const attemptExecute = function() {
            if (typeof window.submitLearn === 'function' ||
                (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.submitLearn === 'function')) {
                mainExecution();
                return;
            }

            retries++;
            if (retries < maxRetries) {
                console.log(`第${retries}次尝试，${interval}ms后重试`);
                setTimeout(attemptExecute, interval);
            } else {
                console.log('submitLearn()函数未找到，请检查页面和函数名');
            }
        };

        setTimeout(attemptExecute, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryExecuteWithRetry);
    } else {
        tryExecuteWithRetry();
    }

    function addControlPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div style="position:fixed; top:10px; right:10px; z-index:9999; background:#f5f5f5; padding:10px; border:1px solid #ccc; border-radius:5px; font-family:Arial, sans-serif;">
                <h4 style="margin:0 0 10px 0;">自动学习控制</h4>
                <button id="startAutoLearn" style="padding:5px 10px; margin-right:5px; background:#4CAF50; color:white; border:none; border-radius:3px; cursor:pointer;">开始</button>
                <button id="stopAutoLearn" style="padding:5px 10px; background:#f44336; color:white; border:none; border-radius:3px; cursor:pointer;">停止</button>
            </div>
        `;

        document.body.appendChild(panel);

        let isRunning = false;
        let currentTimeout = null;

        document.getElementById('startAutoLearn').addEventListener('click', function() {
            if (!isRunning) {
                isRunning = true;
                console.log('开始自动学习流程');
                mainExecution();
            }
        });

        document.getElementById('stopAutoLearn').addEventListener('click', function() {
            if (isRunning) {
                isRunning = false;
                if (currentTimeout) {
                    clearTimeout(currentTimeout);
                }
                console.log('自动学习已停止');
            }
        });
    }

    setTimeout(addControlPanel, 500);
})();
