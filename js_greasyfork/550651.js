// ==UserScript==
// @name         下载更清晰点
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2025-09-24
// @description  替换图片链接&让图片变大
// @author       xiase
// @match        https://*.shein.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shein.com
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/550651/%E4%B8%8B%E8%BD%BD%E6%9B%B4%E6%B8%85%E6%99%B0%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/550651/%E4%B8%8B%E8%BD%BD%E6%9B%B4%E6%B8%85%E6%99%B0%E7%82%B9.meta.js
// ==/UserScript==

window.onload = (() => {
    'use strict';
	// Your code here...
	/** 在这里编写你的CSS代码
	.common-reviews-new__middle-img .common-reviews__list-item-pic .pic-item {
		height: 200px !important;
		line-height: 148px !important;
		width: 200px !important;
	}**/


    GM_addStyle(".common-reviews-new__middle-img,.common-reviews__list-item-pic,.pic-item{height: 200px !important;width: 200px !important;}")

	var a = unsafeWindow.document.getElementsByClassName("common-reviews__list j-expose__common-reviews__list")[0];

	function fkLink(e) {
		var t = e.target;
		if (t.classList.contains("j-review-img")){
			console.log(e)
			var src = t.src.split("_");
			if (src.length >= 2) t.src = src[0].concat(".webp")
		}
	}

	a.onclick = fkLink;

	a.oncontextmenu = fkLink;
});