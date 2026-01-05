// ==UserScript==
// @name         [FTVO GONE!]Project Free Tv - link altering + tools for free-tv-video-online.info
// @namespace    http://www.free-tv-video-online.info/
// @version      [FTVO GONE!]
// @description  [FTVO GONE!][Works in FF and Chrome!] converts links for free-tv-video-online.info (projectfree.tv) to bypass advert page, plus multiple other tools
// @author       William H
// @match        *://www.free-tv-video-online.info/internet/*
// @include      *://www.free-tv-video-online.info/video/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/8568/%5BFTVO%20GONE%21%5DProject%20Free%20Tv%20-%20link%20altering%20%2B%20tools%20for%20free-tv-video-onlineinfo.user.js
// @updateURL https://update.greasyfork.org/scripts/8568/%5BFTVO%20GONE%21%5DProject%20Free%20Tv%20-%20link%20altering%20%2B%20tools%20for%20free-tv-video-onlineinfo.meta.js
// ==/UserScript==

var preferredHosts = ["vidbull", "vodlocker", "gorillavid"];
var preferredOn = true; //uses the above hosts to set preferred host(s) to keep, and delete all others.
var colorsOn = true; //sets coloring of hosts, colors are through colorHosts
var vidAid = true;//enables tools on player page to go to next episode, etc.
var collectHosts = true;//enables collecting of hosts.. vidAir and this should be true to work
var collapseToggleOn = true; //sets episode collapsing
var colorHosts = {
	"vidbull":"87CEFA", 
	"vodlocker" : "F0FFF0", 
	"gorillavid":"FF69B4",
	"vidto":"FFFFFF",
	"allmyvideos":"FFFFFF",
	"vidspot":"FFFFFF",
	"nosvideo":"FFFFFF",
	"nowvideo":"FFFFFF",
	"videoweed":"FFFFFF",
	"novamov":"FFFFFF",
	"movshare":"FFFFFF",
	"divxstage":"FFFFFF",
	"mooshare":"FFFFFF",
	"180upload":"FFFFFF",
	"vidbux":"FFFFFF",
	"vidxden":"FFFFFF",
	"video":"FF0000",
	"modovideo":"FFFFFF",
	"movreel":"FFFFFF"
	};

if (window.location.href.search("/video/") > -1 && vidAid){
	window.addEventListener("load", videoAid, false);
	$("body").attr('style', 'padding:0px; margin:0px;');
	if(document.readyState == "complete"){
		videoAid();
	}
}else{
	window.addEventListener("load", convertMyLinks($("[onclick^=visited]")), false);
	if(document.readyState == "complete"){
    convertMyLinks($("[onclick^=visited]"));
	}
}

function convertMyLinks(elemArray){
	$("body").attr('style', 'padding:0px; margin:0px;');
	if(window.location.href.split('/internet/')[1]) { seriesTitle = window.location.href.split('/internet/')[1].split('/')[0].replace("%28", "").replace("%29", ""); }
	if(window.location.href.search("/season") > -1) { seriesSeason = "season" + window.location.href.split("/season")[1].split(".")[0];  episodeArray = {}; episodeArray[seriesSeason] = []; }
	if($('.info') != ''){
		for(p=0; p < $(".info").length; p++){
			$($(".info")[p]).attr("title", $($(".none > td")[p]).text().trim());
		}
		$('.none').remove();
	}
	for(i=0; i < elemArray.length; i++){
		currentNode = $(elemArray[i]);
		if($($(elemArray[i])).attr("onclick")){
			currentNHost = $(elemArray[i]).text().trim().replace(/	/g, "").split("\n")[3].split(" ")[1].split(".")[0];
			seasonEpisode = $(elemArray[i]).attr('href').split("&ttl=")[1].split("+Episode+")[1]; seasonEpisode = seasonEpisode.toLowerCase();
			$(elemArray[i]).attr('href', ($(elemArray[i]).attr('href').replace("/interstitial2.html?lnk=", "").split("&ttl=")[0].replace(/%2F/g, "/").replace(/%2F/g, "/").replace(/%3F/g, "?").replace(/%3D/g, "=")) + "&rnd=" + Math.random()).removeAttr('target');
			if( $(elemArray[i]).attr('href').search("http%3A") > -1 ){
				$(elemArray[i]).attr('href', ("http://" + $(elemArray[i]).attr('href').split("http%3A")[1]));
			}
			if(preferredOn || collectHosts){
				if( $.inArray(currentNHost, preferredHosts) == -1 ){
					$(elemArray[i]).parent().parent().remove();
				}else if(collectHosts && preferredOn && seriesSeason){
					if($.inArray(currentNHost, preferredHosts) > -1){ preferredHost = currentNHost; }
					if(!episodeArray[seriesSeason][seasonEpisode-1]){ episodeArray[seriesSeason][seasonEpisode-1] = {}; }
					if(episodeArray[seriesSeason][seasonEpisode-1][preferredHost]){
						episodeArray[seriesSeason][seasonEpisode-1][preferredHost].push($(elemArray[i]).attr('href'));
					}else{
						episodeArray[seriesSeason][seasonEpisode-1][preferredHost] = [];
						episodeArray[seriesSeason][seasonEpisode-1][preferredHost].push($(elemArray[i]).attr('href'));
					}
				}
			}
			if(colorsOn && !$(elemArray[i]).hasClass("down")){
				if(colorHosts[(currentNHost)]){
					$(elemArray[i]).parent().parent().css({'background-color': "#" + (colorHosts[(currentNHost)])});		
				}
			}
		}
	}
	if(collectHosts){
		if(!seriesLoad(seriesTitle,false)){
			seriesSave(seriesTitle, JSON.stringify(episodeArray));
		}else{
			tInfo = {}; tInfo = JSON.parse(seriesLoad(seriesTitle,true));
			tInfo[seriesSeason]= episodeArray[seriesSeason];
			seriesSave(seriesTitle, JSON.stringify(tInfo));
		}
	}
	if(collapseToggleOn){
		$("head").append('<style type="text/css">.episodeHeader .episodeToggle:after{ content:"[+]"; display:inline-block; } .episodeHeader.expanded .episodeToggle:after{ content:"[-]"; }</style>'); 
		$('.3 > .mnllinklist > .right').append('<a class="episodeToggle"></a>');
		$($('.3')[0]).parent().parent().attr('class', 'episodeTable');
		if($('.none')) { $('.none').remove(); }
		$('.3').attr('class', 'episodeHeader expanded').attr('id', 'episode');
		$('.episodeHeader').click(function(){ $(this).toggleClass('expanded').nextUntil('tr.episodeHeader').slideToggle(10); });
	}
}

