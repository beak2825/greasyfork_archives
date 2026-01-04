// ==UserScript==
// @name         OWoTPing
// @namespace    owot_ping
// @version      1
// @description  Userscript that allows you to be pinged however you want.
// @author       Helloim0_0
// @match        *://*.ourworldoftext.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldoftext.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550463/OWoTPing.user.js
// @updateURL https://update.greasyfork.org/scripts/550463/OWoTPing.meta.js
// ==/UserScript==

var ready = new Audio("https://bonk.io/sound/bell_full_1.mp3");
ready.playbackRate = 1.25;
ready.preservesPitch = false;
var names = localStorage.hlping ? JSON.parse(localStorage.hlping) : [];
w.on("chat", function (e) {
    for (let name of [...names, YourWorld.Nickname, state.worldModel.username]) {
        if (!e.message.includes("@" + name)) continue;
        ready.currentTime = 0;
        ready.play();
        break;
    }
});
w.chat.registerCommand("addnick", function (e) {
	if (names.includes(e[0])) return clientChatResponse("You already have this name added");
	names.push(e[0]);
	localStorage.hlping = JSON.stringify(names);
	clientChatResponse(`Added ${e[0]} to name list`);
}, ["name"], "Add a nickname to use in the ping userscript.", "Helloim0_0");
w.chat.registerCommand("removenick", function (e) {
	if (!names.includes(e[0])) return clientChatResponse("You don't have this name added");
	names = names.filter(x => x != e[0]);
	localStorage.hlping = JSON.stringify(names);
	clientChatResponse(`Removed ${e[0]} from name list`);
}, ["name"], "Remove a nickname from the ping userscript.", "Helloim0_0");
w.chat.registerCommand("nicks", function (e) {
	if (!names.length) return clientChatResponse("You only have your username and nickname added");
	return clientChatResponse(`Besides your username and nickname, you have the other nicknames: ${names.join(", ")}`)
}, ["name"], "See all your nicks in the ping userscript.", "");