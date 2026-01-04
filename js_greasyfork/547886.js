// ==UserScript==
// @name         洛杉矶时报查看更多
// @namespace    https://github.com/gui-ying233/MoreFreeLAT
// @version      1.0.0
// @description  去除洛杉矶时报的订阅提示并显示更多内容（不一定能完全显示）以及去除选取限制
// @author       鬼影233
// @license      MIT
// @match        https://www.latimes.com/*
// @icon         https://www.latimes.com/favicon.png
// @supportURL   https://github.com/gui-ying233/MoreFreeLAT/issues
// @downloadURL https://update.greasyfork.org/scripts/547886/%E6%B4%9B%E6%9D%89%E7%9F%B6%E6%97%B6%E6%8A%A5%E6%9F%A5%E7%9C%8B%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/547886/%E6%B4%9B%E6%9D%89%E7%9F%B6%E6%97%B6%E6%8A%A5%E6%9F%A5%E7%9C%8B%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(() => {
	"use strict";
	document.head.appendChild(
		Object.assign(document.createElement("style"), {
			textContent:
				"modality-custom-element,.met-sub-link{display:none}body{overflow:initial!important}.subscriber-content:not(#MoreFreeLAT){display:initial!important}body.met-panel-open{user-select:initial;-moz-user-select:initial;-webkit-user-select:initial;-ms-user-select:initial}",
		})
	);
})();