function videoAid(){
	pftvTools = '<div class="FTVOPlug" style="z-index:9990!important;position: absolute;right: 0px;height: 460px;width: ' + $("[src*=season-side]").attr("width") + 'px;background-color:#CCCCCC;"><div style="position:top;z-index:9991;height:35px;width:100%" class="options"></div><div class="relHosts" border="1" style="position:top;z-index:9991;height:400px;width:100%;overflow:scroll;"></div><div class="epiNav" style="position:top;z-index:9991;height:25;width:100%;display:inline-block;"></div></div>';
	$($($('table')[1]).children('tbody').children('tr').children('td')[2]).prepend(pftvTools);
	sC = []; sC[0] = $('.mnlhighlightheading > div > h1').text().toLowerCase(); sC[1] = sC[0].split(' episode '); sC[2] = sC[1][0].split(' season '); sC[3] = sC[2][0]; sC[1] = sC[1][1]-1; sC[2] = sC[2][1]; sC[3] = sC[3].replace("(", "").replace(")", "").replace(" ", "_").replace(" ", "_");
	/*************************
	# sC[0] = whole title
	# sC[1] = episode
	# sC[2] = season
	# sC[3] = stored title
	*************************/
	if(seriesLoad(sC[3],false)){
		myEpA = JSON.parse(seriesLoad(sC[3],true));
		if(myEpA["season_"+sC[2]]){
			for(t=0;t < preferredHosts.length; t++) { 
				for(x=0; x < myEpA["season_"+ sC[2]][sC[1]][preferredHosts[t]].length; x++){
					$('.relHosts').append('<div role="link" onclick="javascript:window.location.href = $(this).attr(\'link\'); " link="' + myEpA["season_"+ sC[2]][sC[1]][preferredHosts[t]][x] +'" style="height:35px;width:100%;z-index:9992;border-bottom:1px solid #000000;text-align:center;background-color:' + (colorHosts && colorHosts[preferredHosts[t]]) + ';' + (myEpA["season_"+ sC[2]][sC[1]][preferredHosts[t]][x].search(window.location.search.split("&")[0].split("?id=")[1]) != -1 && "color:#fcfcfc;") +'"> '+ preferredHosts[t] + ' [' + (x+1) + '] </div>')
				}
			}
			if(sC[1] != 0 && sC[1] != myEpA["season_"+ sC[2]].length){
				$('.epiNav').append('<button style="float:left;" onclick="javascript: window.location.href = $(this).attr(\'link\'); " link="' + myEpA["season_"+ sC[2]][(sC[1]-1)][preferredHosts[0]][0] + '">Episode ' + sC[1] + '</button><button style="float:right;" onclick="javascript: window.location.href = $(this).attr(\'link\'); " link="' + myEpA["season_"+ sC[2]][(sC[1]+1)][preferredHosts[0]][0] + '">Episode ' + (sC[1]+2) + '</button>');
			}else if(sC[1] == 0){
				$('.epiNav').append('<button style="float:right;" onclick="javascript: window.location.href = $(this).attr(\'link\'); " link="' + myEpA["season_"+ sC[2]][(sC[1]+1)][preferredHosts[0]][0] + '">Episode ' + (sC[1]+2) + '</button>');
			}
		}
	}
}

function seriesSave(sN, eHV) {
    localStorage.setItem(sN, eHV);
}

function seriesLoad(seriesName, infoload) {
	if(localStorage.getItem(seriesName)){
		if(infoload){
			return localStorage.getItem(seriesName)
		}else{
			return true;
		}
	}else{
		return false;
	}
}