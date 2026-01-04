// ==UserScript==
// @name flickrFollowersChecker
// @namespace https://galleryminimal.com/
// @description UserScript to check Flickr Followers against list
// @version 1.02
// @author Marc Barrot.
// @license MIT
// @include http*://*flickr.com/*people/*/contacts/rev/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant GM_log
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/554965/flickrFollowersChecker.user.js
// @updateURL https://update.greasyfork.org/scripts/554965/flickrFollowersChecker.meta.js
// ==/UserScript==

/*

Installation
============
First you need a UserScript manager extension for your browser. The state of the art seems to be Tampermonkey these days.
Works with Firefox and Chrome. Even Edge I'm told. https://www.tampermonkey.net. For Safari, it now looks like the preferred manager
is Stay (extension + app) downloadable from the App Store. https://apps.apple.com/gb/app/stay-web-only-browsing/id1591620171.
This script may one day reside at Greasy Fork: https://greasyfork.org/
Click the green Install or Update button at the top left of the page. That's it.
You can now visit or reload one of the Flickr pages the script is modifying: followers.

Release Notes
============
v1.0 check each follower entry against list loaded from galleryminimal.
Adds missing entries to local list.

v1.01 2025-11-14: Added globals display box and user interface.

v1.02 2025-11-15: Added publishing of actual followers list of ids.

*/

// Globals

var glblContactsCount = 0;
var glblFollowersList = undefined;
var glblFollowersListStamp = undefined;
var glblMissingFollowers = [];
var glblActualFollowers = [];
var glblPageNumber = undefined;
var glblLastPage = undefined;
var glblLastCheckedVersion = undefined;
var glblVersion = '1.02';
var glblServerVersion = glblVersion;
var glblListUrl = 'https://galleryminimal.com/explore/data/followers-list.json';
var glblScriptVersionUrl = 'https://greasyfork.org/en/scripts/554965-flickrfollowerschecker.json';

const LastPagesXPath = '//span[@class="pages"]/a[last()]';
const CurrentPageXPath = '//span[@class="this-page"]';
const BuddyIconsXPath = '//img[@class="BuddyIconX"]';
const ContactListNamesXPath = '//td[@class="contact-list-name"]/*[1]';
const ContactListFullNamesXPath = '//span[contains(concat(" ", @class, " "), "fullname")]/*[1]';
const ContactListYouThemXPath = '//td[@class="contact-list-youthem"]/*[1]';

// State persistance

function Save() {
    GM_setValue('list', JSON.stringify(glblFollowersList));
    GM_setValue('stamp', glblFollowersListStamp);
}

function Load() {

    var now = new Date(),
		offset = now.getTimezoneOffset(),
		today = new Date(now.getTime() - (offset * 60 * 1000)),
		check = today.toISOString().split('T')[0],
		lastcheckedversion = '',

		onLoadFunction = function(details) {
			glblFollowersList = JSON.parse(details.responseText);
			glblFollowersListStamp = check;
			console.log('2/glblFollowersList: ' + glblFollowersList.length);
			console.log('2/glblFollowersListStamp: ' + glblFollowersListStamp);
			Save();
		};

	glblMissingFollowers = JSON.parse(GM_getValue('missing', '[]'));
	glblActualFollowers = JSON.parse(GM_getValue('actual', '[]'));
	glblFollowersList = JSON.parse(GM_getValue('list', '[]'));
	glblFollowersListStamp = GM_getValue('stamp', '');
	console.log('1/glblFollowersList: ' + glblFollowersList.length);
	console.log('1/glblFollowersListStamp: ' + glblFollowersListStamp);

	if (! glblFollowersList || glblFollowersListStamp != check) {
		CallMethod(glblListUrl, [], onLoadFunction);
	}

    glblServerVersion = GM_getValue('serverversion', glblServerVersion);
    lastcheckedversion = GM_getValue('lastcheckedversion');

    if (lastcheckedversion) {
		glblLastCheckedVersion = new Date();
		glblLastCheckedVersion.setTime(lastcheckedversion);
    }
}

function Clear() {
    var Ok = confirm('Do you really want to delete followers data ?');

    if (!Ok) {
    	return;
    }

    GM_setValue('list', '[]');
    GM_setValue('stamp', '');
    GM_setValue('lastcheckedversion', '');
    GM_setValue('serverversion', '');
	GM_setValue('missing', '[]');
	GM_setValue('actual', '[]');
    GM_setValue('running', '');
    GM_setValue('page', '');
}

