// ==UserScript==
// @name         每日自动打开签到网页（any router等）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  访问指定网页时，自动检查并每日一次在后台新标签页中打开需要签到的网站。
// @author       Gemini
// @match *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_log
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552854/%E6%AF%8F%E6%97%A5%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E7%AD%BE%E5%88%B0%E7%BD%91%E9%A1%B5%EF%BC%88any%20router%E7%AD%89%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552854/%E6%AF%8F%E6%97%A5%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E7%AD%BE%E5%88%B0%E7%BD%91%E9%A1%B5%EF%BC%88any%20router%E7%AD%89%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 您需要配置的部分 ---

    // 【重要】要自动打开并签到的网页地址
    const SIGN_IN_URL = 'https://anyrouter.top/console';

    // 脚本日志的统一前缀，方便在控制台查看
    const LOG_PREFIX = '[触发式自动签到]';

    // --- 配置结束 ---


    // 核心执行函数
    async function dailyOpenOnce() {
        // 用于存储的键名，确保唯一性
        const storageKey = 'lastOpenedDateFor_' + SIGN_IN_URL;

        // 获取 YYYY-MM-DD 格式的今天日期
        const today = new Date().toISOString().slice(0, 10);

        // 从存储中读取上次打开的日期
        const lastOpenedDate = await GM_getValue(storageKey, null);

        GM_log(`${LOG_PREFIX} 脚本在 ${window.location.href} 被触发。`);
        GM_log(`${LOG_PREFIX} 今天是: ${today}, 上次记录的打开日期是: ${lastOpenedDate}`);

        // 检查今天是否已经执行过
        if (today !== lastOpenedDate) {
            GM_log(`${LOG_PREFIX} 检测到是新的一天，准备在后台打开签到页面: ${SIGN_IN_URL}`);

            // 在后台打开新的标签页
            // a. active: false  => 在后台打开，不跳转过去
            // b. insert: true   => 在当前标签页旁边打开
            // c. setParent: true => 关闭后台标签页时，焦点会返回到当前页
            GM_openInTab(SIGN_IN_URL, { active: false, insert: true, setParent: true });

            // 【重要】立即更新存储中的日期，防止重复执行
            await GM_setValue(storageKey, today);
            GM_log(`${LOG_PREFIX} 已成功打开页面并更新日期记录。`);

        } else {
            GM_log(`${LOG_PREFIX} 今天已经执行过了，无需操作。`);
        }
    }

    // 脚本主入口
    dailyOpenOnce();

})();