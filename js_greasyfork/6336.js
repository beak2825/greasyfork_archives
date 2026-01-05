// ==UserScript==
// @name        A-P Links
// @description Adds useful links to other manga\anime pages for viewed entries
// @namespace   http://localhost
// @include     http://www.anime-planet.com/manga/*
// @include     http://www.anime-planet.com/anime/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6336/A-P%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/6336/A-P%20Links.meta.js
// ==/UserScript==
$(function()
{
	function redirect(link)
	{
		var uriSite;
		uriSite = '<meta http-equiv=refresh content=\"0;url=' +encodeURIComponent(link)+ '\">';
		return 'data:text/html;charset=utf-8,' + uriSite;
	}

	var title = $('h1').html().trim();
	var entry = $('.pure-u-16-24');
	if (entry.length > 0)
	{
		var pageNames = new Array();
		var pageAdressBeginning = new Array();
		var pageAdressMiddlePart = new Array();
		if (window.location.href.indexOf('http://www.anime-planet.com/manga') == 0)
		{
			// Baka-Updates Manga link
			pageNames.push("Baka-Updates Manga");
			pageAdressBeginning.push("http://www.mangaupdates.com/series.html?search=");
			pageAdressMiddlePart.push("");
			
			//MAL
			pageNames.push("MAL");
			pageAdressBeginning.push("http://myanimelist.net/manga.php?q=");
			pageAdressMiddlePart.push("");
		}
		
		if (window.location.href.indexOf('http://www.anime-planet.com/anime') == 0)
		{
			// AnimeDB link
			pageNames.push("AnimeDB");
			pageAdressBeginning.push("http://anidb.net/perl-bin/animedb.pl?show=animelist&adb.search=");
			pageAdressMiddlePart.push("&do.search=search");
			
			//MAL
			pageNames.push("MAL");
			pageAdressBeginning.push("http://myanimelist.net/anime.php?q=");
			pageAdressMiddlePart.push("");
		}
		
		// Common links
		// Wikipedia link
		pageNames.push("Wikipedia");
		pageAdressBeginning.push("http://en.wikipedia.org/w/index.php?title=Special%3ASearch&search=");
		pageAdressMiddlePart.push("&button=");
		
		// TV Tropes link
		pageNames.push("TV Tropes");
		pageAdressBeginning.push("http://tvtropes.org/pmwiki/search_result.php?cx=partner-pub-6610802604051523%3Aamzitfn8e7v&cof=FORID%3A10&ie=ISO-8859-1&q=");
		pageAdressMiddlePart.push("&siteurl=tvtropes.org%2Fpmwiki%2Fpmwiki.php%2FMain%2FHomePage&ref=www.google.pl%2Furl%3Fsa%3Dt%26rct%3Dj%26q%3Dtv%2Btropes%26source%3Dweb%26cd%3D1%26ved%3D0CGAQFjAA%26url%3Dhttp%253A%252F%252Ftvtropes.org%252F%26ei%3DgkrDT-njL9TO4QSs8PzWCQ%26usg%3DAFQjCNFXyqvffDkbQu7TCFs8F8Ymx_WHng");
		
		var container = $(document.createElement('div'));
		// Add links to the linksTab
		for (var i = 0; i < pageNames.length; i++)
		{
			container.append("<a href='" + redirect(pageAdressBeginning[i] + title + pageAdressMiddlePart[i]) + "'>" + pageNames[i] + '</a><br/>');
		}
		entry.append('<h3 class="main">Links</h3>');
		entry.append(container);
	}
});