// ==UserScript==
// @name        蓝奏云 - 合并下载按钮
// @description 蓝奏云的“电信下载”、“联通下载”和“普通下载”其实是同一个超链接，不如把它们合并成一个下载按钮。
// @namespace   RainSlide
// @author      RainSlide
// @version     1.0
// @license     blessing
// @icon        https://lanzou.com/favicon.ico
// @inject-into page
// @run-at      document-start
// @grant       none
// @match       *://pan.lanzou.com/fn?*
// @match       *://*.lanzoub.com/fn?*
// @match       *://*.lanzoue.com/fn?*
// @match       *://*.lanzouf.com/fn?*
// @match       *://*.lanzouh.com/fn?*
// @match       *://*.lanzoui.com/fn?*
// @match       *://*.lanzouj.com/fn?*
// @match       *://*.lanzoul.com/fn?*
// @match       *://*.lanzoum.com/fn?*
// @match       *://*.lanzouo.com/fn?*
// @match       *://*.lanzoup.com/fn?*
// @match       *://*.lanzouq.com/fn?*
// @match       *://*.lanzout.com/fn?*
// @match       *://*.lanzouu.com/fn?*
// @match       *://*.lanzouv.com/fn?*
// @match       *://*.lanzouw.com/fn?*
// @match       *://*.lanzoux.com/fn?*
// @match       *://*.lanzouy.com/fn?*
// @match       *://*.lanzob.com/fn?*
// @match       *://*.lanzoe.com/fn?*
// @match       *://*.lanzof.com/fn?*
// @match       *://*.lanzoh.com/fn?*
// @match       *://*.lanzoi.com/fn?*
// @match       *://*.lanzoj.com/fn?*
// @match       *://*.lanzol.com/fn?*
// @match       *://*.lanzom.com/fn?*
// @match       *://*.lanzoo.com/fn?*
// @match       *://*.lanzop.com/fn?*
// @match       *://*.lanzoq.com/fn?*
// @match       *://*.lanzot.com/fn?*
// @match       *://*.lanzov.com/fn?*
// @match       *://*.lanzow.com/fn?*
// @match       *://*.lanzox.com/fn?*
// @match       *://*.lanzoy.com/fn?*
// @downloadURL https://update.greasyfork.org/scripts/555071/%E8%93%9D%E5%A5%8F%E4%BA%91%20-%20%E5%90%88%E5%B9%B6%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/555071/%E8%93%9D%E5%A5%8F%E4%BA%91%20-%20%E5%90%88%E5%B9%B6%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

"use strict";

const success = data => {
	const go = document.getElementById("tourl");
	go.textContent = "";

	if (data.zt === 1) {
		go.appendChild(
			Object.assign(
				document.createElement("a"), {
					href: data.dom + "/file/" + data.url,
					rel: "noreferrer",
					className: "txt",
					style: "cursor: pointer",
					textContent: "下载",
				}
			)
		);
	} else {
		go.textContent = "网页超时，请刷新";
	}
};

Object.defineProperty(
	unsafeWindow, "$", {
		configurable: false,
		enumerable: true,
		writable: false,
		value: {
			ajax: settings => jQuery.ajax(Object.assign(settings, { success })),
		},
	},
);
