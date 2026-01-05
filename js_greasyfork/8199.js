// ==UserScript==
// @name         Imdb Thread Auto-View
// @version      1.0
// @description  Auto-expand the thread comments in Imdb Message Boards
// @author       softwareresearchwork
// @match        http://*.imdb.com/*/board/thread/*
// @match        http://*.imdb.com/board/*/thread/*
// @grant        none
// @namespace https://greasyfork.org/users/9306
// @downloadURL https://update.greasyfork.org/scripts/8199/Imdb%20Thread%20Auto-View.user.js
// @updateURL https://update.greasyfork.org/scripts/8199/Imdb%20Thread%20Auto-View.meta.js
// ==/UserScript==

var elem = document.querySelector("a.mode-nest");
elem && elem.click();