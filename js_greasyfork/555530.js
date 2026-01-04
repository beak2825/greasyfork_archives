// ==UserScript==
// @name         HNU羽毛球场地自动预约脚本（优化版）
// @namespace    cuc-badminton-auto-booking
// @version      2.0
// @description  每天指定时间自动跳转并预约可用场地（稳定版）
// @match        *://eportal.hnu.edu.cn/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555530/HNU%E7%BE%BD%E6%AF%9B%E7%90%83%E5%9C%BA%E5%9C%B0%E8%87%AA%E5%8A%A8%E9%A2%84%E7%BA%A6%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555530/HNU%E7%BE%BD%E6%AF%9B%E7%90%83%E5%9C%BA%E5%9C%B0%E8%87%AA%E5%8A%A8%E9%A2%84%E7%BA%A6%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        targetHour: 22,        // 抢场时间
        targetMinute: 0,
        waitAfterLoad: 700,    // 页面加载后等待时间(ms)
        venueUrl: "https://eportal.hnu.edu.cn/v2/reserve/reserveDetail?id=57" // 预约页面（可修改）,此为南校区
    };

    console.log("✅ 自动预约脚本启动");

    /*** 时间计算 ***/
    function getWaitTime() {
        const now = new Date();
        let target = new Date();
        target.setHours(CONFIG.targetHour, CONFIG.targetMinute, 0, 0);

        if (target <= now) target.setDate(target.getDate() + 1);
        return target - now;
    }

    function waitForBooking() {
        const waitTime = getWaitTime();
        if (waitTime <= 0) {
            console.log("⚠️ 当前时间已超过22:00，立即开始预约");
            startBookingProcess();
        } else {
            console.log(`等待 ${Math.floor(waitTime/1000)} 秒到 22:00`);

            setTimeout(() => {
                console.log("🕙 到点，开始预约流程");
                startBookingProcess();
            }, waitTime);
        }
    }

    /*** 预约流程入口 ***/
    function startBookingProcess() {
        console.log('开始预约流程...');
        // 获取所有符合类名的按钮
        const buttons1 = document.querySelectorAll('button.el-button.el-button--default.el-button--small.el-button--primary');
        // 遍历找到包含“确定”文字的按钮
        for (const btn of buttons1) {
        if (btn.textContent.includes('确定')) {
            btn.click();
            break; // 找到后停止遍历
        }
        }
        // 点击获取前一天数据
        // 先获取所有符合类名的 button
        const buttons2 = document.querySelectorAll('button.zl-button.zl-button-line.zl-button-fixed.zl-button-mini');
        // 遍历找到包含“后一天”文字的按钮
        for (const btn of buttons2) {
        if (btn.textContent.includes('后一天')) {
            btn.click();
            break; // 找到后停止遍历
        }
        }
        // 等待数据加载完成
        setTimeout(() => {
            findAndBookCourt();
        }, CONFIG.waitAfterLoad);
    }

    /*** 找可预约场地 ***/
    function findAndBookCourt() {
        console.log("🔍 正在查找可预约场地…");

        const slots = document.querySelectorAll("div.canReserve.xiaoshou span");
        let booked = false;

        // 从后往前搜索
        for (let i = slots.length - 9; i >= 0; i--) {//20:10~21:10场，之后会发布自主预选版本
            const item = slots[i];
            if (item.textContent.includes("可预约")) {

                console.log(`✅ 找到可预约场地：第 ${i + 1} 个`);
                booked = true;

                // 点击时间段
                item.dispatchEvent(new MouseEvent("click", { bubbles: true }));

                // 等待弹窗按钮
                setTimeout(() => {
                    const confirm = Array.from(document.querySelectorAll('a'))
                        .find(a => a.textContent.includes('确定预约'));
                    if (confirm) {
                        confirm.click();
                        console.log("🎉 已提交预约 → 请到订单查看结果");
                    } else {
                        console.log("⚠ 未找到确定预约按钮，稍后重试");
                        setTimeout(findAndBookCourt, 500);
                    }
                }, 400);

                break;
            }
        }

        if (!booked) {
            console.warn("❌ 未找到可预约场地，5秒后自动重试…");
            setTimeout(findAndBookCourt, 5000);
        }
    }

    /*** 页面入口 ***/
    function init() {
        const url = window.location.href;

        // 已在预约页面
        console.log("等待到点跳转");
        waitForBooking();
        console.log("✅ 已进入预约页面，开始执行抢场流程");
        setTimeout(startBookingProcess, 800);
    }

    // 页面加载完成执行
    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", init);
    else
        init();

    /** UI 提示 **/
    setTimeout(() => {
        const hint = document.createElement("div");
        hint.style = `
            position:fixed;
            top:10px;right:10px;
            padding:10px;
            color:white;
            background:#28a745;
            font-size:14px;
            border-radius:6px;
            z-index:99999;
        `;
        hint.innerHTML = `✅ 自动预约脚本运行中…<br>将在 <b>${CONFIG.targetHour}:${CONFIG.targetMinute.toString().padStart(2,'0')}</b> 自动预约`;
        document.body.appendChild(hint);
    }, 1000);

})();
