// ==UserScript==
// @name           Filmweb.pl - Show friends’ ratings in a side panel
// @name:pl        Filmweb.pl - Otwórz opinie znajomych w bocznym panelu
// @description    Shows friends’, community, and critics’ ratings in a side panel or in a new tab/window
// @description:pl Przywróć sprawdzanie ocen znajomych/społeczności/krytyków na tej samej stronie w bocznym panelu lub otwórz je w nowej karcie/oknie
// @version        1.0.1
// @author         Pabli
// @namespace      https://github.com/pabli24
// @homepageURL    https://greasyfork.org/scripts/555358-filmweb-pl-show-friends-ratings-in-a-side-panel
// @supportURL     https://greasyfork.org/scripts/555358-filmweb-pl-show-friends-ratings-in-a-side-panel/feedback
// @license        MIT
// @match          https://www.filmweb.pl/*
// @run-at         document-start
// @icon           https://www.google.com/s2/favicons?sz=64&domain=filmweb.pl
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @grant          GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/555358/Filmwebpl%20-%20Show%20friends%E2%80%99%20ratings%20in%20a%20side%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/555358/Filmwebpl%20-%20Show%20friends%E2%80%99%20ratings%20in%20a%20side%20panel.meta.js
// ==/UserScript==

(async () => {
'use strict';

let openIn = await GM_getValue('openin', 'iframe');
const openinRadioOptions = {
	iframe: 'Otwórz w bocznym panelu',
	tab: 'Otwórz w nowej karcie',
	window: 'Otwórz w nowym oknie',
};
let menuCommands = {};
async function updateMenu() {
	Object.keys(menuCommands).forEach(key => GM_unregisterMenuCommand(menuCommands[key]));
	Object.entries(openinRadioOptions).forEach(([key, label]) => {
		menuCommands[key] = GM_registerMenuCommand(
			`${openIn === key ? '◉' : '○'} ${label}`,
			async () => {
				await GM_setValue('openin', key);
				openIn = key;
				updateMenu();
			}
		);
	});
}
updateMenu();

const RATING_LINKS = '.filmRatingSection a[href$="/friends/wts"], .filmRatingSection a[href$="/friends/votes"], .filmRatingSection a[href$="/community/popular"], .filmRatingSection a[href$="/critics"]';
const COMMENT = '.filmOpinionsSection div[id] > div > span+div > div > div:not([data-state]):not(:empty), .staticCommunityOpinionsSection .opinionBoxNew__commentWrapper';
const WIECEJ = 'button[style="margin-left: 0px; bottom: 0px; right: 0px;"], .opinionBoxNew__readMore';

window.addEventListener('click', (e) => {
	if (e.button > 0 || e.altKey || e.metaKey) return;

	expandComment(e);

	if (openIn === 'tab') return;
	clickRatings(e);
}, true);

function clickRatings(e) {
	const link = e.target.closest(RATING_LINKS);
	if (!link) return;

	prevent(e);

	const url = new URL(link.href);
	url.searchParams.append('compact', 'true');

	if (openIn === 'iframe') {
		iframe(url);
	} else if (openIn === 'window') {
		window.open(url, 'window-rating', windowFeatures());
	}
}

function iframe(url) {
	let div = document.querySelector('#iframe-rating');
	if (div) {
		requestAnimationFrame(() => div.classList.toggle('iframe-rating-visible'));
		return;
	}

	div = document.createElement('div');
	div.id = 'iframe-rating';

	const close = document.createElement('button');
	close.id = 'iframe-rating-x';
	close.title = 'Zamknij';

	close.addEventListener('click', (e) => {
		div.classList.remove('iframe-rating-visible');
	});

	const iframe = document.createElement('iframe');
	iframe.src = url;
	iframe.allow = 'fullscreen; encrypted-media';
	iframe.style = 'width: 100%; height: 100%; border: none;';

	div.appendChild(close);
	div.appendChild(iframe);
	document.body.appendChild(div);

	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			div.classList.add('iframe-rating-visible');
		});
	});
}

function newTab(e) {
	if (openIn !== 'tab') return;
	
	let link = e.target.closest(RATING_LINKS);
	if (!link) return;

	link.target = '_blank';
}
document.addEventListener('mouseover', newTab);
document.addEventListener('focusin', newTab);

function expandComment(e) {
	const comment = e.target.closest(COMMENT);
	if (!comment) return;

	prevent(e);

	const wiecej = comment.querySelector(WIECEJ);
	if (!wiecej) return;

	comment.classList.add('expand-comment');

	const commentLink = comment.querySelector('.opinionBoxNew__commentLink');
	if (!commentLink) return;

	commentLink.draggable = false;
}

