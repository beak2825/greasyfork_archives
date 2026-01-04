// ==UserScript==
// @name          Steam Extra Profile Links (Shigbeard Fork)
// @namespace     http://greasyfork.org/en/users/12857-shigbeard
// @author        Shigbeard (Forked from Doodles)
// @version       15
// @description   Adds extra links to Steam Profile pages, tailored to TF2 competitive.
// @icon          http://i.imgur.com/c4qvWvz.png
// @icon64        http://i.imgur.com/ZumqrhD.png
// @include       *://steamcommunity.com/id/*
// @include       *://steamcommunity.com/profiles/*
// @include       *://steamcommunity.com//id/*
// @include       *://steamcommunity.com//profiles/*
// @exclude       *://steamcommunity.com/id/*/tradeoffers/*
// @exclude       *://steamcommunity.com/profiles/*/tradeoffers/*
// @exclude       *://steamcommunity.com//id/*/tradeoffers/*
// @exclude       *://steamcommunity.com//profiles/*/tradeoffers/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant         GM_xmlhttpRequest
// @updateVersion 15
// @downloadURL https://update.greasyfork.org/scripts/556434/Steam%20Extra%20Profile%20Links%20%28Shigbeard%20Fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556434/Steam%20Extra%20Profile%20Links%20%28Shigbeard%20Fork%29.meta.js
// ==/UserScript==

