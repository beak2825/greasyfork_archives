// ==UserScript==
// @name         YouTube Download Buttons
// @namespace    KFbAxoUi3JYvSv03diI2
// @author       LemonIllusion
// @version      1.2
// @match        https://www.youtube.com/watch?*
// @match        http://www.youtube.com/watch?*
// @description  Inserts download buttons on youtube videos
// @downloadURL https://update.greasyfork.org/scripts/9275/YouTube%20Download%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/9275/YouTube%20Download%20Buttons.meta.js
// ==/UserScript==

var videoID = window.location.href.split("v=")[1];
var fancyDownloadsDiv = document.createElement("div");
fancyDownloadsDiv.className = "yt-card yt-card-has-padding";
fancyDownloadsDiv.setAttribute("style", "overflow:auto;margin-top:0");
fancyDownloadsDiv.innerHTML = '<div style="text-align:center;margin:0;padding:0;font-size:24px">Nedladdningar</div>\
<a target="_blank" href="http://dirpy.com/studio?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D'+videoID+'">\
<img src="https://i.imgur.com/DzKiXL5.png" style="float:left;width:50%" />\
</a><a target="_blank" href="http://9xbuddy.com/download?url=http://www.youtube.com/watch?v='+videoID+'">\
<img src="https://i.imgur.com/kfCp5wW.png" style="float:left;width:50%" />\
</a>';
document.getElementById("watch7-sidebar").insertBefore(fancyDownloadsDiv, document.getElementById("watch7-sidebar-contents"));