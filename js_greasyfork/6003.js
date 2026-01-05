// ==UserScript==
// @name         Niggler's Shitty Emote Pack
// @namespace    http://use.i.E.your.homepage/
// @version      0.1
// @description  Why would you download this?
// @match        http://instasynch.com/*
// @grant        none
// @copyright    2014
// @downloadURL https://update.greasyfork.org/scripts/6003/Niggler%27s%20Shitty%20Emote%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/6003/Niggler%27s%20Shitty%20Emote%20Pack.meta.js
// ==/UserScript==

//{ src:"", width:, height:, title:''},

var oldOnConnected = window.global.onConnected,
    emotes = [
	{ src:"https://i.imgur.com/L3wu55Q.png", width:43, height:47, title:'zimbabwe'},
	{ src:"https://i.imgur.com/YVSpbAw.png", width:49, height:50, title:'santa'},
	{ src:"https://i.imgur.com/fmdppz5.png", width:36, height:46, title:'choke'},
	{ src:"https://i.imgur.com/yWwCJld.png", width:55, height:46, title:'shrug'},
	{ src:"https://i.imgur.com/og9In6D.png", width:48, height:48, title:'smug'},
    ];

function addEmotes(){
    for(var i = 0; i < emotes.length; i += 1){
        var parameter = emotes[i];
        window.$codes[parameter.title] = $('<img>', parameter)[0].outerHTML;
    }
}

//load emotes everytime we connect to a room
//makes sure emotes work even after going to the frontpage and back
window.global.onConnected = function () {
    oldOnConnected();
    addEmotes();
};
//check if we are already connected and the script just loaded slow
 if(typeof(window.userInfo) !== 'undefined' && window.userInfo !== null){
    addEmotes();
}