$(document).ready(function () {
	'use strict';
	if ($(".profile_rightcol").length) {
		$("<style></style>").prop("type", "text/css").html('div.sel_links {background-color:#202020;padding:2px 5px 2px 5px;margin-bottom:10px;margin-right:10px;font-size:10px;color:#999999;}div.sel_links a, di' +
		'v.sel_links a:link {color:#5491cf;text-decoration:none;}div.sel_links a:visited {color:#5491cf;}div.sel_links a:hover {color:#5491cf;text-decoration:u' +
		'nderline;}div.sel_links a:active {color:#5491cf;}div.sel_links hr {border:0;height:1px;background:#0a0a0a;margin-top:2px;margin-bottom:2px;}div.sel_fo' +
		'ot {margin:0;padding:0;text-align:center;font-size:10px;color:#444444;}div.sel_foot a, div.sel_foot a:link {color:#444444;text-decoration:none;}div.se' +
		'l_foot a:visited {color:#444444;}div.sel_foot a:hover {color:#999999;text-decoration:underline;}div.sel_foot a:active {color:#444444;}span.selG {color' +
		':#2d8d2b;}span.selY {color:#e1bf00;}span.selR {color:#a94847;}').appendTo("head");
        var steamXmlUrl;
		if(document.URL.indexOf("steamcommunity.com/id/") != -1 || document.URL.indexOf("steamcommunity.com//id/") != -1) {
			steamXmlUrl = "//steamcommunity.com/id/" + document.URL.split("/id/")[1].split("/")[0].split("?")[0] + "?xml=1";
		} else {
			steamXmlUrl = "//steamcommunity.com/profiles/" + document.URL.split("/profiles/")[1].split("/")[0].split("?")[0] + "?xml=1";
		}
		GM_xmlhttpRequest({
			method: 'GET',
			url: steamXmlUrl,
			onload: function(responseDetails) {
				extraProfileLinks(responseDetails.responseText);
			},
			onerror: function(responseDetails) {
				console.log(responseDetails.responseText);
			}
		});
	}
	function extraProfileLinks(xmlPage) {
		var selProfileSid64 = $(xmlPage).find("steamID64").first().text();
		var selTempNum = selProfileSid64.substring(5)  - 197960265728; //76561197960265728;
		var selProfileSid32 = "STEAM_0:" + selTempNum%2 + ":" +(selTempNum - selTempNum%2) / 2;
		var selProfileSidV3 = "[U:1:" + selTempNum + "]";

		var linkDiv = $('<div class="sel_links" id="selContainer"></div>');
		if ($(".profile_badges").length) {
			$(linkDiv).insertBefore($(".profile_badges").first());
			if ($(".profile_in_game").length) {
				$(".profile_in_game").first().css("margin-bottom", "10px");
			}
			if ($(".profile_ban_status").length) {
				$(".profile_ban_status").first().css("margin-bottom", "10px");
			}
		} else {
			$(".profile_rightcol").first().prepend(linkDiv);
		}

		var link_01_01 = "<a title=\"SteamRep\" href=\"http://steamrep.com/profiles/" + selProfileSid64 + "\">SteamRep</a>";
		var link_01_02 = "<a title=\"SteamDB\" href=\"http://steamdb.info/calculator/" + selProfileSid64 + "/\">SteamDB</a>";
		var link_01_03 = "<a title=\"Steam Trades\" href=\"http://www.steamtrades.com/user/" + selProfileSid64 + "\">Steam Trades</a>";
		var link_01_04 = "<a title=\"Steam Gifts\" href=\"http://www.steamgifts.com/go/user/" + selProfileSid64 + "\">Steam Gifts</a>";
		var link_01_05 = "<a title=\"Vac-Ban.com - CS:GO Stats and VAC Status\" href=\"https://www.vac-ban.com/" + selProfileSid64 + "/stats.html\">Vac-Ban.com</a>";
        var link_01_06 = "<a title=\"SteamHistory.net\" href=\"https://steamhistory.net/id/" + selProfileSid64 + "\">SteamHistory.net</a>";
        var link_01_07 = "<a title=\"Slurs.tf\" href=\"https://slurs.tf/player?steamid=" + selProfileSid64 + "\">Slurs.tf</a>";

		var link_02_01 = "<a title=\"backpack.tf Backpack\" href=\"http://backpack.tf/profiles/" + selProfileSid64 + "\">Backpack</a>";
		var link_02_02 = "<a title=\"backpack.tf Profile\" href=\"http://backpack.tf/u/" + selProfileSid64 + "\">Profile</a>";

		var link_02_13 = "<a title=\"TF2Center\" href=\"https://tf2center.com/profile/" + selProfileSid64 + "\">TF2Center</a>";

		var link_03_01 = "<a title=\"Achievement Stats\" href=\"http://www.achievementstats.com/index.php?action=profile&playerId=" + selProfileSid64 + "\">Achievement Stats</a>";
		var link_03_02 = "<a title=\"astats.nl\" href=\"http://astats.astats.nl/astats/User_Info.php?steamID64=" + selProfileSid64 + "\">astats.nl</a>";
		var link_03_03 = "<a title=\"Steam Ladder\" href=\"http://www.steamladder.com/profile/" + selProfileSid64 + "\">Steam Ladder</a>";

		var link_04_01 = "<a title=\"Games\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/games/\">Games</a>";
		var link_04_02 = "<a title=\"All Games\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/games?tab=all\">All Games</a>";
		var link_04_03 = "<a title=\"Screenshots\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/screenshots/?appid=0&sort=newestfirst&browsefilter=myfiles&view=grid\">Screenshots</a>";
		var link_04_04 = "<a title=\"Videos\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/videos/\">Videos</a>";
		var link_04_05 = "<a title=\"Artwork\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/images/\">Artwork</a>";
		var link_04_06 = "<a title=\"Reviews\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/recommended/\">Reviews</a>";
		var link_04_07 = "<a title=\"Guides\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/myworkshopfiles/?section=guides\">Guides</a>";
		var link_04_08 = "<a title=\"Workshop Items\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/myworkshopfiles/\">Workshop Items</a>";
		var link_04_09 = "<a title=\"Greenlight Items\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/myworkshopfiles/?section=greenlight\">Greenlight Items</a>";
		var link_04_10 = "<a title=\"Friends\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/friends/\">Friends</a>";
		var link_04_11 = "<a title=\"Groups\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/groups/\">Groups</a>";
		var link_04_12 = "<a title=\"Inventory - TF2\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/inventory/#440\">TF2</a>";
		var link_04_13 = "<a title=\"Inventory - Dota2\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/inventory/#570\">Dota2</a>";
		var link_04_14 = "<a title=\"Inventory - Steam\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/inventory/#753\">Steam</a>";
		var link_04_15 = "<a title=\"Inventory - CSGO\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/inventory/#730\">CSGO</a>";
		var link_04_16 = "<a title=\"All Comments\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/allcomments\">All Comments</a>";
		var link_04_17 = "<a title=\"Name History\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/namehistory\">Name History</a>";
		var link_04_18 = "<a title=\"Friends in Common\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/friendscommon\">Friends in Common</a>";
		var link_04_19 = "<a title=\"Groups in Common\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/groupscommon\">Groups in Common</a>";
		var link_04_20 = "<a title=\"Badges\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/badges/\">Badges</a>";
		var link_04_21 = "<a title=\"Wishlist\" href=\"http://steamcommunity.com/profiles/" + selProfileSid64 + "/wishlist/\">Wishlist</a>";

        var link_05_01 = "<a title=\"Ozfortress\" href=\"http://ozfortress.com/users/steam_id/" + selProfileSid64 + "\">Ozfortress</a>";
        var link_05_02 = "<a title=\"ETF2L\" href=\"http://etf2l.org/search/" + selProfileSid64 + "\">ETF2L</a>";
        var link_05_03 = "<a title=\"RGL\" href=\"http://rgl.gg/Public/PlayerProfile.aspx?p=" + selProfileSid64 + "\">RGL</a>";
        var link_05_04 = "<a title=\"Logs.TF\" href=\"http://logs.tf/profile/" + selProfileSid64 + "\">Logs.tf</a>";

		var link_foot_1 = "<a title=\"GreasyFork\" target=\"_blank\" href=\"https://greasyfork.org/scripts/5148-steam-extra-profile-links\">GreasyFork</a>";
		var link_foot_2 = "<a title=\"DoodlesStuff\" target=\"_blank\" href=\"http://doodlesstuff.com/?p=sepl\">DoodlesStuff</a>";

		var invCount = "Inventory: ";
		if($(".profile_item_links").length) {
			$(".profile_item_links a").each(function(){ 
				if($(this).find(".profile_count_link_total").length) {
					var tempHref = $(this).attr('href');
					var tempCount = $(this).find(".profile_count_link_total").text().trim();
					if(tempCount.length) {
						if (tempHref.indexOf("/games/") != -1) { link_04_01 = link_04_01.replace("</a>", " (" + tempCount + ")</a>"); }
						else if (tempHref.indexOf("/screenshots/") != -1) { link_04_03 = link_04_03.replace("</a>", " (" + tempCount + ")</a>"); }
						else if (tempHref.indexOf("/videos/") != -1) { link_04_04 = link_04_04.replace("</a>", " (" + tempCount + ")</a>"); }
						else if (tempHref.indexOf("/inventory/") != -1) { invCount = "Inventory (" + tempCount + "): "; }
						else if (tempHref.indexOf("/myworkshopfiles/?section=greenlight") != -1) { link_04_09 = link_04_09.replace("</a>", " (" + tempCount + ")</a>"); }
						else if (tempHref.indexOf("/images/") != -1) { link_04_05 = link_04_05.replace("</a>", " (" + tempCount + ")</a>"); }
						else if (tempHref.indexOf("/myworkshopfiles/?section=guides") != -1) { link_04_07 = link_04_07.replace("</a>", " (" + tempCount + ")</a>"); }
						else if (tempHref.indexOf("/recommended/") != -1) { link_04_06 = link_04_06.replace("</a>", " (" + tempCount + ")</a>"); }
						else if (tempHref.indexOf("/myworkshopfiles/") != -1) { link_04_08 = link_04_08.replace("</a>", " (" + tempCount + ")</a>"); }
					}
				}
			});
			$(".profile_item_links").first().empty();
		}

		linkDiv.append($("<div>" + link_01_01 + " | " + link_01_02 + " | " + link_01_05 + "</div>"));
        linkDiv.append($("<div>" + link_01_06 + " | " + link_01_07 + "</div>"));
        linkDiv.append($("<hr>"));
			var vac = $(xmlPage).find("vacBanned").first().text();
			if(vac == "1") { vac = "<span class=\"selR\">VAC Banned</span>"; }
			else if(vac == "0") { vac = "<span class=\"selG\">None</span>"; }
			else { vac = "<span class=\"selY\">" + vac + "</span>"; }
		linkDiv.append($("<div>VAC Ban: " + vac + "</div>"));
			var trade = $(xmlPage).find("tradeBanState").first().text();
			if(trade == "None") { trade = "<span class=\"selG\">None</span>"; }
			else { trade = "<span class=\"selR\">" + trade + "</span>"; }
		linkDiv.append($("<div>Trade Ban: " + trade + "</div>"));
		var memberSince = $(xmlPage).find("memberSince").first();
		if(memberSince.length) { linkDiv.append($("<div>Joined: " + $(memberSince).text() + "</div>")); }
		linkDiv.append($("<div>" + selProfileSid64 + "</div><div>" + selProfileSidV3 + "</div><div>" + selProfileSid32 + "</div>"));
        linkDiv.append($("<hr>"));
        linkDiv.append($("<div>" + link_05_01 + " | " + link_05_02 + " | " + link_05_03 + " | " + link_05_04 + " | " + link_02_13 + "</div>"));
		linkDiv.append($("<hr>"));
		linkDiv.append($("<div>backpack.tf: " + link_02_01 + " | " + link_02_02 +"</div>"));
		linkDiv.append($("<div>" + link_01_03 + " | " + link_01_04 + "</div>"));
		linkDiv.append($("<hr>"));
		linkDiv.append($("<div>" + link_03_01 + " | " + link_03_02 + " | " + link_03_03 + "</div>"));
		linkDiv.append($("<hr>"));
		if($(".profile_private_info").length == 0) { // display profile type links IF profile ISNT private
			linkDiv.append($("<div>" + link_04_01 + " | " + link_04_02 + " | " + link_04_21 + "</div>"));
			linkDiv.append($("<div>" + link_04_03 + " | " + link_04_04 + " | " + link_04_05 + "</div>"));
			linkDiv.append($("<div>" + link_04_06 + " | " + link_04_07 + "</div>"));
			linkDiv.append($("<div>" + link_04_08 + " | " + link_04_09 + "</div>"));
			linkDiv.append($("<div>" + link_04_10 + " | " + link_04_11 + " | " + link_04_20 + "</div>"));
			linkDiv.append($("<div>" + invCount + link_04_12 + " | " + link_04_13 + " | " + link_04_14 + " | " + link_04_15 + "</div>"));
			linkDiv.append($("<div>" + link_04_16 + " | " + link_04_17 + "</div>"));
			if($("#account_pulldown").length) { linkDiv.append($("<div>" + link_04_18 + " | " + link_04_19 + "</div>")); }
		} else {
			linkDiv.append($("<div>" + link_04_16 + " | " + link_04_17 + "</div>"));
		}
		linkDiv.append($("<hr>"));
		linkDiv.append($("<div class=\"sel_foot\">Steam Extra Links (Shigbeard Fork)<br />" + link_foot_1 + " | " + link_foot_2 + "</div>"));

		if($(".profile_in_game_name").length) {
			var gameName = $(".profile_in_game_name").text().trim();
			gameName = gameName.replace("&equals;", "%3D").replace("&#61;", "%3D").replace("=", "%3D");
			gameName = gameName.replace("&amp;", "%26").replace("&#38;", "%26").replace("&", "%26");
			var gameName2 = gameName;
			while(gameName2.indexOf(" ") != -1){
				gameName2 = gameName2.replace(" ", "+");
			}
			if(gameName.indexOf("Last Online") == -1) {
				$(".profile_in_game_name").html($("<a href=\"http://store.steampowered.com/search/?term=" + gameName2 +
					"&category1=998\" title=\"Steam Store Search\" style=\"text-decoration:underline;\">" + gameName + "</a>"));
			}else{
                
			}
		}
	}
});