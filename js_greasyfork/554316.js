// ==UserScript==
// @name         SouthPlus 南加域名跳转 简单 有效
// @namespace    https://github.com/4evergr8/southplusredirect
// @version      1.0
// @description  自动将魂+、北+、白+、Lv+、夏+、春+、雪+、东+、蓝+等域名跳转到可自定义的目标（默认 www.south-plus.net）
// @author       4evergr8
// @match        *://*.soul-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://*.white-plus.net/*
// @match        *://*.imoutolove.me/*
// @match        *://*.level-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://*.east-plus.net/*
// @match        *://*.blue-plus.net/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/554316/SouthPlus%20%E5%8D%97%E5%8A%A0%E5%9F%9F%E5%90%8D%E8%B7%B3%E8%BD%AC%20%E7%AE%80%E5%8D%95%20%E6%9C%89%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/554316/SouthPlus%20%E5%8D%97%E5%8A%A0%E5%9F%9F%E5%90%8D%E8%B7%B3%E8%BD%AC%20%E7%AE%80%E5%8D%95%20%E6%9C%89%E6%95%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认目标域名
    const defaultTarget = "www.south-plus.net";
    // 从设置中读取目标域名
    let targetDomain = GM_getValue("targetDomain", defaultTarget);

    // 注册菜单命令，允许用户修改目标域名
    GM_registerMenuCommand("设置跳转目标域名", () => {
        const newTarget = prompt("请输入新的目标域名（例如：www.south-plus.net）：", targetDomain);
        if (newTarget && newTarget.trim()) {
            GM_setValue("targetDomain", newTarget.trim());
            alert(`目标域名已更新为：${newTarget.trim()}\n刷新页面以生效。`);
        }
    });

    const currentDomain = window.location.hostname;

    // 如果当前域名不是目标域名，则跳转
    if (currentDomain !== targetDomain) {
        const newUrl = window.location.href.replace(currentDomain, targetDomain);
        window.location.replace(newUrl);
    }

})();