function Show() {

    var newDiv = document.createElement('div'),

    	htmlTemplate = `
<div id="flickrfollowersconfig-main">
	<h3>Flickr Follower Checker</h3>**UPDATE**
	<p>
		<small>Version **VERSION** &copy; copyright 2025 Marc Barrot. Released under <a href="https://opensource.org/licenses/MIT" target="_blank">MIT License</a>.</small>
	</p>
	<table id="FollowerCheckerVars">
		<tr>
			<td class="col1">
				<a href="https://greasyfork.org/en/scripts/554965-flickrfollowerschecker" target="_blank">ServerVersion</a>:
			</td>
			<td class="col2">
				**SERVERVERSION**
			</td>
		</tr>
		<tr>
			<td class="col1">
				LastCheckedVersion:
			</td>
			<td class="col2">
				**LASTCHECKEDVERSION**
			</td>
		</tr>
		<tr>
			<td class="col1">
				ConfigList:
			</td>
			<td class="col2">
				**CONFIGLIST** followers
			</td>
		</tr>
		<tr>
			<td class="col1">
				ConfigListStamp:
			</td>
			<td class="col2">
				**CONFIGLISTSTAMP**
			</td>
		</tr>
		<tr>
			<td class="col1">
				PageNumber:
			</td>
			<td class="col2">
				**PAGENUMBER**
			</td>
		</tr>
		<tr>
			<td class="col1">
				Missing Count:
			</td>
			<td class="col2">
				**MISSING**
			</td>
		</tr>
		<tr>
			<td class="col1">
				Actual Count:
			</td>
			<td class="col2">
				**ACTUAL**
			</td>
		</tr>
	</table>
	<table id="FollowerCheckerData">
		<tr>
			<td class="col1">
				Missing Data:
			</td>
			<td class="col2">
				<textarea id="FollowerData" name="FollowerData">**MISSINGDATA**</textarea>
			</td>
		</tr>
	</table>
	<table id="FollowerCheckerActuals">
		<tr>
			<td class="col1">
				Actuals Data:
			</td>
			<td class="col2">
				<textarea id="FollowerActuals" name="FollowerActuals">**ACTUALSDATA**</textarea>
			</td>
		</tr>
	</table>
	<table id="FollowerCheckerActions">
		<tr>
			<td>
				<a href="#flickrfollowersconfig-clear" class="FollowerCheckerButton">Clear</a>
			</td>
			<td>
				<a href="#flickrfollowersconfig-save" class="FollowerCheckerButton">Save</a>
			</td>
			<td width="100%" align="right">
				<a href="#flickrfollowersconfig-cancel" class="FollowerCheckerButton">Cancel</a>
				<a href="#flickrfollowersconfig-run" class="FollowerCheckerButton">Run</a>
			</td>
		</tr>
	</table>
</div>
		`,

    	cssTemplate = `
#flickrfollowersconfig-main {
	position: fixed;
	top: **TOP**px;
	left: **LEFT**px;
	border: thin solid;
	width: 600px;
	padding: 20px;
	font-family: Arial;
	text-align: left;
	background-color: #eee;
	color: black;
	z-index: 10000;
}

#FollowerCheckerVars,
#FollowerCheckerData,
#FollowerCheckerActuals,
#FollowerCheckerActions {
	width: 580px;
	margin-top: 10px;
	border-top: 1px solid #ccc; ! important;
	padding-top: 10px;
}

#FollowerCheckerVars tr::before,
#FollowerCheckerData tr::before,
#FollowerCheckerActuals,
#FollowerCheckerActions tr::before {
	content: none; ! important;
}

#FollowerCheckerVars tr::after,
#FollowerCheckerData tr::after,
#FollowerCheckerActuals,
#FollowerCheckerActions tr::after {
	content: none; ! important;
}

#FollowerCheckerActions {
	border-top: 1px solid #ccc; ! important;
}

td.col1 {
	width: 120px;
}

#FollowerCheckerData td {
	vertical-align: top;
}

#FollowerData {
	width: 100%;
	height: 6em;
	border: none; ! important;
}

#FollowerActuals {
	width: 100%;
	height: 1.2em;
	border: none; ! important;
}
		`;

	cssTemplate = cssTemplate.replace('**TOP**', document.body.scrollTop + 60);
	cssTemplate = cssTemplate.replace('**LEFT**', document.body.scrollLeft + document.body.clientWidth - 650);
    AddGlobalStyle(cssTemplate);

	htmlTemplate = htmlTemplate.replace('**VERSION**', glblVersion);
	htmlTemplate = htmlTemplate.replace('**UPDATE**', (NewerVersion(glblServerVersion, glblVersion)) ? '<p><b>Please update to <a href="https://greasyfork.org/en/scripts/441654-flickrFollowerChecker">version ' + glblServerVersion + '</a></b>.</p>' : '');
	htmlTemplate = htmlTemplate.replace('**SERVERVERSION**', glblServerVersion);
	htmlTemplate = htmlTemplate.replace('**LASTCHECKEDVERSION**', glblLastCheckedVersion);
	htmlTemplate = htmlTemplate.replace('**CONFIGLIST**', glblFollowersList.length);
	htmlTemplate = htmlTemplate.replace('**CONFIGLISTSTAMP**', glblFollowersListStamp);
	htmlTemplate = htmlTemplate.replace('**PAGENUMBER**', glblPageNumber + ' / ' + glblLastPage + ' (' + GM_getValue('page', '') + ')');
	htmlTemplate = htmlTemplate.replace('**MISSING**', glblMissingFollowers.length);
	htmlTemplate = htmlTemplate.replace('**ACTUAL**', glblActualFollowers.length);
	htmlTemplate = htmlTemplate.replace('**MISSINGDATA**', JSON.stringify(glblMissingFollowers.toReversed(), null, 4));
	htmlTemplate = htmlTemplate.replace('**ACTUALSDATA**', JSON.stringify(glblActualFollowers.toReversed()));
    newDiv.setAttribute('id','flickrfollowersconfig-container');
    newDiv.innerHTML = htmlTemplate;
    document.body.insertBefore(newDiv, document.body.firstChild);
}

