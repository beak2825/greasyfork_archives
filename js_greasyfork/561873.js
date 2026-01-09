// ==UserScript==
// @name         GitHub 重定向到镜像站
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  自动将 GitHub 原始链接重定向到镜像站，解决墙内无法访问 GitHub 的问题
// @author       未知作者
// @license       MIT
// @match        https://github.com/*
// @match        http://github.com/*
// @grant        none
// @redirectURL  https://bgithub.xyz/%URL%
// @downloadURL https://update.greasyfork.org/scripts/561873/GitHub%20%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E9%95%9C%E5%83%8F%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/561873/GitHub%20%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E9%95%9C%E5%83%8F%E7%AB%99.meta.js
// ==/UserScript==

// 脚本核心：拦截页面加载并执行重定向
(function() {
    'use strict';
    // 获取当前完整 URL（包括路径和查询参数）
    const currentUrl = window.location.href;
    // 将 github.com 替换为 bgithub.xyz
    const targetUrl = currentUrl.replace('github.com', 'bgithub.xyz');
    // 执行重定向
    window.location.href = targetUrl;
})();