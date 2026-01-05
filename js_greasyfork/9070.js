// ==UserScript==
// @name        MikuxXxGear
// @namespace   v4c
// @description Miku and emotes
// @version     1
// @license     MIT
// @author      Zod-
// @grant       none
// @include     *://*.instasynch.com/*/v4c
// @include     *://instasynch.com/r/v4c
// @include     *://*.instasync.com/r/v4c
// @include     *://instasync.com/r/movie4chan
// @include     http://instasync.com/r/v4c
// @include     https://instasync.com/r/v4c
// @include     http://instasync.com/r/movie4chan

// @downloadURL https://update.greasyfork.org/scripts/9070/MikuxXxGear.user.js
// @updateURL https://update.greasyfork.org/scripts/9070/MikuxXxGear.meta.js
// ==/UserScript==

//Made by Krogan with metal saying "miku color" to everything. Emotes by Metal and CoF


$('head').append('<link href="http://allfont.net/css/?fonts=anime-ace-bold" rel="stylesheet" type="text/css"/>');
$('head').append('<link rel="stylesheet" type="text/css" href="http://googledrive.com/host/0B5VbuD1Jaw15fnV3bE5XeUNIdUQxc1dUNnZHMjgyb0VFT2c1YWpXU09Pai1sdGUxTEtFWk0/mikutest.css"/>');

