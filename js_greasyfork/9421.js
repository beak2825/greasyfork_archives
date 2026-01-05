// ==UserScript==
// @name           Deezer Zap Unlimited 
// @namespace      TFOUZ
// @description    Suppression de la limitation de pouvoir zapper de chanson sur les radios/mix Deezer
// @include        http://*.deezer.*/mixes/*
// @run-at document-start
// @version		   1.1
// @downloadURL https://update.greasyfork.org/scripts/9421/Deezer%20Zap%20Unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/9421/Deezer%20Zap%20Unlimited.meta.js
// ==/UserScript==

window.addEventListener("load", function() {
   var buttonSuivant = document.getElementsByClassName('control control-next')[0];
buttonSuivant.addEventListener("click", function(e) {
    dzPlayer.radioSkipCounter=1;
}, false);
}, true); 