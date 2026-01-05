// ==UserScript==
// @name         Emote_Test
// @namespace    Ufokinwotm9's room
// @version      2.4
// @description  Emotes
// @grant        none
// @copyright    2015
// @include     *://*.instasynch.com/*
// @include     *://instasynch.com/*
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @downloadURL https://update.greasyfork.org/scripts/8481/Emote_Test.user.js
// @updateURL https://update.greasyfork.org/scripts/8481/Emote_Test.meta.js
// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},


var emotes = [
    { src:"http://i.imgur.com/nOiOvG4.png", width:70, height:70, title:'iwtcird'},
    { src:"http://i.imgur.com/8BqBrHB.gif", width:80, height:80, title:'whatthefuck'},
    { src:"http://i.imgur.com/MOYgUGz.gif", width:50, height:50, title:'gethype'},
    { src:"http://i.imgur.com/CYZ83gD.gif", width:50, height:50, title:'rattlemebones'},
    { src:"http://i.imgur.com/aSifO1J.gif", width:50, height:50, title:'mrskeletal'},
    { src:"http://i.imgur.com/kskSVSc.png", width:80, height:80, title:'mandopedo'},
    { src:"http://i.imgur.com/xl4yHU9.png", width:50, height:50, title:'ech'},
    { src:"http://i.imgur.com/IYvgX7L.gif", width:50, height:50, title:'smooze'},
    { src:"http://i.imgur.com/n9dBRsE.gif", width:80, height:80, title:'ffff'},
    { src:"http://i.imgur.com/xDdaM9K.gif", width:50, height:50, title:'unf'},
    { src:"http://i.imgur.com/NuNvwDr.gif", width:50, height:50, title:'thedevice'},
    { src:"http://i.imgur.com/5Hd7s2J.jpg", width:50, height:50, title:'cresh'},
    { src:"http://i.imgur.com/XkYtvVm.jpg", width:50, height:50, title:'samiam'},
    { src:"http://i.imgur.com/vYrkH0n.png", width:50, height:50, title:'scoots'},
    { src:"http://i.imgur.com/EcPCJUA.gif", width:50, height:50, title:'wingboner'},
// NSFW Emotes
    { src:"http://i.imgur.com/uxSMzqu.png", width:100, height:100, title:'nsfw1'},
    { src:"http://i.imgur.com/LJJZyxO.png", width:100, height:100, title:'nsfw2'},
    ];

function addEmotes(){
    emotes.forEach(function(emote){
        window.$codes[emote.title || emote.name] = $('<img>', emote)[0].outerHTML;
    });
}
 
function main(){
    if(!window.$codes || Object.keys(window.$codes).length === 0){
        setTimeout(main, 75);
    }else{
        addEmotes();    
    }
}
if (window.document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main, false);
}