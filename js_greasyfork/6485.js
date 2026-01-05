// JavaScript Document
// ==UserScript==
// @name             Repeat Youtube
// @description     Script for repeating youtube
// @include         https://youtube.com/*
// @include         https://www.youtube.com/*
// @version 0.1
// @namespace griever.youtuberepeat
// @downloadURL https://update.greasyfork.org/scripts/6485/Repeat%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/6485/Repeat%20Youtube.meta.js
// ==/UserScript==
// ==Griever==
// ==============
// ==Icon==

document.querySelector('video').addEventListener('ended', function(){this.play()});