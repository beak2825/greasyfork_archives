// ==UserScript==
// @name       		Hamsteak stylin'
// @namespace  		Miyako.namespace.goes.here
// @version   		1.0
// @description  	Changes the font and pesterlog boxes
// @include             http://www.mspaintadventures.com/*
// @require 		https://code.jquery.com/jquery-latest.min.js
// @copyright  		2014+, Miyako
// @downloadURL https://update.greasyfork.org/scripts/5657/Hamsteak%20stylin%27.user.js
// @updateURL https://update.greasyfork.org/scripts/5657/Hamsteak%20stylin%27.meta.js
// ==/UserScript==
$('center div:nth-child(2)').attr("style", "border: 1px solid black; padding: 1px");
$(".spoiler").attr("style", "display: none");
$(".button").attr("style", "background: #000; color: #fff; transition: background .4s ease 0s; border: none; border-radius: 8px; padding: 10px 20px; outline: none; font-family:helvetica neue, arial, sans-serif; font-size: 16px");
$("p[style*='courier']").attr("style", "font-family: garamond, times new roman, serif; font-size: 20px; font-weight: bold");
$("font[size='5'] a").attr("style", "font-family: garamond, times new roman, serif; font-size: 30px; font-weight: bold; color: #000");
$(".postlink").attr("style", "font-family: garamond, times new roman, serif; font-size: 30px; font-weight: bold; color: #000");