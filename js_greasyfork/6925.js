// ==UserScript==
// @name         South Park Studios without ads
// @namespace    jLEyVC43gAVB4zdN4h8u
// @author       LemonIllusion
// @version      1.5.1
// @include      /^https?:\/\/(www\.)?southparkstudios\..*\/full-episodes\/.*/
// @description  Creates a button that removes ads during playback on South Park Studios.
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/6925/South%20Park%20Studios%20without%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/6925/South%20Park%20Studios%20without%20ads.meta.js
// ==/UserScript==

//replace(); // Autoreplace

function insertStylesheet() {
		if (document.body) {
				style = document.createElement("style");
				style.innerHTML = "#noadsbuttons {" +
						"padding-bottom: 20px;" +
						"background-color: #333333;" +
				"}" +
				"#noadsbuttons .button {" +
						"float: left;" +
						"width: 50%;" +
						"border-radius: 0;" +
						"cursor: pointer;" +
				"}" +
				"#header_ad {" +
						"display: none;" +
				"}";
				document.body.appendChild(style);
				console.log(style);
		} else {
				setTimeout(insertStylesheet, 10);
		}
}

function getData() {
	if (document.querySelector("[id^=mtvnPlayer]")) {
		objectData = document.querySelector("[id^=mtvnPlayer]").data;
	} else {
		setTimeout(getData, 10);
	}
}

function insertButtons() {
	if (document.getElementById("endcap-container") && document.querySelector(".player.collections")) {
		document.querySelector(".player.collections").insertBefore(buttons, document.getElementById("endcap-container"));
	} else {
		setTimeout(insertButtons, 10);
	}
}

function replace() {
	if (objectData && document.querySelector("[id^=mtvnPlayer]") && document.getElementById("player_page_player")) {
				newObject = document.createElement("object");
				newObject.setAttribute("type", "application/x-shockwave-flash");
				newObject.setAttribute("data", objectData);
				newObject.setAttribute("height", "100%");
				newObject.setAttribute("width", "100%");
				newObject.setAttribute("id", "mtvnPlayer");
				newObject.innerHTML = '<param name="wmode" value="transparent">' +
						'<param name="allowFullScreen" value="true">' +
						'<param name="allowScriptAccess" value="always">' +
						'<param name="flashVars" value="autoPlay=true&amp;objectID=mtvnPlayer8274176">';
				document.getElementById("player_page_player").removeChild(document.querySelector("[id^=mtvnPlayer]"));
				document.getElementById("player_page_player").appendChild(newObject);
	} else {
		setTimeout(replace, 10);
	}
}

function redirect() {
	if (objectData) {
		window.location.href = objectData;
	} else {
		setTimeout(redirect, 10);
	}
}

function newButton(text) {
	var button = document.createElement("a");
		button.className = "button";
		button.innerHTML = text;
	return button;
}

setTimeout(insertStylesheet, 0);

var objectData;
setTimeout(getData, 0);

var lButton = newButton("Play without ads")
lButton.addEventListener("click", replace);

var rButton = newButton("Source stream");
rButton.addEventListener("click", redirect);

var buttons = document.createElement("div")
buttons.id = "noadsbuttons";
buttons.className = "clearfix";
buttons.appendChild(lButton);
buttons.appendChild(rButton);
setTimeout(insertButtons, 0);