// ==UserScript==
// @name        Bandcamp TagPlayer
// @namespace   https://github.com/SLLABslevap/bandcamp-tagplayer
// @description A genre/tag audio player for bandcamp.com (like Last.fm Player for Last.fm). 
// @version     0.1.2
// @include     http*://bandcamp.com/tagplayer
// @include     http*://bandcamp.com/tagplayer?*
// @include     http*://bandcamp.com/tagplayer/*
// @include     http*://bandcamp.com/tags
// @include     http*://bandcamp.com/tags/
// @include     http*://bandcamp.com/tag/*
// @icon        https://github.com/SLLABslevap/bandcamp-tagplayer/raw/master/icon/icon.png
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/7786/Bandcamp%20TagPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/7786/Bandcamp%20TagPlayer.meta.js
// ==/UserScript==

//Global var declarations/definitions
var tpName = "Bandcamp TagPlayer";
var tpVersion = "0.1.2 pre-alpha post-WIP development";
var tagplayerURL = window.location.protocol + "//bandcamp.com/tagplayer/?";
var tagViaUrl="";
var tagViaUrlForDisplay="";
//Global var declarations/definitions - part 2
var bandcampTagUrl = window.location.protocol + "//bandcamp.com/tag/";
var currentTagForDisplayUNSAFE; //Human-readable version of the tag as parsed from the url, eg. "rock & roll" or "<b>1337h4x0r</b>"
var currentTagForDisplaySafe; //Human-readable version of the tag, html escaped, eg. "rock &amp; roll" or "&lt;b&gt;1337h4x0r&lt;/b&gt;"
var currentTag; //Bandcamp-readable version of the tag eg. "rock-roll" or "-b-1337h4x0r-b-"
var firstRun = true;
var isTrackLoading = false;
var nextPage;
var currPage;
var albumList;
var preferPopular = (localStorage.getItem("GM_BCTP_preferPopular") != "false" ? true : false); //false: prefer newness over popularity tracks when loading tracks, true: the opposite 
var consecutiveErrorCount=0; //For preventing error loops when loading tracks fails consecutively because of timeout / connection error

