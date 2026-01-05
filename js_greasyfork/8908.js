// ==UserScript==
// @name       Isohunt- remove sponsored links from search
// @version    1.0
// @description  remove fake search results that are actually sponsored ads
// @match      https://*isohunt.to/*
// @copyright  2015+, AJ
// @namespace https://greasyfork.org/users/10111
// @downloadURL https://update.greasyfork.org/scripts/8908/Isohunt-%20remove%20sponsored%20links%20from%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/8908/Isohunt-%20remove%20sponsored%20links%20from%20search.meta.js
// ==/UserScript==
$('tr:contains("Sponsored")').remove()