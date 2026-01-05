// ==UserScript==
// @name Auto Refresh
// @namespace [173166]-[AutoRefresh]-v1.0.0
// @description This is a simple script, it will refresh the page every x seconds
// @include http://myanimelist.net/clubs.php?id=*
// @CodedBy AyoobAli
// @Website http://www.AyoobAli.com
// @UserScripts http://UserScripts.org/users/AyoobAli
// @license Free
// @version 1.0.0
// @downloadURL https://update.greasyfork.org/scripts/8235/Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/8235/Auto%20Refresh.meta.js
// ==/UserScript==

	//===[Settings]===\\
		var StRefTime = '30';  //==[Set time by seconds]
	//===[/Settings]===\\
    
    if (StRefTime > 0) setTimeout("location.reload(true);",StRefTime*1000);