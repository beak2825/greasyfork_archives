// ==UserScript==
// @name        YouTube Watch Page Return
// @namespace   http://users.atw.hu/geriboss
// @description Resizes Youtube player to the old, smaller configuration
// @include     https://www.youtube.com/watch*
// @include     http://www.youtube.com/watch*
// @version     1.9
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6404/YouTube%20Watch%20Page%20Return.user.js
// @updateURL https://update.greasyfork.org/scripts/6404/YouTube%20Watch%20Page%20Return.meta.js
// ==/UserScript==

//For more information about this script, visit https://github.com/GeriBoss/youtube_smaller
// or watch the tutorial video: https://www.youtube.com/watch?v=jJus7CQvfqc

runScript();

//Chrome (or Tampermonkey) has a bug which prevents the script from running properly.
//This code checks for the bug every half a second and corrects it
setInterval(function(){
	if (document.getElementById('watch7-content').style.width != '640px')
       runScript();
}, 500);

function runScript(){
    
    document.getElementById('player').style.width = '1040px';
    
    document.getElementById('watch7-content').style.width = '640px';
    document.getElementById('content').style.maxWidth = '1040px';
    
    document.getElementById('watch7-sidebar').style.top = '0px';
    document.getElementById('watch7-sidebar').style.marginLeft = '640px';
    
    document.getElementById('watch7-sidebar-contents').style.minHeight = '390px';
    
    var i, nodes = document.getElementsByClassName('action-panel-content');
    for (i = 0; i < nodes.length; i++)
        nodes[i].style.width = '600px';
    
    nodes = document.getElementsByClassName('player-width');
    for (i = 0; i < nodes.length; i++)
        nodes[i].style.width = '640px';
    
    nodes = document.getElementsByClassName('player-height');
    for (i = 0; i < nodes.length; i++)
        nodes[i].style.height = '390px';
    
    document.getElementById('theater-background').style.height = '520px';
    
    nodes = document.getElementsByClassName('watch-playlist');
    for (i = 0; i < nodes.length; i++)
        nodes[i].style.minHeight = '390px';
    
    nodes = document.getElementsByClassName('playlist-videos-list');
    for (i = 0; i < nodes.length; i++)
        nodes[i].style.maxHeight = '290px';
    
}

window.addEventListener("popstate",function(e){
	JS();
});
function JS(){
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.textContent = 'document.createElement("video").constructor.prototype.canPlayType = function(type){return ""}';
	document.documentElement.appendChild(script);
}
JS();