// Handle Events

function DeleteElement(elementname) {
    var varElement = document.getElementById(elementname);

    if (varElement) {
        varElement.parentNode.removeChild(varElement);
    }
}

function EventCancel() {
	GM_setValue('running', '');
    DeleteElement("flickrfollowersconfig-container");
}

function EventRun() {

	if (glblPageNumber < glblLastPage) {
		console.log('page: ' + glblPageNumber + ' / ' + glblLastPage);
		GM_setValue('missing', JSON.stringify(glblMissingFollowers));
		GM_setValue('actual', JSON.stringify(glblActualFollowers));
		GM_setValue('running', 'true');
		GM_setValue('page', glblPageNumber);
		window.location = 'https://www.flickr.com/people/marcbarrot/contacts/rev/?page=' + (glblPageNumber + 1);
	}

	else {
		console.log('Last page: ' + glblPageNumber + ' / ' + glblLastPage);
		GM_setValue('running', '');
	}
}

function EventClear() {
	Clear();
    EventCancel();
}

function EventSave() {

    var missing = JSON.parse(document.getElementById('FollowerData').value),
    	actual = JSON.parse(document.getElementById('FollowerActuals').value);

	GM_setValue('missing', JSON.stringify(missing));
	GM_setValue('actual', JSON.stringify(actual));
}

function EventShow() {
    Show();
}

// Configure Event Handler

function ConfigureEvents() {

    document.addEventListener('click', function(event) {
        // event.target is the element that was clicked
        var clickedOn = event.target.toString(),
        	target;

        if (clickedOn.indexOf('#flickrfollowersconfig-') > -1) { // flickrFollowerChecker links

            if (EndsWith(clickedOn, 'clear')) {
                EventClear();
            }

            if (EndsWith(clickedOn, 'save')) {
                EventSave();
            }

            if (EndsWith(clickedOn, 'cancel')) {
                EventCancel();
            }

            if (EndsWith(clickedOn, 'run')) {
                EventRun();
            }

            // we handled the event so stop propagation
            event.stopPropagation();
            event.preventDefault();
        }
    }, true);
}

// API calls

