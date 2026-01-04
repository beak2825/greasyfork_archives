// ==UserScript==
// @name			IMDB Youtube Links
// @description		Add Youtube links to IMDB
// @namespace		IMDB_youtube
// @version			8.2
// @copyright		2026, alike03 (https://openuserjs.org/users/alike03)
// @icon			https://www.imdb.com/favicon.ico
// @include			https://*.imdb.com/title/*
// @include			https://*.imdb.com/*/title/*
// @grant			GM.getValue
// @grant			GM.setValue
// @license 		MIT
// @downloadURL https://update.greasyfork.org/scripts/558902/IMDB%20Youtube%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/558902/IMDB%20Youtube%20Links.meta.js
// ==/UserScript==

if (
    window.location.pathname.split('/')[1] === 'title' ||
    window.location.pathname.split('/')[2] === 'title'
) {
	window.addEventListener('load', () => {
		initParents();
		loadChannels();

		document.head.appendChild(script);
	});
}

function initParents() {
	const parents = document.querySelectorAll('ul.ipc-metadata-list.ipc-metadata-list--dividers-all.title-pc-list');

	const channels = document.createElement('li');
	channels.setAttribute('class', 'ipc-metadata-list__item alikeChannels');
	parents[0].appendChild(channels);

	const mobile = document.createElement('li');
	mobile.setAttribute('class', 'ipc-metadata-list__item alikeMobile');
	parents[1].appendChild(mobile);
}


async function loadChannels() {
	const span = document.createElement('span');
	span.setAttribute('class', 'ipc-metadata-list-item__label');
	span.textContent = 'Links';

	const div = document.createElement('div');
	div.setAttribute('class', 'ipc-metadata-list-item__content-container');
	// div.setAttribute('style', 'width: calc(100% - 75px); padding-top: .75rem');
	div.setAttribute('style', 'width: calc(100% - 75px)');

	const ul = document.createElement('ul');
	ul.setAttribute('class', 'ipc-inline-list--show-dividers');
	div.appendChild(ul);

	const template = document.createElement('li');
	template.setAttribute('class', 'ipc-inline-list__item');

	const all = createButton('OPEN ALL', '#', template, 'all function');
	ul.appendChild(all);

	await GM.getValue('channels').then(function (channels) {

		try {
			if (channels !== undefined) {
				const title = document.querySelector('h1').textContent;
				const json = JSON.parse(channels);

				Object.keys(json).forEach(async name => {
					let url = json[name];
					url = url.replace('_TITLE_', title);
					const listItem = createButton(name, url, template);
					ul.appendChild(listItem);
				});
			}
		} catch (e) {
			console.error(e);
			if (confirm(e.message + '\n\n Do you want to reset the channels?')) {
				GM.setValue('channels', JSON.stringify([]));
			}
		}
	});

	const edit = createButton('+ Edit', '#', template, 'edit function');
	ul.appendChild(edit);

	const main = document.querySelector('.alikeChannels');
	const mobile = document.querySelector('.alikeMobile');

	[main, mobile].forEach((parent, i) => {
		// clone node and also copy event listeners
		const cloneSpan = span.cloneNode(true);
		const cloneDiv = div.cloneNode(true);

		// apply events after cloning to preserve event listeners
		cloneDiv.querySelector('.all').addEventListener('click', function (e) {
			e.preventDefault();
			// open all links in new tabs
			const links = e.currentTarget.closest('ul').querySelectorAll('a:not(.function)');
			links.forEach(link => {
				window.open(link.href, '_blank');
			});
		});
		cloneDiv.querySelector('.edit').addEventListener('click', async function () {
			const current = await GM.getValue('channels');
			const channels = prompt('Enter Json. Use _TITLE_ as placeholder for movie title.', current);

			if (!channels) return;
			GM.setValue('channels', channels);

			document.querySelectorAll('li > *').forEach(node => {
				node.remove();
			});
			loadChannels();
		});

		parent.appendChild(cloneSpan);
		parent.appendChild(cloneDiv);
	});
}

function createButton(name, url, template, cClass = '') {
	const link = document.createElement('a');
	link.setAttribute('class', 'ipc-metadata-list-item__list-content-item--link ' + cClass);
	link.setAttribute('role', 'button');

	if (url !== '#') {
		link.setAttribute('target', '_blank');
	}
	link.setAttribute('href', url);
	link.textContent = name;

	const listItem = template.cloneNode(true);
	listItem.appendChild(link);
	return listItem;
}