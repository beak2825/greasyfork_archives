// ==UserScript==
// @name        Happash
// @namespace   http://www.jeuxvideo.com/forums/*
// @description Bot de flood
// @include     http://www.jeuxvideo.com/forums/0-*-0-1-0-1-0-*.htm
// @include     http://*.forumjv.com/0-*-0-1-0-1-0-0.htm
// @version     1.3
// @downloadURL https://update.greasyfork.org/scripts/5887/Happash.user.js
// @updateURL https://update.greasyfork.org/scripts/5887/Happash.meta.js
// ==/UserScript==

var title = "mon topic";     // Titre du topic
var body = "mon message";     // Message du topic
var sec = 61;     // Nombre de miliseconde entre chaque topic (1000 miliseconde = 1 seconde) par défaut: 60 seconde

function posteTopic()       // Après msec miliseconde, on crée un topic et on fait une redirection vers le fofo courant
{   
    setTimeout(function() {
        var sujet = document.getElementById("newsujet");
        sujet.value = title;
        
        var message = document.getElementById("newmessage");
        message.value = body;
        
        var bouton = document.getElementById("bouton_post");
        bouton.click();
    }, 1000 * sec);
}

posteTopic();
