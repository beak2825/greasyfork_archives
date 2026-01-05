// ==UserScript==
// @name        BuxVertise - Ad Skipper
// @namespace   BuxVertiseAdSkipper
// @description Skips Ad by...
// @include     http://buxvertise.com/fixedads_surfer.php?*
// @include     http://buxvertise.com/index.php?view=surfer&*
// @include     http://buxvertise.com/?view=surfer&*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8250/BuxVertise%20-%20Ad%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/8250/BuxVertise%20-%20Ad%20Skipper.meta.js
// ==/UserScript==

document.body.getElementsByTagName("IFRAME")[0].previousElementSibling.oncontextmenu=function() {pgl.src="about:blank"; return false;}