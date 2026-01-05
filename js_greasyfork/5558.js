// ==UserScript==
// @name           4chan Chlorine v2
// @author         Nami!!gAyq5lzi952
// @description    The series of tubes needs drain-o.
// @include        http://boards.4chan.org/*
// @include        https://boards.4chan.org/*
// @include        http://images.4chan.org/*
// @include        https://images.4chan.org/*
// @include        http://sys.4chan.org/*
// @version        2.2.3.5
// @icon           data:image/jpeg;base64,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%3D
// @license        Beerware....or rum-ware. I'm not big on beer. 
// @namespace Nami!!gAyq5lzi952
// @downloadURL https://update.greasyfork.org/scripts/5558/4chan%20Chlorine%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/5558/4chan%20Chlorine%20v2.meta.js
// ==/UserScript==
const spam = new Array("DSFARGEG",
"cuck",
"wmaf",
"ayy lmao",
"Ask a guy",
"ask a guy",
"kill all fags every last one",
"cumskin",
"rate my",
"BM",
"WF",
"VeryProudToBeAsian",
"western cosplayers",
"Rate my",
"r8 my",
"R8 my",
"yfw God exists",
"yfw god exists",
"My name is John",
"plus tip",
"you have been visited by",
"You have been visited by",
"pedosexual",
"average American");
var posts = document.getElementsByTagName("blockquote"), post, pInner;
for(var i = posts.length - 1; i >=0; --i) {
  post = posts[i];
  pInner = post.innerHTML;
	for(var a = spam.length - 1; a >= 0; --a) if(pInner.indexOf(spam[a]) >= 0) {
		post.title = post.textContent;
		post.innerHTML =  "[USER WAS FOUND TO HAVE AUTISM]";
		post.setAttribute("style", "background-color: white; font-weight: bold; color: red; -moz-border-radius: 5px 5px 5px 5px;");
		break;
	}
}
