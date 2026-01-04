// ==UserScript==
// @name         Insert dungeon run time
// @namespace    http://tampermonkey.net/
// @version      2025-12-11-2
// @description  Insert dungeon run time after the key count
// @license      MIT
// @author       sentientmilk
// @match        https://www.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556924/Insert%20dungeon%20run%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/556924/Insert%20dungeon%20run%20time.meta.js
// ==/UserScript==

/*
	Changelog
	=========

	v2025-11-26
		- Initial version
	v2025-11-26-1
		- FIXED: Did not add time after the run
	v2025-11-26-2
		- FIXED: Selecting messages from other chats
	v2025-11-27
		- FIXED: 29m 60s
	v2025-11-27-2
		- Added rolling average times of the collected runs
	v2025-12-06
		- FIXED: Reconnecting after unfocus, tab switching, desktop switching
	v2025-12-11
		- Account for switching dungeons
		- Do not show average for the first run in a series
		- FIXED: Negative average time
		- FIXED: Not showing times after hiding/unhiding the chat panel
	v2025-12-11-2
		- FIXED: Debug mode was enabled

	        TODO
	====================
	- Incompatability with MWITools on Chromium with Violentmonkey(specifically)
*/

(function() {
	async function waitFnRepeatedFor (cond, callback) {
		let notified = false;
		return new Promise((resolve) => {
			function check () {
				const r = cond();
				setTimeout(check, 1000/30); // Schedule first to allow the callback to throw
				if (r && !notified) {
					notified = true;
					resolve();
					if (callback) {
						callback();
					}
				} else if (r && notified) {
					// Skip, wait for cond to be false again
				} else {
					notified = false;
				}
			}
			check();
		});
	}

	let partyMessages = [];

	function isBattleStarted (m) {
		return m.isSystemMessage == true && m.m == "systemChatMessage.partyBattleStarted";
	}

	function isKeys (m) {
		return m.isSystemMessage == true && m.m == "systemChatMessage.partyKeyCount";
	}

	function isStart (m, i, arr) {
		if (m.isSystemMessage != true) {
			return false;
		}

		const p = arr[i - 1];
		if (isKeys(m) && p && isBattleStarted(p)) { // First "Key counts" after "Battle started"
			return true;
		}

		// First "Key counts" visible in the Party chat with no "Battle started" before it
		if (isKeys(m)) {
			let ts = arr.slice(0, i);
			let nearestStartI = ts.findLastIndex((m2) => m2.isSystemMessage == true && (m2.m == "systemChatMessage.partyBattleStarted" || m2.m == "systemChatMessage.partyKeyCount"));
			if (nearestStartI == -1) {
				return true;
			}
		}

		return false;
	}

	function isRun (m, i, arr) {
		return m.isSystemMessage == true && !isStart(m, i, arr) && m.m == "systemChatMessage.partyKeyCount";
	}

	function f (t) {
		return Math.floor(t / 1000 / 60) + "m " + Math.floor(t / 1000 % 60) + "s";
	}

	const debug = false;

	if (debug) {
		let fakeId = 99000;
		function insertMessage (html) {
			const partyTabI = Array.from(document.querySelectorAll(`.Chat_tabsComponentContainer__3ZoKe .MuiButtonBase-root`)).findIndex((el) => el.textContent.includes("Party"));
			const chatEl = document.querySelector(`.TabPanel_tabPanel__tXMJF:nth-child(${partyTabI + 1}) .ChatHistory_chatHistory__1EiG3`);
			chatEl.insertAdjacentHTML("beforeend", html);
			chatEl.children[0].remove();
		}

		function spam () {
			const d = (new Date()).toISOString();
			const m = {
				type: "chat_message_received",
				message: {
					id: (fakeId++),
					"chan": "/chat_channel_types/party",
					"m": "Synthetic spam",
					"t": d,
				}
			};
			const html = `<div class="ChatMessage_chatMessage__2wev4"><span class="ChatMessage_timestamp__1iRZO">[${d}] </span><span style="display: inline-block;"><span><span><span class="ChatMessage_name__1W9tB ChatMessage_clickable__58ej2"><div class="CharacterName_characterName__2FqyZ" translate="no"><div class="CharacterName_chatIcon__22lxV"><svg role="img" aria-label="chat icon" class="Icon_icon__2LtL_" width="100%" height="100%"><use href="/static/media/chat_icons_sprite.1eaa506f.svg#slimy"></use></svg></div><div class="CharacterName_name__1amXp CharacterName_blue__1m-Sd" data-name="sentientmilk"><span>sentientmilk</span></div></div></span><span>: </span></span></span></span><span>Synthetic spam</span></div>`

			handle(m);
			insertMessage(html);
		};

		function battleStart () {
			const d = (new Date()).toISOString();
			const m = {
				type: "chat_message_received",
				message: {
					id: (fakeId++),
					isSystemMessage: true,
					"chan": "/chat_channel_types/party",
					m: "systemChatMessage.partyBattleStarted",
					t: d,
				}
			};
			const html = `<div class="ChatMessage_chatMessage__2wev4 ChatMessage_systemMessage__3Jz9e"><span class="ChatMessage_timestamp__1iRZO">[${d}] </span><span>Battle started: Test </div>`

			handle(m);
			insertMessage(html);

			keys();
		}

		function keys () {
			const d = (new Date()).toISOString();
			const m = {
				type: "chat_message_received",
				message: {
					id: (fakeId++),
					isSystemMessage: true,
					"chan": "/chat_channel_types/party",
					m: "systemChatMessage.partyKeyCount",
					t: d,
				}
			};
			const html = `<div class="ChatMessage_chatMessage__2wev4 ChatMessage_systemMessage__3Jz9e"><span class="ChatMessage_timestamp__1iRZO">[${d}] </span><span>Key counts: Test </div>`

			handle(m);
			insertMessage(html);
		};

		waitFnRepeatedFor(() => document.querySelector(".Header_actionInfo__1iIAQ"), () => {
			document.querySelector(".Header_actionInfo__1iIAQ").insertAdjacentHTML("beforeend", `
				<button class="userscript-idrt spam">Spam</button>
				<button class="userscript-idrt spam10">Spam 10x</button>
				<button class="userscript-idrt start">Battle start</button>
				<button class="userscript-idrt keys">Keys</button>`);

			document.querySelector(".userscript-idrt.spam").onclick = spam;
			document.querySelector(".userscript-idrt.spam10").onclick = () => { for (let i = 0; i < 10; i++) { spam(); } };
			document.querySelector(".userscript-idrt.start").onclick = battleStart;
			document.querySelector(".userscript-idrt.keys").onclick = keys;
		});

	}

	function addDungeonRunTimes () {
		if (!isPartySelected()) {
			return;
		}

		const partyTabI = Array.from(document.querySelectorAll(`.Chat_tabsComponentContainer__3ZoKe .MuiButtonBase-root`)).findIndex((el) => el.textContent.includes("Party"));

		let times2 = partyMessages.map((m) => ({...m}));
		times2.forEach((m, i, arr) => {
			if (isBattleStarted(m, i, arr)) {
				m.isBattleStarted = true;
			}

			if (isKeys(m)) {
				m.isKeys = true;
			}

			if (isStart(m, i, arr)) {
				m.isStart = true;
			} else if (isRun(m, i, arr)) {
				m.isRun = true;

				let ts = arr.slice(0, i + 1);
				let nearestStartI = ts.findLastIndex(isStart);
				if (nearestStartI == -1) {
					nearestStartI = 0;
				}
				ts = ts.slice(nearestStartI).filter(isRun);
				m.ts = ts;

				let p = arr.slice(0, i + 1).slice(nearestStartI, -1).findLast(isKeys);
				m.p = p;
				m.runDuration = 0;
				if (p) {
					m.runDuration = (+new Date(m.t)) - (+new Date(p.t));
				}

				m.average = ts.reduce((acc, m2) => acc + m2.runDuration, 0) / ts.length;
			}
		});

		if (debug) {
			console.log(times2);
		}

		const messagesEls = Array.from(document.querySelectorAll(`.TabPanel_tabPanel__tXMJF:nth-child(${partyTabI + 1}) .ChatHistory_chatHistory__1EiG3 > .ChatMessage_chatMessage__2wev4`));

		let j = 0;
		messagesEls.reverse().forEach((el, i) => {

			if (el.querySelector(".userscript-idrt")) {
				el.querySelector(".userscript-idrt").remove();
			}

			const isKeyCounts = el.classList.contains("ChatMessage_systemMessage__3Jz9e") && (el.textContent.includes("Key counts:"));
			const m = times2[times2.length - 1 - i];

			el.insertAdjacentHTML("beforeend", (`<span class="userscript-idrt">`
				+ (m.isRun ? `<span style="color: orange">${f(m.runDuration)}</span>` : "")
				+ (m.isRun && m.ts.length > 1 ? `
					<span style="color: tan"> Average:</span>
					<span style="color: orange">${f(m.average)}</span>` : "")
				+ (debug && m.isBattleStarted ? `<span style="color: orange"> [BattleStarted]</span>` : "")
				+ (debug && m.isKeys ? `<span style="color: orange"> [Keys]</span>` : "")
				+ (debug && m.isStart ? `<span style="color: red"> [START]</span>` : "")
				+ (debug && m.isRun ? `<span style="color: red"> [RUN]</span>` : "")
				//+ (debug && !m.isBattleStarted && !m.isKeys ? `<span style="color: green"> [Message]</span>` : "")
				+ (debug && m.isKeys ? ` <span style="color: green">#</span>${m.id}` : "")
				+ (debug && m.p ? ` <span style="color: green">p.id=</span>${m.p.id}` : "")
				+ (debug && m.ts ? ` <span style="color: green">ts.length=</span>${m.ts.length}` : "")
			+ `</span>`).replace(/[\t\n]+/g, " "));
		});
	}

	function handle (message) {
		if (message.type == "init_character_data") {
			message.partyChatHistory.forEach((message2) => {
				partyMessages.push(message2);
			});
		}

		if (message.type == "chat_message_received" && message.message.chan == "/chat_channel_types/party") {
			partyMessages.push(message.message);
			partyMessages = partyMessages.slice(partyMessages.length - 100, partyMessages.length);
			setTimeout(addDungeonRunTimes, 100);
		}
	}


	/*
		Wrap WebSocket to set own listener
		Use unsafeWindow + run-at document-start to do that before MWI calls the WebSocket constuctor
	*/
	const OriginalWebSocket = unsafeWindow.WebSocket;
	let ws;
	function listener (e) {
		const message = JSON.parse(e.data);
		handle(message);
	}
	const WrappedWebSocket = function (...args) {
		ws = new OriginalWebSocket(...args)
		ws.addEventListener("message", listener);
		return ws;
	};

	// Used in .performConnectionHealthCheck() and .sendHealthCheckPing() in the MWI
	WrappedWebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
	WrappedWebSocket.OPEN = OriginalWebSocket.OPEN;
	WrappedWebSocket.CLOSED = OriginalWebSocket.CLOSED;

	unsafeWindow.WebSocket = WrappedWebSocket;

	function isPartySelected () {
		const selectedTabEl = document.querySelector(`.Chat_tabsComponentContainer__3ZoKe .MuiButtonBase-root[aria-selected="true"]`);
		const tabsEl = document.querySelector(".Chat_tabsComponentContainer__3ZoKe .TabsComponent_tabPanelsContainer__26mzo");
		return selectedTabEl && tabsEl && selectedTabEl.textContent.includes("Party") && !tabsEl.classList.contains("TabsComponent_hidden__255ag");
	}

	waitFnRepeatedFor(isPartySelected, addDungeonRunTimes);



})();