function CallMethod(url, params, onLoadFunction) { // http GET XHR wrapper
	var key;

    for(key in params) {
        url += "&" + key + "=" + params[key];
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: url,

        headers: {
            "User-Agent": "flickrFollowersChecker",
            "Accept": "application/json",
        },

        onload: onLoadFunction
    });
} // http GET XHR wrapper

// Utility functions

function elapsed(d) { //returns number of years/months/weeks/days/hours/min/secs from now

	var now = new Date(),
		from = new Date(parseInt(d, 10) * 1000), // d is the number of seconds since the epoch as a string
		years = now.getFullYear() - from.getFullYear(),
		months = now.getMonth() - from.getMonth(),
		secs = Math.floor((now - from) / 1000),
		mins = Math.floor(secs / 60),
		hours = Math.floor(mins / 60),
		days = Math.floor(hours / 24),
		weeks = Math.floor(days / 7);

	months = (months < 0) ? 12 + months : months;

	if (years && weeks > 52) {
		return years + 'y';
	}

	if (months && days >= 30) {
		return months + 'm';
	}

	if (weeks) {
		return weeks + 'w';
	}

	if (days) {
		return days + 'd';
	}

	if (hours) {
		return hours + 'h';
	}

	if (mins) {
		return mins + 'm';
	}

	if (secs) {
		return secs + 's';
	}

	return 'error';
} //returns number of years/months/weeks/days/hours/min/secs from now

function AddGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function DateDiffDays(date1, date2) {
    var one_day = 1000 * 60 * 60 * 24;
    return Math.ceil((date1.getTime() - date2.getTime()) / one_day);
}

function EndsWith(str, substr){
    return (str.lastIndexOf(substr) == str.length - substr.length);
}

// check Greasy Fork for updates

function SaveUpdateInfo() {
    GM_setValue('serverversion', glblServerVersion);

    if (glblLastCheckedVersion) {
    	GM_setValue('lastcheckedversion',glblLastCheckedVersion.getTime().toString());
    }
}

function CheckForUpdates() {

    var onLoadFunction = function(details) {
        var meta = JSON.parse(details.responseText);
        glblServerVersion = meta.version;
        glblLastCheckedVersion = new Date();
        console.log('2/glblServerVersion: ' + glblServerVersion);
        console.log('2/glblLastCheckedVersion: ' + glblLastCheckedVersion);
        SaveUpdateInfo();
    }

    console.log('1/glblServerVersion: ' + glblServerVersion);
    console.log('1/glblLastCheckedVersion: ' + glblLastCheckedVersion);

    var currentDate = new Date();

    if ((glblLastCheckedVersion == undefined) || (DateDiffDays(currentDate, glblLastCheckedVersion) >= 2)) {
        CallMethod(glblScriptVersionUrl, [], onLoadFunction);
    }
}

function NewerVersion(serverVersion, currentVersion) {
    serverVersion = serverVersion.split(".");
    currentVersion = currentVersion.split(".");

    var i;

    for (i = 0; i < serverVersion.length; i++) {
        if (parseInt(serverVersion[i]) > parseInt(currentVersion[i])) return true;
    }

    return false;
}

// DOM access functions

