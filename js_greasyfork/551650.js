// ==UserScript==
// @name YT插入推薦隱藏
// @namespace https://greasyfork.org/zh-TW/users/4839
// @version 1.0.0
// @description YT的embed插入影片元素，隱藏推薦影片
// @author leadra
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.youtube-nocookie.com/embed/*
// @match https://www.youtube.com/embed/*
// @downloadURL https://update.greasyfork.org/scripts/551650/YT%E6%8F%92%E5%85%A5%E6%8E%A8%E8%96%A6%E9%9A%B1%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/551650/YT%E6%8F%92%E5%85%A5%E6%8E%A8%E8%96%A6%E9%9A%B1%E8%97%8F.meta.js
// ==/UserScript==

(function() {
let css = `
      .ytp-pause-overlay{display:none!important;}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
