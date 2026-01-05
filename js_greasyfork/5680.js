// ==UserScript==
// @name         Hummingbird User Compare
// @namespace    https://greasyfork.org/users/649
// @version      3.1.4
// @description  Adds a button that compares the anime list of a hummingbird user against yours
// @author       kufii, fuzetsu
// @match        *://hummingbird.me/*
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=122976
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/5680/Hummingbird%20User%20Compare.user.js
// @updateURL https://update.greasyfork.org/scripts/5680/Hummingbird%20User%20Compare.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var SCRIPT_NAME = 'Hummingbird User Compare';
	var BTN_ID = 'huc-compare-button';
	var COMPAT_ID = 'huc-compat-table';
	var ANIME_ID = 'huc-anime';
	var MANGA_ID = 'huc-manga';
	var USERNAME_SELECTOR = 'h2.username';
	var CACHE = {};

	var Util = {
		log: function() {
			var args = [].slice.call(arguments);
			args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold');
			console.log.apply(console, args);
		},
		q: function(query, context) {
			return (context || document).querySelector(query);
		},
		qq: function(query, context) {
			return [].slice.call((context || document).querySelectorAll(query));
		},
		shallowTextContent: function(elem) {
			var child = elem.firstChild,
					texts = [];

			while (child) {
				if (child.nodeType == 3) {
					texts.push(child.data);
				}
				child = child.nextSibling;
			}

			return texts.join("");
		},
		getJSON: function(url, load, error) {
			var xhr = new XMLHttpRequest();
			xhr.open('get', url);
			xhr.responseType = 'json';
			xhr.onload = function() {
				load(xhr.response);
			};
			xhr.onerror = error;
			xhr.send();
		}
	};

	var hb = {
		getCompareUrl: function() {
			var you = Util.q('.dropdown-menu > li > a').href.match(/users\/([^\/]+)\/library/i)[1];
			var them = Util.shallowTextContent(Util.q(USERNAME_SELECTOR)).trim();
			return {
				you: you,
				them: them,
				url: 'http://fuzetsu.github.io/hummingbird-user-compare/?user1=' + you + '&user2=' + them
			};
		},
		getCompatibility: function(callback) {
			var buffer = [];

			var process = function(data) {
				buffer.push(data);
				if(buffer.length === 2) {
					var anime, manga;
					if (buffer[0].type === 'anime') {
						anime = buffer[0];
						manga = buffer[1];
					} else {
						anime = buffer[1];
						manga = buffer[0];
					}
					CACHE[you + '+' + them] = { anime: anime, manga: manga };
					callback(anime, manga);
				}
			};

			var compare = hb.getCompareUrl();
			var you = compare.you;
			var them = compare.them;

			var cached = CACHE[you + '+' + them];
			if(cached) {
				Util.log('using cached compat score');
				callback(cached.anime, cached.manga);
			}

			// get anime compat
			Util.getJSON('https://hbird-cmp-node.herokuapp.com/compatibility/anime?user1=' + you + '&user2=' + them, process);
			// get manga compat
			Util.getJSON('https://hbird-cmp-node.herokuapp.com/compatibility/manga?user1=' + you + '&user2=' + them, process);
		},
		getTable: function() {
			var table = document.createElement('table');
			table.id = COMPAT_ID;
			table.style.position = 'absolute';
			table.style.bottom = '-25px';
			table.style.right = '0';

			var types = [{
				type: 'Anime:',
				id: ANIME_ID
			}, {
				type: 'Manga:',
				id: MANGA_ID
			}];

			types.forEach(function(type) {
				var tr = document.createElement('tr');

				var tdType = document.createElement('td');
				tdType.textContent = type.type;
				tdType.style.textAlign = 'right';
				tdType.style.paddingRight = '5px';
				tr.appendChild(tdType);

				var tdValue = document.createElement('td');
				tdValue.id = type.id;
				tdValue.style.fontWeight = 'bold';
				tr.appendChild(tdValue);

				table.appendChild(tr);
			});

			return table;
		},
		getMessage: function(data) {
			var msg = data.phrase;
			if (data.value) {
				msg += ' (' + data.percent + ')';
			}
			return msg;
		}
	};

	Util.log('Started, waiting for user page...');

	waitForUrl(/^https?:\/\/hummingbird\.me\/users/, function() {
		// not signed in
		if(Util.q('.signup-cta')) {
			Util.log('User not logged in.');
			return;
		}

		var url = location.href;

		Util.log('Found user page, waiting for button area...');
		waitForElems('.user-cover-options .follow-button:not(#' + BTN_ID + ')', function(btnFollow) {
			var compare = hb.getCompareUrl();
			var btn = Util.q('#' + BTN_ID);
			var compat = Util.q('#' + COMPAT_ID);
			// exit early if you're on your own profile
			if (compare.you === compare.them) {
				Util.log('On user\'s own profile.');
				// cleanup
				if (btn) {
					btn.remove();
					btn = null;
				}
				if (compat) {
					compat.remove();
					compat = null;
				}
				return;
			}

			Util.log('Found button area. Adding button and compat table...');

			var container = btnFollow.parentNode;

			if (!btn) {
				btn = document.createElement('a');
				btn.className = btnFollow.className;
				btn.id = BTN_ID;
				btn.textContent = 'Compare';
				btn.target = '_blank';
				btn.setAttribute('style', 'right: ' + (btnFollow.clientWidth + 10) + 'px; background: rgb(236, 134, 97); color: white;');
				container.appendChild(btn);
			}
			btn.href = compare.url;

			if (!compat) {
				compat = hb.getTable();
				container.appendChild(compat);
			}
			var animeNode = Util.q('#' + ANIME_ID, compat);
			var mangaNode = Util.q('#' + MANGA_ID, compat);

			animeNode.textContent = mangaNode.textContent = 'Loading...';

			Util.log('Getting compatibility...');
			hb.getCompatibility(function(anime, manga) {
				// don't output if the url has changed
				if (location.href === url) {
					animeNode.textContent = hb.getMessage(anime);
					mangaNode.textContent = hb.getMessage(manga);
				}
			});
		}, true);
	});
})();
