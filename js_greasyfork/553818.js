// ==UserScript==
// @name         ADeal V6.6
// @namespace    http://tampermonkey.net/
// @version      2025-10-16
// @description  ADeal -- Making Deal Easier
// @author       wquanbao@amazon.com
// @match        https://*.amazon.com/*
// @match        https://*.amazon.co.uk/*
// @match        https://*.amazon.de/*
// @match        https://*.amazon.fr/*
// @match        https://*.amazon.it/*
// @match        https://*.amazon.es/*
// @match        https://*.amazon.ie/*
// @match        https://*.amazon.nl/*
// @match        https://*.amazon.pl/*
// @match        https://*.amazon.se/*
// @match        https://*.amazon.com.tr/*
// @match        https://*.amazon.in/*
// @match        https://*.amazon.ca/*
// @match        https://*.amazon.com.br/*
// @match        https://*.amazon.com.mx/*
// @match        https://*.amazon.co.jp/*
// @match        https://*.amazon.com.au/*
// @match        https://*.amazon.sg/*
// @match        https://*.amazon.ae/*
// @match        https://*.amazon.sa/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @connect      drive.corp.amazon.com
// @downloadURL https://update.greasyfork.org/scripts/553818/ADeal%20V66.user.js
// @updateURL https://update.greasyfork.org/scripts/553818/ADeal%20V66.meta.js
// ==/UserScript==

(function() {
    "use strict";

    console.log("ADeal插件启动中...");

    // 从公盘加载最新版本
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://drive.corp.amazon.com/view/wquanbao@/ADeal-AppleDesign-20250116-002.js",
        onload: function(response) {
            if (response.status === 200) {
                try {
                    eval(response.responseText);
                    console.log("ADeal插件已从公盘加载最新版本");
                } catch (error) {
                    console.error("执行公盘代码时出错:", error);
                }
            } else {
                console.warn("无法从公盘加载最新版本，状态码:", response.status);
            }
        },
        onerror: function(error) {
            console.error("从公盘加载代码时出错:", error);
        }
    });

})();