function GetElements(root, xPath) {

    var allElements = document.evaluate(
        xPath,
        root,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    return allElements;
}

function FindFirstElement(root, xPath) {

    var allElements = GetElements(root, xPath),
    	thisElement = null;

    if (allElements.snapshotLength > 0) {
        thisElement = allElements.snapshotItem(0);
    }

    return thisElement;
}

// Contacts page functions

function GetCurrentPageNumber() {

	var pageElement = FindFirstElement(document, CurrentPageXPath),
		pagenb = (pageElement) ? pageElement.innerHTML : '';

	return pagenb;
}

function GetLastPageNumber() {

	var pageElement = FindFirstElement(document, LastPagesXPath),
		last = (pageElement) ? pageElement.innerHTML : '';

	return last;
}

function GetAllContactsFromPage() {

	var iconNodes = GetElements(document, BuddyIconsXPath),
		fullnameNodes = GetElements(document, ContactListFullNamesXPath),
		nameNodes = GetElements(document, ContactListNamesXPath),
		youthemNodes = GetElements(document, ContactListYouThemXPath),
		ids = [],
		id = '',
		names = [],
		name = '',
		fullnames = [],
		fullname = '',
		i = 0;

	if (iconNodes.snapshotLength > 0) {

		for (i = 0; i < iconNodes.snapshotLength; i++) {
			id = iconNodes.snapshotItem(i).getAttribute('src');
			id = id.replace(/.*buddyicons\//, '');
			id = id.replace(/.*#/, '');
			id = id.replace(/\?.*/, '');

			if (! id.includes('@N')) {
				id = iconNodes.snapshotItem(i).parentElement.getAttribute('href');
				id = id.replace(/\/$/, '');
				id = id.replace(/.*\//, '');
			}

			if (! id.includes('@N')) {
				id = youthemNodes.snapshotItem(i).getAttribute('id');
				id = id.replace(/.*status_/, '');
			}

			if (! id.includes('@N')) {
				id = '';
			}

			ids.push(id);
		}

	}

	if (nameNodes.snapshotLength > 0) {

		for (i = 0; i < nameNodes.snapshotLength; i++) {
			name = nameNodes.snapshotItem(i).innerHTML;
			names.push(name);
		}

	}

	if (fullnameNodes.snapshotLength > 0) {

		for (i = 0; i < fullnameNodes.snapshotLength; i++) {
			fullname = fullnameNodes.snapshotItem(i).innerHTML;
			fullname = fullname.replace('No real name given', '');
			fullnames.push(fullname);
		}

	}

	return {'ids': ids, 'names': names, 'fullnames': fullnames };
}

// Processing contacts

function CheckContacts(contacts) {
	var missing = [];

	for (var i = 0; i < contacts.ids.length; i++) {

		if (! glblFollowersList.find((el) => el === contacts.ids[i])) {

			missing.push( {
				'nsid': contacts.ids[i],
				'username': contacts.names[i],
      			'realname': contacts.fullnames[i],
      			'stamp': new Date().getTime()
      		});
		}
	}

	return missing;
}

function ProcessContactsPage() {

	var contacts = GetAllContactsFromPage(),
		missing = CheckContacts(contacts);

	glblPageNumber = parseInt(GetCurrentPageNumber(), 10);
	glblLastPage = parseInt(GetLastPageNumber(), 10);
	glblLastPage = (glblLastPage >= glblPageNumber) ? glblLastPage : glblPageNumber;
	glblMissingFollowers.push(...missing);
	glblActualFollowers.push(...contacts.ids);
	glblContactsCount = contacts.ids.length;
}

// Main script

function Main() {

	var nextPage = function() {
		window.location = 'https://www.flickr.com/people/marcbarrot/contacts/rev/?page=' + (glblPageNumber + 1);
	};

    GM_registerMenuCommand("Show flickrFollowersChecker", EventShow);
    GM_registerMenuCommand("Hide flickrFollowersChecker", EventCancel);
    GM_registerMenuCommand("Clear flickrFollowersChecker", EventClear);
    AddGlobalStyle('.FollowerCheckerButton:link, .FollowerCheckerButton:visited { padding: 2px 4px 2px 4px; margin: 0px; text-decoration: none; text-align: center; border: 1px solid; border-color: #aaa #000 #000 #aaa; background: #BBBBBB !important; }');
    AddGlobalStyle('.FollowerCheckerButtonSmall:link, .FollowerCheckerButtonSmall:visited { padding: 2px 4px 2px 4px; margin: 0px; text-decoration: none; width: 10px; text-align: center; border: 1px solid; border-color: #aaa #000 #000 #aaa; background: #BBBBBB !important; }');
    AddGlobalStyle('.FollowerCheckerButton:hover, .FollowerCheckerButtonSmall:hover { border-color: #000 #aaa #aaa #000 !important; }');

    if (glblFollowersList == undefined) {
        Load();
    }

	CheckForUpdates();
    ConfigureEvents();
	ProcessContactsPage();
	Show();

	if (GM_getValue('running', '') && glblPageNumber < glblLastPage) {
		GM_setValue('missing', JSON.stringify(glblMissingFollowers));
		GM_setValue('actual', JSON.stringify(glblActualFollowers));
		GM_setValue('page', glblPageNumber);
		setTimeout(nextPage, 5000);
	}

	else {
		GM_setValue('running', '');
	}
}

Main();