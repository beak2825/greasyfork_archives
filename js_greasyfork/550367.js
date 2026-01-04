// ==UserScript==
// @name                【自用】南+镜像地址统一跳转
// @name:en             South-Plus Mirror Redirector
// @icon                https://www.south-plus.net/favicon.ico
// @namespace           https://greasyfork.org/users/1215910
// @version             1.0
// @description         自动将 South-Plus 的多个镜像地址跳转到指定的官方地址 (www.south-plus.net)，并保留原路径和参数。
// @description:en      Automatically redirects all South-Plus mirror sites to the canonical one (www.south-plus.net), preserving the full path and query.
// @author              诉语
// @match               https://*.east-plus.net/*
// @match               https://east-plus.net/*
// @match               https://*.south-plus.net/*
// @match               https://south-plus.net/*
// @match               https://*.south-plus.org/*
// @match               https://south-plus.org/*
// @match               https://*.white-plus.net/*
// @match               https://white-plus.net/*
// @match               https://*.north-plus.net/*
// @match               https://north-plus.net/*
// @match               https://*.level-plus.net/*
// @match               https://level-plus.net/*
// @match               https://*.soul-plus.net/*
// @match               https://soul-plus.net/*
// @match               https://*.snow-plus.net/*
// @match               https://snow-plus.net/*
// @match               https://*.spring-plus.net/*
// @match               https://spring-plus.net/*
// @match               https://*.summer-plus.net/*
// @match               https://summer-plus.net/*
// @match               https://*.blue-plus.net/*
// @match               https://blue-plus.net/*
// @match               https://*.imoutolove.me/*
// @match               https://imoutolove.me/*
// @grant               none
// @run-at              document-start
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/550367/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E5%8D%97%2B%E9%95%9C%E5%83%8F%E5%9C%B0%E5%9D%80%E7%BB%9F%E4%B8%80%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550367/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E5%8D%97%2B%E9%95%9C%E5%83%8F%E5%9C%B0%E5%9D%80%E7%BB%9F%E4%B8%80%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // --- 在这里设置你希望跳转到的惟一网址的主机名 ---
    const targetHost = 'www.south-plus.net';
    // ----------------------------------------------

    const currentHost = window.location.hostname;

    // 如果当前主机名不是目标主机名，则执行跳转
    if (currentHost !== targetHost) {
        // 构建新的 URL，保留协议、路径、查询参数和哈希值
        const newUrl = `https://${targetHost}${window.location.pathname}${window.location.search}${window.location.hash}`;

        // 使用 replace 进行跳转，这样浏览器的“后退”按钮不会返回到原始镜像页，避免循环跳转
        window.location.replace(newUrl);
    }
})();