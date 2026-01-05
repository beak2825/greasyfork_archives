// ==UserScript==
// @name         Pause all HTML5 videos on load
// @author       Scuzzball
// @namespace    http://userscripts.org/users/Scuzzball
// @description  Pause autoplaying HTML5 videos on load. In Firefox just go into about:config and look for media.autoplay.enabled and set to false.
// @version      1
// @include      *
// @downloadURL https://update.greasyfork.org/scripts/6487/Pause%20all%20HTML5%20videos%20on%20load.user.js
// @updateURL https://update.greasyfork.org/scripts/6487/Pause%20all%20HTML5%20videos%20on%20load.meta.js
// ==/UserScript==

var videos = document.getElementsByTagName('video');
window.addEventListener('load', stopVideo, false);
function stopVideo()
{
    for (var i=0; i<videos.length; i++)
    {
        videos[i].pause();
        video.currentTime = 0;
    }
}