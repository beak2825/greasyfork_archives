// ==UserScript==
// @name         校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动登录校园网：支持浏览器记住密码，自动尝试接口方式；登录成功自动停止
// @match        此处填写您学校校园网的验证域名* 
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550765/%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/550765/%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

// ====== 用户需要配置的部分 ======
// 1. 修改上面的 @match 为你们学校的认证地址（不要删除*号）
// 2. 修改 USERNAME / PASSWORD / SERVICE 为你自己的账号/密码/运营商
//    - 运营商示例：联通互联网服务 / 移动互联网服务 / 电信互联网服务 / 校园网服务
// =================================

(function() {
    'use strict';

    // ====== 用户账号配置 ======
    const USERNAME = "您的账号";
    const PASSWORD = "您的密码";
    const SERVICE = "您的运营商";
    // ==========================

    const MAX_TRIES = 100;
    let tries = 0;

    function isLoggedIn() {
        if (document.body.innerText.includes("已成功连接校园网")) return true;
        if (document.querySelector("a[href*='logout'], #logout")) return true;
        return false;
    }

    function clickLoginBtn() {
        const btn = document.getElementById('loginLink') || document.querySelector('#loginLink, button, a');
        if (btn) {
            console.log("检测到表单已填充，直接点击登录按钮");
            btn.click();
            return true;
        }
        return false;
    }

    function doLogin() {
        if (isLoggedIn()) {
            console.log("已登录成功，脚本停止");
            return;
        }

        // 如果账号密码输入框里已有值（浏览器自动记住的情况），直接点击登录
        const u = document.querySelector('#username');
        const p = document.querySelector('#pwd');
        if (u && p && u.value && p.value) {
            if (clickLoginBtn()) return;
        }

        // 否则走接口方式
        if (typeof window.AuthInterFace === "undefined") {
            console.warn("AuthInterFace 未加载，稍后重试");
            setTimeout(doLogin, 1000);
            return;
        }

        if (tries >= MAX_TRIES) {
            console.error("达到最大重试次数，停止刷新");
            return;
        }
        tries++;

        try {
            window.AuthInterFace.init("./");

            let encPwd = PASSWORD;
            if (typeof window.encryptedPassword === "function") {
                encPwd = window.encryptedPassword(PASSWORD);
            }

            const enc = s => encodeURIComponent(encodeURIComponent(s));

            window.AuthInterFace.login(
                enc(USERNAME),
                enc(encPwd),
                enc(SERVICE),
                encodeURIComponent(window.location.search.substring(1) || ""),
                "", "", "",
                "true",
                function(resp) {
                    if (resp && resp.result === "success") {
                        console.log("登录成功:", resp);
                        setTimeout(() => {
                            if (!isLoggedIn()) {
                                console.warn("登录成功返回但未跳转，刷新重试");
                                location.reload();
                            }
                        }, 5000);
                    } else {
                        console.error("登录失败:", resp);
                        setTimeout(() => location.reload(), 2000);
                    }
                }
            );

            // 超时检测
            setTimeout(() => {
                if (!isLoggedIn()) {
                    console.warn("登录未成功，刷新重试");
                    location.reload();
                }
            }, 1);

        } catch (e) {
            console.error("调用 AuthInterFace 出错:", e);
            setTimeout(() => location.reload(), 3000);
        }
    }

    window.addEventListener("load", () => setTimeout(doLogin, 500));
})();