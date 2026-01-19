// ==UserScript==
// @name         绕
// @version      1.2.9
// @description  伪造 nw 环境以绕过 infDiseaseAdvance.html 的客户端检测
// @match        *://59.211.236.123:8881/*
// @run-at       document-start
// @inject-into page
// @grant none
// @author       Zhen
// @license      MIT
// @namespace https://greasyfork.org/users/10117
// @downloadURL https://update.greasyfork.org/scripts/563255/%E7%BB%95.user.js
// @updateURL https://update.greasyfork.org/scripts/563255/%E7%BB%95.meta.js
// ==/UserScript==

(function () {
    // 在页面真正 window 作用域里，最早定义 nw
    if (typeof window.nw === "undefined") {
        window.nw = {};
    }
})();