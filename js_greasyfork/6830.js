// ==UserScript==
// @name        cyberjunk
// @author      vinsai
// @namespace   'vinsai'
// @include     http://cyberjunk.jp/coscos/cgi-bin/cosbd.cgi*
// @version     1.0
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @description test
// @downloadURL https://update.greasyfork.org/scripts/6830/cyberjunk.user.js
// @updateURL https://update.greasyfork.org/scripts/6830/cyberjunk.meta.js
// ==/UserScript==
		
(function()
{
	var urls = $('blockquote > a');
	var blockquote = urls.parent();
	
	$(urls).each(function(index, element) {
//		console.log($(this).html());
//		console.log($(this).attr('href'));
		$(this).html("<img src=" + $(this).attr('href') + " style='max-height:800px;' />");
    });
	$(blockquote).each(function(index, element) {
//		console.log(this);        
    });

	
	/*
	var css =
		'<style type="text/css">\n\
		img {margin: 5px auto;}\n\
		#imagesCollection {display:table-cell;vertical-align:middle;text-align:center;}\n\
		a {color:white;text-align:center;}\n\
		body {background-color:black;width:99%;height:98%;display:table;font-family:"メイリオ",Meiryo;}\n\
		</style>\n';
		
	var plainTextCSS =
		'<style type="text/css">\n\
		#imagesCollection {vertical-align:middle;text-align:left;}\n\
		a {color:white;text-align:left;}\n\
		body {background-color:black;font-family:"メイリオ",Meiryo;}\n\
		</style>\n';	

	var btn = '<p style="text-align:center;"><strong class="newPage"><span onclick="showAll()" style="padding:3px;cursor:pointer;background:rgb(249,249,249);border:1px solid black;">Full size</span></strong></p>';
	
	unsafeWindow.showAll = function() {
		var page = "<html>\n<head>\n<meta charset='utf-8'>\n<title>";
		page += "178 ACG";
		page += '</title>\n'  + css + '</head>\n<body>\n';
		page += '<div id=imagesCollection>\n';

		var a = document.activeElement;

		var target = a.getElementsByTagName('a');
		for (var i = 0; i < target.length; ++i) {
			// First '?'
			var url = target.item(i).href
			if (url.match("http://acg.178.com/s/pic.html?")) {
				url = url.substr(30);
				page += '<a href="' + url + '" target="_blank"><img id="img' + i + '" src=' + url + '></a><br />\n';
			}
		}
		
		page += "</div>\n</body>\n</html>";

		var uriContent = "data:text/html;charset=utf-8," + encodeURIComponent(page);
		window.open(uriContent);		
	}
	
	var p = document.getElementById('text');
	p.insertAdjacentHTML('afterBegin', btn);
//	var button = p.getElementsByTagName('strong').item(0);
//	button.style.cursor = "pointer";
//	var button = document.getElementsByClassName('newPage');
/*
	button.onclick = function() {
		alert("hi");
		showAll();
	}
*/
})();

//===============================================================================
//			- Weekly Auto-Update Check -
//===============================================================================
// CheckForUpdate() will verify if the time has come to look if an update is available.
// CheckVersion() will verify if this script version is the latest available.
//===============================================================================
var script_title = "178 Photos Download";
var source_location = "http://userscripts.org/scripts/source/137129.user.js";
var current_version = "1.0";
var latest_version = " ";
var gm_updateparam = "178PhotosDownload_lastupdatecheck";
var lastupdatecheck = GM_getValue(gm_updateparam, "never");

// a google document is used to store the latest version number (If the version in that file does not match the current_version variable, an update will be triggered)
var version_holder = "http://dl.dropbox.com/u/4978696/userscripts/178.txt";

//Add a command to the menu in case someone wants to manually check for an update.
GM_registerMenuCommand("Better Good Smile->Manually Update", CheckVersion);

//Initiate the download of the new script version.
function GetNewVersion() {
        var today = new Date();
        GM_setValue(gm_updateparam, String(today));
        window.location = source_location;
}

//Verify if it's time to update
function CheckForUpdate()
{	
	var today = new Date();
	var one_day = 24 * 60 * 60 * 1000; //One day in milliseconds

	if(lastupdatecheck != "never")
	{
		today = today.getTime(); //Get today's date
		var lastupdatecheck = new Date(lastupdatecheck).getTime();
		var interval = (today - lastupdatecheck) / one_day; //Find out how much days have passed		

		//If a week has passed since the last update check, check if a new version is available
		if(interval >= 7)			
			CheckVersion();
	}
	else
		CheckVersion();
}

//Make sure we don't have the latest version
function CheckVersion()
{
	GM_xmlhttpRequest({
		    method: 'GET',
		    url: version_holder,
		    headers: {'Content-type':'application/x-www-form-urlencoded'},		    
		    onload: function(responseDetails)
			{
				var line = String(responseDetails.responseText.match(/version=[0-9].[0-9]?[0-9].[0-9]?[0-9]/));				
				
				if(line != null)
				{
					var strSplit = new Array();
					strSplit = line.split('=');					
					latest_version = strSplit[1];

					if(current_version != latest_version && latest_version != "undefined")
					{
						if(confirm("A more recent version of " + script_title + " (" + latest_version + ") has been found.\r\nWould you like to get it now?"))
							GetNewVersion();
						else
							AskForReminder();
					} 
					else if(current_version == latest_version)
						alert("You have the latest version of " + script_title + ".");
				}
				else
				{
					alert("Could not locate the version holder file.\r\nThis should be reported to the script author.\r\nThank you!");
					SkipWeeklyUpdateCheck();
				}
					
		    }
		});
}

//Ask the user to be reminded in 24 hours or only next week.
function AskForReminder()
{
	if(confirm("Would you like to be reminded in 24 hours ?\r\n(Cancel to be reminded next week only)"))
	{
		var today = new Date();
		today = today.getTime();		
		var sixdays_ms = 6 * 24 * 60 * 60 * 1000;
		var sda_ms = today - sixdays_ms;		
		var sixdaysago = new Date(sda_ms)

		//Since we check for updates after 7 days, just make it seem like the last check was 6 days ago.
		GM_setValue(gm_updateparam, String(sixdaysago));
	}
	else
		SkipWeeklyUpdateCheck();
}

//Set the next update check in seven days
function SkipWeeklyUpdateCheck()
{
	var today = new Date();
	//As if we've just updated the script, the next check will only be next week.
	GM_setValue(gm_updateparam, String(today));
}
//===============================================================================
//			- Weekly Auto-Update Check -
//===============================================================================