// ==UserScript==
// @name            TrakTheSources
// @namespace       http://tribuadore.github.io/TrakTheSources
// @version         0.5.1
// @author          Tribuadore
// @description     Sources movies and tv episodes for Trakt.tv
// @domain          trakt.tv
// @domain          raw.github.com
// @include         http://trakt.tv/*
// @include         https://trakt.tv/*
// @grant           GM_xmlhttpRequest
// @run-at          document-end
// @noframes
// @license         MIT License
// @downloadURL https://update.greasyfork.org/scripts/8675/TrakTheSources.user.js
// @updateURL https://update.greasyfork.org/scripts/8675/TrakTheSources.meta.js
// ==/UserScript==

var aggregators = {};

aggregators.Primewire = {

	URL: 'https://www.primewire.ag',

	search: function (media) {

		httpGet(aggregators.Primewire.URL + '/index.php?search_keywords=' + media.title, aggregators.Primewire.index, media);

	},

	index: function (doc, media) {

		var pages = doc.evaluate('//div[contains(@class, "index_item")]/a[starts-with(@title, "Watch ' + media.title + '")]', doc.body, null, XPathResult.ANY_TYPE);
		var matches = 0;

		for (var page = pages.iterateNext(); page; page = pages.iterateNext()) {

			if ((new RegExp(' \\(' + media.year + '\\)$')).test(page.getAttribute('title'))) {

				++matches;
				httpGet(aggregators.Primewire.URL + page.getAttribute('href'), media.isEpisode ? aggregators.Primewire.episodes : aggregators.Primewire.sources, media);

			}

		}

		if (matches === 0) {
			return actions.searchShortendTitle(aggregators.Primewire.search, media);
		}

	},

	episodes: function (doc, media) {

		var episodes = document.evaluate('//div[@class="tv_episode_item"]/a', doc.body, null, XPathResult.ANY_TYPE);
		var seasonNo = parseInt(media.seasonNo, 10);
		var episodeNo = parseInt(media.episodeNo, 10);

		for (var episode = episodes.iterateNext(); episode; episode = episodes.iterateNext()) {

			var href = episode.getAttribute('href');

			if ((new RegExp('/[^/]+/season-' + seasonNo + '-episode-' + episodeNo)).test(href)) {

				return httpGet(aggregators.Primewire.URL + href, aggregators.Primewire.sources, media);

			}

		}

		return actions.searchShortendTitle(aggregators.Primewire.search, media);

	},

	sources: function (doc, media) {

		var links = document.evaluate('//table[@class="movie_version"]', doc.body, null, XPathResult.ANY_TYPE);

		for (var link = links.iterateNext(); link; link = links.iterateNext()) {

			var quality = document.evaluate('.//td[1]/span/@class', link, null, XPathResult.STRING_TYPE).stringValue;

			if (quality === 'quality_dvd') {

				if (document.evaluate('.//td[3]/span/script/text()', link, null, XPathResult.STRING_TYPE).stringValue !== 'Promo Host') {

					return actions.showExternalLink(doc.url, 'PRIMEWIRE');

				}

			}

		}

	}

};


aggregators.Icefilms = {

	URL: 'https://www.icefilms.info',

	search: function (media) {

		var letter = media.title.toLowerCase().replace('the ', '').replace('a ', '').replace(' ', '')[0].toUpperCase();

		httpGet(aggregators.Icefilms.URL + '/' + (media.isMovie ? 'movies' : 'tv') + '/a-z/' + letter, aggregators.Icefilms.index, media);

	},

	index: function (doc, media) {

		var pages = doc.evaluate('//a[starts-with(text(), "' + media.title + '")]', doc.body, null, XPathResult.ANY_TYPE);
		var matches = 0;
		
		for (var page = pages.iterateNext(); page; page = pages.iterateNext()) {

			if ((new RegExp(' \\(' + media.year + '\\)$')).test(page.textContent)) {

				++matches;
				httpGet(aggregators.Icefilms.URL + page.getAttribute('href'), media.isEpisode ? aggregators.Icefilms.episodes : aggregators.Icefilms.sources, media);

			}

		}

		if (matches === 0) {
			return actions.searchShortendTitle(aggregators.Icefilms.search, media);
		}

	},

	episodes: function (doc, media) {

		var episodes = document.evaluate('//a[starts-with(@href, "/ip\.php\?v=")]', doc.body, null, XPathResult.ANY_TYPE);

		for (var episode = episodes.iterateNext(); episode; episode = episodes.iterateNext()) {
			
			if ((new RegExp('^' + media.seasonNo + 'x' + media.episodeNo + ' ')).test(episode.textContent)) {

				return httpGet(aggregators.Icefilms.URL + episode.getAttribute('href'), aggregators.Icefilms.sources, media);

			}

		}

	},

	sources: function (doc, media) {

		if (doc.getElementById('videoframe')) {
			actions.showExternalLink(doc.url, 'ICEFILMS');
		}

	}

};


var actions = {};

actions.showExternalLink = function (url, label) {

	var nav = document.evaluate('//section[@id="info-wrapper"]/div[@class="container"]/div[1]/div[1]/div[1]/ul[@class="external"]', document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
	var li = document.createElement('li');
	li.innerHTML = '<a href="' + url + '" target="_blank">' + label + '<div class="fa fa-external-link"></div></a>';
	nav.appendChild(li);

};


actions.searchShortendTitle = function (search, media) {

	var words = media.title.split(' ');

	if (words.length > 1) {
		words.splice(0, 1);
		media.title = words.join(' ');
		search(media);
	}

};


var httpGet = function (url, onload, data) {

	GM_xmlhttpRequest({
		method: 'GET',
		url: url,
		onload: function (response) {
			if (response.status === 200) {
				var doc = document.implementation.createHTMLDocument();
				doc.documentElement.innerHTML = response.responseText;
				doc.url = url;
				onload(doc, data);
			}
		}
	});

};


var traktUrl;

var trakTheSources = function () {
	
	// If URL hasn't change since last check, don't check again
	if (traktUrl === window.location.href) return;

	traktUrl = window.location.href;
	
	// Remove none VIP Ads
	document.querySelector('[id="huckster-desktop-wrapper"]').style.display = 'none';
	document.querySelector('[id="huckster-desktop-bottom"]').style.display = 'none';

	var media = {
		isMovie: /^https?:\/\/trakt\.tv\/movies\//.test(traktUrl),
		isEpisode: /^https?:\/\/trakt\.tv\/shows\//.test(traktUrl)
	};

	if (media.isMovie) {

		var title = /^(.*) \((\d+)\)/.exec(document.title);

		media.title = title[1];
		media.year = title[2];

	} else if (media.isEpisode) {

		var title = /^(.*) (\d+)x(\d+) (&quot;|")(.*)(&quot;|")/.exec(document.title);

		media.title = title[1];
		media.year = '\\d+';
		media.seasonNo = title[2];
		media.episodeNo = title[3];
		media.episodeName = title[5];

	} else {

		return;

	}

	var aggregatorNames = Object.getOwnPropertyNames(aggregators);

	for (var nameIndex in aggregatorNames) {

		aggregators[aggregatorNames[nameIndex]].search(JSON.parse(JSON.stringify(media)));

	}

};

setInterval(trakTheSources, 1000);
