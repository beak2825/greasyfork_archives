// ==UserScript==
// @name         kebab removal script
// @namespace    http://use.i.E.your.homepage/
// @version      6.6.6.6
// @description  New memes
// @match        http://instasynch.com/*
// @grant        none
// @copyright    2014
// @downloadURL https://update.greasyfork.org/scripts/6233/kebab%20removal%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/6233/kebab%20removal%20script.meta.js
// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},

var oldOnConnected = window.global.onConnected,
    emotes = [
    { src:"http://i.imgur.com/IvlK2p9.gif", width:60, height:48, title:'supermeni'},

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