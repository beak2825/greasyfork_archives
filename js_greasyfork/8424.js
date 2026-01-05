// ==UserScript==
// @name           Sort Flags
// @author         AstroCB
// @description    Allows you to sort flags by on your user flag page
// @version        1.0
// @namespace  https://github.com/AstroCB
// @include        *://*.stackexchange.com/users/flag-summary/*
// @include        *://*stackoverflow.com/users/flag-summary/*
// @include        *://*serverfault.com/users/flag-summary/*
// @include        *://*superuser.com/users/flag-summary/*
// @include        *://*askubuntu.com/users/flag-summary/*
// @include        *://*stackapps.com/users/flag-summary/*
// @downloadURL https://update.greasyfork.org/scripts/8424/Sort%20Flags.user.js
// @updateURL https://update.greasyfork.org/scripts/8424/Sort%20Flags.meta.js
// ==/UserScript==

function showFlagType(type) {
	var pn = parseInt($(".pager.fr > a:nth-last-child(2)").attr("href").replace("?page=", ""));
	$("#mainbar").text("");
	for (var i = 1; i < pn + 2; i++) {
		$("#mainbar").append('<div id="mainbar' + i + '"></div>');
		if (type === "All") {
			$("#mainbar" + i).load(location.href + "?page=" + i + " #mainbar", function () {
				$(".pager.fr").remove()
			});
		} else {
			$("#mainbar" + i).load(location.href + "?page=" + i + " #mainbar > .flagged-post:has(span." + type + ")", function () {
				$(".pager.fr").remove()
			});
		}
	}
}

function showDeclined() {
	showFlagType("Declined");

	// Update button text and hide other buttons
	$("#flag-sort-declined").text("declined");
	hide(["disputed", "helpful", "all"]);
}

function showDisputed() {
	showFlagType("Disputed");

	// Update button text and hide other buttons
	$("#flag-sort-disputed").text("disputed");
	hide(["declined", "helpful", "all"]);
}

function showHelpful() {
	showFlagType("Helpful");

	// Update button text and hide other buttons
	$("#flag-sort-helpful").text("helpful");
	hide(["declined", "disputed", "all"]);
}

function showAll() {
	showFlagType("All");

	// Update button text and hide other buttons
	$("#flag-sort-all").text("all");
	hide(["declined", "disputed", "helpful"]);
}

function hide(buttons) { // Hide other buttons when one is clicked
	for (var i = 0; i < buttons.length; i++) {
		$("#flag-sort-" + buttons[i]).hide();
	}
}

function main() {
	// Button styling
	var style = document.createElement("style");
	style.type = "text/css";
	style.innerText = ".flag-sort { margin-left: 25px; cursor: pointer; }";
	document.getElementsByTagName("head")[0].appendChild(style);

	// Declined
	var declined = document.createElement("span");
	declined.innerText = "show declined";
	declined.setAttribute("id", "flag-sort-declined");
	declined.setAttribute("class", "flag-sort mod-flag-indicator");
	declined.style.backgroundColor = "#f00" // Spam red
	declined.onclick = showDeclined;

	// Disputed
	var disputed = document.createElement("span");
	disputed.innerText = "show disputed";
	disputed.setAttribute("id", "flag-sort-disputed");
	disputed.setAttribute("class", "flag-sort mod-flag-indicator");
	disputed.style.backgroundColor = "#f90" // Supernova orange
	disputed.onclick = showDisputed;

	// Helpful
	var helpful = document.createElement("span");
	helpful.innerText = "show helpful";
	helpful.setAttribute("id", "flag-sort-helpful");
	helpful.setAttribute("class", "flag-sort mod-flag-indicator");
	helpful.style.backgroundColor = "#33a030" // Rep green
	helpful.onclick = showHelpful;

	// All
	var all = document.createElement("span");
	all.innerText = "show all";
	all.setAttribute("id", "flag-sort-all");
	all.setAttribute("class", "flag-sort mod-flag-indicator");
	all.style.backgroundColor = "#07d" // Bounty blue
	all.onclick = showAll;

	// Container to be appended for the buttons
	var container = document.createElement("div");
	container.style.display = "inline-block";
	container.appendChild(declined);
	container.appendChild(disputed);
	container.appendChild(helpful);
	container.appendChild(all);

	document.getElementsByClassName("subheader")[0].children[0].appendChild(container);
}

// Inject helper functions
var functions = showFlagType.toString() + "\n\n" + showDeclined.toString() + "\n\n" + showDisputed.toString() + "\n\n" + showHelpful.toString() + "\n\n" + showAll.toString() + "\n\n" + hide.toString();
var functionScript = document.createElement('script');
functionScript.type = "text/javascript";
functionScript.textContent = functions;
document.body.appendChild(functionScript);

// Inject the main script
var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = "(" + main.toString() + ")();";
document.body.appendChild(script);