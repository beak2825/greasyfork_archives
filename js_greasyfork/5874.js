// ==UserScript==
// @name           Filmtipset Open Advanced Search Result In a New Window
// @namespace      https://github.com/Row/filmtipset-userscripts
// @description    As title
// @version        0.1.1
// @include        http://www.filmtipset.se/advsearch.cgi
// @downloadURL https://update.greasyfork.org/scripts/5874/Filmtipset%20Open%20Advanced%20Search%20Result%20In%20a%20New%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/5874/Filmtipset%20Open%20Advanced%20Search%20Result%20In%20a%20New%20Window.meta.js
// ==/UserScript==

document.forms[1].target = '_blank';