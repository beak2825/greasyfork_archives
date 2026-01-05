// ==UserScript==
// @name         prajelesemoticons
// @namespace    http://use.i.E.your.homepage/
// @version      5.1.0
// @description  Prajemoticon
// @include     	*://*.instasynch.com/*
// @include     	*://instasynch.com/*
// @match       	*://*.instasynch.com/*
// @match       	*://instasynch.com/*
// @include     	*://*.instasync.com/*
// @include     	*://instasync.com/*
// @match       	*://*.instasync.com/*
// @match       	*://instasync.com/*
// @grant        none
// @copyright    2014
// @downloadURL https://update.greasyfork.org/scripts/8039/prajelesemoticons.user.js
// @updateURL https://update.greasyfork.org/scripts/8039/prajelesemoticons.meta.js
// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},

var oldOnConnected = window.global.onConnected,
    emotes = [
    { src:"http://i.imgur.com/ALa7ORX.png", width:78, height:87, title:'aprob'},
    { src:"http://i.imgur.com/243XkTA.gif", width:80, height:79, title:'prajeala'},
    { src:"http://i.imgur.com/WZR7q19.gif", width:75, height:75, title:'vai'},

    ];

function addEmotes(){
    for(var i = 0; i < emotes.length; i += 1){
        var parameter = emotes[i];
        window.$codes[parameter.title] = $('<img>', parameter)[0].outerHTML;
        window.$codes[parameter.name] = $('<img>', parameter)[0].outerHTML;

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