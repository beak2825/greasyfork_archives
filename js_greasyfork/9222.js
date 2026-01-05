// ==UserScript==
// @name         InstaEmotes
// @namespace    http://use.i.E.your.homepage
// @version      1.0.5.3
// @description  Dank emotes for you to love
// @grant        none
// @copyright    2015
// @include     *://*.instasynch.com/*
// @include     *://instasynch.com/*
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @downloadURL https://update.greasyfork.org/scripts/9222/InstaEmotes.user.js
// @updateURL https://update.greasyfork.org/scripts/9222/InstaEmotes.meta.js
// ==/UserScript==

//THANK YOU BIGGLES-SAN FOR YOUR HALP

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},


var emotes = [
    { src:"http://i.imgur.com/RpznRYJ.gif", width:40, height:45, title:'yee'},
    { src:"http://i.imgur.com/niahcKl.gif", width:45, height:35, title:'eey'},
    { src:"http://i.imgur.com/uDUO8Nw.gif", width:57, height:45, title:'freedum'},
    { src:"http://i.imgur.com/NiMJaW6.png", width:25, height:35, title:'kappa'},
    { src:"http://i.imgur.com/yzImse8.png", width:17, height:22, title:'myminisides'},
    { src:"http://i.imgur.com/4wunBBM.png", width:60, height:52, title:'slut'},
    { src:"http://i.imgur.com/e7agwHG.jpg", width:60, height:59, title:'gojira'},
    { src:"http://i.imgur.com/f1ECbQw.png", width:52, height:54, title:'(^:'},
    { src:"http://i.imgur.com/f1ECbQw.png", width:52, height:54, title:':^)'},
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
    { src:"http://i.imgur.com/cHKfWEJ.gif", width:68, height:51, title:'bane'},
    { src:"http://i.imgur.com/LNkPkIn.png", width:52, height:52, title:'topkek'},
    { src:"http://i.imgur.com/5pDD0HW.gif", width:55, height:55, title:'snab'},
    { src:"http://i.imgur.com/DxlIunk.png", width:60, height:60, title:'sweat'},
    { src:"http://i.imgur.com/EWhvuNJ.png", width:57, height:55, title:'whores'},
    { src:"http://i.imgur.com/qzKaSUr.png", width:36, height:37, title:'333'},
    { src:"http://i.imgur.com/HDCgmfx.jpg", width:30, height:50, title:'ragu'},
    { src:"http://i.imgur.com/Ui0i5FW.jpg", width:27, height:52, title:'v8'},
    { src:"http://i.imgur.com/b3ex5cx.png", width:42, height:49, title:'pull'},
    { src:"http://i.imgur.com/b3ex5cx.png", width:42, height:49, title:'riptheskin'},
    { src:"http://i.imgur.com/YM5gtsJ.png", width:99, height:118, title:'myfuckingsides'},
    { src:"http://i.imgur.com/oDLeCCu.gif", width:65, height:60, title:'iamthesun'},
    { src:"http://i.imgur.com/GI19OKs.png", width:41, height:45, title:'sanic2'},
    { src:"http://i.imgur.com/GI19OKs.png", width:41, height:45, title:'snoic'},
    { src:"http://i.imgur.com/reWV3gI.jpg", width:55, height:60, title:'lewd'},
    { src:"http://i.imgur.com/Wwk7Ce2.jpg", width:41, height:45, title:'haruka'},
    { src:"http://i.imgur.com/wAVQL4D.gif", width:60, height:47, title:'wop'},
    { src:"http://i.imgur.com/kXXQOwq.png", width:40, height:56, title:'modabuse'},
    { src:"http://i.imgur.com/1tzp8ao.png", width:37, height:50, title:'moot'},
    { src:"http://i.imgur.com/MkYjmDf.gif", width:60, height:25, title:'( ͡° ͜ʖ ͡°)'},
    { src:"http://i.imgur.com/rmQmFCa.png", width:42, height:40, title:'feelssuicidal'},
    { src:"http://i.imgur.com/zR8xP2G.png", width:39, height:39, title:'feelsmadman'},
    { src:"http://i.imgur.com/zR8xP2G.png", width:39, height:39, title:'feelsmad'},
    { src:"http://i.imgur.com/U1Trjzq.gif", width:45, height:45, title:'ree'},
    { src:"http://i.imgur.com/tIoQzQX.png", width:34, height:45, title:'yuropoor'}
    ];

function addEmotes(){
    for(var i = 0; i < emotes.length; i += 1){
        var parameter = emotes[i];
        window.$codes[parameter.title] = $('<img>', parameter)[0].outerHTML;
        window.$codes[parameter.name] = $('<img>', parameter)[0].outerHTML;
    }
}

 function main(){
    addEmotes();
}

if (window.document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main, false);
}