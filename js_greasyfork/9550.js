// ==UserScript==
// @name		Streamcloud Downloader
// @version		1.0.1.3
// @description	Allows you to download videos from Streamcloud via the Download button at the upper right corner of the player
// @match		http://streamcloud.eu/*/*.mp4
// @match		http://streamcloud.eu/*/*.mkv
// @match		http://streamcloud.eu/*/*.htm
// @match		http://streamcloud.eu/*/*.html
// @match		http://streamcloud.eu/*/*.avi
// @copyright	2015 comfix
// @icon		http://i.imgur.com/MTTvgbC.png
// @grant       none
// @namespace https://greasyfork.org/users/10905
// @downloadURL https://update.greasyfork.org/scripts/9550/Streamcloud%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/9550/Streamcloud%20Downloader.meta.js
// ==/UserScript==
// Global Vars
var jwplayer_innerHTML = "";
var url = "";

var as = document.getElementsByTagName("a");
var scripts = document.getElementsByTagName("script");

// Mainloop
for(var i=0;i<scripts.length;i++)
{
	// Filestring Isolating
	if(scripts[i].innerHTML.indexOf("jwplayer(\"mediaplayer\").setup({") != -1){
		jwplayer_innerHTML = scripts[i].innerHTML;
		jwplayer_innerHTML = jwplayer_innerHTML.replace("jwplayer(\"mediaplayer\").setup({","").split(",")
		// Filestring Isolated
		url = jwplayer_innerHTML[2].replace("file: \"","").replace("\"","")
		for(var i=0;i<as.length;i++) // Search for StreamTab
		{
			if(as[i].innerHTML == "Stream"){
				// Replace with Download and link.
				as[i].innerHTML = "Download";
				as[i].href=url;
			}
		}
		break;
	}
}
