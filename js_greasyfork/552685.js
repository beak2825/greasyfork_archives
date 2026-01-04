// ==UserScript==
// @name         推特主页直达（菜单触发）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  点击油猴菜单后弹出输入框，输入Twitter账号ID后打开主页
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/552685/%E6%8E%A8%E7%89%B9%E4%B8%BB%E9%A1%B5%E7%9B%B4%E8%BE%BE%EF%BC%88%E8%8F%9C%E5%8D%95%E8%A7%A6%E5%8F%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552685/%E6%8E%A8%E7%89%B9%E4%B8%BB%E9%A1%B5%E7%9B%B4%E8%BE%BE%EF%BC%88%E8%8F%9C%E5%8D%95%E8%A7%A6%E5%8F%91%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 注册菜单项
  GM_registerMenuCommand("🔗 打开推特主页", function() {
    const id = prompt("请输入推特账号ID（例如：mimmi_sak）");
    if (id) {
      const cleanId = id.replace(/^@/, '').trim();
      window.open("https://x.com/" + cleanId, "_blank");
    }
  });

})();
