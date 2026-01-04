// ==UserScript==
// @name         百灵启用滚动条
// @namespace    http://tampermonkey.net/
// @version      2025-11-03-update
// @description  为百灵大模型网页增加滚动条
// @author       Ervoconite
// @match        https://ling.tbox.cn/chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tbox.cn
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554702/%E7%99%BE%E7%81%B5%E5%90%AF%E7%94%A8%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/554702/%E7%99%BE%E7%81%B5%E5%90%AF%E7%94%A8%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==



const d = document, ls = localStorage, ss = sessionStorage;
function $(s) { return d.querySelector(s) }
function $A(s) { return d.querySelectorAll(s) }
function $id(id) { return d.getElementById(id) }
function randi(len) { return Math.floor(Math.random() * len) }

/**
 * 此代码使用“百灵大模型”生成
 * 
 * 为网页增加滚动条。
 */

GM_addStyle(`.ant-bubble-list{overflow:auto!important;}`)


const ContainerSelector = "div.ant-tabs-content.ant-tabs-content-top";
const ScrollSelector = ".ant-tabs-tabpane .ant-bubble-list";


const timeLabel = "加载用时";
console.time(timeLabel);
waitForCondition(
	function () {
		if ($(ContainerSelector) instanceof HTMLElement)
			return true;
		else return false;
	},
	function () {
		// 这个页面使用 DOMContentLoad 事件无响应
		const obs = new MutationObserver((e) => {
			// console.warn(e);
			setTimeout(() => { action() }, 2000);
		});
		obs.observe(
			$(ContainerSelector), {
			subtree: false,
			childList: true,
			characterData: true
		})

		console.timeEnd(timeLabel);
	},
	function () {
		console.error("不等了")
		console.timeEnd(timeLabel);
		alert("超时未匹配，请更新或禁用此脚本。")
	}
)



if (location.search.indexOf("conversationId") > -1) {
	waitForCondition(
		function () {
			if ($(ScrollSelector) instanceof HTMLElement)
				return true;
			else return false;
		},
		function () {
			action();
		},
	)
}




function scrollEnd(elem) {
	elem.scrollTop = elem.scrollHeight;
}

// 核心状态管理
let isFollowing, isUserScrollingUp, lastScrollTop;
function action() {
	const scrollContents = $A(ScrollSelector);
	//console.log(scrollContents)

	// 核心状态管理
	isFollowing = true;        // 初始开启跟随
	isUserScrollingUp = false; // 标记用户是否正在向上滚动
	lastScrollTop = 0;         // 记录上一次滚动位置

	scrollContents.forEach(scrollContent => {
		if (scrollContent.getAttribute("loged")) return;

		// 1. 监听滚动容器滚动事件（检测用户操作）
		scrollContent.addEventListener('scroll', () => {
			const curScrollTop = scrollContent.scrollTop;
			const clientH = scrollContent.clientHeight;
			const scrollH = scrollContent.scrollHeight;

			// 判断是否滚动到底部（允许误差）
			const isAtBottom = curScrollTop + clientH >= scrollH - 50;

			// 规则：当用户向上滚动时停止跟随
			if (curScrollTop < lastScrollTop) {
				isUserScrollingUp = true;
				// 如果滚动到底部后立即向上滚动，需重置状态
				if (isAtBottom) isUserScrollingUp = false;
			}
			// 规则：当用户滚动到底部时重新启用跟随
			else if (isAtBottom) {
				isFollowing = true;
				isUserScrollingUp = false;
			}
			lastScrollTop = curScrollTop;
		});

		// 2. 关键：替换为 MutationObserver（监测DOM结构/文本变化）
		const mutationObserver = new MutationObserver(() => {
			if (isFollowing && !isUserScrollingUp) {
				// 使用 requestAnimationFrame 避免与滚动事件冲突
				requestAnimationFrame(() => {
					scrollEnd(scrollContent)
				});
			}
		});

		// 观察配置：精准捕获内容变更
		mutationObserver.observe(scrollContent, {
			childList: true,     // 子元素增删
			subtree: true,       // 监测所有后代
		});

		// 3. 初始强制滚动到底部（满足"默认初始是跟随"）
		requestAnimationFrame(() => {
			scrollEnd(scrollContent)
		});

		scrollContent.setAttribute("loged", true)
		//console.log(scrollContent)
	})
}



function waitForCondition(func_wait, callback,
	tot_call = null, itv_t = 200, tot_t = 20 * 1000) {
	const itv = setInterval(() => {
		if (func_wait()) {
			clearInterval(itv);
			clearTimeout(tot);

			if (typeof callback == "function")
				callback();
		}
	}, itv_t);

	const tot = setTimeout(() => {
		clearInterval(itv);

		if (typeof tot_call == "function")
			tot_call();
	}, tot_t);
}

