// ==UserScript==
// @name linux.do - Rewind 头像动画
// @namespace https://github.com/utags
// @version 1.0.1
// @description 为当前用户添加 Rewind 头像动画。
// @author Pipecraft
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.linux.do/*
// @match *://*.idcflare.com/*
// @downloadURL https://update.greasyfork.org/scripts/557481/linuxdo%20-%20Rewind%20%E5%A4%B4%E5%83%8F%E5%8A%A8%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/557481/linuxdo%20-%20Rewind%20%E5%A4%B4%E5%83%8F%E5%8A%A8%E7%94%BB.meta.js
// ==/UserScript==

(function() {
let css = `
  #toggle-current-user::after {
    width: 48px;
    height: 48px;
    position: absolute;
    left: -4px;
    top: -4px;
    content: '';
    background-image: url(https://linux.do/plugins/discourse-rewind/images/rewind-avatar-2-shimmer.gif);
    display: block;
    background-size: cover;
  }

  .current-user-post .post-avatar .main-avatar::after {
    width: 68px;
    height: 68px;
    position: absolute;
    left: -10px;
    top: -13px;
    content: '';
    background-image: url(https://linux.do/plugins/discourse-rewind/images/rewind-avatar-2-shimmer.gif);
    display: block;
    background-size: cover;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
