// ==UserScript==
// @name           Marginal Revolution Kill File
// @description    Wipe out annoying people on MR blog
// @namespace      Mr
// @author         Dan Weber
// @include        https://marginalrevolution.com/*
// @match          https://marginalrevolution.com/*
// @version        0.61.3
// @downloadURL https://update.greasyfork.org/scripts/988/Marginal%20Revolution%20Kill%20File.user.js
// @updateURL https://update.greasyfork.org/scripts/988/Marginal%20Revolution%20Kill%20File.meta.js
// ==/UserScript==

if (typeof GM_getValue == 'undefined') {
    var GM_getValue = function(name, defaultVaue) {
	return localStorage.getItem(name);
    }
}

if (typeof GM_setValue == 'undefined') {
    var GM_setValue = function(name, value) {
	localStorage.setItem(name, value);
    }
}

function scanForFirst() {
    for (var i = 0; i < allH3s.snapshotLength; i++) {
	var a = allH3s.snapshotItem(i);
	if (a.className == "comment_author") {
	    var text = a.parentNode.nextElementSibling.children[0].innerText;
	    if (text.match(/^(.\n){0,5}FIRST(.|\n){0,5}REPLY/i)) {
		a.parentNode.hidden = true;
		a.parentNode.nextElementSibling.hidden = true;
	    }
	}
    }
}

function addToKillFile(entry) {
    killfile.push(entry);
    GM_setValue("mr_killfile", JSON.stringify(killfile));
    scan_posts();
    showTurnOff();
}

function removeFromKillFile(entry) {
    var index = killfile.indexOf(entry);
    if (index > -1) {
	killfile.splice(index, 1);
    }
    GM_setValue("mr_killfile", JSON.stringify(killfile));
    scan_posts();
    showTurnOff();
}

function showTurnOff() {
    console.log(undo_bar);
    undo_bar.innerHTML = '';
    console.log("x-length is " + killfile.length);
    for (var i = 0; i < killfile.length; i++) {
	var name = killfile[i];
	var elem = document.createElement('span');
	elem.style.fontSize = "small";
	elem.style.color = "green";
	elem.style.cursor = "pointer";
	elem.innerText = ' Un-kill ' + name;
	
	var returnsfunction2 = function(bob) { return function() { removeFromKillFile(bob); } };
	elem.addEventListener('click', 
			      returnsfunction2(name),
			      false);
	undo_bar.appendChild(elem);
    }
}

function scan_posts(first_time) {
    console.log("scanning...");
    for (var i = 0; i < allH3s.snapshotLength; i++) {
	var a = allH3s.snapshotItem(i);
	if (a.className == "comment-author") {
	    var author = a.innerText;
	    if (author == undefined)
		author = a.textContent;
	    if (first_time) {
		var elem = document.createElement('span');
		elem.style.fontSize = "x-small";
		elem.style.color = "red";
		elem.innerHTML = " killfile";
		elem.style.cursor = "pointer";
		var returnsfunction2 = function(bob) { return function() { addToKillFile(bob); } };
		elem.addEventListener("click", 
				      returnsfunction2(author),
				      false);
		a.parentNode.appendChild(elem);
	    }
	    
	    var parent = a.parentNode.parentNode;
	    if (killfile.indexOf(author) == -1) {
		//console.log("displaying " + author);
		parent.style.display = '';
		parent.nextElementSibling.style.display = '';
	    } else {
		//console.log("hiding " + author);
		//		console.log(i);
		// console.log(a);
		parent.style.display = 'none';
		parent.nextElementSibling.style.display = 'none';
	    }
	    if (first_time) {
		var respond_section = parent.children[parent.childElementCount - 1];
		respond_section.children[0].innerText += " to " + author;
	    }
	}
    }

    for (var i = 0; i < allSections.snapshotLength; i++) {
	var a = allSections.snapshotItem(i);
	if (a.className == "comment-respond") {
	    // todo: I can move the 'respond' tag here
	}
    }

}


var value = GM_getValue("mr_killfile", null);
var killfile = JSON.parse(value);
console.log(killfile)
if (killfile === null) {
    killfile = [ ]
}
value = GM_getValue("mr_settings", null);
var settings = JSON.parse(value);
console.log(settings);
if (settings === null) {
    settings = { } 
}

var allH3s = document.evaluate('//h3[@class]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var allSections = document.evaluate('//section[@class]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

var sidebar = document.getElementById("site-sidebar");
var main = document.getElementById("site-main");

var newdiv = document.createElement("div");
newdiv.innerText="Shoo!";
newdiv.style.color = "purple";

main.insertBefore(newdiv, main.children[0]);

var pw = document.getElementsByClassName("page-wrapper");
console.log(pw);
if (pw) {pw = pw[0];}
console.log(pw);
if (pw) pw.classList.remove("page-wrapper");

newdiv.onclick = function(donothing) { 
    console.log("xxx");
    console.log(donothing);
    /*console.log(settings);
    console.log(settings.shoo);
    console.log(settings['shoo']);*/
    var shoo = (settings['shoo'] == 0);
    if (donothing === true)
	shoo = !shoo
    sidebar.style.display = shoo ? 'none' : '';
    this.innerHTML = shoo ? 'Show' : 'Shoo!';
    settings['shoo'] = shoo ? 1 : 0;
    GM_setValue("mr_settings", JSON.stringify(settings));
}    

if (settings['shoo'] == 1) {
    console.log("shooing now!");
    newdiv.onclick(true);
} else {
    console.log("nuttin' to do");
}

scan_posts(true);


var undo_bar = document.createElement('div');
undo_bar.setAttribute("id", "undo_bar");
undo_bar.align = "right";
main.appendChild(undo_bar);


showTurnOff();
scanForFirst();
