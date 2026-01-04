// ==UserScript==
// @name         Mebuki thread title toolchip
// @namespace    http://tampermonkey.net/
// @version      2025-11-04
// @description  めぶきちゃんのスレッド内の見切れてしまうタイトルにtoolchipを追加
// @author       You
// @match        https://mebuki.moe/app/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mebuki.moe
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554734/Mebuki%20thread%20title%20toolchip.user.js
// @updateURL https://update.greasyfork.org/scripts/554734/Mebuki%20thread%20title%20toolchip.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	setTimeout(() => {
				const text = document.querySelector('main header div.text-sm');
				text.title = text.textContent;
	}, 2*1000);
})();