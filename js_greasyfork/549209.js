// ==UserScript==
// @name         BWP_BOMS_Plugin
// @description  Script created at 2025-01-17 23:34:15 Customize and modify BWP pages
// @author       LIBRA.WONG
// @match       *://10.0.0.118/B2*
// @match       *://hznmfw.com/*
// @license     MIT
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @version     0.0.3
// @namespace https://greasyfork.org/users/928778
// @downloadURL https://update.greasyfork.org/scripts/549209/BWP_BOMS_Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/549209/BWP_BOMS_Plugin.meta.js
// ==/UserScript==

// *** 本段可以整段删掉, 出库单选择在BWP桌面就可以弹出
(function() {
    // @require     https://wo1.cc/plugin/monkey.js
    // 禁用缓存
    // const url = "http://localhost:5500/web/script/monkey.js?nocache=" + Date.now(); // 本地测试
    const url = "http://10.0.0.200/web/script/monkey.js?nocache=" + Date.now(); // 内网部署
    const script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
})();
// *** 本段可以整段删掉, 出库单选择在BWP桌面就可以弹出

