// ==UserScript==
// @name www.roblox.com/my/avatar
// @namespace github.com/openstyles/stylus
// @version 1.0
// @description A new userstyle
// @author Me
// @grant GM_addStyle
// @run-at document-start
// @match https://www.roblox.com/my/avatar*
// @downloadURL https://update.greasyfork.org/scripts/551302/wwwrobloxcommyavatar.user.js
// @updateURL https://update.greasyfork.org/scripts/551302/wwwrobloxcommyavatar.meta.js
// ==/UserScript==

(function() {
let css = `
  [data-internal-page-name="Avatar"] .breadcrumb-container {
    display: none!important;
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
