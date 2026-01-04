// ==UserScript==
// @name         海角社区
// @namespace    https://gqkp.yidajichang.top
// @version      1.0.2
// @description  屏蔽海角社区广告
// @author       monkeys
// @match        *://*/videoplay/*
// @match        *://*/post/details/*
// @match        *://*.haijiao.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561114/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/561114/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function removeAds() {
        const adElement1 = document.querySelectorAll('.page-container')
        const adElement2 = document.querySelectorAll('.containeradvertising');
        const adElement3 = document.querySelectorAll('.van-overlay');
        const adElement4 = document.querySelectorAll('.topbanmer');
        const adElement5 = document.querySelectorAll('.bannerliststyle');
        const adElement6 = document.querySelector('.html-box');
        const adElement7 = document.querySelector('.html-bottom-box');
        const adElement8 = document.querySelector('.custom_carousel');
        if (adElement1 || adElement2 || adElement3 || adElement4 || adElement5 || adElement6 || adElement7 || adElement8) {
            adElement1.forEach(element => {
                element.remove(); });
            adElement2.forEach(element => {
                element.remove(); });
            adElement3.forEach(element => {
                element.remove(); });
            adElement4.forEach(element => {
                element.remove(); });
            adElement5.forEach(element => {
                element.remove(); });
            adElement6.classList.remove("ishide");
            adElement8.remove();
        } else {
            clearInterval(adCheckTimer);
        }
    }
    // 每5秒检查一次
    const adCheckTimer = setInterval(removeAds,5000);

    window.addEventListener('beforeunload', () => {
        clearInterval(adCheckTimer);
    });

})();