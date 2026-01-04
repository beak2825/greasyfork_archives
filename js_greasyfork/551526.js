// ==UserScript==
// @name         YouTube 自动跳转到 APP
// @namespace    http://via
// @version      1.0
// @description  在 YouTube 页面上点击按钮后自动跳转到 APP
// @match        *://m.youtube.com/*
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551526/YouTube%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%20APP.user.js
// @updateURL https://update.greasyfork.org/scripts/551526/YouTube%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%20APP.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ① 创建一个按钮
    let btn = document.createElement("button");
    btn.innerText = "打开 YouTube APP";
    btn.style.position = "fixed";
    btn.style.bottom = "10%";
    btn.style.right = "32.5%";
    btn.style.zIndex = "9999";
    btn.style.padding = "10px 15px";
    btn.style.background = "#ff0000";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.fontSize = "14px";
    btn.style.cursor = "pointer";

    // ② 按钮点击后执行跳转
    btn.addEventListener("click", function () {
        // Android 的 YouTube APP 协议：vnd.youtube://
        // iOS 同样可以用 youtube://
        let url = location.href.replace("https://m.youtube.com", "vnd.youtube://m.youtube.com");
        url = url.replace("https://www.youtube.com", "vnd.youtube://www.youtube.com");

        // 如果只想打开首页可以改成：
        // let url = "vnd.youtube://";

        location.href = url;
    });

    // ③ 把按钮添加到页面
    document.body.appendChild(btn);
})();