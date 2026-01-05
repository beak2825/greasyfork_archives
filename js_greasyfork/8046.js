// ==UserScript==
// @name         Likes to Views ratio
// @description  Adds additional ratio values on YouTube Video Management page.
// @homepageURL  http://greasyfork.org/scripts/8046-likes-to-views-ratio
// @version      0.2
// @date         2015-02-13
// @author       vipaware
// @namespace    https://greasyfork.org/en/users/9103-vipaware
// @include      http://www.youtube.com/my_videos?o=U
// @include      https://www.youtube.com/my_videos?o=U
// @match        http://www.youtube.com/my_videos?o=U
// @match        https://www.youtube.com/my_videos?o=U
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/8046/Likes%20to%20Views%20ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/8046/Likes%20to%20Views%20ratio.meta.js
// ==/UserScript==

(function(){
    "use strict";
   
    function Start() {
        var metrics = document.getElementsByClassName("vm-video-metrics");
        if (metrics.length === 0) {
            setTimeout(Start, 200);
            return;
        }
        
        for (var i = 0; i < metrics.length; i++) {
            var views = Number(metrics[i].getElementsByClassName("video-view-count")[0].innerText.replace(" ", "")); // remove nbsp chars on all three elements
            var likes = Number(metrics[i].getElementsByClassName("video-likes-count")[0].innerText.replace(" ", ""));
            var dislikes = Number(metrics[i].getElementsByClassName("video-dislikes-count")[0].innerText.replace(" ", ""));
            var txt = likes ? Math.round(views / likes) : 0;
            txt += " / ";
            txt += dislikes ? Math.round(likes / dislikes) : 0;
            var txtNode = document.createTextNode(txt);
            var span = document.createElement("span");
            span.appendChild(txtNode);
            span.setAttribute("class", "vm-video-metric-value");
            span.setAttribute("style", "vertical-align: top; margin-left: 5px;");
            metrics[i].getElementsByClassName("video-view-count")[0].getElementsByClassName("yt-uix-tooltip")[0].appendChild(span);
        }
    }
    
    Start();
    
})();