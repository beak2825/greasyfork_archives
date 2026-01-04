// ==UserScript==
// @name linux.do - 隐藏首页右侧热门话题
// @namespace https://github.com/utags
// @version 1.0.1
// @description 隐藏首页右侧热门话题与最新回复
// @author Pipecraft
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.linux.do/*
// @match *://*.idcflare.com/*
// @downloadURL https://update.greasyfork.org/scripts/552613/linuxdo%20-%20%E9%9A%90%E8%97%8F%E9%A6%96%E9%A1%B5%E5%8F%B3%E4%BE%A7%E7%83%AD%E9%97%A8%E8%AF%9D%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/552613/linuxdo%20-%20%E9%9A%90%E8%97%8F%E9%A6%96%E9%A1%B5%E5%8F%B3%E4%BE%A7%E7%83%AD%E9%97%A8%E8%AF%9D%E9%A2%98.meta.js
// ==/UserScript==

(function() {
let css = `
    .tc-right-sidebar {
        display: none !important;
    }

    @media screen and (min-width: 767px) {
        .tc-right-sidebar + #list-area {
            width: -webkit-fill-available !important;
        }
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
