// ==UserScript==
// @name         堆糖删除登录提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除登录框元素
// @author       Leon
// @license      Copyright © 2025 Leon. All rights reserved.
// @match        https://www.duitang.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duitang.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556790/%E5%A0%86%E7%B3%96%E5%88%A0%E9%99%A4%E7%99%BB%E5%BD%95%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/556790/%E5%A0%86%E7%B3%96%E5%88%A0%E9%99%A4%E7%99%BB%E5%BD%95%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function(){
        let a = document.getElementsByClassName('blockUI');
        if(a) {
            for(let i=0; i<a.length; i++) {
                a[i].remove();
            }
        }
    }, 700);
})();