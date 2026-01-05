// ==UserScript==
// @name           BookCrossing-Remove_Frippery
// @version        1.7
// @license        CC0 1.0 (Public Domain) http://creativecommons.org/publicdomain/zero/1.0/deed.de
// @namespace      http://zartbitter.heimat.eu/BC
// @description    Simplify the appearance of some BookCrossing pages
// @include        http://*.bookcrossing.com/forum/*
// @include        http://bookcrossing.com/forum/*
// @include        http://*.bookcrossing.com/journal/*
// @include        http://bookcrossing.com/journal/*
// @grant          GM_registerMenuCommand
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/9066/BookCrossing-Remove_Frippery.user.js
// @updateURL https://update.greasyfork.org/scripts/9066/BookCrossing-Remove_Frippery.meta.js
// ==/UserScript==

GM_registerMenuCommand("BC: Enable/Disable All Profile Pics", changeStatusRemPics);
GM_registerMenuCommand("BC: Enable/Disable Custom Wings", changeStatusRemWings);
GM_registerMenuCommand("BC: Enable/Disable Sidebar", changeStatusSidebar);
GM_registerMenuCommand("BC: Mark Own Posts", changeStatusMarkOwnPosts);
GM_registerMenuCommand("BC: Remove Gradient", changeStatusRemoveGradient);
GM_registerMenuCommand("BC: Reset (set original values)", resetStatus);

var screenname;

hideSidebar();
removeProfilePics();
changeWings();

readScreenName(); // run this before markOwn...()

markOwnThreads();
markOwnForumEntries();
removeGradient();

// Reset status
function resetStatus() {
	GM_setValue('markOwn', '0');
	GM_setValue('remPics', '0');
	GM_setValue('remWings', '0');
	GM_setValue('remSidebar', '0');
	GM_setValue('remGrad', '0');
	window.location.href = window.location.href;
}

// Set status: remove gradient
function changeStatusRemoveGradient() {
	var stat = GM_getValue('remGrad', '0');
	if (stat == '1') {
		GM_setValue('remGrad', '0');
	} else {
		GM_setValue('remGrad', '1');
	}
	window.location.href = window.location.href;
}

// Set status: mark own posts
function changeStatusMarkOwnPosts() {
	var stat = GM_getValue('markOwn', '1');
	if (stat == '1') {
		GM_setValue('markOwn', '0');
	} else {
		GM_setValue('markOwn', '1');
	}
	window.location.href = window.location.href;
}

// Set status: remove pics
function changeStatusRemPics() {
	var stat = GM_getValue('remPics', '1');
	if (stat == '1') {
		GM_setValue('remPics', '0');
	} else {
		GM_setValue('remPics', '1');
	}
	window.location.href = window.location.href;
}

// Set status: remove wings
function changeStatusRemWings() {
	var stat = GM_getValue('remWings', '1');
	if (stat == '1') {
		GM_setValue('remWings', '0');
	} else {
		GM_setValue('remWings', '1');
	}
	window.location.href = window.location.href;
}

// Set status: remove sidebar
function changeStatusSidebar() {
	var stat = GM_getValue('remSidebar', '0');
	if (stat == '1') {
		GM_setValue('remSidebar', '0');
	} else {
		GM_setValue('remSidebar', '1');
	}
	window.location.href = window.location.href;
}

// change wing images
function changeWings() {
	if (GM_getValue('remWings', '0') == '0') {
		return;
	}
	var imgs = document.getElementsByTagName("img"); 
	var str1 = '/images/wings/';
	var str2 = '/l.gif';
	var str3 = '/l_trans.gif';
	var str4 = '/r.gif';
	var str5 = '/r_trans.gif';
	for (var n=0; n<imgs.length; n++) {
		var entry = imgs[n];
		if (entry.src.indexOf(str1) >= 0) {
			if (entry.src.substr(-6) == str2) {
				entry.src = 'http://www.bookcrossing.com/images/wings/_Standard/l.gif';
			} else if (entry.src.substr(-12) == str3) {
				entry.src = 'http://www.bookcrossing.com/images/wings/_Standard/l_trans.gif';
			} else if (entry.src.substr(-6) == str4) {
				entry.src = 'http://www.bookcrossing.com/images/wings/_Standard/r.gif';
			} else if (entry.src.substr(-12) == str5) {
				entry.src = 'http://www.bookcrossing.com/images/wings/_Standard/r_trans.gif';
			}
		}
	}
}

