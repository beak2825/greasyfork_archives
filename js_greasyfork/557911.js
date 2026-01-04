// ==UserScript==
// @name         luolcy & PikPak 自动跳转下载脚本（最新版）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动点击 luolcy.com 与 PikPak 的下载按钮并在完成后关闭页面
// @match        https://luolcy.com/11*
// @match        https://luolcy.com/download?post_id=*
// @match        https://mypikpak.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557911/luolcy%20%20PikPak%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC%EF%BC%88%E6%9C%80%E6%96%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557911/luolcy%20%20PikPak%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC%EF%BC%88%E6%9C%80%E6%96%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 工具：等待元素出现
    function waitForElement(selector, callback, interval = 400) {
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                callback(el);
            }
        }, interval);
    }

    // ==========================================
    // ① 页面：luolcy.com/11*
    // 点击：.download-button-box button
    // ==========================================
    if (location.href.includes("luolcy.com/11")) {
        waitForElement(".download-button-box button", (btn) => {
            console.log("自动点击：download-button-box 里的按钮");
            btn.click();
        });
    }

    // ==========================================
    // ② 页面：luolcy.com/download?post_id=*
    // 点击：a.empty.button
    // ==========================================
    if (location.href.includes("luolcy.com/download?post_id")) {
        waitForElement("a.empty.button", (a) => {
            console.log("自动点击：empty button");
            a.click();
        });
    }

    // ==========================================
    // ③ 页面：mypikpak.com/s/*
    // 点击：class="el-button el-button--primary pp-primary-button restore-btn"
    // 监听提示“已全部儲存到我的 PikPak”，出现后关闭窗口
    // ==========================================
    if (location.href.includes("mypikpak.com/s/")) {

        // 点击新版 restore 按钮
        waitForElement(".el-button.el-button--primary.pp-primary-button.restore-btn", (btn) => {
            console.log("自动点击：PikPak restore-btn 按钮");
            btn.click();
        });

        // 监听：成功提示出现后关闭页面
        const observer = new MutationObserver(() => {
            if (document.body.innerText.includes("已全部儲存到我的 PikPak")) {
                console.log("检测到已全部储存，准备关闭页面");
                observer.disconnect();
                setTimeout(() => window.close(), 1200);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
