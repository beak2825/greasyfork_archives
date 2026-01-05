// ==UserScript==
// @id             zhidao.baidu.com@scriptish
// @name           BaiDu_ZhiDao_Helper
// @version        0.1
// @namespace      zhidao.baidu.com@scriptish
// @include        http://zhidao.baidu.com/question/*
// @run-at         document-end
// @author         zklhp
// @description    Press Ctrl+Enter to submit answers in BaiDu ZhiDao.
// @downloadURL https://update.greasyfork.org/scripts/777/BaiDu_ZhiDao_Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/777/BaiDu_ZhiDao_Helper.meta.js
// ==/UserScript==

setInterval(function () {
	btn = document.querySelector("a.btn.btn-32-green.grid-r");

	var f = function (e)
	{
		if (e.keyCode == 13 && e.ctrlKey)
		{
			//Ctrl+Enter
			btn.click();
		}
	};
	window.addEventListener("keypress", f, true);
	document.getElementById("ueditor_0").contentWindow.addEventListener("keypress", f, true);
	}, 1000);
