// ==UserScript==
// @name		GameCATs Highlighting
// @version		2.1.0
// @author		Metallia
// @namespace	Cats
// @description	Highlights stuff, I dunno.
// @include		https://www.gamefaqs.com/*
// @include		https://gamefaqs.gamespot.com/*
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_deleteValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/973/GameCATs%20Highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/973/GameCATs%20Highlighting.meta.js
// ==/UserScript==

// css guys, look for ".gamecats-highlight" for anything I've added a background colour to, or ".gamecats-text" for text colour changes, or just the "friend" class GameFAQs itself uses for their own highlighting.
// Also, to be more specific:
// .gamecats-highlight-message-tr
// .gamecats-highlight-message-td
// .gamecats-highlight-topic-tr
// .gamecats-highlight-topic-td
// .gamecats-text-tr
// .gamecats-text-td
// .gamecats-text-a
// .gamecats-autocontrast-black
// .gamecats-autocontrast-white

// First run check, fill in some settings. Also fill in one list if they try to save with none. >_>
if (!GM_getValue("numberOfLists") || GM_getValue("numberOfLists") == 0) {
	GM_setValue("numberOfLists",1);
	GM_setValue("useColouredCustomCSS",false);
	GM_setValue("caseInsensitive",true);
	GM_setValue("styleGroupAsTag",false);
	GM_setValue("settingsLinkLocation",2);
	GM_setValue("allowRightclickHijacks",true);
	GM_setValue("Main Settings","Script Author|Metallia|#B266FF|auto|true,false,true,false,false,true,false,false,false,false,false,false,false,false,false");
	GM_setValue("version","2.1.0");
}

