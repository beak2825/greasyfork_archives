// ==UserScript==
// @name          Smite Crossite Links
// @namespace     http://greasyfork.org/users/2240-doodles
// @author        Doodles
// @version       6
// @description   Adds Cross-Site Links between Smite Game and Smite Guru.
// @include       *://www.smitegame.com/player-stats/?*
// @include       *://www.smitegame.com/match-details/?match=*
// @include       *://smite.guru/profile/*/*
// @include       *://smite.guru/match/*/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant         none
// @updateVersion 6
// @downloadURL https://update.greasyfork.org/scripts/9766/Smite%20Crossite%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/9766/Smite%20Crossite%20Links.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

if (UrlContains("www.smitegame.com/player-stats/?") && UrlContains("player-name=")){
	var playerName = document.URL.split("player-name=")[1].split("&")[0];
	var platform = "";
	if(UrlContains("set_platform_preference=")){
		platform = document.URL.split("set_platform_preference=")[1].split("&")[0];
		if(platform == "xbox"){
			platform = "xb";
		}else if(platform == "ps4"){
			platform = "ps";
		}else{
			platform = "pc";
		}
	}else{
		platform = $('p.player-stats > span').text();
		if(platform == "xbox"){
			platform = "xb";
		}else if(platform == "ps4"){
			platform = "ps";
		}else{
			platform = "pc";
		}
	}
	document.title = "Profile: " + playerName;
	var myDiv = $('<div><a href="http://smite.guru/profile/'+platform+'/' + playerName + '" title="Smite Guru Profile">Smite Guru Profile</a></div>').css({"float":"right", "margin-top":"20px"});
	$('div.center-wrapper.breadcrumb-wrapper').prepend(myDiv);
	$('td.category:contains("Avg Deaths")').text('Deaths');
	$('a.match-detail-btn').each(function(index) {
		$(this).before('<a class="match-detail-btn" href="http://smite.guru/match/'+platform+'/'+$(this).attr('data-match-id')+'" style="margin-right:105px;">Smite.guru</a>');
	});
}

if (UrlContains("www.smitegame.com/match-details/?match=")){
	var matchId = document.URL.split("match=")[1].split("&")[0];
	var platform = $('a[href="/player-stats/"] > span').text();
	if(platform == "xbox"){
		platform = "xb";
	}else if(platform == "ps4"){
		platform = "ps";
	}else{
		platform = "pc";
	}
	document.title = "Match: " + matchId;
	var myDiv = $('<div><a href="http://smite.guru/match/'+platform+'/' + matchId + '" title="Smite Guru Match">Smite Guru Match</a></div>').css({"float":"right", "margin-top":"20px"});
	$('div.center-wrapper.breadcrumb-wrapper').prepend(myDiv);
}

if (UrlContains("smite.guru/profile/")){
	var playerName = document.URL.split("profile/")[1].split("/")[1].split("?")[0];
	var platform = document.URL.split("profile/")[1].split("/")[0];
	if(platform == "xb"){
		platform = "xbox";
	}else if(platform == "ps"){
		platform = "ps4";
	}else{
		platform = "pc";
	}
	document.title = "Profile: " + playerName;
	var link = MakeLink("https://www.smitegame.com/player-stats/?set_platform_preference=" + platform + "&player-name=" + playerName, playerName + " on Smitegame.com", "Smitegame.com", "a37f1f");
	$('section.profile-header > div.container > h1 > small').append(document.createTextNode(" (")).append(link).append(document.createTextNode(")"));
}

if (UrlContains("smite.guru/match/")){
	var matchId = document.URL.split("/match/")[1].split("/")[1].split("?")[0];
	document.title = "Match: " + matchId;
	var link = MakeLink("https://www.smitegame.com/match-details/?match=" + matchId, matchId + " on Smitegame.com", "Smitegame.com", "a37f1f");
	$('section.profile-header > div.container > h1 > small').append(document.createTextNode(" (")).append(link).append(document.createTextNode(")"));
}

// =============================================================

function UrlContains(urlfragment){ return document.URL.indexOf(urlfragment) != -1; }

function MakeLink(url, title, displayText, color){
	var linkElement = document.createElement("a");
	linkElement.setAttribute("title", title);
	linkElement.setAttribute("href", url);
	linkElement.setAttribute("style", "color: #" + color + ";text-decoration:underline;");
	linkElement.appendChild(document.createTextNode(displayText));
	return linkElement;
}