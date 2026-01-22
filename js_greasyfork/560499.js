// ==UserScript==
// @name         快速跳过提示
// @namespace    https://docs.scriptcat.org/
// @version      0.1.1
// @license      MIT
// @description  快速跳过爱奇艺"关闭拦截插件并刷新页面"的倒计时提示
// @author       Feny
// @match        https://www.iqiyi.com/*
// @icon         https://www.iqiyi.com/favicon.ico
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560499/%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BF%87%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/560499/%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BF%87%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const nativeSetInterval = unsafeWindow.setInterval;
  unsafeWindow.setInterval = function (callback, delay) {
    const include = callback.toString().includes("showBlackScreen");
    return nativeSetInterval.call(this, callback, include ? 5 : delay);
  };
})();
