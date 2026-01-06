// ==UserScript==
// @name nicovideo adblock
// @namespace nicovideo adblock pure css by soizo
// @version 1.0.0
// @description nicovideo adblock script
// @author SoizoKtantas
// @license CC BY 4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/561612/nicovideo%20adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/561612/nicovideo%20adblock.meta.js
// ==/UserScript==

(function() {
let css = `#root>div>main>div>div>section>div>div>div>div:has(div[id^="ads"]),
#root>div>main>div>div.bottom_x3.z_docked>div,
#CommonHeader>div>div>div>div.common-header-wb7b82>div.common-header-m5ds7e>div,
#root>div>main>div>div>section>div>div:has(div[id^="ads"]),
[id^="ads"],
.RightSideAdContainer-banner:has(div.Ads > iframe),
.HeaderContainer-ads {
    display: none !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
