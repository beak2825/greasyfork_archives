// ==UserScript==
// @name         移除宝书友中轮播h视频
// @namespace    http://tampermonkey.net/
// @version      2025-09-15
// @description  移除宝书友中轮播h视频1
// @author       You
// @match        https://www.baoshuyou.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549599/%E7%A7%BB%E9%99%A4%E5%AE%9D%E4%B9%A6%E5%8F%8B%E4%B8%AD%E8%BD%AE%E6%92%ADh%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/549599/%E7%A7%BB%E9%99%A4%E5%AE%9D%E4%B9%A6%E5%8F%8B%E4%B8%AD%E8%BD%AE%E6%92%ADh%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let num = 1
     function watch () {
        const el = document.querySelector('.module.cl.slidebox')
        if (el) {
            el.remove()
            return
        }
         if (num > 10) return
        setTimeout(() => {
            num++
            watch()
        }, 1000)
     }
    // Your code here...
})();