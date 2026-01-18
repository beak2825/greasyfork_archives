// ==UserScript==
// @name         跳过优酷广告
// @namespace    http://tampermonkey.net/
// @version      2026-01-17
// @description  优酷视频广告优化
// @author       You
// @match        *://*.youku.com/*
// @icon         https://img.alicdn.com/imgextra/i1/O1CN01180Rqd1u3Lo8PdgSs_!!6000000005981-55-tps-213-72.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563023/%E8%B7%B3%E8%BF%87%E4%BC%98%E9%85%B7%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/563023/%E8%B7%B3%E8%BF%87%E4%BC%98%E9%85%B7%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const style = document.createElement('style');
  document.head.appendChild(style);
  style.textContent = `
    /* 广告中间弹窗 */
    #youku-pause-container {
      display: none !important;
    }
    /* 为你推荐 */
    .bottom-container {
      display: none !important;
    }
    /* 周边视频 */
    .surround-wrap {
      display: none !important;
    }
    /* 历史顶部广告 */
    .historyrecord_adwrap {
      display: none !important;
    }
  `;
})();
