// ==UserScript==
// @name         考勤报表 css 调整
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  在所有 *.dingtalk.com 页面中：1) 设置 ag-grid 高度；2) 删除多种可能的页头和导航元素
// @author       You
// @match        *://*.dingtalk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563293/%E8%80%83%E5%8B%A4%E6%8A%A5%E8%A1%A8%20css%20%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/563293/%E8%80%83%E5%8B%A4%E6%8A%A5%E8%A1%A8%20css%20%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置区 ===

    // 任务1：设置表格高度
    const GRID_TASK = {
        name: '设置表格高度',
        selector: '.ag-theme-balham',
        action: (el) => {
            el.style.height = '800px';
            return true;
        },
        applied: false
    };

    // 任务2：删除导航栏（支持多个类名）
    const NAV_SELECTORS = [
        '.nav-2idbrR'
        // 可在此添加其他可能的导航类名，如 '.nav-xxxxx'
    ];

    const NAV_TASK = {
        name: '删除导航栏',
        selectors: NAV_SELECTORS,
        action: (el) => {
            el.remove();
            return true;
        },
        applied: false
    };

    // 任务3：删除页头（支持多个已知哈希变体）
    const HEADER_SELECTORS = [
        '.index_pageHeaderContainer__2lJIF',
        '.index_pageHeaderContainer__30BhC'
        // 未来如有新类名，可继续添加到此列表
    ];

    const HEADER_TASK = {
        name: '删除页头',
        selectors: HEADER_SELECTORS,
        action: (el) => {
            el.remove();
            return true;
        },
        applied: false
    };

    const TASKS = [GRID_TASK, NAV_TASK, HEADER_TASK];

    const CHECK_INTERVAL = 500;   // 轮询间隔（毫秒）
    const TIMEOUT = 30000;        // 超时时间（毫秒）

    let checkInterval;

    function checkAndApply() {
        let allDone = true;

        for (const task of TASKS) {
            if (task.applied) continue;

            let found = false;

            if (task.selector) {
                // 单选择器任务（如表格）
                const elements = document.querySelectorAll(task.selector);
                if (elements.length > 0) {
                    elements.forEach(el => task.action(el));
                    console.log(`✅ [Tampermonkey] ${task.name} 已处理 (${elements.length} 个元素)`);
                    task.applied = true;
                    found = true;
                }
            } else if (task.selectors && Array.isArray(task.selectors)) {
                // 多选择器任务（如页头、导航）
                for (const sel of task.selectors) {
                    const elements = document.querySelectorAll(sel);
                    if (elements.length > 0) {
                        elements.forEach(el => task.action(el));
                        console.log(`✅ [Tampermonkey] ${task.name} 已处理（匹配: ${sel}，共 ${elements.length} 个）`);
                        task.applied = true;
                        found = true;
                        break; // 找到任意一个就视为完成
                    }
                }
            }

            if (!found) {
                allDone = false;
            }
        }

        if (allDone) {
            clearInterval(checkInterval);
            console.log('⏹️ [Tampermonkey] 所有任务已完成，停止监听。');
        }
    }

    // 启动
    console.log('[Tampermonkey] 开始监听页面元素...');

    // 立即尝试一次
    checkAndApply();

    // 启动轮询
    checkInterval = setInterval(checkAndApply, CHECK_INTERVAL);

    // 超时保护
    setTimeout(() => {
        const pending = TASKS.filter(t => !t.applied).map(t => t.name);
        if (pending.length > 0) {
            clearInterval(checkInterval);
            console.warn(`⏰ [Tampermonkey] 轮询超时（${TIMEOUT / 1000}秒），以下任务未完成：`, pending);
        }
    }, TIMEOUT);
})();