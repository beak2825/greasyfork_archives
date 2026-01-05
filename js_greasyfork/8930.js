// ==UserScript==
// @name        Кнопка «Искать в Яндекс» 2
// @description Альтернативный поиск Google: добавляет кнопку для поиска запроса в Яндекс на странице поисковой выдачи Google.
// @namespace   2k1dmg@userscript
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version     0.2.4
// @author      2k1dmg
// @grant       none
// @match       *://www.google.ru/*
// @match       *://www.google.com/*
// @match       *://www.google.by/*
// @match       *://www.google.kz/*
// @match       *://www.google.com.ua/*
// @match       *://www.google.com.tr/*
// @match       *://www.google.am/*
// @match       *://www.google.az/*
// @match       *://www.google.ee/*
// @match       *://www.google.fi/*
// @match       *://www.google.ge/*
// @match       *://www.google.kg/*
// @match       *://www.google.lt/*
// @match       *://www.google.lv/*
// @match       *://www.google.md/*
// @match       *://www.google.tm/*
// @match       *://www.google.co.uz/*
// @match       *://www.google.de/*
// @downloadURL https://update.greasyfork.org/scripts/8930/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%C2%AB%D0%98%D1%81%D0%BA%D0%B0%D1%82%D1%8C%20%D0%B2%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%C2%BB%202.user.js
// @updateURL https://update.greasyfork.org/scripts/8930/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%C2%AB%D0%98%D1%81%D0%BA%D0%B0%D1%82%D1%8C%20%D0%B2%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%C2%BB%202.meta.js
// ==/UserScript==

// 2015-03-31

(function(window) {
	'use strict';
	if (!window || (window && window.self !== window.top))
		return;

	var document = window.document;

	var gbBox = document.querySelector('#sbds');
	if (!gbBox)
		return;

	var onClick = function() {
		// домены Яндекса: ru, ua, by, kz, com, com.tr
		var subdomain = '',
		tld = /*'com'*/'ru',
		tlds = [/*'ru', */'ua', 'by', 'kz', 'tr'],
		ex_com = ['tr'],
		fixTld, url, win, searchText, searchInput;
		searchInput = document.querySelector('#lst-ib');
		if (searchInput && searchInput.value) {
			searchText = document.querySelector('#lst-ib').value;
		}
		else {
			return;
		}
		if (document.querySelector('#qbi'))
			subdomain = 'images.';
		try {
			fixTld = document.domain.match(/^www\.google\.(com?\.)?([a-z]+)$/)[2];
			if (tlds.indexOf(fixTld) !== -1) {
				tld = fixTld;
				if (ex_com.indexOf(tld) !== -1)
					tld = tld.replace(/(\w{2})/, 'com.$1');
			}
		}
		catch (ex) {};
		url = 'https://' + subdomain + 'yandex.' + tld + '/yandsearch?text=' +
			encodeURIComponent(searchText);
		win = window.open(url, '_blank');
	};

	var addButton = function() {
		var cssStyle = document.createElement('style');
		cssStyle.type = 'text/css';
		cssStyle.textContent = [
			'#sbds > * {',
			'	display: inline-block;',
			'	vertical-align: top;',
			'}',
			'#gbqfb2 {',
			'	color: #000;',
			'	border: 1px solid #3079ED;',
			'	border-radius: 2px;',
			'	background-color: #4D90FE;',
			'	background-image: -moz-linear-gradient(center top , #4D90FE, #4787ED);',
			'	background-image: linear-gradient(center top , #4D90FE, #4787ED);',
			'	font-size: 1em;',
			'	font-weight: bold;',
			'	height: 30px;',
			'}',
			'#gbqfb2:hover {',
			'	background-color:#357ae8;',
			'	background-image: -moz-linear-gradient(top,#4d90fe,#357ae8);',
			'	background-image: linear-gradient(top,#4d90fe,#357ae8);',
			'	border:1px solid #2f5bb7;',
			'}',
			'#gbqfb2 > .yandex-button-white {',
			'	color: #fff;',
			'}',
			'#gbqfb2 > .yandex-button-red {',
			'	color: hsl(0, 100%, 65%);',
			'}'
		].join('\n');
		document.head.appendChild(cssStyle);

		var localPage = (function() {
			var pageLangRU = (document.domain.match(/\w+$/)[0] === 'ru') ? true : false;
			var y = 'Я';
			var andex = 'ндекс';
			if (!pageLangRU) {
				y = 'Y';
				andex = 'andex';
			}
			return {
				y: y,
				andex: andex
			};
		})();

		var buttonBox = document.createElement('div');
		buttonBox.innerHTML = [
			'<button id="gbqfb2" aria-label="Поиск в Яндекс" name="btnY">',
				'<span class="yandex-button-red">' + localPage.y + '</span>',
				'<span class="yandex-button-white">' + localPage.andex + '</span>',
			'</button>'
		].join('');

		var button = buttonBox.querySelector('#gbqfb2');
		button.onclick = onClick;

		gbBox.appendChild(buttonBox);
	};

	if (document.readyState === 'complete') {
		addButton();
	}
	else {
		window.addEventListener('load', function pageLoaded(e) {
			window.removeEventListener('load', pageLoaded, false);
			addButton();
		}, false);
	}
})(window);
