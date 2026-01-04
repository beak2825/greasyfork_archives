// ==UserScript==
// @name         显示电影天堂下载链接
// @version      2.0
// @description  将电影天堂隐藏的下载链接显示出来
// @author       leftshine
// @match        *://*dytt8899.com/i/*
// @icon         https://www.dytt8899.com/favicon.ico
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1544866
// @downloadURL https://update.greasyfork.org/scripts/557985/%E6%98%BE%E7%A4%BA%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/557985/%E6%98%BE%E7%A4%BA%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    "use strict";

    window.addEventListener("load", function () {
        const downlist_dom = document.getElementById("downlist");

        if (downlist_dom) {
            downlist_dom.style.display = "block";
        }
    });
})();