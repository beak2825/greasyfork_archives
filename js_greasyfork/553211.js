// ==UserScript==
// @name         小鹅通自动点击加载更多 (高效版)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  通过 async/await 循环，一次点击即可自动、快速地点击“加载更多”按钮，直到所有内容加载完毕。
// @author       leyfung
// @match        *://*.pc.xiaoe-tech.com/p/t_pc/course_pc_detail/column/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553211/%E5%B0%8F%E9%B9%85%E9%80%9A%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A%20%28%E9%AB%98%E6%95%88%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553211/%E5%B0%8F%E9%B9%85%E9%80%9A%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A%20%28%E9%AB%98%E6%95%88%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ------------------- 配置区域 -------------------
    // 【重要】请将这里的 CSS 选择器替换为你找到的“加载更多”按钮的选择器
    const LOAD_MORE_BUTTON_SELECTOR = '.column_catalog .culumn_list__wrapper .load_more_btn'; // 这是一个非常通用的选择器，建议用开发者工具找到更精确的，例如 '.load-more-btn'
    const BUTTON_TEXT = '加载更多'; // 按钮上显示的文字，用于精确查找

    const LOOP_DELAY = 1000; // 每次点击后等待的时间（毫秒），1000ms = 1秒。可以根据你的网速适当调低，例如500。
    // ----------------------------------------------

    let isRunning = false; // 脚本运行状态标志
    let controlButton = null; // 控制脚本启停的UI按钮

    /**
     * 通过标签和文本内容查找元素
     * @param {string} selector - CSS选择器 (e.g., 'div', 'button', '.some-class')
     * @param {string} text - 目标元素的文本内容
     * @returns {HTMLElement|null} - 返回找到的元素或null
     */
    function findElementByText(selector, text) {
        return Array.from(document.querySelectorAll(selector))
            .find(el => el.textContent.trim().includes(text));
    }

    /**
     * 检查一个元素是否真实可见 (而不仅仅是存在于DOM中)
     * @param {HTMLElement} el
     * @returns {boolean}
     */
    function isElementVisible(el) {
        // offsetParent will be null if the element or an ancestor has display: none.
        return el && el.offsetParent !== null;
    }


    /**
     * 主执行函数，使用 async/await 循环处理
     */
    async function runAutoLoad() {
        console.log('自动化任务启动...');
        updateControlButton('运行中 (点击停止)', '#f44336');

        while (isRunning) {
            // 1. 查找“加载更多”按钮
            const loadMoreButton = findElementByText(LOAD_MORE_BUTTON_SELECTOR, BUTTON_TEXT);

            // 2. 检查按钮是否存在且可见
            if (loadMoreButton && isElementVisible(loadMoreButton)) {
                console.log('发现“加载更多”按钮，正在点击...');

                // 3. 滚动到按钮并点击
                loadMoreButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                loadMoreButton.click();

                // 4. 等待一段时间，让新内容加载
                await new Promise(resolve => setTimeout(resolve, LOOP_DELAY));

            } else {
                // 5. 如果找不到按钮，任务完成
                console.log('未找到“加载更多”按钮，任务结束。');
                isRunning = false; // 退出循环
                break;
            }
        }

        // 循环结束后，更新UI
        if (!controlButton.textContent.includes('启动')) {
             stopAutoLoad();
             window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // 全部加载完后，滚动到底部
        }
    }

    /**
     * 启动自动化
     */
    function startAutoLoad() {
        if (isRunning) return;
        isRunning = true;
        runAutoLoad(); // 注意这里是直接调用，而不是用 `setInterval`
    }

    /**
     * 停止自动化
     */
    function stopAutoLoad() {
        isRunning = false;
        console.log('自动化任务已手动停止。');
        updateControlButton('启动自动加载', '#008CBA');
    }

    /**
     * 更新控制按钮的样式和文本
     */
    function updateControlButton(text, color) {
        if (controlButton) {
            controlButton.textContent = text;
            controlButton.style.backgroundColor = color;
        }
    }

    /**
     * 在页面上创建控制按钮
     */
    function createControlButton() {
        controlButton = document.createElement('button');
        controlButton.textContent = '启动自动加载';
        controlButton.id = 'auto-load-control-btn';
        document.body.appendChild(controlButton);

        controlButton.addEventListener('click', () => {
            if (isRunning) {
                stopAutoLoad();
            } else {
                startAutoLoad();
            }
        });

        GM_addStyle(`
            #auto-load-control-btn {
                position: fixed; bottom: 500px; right: 20px; z-index: 9999;
                padding: 10px 15px; background-color: #008CBA; color: white;
                border: none; border-radius: 5px; cursor: pointer;
                font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: background-color 0.3s;
            }
            #auto-load-control-btn:hover { opacity: 0.9; }
        `);
    }

    // 等待页面加载完成后执行
    window.addEventListener('load', createControlButton, false);

})();
