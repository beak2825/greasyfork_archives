// ==UserScript==
// @name        Flibusta Book 2 Font Size
// @namespace   2k1dmg@userscript
// @description Добавляет панель для изменения размера шрифта (в пунктах - pt).
// @include     /^https?://(proxy\.|www\.)?flibusta\.[a-z]{2,3}/b/\d+/read.*$/
// @include     /^https?://flibustahezeous3\.onion/b/\d+/read.*$/
// @include     /^https?://flibusta\.i2p/b/\d+/read.*$/
// @include     /^https?://zmw2cyw2vj7f6obx3msmdvdepdhnw2ctc4okza2zjxlukkdfckhq\.b32\.i2p/b/\d+/read.*$/
// @version     0.1.5
// @author      2k1dmg
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6478/Flibusta%20Book%202%20Font%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/6478/Flibusta%20Book%202%20Font%20Size.meta.js
// ==/UserScript==

// 2015-11-18

(function (window) {
	'use strict';
	if (!window || (window && window.self !== window.top)) {
		return;
	}
	var document = window.document;

	var styleSheetLoader = function () {
		var cssStyle = document.createElement('style');
		cssStyle.type = 'text/css';
		cssStyle.textContent = '.fbb2-font-size-box {\n' +
			'	opacity: 0;\n' +
			'	position: fixed;\n' +
			'	bottom: 1em;\n' +
			'	left: 50%;\n' +
			'	width: 250px;\n' +
			'	margin-left: -125px;\n' +
			'	padding: 1em;\n' +
			'	color: #fff;\n' +
			'	background-color: #555;\n' +
			'	border: 1px #999 solid;\n' +
			'	border-radius: .5em;\n' +
			'	font-size: 8pt;\n' +
			'	transition: opacity 500ms ease-out;\n' +
			'}\n' +
			'.fbb2-font-size-box:hover {\n' +
			'	opacity: 1;\n' +
			'}\n' +
			'.fbb2-font-size-box > button  {\n' +
			'	margin-left: 7px;\n' +
			'}\n';
		document.head.appendChild(cssStyle);
	};

	var divMain = document.getElementById('main');
	if (!divMain)
		return;

	var FONT_SIZE = 11;

	var isLS = (function () {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (ex) {
			return false;
		}
	}());

	var checkLS = function () {
		if (!localStorage.fbb2FontSize) {
			setFontSize();
			return;
		}
		setFontSize(localStorage.getItem("fbb2FontSize"));
	};

	var setFontSize = function (val) {
		var fbb2FontSizeVolume = document.querySelector('#fbb2-font-size-volume');
		var fbb2FontSizeRange = document.querySelector('#fbb2-font-size-range');

		setFontSize = function (val) {
			var fontSize = val || FONT_SIZE;
			if (val) {
				fbb2FontSizeVolume.value = fontSize;
				fbb2FontSizeRange.value = fontSize;
			}
			divMain.style.fontSize = fontSize + 'pt';

			if (isLS) {
				localStorage.fbb2FontSize = fontSize;
			}
		};
		return setFontSize(val);
	};

	var setDefaultFontSize = function () {
		setDefaultFontSize = function () {
			setFontSize(FONT_SIZE);
		};
		return setDefaultFontSize();
	};

	var resetFontSize = function () {
		setDefaultFontSize();
		if (isLS) {
			localStorage.removeItem('fbb2FontSize');
		}
		divMain.style.removeProperty('font-size');
	};

	var fontSizeBox = {
		handleEvent : function (event) {
			if (!event.target || !event.target.id)
				return;

			var eventTargetId = event.target.id;

			switch (eventTargetId) {
			case 'fbb2-font-size-range':
				setFontSize(event.target.value);
				break;
			case 'fbb2-text-font-size-default':
				setDefaultFontSize();
				break;
			case 'fbb2-text-font-size-reset':
				resetFontSize();
				break;
			}
		}
	};

	var addBox = function () {
		styleSheetLoader();

		var controlBox = document.createElement('div');
		controlBox.className = 'fbb2-font-size-box';

		controlBox.innerHTML = '' +
			'<label for="fbb2-font-size-range">Font size</label>' +
			'<input type="range" min="5" max="25" value="11" id="fbb2-font-size-range" step="1">' +
			'<output for="fbb2-font-size-range" id="fbb2-font-size-volume">' + FONT_SIZE + '</output>' +
			'<label for="fbb2-font-size-range">pt</label>' +
			'<br>' +
			'<button id="fbb2-text-font-size-default">Default</button>' +
			'<button id="fbb2-text-font-size-reset">Reset</button>';

		document.body.appendChild(controlBox);

		document.getElementById('fbb2-font-size-range').
		addEventListener('input', fontSizeBox, false);

		[
			'fbb2-text-font-size-default',
			'fbb2-text-font-size-reset'
		].forEach(function (item) {
			document.getElementById(item).
			addEventListener('click', fontSizeBox, false);
		});

		if (isLS) {
			checkLS();
		} else {
			setFontSize();
		}
	};

	if (document.readyState === 'complete') {
		addBox();
	} else {
		window.addEventListener('load', function pageLoaded(e) {
			window.removeEventListener('load', pageLoaded, false);
			addBox();
		}, false);
	}
})(window);
