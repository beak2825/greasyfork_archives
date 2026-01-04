// ==UserScript==
// @name         TheOldReader 增强
// @namespace    n9cv0dw5tm4sq9imh1rzfaeh13jg35qp
// @version      2025.11.20
// @description  一些增强型的功能。
// @author       me
// @match        https://theoldreader.com/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/556316/TheOldReader%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/556316/TheOldReader%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //消灭侵入式广告
    setInterval(()=>{
        document.querySelectorAll('#in-feed-ad-container:not([adcheck="1"]),#tor-in-feed-ad-container:not([adcheck="1"])').forEach(ele=>{
            ele.setAttribute("style", "position: fixed; top:1px; left: 1px; height: 1px !important; width:1px !important; overflow: hidden; display: block;");
            ele.setAttribute("adcheck","1");
        });
    }, 1500);
    //end 消灭侵入式广告
})();