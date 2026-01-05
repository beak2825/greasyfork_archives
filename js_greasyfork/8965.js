// ==UserScript==
// @name YouTube Two Best Friends Play Skip Intro
// @namespace YTBFPSI
// @description Skips the first 7 second intro of any Two Best Friends Play videos.
// @version 10.30.15.0415
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @include https://www.youtube.com/watch*
// @exclude http://www.youtube.com/*&t=0m7s*
// @exclude https://www.youtube.com/*&t=0m7s*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author drhouse
// @downloadURL https://update.greasyfork.org/scripts/8965/YouTube%20Two%20Best%20Friends%20Play%20Skip%20Intro.user.js
// @updateURL https://update.greasyfork.org/scripts/8965/YouTube%20Two%20Best%20Friends%20Play%20Skip%20Intro.meta.js
// ==/UserScript==

$(document).ready(function () {

	$("a").removeClass("spf-link").not("#watch-appbar-playlist");

        var theurl = document.URL;

        if (document.title.toString().indexOf("Best Friends") != -1)
            window.location.href = (theurl + "&t=0m7s");

})