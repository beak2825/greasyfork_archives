// ==UserScript==
// @name         SpankBang Video Downloader
// @namespace    everywhere
// @version      0.2
// @description  download videos from spankbang.com
// @author       ladroop
// @match        https://spankbang.com/*/video/*
// @match        https://spankbang.com/*/playlist/*
// @grant        GM_download
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561972/SpankBang%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/561972/SpankBang%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        var i=0;
        var n=0;
        var videourl=document.getElementById("main_video_player_html5_api").src;
        var select=document.getElementById("quality-menu");
        var options=select.getElementsByTagName("button");
        var resolutions=[];
        for (i = options.length-1; i > 0; i--) {
            if (options[i].id.includes("p")){
                resolutions[n]=options[i].id;
                n++;
            }
        }
        var videourlcut=videourl.split("p.");
        var part1=videourlcut[0].lastIndexOf("-")+1;
        videourlcut[0]=videourlcut[0].slice(0,part1);
        var dlUrl=[];
        for(i=resolutions.length-1;i>=0;i--){
            dlUrl[i]=videourlcut[0]+resolutions[i]+"."+videourlcut[1];
        }
        var insert=document.getElementsByClassName("video_toolbar")[0];
        var newlielem=document.createElement('li');
        newlielem.id="downloading";
        newlielem.innerHTML="Downloading ...";
        newlielem.style.display="none";
        insert.appendChild(newlielem);
        newlielem=document.createElement('li');
        newlielem.id="waiting";
        newlielem.style.display="block";
        var newselelem=document.createElement('select');
        newselelem.addEventListener('change',dlselected);
        newselelem.id="downloadselect";
        newselelem.style.width="100px";
        newselelem.style.color="white";
        newselelem.style.backgroundColor="black";
        var newoptionelem=document.createElement('option');
        newoptionelem.innerHTML="download  ";
        newselelem.appendChild(newoptionelem);
        for(i=resolutions.length-1;i>=0;i--){
            newoptionelem=document.createElement('option');
            newoptionelem.innerHTML=resolutions[i];
            newoptionelem.value=dlUrl[i];
            newselelem.appendChild(newoptionelem);
        }
        newlielem.appendChild(newselelem);
        insert.appendChild(newlielem);
    },2000);

    function dlselected(){
        var downloadurl=document.getElementById("downloadselect").options[document.getElementById("downloadselect").selectedIndex].value;
        var filename=document.location.href.split("/")[5].replaceAll("+", "_")+".mp4";
        document.getElementById("downloading").style.display="block";
        document.getElementById("waiting").style.display="none";
        var download = GM_download({
            url: downloadurl,
            name: filename,
            onload: dlready,
            onerror: dlfail,
        });
    }

    function dlready(){
        document.getElementById("downloading").style.display="none";
        document.getElementById("waiting").style.display="block";
        document.getElementById("downloadselect").selectedIndex=0;
    }
    function dlfail(){
        document.getElementById("downloading").innerHTML="ERROR !";
        setTimeout(function(){
            document.getElementById("downloading").innerHTML="Downloading ...";
            document.getElementById("downloading").style.display="none";
            document.getElementById("waiting").style.display="block";
            document.getElementById("downloadselect").selectedIndex=0;
        },5000);
    }

})();