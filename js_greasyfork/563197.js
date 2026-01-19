// ==UserScript==
// @name         绕过国家传染病预警系统客户端检测
// @version      1.2.3
// @description  伪造 nw 环境以绕过 infDiseaseAdvance.html 的客户端检测
// @match        *://59.211.236.123:8881/*
// @run-at       document-start
// @grant        none
// @author       Zhen
// @license      MIT
// @namespace https://greasyfork.org/users/10117
// @downloadURL https://update.greasyfork.org/scripts/563197/%E7%BB%95%E8%BF%87%E5%9B%BD%E5%AE%B6%E4%BC%A0%E6%9F%93%E7%97%85%E9%A2%84%E8%AD%A6%E7%B3%BB%E7%BB%9F%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563197/%E7%BB%95%E8%BF%87%E5%9B%BD%E5%AE%B6%E4%BC%A0%E6%9F%93%E7%97%85%E9%A2%84%E8%AD%A6%E7%B3%BB%E7%BB%9F%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 1. 核心注入：只要 window.nw 存在，原脚本的 try{nw} 就不会报错
    if (!window.nw) {
        window.nw = {}; 
        console.log("核心环境已注入");
    }
 
    // 2. 核心动作：一旦发现页面被清空，说明注入慢了，立即刷新重试
    const observer = new MutationObserver(() => {
        if (document.body && document.body.innerText.includes("请使用国家传染病")) {
            location.reload(); 
        }
    });
 
    observer.observe(document.documentElement, { childList: true, subtree: true });
    
    // 3秒后自动停止监听
    setTimeout(() => observer.disconnect(), 3000);
 
})();