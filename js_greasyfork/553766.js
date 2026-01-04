// ==UserScript==
// @name         GreasyFork 脚本停更过滤
// @namespace    https://github.com/yourname
// @version      1.0
// @description  隐藏 GreasyFork 上最近 N 个月未更新的脚本，支持自定义时间阈值（单位：月）
// @author       Richard Tyson
// @match        https://greasyfork.org/*/scripts*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/553766/GreasyFork%20%E8%84%9A%E6%9C%AC%E5%81%9C%E6%9B%B4%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/553766/GreasyFork%20%E8%84%9A%E6%9C%AC%E5%81%9C%E6%9B%B4%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========== 用户配置区 ==========
    // 默认隐藏 12 个月内未更新的脚本；你可以直接改这里（单位：月）
    const DEFAULT_MONTHS = GM_getValue ? GM_getValue('hideMonths', 12) : 12;
    // ==============================

    const PROCESSED_FLAG = 'data-gf-hidden-checked-v2';

    function getCutOffDate(months) {
        const date = new Date();
        date.setMonth(date.getMonth() - months);
        date.setHours(0, 0, 0, 0);
        return date;
    }

    function hideOutdated(months) {
        const cutoffDate = getCutOffDate(months);
        const items = document.querySelectorAll('li[data-script-id]:not([' + PROCESSED_FLAG + '])');

        for (const item of items) {
            let updateTime = null;

            // 优先使用“更新于”，其次用“创建于”
            const updatedEl = item.querySelector('.script-list-updated-date relative-time[datetime]');
            const createdEl = item.querySelector('.script-list-created-date relative-time[datetime]');

            if (updatedEl) {
                updateTime = new Date(updatedEl.getAttribute('datetime'));
            } else if (createdEl) {
                updateTime = new Date(createdEl.getAttribute('datetime'));
            }

            if (updateTime && !isNaN(updateTime.getTime())) {
                const updateDate = new Date(updateTime);
                updateDate.setHours(0, 0, 0, 0);
                if (updateDate < cutoffDate) {
                    item.style.display = 'none';
                }
            }

            item.setAttribute(PROCESSED_FLAG, 'true');
        }
    }

    // 初始执行
    hideOutdated(DEFAULT_MONTHS);

    // 监听新内容
    const observer = new MutationObserver(() => {
        if (document.querySelector('li[data-script-id]:not([' + PROCESSED_FLAG + '])')) {
            hideOutdated(DEFAULT_MONTHS);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 每秒兜底扫描（兼容懒加载）
    setInterval(() => hideOutdated(DEFAULT_MONTHS), 1000);

    // ========== 菜单设置功能（仅在支持 GM_* 的环境下启用）==========
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand(`⚙️ 设置隐藏阈值（当前：${DEFAULT_MONTHS} 个月）`, () => {
            const input = prompt('请输入要隐藏的“未更新月数”（例如：6 表示隐藏6个月以上未更新的脚本）：', DEFAULT_MONTHS.toString());
            if (input === null) return; // 取消

            const num = parseInt(input.trim(), 10);
            if (isNaN(num) || num < 0) {
                alert('请输入一个有效的非负整数（如 6、12、24）');
                return;
            }

            GM_setValue('hideMonths', num);
            alert(`设置成功！将在刷新页面后生效。\n当前阈值：${num} 个月`);

            // 可选：立即重载当前页面（谨慎）
            // location.reload();
        });
    }
})();