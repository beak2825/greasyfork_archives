// ==UserScript==
// @name         自动页面访问器 (Auto Page Visitor)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  每隔5秒访问指定URL，共90次。通过油猴菜单控制启停。
// @author       GitHub Copilot
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/553284/%E8%87%AA%E5%8A%A8%E9%A1%B5%E9%9D%A2%E8%AE%BF%E9%97%AE%E5%99%A8%20%28Auto%20Page%20Visitor%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553284/%E8%87%AA%E5%8A%A8%E9%A1%B5%E9%9D%A2%E8%AE%BF%E9%97%AE%E5%99%A8%20%28Auto%20Page%20Visitor%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_URL = 'https://alfilatov.com/MSEdgeSearchClicker/';
    const TOTAL_VISITS = 90;
    const DELAY = 5000; // 5秒

    // 注册菜单命令
    GM_registerMenuCommand('[开始自动访问]', startVisiting);
    GM_registerMenuCommand('[停止自动访问]', stopVisiting);

    /**
     * 开始访问流程
     */
    async function startVisiting() {
        // 初始化计数器和状态
        await GM_setValue('visitCount', 0);
        await GM_setValue('isVisitingActive', true);
        console.log('自动访问任务已开始。');
        GM_notification({
            title: '自动访问',
            text: `任务开始，将访问 ${TOTAL_VISITS} 次。`,
            timeout: 3000
        });
        // 立即开始第一次访问
        window.location.href = TARGET_URL;
    }

    /**
     * 停止访问流程
     */
    async function stopVisiting() {
        await GM_setValue('isVisitingActive', false);
        console.log('自动访问任务已手动停止。');
        GM_notification({
            title: '自动访问',
            text: '任务已停止。',
            timeout: 3000
        });
    }

    /**
     * 页面加载时执行的主函数
     */
    async function main() {
        const isVisiting = await GM_getValue('isVisitingActive', false);

        // 如果任务未激活，则不执行任何操作
        if (!isVisiting) {
            return;
        }

        let count = await GM_getValue('visitCount', 0);

        if (count < TOTAL_VISITS) {
            // 更新计数
            count++;
            await GM_setValue('visitCount', count);
            console.log(`正在进行第 ${count} / ${TOTAL_VISITS} 次访问...`);

            // 设置一个定时器，在延迟后跳转到目标URL
            setTimeout(() => {
                window.location.href = TARGET_URL;
            }, DELAY);

        } else {
            // 达到90次后，停止任务
            console.log('已完成全部 90 次访问任务。');
            await GM_setValue('isVisitingActive', false); // 停止任务
            GM_notification({
                title: '自动访问',
                text: '已完成所有访问任务！',
                timeout: 5000
            });
        }
    }

    // 执行主函数
    main();
})();