addStyle( `
	#iframe-rating {
		position: fixed;
		z-index: 999;
		top: 0;
		right: 0;
		width: 400px;
		max-width: 100%;
		height: 100%;
		background: #fff;
		border-left: 1px solid hsl(0, 0%, 93.3%);
		box-shadow: rgba(0, 0, 0, 0.15) 0px -0.25rem 2em;
		transform: translateX(100%);
		transition: transform 240ms ease, opacity 240ms ease;
		opacity: 0;
	}
	#iframe-rating.iframe-rating-visible {
		transform: translateX(0);
		opacity: 1;
	}
	#iframe-rating-x {
		appearance: none;
		position: absolute;
		top: 0.2rem;
		right: 1rem;
		z-index: 99;
		background-color: hsla(0, 0%, 0%, 0.8);
		background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0iI2ZmYzIwMCIgdmlld0JveD0iMCAwIDQ2MC44IDQ2MC44Ij48cGF0aCBkPSJNMjg1IDIzMC40IDQ1Ni4zIDU5LjNjNi02LjEgNi0xNiAwLTIyTDQyMy41IDQuNmExNS42IDE1LjYgMCAwIDAtMjIgMEwyMzAuNCAxNzUuNyA1OS4zIDQuNmExNS42IDE1LjYgMCAwIDAtMjIgMEw0LjYgMzcuM2MtNi4xIDYtNi4xIDE1LjkgMCAyMmwxNzEuMSAxNzEuMUw0LjYgNDAxLjVjLTYuMSA2LTYuMSAxNiAwIDIybDMyLjcgMzIuN2ExNS41IDE1LjUgMCAwIDAgMjIgMGwxNzEtMTcxLjEgMTcxLjIgMTcxLjFhMTUuNiAxNS42IDAgMCAwIDIyIDBsMzIuNy0zMi43YzYtNiA2LTE2IDAtMjJ6Ii8+PC9zdmc+");
		background-size: 1rem;
		background-repeat: no-repeat;
		background-position: center;
		border: 1px solid #ffc200;
		border-radius: 50%;
		width: 2rem;
		height: 2rem;
		transition: background-color 240ms ease;
	}
	#iframe-rating-x:hover {
		background-color: hsla(0, 0%, 0%, 1);
	}
	${COMMENT}, .staticCommunityOpinionsSection .opinionBoxNew__commentLink {
		cursor: text;
		user-select: text;
	}
	.expand-comment > div > div, .expand-comment .opinionBoxNew__comment {
		display: block !important;
		max-height: fit-content !important;
	}
	.expand-comment :is(${WIECEJ}) {
		display: none !important;
	}
`);

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('compact')) {
	addStyle(`
		#mainPageHeader,
		.breadcrumbsSection,
		.filmSubPageHeaderSection,
		.mainTapeMenuSection,
		.filmOpinionsSection__container > section > div > div > div > div:not([id]):has(+[id]),
		.filmOpinionsSection__container > section > div > div > h2,
		.filmPopularInMediaSection,
		footer,
		.faSponsoring, .faPremiumBanner, .faDesktopBillboard {
			display: none !important;
		}
		.filmOpinionsSection__container > section {
			padding-top: 0.5rem !important;
		}
		body, html {
			font-size: 16px !important;
		}
		html {
			scrollbar-width: thin;
			scrollbar-color: #ffc200 #00000000;
		}
		.filmOpinionsSection__container div {
			overflow: hidden !important;
		}
	`);

	function compactParam(e) {
		const link = e.target;
		if ((link.tagName !== 'A' && link.hostname !== 'www.filmweb.pl') || link.dataset.compact) return;

		const url = new URL(link.href);
		url.searchParams.append('compact', 'true');

		link.href = url.toString();
		link.dataset.compact = true;
	}
	document.addEventListener('mouseover', compactParam);
	document.addEventListener('focusin', compactParam);
}

function prevent(e) {
	e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();
}

function windowFeatures() {
	const width = 400;
	const height = 900;
	let left = 0;
	let top = 0;

	left = window.screenLeft + Math.floor(window.screen.width - width);
	top = window.screenTop + Math.floor((window.screen.height - height) / 2);

	return `left=${left},top=${top},width=${width},height=${height}`;
}

function addStyle(css) {
	const style = document.createElement('style');
	style.textContent = css;

	const html = document.documentElement;
	html?.appendChild(style);

	new MutationObserver((_, obs) => {
		if (document.head) {
			obs.disconnect();
			document.head.appendChild(style);
		}
	}).observe(html, { childList: true });
}

})();