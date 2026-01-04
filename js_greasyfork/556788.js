// ==UserScript==
// @name         删除OPGG页面底部的脚本提示
// @name:en      Remove the script notification at the bottom of the OPGG page
// @name:en-GB   Remove the script notification at the bottom of the OPGG page
// @name:ko      OP.GG 페이지 하단의 스크립트 알림을 제거합니다
// @name:zh      删除OPGG页面底部的脚本提示
// @name:zh-CN   删除OPGG页面底部的脚本提示
// @name:zh-HK   移除OPGG頁面底部的腳本提示
// @name:zh-MO   移除OPGG頁面底部的腳本提示
// @name:zh-MY   删除OPGG页面底部的脚本提示
// @name:zh-SG   删除OPGG页面底部的脚本提示
// @name:zh-TW   移除OPGG頁面底部的腳本提示
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  删除OPGG页面底部的脚本提示遮挡
// @description:en     Remove the script notification at the bottom of the OPGG page that blocks the view.
// @description:en-GB  Remove the script notification at the bottom of the OPGG page that blocks the view.
// @description:ko     OP.GG 페이지 하단에서 화면을 가리는 스크립트 알림을 제거합니다.
// @description:zh     删除OPGG页面底部的脚本提示遮挡
// @description:zh-CN  删除OPGG页面底部的脚本提示遮挡
// @description:zh-HK  移除OPGG頁面底部的腳本提示遮擋
// @description:zh-MO  移除OPGG頁面底部的腳本提示遮擋
// @description:zh-MY  删除OPGG页面底部的脚本提示遮挡
// @description:zh-SG  删除OPGG页面底部的脚本提示遮挡
// @description:zh-TW  移除OPGG頁面底部的腳本提示遮擋
// @license      Copyright © 2025 Leon. All rights reserved.
// @author       Leon
// @match        https://*.op.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=op.gg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556788/%E5%88%A0%E9%99%A4OPGG%E9%A1%B5%E9%9D%A2%E5%BA%95%E9%83%A8%E7%9A%84%E8%84%9A%E6%9C%AC%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/556788/%E5%88%A0%E9%99%A4OPGG%E9%A1%B5%E9%9D%A2%E5%BA%95%E9%83%A8%E7%9A%84%E8%84%9A%E6%9C%AC%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timer = setInterval(() => {
       const picSrc = 'https://www.gstatic.com/images/icons/material/system/1x/warning_amber_24dp.png';

       let body = document.body;
       let allElements = body.querySelectorAll('*');

       allElements.forEach(element => {
           
           if (element.tagName.toLowerCase() === 'img' && element.src === picSrc) {
               removeGrandparent(element);
               // clearInterval(timer);

           }
       });

       function removeGrandparent(element) {
           if (element?.parentNode?.parentNode) {
               element.parentNode.parentNode.remove();
           }
       }
   }, 1000);
})();