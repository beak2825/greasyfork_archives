// ==UserScript==
// @name         微信读书快捷键
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  直接找到button会出现由于放大缩小页面导致上一页按钮无法成功按到，由于动态加载的问题，只能通过上级div拿到button;j上一页，k下一页；需要打开允许油猴允许js脚本权限
// @author       七夕不起早
// @match        https://weread.qq.com/web/reader/*
// @icon         https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/favicon/favicon_16h.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549112/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/549112/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function () {
  "use strict";

    document.addEventListener("keydown", (e) => {
      // jk翻页
      if (e.code === "KeyK") {
        const nextPageBtn = document.querySelector(".renderTarget_pager>div:last-child>button");
        if (nextPageBtn) nextPageBtn.click();
      } else if (e.code === "KeyJ") {
        const prevPageBtn = document.querySelector(".renderTarget_pager>div:first-child>button");
        if (prevPageBtn) prevPageBtn.click();
      }
    });
})();




