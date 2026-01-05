// ==UserScript==
// @name         Bilibili 收藏夹取消侧栏滚动
// @namespace    aspi-rin
// @version      0.1
// @description  展开“我创建的收藏夹”侧栏
// @author       aspi-rin
// @match        https://space.bilibili.com/*/favlist*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559086/Bilibili%20%E6%94%B6%E8%97%8F%E5%A4%B9%E5%8F%96%E6%B6%88%E4%BE%A7%E6%A0%8F%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/559086/Bilibili%20%E6%94%B6%E8%97%8F%E5%A4%B9%E5%8F%96%E6%B6%88%E4%BE%A7%E6%A0%8F%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    .fav-collapse-wrap {
      max-height: none !important;
      overflow-y: visible !important;
      overflow-x: visible !important;
    }
  `);
})();
