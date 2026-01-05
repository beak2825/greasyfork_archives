// ==UserScript==
// @name         drs
// @namespace    https://greasyfork.org/en/scripts/8656-drs
// @version      0.04
// @description  shit
// @match        *://instasync.com/r/doris
// @match        *://instasync.com/r/*
// @grant        none
// @copyright    2015
// @downloadURL https://update.greasyfork.org/scripts/8656/drs.user.js
// @updateURL https://update.greasyfork.org/scripts/8656/drs.meta.js
// ==/UserScript==
 
//{ src:"", width:, height:, title:''},
 
var emotes = [
   
    { src:"http://i.imgur.com/TpGoRBc.gif", width:41, height:60, title:'mako'},
    { src:"http://i.imgur.com/0MAPnef.gif", width:40, height:60, title:'mako2'},
    { src:"http://i.imgur.com/qc8OJnz.gif", width:22, height:59, title:'ringu'},
    { src:"http://i.imgur.com/j5qYvW7.gif", width:40, height:60, title:'grey'},
    { src:"http://i.imgur.com/1bm4XYE.gif", width:45, height:60, title:'bunny'},
    { src:"http://i.imgur.com/Fju80o2.gif", width:60, height:60, title:'agabun'},
    { src:"http://i.imgur.com/1kpLloR.gif", width:59, height:50, title:'tokimeki'},
    { src:"http://i.imgur.com/WHJrK5I.gif", width:38, height:45, title:'globe'},
    { src:"http://i.imgur.com/whX0BUA.gif", width:54, height:60, title:'pras'},
    { src:"http://i.imgur.com/2Gj6akh.gif", width:54, height:60, title:'pras2'},
    { src:"http://i.imgur.com/TEy6bux.gif", width:32, height:60, title:'crayons'},
    { src:"http://i.imgur.com/e7tK7x5.gif", width:54, height:50, title:'teli'},
    { src:"http://artfcity.com/wp-content/uploads/2015/06/no-smoking.gif", width:240, height:225, title:'nosmoking'},
    { src:"http://i.imgur.com/ge5JAg4.gif", width:48, height:60, title:'sports'},
    { src:"http://i.imgur.com/ZfIhMXZ.gif", width:50, height:50, title:'overwhelmed'},
    { src:"http://i.imgur.com/7P8wqhq.gif", width:50, height:50, title:'kratzenderhund'},
    { src:"http://i.imgur.com/um7gfY4.gif", width:70, height:70, title:'aquafresh'},
    { src:"http://i.imgur.com/UUdzZT2.gif", width:400, height:482, title:'uuz'},
    { src:"http://i.imgur.com/9qXDiw1.gif", width:169, height:94, title:'adultbaby'},
    { src:"http://i.imgur.com/Q1fFyvO.gif", width:94, height:70, title:'blueshoe'},
    { src:"http://i.imgur.com/YuYIZQS.gif", width:85, height:60, title:'itsagirl'},
    { src:"http://i.imgur.com/GlrTesk.gif", width:50, height:50, title:'buffer'},
    { src:"http://i.imgur.com/zc7zMnj.gif", width:60, height:60, title:'maginfy'},
    { src:"http://i.imgur.com/k55ukK9.gif", width:99, height:60, title:'nakedfeet'},
    
    
   
 
    
   
   
    
    
    
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