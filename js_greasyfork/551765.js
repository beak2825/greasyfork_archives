// ==UserScript==
// @name         MWI QQShow IDB ver.
// @namespace    http://tampermonkey.net/
// @version      0.00
// @description  Fix QQ Show for magic way idle.
// @author       MagnoliaCoco
// @match        https://www.milkywayidle.com/*
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @connect      47.117.41.123
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551765/MWI%20QQShow%20IDB%20ver.user.js
// @updateURL https://update.greasyfork.org/scripts/551765/MWI%20QQShow%20IDB%20ver.meta.js
// ==/UserScript==

/*
 * QQ秀插件
 * 由Ratatata的Magic Way Idle的代码精简而来，仅保留了QQ秀功能
 * 希望API不再被滥用
 */


(function () {
	'use strict';
	const API_CONFIG = {
		QQ_SHOW_UPDATE: "http://47.117.41.123:10086/api/qqshow/update",
		QQ_SHOW_GET: "http://47.117.41.123:10086/api/qqshow/query",
	};
	const QQSHOW_CLS = {
		qqshow_setting: "qqshow_md2",
		qqshow_url_input: "qqshow_url_input_md2",
	};
	const buttonThor = 1000;
	let globalVariable = {
		qqShow: {
			// 保存玩家QQ秀链接
			replacementTargets: {},
			// 图标替换观察者
			observer: null,
			characterName: null
		}
	}
	let lastTimeClick = 0;
	function hookWebSocket() {
		const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
		const oriGet = dataProperty.get;
		dataProperty.get = hookedGet;
		Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
		function hookedGet() {
			const socket = this.currentTarget;
			if (!(socket instanceof WebSocket)) {
				return oriGet.call(this);
			}
			if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
				return oriGet.call(this);
			}
			const message = oriGet.call(this);
			Object.defineProperty(this, "data", { value: message });
			return handleMessage(message);
		}
	}
	function handleMessage(message, debug = false) {
		let obj = JSON.parse(message);
		if (obj && obj.type === "init_character_data") {
			// 读取角色名称用于上传QQ秀
			globalVariable.qqShow.characterName = obj.character.name;
		}
		return message;
	}

	// Helper function 显示提醒
	// showToast()
	// Source: **助手
	// Author: Trutn_Light Stella
	const toastQueues = Array.from({ length: 5 }, () => []);
	const maxVisibleToasts = Math.floor(window.innerHeight / 2 / 50);
	let isToastVisible = Array(5).fill(false);
	function displayNextToast(queueIndex) {
		if (isToastVisible[queueIndex] || toastQueues[queueIndex].length === 0) return;
		const { message, duration } = toastQueues[queueIndex].shift();
		isToastVisible[queueIndex] = true;
		const toast = createToastElement(message, queueIndex);
		toast.style.opacity = '0';
		requestAnimationFrame(() => {
			toast.style.opacity = '1';
		});
		setTimeout(() => {
			toast.style.opacity = '0';
			setTimeout(() => {
				document.body.removeChild(toast);
				isToastVisible[queueIndex] = false;
				displayNextToast(queueIndex);
			}, 500);
		}, duration);
	}
	function showToast(message, duration = 2000) {
		const queueIndex = toastQueues.findIndex(queue => queue.length < maxVisibleToasts);
		if (queueIndex === -1) return;
		toastQueues[queueIndex].push({ message, duration });
		displayNextToast(queueIndex);
	}
	function createToastElement(message, queueIndex) {
		const toast = document.createElement('div');
		toast.className = 'toast';
		toast.style.position = 'fixed';
		toast.style.bottom = `${20 + queueIndex * 60}px`;
		toast.style.left = '50%';
		toast.style.transform = 'translateX(-50%)';
		toast.style.backgroundColor = '#333';
		toast.style.color = '#fff';
		toast.style.padding = '10px 20px';
		toast.style.borderRadius = '5px';
		toast.style.zIndex = '1000';
		toast.style.textAlign = 'center';
		toast.style.transition = 'opacity 0.5s';
		toast.textContent = message;
		document.body.appendChild(toast);
		return toast;
	}

	function addQQshowButton() {
		const targetNode = document.querySelector("div.SettingsPanel_infoGrid__2nh1u");
		const isqqshowFlagExist = document.querySelector(`div.${QQSHOW_CLS.qqshow_setting}`);
		if (targetNode && !isqqshowFlagExist) {
			const nameColor = targetNode.querySelectorAll("div.SettingsPanel_value__2nsKD")[2];
			let qqshowtitlediv = document.createElement("div");
			let qqshowdiv = document.createElement("div");
			let qqshowdivflag = document.createElement("div");
			qqshowtitlediv.setAttribute("class", "SettingsPanel_label__24LRD");
			qqshowtitlediv.innerHTML = "更新QQ秀【修正版】";
			qqshowdiv.setAttribute("class", "SettingsPanel_value__2nsKD");
			qqshowdiv.style = nameColor.style;
			qqshowdivflag.setAttribute("class", QQSHOW_CLS.qqshow_setting);
			let qqshowURLInput = document.createElement("input");
			qqshowURLInput.type = "text";
			qqshowURLInput.setAttribute("class", QQSHOW_CLS.qqshow_url_input);
			qqshowURLInput.placeholder = "图床url/提交空白视为删除";
			let qqshowSubmitButton = document.createElement("button");
			qqshowSubmitButton.setAttribute("class", "Button_button__1Fe9z");
			qqshowSubmitButton.textContent = "提交";
			qqshowSubmitButton.addEventListener("click", qqshowSubmit);
			let qqshowRefreshCacheButton = document.createElement("button");
			qqshowRefreshCacheButton.setAttribute("class", "Button_button__1Fe9z");
			qqshowRefreshCacheButton.textContent = "强制刷新缓存";
			qqshowRefreshCacheButton.addEventListener("click", getQQShowData);
			qqshowdiv.appendChild(qqshowdivflag);
			qqshowdiv.appendChild(qqshowURLInput);
			qqshowdiv.appendChild(qqshowSubmitButton);
			qqshowdiv.appendChild(qqshowRefreshCacheButton);
			let readmetitlediv = document.createElement("div");
			let readme = document.createElement("div");
			readmetitlediv.setAttribute("class", "SettingsPanel_label__24LRD");
			readme.setAttribute("class", "SettingsPanel_value__2nsKD");
			readme.innerHTML = "先去tupian.li等图床上传图片，再提交url。<br> 直接提交空白将删除QQ秀。刷新后生效。<br> 若依然无效请点击强制刷新缓存后，再次刷新页面。<br> 每天仅限使用5次，请勿频繁更新"

			nameColor.parentNode.insertBefore(readme, nameColor.nextSibling);
			nameColor.parentNode.insertBefore(readmetitlediv, nameColor.nextSibling);

			nameColor.parentNode.insertBefore(qqshowdiv, nameColor.nextSibling);
			nameColor.parentNode.insertBefore(qqshowtitlediv, nameColor.nextSibling);
		}
	}

	function qqshowSubmit() {
		const now = Date.now();
		if (now - lastTimeClick < buttonThor) return;
		lastTimeClick = now;
		let qqshowURLInput = document.querySelector(`input.${QQSHOW_CLS.qqshow_url_input}`);
		let url = qqshowURLInput.value
		function isValidURL(str) {
			try {
				new URL(str);
				return true;
			} catch (err) {
				return false;
			}
		}
		if (url == '') {
			localStorage.setItem("MWIQQshow_timestamp", 0);
			updateqqshow(url);
		} else if (isValidURL(url)) {
			localStorage.setItem("MWIQQshow_timestamp", 0);
			updateqqshow(url);
		} else {
			showToast("url不合法");
		}
	}

	//更新QQ秀
	function updateqqshow(face_url) {
		if (document.URL.includes("test.milkywayidle.com")) return;
		if (globalVariable.qqShow.characterName == "" || typeof globalVariable.qqShow.characterName === "undefined") {
			showToast("非法更新，请刷新页面");
			return;
		}
		const postData = {
			username: globalVariable.qqShow.characterName,
			url: face_url
		};
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: 'POST',
				url: API_CONFIG.QQ_SHOW_UPDATE,
				headers: {
					"Content-Type": "application/json"
				},
				data: JSON.stringify(postData),
				onload: function (response) {
					showToast("QQ秀更新成功，刷新页面生效");
					resolve();
				},
				onerror: function (error) {
					showToast("QQ秀更新失败（网络错误）");
					reject(error);
				}
			});
		});
	}

	//IDB重构
	const DB_NAME = 'magic_qqshow_cache';
	const DB_version = 1;
	const STORE_NAME = 'qqshowMap'
	let dbPromise = null;
	function openDB() {
		if (dbPromise)
			return dbPromise;
		dbPromise = new Promise((resolve, reject) => {
			const req = window.indexedDB.open(DB_NAME);
			req.onupgradeneeded = function (e) {
				const db = e.target.result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					db.createObjectStore(STORE_NAME);
				}
			};
			req.onsuccess = function (e) {
				resolve(e.target.result);
			};
			req.onerror = function (e) {
				reject(e);
			};
		});
		return dbPromise;
	}
	async function idbGet(key) {
		const db = await openDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, 'readonly');
			const store = tx.objectStore(STORE_NAME);
			const req = store.get(key);
			req.onsuccess = () => resolve(req.result);
			req.onerror = (e) => {
				console.error('qqshow idbGet error', e);
				resolve(null);
			}
		});
	}
	async function idbSet(key, value) {
		const db = await openDB();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, 'readwrite');
			const store = tx.objectStore(STORE_NAME);
			const req = store.put(value, key);
			req.onsuccess = () => resolve();
			req.onerror = (e) => {
				console.error('qqshow idbSet error', e);
				resolve(null);
			}
		});
	}

	//获取所有玩家QQ秀图片链接
	function getQQShowData() {
		const now = Date.now();
		if (now - lastTimeClick < buttonThor) return;
		lastTimeClick = now;
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: 'GET',
				url: API_CONFIG.QQ_SHOW_GET,
				headers: {
					"Content-Type": "application/json"
				},

				onload: function (response) {
					try {
						const data = JSON.parse(response.responseText);
						globalVariable.qqShow.replacementTargets = data;

						localStorage.setItem("magic_qqshow_cache_timestamp", Date.now());
						idbSet('qqshow', JSON.stringify(globalVariable.qqShow.replacementTargets));
						showToast("已更新QQ秀缓存");
						resolve();
					} catch (jsonError) {
						console.error('Error parsing JSON:', jsonError);
						showToast("QQ秀更新失败（无法解析JSON）");
						reject(jsonError);
					}
				},
				onerror: function (error) {
					console.error('获取失败:', error);
					showToast("QQ秀更新失败（网络错误）");
					reject(error);
				}
			});
		});
	}

	// Source: MWI玩家图标替换
	// Author: Ak4r1 ChatGpt Stella bot7420
	function replaceIconsIn(node) {
		const iconElements = node.querySelectorAll(`div.FullAvatar_fullAvatar__3RB2h`);
		for (const elem of iconElements) {
			if (elem.closest("div.CowbellStorePanel_avatarsTab__1nnOY")) {
				continue; // 商店页面
			}

			const playerId = findPlayerIdByAvatarElem(elem);
			if (!playerId) {
				//console.error("ICONS: replaceIconsIn can't find playerId");
				//设置页面下面两个小人会引发异常，不要大惊小怪
				//console.log(elem);
				continue; // 找不到 playerId
			}

			if (!globalVariable.qqShow.replacementTargets.hasOwnProperty(playerId)) {
				continue; // 没有配置图片地址
			}

			const newImgElement = document.createElement("img");
			newImgElement.src = globalVariable.qqShow.replacementTargets[playerId];
			newImgElement.style.width = "100%";
			newImgElement.style.height = "100%";
			elem.innerHTML = "";
			elem.appendChild(newImgElement);
		}
	}
	function findPlayerIdByAvatarElem(avatarElem) {
		// Profile 窗口页
		const profilePageDiv = avatarElem.closest("div.SharableProfile_modal__2OmCQ");
		if (profilePageDiv) {
			return profilePageDiv.querySelector(".CharacterName_name__1amXp")?.textContent.trim();
		}
		// 网页右上角
		const headerDiv = avatarElem.closest("div.Header_header__1DxsV");
		if (headerDiv) {
			return headerDiv.querySelector(".CharacterName_name__1amXp")?.textContent.trim();
		}
		// 战斗页面
		const combatDiv = avatarElem.closest("div.CombatUnit_combatUnit__1m3XT");
		if (combatDiv) {
			return combatDiv.querySelector(".CombatUnit_name__1SlO1")?.textContent.trim();
		}

		// 组队页面
		const partyDiv = avatarElem.closest("div.Party_partySlot__1xuiq");
		if (partyDiv) {
			return partyDiv.querySelector(".CharacterName_name__1amXp")?.textContent.trim();
		}
		return null;
	}

	//初始化观察者，分配替换目标
	function initQQShowObserver() {
		globalVariable.qqShow.observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (
						node.tagName === "DIV" &&
						!node.classList.contains("ProgressBar_innerBar__3Z_sf") &&
						!node.classList.contains("CountdownOverlay_countdownOverlay__2QRmL") &&
						!node.classList.contains("ChatMessage_chatMessage__2wev4") &&
						!node.classList.contains("Header_loot__18Cbe") &&
						!node.classList.contains("script_itemLevel") &&
						!node.classList.contains("script_key") &&
						!node.classList.contains("dps-info") &&
						!node.classList.contains("MuiTooltip-popper")
					) {
						replaceIconsIn(node);
					}
				});
			});
		});
	}

	async function gameMain() {
		// 拦截WebSocket
		hookWebSocket();
		// 优先从缓存加载QQ秀
		try {
			globalVariable.qqShow.replacementTargets = JSON.parse(await idbGet('qqshow'));
		} catch (error) {
			console.error(error);
			getQQShowData();
		}
		if ('magic_qqshow_cache_timestamp' in localStorage) {
			// 若缓存过期（有效期 1 天） => 立即更新缓存
			if (Math.abs(Date.now() - localStorage.getItem("magic_qqshow_cache_timestamp")) > 86400000) {
				getQQShowData();
			}
		} else {
			// 未找到缓存  => 立即更新缓存
			getQQShowData();
		}
		// 初始化观察者，分配替换目标
		initQQShowObserver();
		// 启动观察者，替换QQ秀
		globalVariable.qqShow.observer.observe(document, { attributes: false, childList: true, subtree: true });
		// 设置页面仍然需要添加新的图标 初始化设置页面观察者
		let globalObserver = new MutationObserver(function (mutationsList, observer) {
			addQQshowButton();
		});
		globalObserver.observe(document, { childList: true, subtree: true });
	}

	gameMain()
})();