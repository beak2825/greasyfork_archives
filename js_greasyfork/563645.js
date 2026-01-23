// ==UserScript==
// @name         easy downloader camwhores videos
// @namespace    everywhere
// @version      0.02
// @description  easy download camwhores videos
// @author       ladroop
// @match        https://www.camwhores.tv/videos/*
// @copyright 2026, ladroop2 (https://openuserjs.org/users/ladroop2)
// @license MIT
// @grant        GM_download
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563645/easy%20downloader%20camwhores%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/563645/easy%20downloader%20camwhores%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var link="";
    var filename="";
    var dl=false;
    setTimeout(function(){
        if (document.getElementById("kt_player")){
            if(document.getElementById("kt_player").classList.contains("is-error")){return;}
            link= document.getElementById("kt_player").getElementsByTagName("video")[0].src;
            var filename=document.location.href.split("/")[5]+".mp4";
            var linkon=document.getElementsByClassName("tabs-menu")[0].getElementsByTagName("ul")[0];
            var newlielem=document.createElement('li');
            var newaelem=document.createElement('a');
            newaelem.className="toggle-button";
            newaelem.innerHTML="Download";
            newaelem.id="download";
            newaelem.addEventListener('click',function(){downloadit(link,filename);});
            newlielem.appendChild(newaelem);
            linkon.appendChild(newlielem);
        }
    },3000);

    function downloadit(dlurl,name){
        if(dl){return;}
        dl=true;
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
                document.getElementById("download").innerHTML="Saving to disk ..";
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
                    document.getElementById("download").innerHTML="Download ready";
                }
                function dlfail(){
                    document.getElementById("download").innerHTML="ERROR!";
                    setTimeout(function(){
                         document.getElementById("download").innerHTML="Download failed.";
                    },5000);
                }
                function dlfullfail(){
                    document.getElementById("download").innerHTML="File not found !";
                    setTimeout(function(){
                         document.getElementById("download").innerHTML="Download failed";
                    },5000);
                }
            });
    }
    function showProgress(receivedLength,contentLength){
        if (contentLength!=0){
            var percent=(100 * receivedLength / contentLength).toFixed(1);
            document.getElementById("download").innerHTML="Download: "+percent+"%";
        }else{
            document.getElementById("download").innerHTML="Download: "+(receivedLength/1000).toFixed(0)+" Kb";
        }
    }

})();

