// ==UserScript==
// @name 		Last.fm: Opera - My Top Tracks - July 2008
// @namespace 	xxx
// @description 	Shows any tracks on Last.fm artist pages that you've listened to by that artist.
// @include 	http://www.last.fm/music/*
// @exclude	http://www.lastfm.*/music/*/*
// @exclude	http://www.last.fm/music/*/*
// @version 0.0.1.20150227023155
// @downloadURL https://update.greasyfork.org/scripts/8211/Lastfm%3A%20Opera%20-%20My%20Top%20Tracks%20-%20July%202008.user.js
// @updateURL https://update.greasyfork.org/scripts/8211/Lastfm%3A%20Opera%20-%20My%20Top%20Tracks%20-%20July%202008.meta.js
// ==/UserScript==

/* CUSTOM VARIABLES */
// chartLimit:		Maximum number of songs to display in "My Top Tracks" on
//					each artist's page. Set to 0 for no limit.
var chartLimit = 20;
var APIkey = "0d1abf0beae8570e6f8f2441bf561eb3";
// chartType:		Which chart to use for data. Options: "overall" "3month" "6month" "12month" "weekly"    : 1month is not consistently supported
var defChartType = "3month";
var chartList = "+overall+1month+3month+6month+12month+7day+";
var subChartType = "tracks"; // "tracks" or "albums" - can be toggled
var doRank = 1; // Include rank data? 1 = yes, 0 =no

// chartDescrip
var chartDescrip = new Object();
chartDescrip["overall"] = "overall";
chartDescrip["12month"] = "last 12 months";
chartDescrip["6month"] = "last 6 months";
chartDescrip["3month"] = "last 3 months";
chartDescrip["1month"] = "last month";
chartDescrip["7day"] = "last week";

/* History */
// 17-jul-2008: We'll call this a fresh start for the new "beta" Last.fm
// 26-Jul-2008: Fix for artist names
// 29-Jul-2008: Emergency fix for loading issue
// 22-Feb-2015: Massive changes to improve stuff

