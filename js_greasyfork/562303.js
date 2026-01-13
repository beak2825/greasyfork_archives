// ==UserScript==
// @name         xvideos playlist link and download
// @namespace    everywhere
// @version      0.01
// @description  Get the video playlist link and download from xvideos
// @author       ladroop
// @license      MIT 
// @match        https://www.xvideos.com/video.*
// @noframes
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/562303/xvideos%20playlist%20link%20and%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/562303/xvideos%20playlist%20link%20and%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i=0;
    var script="";
    setTimeout(function(){
        var scripts=document.getElementsByTagName("script");
        for(i=0;i < scripts.length;i++) {
            if (scripts[i].innerHTML.includes("hls.m3u8")){
                script=scripts[i].innerHTML;
                break;
            }
        }
        if(script==""){return;}
        var hls=script.split("html5player.setVideoHLS('")[1].split("')")[0];
        var urlLow=script.split("html5player.setVideoUrlLow('")[1].split("')")[0];
        var urlHigh=script.split("html5player.setVideoUrlHigh('")[1].split("')")[0];
        var title=script.split("html5player.setVideoTitle('")[1].split("')")[0].replaceAll(" ", "_")+".mp4";
        var playlists=[];
        var resolutions=[];
        fetch(hls,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200) {
                    return;
                }
                response.text().then(function(playlist){
                    var baseurl=hls.split("hls.m3u8")[0];
                    var playlistparts=playlist.split("#EXT-X-STREAM-INF:");
                    for(i=1;i < playlistparts.length;i++) {
                        resolutions[i-1]=playlistparts[i].split('NAME="')[1].split('"')[0];
                        playlists[i-1]=baseurl+playlistparts[i].slice(playlistparts[i].lastIndexOf('"')+2,playlistparts[i].length);
                    }
                    makeHTML();
                });
            });


        function makeHTML(){
            var linkon=document.getElementById("v-actions-left");
            var newdivelem=document.createElement('div');
            newdivelem.id="result";
            newdivelem.style.margin="12px";
            newdivelem.style.width="200px";
            newdivelem.style.display="none";
            linkon.appendChild(newdivelem);
            newdivelem=document.createElement('div');
            newdivelem.style.display="inline-block";
            newdivelem.style.margin="7px";
            newdivelem.id="select";
            var newselelem=document.createElement('select');
            newselelem.addEventListener('change',dlselected);
            newselelem.id="downloadselect";
            newselelem.style.width="200px";
            newselelem.style.color="white";
            newselelem.style.backgroundColor="black";
            newdivelem.appendChild(newselelem);
            var newoptionelem=document.createElement('option');
            newoptionelem.innerHTML="Download  ";
            newselelem.appendChild(newoptionelem);
            newoptionelem=document.createElement('option');
            newoptionelem.innerHTML="Download  Low 250p";
            newoptionelem.value=urlLow;
            newselelem.appendChild(newoptionelem);
            newoptionelem=document.createElement('option');
            newoptionelem.innerHTML="Download  Medium 360p";
            newoptionelem.value=urlHigh;
            newselelem.appendChild(newoptionelem);
            newoptionelem=document.createElement('option');
            newoptionelem.innerHTML="Copy master playlist";
            newoptionelem.value=hls;
            newselelem.appendChild(newoptionelem);
            for(i=0;i < playlists.length;i++){
                newoptionelem=document.createElement('option');
                newoptionelem.innerHTML="Copy "+resolutions[i]+" playlist";
                newoptionelem.value=playlists[i];
                newselelem.appendChild(newoptionelem);
            }
            linkon.appendChild(newdivelem);
        }

        function dlselected(){
            var downloadurl=document.getElementById("downloadselect").options[document.getElementById("downloadselect").selectedIndex].value;
            if (document.getElementById("downloadselect").selectedIndex > 2){
                navigator.clipboard.writeText(downloadurl);
                document.getElementById("result").innerHTML="Copied to clipboard.";
                document.getElementById("select").style.display="none";
                document.getElementById("result").style.display="inline-block";
                document.getElementById("downloadselect").selectedIndex=0;
                setTimeout(function(){
                    document.getElementById("select").style.display="inline-block";
                    document.getElementById("result").style.display="none";
                },2000);
            }else{
                document.getElementById("result").innerHTML="Downloading...";
                document.getElementById("select").style.display="none";
                document.getElementById("result").style.display="inline-block";
                document.getElementById("downloadselect").selectedIndex=0;
                var download = GM_download({
                    url: downloadurl,
                    name: title,
                    onload: dlready,
                    onerror: dlfail,
                });
            }

            function dlready(){
                document.getElementById("select").style.display="inline-block";
                document.getElementById("result").style.display="none";
            }

            function dlfail(){
                document.getElementById("result").innerHTML="ERROR !";
                setTimeout(function(){
                    document.getElementById("select").style.display="inline-block";
                    document.getElementById("result").style.display="none";
                },5000);
            }
        }
    },2000);
})();