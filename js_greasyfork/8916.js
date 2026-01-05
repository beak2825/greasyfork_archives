// ==UserScript==
// @name        sgamer_1
// @namespace   bbs.sgamer
// @description 资料卡添加备注(还未实现)，隐藏勋章(显示6个)
// @include     http://bbs.sgamer.com/thread-*
// @version     1.0.0
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @license     GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html)
// @updateUrl   $URL$
// @downloadURL https://update.greasyfork.org/scripts/8916/sgamer_1.user.js
// @updateURL https://update.greasyfork.org/scripts/8916/sgamer_1.meta.js
// ==/UserScript==

function sign(){
	var $ = unsafeWindow.$ || function (e){return document.getElementById(e);};
	var postlist = document.getElementById('postlist');
	var postNodes = postlist.childNodes;
}

(function hide_medal() {
	GM_addStyle(".md_ctrl {\
    display: block !important;\
    max-height: 100px !important;\
    overflow: hidden;\
}");
})()
