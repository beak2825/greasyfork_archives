// ==UserScript==
// @name          Mefi Endarkener
// @namespace     http://userstyles.org
// @description	  Improves the contrast of www.metafilter.com (the blue), ask.metafilter.com (the green), and metatalk.metafilter.com (the gray). This script exclusively works with the Modern theme in Dark Mode. 
// @author        almostmanda, but edited from b0at
// @include       http://www.metafilter.com/*
// @include       https://www.metafilter.com/*
// @include       http://*.www.metafilter.com/*
// @include       https://*.www.metafilter.com/*
// @include       http://ask.metafilter.com/*
// @include       https://ask.metafilter.com/*
// @include       http://*.ask.metafilter.com/*
// @include       https://*.ask.metafilter.com/*
// @include       http://metatalk.metafilter.com/*
// @include       https://metatalk.metafilter.com/*
// @include       http://*.metatalk.metafilter.com/*
// @include       https://*.metatalk.metafilter.com/*
// @run-at        document-start
//
// @version 0.0.1.20150626163207
// @downloadURL https://update.greasyfork.org/scripts/5583/Mefi%20Endarkener.user.js
// @updateURL https://update.greasyfork.org/scripts/5583/Mefi%20Endarkener.meta.js
// ==/UserScript==
(function() {
var css = "";
if (false || (document.domain == "www.metafilter.com" || document.domain.substring(document.domain.indexOf(".www.metafilter.com") + 1) == "www.metafilter.com"))
	css += "body.subsite-metafilter.dark-mode .content, body.subsite-metafilter.dark-mode .post-text { background: #002133 !important; }";
if (false || (document.domain == "ask.metafilter.com" || document.domain.substring(document.domain.indexOf(".ask.metafilter.com") + 1) == "ask.metafilter.com"))
	css += "body.subsite-askmefi.dark-mode .content, body.subsite-askmefi.dark-mode .post-text { background: #192819 !important; }\n\n  div.comments.best,\n  div.comments.bestleft {\n    background: transparent !important;\n  }\n\n  div.comments.best     { outline: thick solid rgb(94, 126, 98) !important; }\n  div.comments.bestleft { border-left: thick dotted rgb(94, 126, 98) !important; }\n\n  div.tags,\n  div.darker {\n    background: rgb(33, 52, 35) !important;\n  }";
if (false || (document.domain == "metatalk.metafilter.com" || document.domain.substring(document.domain.indexOf(".metatalk.metafilter.com") + 1) == "metatalk.metafilter.com"))
	css += "body.subsite-metatalk.dark-mode .content, body.subsite-metatalk.dark-mode .post-text { background: #222 !important; }";
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