var mychart;
var artist, artistENC;
var username;
/* SCRIPT */
function xpath(query) {
	return document.evaluate(query, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
}

function escape2(str) {
	var times;
	if (arguments.length < 2) {
		times = 1;
	} else {
		times = arguments[1];
	}
	for (var i = 0; i < times; i++) {
		str = str.replace(/\%25 /g, "&pct; ");
		str = str.replace(/\% /g, "&pct; ");
		str = encodeURIComponent(str).replace(/\%20/g, "+");
		str = str.replace(/\&pct; /g, "%25 ");
	}
	return str;
}

function unescape2(str) {
	var times;
	if (arguments.length < 2) {
		times = 1;
	} else {
		times = arguments[1];
	}
	for (var i = 0; i < times; i++) {
		str = str.replace(/\%25 /g, "&pct; ");
		str = str.replace(/\% /g, "&pct; ");
		str = decodeURIComponent(str.replace(/\%26/g, "&amp;"));
		str = decodeURIComponent(str.replace(/\+/g, "%20"));
		str = decodeURIComponent(str.replace(/ \& /g, " &amp; ")); // Fix for artist with ampersand for and
	}
	return str;
}

function toggleSubType() {
	if (subChartType == "albums") { subChartType = "tracks";
	} else { subChartType ="albums"; }
	getTrax(defChartType);
}

// function unixtimeNow() {
//	var nowtime = new Date;
//	return ((nowtime.valueOf() * 0.001)|0);
// }

function doChart(xmlText, username, chartType, aRank, aPlay) {
	if ((xmlText.getElementsByTagName("lfm")[0].getAttribute("status")).match(/failed/)) { alert("No such user"); return; }
	if (subChartType == "albums") {
		var allArtists = xmlText.evaluate("//lfm/topalbums/album/artist/name",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var allAlbums = xmlText.evaluate("//lfm/topalbums/album/name",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var allPlays = xmlText.evaluate("//lfm/topalbums/album/playcount",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var allURLs = xmlText.evaluate("//lfm/topalbums/album/url",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var allMBIDs = xmlText.evaluate("//lfm/topalbums/album/mbid",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var allImages = xmlText.evaluate("//lfm/topalbums/album/image[@size='extralarge']",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	} else {
		var allArtists = xmlText.evaluate("//lfm/toptracks/track/artist/name",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var allAlbums = xmlText.evaluate("//lfm/toptracks/track/name",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var allPlays = xmlText.evaluate("//lfm/toptracks/track/playcount",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var allURLs = xmlText.evaluate("//lfm/toptracks/track/url",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var allMBIDs = xmlText.evaluate("//lfm/toptracks/track/mbid",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var allImages = xmlText.evaluate("//lfm/toptracks/track/image[@size='extralarge']",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	}
	var tracks = new Array();
	var lastPos = 0;
	var lastCount;
	var j = 0;
	var currCount = 0;
	myTotalPlays = 0;
	var metaArray = document.getElementsByName('og');
	for (var i = 0; i < allArtists.snapshotLength; i++) {
		var currArtist = new XMLSerializer().serializeToString(allArtists.snapshotItem(i).firstChild);
		if (currArtist == artist) {
			var currName = new XMLSerializer().serializeToString(allAlbums.snapshotItem(i).firstChild);
			var currCount = new XMLSerializer().serializeToString(allPlays.snapshotItem(i).firstChild);
			var currURL = new XMLSerializer().serializeToString(allURLs.snapshotItem(i).firstChild);
			currCount = currCount.replace(/,/g,"");
			currName = currName.replace(/\?autostart/,"");
			tracks[j] = new Array();
			tracks[j]["name"] = currName;
			tracks[j]["count"] = currCount;
			tracks[j]["URL"] = currURL;
			myTotalPlays = myTotalPlays + parseInt(currCount);
			if (j == 0) {
				tracks[0]["pos"] = 1;
				var maxCount = tracks[0]["count"];
			} else {
				if (tracks[j]["count"] == lastCount) {
					tracks[j]["pos"] = lastPos;
				} else {
					tracks[j]["pos"] = j + 1;
				}
			}
			tracks[j]["width"] = Math.max(20, Math.round(tracks[j]["count"] / maxCount * 98));
			lastPos = tracks[j]["pos"];
			lastCount = tracks[j]["count"];
			j++;
		}
	}
	if (chartLimit < 1) { chartLimit = 500; }
	var HTML = "";
	if (!navigator.userAgent.match(/Opera/)) {
		HTML += "<span>Use the menu options to select the time period and chart type.</span>";
	}
//  Fancy toggler
		HTML += "<span class=\"horizontalOptions clearit\"><ul>";
		HTML += "<li class=\""+((chartType=="7day")?"current ":"")+"first chartweek\"><a "+((chartType=="7day")?"name=\"\"":"href=\"javascript:getTrax(\'7day\')\"")+">Last week</a></li>";
//		HTML += "<li class=\""+((chartType=="1month")?"current ":"")+"chart1month\"><a "+((chartType=="1month")?"name=\"\"":"href=\"javascript:getTrax(\'1month\')\"")+">Last month</a></li>";
		HTML += "<li class=\""+((chartType=="3month")?"current ":"")+"chart3month\"><a "+((chartType=="3month")?"name=\"\"":"href=\"javascript:getTrax(\'3month\')\"")+">Last 3 months</a></li>";
		HTML += "<li class=\""+((chartType=="6month")?"current ":"")+"chart6month\"><a "+((chartType=="6month")?"name=\"\"":"href=\"javascript:getTrax(\'6month\')\"")+">Last 6 months</a></li>";
		HTML += "<li class=\""+((chartType=="12month")?"current ":"")+"chartyear\"><a "+((chartType=="12month")?"name=\"\"":"href=\"javascript:getTrax(\'12month\')\"")+">Last 12 months</a></li>";
		HTML += "<li class=\""+((chartType=="overall")?"current ":"")+"chartoverall\"><a "+((chartType=="overall")?"name=\"\"":"href=\"javascript:getTrax(\'overall\')\"")+">Overall</a></li>";
		HTML += "<li class=\"current chartoverall\"><a name=NULLandVOID)\">&nbsp;</a></li>";
		HTML += "<li class=\""+((subChartType=="tracks")?"current ":"")+"chartoverall\"><a "+((subChartType=="tracks")?"name=\"\"":"href=\"javascript:toggleSubType()\"")+">Tracks</a></li>";
		HTML += "<li class=\""+((subChartType=="albums")?"current ":"")+"chartoverall\"><a "+((subChartType=="albums")?"name=\"\"":"href=\"javascript:toggleSubType()\"")+">Albums</a></li>";
		HTML += "</ul></span>";

//  Table
	HTML += "<table class=\"candyStriped chart\"><tbody>";
	var candyRowClass;
	if (tracks.length < 1) {
		HTML += "<tr class=\"first odd\"><td>I have no suitable "+subChartType+" for this artist / period</td></tr>";
		if (doRank == 1) {
			HTML += "<tr class=\"\" ><td align=center><i>"+artist+"</i> is ranked number "+aRank+" this period, with "+aPlay+" plays.</td></tr>";
		}
	}
	else {
		for (var k = 0; k < tracks.length && k < chartLimit; k++) {
			if ((k % 2) == 0) {
				candyRowClass = "odd ";
				if (k == 0) {candyRowClass = "first odd ";}
			} else {
				candyRowClass = "";
			}
		HTML += "<tr class=\""+candyRowClass+"\"><td class=\"positionCell\">"+tracks[k]["pos"]+"</td><td class=\"subjectCell\" title=\""+unescape2(tracks[k]["name"], 2)+ ", played "+ commatize(tracks[k]["count"]) +" times\"><div><span class=\"text\"><a title=\""+unescape2(tracks[k]["name"], 2)+ "\" href=\""+ tracks[k]["URL"] +"\">"+unescape2(tracks[k]["name"])+"</a></span></div></td><td class=\"chartbarCell\" ><div class=\"chartbar\" style=\"width: "+tracks[k]["width"]+"\%;\"><span>"+ commatize(tracks[k]["count"])  +"</span></div></td></tr>";
		}
		HTML += "<tr class=\"\"><td colspan=3 align=center>Total of "+tracks.length+" "+subChartType+" (";
		notShown = tracks.length - chartLimit;
		if (notShown > 0) { HTML += "" + notShown + " not"; } else { HTML += "all"; }
		HTML += " shown), played "+myTotalPlays+" times.</td></tr>";
		if (doRank == 1) {
			HTML += "<tr class=\"odd\"><td colspan=3 align=center><i>"+artist+"</i> is ranked number "+aRank+" this period, with "+aPlay+" plays.</td></tr>";
		}
	}
	HTML += "<tr class=\"\"><td colspan=3 align=center><span id=\"TopTraxActive\" style=\"display: none;\">Reloading - please wait</span></td></tr>";
	HTML += "</tbody></table><span class=\"moduleOptions\"><a href=\"/user/"+escape2(username)+"/charts/?rangetype="+chartType+"&subtype="+subChartType +"\" title=\"\">See more</a></span>";

	mychart.innerHTML = HTML;
}

function getTrax(chartType) {
	var myFlash = document.getElementById("TopTraxActive");
	defChartType = chartType;
	if (myFlash) {myFlash.setAttribute("style", "display: inline; color: red;");}
	if (artist.match(/\%27/)) { artist=artist.replace(/\%27/g,"'"); }
	var artRank = 0; var artPlay = 0;
	if (doRank == 1) {
		var xmlhttp=new XMLHttpRequest();
		var theURL = "http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&limit=1000&user="+username+"&api_key="+ APIkey + "&period=" + chartType;
		xmlhttp.open("GET", theURL, false);
		xmlhttp.send(null);
		var xmlText = xmlhttp.responseXML;
		if (!xmlText) {  alert("Can't load artist list");
			return;
		}
		var allArtists = xmlText.evaluate("//lfm/topartists/artist/name",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var allPlays = xmlText.evaluate("//lfm/topartists/artist/playcount",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0; i < allArtists.snapshotLength; i++) {
			var currName = new XMLSerializer().serializeToString(allArtists.snapshotItem(i).firstChild);
			if (currName == artist) {
				artPlay = new XMLSerializer().serializeToString(allPlays.snapshotItem(i).firstChild);
				artRank = (i+1)+" (of "+allArtists.snapshotLength+") ";
				break;
			}
		}
	}
	var xmlhttp=new XMLHttpRequest();
	var theURL = "http://ws.audioscrobbler.com/2.0/?method=user.gettop"+subChartType+"&limit=1500&user=" + escape2(username) + "&api_key=" + APIkey + "&period=" + chartType;
	xmlhttp.open("GET", theURL, true);
	xmlhttp.send(null);
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4) {
			var xmlText = xmlhttp.responseXML;
			if (!xmlText) {   alert("no data - toptracks");
				return;
			}
			doChart(xmlText, username, chartType, artRank, artPlay);
		}
	}
}

function initNewPanel(oldPanel) {
		var newPanel = document.createElement("div");
		newPanel.setAttribute("class", "myTopTrax");
		newPanel.setAttribute("id", "myTopTraxPan");
		newPanel.setAttribute("style", "width: 100%;");
		oldPanel.parentNode.insertBefore(newPanel,oldPanel.parentNode.firstChild);
		myPan = document.getElementById("hiLightPan");
		newPanel.innerHTML = "<H2 class='heading'><span class='h2Wrapper'>My Top Trax &amp;  Wax for "+artist+"</SPAN></H2>";
		newPanel.innerHTML += "<div class=\"module-body chart chartweek current\" id=\"divMyTopTrax\">";
		newPanel.innerHTML += "</div><hr />";
}

function getLastfmUsername() {
	var usernameLink = document.evaluate("//a[contains(@class,'user-badge')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if (usernameLink.snapshotLength > 0) {
		var userNameLoc = usernameLink.snapshotItem(0).innerHTML;
		userNameLoc = userNameLoc.replace(/<[^<>]*>/g,"").replace(/[ \n]+/g,"");
		return(userNameLoc);
	} else {
		return("");
	}
}

(function() {
	var artistName;
	username = getLastfmUsername();
	if (username == "") { return; }
	artistENC = location.href.match(/\/music\/([^\/\?]*)/)[1];
	if (!artistENC) { return; }
	if (artistENC.match(/\&/)) { artistENC = artistENC.replace(/\&/g,"%26"); }
	var theURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+artistENC+"&api_key="+APIkey;
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", theURL, false);
	xmlhttp.send(null);
	var xmlText = xmlhttp.responseXML;
	if (!xmlText) {   alert("no data - no artist");
		return;
	}
	artistName = xmlText.evaluate("//lfm/artist/name",xmlText, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	artist = "" + new XMLSerializer().serializeToString(artistName.snapshotItem(0).firstChild);

	var shtPanel = xpath('//div[contains(@class,"artist-listening-trend")]/h2').snapshotItem(0);
	if (!shtPanel){ return; }
	initNewPanel(shtPanel);
	mychart = document.getElementById("divMyTopTrax");
	if (!mychart) {
		 alert("Can't open chart element");
		return;
	}
	if (!navigator.userAgent.match(/Opera/)) {
		defChartType = GM_getValue("defChartType", defChartType);
		GM_registerMenuCommand("TopTrax: Select chart", promptForChart);
		GM_registerMenuCommand("TopTrax: Toggle album/track",toggleSubType);
	}
	if (!defChartType) { defChartType = "6month"; }
	getTrax(defChartType);
})();

//
// Insert commas to split number into blocks of 3 digits
// Assumes POSTIVE number
//
function commatize(number) {
	var numdp = number.split(".");
	if (numdp.length == 2) {
		var decimal = numdp[1];
	}
	var integer = numdp[0];
	if (integer.length < 4) {
		return(number);
	}
	var stubFrnt = integer.length % 3;
	if (stubFrnt == 0) {stubFrnt = 3;}
	var newnumber = integer.substr(0,stubFrnt);
	var oldPos = stubFrnt;
	while(oldPos < integer.length ) {
		newnumber = newnumber + "," + integer.substr(oldPos, 3);
		oldPos = oldPos + 3;
	}
	if (numdp.length == 2) {
		newnumber = newnumber + "." + decimal;
	}
	return(newnumber);
}

function promptForChart() {
	GM_setValue("chartType", prompt("What chart do you want to use? (overall, 7day, 12month, 6month, 3month)", getForChart()));
	if (!chartDescrip[GM_getValue("chartType")]){
		GM_setValue("chartType", "overall");
		defChartType = "overall";
	}
	defChartType=GM_getValue("chartType");
	getTrax(defChartType);
}
function getForChart() {
	return GM_getValue("chartType", "overall");
}