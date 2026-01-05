// ==UserScript==
// @name        Dagens Industri banner shrinker
// @namespace   di.se
// @description Resizes the giant banner to a more respectable size
// @include     http://www.di.se/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8792/Dagens%20Industri%20banner%20shrinker.user.js
// @updateURL https://update.greasyfork.org/scripts/8792/Dagens%20Industri%20banner%20shrinker.meta.js
// ==/UserScript==
var framesetTop = document.querySelector('html > frameset');
framesetTop.rows = '0,55,*';
