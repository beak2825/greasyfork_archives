// ==UserScript==
// @name         B站剧集券和大会员积分自动签到
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  B站剧集券和大会员积分自动签到, 可自定义第三天签到日期
// @match        https://www.bilibili.com
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.js
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547848/B%E7%AB%99%E5%89%A7%E9%9B%86%E5%88%B8%E5%92%8C%E5%A4%A7%E4%BC%9A%E5%91%98%E7%A7%AF%E5%88%86%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/547848/B%E7%AB%99%E5%89%A7%E9%9B%86%E5%88%B8%E5%92%8C%E5%A4%A7%E4%BC%9A%E5%91%98%E7%A7%AF%E5%88%86%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const three_days_sign_check_api = 'https://api.bilibili.com/x/vip/vip_center/sign_in/three_days_sign';
    const activity_score_task_sign_api = 'https://api.bilibili.com/pgc/activity/score/task/sign2';

    const SETTING_KEY_SIGN_DAY = 'bili_vip_sign_day_v3';
    const WEEKDAYS = {
        1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六', 0: '周日'
    };

    // --- 工具函数 ---

    // 日志函数
    function the_log(...msg) {
        console.log('%c[B站大会员积分自动签到]', 'font-weight: bold; color: white; background-color: #FF9999; padding: 2px; border-radius: 2px;', ...msg);
    }

    // 注入CSS样式
    function injectStyles() {
        const style = `
            /* 按钮通用悬浮效果 */
            #bili-sign-save-btn, #bili-sign-cancel-btn {
                transition: all 0.2s ease-in-out;
            }
            #bili-sign-save-btn:hover {
                background-color: #00b5e5 !important;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            #bili-sign-cancel-btn:hover {
                background-color: #dcdfe6 !important;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            /* 顶部通知弹窗样式 */
            .bili-sign-top-toast {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(-100px);
                background-color: #00a1d6;
                color: white;
                padding: 10px 25px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-size: 14px;
                opacity: 0;
                transition: transform 0.4s ease-out, opacity 0.4s ease-out;
            }
            .bili-sign-top-toast.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = style;
        document.head.appendChild(styleElement);
    }

    // 显示顶部通知
    function showTopNotification(message, duration = 3000) {
        // 移除已存在的通知
        $('.bili-sign-top-toast').remove();

        const toast = $(`<div class="bili-sign-top-toast">${message}</div>`);
        $('body').append(toast);

        // 触发显示动画
        setTimeout(() => toast.addClass('show'), 50);

        // 到期后触发隐藏动画并移除
        setTimeout(() => {
            toast.removeClass('show');
            setTimeout(() => toast.remove(), 500); // 等待动画结束后再移除DOM
        }, duration);
    }

    // --- 核心逻辑 ---

    the_log("自动签到脚本已启动...");

    // 注入自定义样式
    injectStyles();

    // 获取 CSRF Token
    const u_frsc = (document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('bili_jct=')) || '').split('bili_jct=')[1] || '';
    const u_frsc_flag = u_frsc !== '';

    // POST 签到请求
    async function doSign() {
        const url = activity_score_task_sign_api + '?csrf=' + u_frsc;
        the_log("正在执行POST签到请求...");
        try {
            const response = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Referer": "https://big.bilibili.com"},
                body: `device=phone`
            });
            const data = await response.json();
            if (data.code === 0) {
                if (data.data.count <= 3) {
                    the_log("签到成功！本轮已签到次数:", data.data.count);
                    showTopNotification('剧集券自动签到成功！本轮已签到' + data.data.count + '天');
                } else {
                    the_log("大会员积分签到成功！");
                    showTopNotification('大会员积分自动签到成功！');
                }

            } else {
                the_log("签到失败:", data.message);
            }
        } catch (error) {
            the_log("签到请求失败:", error);
        }
    }

    // GET 检查状态并决定是否签到
    async function checkAndSign() {
        if (!u_frsc_flag) {
            the_log("未登录B站，跳过签到。");
            return;
        }
        the_log("正在检查签到状态...");
        try {
            const response = await fetch(three_days_sign_check_api, { method: "GET", credentials: "include" });
            const res = await response.json();
            if (res.code !== 0) {
                the_log("获取签到状态失败:", res.message);
                return;
            }
            const { count, signed } = res.data.three_day_sign;
            the_log(`今天是否已签到: ${signed}`);

            if (signed) {
                the_log("今天已经签到过了，无需重复签到。");
                return;
            }
            if (count < 2) {
                the_log("本轮已签到天数小于2天，执行签到。");
                await doSign();
            } else if (count === 2) {
                const today = new Date().getDay();
                const configuredDay = GM_getValue(SETTING_KEY_SIGN_DAY, 6);
                the_log(`今天是 [${WEEKDAYS[today]}]，设置的第三天签到日是 [${WEEKDAYS[configuredDay]}]`);
                if (today === configuredDay) {
                    the_log("今天是指定的第三天签到日，执行签到。");
                    await doSign();
                } else {
                    the_log("今天不是指定的签到日，跳过。");
                }
            } else {
                the_log(`执行大会员积分签到。`);
                await doSign();
            }
        } catch (error) {
            the_log("检查签到状态请求失败:", error);
        }
    }

    // --- UI 相关 ---

    // 显示设置弹窗
    function showSettingsDialog() {
        if (document.getElementById('bili-sign-settings-panel')) return;

        const configuredDay = GM_getValue(SETTING_KEY_SIGN_DAY, 6);
        let optionsHtml = [1, 2, 3, 4, 5, 6, 0].map(day =>
                                                    `<option value="${day}" ${day === configuredDay ? 'selected' : ''}>${WEEKDAYS[day]}</option>`
        ).join('');

        const dialogHtml = `
            <div id="bili-sign-settings-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9998;"></div>
            <div id="bili-sign-settings-panel" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; border: 1px solid #e3e5e7; width: 320px;">
                <h3 style="margin: 0 0 15px; text-align: center; color: #18191c;">设置第三天签到日期</h3>
                <div style="font-size: 14px; color: #61666d; margin-bottom: 10px;">请选择星期（剧集券有限期两天）：</div>
                <select id="bili-sign-day-select" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 20px; outline: none;">
                    ${optionsHtml}
                </select>
                <div style="display: flex; justify-content: space-around;">
                    <button id="bili-sign-save-btn" style="padding: 8px 20px; border: none; background-color: #00a1d6; color: white; border-radius: 4px; cursor: pointer;">保存</button>
                    <button id="bili-sign-cancel-btn" style="padding: 8px 20px; border: none; background-color: #f1f2f3; color: #61666d; border-radius: 4px; cursor: pointer;">取消</button>
                </div>
            </div>
        `;
        $('body').append(dialogHtml);

        const closeDialog = () => $('#bili-sign-settings-overlay, #bili-sign-settings-panel').remove();

        $('#bili-sign-save-btn').on('click', () => {
            const selectedDay = parseInt($('#bili-sign-day-select').val());
            GM_setValue(SETTING_KEY_SIGN_DAY, selectedDay);
            showTopNotification(`设置成功！第三天签到日已保存为 [${WEEKDAYS[selectedDay]}]`);
            the_log(`设置已保存，第三天签到日: [${WEEKDAYS[selectedDay]}]`);
            closeDialog();
        });

        $('#bili-sign-cancel-btn, #bili-sign-settings-overlay').on('click', closeDialog);
    }

    // --- 脚本入口 ---

    // 注册油猴菜单
    GM_registerMenuCommand('设置第三天签到日期', showSettingsDialog);

    checkAndSign();
})();
