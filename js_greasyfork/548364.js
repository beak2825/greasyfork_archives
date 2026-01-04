// ==UserScript==
// @name         mteam变大图
// @namespace    http://tampermonkey.net/
// @version      2025-09-04
// @description  mteam变2大图2
// @author       You
// @match        https://zp.m-team.io/browse/adult*
// @match        https://zp.m-team.io/showcaseDetail*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=m-team.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548364/mteam%E5%8F%98%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/548364/mteam%E5%8F%98%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log("Script running on: " + window.location.href);
    // 添加CSS样式来修改缩略图高度
    const style = document.createElement('style');
    style.textContent = `
        .ant-image .torrent-list__thumbnail {
            height: 350px !important;
            width: auto !important;
            min-width: unset !important;
            max-width: none !important;
        }
    `;
    document.head.appendChild(style);
    

})();