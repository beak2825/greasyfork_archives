// ==UserScript==
// @name        Stepik Unit Spoofer
// @description Spoofs units as completed
// @version     1.0
// @icon        https://cdn.stepik.net/static/classic/ico/favicon_152.png
// @match       *://stepik.org/*
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @namespace https://greasyfork.org/users/1542200
// @downloadURL https://update.greasyfork.org/scripts/557091/Stepik%20Unit%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/557091/Stepik%20Unit%20Spoofer.meta.js
// ==/UserScript==

(() => {
	'use strict';

	unsafeWindow.GM_getValue = GM_getValue;
	unsafeWindow.GM_setValue = GM_setValue;
	unsafeWindow.GM_listValues = GM_listValues;
	unsafeWindow.GM_deleteValueValue = GM_deleteValue;

	setInterval(() => {
		let params = new URLSearchParams(window.location.search);

		/** @type {Array} */
		let units = GM_getValue('units') || [];
		units = units.map(unit => String(unit));

		let queries = [];

		units.forEach(unit => {
			queries.push(`.lesson-sidebar__toc a[href*="unit=${unit}"]`)
		});

		document.querySelectorAll(queries.join(', ')).forEach(lesson => {
			/** @type {HTMLDivElement} */
			let progressBarGreen = lesson.querySelector('div.line-progress-bar-green');
			if (progressBarGreen) progressBarGreen.style.height = '100%';
		});

		if (units.includes(String(params.get('unit')))) {
			document.querySelectorAll('.player-topbar__step-pins > .player__step-pin').forEach(pin => {
				pin.setAttribute('data-is-attempted', '');
				pin.setAttribute('data-is-passed', '');
			});
		}
	}, 100);
})();