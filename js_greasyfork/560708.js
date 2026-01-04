// ==UserScript==
// @name         海大选课助手
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  功能不完善
// @author       Clover Yan
// @match        https://jxgl.hainanu.edu.cn/jsxsd/xsxkkc/getBxxkxx*
// @icon         https://www.hainanu.edu.cn/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/560708/%E6%B5%B7%E5%A4%A7%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560708/%E6%B5%B7%E5%A4%A7%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// 定义要监听的输入框 ID 列表
	const inputIds = ['kcxx', 'skls'];

	// 定义键盘事件处理函数
	function handleEnterKey(event) {
		// 检查按下的键是否为 'Enter'（回车键）
		if (event.key === 'Enter') {
			// 阻止默认的回车行为
			event.preventDefault();

			// 检查全局作用域中是否存在 queryKxkcList 函数
			if (typeof queryKxkcList === 'function') {
				// 调用目标函数
				window.queryKxkcList();
				console.log(`UserScript: Enter key pressed in input ID="${event.target.id}". Calling queryKxkcList().`);
			} else {
				console.warn('UserScript Warning: Function queryKxkcList() is not defined globally on this page.');
			}
		}
	}

	// 遍历 ID 列表，查找并监听每个元素
	inputIds.forEach(id => {
		const inputElement = document.getElementById(id);

		if (inputElement) {
			// 监听键盘按下事件
			inputElement.addEventListener('keydown', handleEnterKey);
		} else {
			// 如果元素不存在，在控制台输出信息
			console.log(`UserScript Info: Input element with id="${id}" not found on this page.`);
		}
	});

})();