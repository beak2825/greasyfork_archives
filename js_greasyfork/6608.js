// ==UserScript==
// @name           Unhide Downvoted Answers
// @author         Cameron Bernhardt (AstroCB)
// @namespace  http://github.com/AstroCB
// @version        1.0
// @description    Hover over greyed-out answers to show them as normal
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
// @downloadURL https://update.greasyfork.org/scripts/6608/Unhide%20Downvoted%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/6608/Unhide%20Downvoted%20Answers.meta.js
// ==/UserScript==
var main = function () {
	$(".downvoted-answer").hover(function (e) {
		$(e.delegateTarget).removeClass("downvoted-answer");
	}, function (e) {
		$(e.delegateTarget).addClass("downvoted-answer");
	});
};

// Inject the main script
var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);