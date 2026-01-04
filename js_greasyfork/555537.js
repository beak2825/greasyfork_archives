// ==UserScript==
// @name chzzk bypass (User-Agent ver)
// @version 1
// @description chzzk User-Agent 변경
// @match https://chzzk.naver.com/*
// @match https://mul.live/*
// @run-at document-start
// @icon https://chzzk.naver.com/favicon.ico
// @icon https://mul.live/favicon.ico
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/1510534
// @downloadURL https://update.greasyfork.org/scripts/555537/chzzk%20bypass%20%28User-Agent%20ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555537/chzzk%20bypass%20%28User-Agent%20ver%29.meta.js
// ==/UserScript==
(function() {
	'use strict';
	const UserAgent =
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Whale/3.24.223.18 Safari/537.36';
	const overrideProperty = (obj, prop, newGetter) => {
		try {
			Object.defineProperty(navigator, 'userAgent', {
				get: () => UserAgent,
				configurable: true,
				enumerable: true,
			});
		} catch (e) {}
	};
	overrideProperty();
})();