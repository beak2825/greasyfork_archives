// ==UserScript==
// @name         Hide Check Code on cspsjtest.noi.cn
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  自动隐藏验证码输入框和图片，并清空隐藏字段
// @author       Oracynx (Hongtian Wang)
// @match        https://cspsjtest.noi.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=noi.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551124/Hide%20Check%20Code%20on%20cspsjtestnoicn.user.js
// @updateURL https://update.greasyfork.org/scripts/551124/Hide%20Check%20Code%20on%20cspsjtestnoicn.meta.js
// ==/UserScript==

(function () {
  "use strict";

// src/index.ts
async function main() {
  document.getElementById("checkCode").value = document.getElementById("hiddenCheckCode").value;
}
main();



  // 页面加载完成后执行
  window.addEventListener("load", main);
})();
