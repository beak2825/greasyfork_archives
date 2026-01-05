// ==UserScript==
// @name        imgur-GIF to GIFV
// @namespace 	https://greasyfork.org/users/9009
// @description Turn imgur GIF links into GIFV.
// @version     1.01
// @include		http://i.imgur.com/*
// @include		https://i.imgur.com/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/7989/imgur-GIF%20to%20GIFV.user.js
// @updateURL https://update.greasyfork.org/scripts/7989/imgur-GIF%20to%20GIFV.meta.js
// ==/UserScript==      

if (window.location.href.match(/^https?:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.gif$/)) {
	window.location.replace (window.location.href + "v");
}