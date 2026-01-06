// ==UserScript==
// @name        donttap adblock
// @author      brian6932
// @namespace   https://greasyfork.org/users/581142
// @namespace   https://github.com/brian6932
// @license     agpl-3.0-only
// @match       https://www.donttap.com/*
// @grant       none
// @version     1.0
// @description Blocks the ad that appears after games.
// @downloadURL https://update.greasyfork.org/scripts/561554/donttap%20adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/561554/donttap%20adblock.meta.js
// ==/UserScript==
// jshint esversion: 11

setTimeout(() => {
	globalThis.Object.defineProperties(globalThis.G, {
		__proto__: null,
		initCocoonAds: {
			__proto__: null,
			value: () => {}
		},
		showCocoonAd: {
			__proto__: null,
			value: () => {}
		},
		getAdInterval: {
			__proto__: null,
			value: () => {}
		},
		initAds: {
			__proto__: null,
			value: () => {}
		},
		closeAd: {
			__proto__: null,
			value: () => {}
		},
		showAd: {
			__proto__: null,
			value: () => {}
		},
		adCreated: {
			__proto__: null,
			value: true
		},
		adSettings: {
			__proto__: null,
			value: Object.freeze({ __proto__: null })
		}
	})
}, 1000)
