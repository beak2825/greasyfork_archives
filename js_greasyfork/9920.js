// ==UserScript==
// @name		KissAnime Comments
// @version		2017.09.03
// @icon https://www.dropbox.com/s/ajyj6xlcfowyrtg/favicon.ico?dl=1
// @description	Auto-show comments on episode page.
// @namespace	https://greasyfork.org/en/scripts/9920-kissanime-comments
// @match		*://kissanime.ru/Anime/*/*
// @match		*://kimcartoon.me/Cartoon/*/*
// @match		*://kissasian.ch/Drama/*/*
// @match		*://kissmanga.com/Manga/*/*
// @match		*://readcomiconline.to/Comic/*/*
// @copyright	2015, ck920
// @require		http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/9920/KissAnime%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/9920/KissAnime%20Comments.meta.js
// ==/UserScript==

/*(function() {
    var oldUrl = window.location.href;
	var anime = oldUrl.toLowerCase().includes("kissanime");
	var asian = oldUrl.toLowerCase().includes("kissasian");
	var cartoon = oldUrl.toLowerCase().includes("kimcartoon");
	if (anime == true) {
		var checkServer = oldUrl.toLowerCase().includes("&s=");
		if (checkServer != true) {
			var newUrl = oldUrl + "&s=openload";
			window.location.href = newUrl;
		}
		else {
			var checkServer2 = oldUrl.toLowerCase().includes("&s=default");
			if (checkServer2 == true) {
				var newUrl = oldUrl.replace(/&s=default/ig, '&s=openload');
				window.location.href = newUrl;
			}
			else {
			}
		}
	}
	else if (asian == true || cartoon == true) {
		var checkServer = oldUrl.toLowerCase().includes("&s=");
		if (checkServer != true) {
			var newUrl = oldUrl + "&s=openload";
			window.location.href = newUrl;
		}
		else {
		}
	}
	else {
	}
})();*/

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

(function () {
	var url = window.location.href;
	var cartoon = url.toLowerCase().includes("kimcartoon");
	
	addGlobalStyle('body {width: 100% !important;height: 100% !important;margin:0 !important;padding: 0 !important;overflow-x: hidden !important;}');
	addGlobalStyle('#containerRoot {height: 100% !important;margin:0 !important;padding: 0 !important;}');
	addGlobalStyle('#divMsg + div {display: none !important;height: 0px !important;}');
	addGlobalStyle('.clear, .clear2 {height: 5px !important;}');
	addGlobalStyle('#footer {display: none !important;height: 0 !important;}');
	addGlobalStyle('.clear2 + .clear2 + .clear2 + div {display: none !important;}');
	addGlobalStyle('#centerDivVideo {display: inline-block !important;}');
	addGlobalStyle('#divComments {display: block !important;}');
	addGlobalStyle('.divCloseBut {display: inline;position: static !important;margin-left:10px !important;}');
	addGlobalStyle('.barContent .clear + div {display: none !important;}');
	addGlobalStyle('#container + script + script + script + div {display: none !important;}');
	
	if (cartoon == true) {
	}
	else {
		addGlobalStyle('.clear2 + div {display: none !important;}');
	}
	addGlobalStyle('#divComments .clear2 + div {display: block !important;}');
	addGlobalStyle('div + script + style + script + div {display: none !important;}');
	addGlobalStyle('div + .clear2 + div + .clear2 + div {display: block !important;margin-right:auto;margin-left:auto;}');
	
	addGlobalStyle('iframe {height: 1px !important;filter: alpha(opacity=0) !important;opacity: 0 !important;');
	addGlobalStyle('#divComments iframe, #disqus_thread iframe {height: auto !important;filter: alpha(opacity=100) !important;opacity: 1 !important;');
	addGlobalStyle('.divCloseBut {display: none !important;}');
	addGlobalStyle('#centerDivVideo > #divContentVideo > iframe {height: 100% !important;filter: alpha(opacity=1) !important;opacity: 1 !important;}');
})();

$('#btnShowComments').parent().hide();
$('#divComments').show();

$( ".float-ck" ).remove();
$( "#videoAd" ).remove();
$( ".videoAdClose" ).remove();


var disqus_shortname = 'kissanime';

(function () {
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
})();