// remove profile pics
function removeProfilePics() {
	if (GM_getValue('remPics', '1') == '0') {
		return;
	}
	var imgs = document.getElementsByTagName("img"); 
	var str1 = '/images/memberpics/';
	var str2 = '/images/profile-image-';
	for (var i=0; i<imgs.length; i++) {
		var entry = imgs[i];
		var src = entry.src;
		if (src.indexOf(str1) >= 0 || src.indexOf(str2) >= 0) {
			entry.src = 'http://www.bookcrossing.com/images/clearpixel.gif';
			continue;
		}
	}
}

// hide sidebar
function hideSidebar() {
	if (GM_getValue('remSidebar', '0') == '0') {
		return;
	}
	var node = document.getElementById('sidebar');
	if (node != null) {
		node.style.display = 'none';

		node = document.getElementById('dProfileMain');
		if (node != null) {
			node.style.width = '100%';
		}
		node = document.getElementById('dProfileHeader');
		if (node != null) {
			node.style.width = '100%';
		}
		node = document.getElementById('pBookSortBarL');
		if (node != null) {
			node.style.width = '100%';
		}
		node = document.getElementById('dBookShelfHolder');
		if (node != null) {
			node.style.width = '100%';
		}
		node = document.getElementById('dList');
		if (node != null) {
			node.style.width = '100%';
		}
		node = document.getElementById('tForums');
		if (node != null) {
			node.style.width = '100%';
		}
	}
}

// read screenname
function readScreenName() {
	var tmp = document.getElementById('salutation');
	if (tmp) {
		var ancs = tmp.getElementsByTagName("a");
		for (var j=0; j<ancs.length; j++) {
			var anc = ancs[j];
			var idx = anc.href.indexOf("/mybookshelf/");
			if (idx >= 0) {
				screenname = anc.href.substr(idx+13);
				idx = screenname.indexOf("/");
				if (idx >= 0) {
					screenname = screenname.substring(0,idx);
				}
				break;
			}
		}
	}
}

// mark own forum threads
function markOwnThreads() {
	if (screenname == undefined) {
		return;
	}
	if (GM_getValue('markOwn', '0') == '0') {
		return;
	}
	var trHeaders = document.getElementsByClassName('trForum');
	for (var k=0; k<trHeaders.length; k++) {
		var trHeader = trHeaders[k];
		var idx = trHeader.innerHTML.indexOf('<a href="/mybookshelf/'+screenname+'/">');
		if (idx >= 0) {
			var tds = trHeader.getElementsByTagName('td');
			for (l=0; l<tds.length; l++) {
				var td = tds[l];
				td.style.backgroundColor = '#FFDA77';
				td.style.fontWeight = 'bold';
			}
		}
	}
}

// changes textcolor to black for all contained divs
function blackDivText(container) {
	var divs = container.getElementsByTagName('div');
	var div = divs[0];
	div.style.color = '#000000';
}

// remove gradient of given singlePane element
function privateRemoveGradient(singlePane) {
	singlePane.style.backgroundColor = '#fcfcfc';
	singlePane.style.backgroundImage = 'url(http://www.bookcrossing.com/images/clearpixel.gif)';
	blackDivText(singlePane);
}

// remove gradient
function removeGradient() {
	if (GM_getValue('markOwn', '0') == '1' && screenname != undefined) {
		// will be handled by markOwnForumEntries()
		return;
	}
	if (GM_getValue('remGrad', '0') == '0') {
		return;
	}

	var entries = document.getElementsByClassName('singlePane');
	for (m=0; m<entries.length; m++) {
		var entry = entries[m];
		privateRemoveGradient(entry);
	}
}

// mark own forum entries
function markOwnForumEntries() {
	if (screenname == undefined) {
		return;
	}
	if (GM_getValue('markOwn', '0') == '0') {
		return;
	}
	var entries = document.getElementsByClassName('singlePane');
	for (m=0; m<entries.length; m++) {
		var entry = entries[m];
		var ix = entry.innerHTML.indexOf('<a href="/mybookshelf/'+screenname+'/">');
		if (ix >= 0) {
			entry.style.backgroundColor = '#FFDA77';
			entry.style.backgroundImage = 'url(http://www.bookcrossing.com/images/clearpixel.gif)';
			blackDivText(entry);
		} else {
			if (GM_getValue('remGrad', '0') == '1') {
				privateRemoveGradient(entry);
			}
		}
	}
}