var emotes = [
    { src:"http://i.imgur.com/1tME9i9.gif", width:50, height:49, title:'mako'},
    { src:"http://i.imgur.com/EOJVmvF.gif", width:53, height:55, title:'skeletal'},
    { src:"http://i.imgur.com/xv1O1si.gif", width:45, height:48, title:'ryu'},
    { src:"http://i.imgur.com/Q029MEI.gif", width:62, height:50, title:'dubass'},
    { src:"http://i.imgur.com/IcHOs.gif", width:62, height:50, title:'harahu'},
    { src:"http://i.imgur.com/B6bBva0.gif", width:45, height:45, title:'yoshi'},
    { src:"http://i.imgur.com/F5qdDtE.gif", width:125, height:45, title:'kabi'},
    { src:"http://i.imgur.com/mkoBhqm.gif", width:55, height:65, title:'blue'},
    { src:"http://i.imgur.com/eqmUDB6.gif", width:52, height:50, title:'her'},
    { src:"http://i.imgur.com/6tqguge.gif", width:68, height:50, title:'ff6kappa'},
    { src:"http://i.imgur.com/FBcmjnJ.gif", width:75, height:43, title:'penguin'},
    { src:"http://i.imgur.com/199ZHvl.gif", width:54, height:55, title:'strut'},
    { src:"http://i.imgur.com/ARJzqWc.gif", width:54, height:55, title:'kitty2'},
    { src:"http://i.imgur.com/FSVkUzE.gif", width:54, height:55, title:'chen2'},
    { src:"http://i.imgur.com/MSoQrxX.gif", width:54, height:55, title:'chen3'},
    { src:"http://i.imgur.com/S417M86.gif", width:54, height:55, title:'buttjuice'},
    { src:"http://i.imgur.com/ELQA2fB.gif", width:54, height:55, title:'notabotnet'},
    { src:"http://i.imgur.com/HOdSCiN.gif", width:54, height:55, title:'laughinganime'},
    { src:"http://i.imgur.com/giQjsb3.gif", width:54, height:55, title:'mememe'},
    { src:"http://i.imgur.com/7VcUcYJ.gif", width:54, height:55, title:'duckgif'},
    { src:"http://i.imgur.com/wAVQL4D.gif", width:60, height:47, title:'wop'},
    { src:"http://i.imgur.com/l1jmNIC.gif", width:60, height:47, title:'miku3'},
    { src:"http://i.imgur.com/RgnpAPE.gif", width:45, height:59, title:'ayylien'},
    { src:"http://i.imgur.com/7AyGv1a.gif", width:60, height:74, title:'ayylmao'},
    { src:"http://i.imgur.com/8WGVGYh.gif", width:35, height:59, title:'cyrax'},
    { src:"http://i.imgur.com/XNCKzV8.gif", width:40, height:60, title:'respectfulnod'},
    { src:"http://i.imgur.com/MMdhwkH.gif", width:40, height:60, title:'cry'},
    { src:"http://i.imgur.com/HWYBpFp.gif", width:50, height:60, title:'thom'},
    { src:"http://i.imgur.com/kauEfnn.gif", width:50, height:60, title:'marissa'},
    { src:"http://i.imgur.com/RRPNiqa.gif", width:50, height:60, title:'reimu'},
    { src:"http://i.imgur.com/c2vk6ik.gif", width:50, height:60, title:'mysides2'},
    { src:"http://i.imgur.com/4wunBBM.png", width:60, height:52, title:'slut'},
    { src:"http://i.imgur.com/Gx5wmqn.gif", width:67, height:50, title:'wow2'},
    { src:"http://i.imgur.com/vETtK.png", width:37, height:20, title:'mytinysides'},
    { src:"http://i.imgur.com/nfDwcil.png", width:40, height:56, title:'gookfood'},
    { src:"http://i.imgur.com/WFHNOxP.gif", width:60, height:60, title:'ae86'},
    { src:"http://i.imgur.com/bjnH4nN.gif", width:106, height:66, title:'ritsu'},
    { src:"http://smashboards.com/attachments/salty-duane-gif.34388/", width:60, height:74, title:'saltyduane'},
    { src:"http://s9.postimg.org/7jgdsbfe3/Joey_transparent.png", width:60, height:60, title:'joey'},
    { src:"https://i.areyoucereal.com/HGbLpu.gif", width:33, height:50, title:'snoop2'},
    { src:"http://i.imgur.com/AiqM7ep.gif", width:33, height:50, title:'kakyoin'},
    { src:"http://i.imgur.com/RDP8xDj.gif", width:50, height:60, title:'arthur'},
    { src:"http://i.imgur.com/A57Z837.gif", width:50, height:60, title:'clippy'},
    { src:"http://i.imgur.com/ojyywy4.gif", width:67, height:50, title:'kirino'},
    { src:"http://i.imgur.com/pKXZaQM.gif", width:67, height:50, title:'monkey'},
    { src:"http://i.imgur.com/72wnaaG.png", width:67, height:50, title:'hibiki'},
    { src:"http://i.imgur.com/EOW60AQ.gif", width:60, height:60, title:'sonic2'},
     { src:"http://i.imgur.com/uTUjZpq.png", width:54, height:55, title:'feelsscared'},
    { src:"http://i.imgur.com/9gVht7Y.gif", width:106, height:66, title:'dj'},
     { src:"http://i.imgur.com/K5H6tns.png", width:54, height:55, title:'nonon'},
     { src:"http://i.imgur.com/cCkq4Yb.gif", width:55, height:38, title:'goblinu2'},
     { src:"http://i.imgur.com/0NFfYFq.gif", width:55, height:38, title:'^'},
     { src:"http://i.imgur.com/RpznRYJ.gif", width:40, height:45, title:'yee'},
    { src:"http://i.imgur.com/ZEE0jZF.gif", width:66, height:66, title:'diddy'},
    { src:"http://i.imgur.com/uDUO8Nw.gif", width:57, height:45, title:'freedum'},
    { src:"http://i.imgur.com/NiMJaW6.png", width:25, height:35, title:'kappa'},
    { src:"http://i.imgur.com/yzImse8.png", width:17, height:22, title:'myminisides'},
    { src:"http://i.imgur.com/4wunBBM.png", width:60, height:52, title:'slut'},
    { src:"http://i.imgur.com/e7agwHG.jpg", width:60, height:59, title:'gojira'},
    { src:"http://i.imgur.com/Gx5wmqn.gif", width:67, height:50, title:'wow2'},
    { src:"http://i.imgur.com/eUt9Jdj.png", width:45, height:57, title:'dank'},
    { src:"http://i.imgur.com/sdhMkvZ.png", width:46, height:56, title:'cofe'},
    { src:"http://i.imgur.com/UrrFN9c.gif", width:50, height:61, title:'cia'},
    { src:"http://i.imgur.com/RoQiAtP.png", width:43, height:52, title:'expanddong'},
    { src:"http://i.imgur.com/8WGVGYh.gif", width:35, height:59, title:'cyrax'},
    { src:"http://i.imgur.com/cbQdL4A.png", width:39, height:67, title:'lel5'},
    { src:"http://i.imgur.com/eYfA30K.png", width:49, height:58, title:'heil'},
    { src:"http://i.imgur.com/dBYGKLE.png", width:57, height:57, title:'checkem'},
    { src:"http://i.imgur.com/7AyGv1a.gif", width:60, height:74, title:'ayylmao'},
    { src:"http://i.imgur.com/fNkI3M5.gif", width:40, height:60, title:'gigalien'},
    { src:"http://i.imgur.com/RgnpAPE.gif", width:45, height:59, title:'ayylien'},
    { src:"http://i.imgur.com/jBji5uc.gif", width:43, height:63, title:'alien2'},
    { src:"http://i.imgur.com/nfDwcil.png", width:40, height:56, title:'gookfood'},
    { src:"http://i.imgur.com/1ZAz974.jpg", width:45, height:56, title:'jimmies'},
    { src:"http://i.imgur.com/BeaCBjD.png", width:37, height:39, title:'feek'},
    { src:"http://i.imgur.com/BeaCBjD.png", width:37, height:40, title:'feeksbadman'},
    { src:"http://i.imgur.com/cHKfWEJ.gif", width:68, height:51, title:'4u'},
    { src:"http://i.imgur.com/4zsobUd.png", width:36, height:61, title:'disgusting'},
    { src:"http://i.imgur.com/TvtnuqI.gif", width:70, height:45, title:'yes'},
    { src:"http://i.imgur.com/QZ4qCEE.gif", width:68, height:60, title:'calcium'},
    { src:"http://i.imgur.com/LNkPkIn.png", width:52, height:52, title:'topkek'},
    { src:"http://i.imgur.com/5pDD0HW.gif", width:55, height:55, title:'snab'},
    { src:"http://i.imgur.com/DxlIunk.png", width:60, height:60, title:'sweat'},
    { src:"http://i.imgur.com/EWhvuNJ.png", width:57, height:55, title:'whores'},
    { src:"http://i.imgur.com/qzKaSUr.png", width:36, height:37, title:'333'},
    { src:"http://i.imgur.com/HDCgmfx.jpg", width:30, height:50, title:'ragu'},
    { src:"http://i.imgur.com/b3ex5cx.png", width:42, height:49, title:'pull'},
    { src:"http://i.imgur.com/b3ex5cx.png", width:42, height:49, title:'riptheskin'},
    { src:"http://i.imgur.com/YM5gtsJ.png", width:9, height:18, title:'myfuckingsides'},
    { src:"http://i.imgur.com/oDLeCCu.gif", width:65, height:60, title:'iamthesun'},
    { src:"http://i.imgur.com/GI19OKs.png", width:41, height:45, title:'sanic2'},
    { src:"http://i.imgur.com/GI19OKs.png", width:41, height:45, title:'snoic'},
    { src:"http://i.imgur.com/34vCnqr.gif", width:55, height:60, title:'neat'},
    { src:"http://i.imgur.com/Wwk7Ce2.jpg", width:41, height:45, title:'haruka'},
    { src:"http://i.imgur.com/wAVQL4D.gif", width:60, height:47, title:'wop'},
    { src:"http://i.imgur.com/kXXQOwq.png", width:40, height:56, title:'modabuse'},
    { src:"http://i.imgur.com/1tzp8ao.png", width:37, height:50, title:'moot'},
    { src:"http://i.imgur.com/MkYjmDf.gif", width:60, height:25, title:'( ͡° ͜ʖ ͡°)'},
    { src:"http://i.imgur.com/rmQmFCa.png", width:42, height:40, title:'feelssuicidal'},
    { src:"http://i.imgur.com/zR8xP2G.png", width:39, height:39, title:'feelsmadman'},
    { src:"http://i.imgur.com/zR8xP2G.png", width:39, height:39, title:'feelsmad'},
    { src:"http://i.imgur.com/tIoQzQX.png", width:34, height:45, title:'yuropoor'},
    { src:"http://i.imgur.com/TGHRo8W.gif", width:54, height:50, title:'chen2' },
    { src:"http://i.imgur.com/aXPWln0.png", width:38, height:60, title:'enjoytheanime'},
    { src:"http://i.imgur.com/yxBHAvx.gif", width:38, height:60, title:'kitty2'},
    { src:"http://i.imgur.com/PNB0kE9.gif", width:50, height:50, title:'kitty2'},
    { src:"http://i.imgur.com/MJnWGHV.png", width:52, height:50, title:'neverever'},
    { src:"http://i.imgur.com/Ms3Zxne.png", width:62.5, height:50, title:'gud'},
    { src:"http://i.imgur.com/og9In6D.png", width:48, height:48, title:'feelssmug'},
    { src:"http://i.imgur.com/IADYHCP.png", width:58, height:58, title:'puke'},
    { src:"http://i.imgur.com/QWhYbc8.gif", width:49, height:54, title:'tip'},
    { src:"http://i.imgur.com/VOibACz.png", width:31, height:51, title:'copythat'},
    { src:"http://i.imgur.com/U1Trjzq.gif", width:40, height:40, title:'ree'}
    ];

function addEmotes(){
    for(var i = 0; i < emotes.length; i += 1){
        var parameter = emotes[i];
        window.$codes[parameter.title] = $('<img>', parameter)[0].outerHTML;
        window.$codes[parameter.name] = $('<img>', parameter)[0].outerHTML;
    }
}

function main(){
    var oldOnConnected;
    function onConnected(){
    	oldOnConnected.apply(undefined, arguments);
        addEmotes();
    }
    if (!!window.global){ //old.instasync
        oldOnConnected = window.global.onConnected;
        window.global.onConnected = onConnected;
    }else if(!!window.room){ //InstaSync 2.0
        oldOnConnected = window.room.onConnected;
        window.room.onConnected = onConnected;
    }
}

if (window.document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main, false);
}