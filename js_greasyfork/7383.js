// ==UserScript==
// @name           Elisa Viihde: Add download links to recordings
// @version        3
// @grant          none
// @namespace      ElisaViihdeAddDownloadLinksToRecordings
// @description    Adds download links to the main page on recordings.
// @include        http://elisaviihde.fi/etvrecorder/*
// @downloadURL https://update.greasyfork.org/scripts/7383/Elisa%20Viihde%3A%20Add%20download%20links%20to%20recordings.user.js
// @updateURL https://update.greasyfork.org/scripts/7383/Elisa%20Viihde%3A%20Add%20download%20links%20to%20recordings.meta.js
// ==/UserScript==

function processProgs() {
    var x = 0;
    var dlBaseUrl = "http://elisaviihde.fi/etvrecorder/";  
    var progs = document.getElementsByClassName('programview');
    if(progs.length === 0){ progs = document.getElementsByClassName('recordings_table'); }
    
    for (var p=0; p < progs.length; p++) {
        x++;
        var watch = progs[p].getElementsByClassName('play_btn')[0];
        var progurl = watch.getAttribute('href');
        watch.parentNode.innerHTML += '<a id="downloadLink' + x + '" class="downloadLink" title="Lataa omalle koneelle" href="#">Lataa</a>';
        watchParent = progs[p].getElementsByClassName('play_btn')[0].parentNode;
        
        download = watchParent.parentNode.getElementsByClassName('downloadLink')[0];
        
        download.setAttribute('onclick',
                              'var req=new XMLHttpRequest();req.onreadystatechange=function(){ '+
                              ' if(req.readyState==4 && req.status==200){ '+
                              '  var url=req.responseText.match(/(http\\\:.+stream.+?)\\\"/i); '+
                              // was: '  var url=req.responseText.match(/(http\\\:\\\/\\\/tvmedia.+?)\\\"/i); '+
                              //'  console.log("DL ok: "+url+":"+req.responseText);'+
                              '  if(url){ document.getElementById("downloadLink' + x + '").setAttribute("href",url[1]);'+
                              'window.location=url[1]; }'+
                              ' } else {'+
                              //'  console.log("DL state: "+req.readyState+" "+req.status);'+
                              '}}; '+
                              'req.open("GET","' + dlBaseUrl + progurl + '",true);req.send(null);');
    }
}

processProgs();