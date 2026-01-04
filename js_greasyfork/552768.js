// ==UserScript==
// @name         电影天堂下载链接显示
// @version      1.3
// @description  电影天堂(dytt8899.com)下载链接被隐藏了，此脚本将显示被隐藏的链接
// @author       星辰游影
// @match        *://*.dytt8899.com/i/*
// @icon         https://www.dytt8899.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/1527324
// @downloadURL https://update.greasyfork.org/scripts/552768/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/552768/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  window.addEventListener("load", () => {
    let downlist_dom = document.getElementById("downlist");

	if (!downlist_dom) {
		console.log("未找到下载列表元素");
		return;
	}
	// 隐藏链接显示
    downlist_dom.style.display = "block";
    //downlist_dom.style.border = "1px solid red";
    console.clear();
    console.log("电影天堂显示链接已生效！");
  });
})();
