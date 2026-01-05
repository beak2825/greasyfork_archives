// ==UserScript==
// @name       Roblox Signature
// @version    1.1
// @description Auto-inserts signature in posts and private messages.
// @icon http://breadlord.org/breadlord.png
// @match http://www.roblox.com/Forum/AddPost.aspx*
// @match http://www.roblox.com/messages/compose*
// @namespace https://greasyfork.org/users/11096
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/9705/Roblox%20Signature.user.js
// @updateURL https://update.greasyfork.org/scripts/9705/Roblox%20Signature.meta.js
// ==/UserScript==
var textbox;
var postbutton;
var type = 0;

var sig = GM_getValue("sig", "Press 'Edit Signature' to change this!");

if (document.getElementById("ctl00_cphRoblox_Createeditpost1_PostForm_PostBody")) {
	type = 0;
	console.log("It's a forum post!");
	textbox = document.getElementById("ctl00_cphRoblox_Createeditpost1_PostForm_PostBody");
	postButton = document.getElementById("ctl00_cphRoblox_Createeditpost1_PostForm_PostButton");
//} else if (document.getElementById("body").getAttribute("class") == "messages-reply-box text-box text") {
} else if ((document.getElementsByClassName("messages-reply-box")[0] === null) === false) {
	console.log("It's a PM!");
	type = 1;
	textbox = document.getElementsByClassName("messages-reply-box")[0];
	postButton = document.getElementById("send-btn");
}
var buttonParent = postButton.parentElement;

var button = document.createElement("Input");
var button2 = document.createElement("Input");

window.onload = function () { changeSig(); };

function changeSig() {
	console.log(type);
	if (type === 1) {
		textbox = document.getElementsByClassName("messages-reply-box")[0];
		sig = GM_getValue("sig");
		if (textbox.value.search("\n\n" + sig) == -1) {
			console.log("No signature already, inserting now.");
			textbox.value = textbox.value + "\n\n" + sig;
		}
	} else {
		textbox = document.getElementById("ctl00_cphRoblox_Createeditpost1_PostForm_PostBody");
		sig = GM_getValue("sig");
		if (textbox.value.search("\n\n" + sig) == -1) {
			console.log("No signature already, inserting now.");
			textbox.value = textbox.value + "\n\n" + sig;
		}
	}
}

function editSig() {
    var newsig = prompt("Enter a new signature:");
    if (newsig === "") return;
	GM_setValue("sig",newsig);
	changeSig();
}

button.type = "button";
button.id = "rblxsig";
button.value = " Edit Signature ";
button.className = "translate btn-control btn-control-medium";
button.onclick = function() {editSig()};

button2.type = "button";
button2.id = "rblxsigins";
button2.value = " Add Signature ";
button2.className = "translate btn-control btn-control-medium";
button2.onclick = function() {
	changeSig();
};

buttonParent.innerHTML =  "&nbsp" + buttonParent.innerHTML;
buttonParent.insertBefore(button, buttonParent.firstChild);
buttonParent.insertBefore(button2, buttonParent.firstChild);
setTimeout(changeSig, 6000);