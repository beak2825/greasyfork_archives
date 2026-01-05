// ==UserScript==
// @name        SideTracked Series Stats
// @namespace   http://www.cryotest.com/
// @description Adds your SideTracked stats badge onto your profile page and SideTracked cache pages on geocaching.com.
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @copyright   2015-2020, Cryo99
// @attribution SideTracked stats provided by Chris AKA Bus.Stop (http://www.sidetrackedseries.info/)
// @attribution Icon image extracted from the SideTracked banner by Chris AKA Bus.Stop
// @icon        https://raw.githubusercontent.com/Cryo99/SideTrackedStats/master/icon48.png
// @icon64      https://raw.githubusercontent.com/Cryo99/SideTrackedStats/master/icon64.png
// @include     /^https?://www\.geocaching\.com/(account/dashboard|my|default|geocache|profile|seek/cache_details|p)/
// @exclude     /^https?://www\.geocaching\.com/(login|about|articles|myfriends)/
// @version     1.0.1
// @supportURL	https://github.com/Cryo99/SideTrackedStats
// @require     https://greasyfork.org/scripts/389508-gc-stats-banner-library/code/GC%20Stats%20Banner%20Library.js?version=880219
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/9660/SideTracked%20Series%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/9660/SideTracked%20Series%20Stats.meta.js
// ==/UserScript==


(function (){
	"use strict";

	var cfg = {
		cacheTitles: ['SideTracked', 'side tracked'],
		callerVersion: GM_info.script.version,
		elPrefix: 'sts',
		imgScript: 'st_F_award.php',
		seriesName: 'SideTracked Series',
		seriesURL: 'sidetrackedseries.info',
		seriesLevels: ['Awards', 'Levels', 'Jobs', 'None'],
		seriesLevelDefault: 'Jobs'
	}
    new GCStatsBanner(cfg).init();
}());
