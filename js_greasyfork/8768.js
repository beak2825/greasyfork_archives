// ==UserScript==
// @name         爱淘宝跳转
// @namespace    http://liuzhixin.net/
// @version      0.2
// @description  JumpAitaobao。跳过爱淘宝，爱淘宝页面自动跳转。2015.6.20，按原网页按钮名称更新。
// @author       lzx
// @match        http://ai.taobao.com/*
// @grant        everyone
// @downloadURL https://update.greasyfork.org/scripts/8768/%E7%88%B1%E6%B7%98%E5%AE%9D%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/8768/%E7%88%B1%E6%B7%98%E5%AE%9D%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

window.open(document.getElementsByClassName("right-btn")[0].href,"_self");
window.open(document.getElementsByClassName("featured-btn")[0].href,"_self");