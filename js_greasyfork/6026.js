// ==UserScript==
// @name         Bimps&Jimps
// @namespace    http://use.i.E.your.homepage/
// @version      1.5
// @description  Emotes
// @match        http://instasynch.com/*
// @grant        none
// @copyright    2014
// @downloadURL https://update.greasyfork.org/scripts/6026/BimpsJimps.user.js
// @updateURL https://update.greasyfork.org/scripts/6026/BimpsJimps.meta.js
// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},

var oldOnConnected = window.global.onConnected,
    emotes = [
        { src:"http://i.imgur.com/gyLrG.jpg", width:36, height:58, title: 'frogjump'},
        { src:"http://i.imgur.com/zxm3Y4g.jpg", width:60, height:45, title: 'jimps'},
        { src:"http://gifgifs.com/animations/holidays/party/Party_horn.gif", width:151, height:38, title: 'woo'},
        { src:"http://www.hellomissniki.com/wp-content/uploads/2014/09/happy_birthday_wallpaper_desktop.jpg", width:130, height:120, title: 'happybday'},
        { src:"http://www.lanzaroteinformation.com/files/Monkey_2.jpg", width:70, height:70, title: 'monk'},
        { src:"http://4.bp.blogspot.com/-UHssNFloPA4/TWNvmXngPhI/AAAAAAAAAAc/CEWrcrGzlS8/s1600/pulse.png", width:70, height:60, title: 'edge'},
        { src:"http://imageenvision.com/sm/0033-0810-1218-1423_clip_art_graphic_of_an_orange_guy_character_lying_down_and_holding_up_a_blue_cocktail.jpg", width:100, height:58, title: 'side'},
        {src:"http://img3.wikia.nocookie.net/__cb20140509035025/trollpasta/images/a/a4/SPOOKY_SKELETON_BOUT_TO_EAT_YUR_SOUL.gif", width:30, height:50, title: '2spooky'},
{src:"http://img2.wikia.nocookie.net/__cb20140321193607/adventuretimewithfinnandjake/images/2/2b/Kawaii_Potato.jpg", width:50, height:50, title: 'kawaii'},
{src:"http://cl.jroo.me/z3/4/k/6/d/a.baa-Monkey-Flower.jpg", width:60, height:55, title:'bimps'},
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