// ==UserScript==
// @name Sample UserCSS Greasy Fork
// @namespace https://greasyfork.org/users/ahi/sample-usercss
// @version 1.0.0
// @description UserCSS mẫu đầy đủ metadata, hợp lệ khi đăng Greasy Fork
// @author Ahi
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.*/*
// @downloadURL https://update.greasyfork.org/scripts/561165/Sample%20UserCSS%20Greasy%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/561165/Sample%20UserCSS%20Greasy%20Fork.meta.js
// ==/UserScript==

(function() {
let css = `

    /* Code CSS thực thi */
    body {
        outline: 0 !important;
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
