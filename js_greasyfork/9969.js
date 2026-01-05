// ==UserScript==
// @name Joe's Membean Autoanswer
// @namespace https://www.facebook.com/pages/Membean-Autoanswer/814773558607255
// @version 1
// @description Joe's Membean Hack
// @author Joe
// @match *://membean.com/training_sessions/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/9969/Joe%27s%20Membean%20Autoanswer.user.js
// @updateURL https://update.greasyfork.org/scripts/9969/Joe%27s%20Membean%20Autoanswer.meta.js
// ==/UserScript==
var meta = document.createElement('meta');
meta.httpEquiv = "refresh";
meta.content = "6";
document.getElementsByTagName('head')[0].appendChild(meta);
setTimeout(function(){
if(document.getElementsByClassName("choice answer").length > 0){
    document.getElementsByClassName("choice answer")[0].click();
}

if(document.getElementById("next-btn")){
    document.getElementById("next-btn").click()
}
var choice = Math.floor(Math.random()*100) < 93;
if(choice){
    document.querySelectorAll("input[value=Pass]")[0].click();
}else{
    document.querySelectorAll("input[value=Fail]")[0].click();
}
}, 1000);