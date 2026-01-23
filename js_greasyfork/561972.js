// ==UserScript==
// @name         SpankBang Video Downloader
// @namespace    everywhere
// @version      0.3
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
        downloadit(downloadurl,filename);
    }

    function downloadit(dlurl,name){
        fetch(dlurl,{ credentials: "same-origin"}).then(
            async function(response) {
                if (response.status !== 200) {
                    dlfullfail();
                    return;
                }
                var contentLength = response.headers.get('Content-Length');
                if (!contentLength){contentLength = 0;}
                var receivedLength = 0;
                var chunks = [];
                var reader = response.body.getReader();
                for (;;) {
                    const {done, value} = await reader.read();
                    if (done) {
                        break;
                    }
                    chunks.push(value);
                    receivedLength += value.length;
                    showProgress(receivedLength,contentLength);
                }
                document.getElementById("downloading").innerHTML="Saving to disk ..";
                var blob = new Blob(chunks);
                var url = URL.createObjectURL(blob);
                GM_download({// GM will save without confirmation
                    url: url,
                    name: name,
                    onload: dlready,
                    onerror: dlfail,
                });
                function dlready(){
                    URL.revokeObjectURL(url);
                    blob="";
                    chunks=[];
                    document.getElementById("downloading").style.display="none";
                    document.getElementById("waiting").style.display="block";
                    document.getElementById("downloadselect").selectedIndex=0;
                }
                function dlfail(){
                    document.getElementById("downloading").innerHTML="ERROR !";
                    setTimeout(function(){
                        dlready();
                    },5000);
                }
                function dlfullfail(){
                    document.getElementById("downloading").innerHTML="File not found !";
                    setTimeout(function(){
                        document.getElementById("downloading").style.display="none";
                        document.getElementById("waiting").style.display="block";
                        document.getElementById("downloadselect").selectedIndex=0;
                    },5000);
                }
            });
    }
    function showProgress(receivedLength,contentLength){
        if (contentLength!=0){
            var percent=(100 * receivedLength / contentLength).toFixed(1);
            document.getElementById("downloading").innerHTML="Downloading: "+percent+"%";
        }else{
            document.getElementById("downloading").innerHTML="Download: "+(receivedLength/1000).toFixed(0)+" Kb";
        }
    }

})();