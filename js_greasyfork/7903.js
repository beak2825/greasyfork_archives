// ==UserScript==
// @name          Yammer Wider
// @namespace     http://userstyles.org
// @version       2.1
// @description	  Basically a wider central column.
// @author        gerdami
// @homepage      http://userstyles.org/styles/102452
// @include       http://www.yammer.com/*
// @include       https://www.yammer.com/*
// @include       http://*.www.yammer.com/*
// @include       https://*.www.yammer.com/*
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/7903/Yammer%20Wider.user.js
// @updateURL https://update.greasyfork.org/scripts/7903/Yammer%20Wider.meta.js
// ==/UserScript==
(function() {
var css = "body { font-size: 14px !important; }\n\n\n.yj-feed-messages *, #column-one *, #column-three * { font-size: 100% !important; }\n\n\n#network-header { width: 97% !important }\n.page-content { \n    width: 99% !important;\n    margin-top: 10px !important;\n    }\n.three-column-layout { background-position: 17% 0 !important }\n/* LEFT COLUMN */\n   \n/* No need to enlarge left column\n#column-one { width: 15% !important }\n*/\n/* Reduce space between groups */\n.nav-group-link\n    {\n    margin: 0 !important;\n    }\n.nav-group-link .nav-list-link \n    {\n    padding: 6px 2px 5px 6px !important;\n    }\n\n/* CENTRAL COLUMN */\n#column-two {\n    padding-left: 10px !important;\n    width: 80% !important } /* change this if body is pushed down*/ \n\n/* Body header */\n.filecollab-page-header {\n    width: 100% !important;\n    }\n/* Body text */\n.two-column-layout .column-two-left {\n    max-width: 800px !important;\n    width: 75% !important;\n    }\n/* Reduced space between items */\n.yj-thread-list-item {\n    margin-bottom: 10px !important;\n    }\n\n.two-column-layout .yj-selector-right-sidebar {\n    width: 23% !important;\n}\n.yj-selector-right-sidebar .content {\n    padding: 5px !important;\n    margin-bottom: 10px !important;\n    }\n\n/* dotted bottom border to distinguish threads */\n.yj-thread-list-item--reply-publisher\n    {\n   	border-style: solid;\n	border-bottom: thick dotted navy;\n    }\n\n/* 1.0.5 NO SHOUTING PLEASE (Like, Reply, Share buttons) */\n.yj-message-list-item--action-list-item {\n    text-transform: capitalize !important;\n}\n\n/* 1.0.6 Colored Date of first post in thread */\n.yj-thread-starter .yj-message-time \n    {\n    color: navy !important;\n    }\n/* 1.0.7 Colored Date of last post in thread */\nul .yj-thread-replies li:last-child .yj-message-time {color: red !important;}";
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
