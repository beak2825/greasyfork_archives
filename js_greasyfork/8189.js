// ==UserScript==
// @name           futaba ID+IP popup
// @namespace      https://github.com/himuro-majika
// @description    同じIDやIPのレスをポップアップしちゃう
// @author         himuro_majika
// @include        http://*.2chan.net/*/res/*.htm
// @include        https://*.2chan.net/*/res/*.htm
// @version        1.3.1
// @license        MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAPUExURYv4i2PQYy2aLUe0R////zorx9oAAAAFdFJOU/////8A+7YOUwAAAElJREFUeNqUj1EOwDAIQoHn/c88bX+2fq0kRsAoUXVAfwzCttWsDWzw0kNVWd2tZ5K9gqmMZB8libt4pSg6YlO3RnTzyxePAAMAzqMDgTX8hYYAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/8189/futaba%20ID%2BIP%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/8189/futaba%20ID%2BIP%20popup.meta.js
// ==/UserScript==
(function() {
	'use strict';

	const USE_COUNTER = true;	// IDカウンターを表示する
	const USE_COUNTER_CURRENT = true;	// IDカウンターに現在の出現数を表示
	const scriptName = "GM_FIP";

	let Start = new Date().getTime();//count parsing time
	let saba = location.host.replace(".2chan.net","") + location.pathname.replace("futaba.htm","");
	let timer_show, timer_hide;
	let isIDIPThread = false;
	let isImg = false;

	init();
	console.log(scriptName + " Parsing " + saba + ": " + ((new Date()).getTime() - Start) + "msec");//log parsing time

	function init() {
		checkIsImg();
		checkThreadMail();
		setClassAndNameThread();
		createCounter();
		observeInserted();
	}

	//img鯖
	function checkIsImg() {
		isImg = document.querySelector(".cnm") === null;
	}

	// ID表示・IP表示スレかどうか
	function checkThreadMail() {
		let mail = !isImg ? document.querySelector(".cnm a") : document.querySelector(".thre .cnw a");
		isIDIPThread = mail !== null && mail.href.match(/^mailto:i[dp]/i) !== null;
	}

	// ID/IPにclass,nameを設定する
	// 本文
	function setClassAndNameThread() {
		let cnw = document.querySelectorAll(".thre .cnw");
		if (!cnw) return;
		setClassAndName(cnw);
	}
	// レス
	function setClassAndNameRes(node) {
		let resIdNode = arguments.length ? node.querySelectorAll(".rtd .cnw") : document.querySelectorAll(".rtd .cnw");
		if (!resIdNode) return;
		setClassAndName(resIdNode);
	}

	function setClassAndName(node) {
		if(!node.length) return;

		node.forEach((item) => {
			if (item.querySelector(".GM_fip_name")) return;
			let matchText = item.textContent.match(/(.+)(I[DP]:\S+)/);
			if (!matchText) return;
			let dateEle = document.createTextNode(matchText[1]);
			let mailEle = item.querySelector("a");
			let idText = matchText[2];
			let idEle = document.createElement("a");
			idEle.textContent = idText;
			idEle.classList.add("GM_fip_name");
			idEle.setAttribute("name", idText);
			idEle.style.color = "#F00";
			idEle.addEventListener("mouseover", openPopup, true);
			idEle.addEventListener("mouseout", closePopup, true);
			item.textContent = "";
			if (mailEle) {
				item.appendChild(mailEle);	//imgメ欄
			} else {
				item.appendChild(dateEle);
			}
			item.appendChild(idEle);
		})
	}
	// 出現数の表示
	function createCounter() {
		if (!USE_COUNTER) return;
		let a = document.querySelectorAll(".thre .GM_fip_name");
		let ids = {};
		for (let i = 0; i < a.length; i++) {
			let node = a[i];
			let id = node.name;
			if (USE_COUNTER_CURRENT) {
				if (ids[id]) {
					ids[id]++;
				} else {
					ids[id] = 1;
				}
			}
			let name = document.querySelectorAll(".thre [name='" + id + "']");
			let span;
			if (node.childNodes[1]) {
				span = node.childNodes[1];
			} else {
				span = document.createElement("span");
				span.classList.add("GM_fip_counter");
				span.style.margin = "0 5px";
				node.appendChild(span);
			}
			if (USE_COUNTER_CURRENT) {
				span.textContent = "[" + ids[id] + "/" + name.length + "]";
			} else {
				span.textContent = "[" + name.length + "]";
			}
		}
	}
	// ポップアップを表示する
	function openPopup(event) {
		clearTimeout(timer_show);
		delPopup();
		timer_show = setTimeout(() => {
			let name = this.name;
			let popup = makePopupContainer();
			let divThread = document.createElement("div");
			let table = document.createElement("table");
			let tbody = document.createElement("tbody");
			let tda = document.querySelectorAll(".thre [name='" + name + "']");
			for (let i = 0; i < tda.length; i++) {
				if (tda[i].parentNode.parentNode.className === "thre") {
					// スレ
					let form;
					if (document.querySelector(".cnw")) {
						form = tda[i].parentNode.parentNode.cloneNode(true);
					} else {
						form = tda[i].parentNode.cloneNode(true);
					}
					for (let j = 0; j < form.childNodes.length; j++) {
						// 広告
						if (form.childNodes[j].className !== "tue") {
							divThread.appendChild(form.childNodes[j].cloneNode(true));
						}
						if (form.childNodes[j].tagName == "BLOCKQUOTE") {
							break;
						}
					}
				} else {
					// レス
					let tr;
					if (document.querySelector(".cnw")) {
						tr = tda[i].parentNode.parentNode.parentNode.cloneNode(true);
					} else {
						tr = tda[i].parentNode.parentNode.cloneNode(true);
					}
					setQtJump(tr);
					tbody.appendChild(tr);
				}
			}
			table.appendChild(tbody);
			popup.appendChild(divThread);
			popup.appendChild(table);
			if (checkAkahukuEnabled()) {
				let bq = popup.querySelectorAll("blockquote");
				bq.forEach(q => {
					let td = q.parentNode;
					let gtdiv = document.createElement("div");
					gtdiv.style.maxWidth = "800px";
					gtdiv.classList.add("akahuku_popup_content_blockquote");
					gtdiv.innerHTML = q.innerHTML;
					q.remove();
					td.appendChild(gtdiv);
				})
			}
			// this.parentNode.appendChild(popup);
			document.querySelector("html body").appendChild(popup);
			document.querySelectorAll("#GM_fip_pop .GM_fip_name").forEach((item) => {
				item.className = ("GM_fip_name_pop");
			})
			let wX = this.getBoundingClientRect().left + window.scrollX;	//ポップアップ表示位置X
			let wY = this.getBoundingClientRect().top + window.scrollY - popup.clientHeight;	//ポップアップ表示位置Y
			if ( wY < 0 ) {	//ポップアップが上に見きれる時は下に表示
				wY = this.getBoundingClientRect().bottom + window.scrollY
			}
			popup.style.top = wY + "px";
			popup.style.left = wX + "px";
		}, 100);
		//ポップアップ内レス番号クリックでジャンプ
		function setQtJump(qt) {
			let rsc = qt.querySelector(".rsc");
			rsc.classList.add("qtjmp");
			let jumpid = rsc.id;
			rsc.removeAttribute("id");
			rsc.addEventListener("click", () => {
				let jumptarget = document.getElementById(jumpid).parentNode;
				window.scroll(0, jumptarget.getBoundingClientRect().top + window.pageYOffset);
				delPopup();
			});
		}
	}

	function makePopupContainer() {
		let container = document.createElement("div");
		container.id = "GM_fip_pop";
		container.classList.add("GM_fip_pop");
		container.style.position = "absolute";
		container.style.zIndex = 350;
		container.style.backgroundColor = "#eeaa88";
		container.style.fontSize = "0.85em";
		container.addEventListener("mouseover",() => {
			clearTimeout(timer_hide);
		}, true);
		container.addEventListener("mouseout",closePopup,true);

		return container;
	}
	// ポップアップを消す
	function closePopup() {
		clearTimeout(timer_show);
		clearTimeout(timer_hide);
		timer_hide = setTimeout(delPopup, 300);
	}

	function delPopup() {
		clearTimeout(timer_hide);
		let doc_pop = document.getElementsByClassName("GM_fip_pop");
		if ( doc_pop ) {
			for (let i = 0; i < doc_pop.length; i++) {
				doc_pop[i].remove();
			}
		}
	}
	// 続きを読むで追加されるレスを監視
	function observeInserted() {
		let target = document.querySelector(".thre");
		let timer_reload;
		let observer = new MutationObserver(function(mutations) {
			mutations.forEach((mutation) => {
				if (!mutation.addedNodes.length) return;
				let nodes = mutation.addedNodes[0];
				if (nodes.tagName == "TABLE" && nodes.id !== "akahuku_bottom_container") {
					setClassAndNameRes(nodes);
					clearTimeout(timer_reload);
					timer_reload = setTimeout(rel, 50);
				}
			});
		});
		observer.observe(target, { childList: true });
		function rel() {
			if (!isIDIPThread) {
				setClassAndNameThread();
				setClassAndNameRes();
			}
			createCounter();
		}
	}

	function checkAkahukuEnabled() {
		return document.getElementById("akahuku_postform") != null
	}

})();
