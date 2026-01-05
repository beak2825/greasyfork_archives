// ==UserScript==
// @name       abacast lyrics plugin
// @version    0.7
// @description  replaces abacast player cover picture with lyrics from azlyrics.
// @match      http://v6.player.abacast.net/*
// @copyright  2012+, rchudley
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/7990
// @downloadURL https://update.greasyfork.org/scripts/7225/abacast%20lyrics%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/7225/abacast%20lyrics%20plugin.meta.js
// ==/UserScript==

function ArtistAndTrack(track){
    if (!track){
        console.log("track was null");
        track = $(".artist-info-trigger");
    }
    var a= track.data("artist");
    var t = track.data("title");
    console.log("Artist:" + a + " track:" + t);
    if (!a) { a = "smiths";} else { a = unescape(a.toLowerCase());}
    if (!t) {t ="thischarmingman";} else { t= unescape(t.toLowerCase());}
    a = a.replace(/[^a-zA-Z0-9-_]/g, '');
    t = t.replace(/[^a-zA-Z0-9-_]/g, '');
    return {Artist: a.replace(/-/gi,"").replace(/^the/,"").replace(/%20/gi,"").replace(/and/gi,"").toLowerCase(),
            Track: t.replace(/-/gi,"").replace(/%20/gi,"").toLowerCase()
           };
}

function updateLyrics(track){
    var info = ArtistAndTrack(track);
    var url = "http://www.azlyrics.com/lyrics/" + info.Artist + "/" + info.Track + ".html";
    console.log(url);
    if(UrlExists(url)){
        $("#frameLyricsABA").attr("src",url);
        //console.log($("#frameLyricsABA").attr("src"));
    } else {
        console.log("Could not find " + url);
    }
}
//from http://stackoverflow.com/questions/3646914/how-do-i-check-if-file-exists-in-jquery-or-javascript
function UrlExists(url)
{
    
    try{
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        return http.status!=404;
    }catch(e){
        console.log(e);
        return false;
        
    }
}

$(document).ready(function(){

    gPlayer.options.ui.toggleMetadata = "0";
    var area = $(".podcast-art").removeClass("standard-background");
    var ifr = $("<iframe>").attr("id","frameLyricsABA").attr("style","left:450px;height:100%;width:100%").attr("sandbox","allow-forms");
    area.append(ifr);
    setTimeout(updateLyrics,2000);
    $(".current-albumart").hide();
    $(".album-art").hide();
    
    $('.recently-played').on('click',function(e){
        updateLyrics($($(e.target).closest(".artist-info-trigger")[0]));
    });
    
    
    
    
});