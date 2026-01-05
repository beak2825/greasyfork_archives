// ==UserScript==
// @name        HF Trustscan
// @namespace   HF Trustscan
// @description Add a Trustscan & a Deal Disputes button to the posts of the members from HF. - Hash G.
// @include     *hackforums.net*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     1.2
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/9736/HF%20Trustscan.user.js
// @updateURL https://update.greasyfork.org/scripts/9736/HF%20Trustscan.meta.js
// ==/UserScript==

if (document.URL.indexOf("showthread.php") >= 0) {
  var uid = document.querySelectorAll('a[title="Find all posts by this user"]');
  for (i=0; i<uid.length; i++) {
	currUID = uid[i];
	currUID = currUID.toString().split('&')[1];
	var trustscan = document.createElement('a');
	trustscan.rel = "nofollow"; trustscan.target = "_blank"; trustscan.className = "bitButton"; trustscan.title = "Trust Scan of this user"; trustscan.innerHTML = "Trust Scan"; trustscan.href = "http://www.hackforums.net/trustscan.php?"+currUID;
	var fcknSpace = document.createElement('span');
	fcknSpace.innerHTML = " ";
	var ddb = document.createElement('a');
	ddb.rel = "nofollow"; ddb.target = "_blank"; ddb.className = "bitButton"; ddb.title = "Deal Disputes of this user"; ddb.innerHTML = "Deal Disputes"; ddb.href = "http://www.hackforums.net/disputedb.php?useruid="+currUID.substr(4)+"&ref=hguscript";
	document.querySelectorAll('.author_buttons.float_left')[i].appendChild(trustscan);
	document.querySelectorAll('.author_buttons.float_left')[i].appendChild(fcknSpace);
	document.querySelectorAll('.author_buttons.float_left')[i].appendChild(ddb);
  }
}

if (document.URL.indexOf("ref=hguscript") >= 0) {
	$('input.button:nth-child(2)').click();
}