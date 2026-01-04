// ==UserScript==
// @name         Google Translate: Quick language links
// @namespace    gqqnbig
// @version      1.0
// @description  Add quick translation pairs to Google Translate. Users can define their own pairs.
// @match        https://translate.google.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555294/Google%20Translate%3A%20Quick%20language%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/555294/Google%20Translate%3A%20Quick%20language%20links.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const quickLinks = [
		['en', 'zh-CN', 'English -> Chinese'],
		['fr', 'zh-CN', 'French -> Chinese'],
	];

	function buildHref(sl, tl) {
		// copy current query params and override sl/tl
		const params = new URLSearchParams(window.location.search);
		params.set('sl', sl);
		params.set('tl', tl);
		return `${window.location.origin}/?${params.toString()}`;
	}

	function makeLink(id, text, href) {
		const a = document.createElement('a');
		a.id = id;
		a.href = href;
		a.textContent = text;
		a.setAttribute('style', "margin-right: 0.5em;border-color: rgb(218,220,224);border-width: 1px;border-style: solid;padding: 6px 15px;border-radius: 4px;");
		return a;
	}

	function insertLinksIntoNav(nav) {
		if (!nav) return;

		quickLinks.forEach(ln => {
			const id = `gm-translate-${ln[0]}-${ln[1]}`;
			if (document.getElementById(id))
				return;

			const href = buildHref(ln[0], ln[1]);
			const link = makeLink(id, ln[2], href);
			nav.appendChild(link);
		});
	}

	setInterval(() => {
		const nav = document.querySelectorAll('nav')[0];
		if (nav) insertLinksIntoNav(nav);
	}, 2000);
})();