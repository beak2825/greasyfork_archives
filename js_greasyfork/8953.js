// ==UserScript==
// @name         bigass
// @namespace    http://use.i.E.your.homepage/
// @version      6.0118
// @description  IDGAF
// @match        http://old.instasync.com/rooms/v4c
// @match        http://old.instasync.com/rooms/movie4chan
// @match        http://old.instasync.com/rooms/bigass
// @grant        none
// @copyright    2015
// @downloadURL https://update.greasyfork.org/scripts/8953/bigass.user.js
// @updateURL https://update.greasyfork.org/scripts/8953/bigass.meta.js
// ==/UserScript==
 
//{ src:"", width:, height:, title:''},
 
var oldOnConnected = window.global.onConnected,
    emotes = [
   
    { src:"http://i.imgur.com/oM9aSr1.png", width:50, height:50, title:'feels8bit'},
    { src:"http://i.imgur.com/TCBYRlX.png", width:65, height:65, title:'feelsanal'},
    { src:"http://i.imgur.com/RM8ptjR.png", width:50, height:60, title:'feelsayy'},
    { src:"http://i.imgur.com/nKKknx8.png", width:55, height:55, title:'feelsbored'},
    { src:"http://i.imgur.com/84BFlcX.png", width:55, height:60, title:'feelscomfy'},
    { src:"http://i.imgur.com/OqnuWp0.png", width:50, height:55, title:'feelscool'},
    { src:"http://i.imgur.com/1rt6eAN.png", width:55, height:55, title:'feelsded'},
    { src:"http://i.imgur.com/3NcoMPl.png", width:50, height:55, title:'feelsevil'},
    { src:"http://i.imgur.com/ZqhaEzQ.png", width:55, height:55, title:'feelsfast'},
    { src:"http://i.imgur.com/Vk15pSl.png", width:55, height:55, title:'feelstired'},
    { src:"http://i.imgur.com/tuxLtau.png", width:55, height:55, title:'feelstakbir'},
    { src:"http://i.imgur.com/YPRwZ0G.png", width:60, height:60, title:'feelssmart'},
    { src:"http://i.imgur.com/WtRZcOB.png", width:55, height:60, title:'feelssexy'},
    { src:"http://i.imgur.com/dBOn6Il.png", width:55, height:60, title:'feelsscared'},
    { src:"http://i.imgur.com/ULe2G8K.png", width:60, height:60, title:'feelsree'},
    { src:"http://i.imgur.com/omIswbL.png", width:50, height:60, title:'feelskek'},
    { src:"http://i.imgur.com/oNhJzmn.png", width:55, height:55, title:'feelskebab'},
    { src:"http://i.imgur.com/C596YRX.png", width:55, height:55, title:'feelskawaii'},
    { src:"http://i.imgur.com/h3N0ylp.png", width:55, height:60, title:'feelsjewish'},
    { src:"http://i.imgur.com/Gz0mhXJ.png", width:55, height:55, title:'feelsthug'},
    { src:"http://i.imgur.com/0wxsePz.png", width:55, height:55, title:'feelsflattered'},
    { src:"http://i.imgur.com/kqUuAcU.png", width:55, height:60, title:'feelsfeel'},
   

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