// Attach a link to the settings page on GameFAQs.
var userSubnav = document.getElementsByClassName("top_user_subnav");
if (userSubnav[0] != null) {
	if (GM_getValue("settingsLinkLocation","unset") === 0 || GM_getValue("settingsLinkLocation","unset") === 2) {

		var settingsListItem = document.createElement('li');
		var settingsLink = document.createElement('a');
		settingsLink.setAttribute("href","#HighlightSettings");
		settingsLink.addEventListener('click',function() {prepSettings();},true);
		settingsLink.textContent = "GameCATs";

		userSubnav[0].childNodes[1].insertBefore(settingsListItem,userSubnav[0].childNodes[1].childNodes[0]);
		settingsListItem.appendChild(settingsLink);
	}
}
if ((document.location.href.match(/(^[^#]*)/)[0] === "https://www.gamefaqs.com/user") || (document.location.href.match(/(^[^#]*)/)[0] === "https://gamefaqs.gamespot.com/user")) {
	if (GM_getValue("settingsLinkLocation","unset") === 1 || GM_getValue("settingsLinkLocation","unset") === 2) {
		var myAccountTable = document.getElementsByTagName("tbody")[2];
		var settingsTR = document.createElement('tr');
		var settingsTD = document.createElement('td');
		settingsTD.setAttribute("colspan","2");
		var settingsLink = document.createElement('a');
		settingsLink.setAttribute("href","#HighlightSettings");
		settingsLink.addEventListener('click',function() {prepSettings();},true);
		settingsLink.textContent = "GameCATs";
		myAccountTable.appendChild(settingsTR);
		settingsTR.appendChild(settingsTD);
		settingsTD.appendChild(settingsLink);
	}
}

var version = GM_getValue("version").split(".");
var theme = document.getElementsByTagName("body")[0].getAttribute("class");

// Settings to get filled in by getSettings()
var storedNumberOfLists = new Array();
var storedListNames = new Array();
var storedUsernames = new Array();
var storedHighlightColours = new Array();
var storedHighlightTextColours = new Array();
var storedActionHighlightTopic = new Array();
var storedActionIgnoreTopic = new Array();
var storedActionHighlightPost = new Array();
var storedActionIgnorePost = new Array();
var storedActionTagTopic = new Array();
var storedActionTagPost = new Array();
var storedActionHighlightTopicContent = new Array();
var storedActionIgnoreTopicContent = new Array();
var storedActionHighlightPostContent = new Array();
var storedActionIgnorePostContent = new Array();
var storedActionAllowStacking = new Array();
var storedActionHighlightAdmin = new Array();
var storedActionHighlightMod = new Array();
var storedActionHighlightVIP = new Array();
var storedActionHighlightTC = new Array();
var storedCaseInsensitive = new Array();
var storedUseColouredCustomCSSSetting = new Array();
var storedStyleGroupAsTagSetting = new Array();
var storedAllowRightclickHijacksSetting = new Array();

// Highlight functions

function compareVersion (testVersion,exact) {
	testVersion = testVersion.split(".");
	if (exact) {
		return ((testVersion[0] == version[0]) && (testVersion[1] == version[1]) && (testVersion[2] == version[2]));
	} else {
		if (version[0] < testVersion[0]) {
			return true;
		} else if (version[0] == testVersion[0]) {
			if (version[1] < testVersion[1]) {
				return true;
			} else if (version[1] == testVersion[1]) {
				if (version[2] < testVersion[2]) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}

function getSettings () {
	storedNumberOfLists = GM_getValue("numberOfLists");
	var allOfTheThings = GM_getValue("Main Settings");
	var fullList = allOfTheThings.split("^");
	var splitListItems = new Array();
	var usernames = new Array();
	var splitActions = new Array();


	for (var i = 0; i < storedNumberOfLists; i++) {
		splitListItems = fullList[i].split("|");
		splitActions[i] = splitListItems[4].split(",");

		storedListNames[i] = splitListItems[0];
		storedUsernames[i] = splitListItems[1].split(",");
		storedHighlightColours[i] = splitListItems[2];
		storedHighlightTextColours[i] = splitListItems[3];
		// These look kinda funky, but I'm trading in the stored "true" and "false" strings for actual booleans.
		storedActionHighlightTopic[i] = (splitActions[i][0] == "true");
		storedActionIgnoreTopic[i] = (splitActions[i][1] == "true");
		storedActionHighlightPost[i] = (splitActions[i][2] == "true");
		storedActionIgnorePost[i] = (splitActions[i][3] == "true");
		storedActionTagTopic[i] = (splitActions[i][4] == "true");
		storedActionTagPost[i] = (splitActions[i][5] == "true");
		storedActionHighlightTopicContent[i] = (splitActions[i][6] == "true");
		storedActionIgnoreTopicContent[i] = (splitActions[i][7] == "true");
		storedActionHighlightPostContent[i] = (splitActions[i][8] == "true");
		storedActionIgnorePostContent[i] = (splitActions[i][9] == "true");
		storedActionAllowStacking[i] = (splitActions[i][10] == "true");
		storedActionHighlightAdmin[i] = (splitActions[i][11] == "true");
		storedActionHighlightMod[i] = (splitActions[i][12] == "true");
		storedActionHighlightVIP[i] = (splitActions[i][13] == "true");
		storedActionHighlightTC[i] = (splitActions[i][14] == "true");
	}

	storedCaseInsensitive = GM_getValue("caseInsensitive");
	storedUseColouredCustomCSSSetting = GM_getValue("useColouredCustomCSS");
	storedStyleGroupAsTagSetting = GM_getValue("styleGroupAsTag");
	storedAllowRightclickHijacksSetting = GM_getValue("allowRightclickHijacks");
}

if (compareVersion("0.8.0")) {
	GM_deleteValue("useChromeSettings");
}
if (compareVersion("0.9.0")) {
	GM_deleteValue("respectTags");
}
if (compareVersion("1.2.3")) {
	GM_setValue("settingsLinkLocation",2);
}
if (compareVersion("2.0.22")) {
	GM_setValue("allowRightclickHijacks",true);
}

getSettings();

GM_setValue("version","2.1.0");

// The settings page save button and right click menu prime the data for storage first, then recall this function with a new origin to actually store it.
function saveSettings (origin,username,listIndex,addOrRemove) {
	var smashedUsernames;
	var smashedActions;
	var smashedFullList = new Array();
	var smashedAllOfTheThings = new Array();

	if (origin == "import") {
		var importField = document.getElementById("exportImportField");
		var importString = importField.value;

		if (importString.split("|").length <= 3) {
			if (!confirm("This data seems malformed and may break your settings.\nImport data anyway?")) {
				throw "Abort settings import.";
			}
		}

		GM_setValue("Main Settings",importString);
		GM_setValue("numberOfLists",importString.split("^").length);
	}

	if (origin == "internal") {
		for (var i = 0; i < storedNumberOfLists; i++) {
			smashedUsernames = storedUsernames[i].join(",");
			smashedActions = storedActionHighlightTopic[i]+","+storedActionIgnoreTopic[i]+","+storedActionHighlightPost[i]+","+storedActionIgnorePost[i]+","+storedActionTagTopic[i]+","+storedActionTagPost[i]+","+storedActionHighlightTopicContent[i]+","+storedActionIgnoreTopicContent[i]+","+storedActionHighlightPostContent[i]+","+storedActionIgnorePostContent[i]+","+storedActionAllowStacking[i]+","+storedActionHighlightAdmin[i]+","+storedActionHighlightMod[i]+","+storedActionHighlightVIP[i]+","+storedActionHighlightTC[i];
			smashedFullList[i] = storedListNames[i]+"|"+smashedUsernames+"|"+storedHighlightColours[i]+"|"+storedHighlightTextColours[i]+"|"+smashedActions;
		}
		smashedAllOfTheThings = smashedFullList.join("^");
		GM_setValue("Main Settings",smashedAllOfTheThings);

		var importField = document.getElementById("exportImportField");
		if (importField){
			importField.setAttribute('value',smashedAllOfTheThings);
		}
	}

	if (origin == "rightclickmenu") {
		if (addOrRemove == "add") {
			storedUsernames[listIndex][storedUsernames[listIndex].length] = username;

		}
		if (addOrRemove == "remove") {
			storedUsernames[listIndex].splice(storedUsernames[listIndex].indexOf(username),1);
		}
		saveSettings("internal");
	}

	if (origin == "settingspage") {
		var lists = document.evaluate('//div', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var actionLists = document.evaluate('//input[@type="checkbox"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		var realLists = 0;
		for (var i = 0; i < lists.snapshotLength; i++) {
			if (lists.snapshotItem(i).getAttribute("class") !== "container") {
				continue; // Fuck you, Chrome >_>
			}
			storedListNames[realLists] = lists.snapshotItem(i).getElementsByClassName("listnameFields")[0].value;
			storedHighlightColours[realLists] = lists.snapshotItem(i).getElementsByClassName("colourFields")[0].value;
			storedHighlightTextColours[realLists] = lists.snapshotItem(i).getElementsByClassName("textColourFields")[0].value;
			storedUsernames[realLists] = lists.snapshotItem(i).getElementsByClassName("usernameFields")[0].value.replace(/, /g,",").split(",");
			storedActionHighlightTopic[realLists] = actionLists.snapshotItem(realLists*15).checked;
			storedActionIgnoreTopic[realLists] = actionLists.snapshotItem(realLists*15+1).checked;
			storedActionHighlightPost[realLists] = actionLists.snapshotItem(realLists*15+2).checked;
			storedActionIgnorePost[realLists] = actionLists.snapshotItem(realLists*15+3).checked;
			storedActionTagTopic[realLists] = actionLists.snapshotItem(realLists*15+4).checked;
			storedActionTagPost[realLists] = actionLists.snapshotItem(realLists*15+5).checked;
			storedActionHighlightTopicContent[realLists] = actionLists.snapshotItem(realLists*15+6).checked;
			storedActionIgnoreTopicContent[realLists] = actionLists.snapshotItem(realLists*15+7).checked;
			storedActionHighlightPostContent[realLists] = actionLists.snapshotItem(realLists*15+8).checked;
			storedActionIgnorePostContent[realLists] = actionLists.snapshotItem(realLists*15+9).checked;
			storedActionAllowStacking[realLists] = actionLists.snapshotItem(realLists*15+10).checked;
			storedActionHighlightAdmin[realLists] = actionLists.snapshotItem(realLists*15+11).checked;
			storedActionHighlightMod[realLists] = actionLists.snapshotItem(realLists*15+12).checked;
			storedActionHighlightVIP[realLists] = actionLists.snapshotItem(realLists*15+13).checked;
			storedActionHighlightTC[realLists] = actionLists.snapshotItem(realLists*15+14).checked;

			realLists++;
		}

		GM_setValue("numberOfLists",realLists);

		// Straggler settings not part of a loop
		GM_setValue("caseInsensitive",document.getElementById("caseInsensitiveToggle").checked);
		GM_setValue("useColouredCustomCSS",document.getElementById("customCSSToggle").checked);
		GM_setValue("settingsLinkLocation",parseInt(document.getElementById("settingsLinkLocation").value));
		GM_setValue("styleGroupAsTag",document.getElementById("styleGroupAsTagToggle").checked);
		GM_setValue("allowRightclickHijacks",document.getElementById("allowRightclickHijacksToggle").checked);

		saveSettings("internal");
	}
}

function makeInsensitive (voodoo) {
	if (storedCaseInsensitive) {
		return voodoo.toLowerCase();
	} else {
		return voodoo;
	}
}

// Always returns in rgba, prefilling an alpha of '1' if none was present.
// Accepts #RRGGBB, rgba(r,g,b,a), or rgb(r,g,b).
function decimalColour (colour, returnAs) {
	// The usual #RRGGBB you expect to deal with from user input.
	if (colour.substring(0,1) == "#") {
		if (returnAs === "style") {
			return ("rgba("+parseInt(colour.substring(1,3),16)+","+parseInt(colour.substring(3,5),16)+","+parseInt(colour.substring(5,7),16)+",1)");
		} else if (returnAs === "testvalue") {
			return true;
		} else {
			return [parseInt(colour.substring(1,3),16),parseInt(colour.substring(3,5),16),parseInt(colour.substring(5,7),16),1];
		}
	} else {
		// And now for when rgba(r,g,b,a) and rgb(r,g,b) decide to show up, like when pulling the colour directly out of the DOM. >_>
		if (colour.substring(0,4) == "rgba") {
			var numbersOnly = colour.substring(5,colour.length-1).replace(/, /g,",").split(",");
			if (returnAs === "style") {
				return ("rgba("+numbersOnly[0]+","+numbersOnly[1]+","+numbersOnly[2]+","+numbersOnly[3]+")");
			} else if (returnAs === "testvalue") {
				return true;
			} else {
				return numbersOnly;
			}
		} else if (colour.substring(0,4) == "rgb(") {
			var numbersOnly = colour.substring(4,colour.length-1).replace(/, /g,",").split(",");
			if (returnAs === "style") {
				return ("rgba("+numbersOnly[0]+","+numbersOnly[1]+","+numbersOnly[2]+",1)");
			} else if (returnAs === "testvalue") {
				return true;
			} else {
				numbersOnly[3] = 1;
				return numbersOnly;
			}
		} else if (returnAs === "testvalue") {
			return false;
		}
	}
}

function autoContrast (pageType,colour,usernameNode) {
	var backgroundColour = decimalColour(colour);

	if (!decimalColour(colour,"testvalue")) {
		return false;
	}

	//todo: Check new site colours, update switch values. These are probably wrong.
	switch (theme) {
		case "red": var themeColour = decimalColour("#7E2525"); break;
		case "green": var themeColour = decimalColour("#669E2E"); break;
		case "orange": var themeColour = decimalColour("#834121"); break;
		case "purple": var themeColour = decimalColour("#330066"); break;
		case "cloudy": var themeColour = decimalColour("#192457"); break;
		case "sepia": var themeColour = decimalColour("#6C4013"); break;
		case "dark-blue": var themeColour = decimalColour("#A1AFF7"); break;
		case "dark-red": var themeColour = decimalColour("#F9B8B8"); break;
		case "dark-green": var themeColour = decimalColour("#CCF7A1"); break;
		case "dark-orange": var themeColour = decimalColour("#FFCCB3"); break;
		case "dark-purple": var themeColour = decimalColour("#E5CCFF"); break;
		case "grayscale": var themeColour = decimalColour("#404040"); break;
		case "cottoncandy": var themeColour = decimalColour("#FF0000"); break;
		default: var themeColour = decimalColour("#3449B2");
	}

	if (storedUseColouredCustomCSSSetting) {
		themeColour = decimalColour(window.getComputedStyle(usernameNode).getPropertyValue("color"));
	}

	// http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html
	// http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	var lumiCustom = (0.2126*backgroundColour[0] + 0.7152*backgroundColour[1] + 0.0722*backgroundColour[2])/256;
	var lumiDefault =(0.2126*themeColour[0] + 0.7152*themeColour[1] + 0.0722*themeColour[2])/256;

	if (lumiCustom >= lumiDefault) {
		var contrastRatio = (lumiCustom + 0.05) / (lumiDefault + 0.05);
	} else {
		var contrastRatio = (lumiDefault + 0.05) / (lumiCustom + 0.05);
	}

	// If the contrast is awful, we need to replace the text colour.
	var themeBrightness = ((themeColour[0]*299) + (themeColour[1]*587) + (themeColour[2]*114)) / 255000;

	if ((contrastRatio <= 3.5) || ((contrastRatio > 3.5) && (lumiCustom <= 0.03) && (themeBrightness <= 0.5))) {
		// http://stackoverflow.com/a/9664560
		var brightness = ((backgroundColour[0]*299) + (backgroundColour[1]*587) + (backgroundColour[2]*114)) / 255000;
		// First return is "do we even need to attach styles to text?", second is link colour, and third is plain text.
		// I make links "brighter" than the plain text it's next to using the alpha channel.
		if (brightness >= 0.5) {
			return([true,"rgba(0,0,0,0.8)","rgba(0,0,0,1)","gamecats-autocontrast-black"]);
		} else {
			return([true,"rgba(256,256,256,1)","rgba(256,256,256,0.8)","gamecats-autocontrast-white"]);
		}
	} else {
		return([false]);
	}
}

function textHighlight (pageType,tr,usernameNode,colour,textColour,currentStyles) {
	// Don't do anything if the field was left blank.
	if (textColour !== "") {
		if (pageType == "messagelist") {
			var postInfo = tr.childNodes[0].childNodes[0];
		} else {
			var postInfo = tr;
		}
		var plainTextColour = textColour;
		var postInfoLinks = postInfo.getElementsByTagName("a");
		var postInfoSpans = postInfo.getElementsByTagName("span");
		var catchResults = new Array();

		// Check for auto and break out early if we decide we don't need it.
		if (textColour == "auto" || textColour == "automatic" || textColour == "automagic" ) {
			catchResults = autoContrast(pageType,colour,usernameNode);
				if (catchResults[0]) {
					textColour = catchResults[1];
					plainTextColour = catchResults[2];
				} else {
					return(false);
				}
		}

		postInfo.setAttribute("class",(postInfo.getAttribute("class")||"")+" gamecats-text gamecats-text-tr "+(catchResults[3]||""));

		// If people are stacking styles, we need to replace text colours without blowing up the existing CSS.
		var isStyled = false;
		for (var i = 0; i < currentStyles.length; i++) {
			if (currentStyles[i].indexOf(" color:") != -1) {
				isStyled = true;
				currentStyles[i] = " color:"+plainTextColour+"!important;";
				postInfo.setAttribute("style",currentStyles.join(";"));
				break;
			}
		}
		// And if there was no text colour already, just toss one on at the end.
		if (!isStyled) {
			postInfo.setAttribute("style",(postInfo.getAttribute("style")||"")+" color:"+plainTextColour+"!important;");
		}

		for (var i = 0; i < postInfoLinks.length; i++) {
			if ((postInfoLinks[i].parentNode.nodeName != "LI") && (postInfoLinks[i].parentNode.nodeName != "FORM")) {
				postInfoLinks[i].setAttribute("class",(postInfoLinks[i].getAttribute("class")||"")+" gamecats-text gamecats-text-a "+(catchResults[3]||""));
				postInfoLinks[i].setAttribute("style","color:"+textColour+"!important;");
			}
		}
		for (var i = 0; i < postInfoSpans.length; i++) {
			if ((postInfoSpans[i].getAttribute("class")||"").indexOf("tag") == -1) {
				postInfoSpans[i].setAttribute("class",(postInfoSpans[i].getAttribute("class")||"")+" gamecats-text gamecats-text-span "+(catchResults[3]||""));
				postInfoSpans[i].setAttribute("style","color:"+textColour+"!important;");
			}
		}
	}
}

function highlight (mode,pageType,usernameNode,listName,colour,textColour,topicHighlight,topicIgnore,messageHighlight,messageIgnore,topicListName,messageListName,topicContentHighlight,topicContentIgnore,postContentHighlight,postContentIgnore,allowStacking) {
	if (decimalColour(colour,"testvalue")) {
		var appendType = "background-color:";
	} else {
		var appendType = "background-image:";
	}

	if (pageType == "topiclist") {
		var tr = usernameNode.parentNode.parentNode;
		if (usernameNode.parentNode.nodeName == "SPAN") { // Stickies still don't have spans
			tr = tr.parentNode;
		}
		var td = tr.childNodes;

		if (((tr.getAttribute("class").indexOf("gamecats-highlight") == -1) || (allowStacking)) && ((topicHighlight && !topicIgnore) || (mode == "contentMatch" && topicContentHighlight && !topicContentIgnore))) {
			var currentStyles = (tr.getAttribute("style")||"").split(";");
			var isStyled = false;

			if (allowStacking) {
				for (var i = 0; i < currentStyles.length; i++) {
					if (currentStyles[i].indexOf(appendType) != -1) {
						isStyled = true;
						currentStyles[i] = appendType+colour+", "+currentStyles[i].substring(17);
						tr.setAttribute("style",currentStyles.join(";"));
						break;
					}
				}
			}
			if (!isStyled) {
				tr.setAttribute("style",(tr.getAttribute("style")||"")+appendType+colour+";");
				currentStyles = (tr.getAttribute("style")||"").split(";");
			}
			tr.setAttribute("class",(tr.getAttribute("class")||"")+" friend gamecats-highlight gamecats-highlight-topic-tr")
			textHighlight(pageType,tr,usernameNode,colour,textColour,currentStyles);
			for (var i = 0; i < td.length; i++) {
				td[i].setAttribute("style","background-color: transparent; background-image: none;");
				td[i].setAttribute("class",(td[i].getAttribute("class")||"")+" friend gamecats-highlight gamecats-highlight-topic-td")
			}
		}

		if (topicListName) {
			if (usernameNode.parentNode.nodeName == "SPAN") { // Stickies don't have spans
				var existingList = usernameNode.parentNode.nextSibling;
				if (existingList) {
					existingList.textContent = " "+listName+existingList.textContent;
				} else {
					var newList = usernameNode.parentNode.parentNode.appendChild(document.createTextNode(" "+listName));
				}
			} else {
				var existingList = usernameNode.nextSibling;
				if (existingList) {
					existingList.textContent = " "+listName+existingList.textContent;
				} else {
					var newList = usernameNode.parentNode.appendChild(document.createTextNode(" "+listName));
				}
			}

		}

		if (((mode == "usernameMatch" || mode == "tagMatch") && topicIgnore) || (mode == "contentMatch" && topicContentIgnore)) {
			if (tr.parentNode) {
				tr.parentNode.removeChild(tr);
			}
		}
	}

	if (pageType == "messagelist") {
		// Adding group names
		if (messageListName) {
			var existingList = usernameNode.parentNode.nextSibling;
			if (!storedStyleGroupAsTagSetting) {
				if (existingList) {
					existingList.textContent = " "+listName+existingList.textContent;
				} else {
					var newListSpan = usernameNode.parentNode.parentNode.appendChild(document.createElement("span"));
					newListSpan.setAttribute("class","user_info");
					var newList = newListSpan.appendChild(document.createTextNode(" "+listName));
				}
			} else {
				var newTagSpan = usernameNode.parentNode.parentNode.appendChild(document.createElement("span"));
				var whitespace = usernameNode.parentNode.parentNode.appendChild(document.createTextNode(" "));
				newTagSpan.textContent = listName;
				newTagSpan.setAttribute("class","tag");
			}
		}

		var tr = usernameNode.parentNode.parentNode.parentNode.parentNode.parentNode;
		var div = tr.childNodes[0].childNodes[0];

		if ((((tr.getAttribute("class")||"").indexOf("gamecats-highlight") == -1) || (allowStacking)) && (((mode == "usernameMatch" || mode == "tagMatch") && messageHighlight && !messageIgnore) || (mode == "contentMatch" && postContentHighlight && !postContentIgnore))) {
			var currentStyles = (div.getAttribute("style")||"").split(";");
			var isStyled = false;

			if (allowStacking) {
				for (var i = 0; i < currentStyles.length; i++) {
					if (currentStyles[i].indexOf(appendType) != -1) {
						isStyled = true;
						currentStyles[i] = appendType+colour+", "+currentStyles[i].substring(17);
						div.setAttribute("style",currentStyles.join(";"));
						break;
					}
				}
			}

			if (!isStyled) {
				div.setAttribute("style",(div.getAttribute("style")||"")+appendType+colour+";");
				currentStyles = (tr.getAttribute("style")||"").split(";");
			}
			tr.setAttribute("class",(tr.getAttribute("class")||"")+" friend gamecats-highlight gamecats-highlight-message-tr");
			div.setAttribute("class",(div.getAttribute("class")||"")+" friend gamecats-highlight gamecats-highlight-message-div");

			textHighlight(pageType,tr,usernameNode,colour,textColour,currentStyles);
		}

		if (((mode == "usernameMatch" || mode == "tagMatch") && messageIgnore) || (mode == "contentMatch" && postContentIgnore)) {
			if (tr.parentNode) {
				tr.parentNode.removeChild(tr);
			}
		}
	}
}

// Finding usernames, looking for tags, etc
var pageType;
var authorTDs;
var titlePostContent;
var userTagsContent;
var topicList = document.evaluate('//table[contains(@class,"board topics tlist newbeta")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
if (topicList !== null) {
	authorTDs = document.evaluate('//td[contains(@class,"tauthor")]//a', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	pageType = "topiclist";
}

var messageList = document.evaluate('//table[contains(@class,"board message")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
if (messageList !== null) {
	authorTDs = document.evaluate('//td[contains(@class,"msg")]//a[@class="name menu_toggle"]//b', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	pageType = "messagelist";
}

if (topicList !== null || messageList !== null) {
	for (var k = 0; k < authorTDs.snapshotLength; k++) {
		authorTDs.snapshotItem(k).isAdmin = false;
		authorTDs.snapshotItem(k).isMod = false;
		authorTDs.snapshotItem(k).isVIP = false;
		authorTDs.snapshotItem(k).isTC = false;

		// Content highlight setup
		titlePostContent = authorTDs.snapshotItem(k);
		while (titlePostContent.nodeName != "TR") {
			titlePostContent = titlePostContent.parentNode;
		}
		if (pageType == "topiclist") {
			titlePostContent = titlePostContent.getElementsByTagName("td")[1].textContent;
		} else {
			titlePostContent = titlePostContent.childNodes[0].childNodes[1];
			var embedStrings = ""; // Embeds have no text attached, so I need to fetch their information directly

			var embedsExist = titlePostContent.getElementsByClassName("yt_player"); // Youtube embeds
			if (embedsExist) {
				for (var l = 0; l < embedsExist.length; l++) {
					embedStrings += " "+embedsExist[0].getAttribute("data-id");
				}
			}


			embedsExist = titlePostContent.getElementsByClassName("img_container"); // Image embeds
			if (embedsExist) {
				for (var l = 0; l < embedsExist.length; l++) {
					embedStrings += " "+embedsExist[0].getAttribute("href");
				}
			}

			titlePostContent = titlePostContent.textContent + embedStrings;
		}

		// Tag highlight setup
		userTagsContent = authorTDs.snapshotItem(k);
		if (pageType == "messagelist") {
			while (userTagsContent.getAttribute("class") != "msg_infobox") {
				userTagsContent = userTagsContent.parentNode;
			}

			userTagsContent = userTagsContent.getElementsByClassName("user_info")[0];
			if (userTagsContent) {
				userTagsContent = userTagsContent.textContent;
			}

			// Make sure we don't forget the first post in a topic, since it doesn't get the (Topic Creator) tag
			if ((k == 0) || (k == authorTDs.snapshotLength-1)) {
				var anchors = authorTDs.snapshotItem(k).parentNode.parentNode.parentNode.parentNode.getElementsByTagName("a");
				if (anchors[0].getAttribute("name") == "1") {
					authorTDs.snapshotItem(k).isTC = true;
				}
			}
		} else {
			while (userTagsContent.nodeName != "TD") {
				userTagsContent = userTagsContent.parentNode;
			}

			if (userTagsContent.childNodes[1]) {
				userTagsContent = userTagsContent.childNodes[1].textContent;
			}
		}
		if (typeof userTagsContent == "string") {
			if ((userTagsContent.indexOf("(A)") != -1) || (userTagsContent.indexOf("(Admin)") != -1)) {
				authorTDs.snapshotItem(k).isAdmin = true;
			}
			if ((userTagsContent.indexOf("(M)") != -1) || (userTagsContent.indexOf("(Moderator)") != -1) || (userTagsContent.indexOf("(Lead Moderator)") != -1)) {
				authorTDs.snapshotItem(k).isMod = true;
			}
			if ((userTagsContent.indexOf("(V)") != -1) || (userTagsContent.indexOf("(VIP)") != -1)) { // Not sure if these are the right strings to be looking for, haven't found a VIP to compare against.
				authorTDs.snapshotItem(k).isVIP = true;
			}
			if (userTagsContent.indexOf("(Topic Creator)") != -1) {
				authorTDs.snapshotItem(k).isTC = true;
			}
		}

		// Normal stuff
		for (var i = 0; i < storedNumberOfLists; i++) {
			for (var j = 0; j < storedUsernames[i].length; j++) {
				// Standard username match check
				if ((pageType == "topiclist" && (storedActionHighlightTopic[i] || storedActionIgnoreTopic[i])) || (pageType != "topiclist" && (storedActionHighlightPost[i] || storedActionIgnorePost[i]))) {
					if (authorTDs.snapshotItem(k).textContent == storedUsernames[i][j]) {
						highlight("usernameMatch",pageType,authorTDs.snapshotItem(k),storedListNames[i],storedHighlightColours[i],storedHighlightTextColours[i],storedActionHighlightTopic[i], storedActionIgnoreTopic[i], storedActionHighlightPost[i], storedActionIgnorePost[i], storedActionTagTopic[i], storedActionTagPost[i], storedActionHighlightTopicContent[i], storedActionIgnoreTopicContent[i], storedActionHighlightPostContent[i], storedActionIgnorePostContent[i], storedActionAllowStacking[i]);
					}
				}
				// Content-based highlighting check
				if ((pageType == "topiclist" && (storedActionHighlightTopicContent[i] || storedActionIgnoreTopicContent[i])) || (pageType != "topiclist" && (storedActionHighlightPostContent[i] || storedActionIgnorePostContent[i]))) {
					if (makeInsensitive(titlePostContent).indexOf(makeInsensitive(storedUsernames[i][j])) != -1) {
						highlight("contentMatch",pageType,authorTDs.snapshotItem(k),storedListNames[i],storedHighlightColours[i],storedHighlightTextColours[i],storedActionHighlightTopic[i], storedActionIgnoreTopic[i], storedActionHighlightPost[i], storedActionIgnorePost[i], storedActionTagTopic[i], storedActionTagPost[i], storedActionHighlightTopicContent[i], storedActionIgnoreTopicContent[i], storedActionHighlightPostContent[i], storedActionIgnorePostContent[i], storedActionAllowStacking[i]);
					}
				}
				// Tag checks, admin, tc, etc.
				if ((storedActionHighlightAdmin[i] && authorTDs.snapshotItem(k).isAdmin) || (storedActionHighlightMod[i] && authorTDs.snapshotItem(k).isMod) || (storedActionHighlightVIP[i] && authorTDs.snapshotItem(k).isVIP) || (storedActionHighlightTC[i] && authorTDs.snapshotItem(k).isTC)) {
					highlight("tagMatch",pageType,authorTDs.snapshotItem(k),storedListNames[i],storedHighlightColours[i],storedHighlightTextColours[i],storedActionHighlightTopic[i], storedActionIgnoreTopic[i], storedActionHighlightPost[i], storedActionIgnorePost[i], storedActionTagTopic[i], storedActionTagPost[i], storedActionHighlightTopicContent[i], storedActionIgnoreTopicContent[i], storedActionHighlightPostContent[i], storedActionIgnorePostContent[i], storedActionAllowStacking[i]);
				}
				// Setting up for the right click menu
				if (((i == 0) && (j == 0)) && storedAllowRightclickHijacksSetting) {
					authorTDs.snapshotItem(k).setAttribute("contextmenu", "gamecats-menu");
					authorTDs.snapshotItem(k).addEventListener("contextmenu", e => { readyMenu(e); e.preventDefault();}, false);
				}
			}
		}
	}
}

/*******************\
* Right click menu! *
\*******************/

function nukeMenu () {
	var oldMenu = document.getElementById("gamecats-menu");
	if (oldMenu) {
		oldMenu.parentNode.removeChild(oldMenu);
	}
}

function readyMenu (rightClick) {
	getSettings();
	nukeMenu();
	
	if (pageType == "topiclist") {
		var mainMenu = rightClick.target.parentNode.parentNode.appendChild(document.createElement("div"));
	} else if (pageType == "messagelist") {
		var mainMenu = rightClick.target.parentNode.parentNode.parentNode.appendChild(document.createElement("div")); 
	}
	var mainMenuLabel = mainMenu.appendChild(document.createElement("select"));
	mainMenu.setAttribute("id","gamecats-menu");
	mainMenuLabel.setAttribute("label","GameCATs Highlighting");
	mainMenuLabel.setAttribute("style","font-size:12px;");

	var node = rightClick.target;
	var clickedUsername = node.textContent;
	console.log(clickedUsername);
	var menuItems = new Array();
	
	var placeholder = document.createElement("option");
	placeholder.textContent = "GameCATs";
	placeholder.setAttribute("style","display:none;");
	mainMenuLabel.appendChild(placeholder);
	for (var i = 0; i < storedNumberOfLists; i++) {
		menuItems[i] = document.createElement("option");
		menuItems[i].setAttribute("value",i);
		mainMenuLabel.appendChild(menuItems[i]);

		// Check the box if already listed, and use the "remove" option
		if (storedUsernames[i].indexOf(clickedUsername) != -1) {
			menuItems[i].textContent = "☑ "+storedListNames[i]; //menuItems[i].setAttribute("checked","true");
			menuItems[i].addEventListener("click", function() {saveSettings("rightclickmenu",clickedUsername,this.getAttribute("value"),"remove"); nukeMenu();}, false);
		} else {
			menuItems[i].textContent = "☐ "+storedListNames[i];
			menuItems[i].addEventListener("click", function() {saveSettings("rightclickmenu",clickedUsername,this.getAttribute("value"),"add"); nukeMenu();}, false);
		}
		
		/* Eventually I might fix this. Maybe.
		var textHighlightColour = storedHighlightTextColours[i];
		if (textHighlightColour == "auto" || textHighlightColour == "automatic" || textHighlightColour == "automagic" ) {
			catchResults = autoContrast(pageType,textHighlightColour,node);
				if (catchResults[0]) {
					textHighlightColour = catchResults[2];
				}
		} */
		
		menuItems[i].setAttribute("style","color:"+storedHighlightTextColours[i]+"; background-color:"+storedHighlightColours[i]+"; background-image:"+storedHighlightColours[i]+";"); // Maybe someday a firefox update will turn background-image on.
	}
	
	var cancelButton = document.createElement("option");
	cancelButton.textContent = "Cancel";
	cancelButton.addEventListener("click", function() {nukeMenu();}, false);
	mainMenuLabel.appendChild(cancelButton);
}

/*********************************\
* Time to create a settings page! *
\*********************************/

function createSettingsPage () {

	// Styyyyyle!
	var style = document.createElement("style");
	style.textContent = '.container { clear:both; } .priorityButtons, .deleteButtons { display: block; } .usernameFields { height: 160px; width: 447px; } span {float: left;} span:nth-child(2) {clear: left;} label.actionLabels:nth-child(2):after {content: "Highlight/Ignore in Topic List\\00000A"; white-space: pre;} label.actionLabels:nth-child(4):after {content: "Highlight/Ignore in Message List\\00000A"; white-space: pre;} label.actionLabels:nth-child(6):after {content: "Add group name in Topic/Message List\\00000A"; white-space: pre;} label.actionLabels:nth-child(8):after {content: "Highlight/Ignore content in Topic List\\00000A"; white-space: pre;} label.actionLabels:nth-child(10):after {content: "Highlight/Ignore content in Message List\\00000A"; white-space: pre;} label.actionLabels:nth-child(11):after {content: "Allow stacking\\00000A"; white-space: pre;} label.actionLabels:nth-child(15):after {content: "Target Admins/Mods/VIPs/TCs\\00000A"; white-space: pre;} label.caseInsensitiveToggle, label.customCSSToggle, label.settingsLinkLocation, label.allowRightclickHijacksToggle { clear:both; display: block;} label.caseInsensitiveToggle:after {content: "Ignore case sensitivity on content matches";} label.customCSSToggle:after {content: "Using CSS with custom colours";} label.allowRightclickHijacksToggle:after {content: "Allow hijacking the right click context menu";} label.styleGroupAsTagToggle:after {content: "Style groups as GameFAQs tags";} label.settingsLinkLocation:before {content: "Settings link location: "} .exportImportLabel:before {content: "\\00000A Import/Export: "; white-space: pre;}';
	document.getElementsByTagName("head")[0].appendChild(style);

	// Creating all the variables I'll need for the upcoming loop.
	var body = document.getElementsByTagName("body")[0];
	var container = new Array();
	var listname = new Array();
	var listnameFields = new Array();
	var username = new Array();
	var usernameFields = new Array();
	var colour = new Array();
	var colourFields = new Array();
	var textColour = new Array();
	var textColourFields = new Array();
	var action = new Array();
	var actionFields = new Array();
	var labels = new Array();
	var deleteButtons = new Array();
	var priorityButtons = new Array();
	var spans = new Array();

	// Creating a bunch of input fields for each highlight list.
	for (var i = 0; i < storedNumberOfLists; i++) {
		// Wrap each entry in its own div, for easy location of children and deletion.
		container[i] = document.createElement('div');
		container[i].setAttribute('id','container'+i);
		container[i].setAttribute('class','container');
		body.appendChild(container[i]);
		// Pairing a few other things in spans for the sake of styling.
		spans[i,0] = document.createElement('span');
		spans[i,1] = document.createElement('span');
		spans[i,2] = document.createElement('span');
		spans[i,3] = document.createElement('span');
		container[i].appendChild(spans[i,0]);
		container[i].appendChild(spans[i,1]);
		container[i].appendChild(spans[i,2]);
		container[i].appendChild(spans[i,3]);

		// List name, for user organizition or if you choose to let the name of said list show next to usernames.
		listnameFields[i] = document.createElement('input');
		listnameFields[i].setAttribute('type','text');
		listnameFields[i].setAttribute('id','listnameFields'+i);
		listnameFields[i].setAttribute('class','listnameFields');
		listnameFields[i].setAttribute('placeholder','Group Name');
		listnameFields[i].setAttribute('value',storedListNames[i]);
		spans[i,0].appendChild(listnameFields[i]);

		// The colour to change the background to when a username is matched with one on the list.
		colourFields[i] = document.createElement('input');
		colourFields[i].setAttribute('type','text');
		colourFields[i].setAttribute('id','colourFields'+i);
		colourFields[i].setAttribute('class','colourFields');
		colourFields[i].setAttribute('placeholder','Background Colour');
		colourFields[i].setAttribute('value',storedHighlightColours[i]);
		spans[i,0].appendChild(colourFields[i]);

		// The colour to change text to when a username is matched with one on the list.
		textColourFields[i] = document.createElement('input');
		textColourFields[i].setAttribute('type','text');
		textColourFields[i].setAttribute('id','textColourFields'+i);
		textColourFields[i].setAttribute('class','textColourFields');
		textColourFields[i].setAttribute('placeholder','Text Colour (optional)');
		textColourFields[i].setAttribute('value',storedHighlightTextColours[i]);
		spans[i,0].appendChild(textColourFields[i]);

		// Username lists.
		usernameFields[i] = document.createElement('textarea');
		usernameFields[i].textContent = storedUsernames[i].join(",");
		usernameFields[i].setAttribute('id','usernameFields'+i);
		usernameFields[i].setAttribute('class','usernameFields');
		usernameFields[i].setAttribute('placeholder','Usernames and/or post content to match, case sensitive.');
		spans[i,1].appendChild(usernameFields[i]);

		// Actions to perform when we find a match, or special matching conditions
		for (var j = 0; j < 15; j++) {
			labels[i*15+j] = document.createElement('label');
			labels[i*15+j].setAttribute('class','actionLabels');
			actionFields[i*15+j] = document.createElement('input');
			actionFields[i*15+j].setAttribute('type','checkbox');
			actionFields[i*15+j].setAttribute('id','actionFields'+(i*15+j));
			actionFields[i*15+j].setAttribute('class','actionFields');

			spans[i,2].appendChild(labels[i*15+j]);
			labels[i*15+j].appendChild(actionFields[i*15+j]);
		}
		// Pre-check the boxes only if the setting is already present.
		if (storedActionHighlightTopic[i] === true) {
			actionFields[i*15].setAttribute('checked','');
		}
		if (storedActionIgnoreTopic[i] === true) {
			actionFields[i*15+1].setAttribute('checked','');
		}
		if (storedActionHighlightPost[i] === true) {
			actionFields[i*15+2].setAttribute('checked','');
		}
		if (storedActionIgnorePost[i] === true) {
			actionFields[i*15+3].setAttribute('checked','');
		}
		if (storedActionTagTopic[i] === true) {
			actionFields[i*15+4].setAttribute('checked','');
		}
		if (storedActionTagPost[i] === true) {
			actionFields[i*15+5].setAttribute('checked','');
		}
		if (storedActionHighlightTopicContent[i] === true) {
			actionFields[i*15+6].setAttribute('checked','');
		}
		if (storedActionIgnoreTopicContent[i] === true) {
			actionFields[i*15+7].setAttribute('checked','');
		}
		if (storedActionHighlightPostContent[i] === true) {
			actionFields[i*15+8].setAttribute('checked','');
		}
		if (storedActionIgnorePostContent[i] === true) {
			actionFields[i*15+9].setAttribute('checked','');
		}
		if (storedActionAllowStacking[i] === true) {
			actionFields[i*15+10].setAttribute('checked','');
		}
		if (storedActionHighlightAdmin[i] === true) {
			actionFields[i*15+11].setAttribute('checked','');
		}
		if (storedActionHighlightMod[i] === true) {
			actionFields[i*15+12].setAttribute('checked','');
		}
		if (storedActionHighlightVIP[i] === true) {
			actionFields[i*15+13].setAttribute('checked','');
		}
		if (storedActionHighlightTC[i] === true) {
			actionFields[i*15+14].setAttribute('checked','');
		}

		// Priority buttons, to move this div to the top.
		priorityButtons[i] = document.createElement('input');
		priorityButtons[i].setAttribute('id','priorityButtons'+i);
		priorityButtons[i].setAttribute('class','priorityButtons');
		priorityButtons[i].setAttribute('type','button');
		priorityButtons[i].setAttribute('value','Send To Top');
		priorityButtons[i].addEventListener('click',function() {this.parentNode.parentNode.parentNode.insertBefore(this.parentNode.parentNode,this.parentNode.parentNode.parentNode.childNodes[0]);},true);
		spans[i,3].appendChild(priorityButtons[i]);

		// Delete buttons, to trash the whole containing div.
		deleteButtons[i] = document.createElement('input');
		deleteButtons[i].setAttribute('id','deleteButtons'+i);
		deleteButtons[i].setAttribute('class','deleteButtons');
		deleteButtons[i].setAttribute('type','button');
		deleteButtons[i].setAttribute('value','Delete');
		deleteButtons[i].addEventListener('click',function() {this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);},true);
		spans[i,3].appendChild(deleteButtons[i]);

	}

	// Done with all the looping junk, now for the ever-important "save settings" and "new list" buttons.

	function newList() {
		GM_setValue("numberOfLists",GM_getValue("numberOfLists")+1);
		GM_setValue("Main Settings",GM_getValue("Main Settings")+"^||||false,false,false,false,false,false,false,false,false,false,false");

		// The anchor set here gets watched on page load to automatically reopen the settings page.
		window.location.href = window.location.href.split("#")[0]+"#ReloadHighlightSettings";
		location.reload();
	}

	var caseInsensitiveToggle = [document.createElement('label'),document.createElement('input')];
	caseInsensitiveToggle[1].setAttribute('type','checkbox');
	caseInsensitiveToggle[1].setAttribute('id','caseInsensitiveToggle');
	caseInsensitiveToggle[0].setAttribute('class','caseInsensitiveToggle');
	caseInsensitiveToggle[1].setAttribute('class','caseInsensitiveToggle');
	if (storedCaseInsensitive == true) {
		caseInsensitiveToggle[1].setAttribute('checked','');
	}
	body.appendChild(caseInsensitiveToggle[0]);
	caseInsensitiveToggle[0].appendChild(caseInsensitiveToggle[1]);

	var customCSSToggle = [document.createElement('label'),document.createElement('input')];
	customCSSToggle[1].setAttribute('type','checkbox');
	customCSSToggle[1].setAttribute('id','customCSSToggle');
	customCSSToggle[0].setAttribute('class','customCSSToggle');
	customCSSToggle[1].setAttribute('class','customCSSToggle');
	if (storedUseColouredCustomCSSSetting == true) {
		customCSSToggle[1].setAttribute('checked','');
	}
	body.appendChild(customCSSToggle[0]);
	customCSSToggle[0].appendChild(customCSSToggle[1]);

	var styleGroupAsTagToggle = [document.createElement('label'),document.createElement('input')];
	styleGroupAsTagToggle[1].setAttribute('type','checkbox');
	styleGroupAsTagToggle[1].setAttribute('id','styleGroupAsTagToggle');
	styleGroupAsTagToggle[0].setAttribute('class','styleGroupAsTagToggle');
	styleGroupAsTagToggle[1].setAttribute('class','styleGroupAsTagToggle');
	if (storedStyleGroupAsTagSetting == true) {
		styleGroupAsTagToggle[1].setAttribute('checked','');
	}
	body.appendChild(styleGroupAsTagToggle[0]);
	styleGroupAsTagToggle[0].appendChild(styleGroupAsTagToggle[1]);
	
	var allowRightclickHijacksToggle = [document.createElement('label'),document.createElement('input')];
	allowRightclickHijacksToggle[1].setAttribute('type','checkbox');
	allowRightclickHijacksToggle[1].setAttribute('id','allowRightclickHijacksToggle');
	allowRightclickHijacksToggle[0].setAttribute('class','allowRightclickHijacksToggle');
	allowRightclickHijacksToggle[1].setAttribute('class','allowRightclickHijacksToggle');
	if (storedAllowRightclickHijacksSetting == true) {
		allowRightclickHijacksToggle[1].setAttribute('checked','');
	}
	body.appendChild(allowRightclickHijacksToggle[0]);
	allowRightclickHijacksToggle[0].appendChild(allowRightclickHijacksToggle[1]);

	var settingsLinkLocationDropdown = [document.createElement('label'),document.createElement('select')];
	var settingsLinkOptions = [document.createElement('option'),document.createElement('option'),document.createElement('option')];
	settingsLinkLocationDropdown[1].setAttribute('id','settingsLinkLocation');
	settingsLinkLocationDropdown[0].setAttribute('class','settingsLinkLocation');
	settingsLinkLocationDropdown[1].setAttribute('class','settingsLinkLocation');
	settingsLinkOptions[0].setAttribute('id','header');
	settingsLinkOptions[0].setAttribute('value',0);
	settingsLinkOptions[0].textContent = 'Header';
	settingsLinkOptions[1].setAttribute('id','accountSettings');
	settingsLinkOptions[1].setAttribute('value',1);
	settingsLinkOptions[1].textContent = 'Account Settings';
	settingsLinkOptions[2].setAttribute('id','both');
	settingsLinkOptions[2].setAttribute('value',2);
	settingsLinkOptions[2].textContent = 'Both';

	body.appendChild(settingsLinkLocationDropdown[0]);
	settingsLinkLocationDropdown[0].appendChild(settingsLinkLocationDropdown[1]);
	settingsLinkLocationDropdown[1].appendChild(settingsLinkOptions[0]);
	settingsLinkLocationDropdown[1].appendChild(settingsLinkOptions[1]);
	settingsLinkLocationDropdown[1].appendChild(settingsLinkOptions[2]);
	settingsLinkOptions[GM_getValue("settingsLinkLocation")].selected = true;

	var newListButton = document.createElement('input');
	newListButton.setAttribute('id','newListButton');
	newListButton.setAttribute('class','newListButton');
	newListButton.setAttribute('type','button');
	newListButton.setAttribute('value','New Highlighting List');
	body.appendChild(newListButton);
	newListButton.addEventListener('click',newList,true);

	var saveSettingsButton = document.createElement('input');
	saveSettingsButton.setAttribute('id','saveSettingsButton');
	saveSettingsButton.setAttribute('class','saveSettingsButton');
	saveSettingsButton.setAttribute('type','button');
	saveSettingsButton.setAttribute('value','Save Settings');
	body.appendChild(saveSettingsButton);
	saveSettingsButton.addEventListener('click',function() {var here = this;saveSettings("settingspage");here.setAttribute("value","Saved!");setTimeout(function(){here.setAttribute("value","Save Settings")},1000);},true);

	var exitButton = document.createElement('input');
	exitButton.setAttribute('id','exitButton');
	exitButton.setAttribute('class','exitButton');
	exitButton.setAttribute('type','button');
	exitButton.setAttribute('value','Exit');
	body.appendChild(exitButton);
	exitButton.addEventListener('click',function() {window.scrollTo(0,0); window.location.href = window.location.href.split("#")[0];},true);

	var exportImportLabel = document.createElement('label');
	exportImportLabel.setAttribute('id','exportImportLabel');
	exportImportLabel.setAttribute('class','exportImportLabel');
	var exportImportField = document.createElement('input');
	exportImportField.setAttribute('id','exportImportField');
	exportImportField.setAttribute('class','exportImportField');
	exportImportField.setAttribute('type','text');
	body.appendChild(exportImportLabel);
	exportImportLabel.appendChild(exportImportField);

	var importButton = document.createElement('input');
	importButton.setAttribute('id','importButton');
	importButton.setAttribute('class','importButton');
	importButton.setAttribute('type','button');
	importButton.setAttribute('value','Import');
	body.appendChild(importButton);
	importButton.addEventListener('click',function() {var here = this;saveSettings("import");here.setAttribute("value","Imported!");setTimeout(function(){window.location.href = window.location.href.split("#")[0]+"#ReloadHighlightSettings"; location.reload();},300);},true);

	if (window.location.href.split("#")[1] == "ReloadHighlightSettings") {
		window.location.href = window.location.href.split("#")[0]+"#HighlightSettings";
		window.scrollTo(0,document.body.scrollHeight);
	}
}

function prepSettings () {
	var gfaqsBody = document.getElementsByTagName("body")[0];
	var gfaqsHead = document.getElementsByTagName("head")[0];
	var killMe = gfaqsBody.childNodes;
	var killMeToo = gfaqsHead.childNodes;
	for (var i = killMe.length-1; i >= 0; i--) {
		gfaqsBody.removeChild(killMe[i]);
	}
	for (var i = killMeToo.length-1; i >= 0; i--) {
		gfaqsHead.removeChild(killMeToo[i]);
	}
	var title = gfaqsHead.appendChild(document.createElement("title"));
	title.textContent = "Highlight Settings";
	createSettingsPage();
}

if (window.location.href.split("#")[1] == "ReloadHighlightSettings") {
	prepSettings();
}