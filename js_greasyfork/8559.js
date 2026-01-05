// ==UserScript==
// @name           Memes
// @description    Provides some additional features, i.a. buttons to thumb and reply.
// @author         posttwo (Post15951)
// @include        *funnyjunk.com/sfw_mod/*
// @version        6.5
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js

// @namespace https://greasyfork.org/users/3806
// @downloadURL https://update.greasyfork.org/scripts/8559/Memes.user.js
// @updateURL https://update.greasyfork.org/scripts/8559/Memes.meta.js
// ==/UserScript==

$(document).ready(function ()
{
    $(document).ready(function() {
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'https://www.ponythread.com/audio/memes.mp3');
		function dork(){
		audioElement.play()
		}
		setInterval(dork, 600000)
    });
});