// ==UserScript==
// @name           MaxWidth for WikiPedia
// @author         h.zhuang
// @version       1.1
// @description    It will set a max width of wikipedia for better readibility.
// @namespace      wikipedia.org
// @include       http://wikipedia.org/*
// @include      https://wikipedia.org/*
// @include       http://*.wikipedia.org/*
// @include       https://*.wikipedia.org/*
// @grant GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/6520/MaxWidth%20for%20WikiPedia.user.js
// @updateURL https://update.greasyfork.org/scripts/6520/MaxWidth%20for%20WikiPedia.meta.js
// ==/UserScript==

(function() {var css = "";
	css += ["#content,#bodyContent {max-width:760px !important;} \
	#mw-content-text {max-width:680px !important;}\
            .mw-body {max-width:999px !important;}\
p {max-width:50em !important;}"
		].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
