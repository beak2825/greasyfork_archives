// ==UserScript==
// @name         纽约客查看更多
// @namespace    https://github.com/gui-ying233/MoreFreeTNY
// @version      1.0.0
// @description  去除纽约客的订阅提示并显示更多内容（不一定能完全显示）
// @author       鬼影233
// @license      MIT
// @match        https://www.newyorker.com/*
// @icon         https://www.newyorker.com/verso/static/thenewyorker-us/assets/favicon.ico
// @supportURL   https://github.com/gui-ying233/MoreFreeTNY/issues
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556140/%E7%BA%BD%E7%BA%A6%E5%AE%A2%E6%9F%A5%E7%9C%8B%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/556140/%E7%BA%BD%E7%BA%A6%E5%AE%A2%E6%9F%A5%E7%9C%8B%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(() => {
	"use strict";
	const originalRemove = Element.prototype.remove;
	Element.prototype.remove = function (...args) {
		if (this.tagName === "FIGURE" || this.classList.contains("paywall") || this.querySelector(".paywall, figure")) return;
		return originalRemove.apply(this, args);
	};
	document.head.appendChild(
		Object.assign(document.createElement("style"), {
			textContent:
				'.journey-unit__container{display:none}',
		})
	);
})();
