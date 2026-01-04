// ==UserScript==
// @name         Center Stage Chats
// @namespace    http://tampermonkey.net/
// @version      2025-09-09
// @description  A stupidly small script for a stupidly small problem. Good for WDB.
// @author       https://github.com/xskutsu
// @license      AGPL-3.0-or-later
// @match        *://bonk.io/gameframe-release.html
// @match        *://bonkisback.io/gameframe-release.html
// @match        *://multiplayer.gg/physics/gameframe-release.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/548901/Center%20Stage%20Chats.user.js
// @updateURL https://update.greasyfork.org/scripts/548901/Center%20Stage%20Chats.meta.js
// ==/UserScript==

void (function () {
	"use strict";

	const BACKGROUND_TOGGLE_KEY = "center_stage_chats.background_enabled";
	let isBackgroundEnabled = GM_getValue(BACKGROUND_TOGGLE_KEY, true);

	let styleElement = null;
	function updateBackgroundStyle() {
		if (isBackgroundEnabled) {
			styleElement = document.createElement("style");
			styleElement.textContent = `
				#ingamechatcontent > div {
					background-color: #00000025;
					backdrop-filter: blur(7px);
					-webkit-backdrop-filter: blur(7px);
				}`;
			document.head.appendChild(styleElement);
		} else {
			if (styleElement !== null) {
				styleElement.remove();
				styleElement = null;
			}
		}
	}

	window.addEventListener("DOMContentLoaded", function () {
		const chatContainer = document.getElementById("ingamechatbox");
		if (!chatContainer) {
			return;
		}
		new MutationObserver(function () {
			chatContainer.style.setProperty("height", "156px", "important");
		}).observe(chatContainer, { attributes: true, attributeFilter: ["style"] });
		chatContainer.style.cssText = `
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 20px;
        margin: 0px;
        text-align: center;
		zoom: 90%;`;
		const zIndex = getComputedStyle(document.getElementById("ingamecountdown")).zIndex;
		chatContainer.style.zIndex = (zIndex === "auto" ? 0 : parseInt(zIndex, 10)) + 1;
		updateBackgroundStyle();
	});

	GM_registerMenuCommand("Toggle Background", function () {
		isBackgroundEnabled = !isBackgroundEnabled;
		GM_setValue(BACKGROUND_TOGGLE_KEY, isBackgroundEnabled);
		updateBackgroundStyle();
	});
})();