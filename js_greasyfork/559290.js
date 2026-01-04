// ==UserScript==
// @name         enable-devtool
// @namespace    http://tampermonkey.net/
// @version      2025-12-18
// @description  解决大部网站打开控制台页面直接重定向或 about:blank 问题
// @author       Mr.Fang
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.google.com
// @grant        unsafeWindow
// @run-at 	 document-start
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/559290/enable-devtool.user.js
// @updateURL https://update.greasyfork.org/scripts/559290/enable-devtool.meta.js
// ==/UserScript==

(function() {
	'use strict'

	const originalAddEventListener = window.addEventListener;

	// 重写 setTimeout ,拦截定时器执行 about:blank 内容
	const originalSetTimeout = unsafeWindow.setTimeout;
	unsafeWindow.setTimeout = function(callback, delay, ...args) {
		let toStr = callback?.toString();
		console.log(toStr)
		if (toStr && toStr.includes('about:blank')) return true; // 自定修改 about:blank 要匹配的内容
		const wrappedCallback = function() {
			callback(...args);  // 也可注释掉此行进行验证
		};
		return originalSetTimeout(wrappedCallback, delay);
	};

	// 重写 setInterval,拦截定时器执行 about:blank 内容
	const originalSetInterval = unsafeWindow.setInterval;
	unsafeWindow.setInterval = function(callback, delay, ...args) {
		let toStr = callback?.toString();
		console.log(toStr)
		if (toStr && toStr.includes('about:blank')) return true; // 自定修改 about:blank 要匹配的内容
		const wrappedCallback = function() {
			callback(...args); // 也可注释掉此行进行验证
		};
		return originalSetInterval(wrappedCallback, delay);
	};



	// 重写 addEventListener 方法
	window.addEventListener = function(type, listener, options) {
		if (type === 'devtoolschange') {
			// 拦截对 devtoolschange 事件的监听，阻止其添加
			console.log("拦截了添加“devtoolschange”侦听器的尝试.");
			return;
		}
		// 对其他事件，使用原始方法进行添加
		originalAddEventListener.call(window, type, listener, options);
	};

	// 如果已经存在的监听器需要移除
	const originalRemoveEventListener = window.removeEventListener;
	window.removeEventListener = function(type, listener, options) {
		if (type === 'devtoolschange') {
			// 拦截对 devtoolschange 事件监听的移除
			console.log("拦截了删除“devtoolschange”侦听器的尝试.");
			return;
		}
		// 对其他事件，使用原始方法进行移除
		originalRemoveEventListener.call(window, type, listener, options);
	};
	
	// 监听开发者窗口改变
	window.addEventListener("devtoolschange", event => {
		console.log('阻止')
		event.preventDefault();
		return
	});
	
	// 监听离开当前页面，例如使用 window.location.href
	window.addEventListener("beforeunload", function(event) {
		// 在用户尝试离开页面时执行你的逻辑
		// 例如：
		event.preventDefault();
		console.log('阻止');
		return
		// event.returnValue = ""; // 兼容老版本浏览器
		// return ""; // 兼容新版本浏览器
		// 或者显示一个警告框
		// return "您确定要离开吗？";
	});
})();