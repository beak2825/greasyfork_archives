// ==UserScript==
// @name          Bibliotik: Add Overdrive Requests Menu Link
// @version       1.0.1
// @author        phracker
// @namespace     https://github.com/phracker
// @description   Adds a link to Overdrive requests to the menu.
// @include       http*://bibliotik.org/
// @include       http*://bibliotik.org/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/6785/Bibliotik%3A%20Add%20Overdrive%20Requests%20Menu%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/6785/Bibliotik%3A%20Add%20Overdrive%20Requests%20Menu%20Link.meta.js
// ==/UserScript==

var li = document.createElement('li');
var a = document.createElement('a');
a.href = 'https://bibliotik.org/requests/?search=%40tags+overdrive&retail=any&orderby=added&order=desc&hide_filled=1';
a.textContent = 'OD Requests';
li.appendChild(a);

document.getElementById('pre_header_nav').appendChild(li);