//On the "/tags" page insert option to play tags in the TagPlayer
if (/^https?\:\/\/(www\.)?bandcamp\.com\/(tags)\/?$/.test(document.location)){
	insertDnDTagLoader();
	
//On every "/tag/..." page insert a link for playing that particular tag in the TagPlayer
} else if (/^https?\:\/\/(www\.)?bandcamp\.com\/(tag\/([^\/]+))\/?$/.test(document.location)){
	try {
		var h1 = document.getElementById("content").getElementsByTagName("h1")[0];
		var a = document.createElement("a");
		a.href = tagplayerURL + encodeURIComponent(h1.textContent);
		a.setAttribute("class","tp_playA");
		a.innerHTML = "\u25B6";
		GM_addStyle(".tp_playA{font-size:0.7em;margin-left:10px}.tp_playA:hover{text-decoration:none !important;color:#8BC9FF !important;}")
		h1.appendChild(a);
	} catch (ex){
		//console.log("[BCTP]\t"+"Couldn't insert TagPlayer links."); //DEBUG
		displayMsgAlt("Couldn't insert TagPlayer links.<br>If this problem persists, please report it to developer of Bandcamp TagPlayer.",true);
	}
	
//On every other page listed as an @include (other than "/tags" or "tag/...") load TagPlayer
// currently that only means bandcamp.com/tagplayer 
// since BCTP currently uses the CSS of the page it's loaded on, it cannot be loaded on any page, because the styles might be screwed up
} else if (/^https?\:\/\/(www\.)?bandcamp\.com\/tagplayer(\/.*)?|(\?.*)?$/i.test(document.location)){

	//Cover original bandcamp.com/tagplayer (404) page, display loading message
	initLoaderOverLay();
	
	var n = (document.location.href).match(/^https?\:\/\/(?:www\.)?bandcamp\.com\/(?:[^\/\&\#\?]+)(\/|\?+)([^?].*)/);
	
	//If format is "http://bandcamp.com/tagplayer/sometag" redirect to "http://bandcamp.com/tagplayer/?sometag"
	//Or if format is "http://bandcamp.com/tagplayer?sometag" redirect to "http://bandcamp.com/tagplayer/?sometag"
	if (n){
			document.location.href = tagplayerURL + n[2];
			
	//Else continue
	} else {
		//Check if there is a tag passed to the player via url, eg. "http://bandcamp.com/tagplayer/?rock"
		// if there is (eg. "rock"), save it in tagViaUrl
		var m = (document.location.href).match(/^https?\:\/\/(?:www\.)?bandcamp\.com\/(?:[^\/\&\#\?]*?)\/\?*(.*)/);
		//console.log("[BCTP]\t"+"Tag via URL regex: " + m); //DEBUG
		if (m!==null) {
			if (m[1])
				tagViaUrl = decodeURIComponent(m[1]);
			//console.log("[BCTP]\t"+"tagViaUrl " + tagViaUrl) //DEBUG
		}

		//Add player overlay
		initPlayer();
		
		//Load tag, load first random track, remove loader overlay
		// if there is a tag passed via url, load it
		if (tagViaUrl) {
			loadTag(tagViaUrl);
			
		// else load the TagPlayer landing page (withoutt loading a tag)
		} else {
			setTagDisplay(false, "", "");
			removeLoaderOverLay();
			firstRun = false;
		}
	}
}

//Loads an overlay that covers up the original bandcamp.com/tagplayer 404 page
// this will be hidden (replaced by the player overlay) as soon as the player is loaded
function initLoaderOverLay(){
	var d = document.createElement("div");
	d.id = "tagPlayerOverlay";
	d.setAttribute("style","display:block;width:100%;height:100%;position:fixed;left:0px;top:0px;background-color:#fff;z-index:999999;");
	var l = document.createElement("p");
	l.id="tagPlayerOverlayTxt"
	l.setAttribute("style","width:100%;text-align:center;position:fixed;margin-top:50px;color:#888;font-size:1.7em");
	l.innerHTML = "<span id='tpLoaderDots' style='opacity:1'>Loading player...</span>Please wait!"
	d.appendChild(l);
	document.body.appendChild(d);
	var s = document.createElement("script");
	s.id = "tpLoaderScr";
	s.innerHTML = 'var tp_u=true;var tp_s=setTimeout(function(){clearInterval(tp_t);var tpt = document.getElementById("tagPlayerOverlayTxt"); if (!tpt) return; tpt.innerHTML = "It\'s taking more than 10 seconds to load this tag.<br>You should probably consider reloading this page.";},10000);var tp_t = setInterval(function (){var tpd=document.getElementById("tpLoaderDots");if(!tpd){clearInterval(tp_t);return;};var tpop = parseFloat(tpd.style.opacity); if (tpop>=1){tp_u=false;} else if (tpop<=0.2){tp_u=true} tpop = (tp_u ? (tpop+0.1) : (tpop-0.1));  tpd.style.opacity = tpop;},60);';
	document.body.appendChild(s);
}
function updateLoaderOverLay(msg){
	var tpTxt = document.getElementById("tagPlayerOverlayTxt");
	if (tpTxt){
		tpTxt.innerHTML = msg;
	}
}
function removeLoaderOverLay(){
	try {
		var ts = document.getElementById("tpLoaderScr");
		var to = document.getElementById("tagPlayerOverlay");
		if (ts) document.body.removeChild(ts);
		if (to) document.body.removeChild(to);
	} catch (ex){
		//console.log("[BCTP]\t" + "Couldn't remove overlay."); //DEBUG
	}
}

//Inserts option on the /tags/ page to open tags in TagPlayer
function insertDnDTagLoader(){
	try {
		var wDiv = document.createElement("div");
		wDiv.innerHTML = '<label id="tp_lbl" style="margin:20px 0px;display:block;font-size:1.2em;padding:20px 10px;border:#C0C0C0 1px solid;border-radius:5px;width:30%;user-select: none;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;"><input type="checkbox" id="tp_chk" style=""> Open tags in TagPlayer</label>';
		document.getElementById("content").parentNode.insertBefore(wDiv,document.getElementById("content") );
		var pArr = [];
		var h1 = document.getElementsByTagName("h1");
		for (var i=0;i<h1.length;++i){
			pArr[i] = document.createElement("span");
			pArr[i].setAttribute("style","display:" + (localStorage.getItem("GM_BCTP_tp_chk") == "checked" ? "inline" : "none") + ";font-size:0.7em;margin-left:10px");
			pArr[i].innerHTML = "\u25B6";
			h1[i].appendChild(pArr[i]);
		}
		var l = document.getElementById("tp_lbl");
		l.addEventListener("click",function(a){
			if (document.getElementById("tp_chk").checked == true){
				l.style.background = "#eee";
				document.getElementById("content").addEventListener("click",tagToPlayer);
				localStorage.setItem("GM_BCTP_tp_chk","checked");
				for (var i=0;i<h1.length;++i){pArr[i].style.display="inline";}
			} else {
				l.style.background = "none";
				document.getElementById("content").removeEventListener("click",tagToPlayer);
				localStorage.setItem("GM_BCTP_tp_chk","unchecked");
				for (var i=0;i<h1.length;++i){pArr[i].style.display="none";}
			}
		});
		if (localStorage.getItem("GM_BCTP_tp_chk") == "checked"){
			document.getElementById("tp_chk").checked = true;
			l.style.background = "#eee";
			document.getElementById("content").addEventListener("click",tagToPlayer);
		}
	}catch(e){
		//console.log("[BCTP]\t"+"Couldn't insert TagPlayer links."); //DEBUG
		displayMsgAlt("Couldn't insert TagPlayer links.<br>If this problem persists, please report it to developer of Bandcamp TagPlayer.",true);
	}
}

//Event handler for the click event on the tag links on the /tags/ page. 
//If event was fired on a tag link, it opens the tag in TagPlayer
function tagToPlayer(e){
	var target = e.target || e.srcElement
	if (target.tagName.toLowerCase() == "a" && /^\s*tag(\s+.*?)?/.test(target.className)){
		e.preventDefault();
		window.location.href = tagplayerURL + target.textContent;
	}
}

//Loads tag in TagPlayer.
// tag - actual tag to load in TagPlayer, eg. 
// tagForDisplay - optional text to display instead of tag
function loadTag(tag, tagForDisplay){
	setCurrPlayingTag("loading...")
	setTrackLoading(true); //loading indicator will be stopped in expandalbumlist->loadtrack
	if (tagForDisplay){
		currentTagForDisplayUNSAFE = tagForDisplay;
		currentTagForDisplaySafe = escapeHtml(tagForDisplay);
	} else {
		currentTagForDisplayUNSAFE = tag;
		currentTagForDisplaySafe = escapeHtml(tag);
	}
	currentTag = makeCompatible(tag);
	//console.log("[BCTP]\t"+"loadTag\n" + tag + "\n" + currentTag); //DEBUG
	nextPage = 1;
	currPage = 1;
	clearAlbumList()
	expandAlbumList(true);
	setCurrPlayingTag(currentTagForDisplaySafe,currentTag)
	setTagDisplay(false,currentTag,currentTagForDisplayUNSAFE);
	//console.log("[BCTP]\t"+"loadTag\n" + "end"); //DEBUG
}

//Fetches more albums from the next page of "bandcamp.com/tag/sometag" for the current tag, 
// then adds the albums to the album pool (albumList), 
// from which the next random track will be selected from
function expandAlbumList(loadTrack){
	currPage = nextPage;
	//console.log("[BCTP]\t expandAlbumList URL: "+bandcampTagUrl + "" + currentTag + "?page=" + nextPage + (preferPopular==false ? "&sort_field=date" : "&sort_field=pop")); //DEBUG
	GM_xmlhttpRequest({
		method: "GET",
		url: bandcampTagUrl + "" + currentTag + "?page=" + nextPage + (preferPopular==false ? "&sort_field=date" : "&sort_field=pop"),
		timeout: 30000,
		onload: function(response) {
			var d = document.createElement("div");
			d.innerHTML = response.responseText;
			var itemList = d.getElementsByClassName("item_list"); 
			if (itemList.length<=0){ //no more tag pages, stop expanding albumlist
				return;
			}
			var albumA = itemList[0].getElementsByTagName("a"); // album links for this page
			if (albumA.length<=0){ //no albums found for this tag, stop script
				if (nextPage == 1 || albumList.length <= 0) {//first run, theoretically always true if parent if is true
					setCurrPlayingTag("nothing");
					setTrackLoading(false);
					setTagDisplay(false, "","");
					if (firstRun){
						removeLoaderOverLay();
						firstRun = false;
					}
					displayMsg("Couldn't find any albums for the tag \"" + currentTagForDisplaySafe + "\".",true)
				}
				return;
			}
			addToAlbumList(albumA)
			//console.log("[BCTP]\t"+albumList); //DEBUG
			++nextPage;
			//if loadTrack==true, load the next track
			// used when loading a new tag and
			// filling albumList for the first time for this tag
			if (loadTrack)
				loadNext();
			d.innerHTML = "";
		}
	});
}

//Clears albumList, indicates that temporarily there are no tracks to load next by disabling the next button
function clearAlbumList(){
	albumList = [];
	var nb = document.getElementById("tp_pi_nextbtn");
	if (nb){
		nb.style.opacity = "0.4";
		nb.style.cursor = "default";
		nb.style.background = "#111";
	}
}

//Adds links in hrefArr to albumList, enables next button
function addToAlbumList(hrefArr){
	if (hrefArr.length<=0)
		return;
	for (var i=0;i<hrefArr.length;++i){
			albumList.push(hrefArr[i].href)
	}
	var nb = document.getElementById("tp_pi_nextbtn");
	if (nb){
		nb.style.opacity = "0.8";
		nb.style.cursor = "pointer";
		nb.style.background = "#222";
	}
}

//For loading the next track for the current tag (from the album pool);
// selects random track from the album pool, loads track, updates the player, starts playback
function loadNext(){
	//consecutiveErrorCount - incremented each time the scripts tries and fails to load tracks consecutively
	// zeroed out when a track is loaded successfully
	//console.log("[BCTP]\tconsecutiveErrorCount: "+consecutiveErrorCount)
	if (consecutiveErrorCount>=50){
		displayMsgAlt("Loading tracks failed multiple times. The script will now stop.<br>If the problem persists, please report it to the developer.",true);
		//console.log("[BCTP]\t"+"Loading next track failed. The script will now stop."); //DEBUG
		if (firstRun){
			updateLoaderOverLay("There was an error. The script stopped.<br>If the problem persists, please report it to the developer of " +tpName+ ".")
		}
		setCurrPlayingTag("nothing");
		setTrackLoading(false);
		setTagDisplay(false, "","");
		consecutiveErrorCount=0;
		return;
	}
	if (albumList.length<=0)
		return;
	setTrackLoading(true);
	var validityCheckTag = currentTag;
	var r = getRandomInt(0, albumList.length-1);
	var currentAlbumURL = albumList[r];
	//console.log("[BCTP]\t"+"loadNext request " + currentAlbumURL); //DEBUG
	GM_xmlhttpRequest({
		method: "GET",
		url: currentAlbumURL,
		timeout: 7000,
		onerror: function(response){
			++consecutiveErrorCount;
			displayMsgAlt("Loading track failed. Trying again...",true);
			//console.log("[BCTP]\t"+"Loading track failed. Trying again..."); //DEBUG
			loadNext();
		},
		ontimeout: function(response){
			++consecutiveErrorCount;
			displayMsgAlt("Loading track failed, probably because of slow connection/no connection. Trying again...",true);
			//console.log("[BCTP]\t"+"Loading track failed (timeout). Trying again..."); //DEBUG
			loadNext();
		},
		onload: function(response) {
			try {
				//console.log("[BCTP]\t"+"loadNext request response"); //DEBUG
				var d = response.responseText;
				var albumImg = d.match(/\<link\s+rel\=\"shortcut\s+icon\"\s*href\=\"(.*?)\"\>/)[1];
				var albumTitle = d.match(/\<meta\s+name\=\"title\"\s+content\=\"(.*?)\s*\,\s*by/)[1];
				var albumArtist = d.match(/\,\s*artist\s*\:\s*\"(.*?)\"\,/)[1];
				var trackTitles = [];
				var trackURLs = [];
				var trackLinks = [];
				var fInfo = d.match(/\,\s*trackinfo\s*\:\s*\[(.*?)\]\s*,\s*/);
				//console.log("[BCTP]\t"+'{"i":[' + fInfo[1] + ']}'); //DEBUG
				var fiJSON = JSON.parse('{"i":[' + fInfo[1] + ']}');
				for (var j=0;j<fiJSON.i.length;j++){
					var b = fiJSON.i[j];
					if (b.file == null || b.title_link == null){
						//console.log("[BCTP]\t"+"Track skipped, no file link."); //DEBUG
						continue;
					}
					trackTitles.push(b.title);
					trackURLs.push(b.file['mp3-128']);
					trackLinks.push(b.title_link);
				}
				if (trackLinks<=0)
					throw "Error";
				r = getRandomInt(0, trackURLs.length-1);
				var artistURL = currentAlbumURL.match(/^(\/\/|[^\/]+)*/)[0];
				//console.log("[BCTP]\t"+"loadNext:\n"+albumTitle+"\n"+albumArtist+"\n"+currentAlbumURL+"\n"+trackTitles[r]+"\n"+trackURLs[r]+"\n"+currentAlbumURL + trackLinks[r]+"\n"+albumImg); //DEBUG
				//This (currentTag === validityCheckTag) check is to avoid the following scenario: 
				// in the process of making http request for new track, but new tag is loaded in the meantime, making the response track to this request obsolete, but the function still updates player with obsolete track.
				if (currentTag === validityCheckTag){
				//If no new tag was loaded in the meantime, proceed,
				// otherwise, don't load the track.
					loadPlayer(albumTitle, albumArtist, currentAlbumURL, trackTitles[r], trackURLs[r], artistURL + trackLinks[r], albumImg);
				}
				if (firstRun){
					removeLoaderOverLay();
					firstRun = false;
				}
				consecutiveErrorCount=0;
				if (currentTag === validityCheckTag){
					setTrackLoading(false);
					if (currPage < nextPage)
						expandAlbumList();
				}
			} catch(ex){
				//console.log("[BCTP]\t"+"Error: No tracks available for this album.\n" + ex)
				setTrackLoading(false);
				++consecutiveErrorCount;
				loadNext();
			}
		}
	});
}

//Loads track into the player, updates page title with track info
function loadPlayer(albumTitle, albumArtist, albumLink, trackTitle,trackURL,trackLink,albumImg){
	//console.log("[BCTP]\t"+"loadPlayer:\n"+albumTitle+"\n"+albumArtist+"\n"+albumLink+"\n"+trackTitle+"\n"+trackURL+"\n"+trackLink+"\n"+albumImg); //DEBUG
	var pPlayer = document.getElementById("tp_newpopplayerwrapper");
	var pArtist = document.getElementById("tp_pi_artist");
	var pAlbum = document.getElementById("tp_pi_album");
	var pTrack = document.getElementById("tp_pi_title");
	var pAudio = document.getElementById("tp_pi_player");
	var pImg = document.getElementById("tp_pi_img");
	pArtist.innerHTML = "<a href='" + albumLink.match(/^(\/\/|[^\/]+)*/)[0] + "' target='_blank' title='" + albumArtist + "' alt='" + albumArtist + "'>" + albumArtist + "</a>";
	pAlbum.innerHTML = "<a href='"+ albumLink + "' target='_blank' title='" + albumTitle + "' alt='" + albumTitle + "'>" + albumTitle + "</a>";
	pTrack.innerHTML = "<a href=" + trackLink + " target='_blank' title='" + trackTitle + "' alt='" + trackTitle + "'>" + trackTitle + "</a>";
	pImg.src = albumImg;
	pAudio.src = trackURL;
	pAudio.load();
	document.head.getElementsByTagName("title")[0].innerHTML = trackTitle + "  |  " + albumArtist + "  ["+tpName+"]";
	pPlayer.style.display = "block";
}

//Loads TagPlayer UI 
function initPlayer(){
	//Minified HTML code for the player overlay, including a base64 encoded image for audio control
	var playerHtml = '<div style="margin-left: auto; margin-right: auto; margin-top: 0px; padding-top: 0px; width: 975px; background: none repeat scroll 0% 0% rgb(18, 19, 20); border: 1px solid rgb(102, 102, 102); border-radius: 0px 0px 15px 15px;"><div style="margin-left: auto; margin-right: auto; font-family: Helvetica Neue,Helvetica,Arial,sans-serif; font-size: 1.3em; border-bottom-left-radius: 50px; border-top-right-radius: 0px; border-top-left-radius: 0px; color: rgb(238, 238, 238); padding: 5px;"> <a class="anohover" href="' + tagplayerURL + '"><span><img style="border-bottom-right-radius: 15px; border-right: 1px solid rgb(187, 187, 187); border-bottom: 1px solid rgb(187, 187, 187); padding: 15px 25px 25px 15px;" src="https://s1.bcbits.com/img/logowhite_med.png" alt="home"><span style="display: inline; position: relative; left: -125px; font-size: 0.8em; top: -15px;">TagPlayer</span></span></a><div style="font-family: Helvetica Neue,Helvetica,Arial,sans-serif; float: right; font-size: 1em; border-bottom-left-radius: 10px; border-bottom: 1px solid rgb(153, 153, 153) ! important; padding: 15px 20px 20px; border-left: 1px solid rgb(102, 102, 102);"><i style="color: rgb(153, 153, 153); margin-right: 0.5em; font-size: 0.9em;">currently playing:</i> <span id="tp_currplaying">nothing</span></div></div><div id="tp_pdwrapper" style="width: 520px; margin-left: auto; margin-right: auto; margin-top: 50px;"><div id="tp_loading" style="font-family: Open Sans,sans-serif; padding: 15px 5px 5px 15px; position:absolute;display:none"><div style="margin-bottom:10px"><div id="circleG" style="text-align: center; padding: 80px 0px 50px 230px;"><div id="circleG_1" class="circleG"></div><div id="circleG_2" class="circleG"></div><div id="circleG_3" class="circleG"></div></div></div></div><div id="tp_newpopplayerwrapper" style="display:none;"><div id="tp_newpop" style="width: inherit; text-align: right; padding-bottom: 5px;"><span style="font-size: 0.9em; border-radius: 5px 5px 0px; border-width: 1px 1px medium; border-style: solid solid none; color: rgb(136, 136, 136); border-color: rgb(85, 85, 85) rgb(102, 102, 102) -moz-use-text-color; padding: 6px 5px 5px 5px; opacity: 0.7; user-select: none;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;" title="Do you want to listen to new tracks or popular tracks?"><label style="margin-left: 10px; margin-right: 5px;"><input name="prf" value="new" type="radio">new</label>&nbsp;/&nbsp;<label style="margin-right: 10px; margin-left: 5px;"><input name="prf" value="popular" type="radio">popular</label></span></div><div id="tp_playerwrapper" style="font-family: Open Sans,sans-serif;width:500px;padding:15px 5px 5px 15px;border-style:solid;border-radius:2px 2px 15px;border-width:1px;border-color:rgb(102, 102, 102) rgb(153, 153, 153) rgb(153, 153, 153) rgb(102, 102, 102); display:block;"><div id="tp_playerinfowrapper" style="margin-bottom:10px"> <img src="data:image/png;base64,R0lGODlhAQABAIAAADMzMwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" id="tp_pi_img" style="width: 100px; height: 100px; vertical-align: middle; border: 1px solid rgb(153, 153, 153); margin: 0px 20px 0px 0px;background-color:#333">	<span style="float: right; width: 370px; padding-top: 13px; color: rgb(238, 238, 238);"> <span id="tp_pi_title" class="tp_block tp_trackinfo" style="padding: 0px 0px 5px; font-size: 1.4em;">Nothing</span>	<span id="tp_pi_album" class="tp_block tp_trackinfo" style="font-style: italic; font-size: 0.8em;padding: 0px 0px 5px;"></span>	<span style="padding: 0px 0px 5px;" class="tp_block tp_trackinfo"><i>by</i> <span id="tp_pi_artist" style="margin-left:10px">No one</span></span>	</span></div><div class="tp_block"> <audio id="tp_pi_player" controls="" autoplay="" style="display:inline;width:460px;height:30px"></audio> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF2tvi4+TqsrK02tra8PH03t/kr6+w8/T17/Dy39/h7Ozs6Ojo3N3k3d3fv7+/2NjYvb7B8vP25+jsvb295ebq4uLj4OHm3d3dpaWmz8/V+fr69/j5x8fH7e7x5OTp4uLnsLCx19fWwcLCurq+tra2srKy5ufs5eXq2Nnf1dbd1tbZ1dXV0tPWv8DExsbLvLy/tbW4rq6v3N3j29zi2tvh////8/P18vL09PT29fX3+fn68fHz7+/y+Pj5+/v88PHz+vr79vb49/f43d7l3Nzi8PDz2trhxMTE8fL0/Pz87u/x7e3w9fb39/f529vi0tLS8vP1zs7OzMzM8PDy29zj/v7/+/v77O3w0dHR09PT7u7x9vb33N3i/f3+3d3j+Pj68vL1wcHB0NDQ+Pj45+fr3d7jwMDAz8/P5ubm2drh4uPoxcXF6Ojs6ent9PX3wsLCwsLDycnJ4eHh6+zv9vf46uru6uvu9fX29fX19PT18vP08/Pz9vf5tbW19/f37Ozv/v7+3d7k+fn73Nzjurq6wcHC6+vvwMDBw8PD5eXl5ubn2Nja+/z9zc3N7u7uy8vL4eLn+fn56eruycrP5+fo4ODg0dLXuLi57e3x8fLz8PDw3+Dl+Pn59PT3+vr66urt/f391NXb5OTk5OTl/Pz+uLi4ubm52drg2trcsbGy7+/v7e7v3N7l6ert8vH0xsfJ3t/m29vg+fr8xcXG+/v909TZ2dvh4eHizs3N4eLlt7i44+Pk5+fn3NvdsrGz+fn8x8jNy8zR2dnb6enp2tzi9PX2uLi7z8/Q19fe7Ozw7O3x39/g4uPp6uvv6+vuwMHBxMTF0NDR9vb5/Pz96Ojt7u7wxMTJxcXKxcbJ09TV9vb29fT22trera6wzs7Nr6+y9fX4+vr89vX49PT0/f7+6Ojn7u/y7+/z4ODhzc7Qzc7T4eLo1NTTtra5tre60tLVwcHFw8PEwsPH29vd2dnayMjIyMjJ5ufr5+fq8vLy29vctLS0s7O14uLosLCz/////GwAQwAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAPtSURBVHjaYuis+I8OPDv/YwKGwmW30MUaaiOxKAz6lTYLXdCdvx+LQq7klsNogtmmzNkLMBROMa0TLkIz0dT0NN88TIWhYWlf0BR6mnZNr0BT2GUatsCzIAJVoZ2D6WGVVRgKHexivxWiKZwXurr2KbLC3gxTBykrqyXH0zzhgh1AhVa2PdYqU1EUhjpYxfs6bbnZkoxkopWVraOU+XR+JIWdQIW2NT6Wm1bUVsMVhlnF2zpa+ubpp8MVBi6OtbL1dbS0MIvnVO2DKgx1mGPr9MiC3XKukgySwjnSTj4WZlXWeTsVMsCCH59I2TqB9Jp7CK7n84QqXBRr61sCVGhu/yxBfZ842DNAS5yiLc0CPDg4El4urYMo3H0ZKGhhlmDN4eX9/McfRZDCJVa+jj6VZutcbWRPsrz/Uw1WKNoDtIU9wNrVy7u+tPj72x3//xf02JZYWrCbW3NEhbfNn6GlwAVUmC5qVwK0BSjoFd426UqukH72/wt20kAXBpgDDawvyxU6e4dtEVDhdrtooKAHSLBtrZCIiPoHPj47Jx9LoO+AjjlXlpuinrJxpThDetFDn6NAn9hEhRcLyc02Mm6MkVDZ75jHbjYz2OtqeKmIPKuL8Ws9YYakFw7lFkBBm6jSLCM/k+Vumf+mbm4C+s7c2sbLO2V2s4nbcqODvycyJHE2gYLGxiaFNcTY2M2t2UD7f0GTZWWAebBNeJaRi7FfptE0tsf/GZJOW1VWebhypDQCBU3ceJSBuSA/vhxoYLD3BCMjY79tzQvZgDEGVBgPNDA4pzE1xtjPhEc3Gxhm+dLlZh72UVlxqcbGJiEn2LhB4RjB62tubV/MmmpkbJLpfF24AaSwhh2oVyQuLsbPhMFkJTijABXWAF2YBbLEbc3kpWEgwXxHM2vXssa4GGMTk5A/zJC4jth7ydo6xwgkyPOKCZIklSzNrL3ADjQxegfNJAz+ex/YR802cgG6bysbNEG23vYA6jVyMTFxFvgKS2b+n/OshYCaTYw0DbmggokWHjZiRsBQdf6UBk+4/ivm2oi5uJiEaNzdAxNUCrCeBNLrfKClAaHwkMV8I5cjfsZ/xOH5ozXBNQsYMM6vfk9E5Bn/L2ZyfsZ+RgaKiByXmOCdCvTbtJVIZQCDf7c1q5+fs/I9pDzcbp3j52e0kA259GKI7D5lbLJBdzNyqdDumuXGo8GGUnYBFaplOl/jQylnEmfEGbvd341a9kRq/XWevMsTVWFuSAgTM1ppFqlzRpIpGVUwUaTxWBJ6+fjmvabCTzTBdkb9QowSV1tvZR+64PkbrZhF80WJDAxBhWWemAp/iWPWAIF1mGIAAQYAwFABde8lMTwAAAAASUVORK5CYII=" id="tp_pi_nextbtn" style="opacity: 0.8; background-color: rgb(34, 34, 34); cursor: pointer; width: 15px; height: 15px; padding: 7px; border-radius:7px" alt="Next track"></div></div></div></div><div id="tp_tagwrapper" style="margin-top: 70px; margin-left: auto; margin-right: auto; width: 80%; font-family: Open Sans,sans-serif; text-align: left;"><div style="color: rgb(238, 238, 238); font-size: 1.5em; border-radius: 5px; padding: 5px; position: relative; left: -30px;">SELECT A TAG</div><div id="" style="margin: 30px 0px; color: rgb(238, 238, 238);" class="tp_typeit_sel"><span style="font-size: 1.3em; margin-right: 15px;">Type it</span><input id="tp_tagtypeit_in" style="width: 200px; background: none repeat scroll 0% 0% transparent; border-radius: 5px; border: 1px solid rgb(238, 238, 238); padding: 5px; font-size: 1.3em; color: rgb(238, 238, 238);" placeholder="eg. blues"><button style="border-radius: 5px; color: rgb(51, 51, 51); display: inline; font-size: 1.3em; height: 30px; margin-left: 5px;" type="button" id="tp_tagtypeit_btn">Play!</button></div><div class="tags tp_tagcloud_sel" id="tp_taglist" style=""><span style="color: rgb(238, 238, 238); font-size: 16px; margin: 0px 0px 10px; display: block;">Click it &nbsp;&nbsp;&darr;</span></div><div style="margin:20px 0px;width:100%;text-align:right;" class=""><a id="tp_tw_viewall" style="display:inline">view all</a></div></div><div style="padding:50px 0"></div><div id="tp_msg_wrapper" style="display:none;position:fixed;width:500px;max-height:200px;background:#121314;border:#eee 1px solid;border-bottom:none;border-radius:5px;margin:0px 0px 0px -301px;padding:20px 50px;;left:50%;bottom:0;color:#eee;overflow:auto;"><span id="tp_msg_txt"></span><span id="tp_msg_exit" style="float:right;margin:10px 10px 0px 0px;padding:5px 7px;background:none;position:absolute;top:0;right:0;border-radius:3px;cursor:pointer;border:#ccc 1px solid">X</span></div></div><div id="tp_about_btn" style="position: fixed; bottom: 0px; padding: 20px; right: 20px; border: 1px solid rgb(102, 102, 102); border-radius: 5px; color: rgb(238, 238, 238); margin: 10px; background: none repeat scroll 0% 0% rgb(18, 19, 20); cursor: pointer; user-select: none;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;">About</div>';
	
	//Minified tags list, which is used to generate a tag cloud
	// the string will be split, every '<' representing lines, '>' representing cols
	// each line contains information about: the display size of the tag, the name of the tag, whether the tag is hidden initially
	var tagstr='1>rock<1>electronic<1>alternative<1>experimental<1>hip hop<2>hip hop/rap<2>pop<2>punk<3>indie<3>folk<3>ambient<4>acoustic<4>rap<4>metal<5>instrumental<5>jazz<5>noise<5>hardcore<6>electronica<6>soul<6>indie rock<6>house<7>techno<7>blues<7>dubstep<7>electro<8>singer-songwriter<8>soundtrack<8>psychedelic<8>funk<9>r&amp;b<9>dance<9>alternative rock<9>beats<9>world<9>lo-fi><9>drone><9>industrial><9>post-rock><9>underground><9>progressive><9>experimental electronic><9>punk rock><9>country><9>reggae><9>indie pop><9>underground hip hop><9>classical><9>pop punk><9>music><9>death metal><9>hiphop><9>shoegaze><9>garage><9>black metal><9>folk rock><9>hard rock><9>rock &amp; roll><9>guitar><9>spoken word><9>idm><9>pop rock><9>piano><9>post-punk><9>americana><9>dub><9>trance><9>bass><9>rap &amp; hip-hop><9>downtempo><9>trip hop><9>instrumentals><9>instrumental hip-hop><9>progressive rock><9>r&amp;b/soul><9>experiemental><9>drum &amp; bass><9>hip hop instrumentals><9>dark ambient><9>grunge><9>metalcore><9>emo><9>minimal><9>chillout><9>post-hardcore><9>remix><9>edm><9>devotional><9>avant-garde><9>ambient electronic><9>glitch><9>indie folk><9>comedy><9>hardcore punk><9>chill><9>electronic music><9>grindcore><9>experimental rock><9>dark><9>synth><9>doom><9>christian><9>garage rock><9>psychedelic rock><9>new wave><9>acoustic guitar><9>progressive metal><9>synthpop><9>deep house><9>diy><9>improvisation><9>heavy metal><9>thrash metal><9>chiptune><9>blues rock><9>chillwave><9>latin><9>dream pop><9>fusion><9>experimental hip-hop><9>orchestral><9>new age><9>melodic><9>soundscape><9>love><9>drum and bass><9>live><9>alternative hip-hop><9>ska><9>electroacoustic><9>power pop><9>noise rock><9>songwriter><9>tech house><9>breakbeat><9>rnb><9>atmospheric><9>rock and roll><9>underground rap><9>surf><9>sludge><9>disco><9>thrash><9>gospel><9>space><9>acoustic rock><9>progressive house><9>stoner><9>freestyle><9>free><9>alt-country><9>doom metal><9>stoner rock><9>bass music><9>world music><9>poetry><9>alternative pop><9>lofi><9>folk pop><9>independent><9>beat><9>roots><9>kids><9>glitch hop><9>mixtape><9>dubstep &amp; electronic><9>hiphop rap><9>heavy><9>classic rock><9>math rock><9>screamo><9>folk punk><9>jazz and improvised music><9>lyrical><9>hip hop soul><9>breaks><9>deathcore><9>groove><9>acid><9>electro house><9>grime><9>space rock><9>jungle><9>neo-soul><9>art rock><9>original><9>house music><9>other><9>vocal><9>cover><9>abstract><9>cinematic><9>rock n roll><9>bluegrass><9>beats for sale><9>gothic><9>breakcore><9>boom bap><9>free download><9>deep><9>lounge><9>melodic hardcore><9>psytrance><9>crust><9>easy listening><9>club><9>harsh noise><9>darkwave><9>ep><9>psych><9>synthesizer><9>jam><9>dnb><9>drums><9>ebm><9>death><9>acoustic folk><9>film music><9>garage punk><9>electropop><9>weird><9>new><9>soulful><9>djent><9>popindie><9>post-metal><9>minimalist><9>goth><9>spiritual><9>fun><9>dancehall><9>synth pop><9>epic><9>samples><9>prog><9>video game music><9>grind><9>funky><9>female vocals><9>ballad><9>contemporary><9>rap alternative><9>meditation><9>hip hop (real shit)><9>sample-based><9>punk hardcore><9>experimental pop><9>drone ambient><9>powerviolence><9>field recordings><9>trap music><9>8-bit><9>producer><9>acoustic pop><9>noise pop><9>techno and variations><9>old school><9>beat tape><9>instrumental rock><9>ambient rock><9>rockabilly><9>jazz fusion><9>original music><9>worship><9>hip-hop instrumental><9>sound art><9>soul hip hop><9>country rock><9>ukulele><9>swing><9>hip-hop. rap><9>horror><9>chill out><9>urban><9>improv><9>noise ambient><9>sad><9>jazzy><9>drumstep><9>vaporwave><9>free jazz><9>art><9>synthwave><9>krautrock><9>heavy rock><9>power electronics><9>soundscapes><9>inspirational><9>dance music><9>witch house><9>folktronica><9>8bit><9>dreampop><9>punkrock><9>electronic rock><9>dj><9>vocals><9>improvised><9>christian rap><9>crunk><9>retro><9>underground hip hip><9>minimalism><9>demo><9>r&amp;b hip hop soul><9>mashup><9>melodic death metal><9>the><9>solo><9>improvised music><9>indiepop><9>classic><9>emotional><9>loops><9>triphop><9>eclectic><9>rapper><9>surf rock><9>electro pop><9>psychedelic pop><9>singer><9>violin><9>future><9>dreamy><9>film score><9>free improvisation><9>80s><9>pop folk><9>powerpop><9>remixes><9>covers><9>celtic><9>smooth><9>dope><9>tribal><9>jam band><9>chillstep><9>space music><9>new music><9>hiphop instrumental><9>mellow><9>avantgarde><9>french><9>trap beats><9>stoner metal><9>film><9>musique concrete><9>noisecore><9>compilation><9>strings><9>2012><9>country-alt><9>party><9>rap beats><9>band><9>video game><9>spoken word poetry><9>funk rock><9>trippy><9>postrock><9>album><9>cello><9>rave><9>ethereal><9>grunge rock alternative><9>traditional><9>poetry and music><9>punk pop><9>experimental folk><9>low-fi><9>groove metal><9>soft rock><9>home recording><9>beatstrumental><9>tape><9>unsigned><9>piano solo><9>radio><9>lyrical hip-hop><9>electric><9>conscious hip hop><9>bedroom pop><9>abstract hip-hop><9>contemporary classical><9>southern rock><9>fuzz><9>world fusion><9>tropical><9>drum n bass><9>analog><9>hardstyle><9>anti-folk><9>dark electro><9>down tempo><9>electric guitar><9>relaxation><9>future beats><9>female vocalist><9>field recording><9>funny>';
	
	//Minified CSS code for the player overlay
	var playerCSS = '#circleG{width:56px}.circleG{background-color:#FFF;float:left;height:12px;margin-left:6px;width:12px;-moz-animation-name:bounce_circleG;-moz-animation-duration:1.9500000000000002s;-moz-animation-iteration-count:infinite;-moz-animation-direction:linear;-moz-border-radius:8px;-webkit-animation-name:bounce_circleG;-webkit-animation-duration:1.9500000000000002s;-webkit-animation-iteration-count:infinite;-webkit-animation-direction:linear;-webkit-border-radius:8px;-ms-animation-name:bounce_circleG;-ms-animation-duration:1.9500000000000002s;-ms-animation-iteration-count:infinite;-ms-animation-direction:linear;-ms-border-radius:8px;-o-animation-name:bounce_circleG;-o-animation-duration:1.9500000000000002s;-o-animation-iteration-count:infinite;-o-animation-direction:linear;-o-border-radius:8px;animation-name:bounce_circleG;animation-duration:1.9500000000000002s;animation-iteration-count:infinite;animation-direction:linear;border-radius:8px}#circleG_1{-moz-animation-delay:0.39s;-webkit-animation-delay:0.39s;-ms-animation-delay:0.39s;-o-animation-delay:0.39s;animation-delay:0.39s}#circleG_2{-moz-animation-delay:0.9099999999999999s;-webkit-animation-delay:0.9099999999999999s;-ms-animation-delay:0.9099999999999999s;-o-animation-delay:0.9099999999999999s;animation-delay:0.9099999999999999s}#circleG_3{-moz-animation-delay:1.1700000000000002s;-webkit-animation-delay:1.1700000000000002s;-ms-animation-delay:1.1700000000000002s;-o-animation-delay:1.1700000000000002s;animation-delay:1.1700000000000002s}@-moz-keyframes bounce_circleG{0%{}50%{background-color:#000}100%{}}@-webkit-keyframes bounce_circleG{0%{}50%{background-color:#000}100%{}}@-ms-keyframes bounce_circleG{0%{}50%{background-color:#000}100%{}}@-o-keyframes bounce_circleG{0%{}50%{background-color:#000}100%{}}@keyframes bounce_circleG{0%{}50%{background-color:#000}100%{}}a:hover{text-decoration:underline}.tags{font-size:2.2em}a,.tag{color:#eee;cursor:pointer;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size-adjust:none;font-stretch:normal;font-style:normal;font-variant:normal;font-weight:400;text-decoration:none;white-space:nowrap}.tag{line-height:22.3167px;padding-right:10.8833px}.size1{font-size:100%}.size2{font-size:95%}.size3{font-size:90%}.size4{font-size:85%}.size5{font-size:80%}.size6{font-size:75%}.size7{font-size:70%}.size8{font-size:65%}.size9{font-size:60%}.nothidden{display:none}.tp_trackinfo{overflow:hidden;text-overflow:ellipsis}.tp_block{display:block}.tp_trackinfo a,.tp_trackinfo a:hover{color:#eee;}.tp_trackinfo a:hover{text-decoration:none;border-bottom:#ddd 1px dotted}body{overflow:hidden}a.anohover:hover{text-decoration:none;}';

	//Adding player HTML to the page
	var d = document.createElement("div");
	d.setAttribute("style","width: 100%; height: 100%; position: fixed; left: 0px; top: 0px; z-index: 99999; overflow: auto; background: none repeat scroll 0% 0% rgb(18, 19, 20);");
	d.innerHTML = playerHtml;
	document.body.appendChild(d);
	
	//Adding tag cloud by parsing the minified tag string and constructing a tag cloud from it
	// Format: <a class="tag sizeK [nothidden]">tagname</a>
	// eg. <a class="tag size1">rock</a> 
	// or <a class="tag size9 nothidden">bedroom pop</a>
	var wrapperSpan = document.createElement("span");
	var lines = tagstr.split("<");
	for (var i=0;i<lines.length;++i){
		var cols = lines[i].split(">");
		var a = document.createElement("a");
		a.setAttribute("class","tag size" + cols[0] + (cols.length>=3 ? " nothidden" : ""))
		a.innerHTML = cols[1];
		wrapperSpan.appendChild(a);
		wrapperSpan.appendChild(document.createTextNode(" "))
	} 
	document.getElementById("tp_taglist").appendChild(wrapperSpan);

	//Adding player style
	GM_addStyle(playerCSS)
	
	//'Prefer new/popular music' radio buttons
	var rbtns = document.getElementById("tp_newpop").getElementsByTagName("input");
	for (var i=0;i<rbtns.length;++i){
		rbtns[i].checked = (rbtns[i].value == "popular" ? (preferPopular) : (!preferPopular));
		rbtns[i].addEventListener("click",function(e){
			var target = e.target || e.srcElement;
			if ((target.value=="new" && !preferPopular)
			|| (target.value=="popular" && preferPopular))
				return;	//User clicked an already checked button, no changes have to be made
			localStorage.setItem("GM_BCTP_preferPopular",(target.value == "new" ? "false" : "true"))
			preferPopular = (localStorage.getItem("GM_BCTP_preferPopular") != "false" ? true : false);
			displayMsg("From now on you are listening to <b>"+(preferPopular ? "popular":"new")+"</b> music (rather than "+(!preferPopular ? "popular":"new")+").<br>You might want to reload this tag for the changes to take full effect.",false);
			//console.log("[BCTP]\t"+"preferPopular changed to "+preferPopular);
		});
	}
	
	//Interactivity
	document.getElementById("tp_pi_nextbtn").addEventListener("click",function(){
		if (!isTrackLoading && albumList.length>0)
			loadNext();
	});
	document.getElementById("tp_pi_player").addEventListener("ended",function(){
		if (!isTrackLoading)
			loadNext();
	});
	document.getElementById("tp_pi_player").addEventListener("playing",function(){
		setTitlePlaying(true);
	});
	document.getElementById("tp_pi_player").addEventListener("play",function(){
		setTitlePlaying(true);
	});
	document.getElementById("tp_pi_player").addEventListener("pause",function(){
		setTitlePlaying(false);
	});
	document.getElementById("tp_pi_player").addEventListener("ended",function(){
		setTitlePlaying(false);
	});
	document.getElementById("tp_taglist").addEventListener("click",function(e){
		if(e.target !== e.currentTarget && e.target.tagName.toLowerCase() == "a"){
			loadTag(e.target.textContent);
		}
	});
	document.getElementById("tp_tw_viewall").addEventListener("click",function(e){
		css(".nothidden","display","inline");
		e.target.setAttribute("style","display:none");
	});
	document.getElementById("tp_tagtypeit_in").addEventListener("keyup",function(e){
		var key = e.keyCode || e.which;
		if (key===13){
			var t = document.getElementById("tp_tagtypeit_in");
			if (t.value.length<=2)
				return;
			loadTag(t.value);
		}
	});
	document.getElementById("tp_tagtypeit_btn").addEventListener("click",function(e){
		var t = document.getElementById("tp_tagtypeit_in");
		if (t.value.length<=2)
			return;
		loadTag(t.value);
	});
	document.getElementById("tp_msg_exit").addEventListener("click",function(e){
		document.getElementById("tp_msg_wrapper").style.display = "none";
	});
	
	//About button + popup
	document.getElementById("tp_about_btn").addEventListener("click",function(e){
		var w = document.getElementById("tp_aboutWrapper");
		if (w !== null){
			document.getElementById("bn_name").innerHTML = getEdgyIndieBandName();
			w.style.display = "block";
		} else {
			var aboutMainWrapper = document.createElement("div");
			aboutMainWrapper.id = "tp_aboutWrapper";
			var overlay = document.createElement("div");
			overlay.setAttribute("style","display:block;position:fixed;z-index:999998;width:100%;height:100%;opacity:0.8;background:#000;text-align:center");
			
			var exitDiv = document.createElement("div");
			var exitSpan = document.createElement("span");
			exitSpan.setAttribute("style","display: inline; border-width: 1px 1px medium; border-style: solid solid none; color: rgb(255, 255, 255); font-size: 1.5em; cursor: pointer; margin: 5px; border-radius: 3px; padding: 3px 7px; border-color: rgb(119, 119, 119);");
			exitSpan.innerHTML = "X";
			
			var contentDiv = document.createElement("div");
			contentDiv.setAttribute("style","border-radius: 5px; text-align: center; height: 100%; background: rgb(18, 19, 20); color: rgb(238, 238, 238); border: 1px solid rgb(136, 136, 136); margin-top: 3px; padding: 20px 20px;overflow:auto;");
			contentDiv.innerHTML = "<div style='font-size:1.2em;display:block;'>"+tpName+"<br>(v"+tpVersion+")</div><div style='margin-top:20px;text-align:left'><div style='margin-top:10px'>GNU GPL v3 FOSS InstallGentoo.</div><div style='margin-top:10px'>For more info, updates, feature requests, reporting bugs, asking questions goto:<br><a style='text-decoration:underline;' target='_blank' href='https://github.com/SLLABslevap/bandcamp-tagplayer'>https://github.com/SLLABslevap/bandcamp-tagplayer</a><br><a style='text-decoration:underline;' target='_blank' href='https://greasyfork.org/en/users/8720-sllabslevap'>https://greasyfork.org/en/users/8720-sllabslevap</a><br><a style='text-decoration:underline;' target='_blank' href='https://openuserjs.org/users/SLLABslevap'>https://openuserjs.org/users/SLLABslevap</a><br><a style='text-decoration:underline;' target='_blank' href='https://monkeyguts.com/author.php?un=sllabslevap'>https://monkeyguts.com/author.php?un=sllabslevap</a></div><div style='margin-top:10px'>Random indie band name of the day: <b id='bn_name'>"+getEdgyIndieBandName()+"</b></div></div>";
		
			var contentWrapper = document.createElement("div");
			contentWrapper.setAttribute("style","text-align:center;position:fixed;width:500px;height:300px;left:50%;top:50%;margin:-151px 0 0 -251px;z-index:999999;border:#ccc;text-align:right;");
			
			exitDiv.appendChild(exitSpan);
			contentWrapper.appendChild(exitDiv);
			contentWrapper.appendChild(contentDiv);
			aboutMainWrapper.appendChild(overlay);
			aboutMainWrapper.appendChild(contentWrapper);
			document.body.appendChild(aboutMainWrapper);
			
			overlay.addEventListener("click",function(){
				document.getElementById("tp_aboutWrapper").style.display = "none";
			});
			exitSpan.addEventListener("click",function(){
				document.getElementById("tp_aboutWrapper").style.display = "none";
			});
		}
	});
}

//Display messages using the id=tp_msg_wrapper element (only on tagplayer pages)
function displayMsg(txt,isError){
	document.getElementById("tp_msg_txt").innerHTML = (isError ? "<span style='background:#CC0000;margin-right:10px;'>Error:</span> " : "<span style='background:#00A300;margin-right:10px;'>Info:</span> ") + txt;
	document.getElementById("tp_msg_wrapper").style.display = "block";
}

//Stand alone version of displayMsg, it displays messages using 
// the id=tp_msg_wrapper element inserted into the current page 
// (can be used on any page, its style might be affected by the page's CSS though)
function displayMsgAlt(txt,isError){
	if (!document.getElementById("tp_msg_wrapper")){
		var msgDiv = document.createElement("div");
		msgDiv.innerHTML = '<div id="tp_msg_wrapper" style="display:none;z-index:99999999;position:fixed;width:500px;max-heigth:250px;background:#121314;border:#eee 1px solid;border-bottom:none;border-radius:5px;margin:0px 0px 0px -301px;padding:20px 50px;;left:50%;bottom:0;color:#eee;overflow:auto;"><span id="tp_msg_txt"></span><span id="tp_msg_exit" style="float:right;margin:10px 10px 0px 0px;padding:5px 7px;background:none;position:absolute;top:0;right:0;border-radius:3px;cursor:pointer;border:#ccc 1px solid">X</span></div>';
		document.body.appendChild(msgDiv);
		document.getElementById("tp_msg_exit").addEventListener("click",function(e){
			document.getElementById("tp_msg_wrapper").style.display = "none";
		});
	}
	document.getElementById("tp_msg_txt").innerHTML = (isError ? "<span style='background:#CC0000'>Error:</span> " : "Info: ") + txt;
	document.getElementById("tp_msg_wrapper").style.display = "block";
}

//Updates URL to match the currently playing tag
// so that the page can be bookmarked
// tag = bandcamp-readable tag
// disptagUnsafe = human-readable tag as parsed directly from the url (uri decoded), html not escaped 
function setTagDisplay(isLoading, tag, disptagUnsafe){
	if (isLoading){
	} else {
		window.history.pushState("BCTP", "", tagplayerURL + (disptagUnsafe));
	}
}

//Updates the "currently plaing" section
function setCurrPlayingTag(tag, alttag){
	var c = document.getElementById("tp_currplaying");
	c.innerHTML = "<span title='"+(alttag==undefined?"":alttag)+"'>" + tag + "</span>" ;
}

//Updates page title with an indicator to the player's state (playing/stopped)
function setTitlePlaying(isPlaying){
	var title = document.head.getElementsByTagName("title")[0];
	if (!isPlaying){
		title.innerHTML = title.innerHTML.replace("\u25B6 ", "");
	} else {
		if (title.innerHTML.indexOf("\u25B6")<0){
			title.innerHTML = "\u25B6 " + title.innerHTML;
		}
	}
}

function setTrackLoading(isLoading){
	if (isLoading){
		isTrackLoading = true;
		document.getElementById("tp_loading").style.display = "inline";
	} else {
		document.getElementById("tp_loading").style.display = "none";
		isTrackLoading = false;
	}
}

//Transforms tag string into bandcamp compatible format
// eg. "rock & roll" --> "rock-roll"
function makeCompatible(tag){
	tag = tag.replace(/\&amp\;/g,"&");
	tag = tag.replace(/[^\.\(\)a-zA-Z0-9]/g,"-")
	tag = tag.replace(/\-+/g,"-");
	return tag;
}	

//Demoing my poor coding skills by generating shitty band names using a shitty limited dictionary
function getEdgyIndieBandName(){
	var bn_b1 = "genomic,dimply,unawakened,premethodical,spermous,smoothbore,gestureless,suffuse,happy,wreckful,unobscene,prompt,future,lyophobic,sicklier,groomed,weer,mismatched,patchy,bettering,analytical,naturalist,disarming,hoodwink,buttonholed,pickling,leprose".split(",");
	var bn_b2 = "robbery,chez,childbirth,anear,barrette,opuscule,bat,rabbitry,hamal,ideogram,future,bantamweight,legislate,spirit,subject,twig,embouchure,viking,landholding,conductor,doom,quirt,stimulation,nagana,moonlight,pinhead,prompt,drift ,cystine,paederast,cheddar,atelier,death".split(",");
	var bn_r = getRandomInt(0,3);
	var bn_a = [];
	var bn_i;
	for (bn_i=0;bn_i<bn_r;++bn_i){
		bn_a[bn_i] = bn_b1[getRandomInt(0,(bn_b1.length)-1)]
		bn_a[bn_i] = (bn_a[bn_i])[0].toUpperCase() + bn_a[bn_i].slice(1);
	}
	bn_a[bn_i]=bn_b2[getRandomInt(0,(bn_b2.length)-1)] + (getRandomInt(0,1) == 0 ? "s" : "")
	bn_a[bn_i] = (bn_a[bn_i])[0].toUpperCase() + bn_a[bn_i].slice(1);
	if (bn_a.length>1 && getRandomInt(0,1) == 0){
		bn_a[bn_a.length-2] = bn_b2[getRandomInt(0,(bn_b2.length)-1)];
		bn_a[bn_a.length-2] = (bn_a[bn_a.length-2])[0].toUpperCase() + bn_a[bn_a.length-2].slice(1);
	}
	return bn_a.join(" ");
}

//http://www.janoszen.com/2012/04/16/proper-xss-protection-in-javascript-php-and-smarty/
function escapeHtml(unsafe) {
    return (unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;"));
}

//https://stackoverflow.com/questions/566203/changing-css-values-with-javascript#11081100
function css(selector, property, value) {
    for (var i=0; i<document.styleSheets.length;i++) {//Loop through all styles
        //Try add rule
        try { document.styleSheets[i].insertRule(selector+ ' {'+property+':'+value+'}', document.styleSheets[i].cssRules.length);
        } catch(err) {try { document.styleSheets[i].addRule(selector, property+':'+value);} catch(err) {}}//IE
    }
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
