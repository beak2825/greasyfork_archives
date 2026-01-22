// ==UserScript==
// @name Instagram 2014 Fix
// @namespace l-d
// @version 1
// @description Super simple style to fix some significant bugs on the Instagram 2014 script to improve user experience :3
// @author loca-death
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/563513/Instagram%202014%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/563513/Instagram%202014%20Fix.meta.js
// ==/UserScript==

(function() {
let css = `.xsag5q8.x2vl965.x1onr9mi {
    display: none !important
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
