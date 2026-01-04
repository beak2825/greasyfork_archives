// ==UserScript==
// @name         商业内幕查看更多
// @namespace    https://github.com/gui-ying233/MoreFreeBI
// @version      1.0.0
// @description  去除商业内幕的订阅提示并显示更多内容（不一定能完全显示）
// @author       鬼影233
// @license      MIT
// @match        https://www.businessinsider.com/*
// @icon         https://www.businessinsider.com/public/assets/BI/US/favicons/favicon.svg
// @supportURL   https://github.com/gui-ying233/MoreFreeBI/issues
// @downloadURL https://update.greasyfork.org/scripts/548075/%E5%95%86%E4%B8%9A%E5%86%85%E5%B9%95%E6%9F%A5%E7%9C%8B%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/548075/%E5%95%86%E4%B8%9A%E5%86%85%E5%B9%95%E6%9F%A5%E7%9C%8B%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(() => {
	"use strict";
	document.head.appendChild(
		Object.assign(document.createElement("style"), {
			textContent:
				".pw-active,.inline-backup-paywall{display:none!important}.post-summary-bullets,.post-body-content{display:initial!important}",
		})
	);
})();
