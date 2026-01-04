// ==UserScript==
// @name         知乎Enhance
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  关闭登录提示、跳转链接直接跳转、缩小顶部导航栏范围
// @author       jiang
// @match        https://*.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @license		 GPL-3.0
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/551776/%E7%9F%A5%E4%B9%8EEnhance.user.js
// @updateURL https://update.greasyfork.org/scripts/551776/%E7%9F%A5%E4%B9%8EEnhance.meta.js
// ==/UserScript==
// 1. 关闭登录提示
// 2. 跳转链接直接跳转
// 3. 缩小顶部导航栏范围(解决屏幕过小时导航栏溢出的问题)
/* global $ */
function runV0_0_1() {
  closeLoginModal();
  var ci = setInterval(() => {
    closeLoginModal();
  }, 200);
  setTimeout(() => {
    clearInterval(ci);
  }, 3e3);
  function closeLoginModal() {
    var btn = document.querySelector("Button.Modal-closeButton");
    if (btn) {
      btn.click();
      clearInterval(ci);
    }
  }
  continueVisit();
  var vi = setInterval(() => {
    continueVisit();
  }, 200);
  setTimeout(() => {
    clearInterval(vi);
  }, 3e3);
  function continueVisit() {
    var a = document.querySelector("a.button");
    if (a && a.innerText === "继续访问") {
      a.click();
      clearInterval(vi);
    }
  }
}
async function navModify() {
  const style = `
@media screen and (max-width:1100px){
    .zhihu-enhance-app-header{
        margin-left: 0px
    }
}`;
  GM_addStyle(style);
  const header = $(".AppHeader>div");
  console.log("================", header);
  header.css("width", "1000px");
  header.addClass("zhihu-enhance-app-header");
}
(async function() {
  runV0_0_1();
  navModify();
})();
