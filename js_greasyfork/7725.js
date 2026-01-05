// ==UserScript==
// @name           YouTube mp3 download with youtube-mp3.org
// @namespace      Restpeace
// @description    Simply add a "Download Mp3" link to send url to http://www.youtube-mp3.org/it
// @include        http://*youtube.*/*watch*
// @include        https://*youtube.*/*watch*
// @version        1.0
// @author 		   Restpeace
// ==/UserScript==

// ==ChangeLog==
// @history        1.0 Updated headers.
// ==/ChangeLog==

var video=window.location.href;
var newLink = document.createElement("a");
    newLink.setAttribute('href', "http://www.youtube-mp3.org/it?youtube-url="+video);
	newLink.setAttribute('target', "_blank");
 	newLink.innerHTML = 'Mp3 Download';
var b1=document.getElementById("watch8-secondary-actions");
var b2=document.getElementsByClassName("yt-uix-menu")[0];
if(b1){
    b1.appendChild(newLink);
}else{
    b2.appendChild(newLink);
}