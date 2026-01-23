// ==UserScript==
// @name         哔哩哔哩去除动态页up头像悬浮介绍框（fix）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除烦人的介绍框框
// @author       Yesaye
// @match        *://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563610/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%BB%E9%99%A4%E5%8A%A8%E6%80%81%E9%A1%B5up%E5%A4%B4%E5%83%8F%E6%82%AC%E6%B5%AE%E4%BB%8B%E7%BB%8D%E6%A1%86%EF%BC%88fix%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/563610/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%BB%E9%99%A4%E5%8A%A8%E6%80%81%E9%A1%B5up%E5%A4%B4%E5%83%8F%E6%82%AC%E6%B5%AE%E4%BB%8B%E7%BB%8D%E6%A1%86%EF%BC%88fix%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML +=
        '.bili-user-profile {' +
        'opacity: 0 !important;' +
        '}';
    document.getElementsByTagName("body")[0].appendChild(style)

    let p = document.getElementsByClassName("bili-user-profile");

    if(p && p.length>0){
        p[0].remove();
    } else {
        let t = setInterval(()=>{
            p = document.getElementsByClassName("bili-user-profile");
            if(p && p.length>0){
                p[0].remove();
                clearInterval(t);
                console.log("去除头像介绍悬浮框成功");
            }
        },100);
    }

})();