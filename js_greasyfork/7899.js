// ==UserScript==
// @name           Auto-Load Vote Counts
// @author         AstroCB
// @description  Automatically loads SE vote counts if user holds that privilege
// @version        1.0
// @namespace  https://github.com/AstroCB
// @include        http://*.stackexchange.com/questions/*
// @include        http://stackoverflow.com/questions/*
// @include        http://meta.stackoverflow.com/questions/*
// @include        http://serverfault.com/questions/*
// @include        http://meta.serverfault.com/questions/*
// @include        http://superuser.com/questions/*
// @include        http://meta.superuser.com/questions/*
// @include        http://askubuntu.com/questions/*
// @include        http://meta.askubuntu.com/questions/*
// @include        http://stackapps.com/questions/*
// @include        http://*.stackexchange.com/posts/*
// @include        http://stackoverflow.com/posts/*
// @include        http://meta.stackoverflow.com/posts/*
// @include        http://serverfault.com/posts/*
// @include        http://meta.serverfault.com/posts/*
// @include        http://superuser.com/posts/*
// @include        http://meta.superuser.com/posts/*
// @include        http://askubuntu.com/posts/*
// @include        http://meta.askubuntu.com/posts/*
// @include        http://stackapps.com/posts/*
// @exclude        http://*.stackexchange.com/questions/tagged/*
// @exclude        http://stackoverflow.com/questions/tagged/*
// @exclude        http://meta.stackoverflow.com/questions/tagged/*
// @exclude        http://serverfault.com/questions/tagged/*
// @exclude        http://meta.serverfault.com/questions/*
// @exclude        http://superuser.com/questions/tagged/*
// @exclude        http://meta.superuser.com/questions/tagged/*
// @exclude        http://askubuntu.com/questions/tagged/*
// @exclude        http://meta.askubuntu.com/questions/tagged/*
// @exclude        http://stackapps.com/questions/tagged/*
// @downloadURL https://update.greasyfork.org/scripts/7899/Auto-Load%20Vote%20Counts.user.js
// @updateURL https://update.greasyfork.org/scripts/7899/Auto-Load%20Vote%20Counts.meta.js
// ==/UserScript==
var x = 0;

function loadVotes() {
	if (document.getElementsByClassName("vote-count-post")) {
		if (x < document.getElementsByClassName("vote-count-post").length) {
			document.getElementsByClassName("vote-count-post")[x].click();
			x++;
		} else {
			clearInterval(interval);
		}
	}
}

var interval = setInterval(loadVotes, 1050); // Technically, they can be loaded every second, but this is just to be safe