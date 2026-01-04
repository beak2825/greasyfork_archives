// ==UserScript==
// @name         ASOBI TICKET 姓名修改器公开版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  防刷新，自动更改asobi票面姓名和生日，并且更换右侧个人信息栏的姓名。
// @author       Sallyn
// @match        *://asobiticket2.asobistore.jp/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556169/ASOBI%20TICKET%20%E5%A7%93%E5%90%8D%E4%BF%AE%E6%94%B9%E5%99%A8%E5%85%AC%E5%BC%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/556169/ASOBI%20TICKET%20%E5%A7%93%E5%90%8D%E4%BF%AE%E6%94%B9%E5%99%A8%E5%85%AC%E5%BC%80%E7%89%88.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const newName = '大崎 甘奈';
    const newDate = '2004年12月25日';
 
    // 替换函数，现在包含三条规则
    const performReplacement = () => {
        // --- 1. 替换“申込者”姓名 ---
        const applicantNameElement = document.evaluate(
            "//div[contains(@class, 'label') and contains(., '申込者')]/following-sibling::div[1]//*[contains(@class, 'value-main')]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
 
        if (applicantNameElement && applicantNameElement.textContent.trim() !== newName) {
            console.log('Tampermonkey: Found name element via "申込者". Replacing...');
            applicantNameElement.textContent = newName;
        }
 
        // --- 2. 替换“生年月日” ---
        const dateValueElement = document.evaluate(
            "//div[contains(@class, 'label') and contains(., '生年月日')]/following-sibling::div[1]//*[contains(@class, 'value-main')]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
 
        if (dateValueElement && dateValueElement.textContent.trim() !== newDate) {
            console.log('Tampermonkey: Found date element via "生年月日". Replacing...');
            dateValueElement.textContent = newDate;
        }
 
        // --- 3. 【新增】替换账户信息栏的姓名 ---
        // 直接通过 'account-info-name-content' class 定位
        const accountNameElement = document.querySelector('.account-info-name-content');
 
        if (accountNameElement && accountNameElement.textContent.trim() !== newName) {
            console.log('Tampermonkey: Found account info name. Replacing...');
            accountNameElement.textContent = newName;
        }
    };
 
    // --- 监控页面动态变化 (逻辑不变) ---
    const observer = new MutationObserver(() => {
        performReplacement();
    });
 
    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        // 页面加载后也立即执行一次
        performReplacement();
    });
 
})();