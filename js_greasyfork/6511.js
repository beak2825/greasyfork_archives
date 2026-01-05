// ==UserScript==
// @name        WD RU UP
// @description Переставляет русскую метку наверх в Викиданных
// @namespace   kf8@
// @include     https://www.wikidata.org/wiki/*
// @version     1
// @grant       none
// @require		https://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/6511/WD%20RU%20UP.user.js
// @updateURL https://update.greasyfork.org/scripts/6511/WD%20RU%20UP.meta.js
// ==/UserScript==

var block = jQuery(".wikibase-fingerprintview-ru");
block.prependTo(block.parent());