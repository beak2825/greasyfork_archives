// ==UserScript==
// @name         【夸克百科】跳转草稿箱
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  【夸克百科】跳转到草稿箱
// @author       You
// @match        https://baike.quark.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/557569/%E3%80%90%E5%A4%B8%E5%85%8B%E7%99%BE%E7%A7%91%E3%80%91%E8%B7%B3%E8%BD%AC%E8%8D%89%E7%A8%BF%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/557569/%E3%80%90%E5%A4%B8%E5%85%8B%E7%99%BE%E7%A7%91%E3%80%91%E8%B7%B3%E8%BD%AC%E8%8D%89%E7%A8%BF%E7%AE%B1.meta.js
// ==/UserScript==



// 监听 URL 变化
(function() {

    // 定时检查 URL 是否发生变化
    setInterval(function() {
        let currentUrl = window.location.href;

        // 检查 URL 是否为 "https://baike.quark.cn/dashboard/contents"
        // https://baike.quark.cn/dashboard/create
        if (currentUrl === "https://baike.quark.cn/dashboard/contents"
            || currentUrl === "https://baike.quark.cn/dashboard/create") {
            // 如果匹配，跳转到新的 URL
            window.location.href = "https://baike.quark.cn/dashboard/contents?status=my_draft_list";
        }

    }, 1000); // 每秒检查一次
})();

