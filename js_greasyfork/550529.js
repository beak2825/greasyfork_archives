// ==UserScript==
// @name         修复手机浏览器上PC版百度贴吧bug
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  随便试下
// @author       shitianshiwa
// @include      http*://tieba.baidu.com/p/*
// @include      http*://tieba.baidu.com/f?*
// @grant        GM_registerMenuCommand
// @run-at        document-start
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/550529/%E4%BF%AE%E5%A4%8D%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8APC%E7%89%88%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7bug.user.js
// @updateURL https://update.greasyfork.org/scripts/550529/%E4%BF%AE%E5%A4%8D%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8APC%E7%89%88%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7bug.meta.js
// ==/UserScript==
//用try-catch错误处理代替判断链接，只有贴吧主页有展开置顶按钮可以捕捉，贴子里面捉不到，返回为null
//// @require    http://code.jquery.com/jquery-1.11.0.min.js

(function() {
    'use strict';
    // 模拟常见桌面版 UA（Windows Chrome）
    const desktopUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    // 覆盖 UA
    Object.defineProperty(navigator, "userAgent", { get: () => desktopUA });
    Object.defineProperty(navigator, "appVersion", { get: () => desktopUA });
    Object.defineProperty(navigator, "platform", { get: () => "Win32" });
    Object.defineProperty(navigator, "vendor", { get: () => "Google Inc." });
    var $ = unsafeWindow.jQuery; // @grant        不能为none，否则不能用
    //var $ = window.jQuery;
    //捕捉class用.，id对象用#?,$=document.getElementById?
     window.onload =  function () {
            let a = $(".old_style_wrapper");// getby class name
            let b = document.getElementById("ueditor_replace"); 
            if (b != null) {
               b.setAttribute("contenteditable", "true"); 
               b.classList.add("edui-body-container");
            }
     };
})();