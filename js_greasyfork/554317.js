// ==UserScript==
// @name         连线查看更多
// @namespace    https://github.com/gui-ying233/MoreFreeWired
// @version      1.0.1
// @description  去除连线的订阅提示并显示更多内容（不一定能完全显示）
// @author       鬼影233
// @license      MIT
// @match        https://www.wired.com/*
// @icon         https://www.wired.com/verso/static/wired-us/assets/favicon.ico
// @supportURL   https://github.com/gui-ying233/MoreFreeWired/issues
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554317/%E8%BF%9E%E7%BA%BF%E6%9F%A5%E7%9C%8B%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/554317/%E8%BF%9E%E7%BA%BF%E6%9F%A5%E7%9C%8B%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(() => {
	"use strict";
	const originalRemove = Element.prototype.remove;
	Element.prototype.remove = function (...args) {
		if (
			this.classList.contains("paywall") ||
			this.classList.contains("asset-embed") ||
			this.classList.contains("narrow") ||
			this.querySelectorAll(".paywall,.asset-embed,.narrow")
		)
			return;
		return originalRemove.apply(this, args);
	};
	document.head.appendChild(
		Object.assign(document.createElement("style"), {
			textContent: ".journey-unit__container{display:none}",
		})
	);
})();
