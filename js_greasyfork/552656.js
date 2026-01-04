// ==UserScript==
// @name         Linuxdo 真 · 头衔屏蔽器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  隐藏 Linux.do 论坛中的用户名显示
// @author       You
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552656/Linuxdo%20%E7%9C%9F%20%C2%B7%20%E5%A4%B4%E8%A1%94%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552656/Linuxdo%20%E7%9C%9F%20%C2%B7%20%E5%A4%B4%E8%A1%94%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 GM_addStyle 注入 CSS 样式
    GM_addStyle(`
        /* 隐藏 new_user 链接 */
        .names .new_user a {
            display: none !important;
        }

        /* 隐藏 user-title 及其链接 */
        .names .user-title,
        .names .user-title a {
            display: none !important;
        }

        /* 隐藏 second username (只隐藏 second 类的 username) */
        .names .second.username {
            display: none !important;
        }

        /* 隐藏用户徽章图标容器 */
        .topic-meta-data .names .poster-icon-container {
            display: none !important;
        }

        /* 隐藏用户状态消息（emoji 等） */
        .topic-meta-data .user-status-message-wrap {
            display: none !important;
        }

        /* 隐藏用户头像上的信任等级徽章 */
        .avatar-flair.rounded {
            display: none !important;
        }


    `);

    console.log('Linux.do 用户名隐藏插件已加载');
})();

