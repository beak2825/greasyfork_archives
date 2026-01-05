// ==UserScript==
// @name        Dorkly.com DeFrost
// @description Удаление защиты от скачивания картинок
// @include     *dorkly.com/*
// @icon        http://www.dorkly.com/favicon.ico
// @grant       none
// @run-at      document-end
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @version 0.0.1.20150401180633
// @namespace https://greasyfork.org/users/7568
// @downloadURL https://update.greasyfork.org/scripts/8919/Dorklycom%20DeFrost.user.js
// @updateURL https://update.greasyfork.org/scripts/8919/Dorklycom%20DeFrost.meta.js
// ==/UserScript==

$( ".blankimg" ).remove();