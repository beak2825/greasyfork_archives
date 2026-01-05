// ==UserScript==
// @name        Tubantia without javascript
// @namespace   tubantiawithoutjavascript
// @description Makes it possible to browse tubantia.nl without javascript enabled (noscript)
// @include     http://www.tubantia.nl/*
// @include     https://www.tubantia.nl/*
// @include     http://www.gelderlander.nl/*
// @include     https://www.gelderlander.nl/*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7435/Tubantia%20without%20javascript.user.js
// @updateURL https://update.greasyfork.org/scripts/7435/Tubantia%20without%20javascript.meta.js
// ==/UserScript==
var mydivs = document.getElementsByClassName('dialog-wrapper dialog-no-script');
mydivs.item(0).style.visibility = "hidden";