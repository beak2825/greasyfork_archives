// ==UserScript==
// @name         ZhihuEasy
// @namespace    http://tampermonkey.net/
// @version      2025-09-04
// @description  精简知乎的显示
// @author       Ma1
// @match       https://www.zhihu.com/*
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548335/ZhihuEasy.user.js
// @updateURL https://update.greasyfork.org/scripts/548335/ZhihuEasy.meta.js
// ==/UserScript==
GM_addStyle(`
       .Topstory-container{
         width:auto !important;
         max-width:768px;
       }
       .Topstory-mainColumn > *:not(:last-child) {
         display:none;
       }
       div[data-za-detail-view-path-module="RightSideBar"]{
         display:none !important;
       }
       .Topstory-mainColumn{
         width:98% !important;
         margin-left:0 !important;
         margin-right:0 !important;
       }

  `);
