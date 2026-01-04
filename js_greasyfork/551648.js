// ==UserScript==
// @name 69書吧
// @namespace https://greasyfork.org/zh-TW/users/4839-leadra
// @version 1.0.0
// @description 69書吧CSS
// @author leadra
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.69shuba.pro/txt/*
// @match https://69shuba.cx/txt/*
// @downloadURL https://update.greasyfork.org/scripts/551648/69%E6%9B%B8%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/551648/69%E6%9B%B8%E5%90%A7.meta.js
// ==/UserScript==

(function() {
let css = `
	.txtnav{
		font-size:24px;
		line-height:1.3em!important;
		padding:0px 5% 0px 15%!important;
		margin: 0px 0px !important;

	}
	body{
		background:#d0dece;
	}
	header{
		height:5%!important;
	}


	.container {
    margin: 0px 0px !important;
    min-height: 0px !important;
    width: 100% !important;
    max-width: none !important;
  }
  
  .mybox {
    padding: 0px!important;
    margin: 0px!important;
  }
	
	.item-box{display:none;}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
