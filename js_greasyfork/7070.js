// ==UserScript==
// @name	The Archive.org Cleaner
// @description	Archive.org Remove Money Request banner
// @namespace	http://userscripts.org/users/torin
// @include	*web.archive.org*
// @include	*wayback.archive.org*
// @version	1.1
// @require	https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @license	freeware
// @downloadURL https://update.greasyfork.org/scripts/7070/The%20Archiveorg%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/7070/The%20Archiveorg%20Cleaner.meta.js
// ==/UserScript==
$('#donate-banner').remove();