// ==UserScript==
// @name        Remove Links
// @namespace   mos.org
// @description removes links on logo
// @include     http://static.studio.code.org/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6934/Remove%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/6934/Remove%20Links.meta.js
// ==/UserScript==

var finished = document.getElementsByClassName("header_finished_link")[0];
finished.getElementsByTagName('a')[0].href="http://static.studio.code.org/";

var logo = document.getElementsByClassName("header_logo")[0];
logo.getElementsByTagName('a')[0].href="#";