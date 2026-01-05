// ==UserScript== 
// @grant 
// @name Ajout de smileys pf 
// @namespace Ajout de smileys pf 
// @description Ajout de smileys pfi 
// @include http://www.jeuxvideo.com/* 
// @include http://*.forumjv.com/* 
// @Auteur Guklam (script original http://userscripts-mirror.org/scripts/review/122472.html) 
// @version 0.0.1.20141123080847
// @downloadURL https://update.greasyfork.org/scripts/6591/Ajout%20de%20smileys%20pf.user.js
// @updateURL https://update.greasyfork.org/scripts/6591/Ajout%20de%20smileys%20pf.meta.js
// ==/UserScript==   
var chaine=document.body.innerHTML; 

var reg=new RegExp("()", "g"); 
chaine=chaine.replace(reg,"<img border=0 src='http://image.noelshack.com/fichiers/2014/47/1416501662-pfup-jvshack.gif'>"); 


var reg=new RegExp("()", "g"); 
chaine=chaine.replace(reg,"<img border=0 src='http://image.noelshack.com/fichiers/2014/47/1416501900-pfquestion-jvshack.gif'>"); 


var reg=new RegExp("()", "g"); 
chaine=chaine.replace(reg,"<img border=0 src='http://image.noelshack.com/fichiers/2014/47/1416674671-pfhum.png'>"); 


var reg=new RegExp("()", "g"); 
chaine=chaine.replace(reg,"<img border=0 src='http://image.noelshack.com/fichiers/2014/47/1416676100-pftroll2.png'>"); 


var reg=new RegExp("()", "g"); 
chaine=chaine.replace(reg,"<img border=0 src='http://image.noelshack.com/fichiers/2014/47/1416677064-pfange.png'>"); 


var reg=new RegExp("()", "g"); 
chaine=chaine.replace(reg,"<img border=0 src='http://image.noelshack.com/fichiers/2014/47/1416678775-pfcool.png'>"); 


var reg=new RegExp("()", "g"); 
chaine=chaine.replace(reg,"<img border=0 src='http://image.noelshack.com/fichiers/2014/47/1416678820-pfdiable.png'>"); 


var reg=new RegExp("()", "g"); 
chaine=chaine.replace(reg,"<img border=0 src='http://image.noelshack.com/fichiers/2014/47/1416679815-pfok.png'>"); 


var reg=new RegExp("()", "g"); 
chaine=chaine.replace(reg,"<img border=0 src='http://image.noelshack.com/fichiers/2014/47/1416680710-pfplay.png'>"); 