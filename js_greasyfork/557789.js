// ==UserScript==
// @name         DGUT快速进入优学院
// @namespace    dgut-auto-portal-full
// @version      3.0
// @description  解决进入东莞理工学院工作台要跳转一堆链接
// @match        https://application.dgut.edu.cn/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557789/DGUT%E5%BF%AB%E9%80%9F%E8%BF%9B%E5%85%A5%E4%BC%98%E5%AD%A6%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/557789/DGUT%E5%BF%AB%E9%80%9F%E8%BF%9B%E5%85%A5%E4%BC%98%E5%AD%A6%E9%99%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ----------------------------
    // ✅ 状态记录，每步只执行一次
    // ----------------------------
    if (!window.__DGUT_STAGE__) {
        window.__DGUT_STAGE__ = {
            loginClicked: false,
            appCenterClicked: false,
            uoocClicked: false,
        };
    }

    console.log("[dgut-auto] 当前 URL:", location.href);

    // ----------------------------
    // ✅ 延迟 1 秒保证 SPA 渲染完成
    // ----------------------------
    setTimeout(() => {

        // ----------------------------
        // 第 ① 步：Portal 点击登录
        // ----------------------------
        if (!window.__DGUT_STAGE__.loginClicked) {
            const loginBtn = document.querySelector("div.login-btn");
            if (loginBtn) {
                console.log("[dgut-auto] ✅ 检测到登录按钮，执行点击");
                loginBtn.click();
                window.__DGUT_STAGE__.loginClicked = true;
                return;
            } else {
                console.log("[dgut-auto] 当前页面未检测到登录按钮，可能已登录或在认证页面");
            }
        }

        // ----------------------------
        // 第 ② 步：Portal 回跳 → 点击“应用中心”
        // ----------------------------
        if (!window.__DGUT_STAGE__.appCenterClicked) {
            const items = document.querySelectorAll("li.el-dropdown-menu__item");
            for (const item of items) {
                const text = item.innerText?.trim();
                if (text === "应用中心") {
                    console.log("[dgut-auto] ✅ 检测到“应用中心”，执行点击");
                    item.click();
                    window.__DGUT_STAGE__.appCenterClicked = true;
                    return;
                }
            }
            console.log("[dgut-auto] 当前页面未检测到“应用中心”，可能仍在认证流程中");
        }
    }, 1000); // ✅ 仅延迟一次，单次执行

})();
