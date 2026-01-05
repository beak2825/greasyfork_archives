// ==UserScript==
// @name        GM Last.fm Scrobbler for Pakartot.lt
// @namespace   Rimantas Galvonas
// @description Last.fm scrobbler for Pakartot.lt music streaming service.
// @include     https://www.pakartot.lt/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require https://greasyfork.org/scripts/130-portable-md5-function/code/Portable%20MD5%20Function.js?version=10066
// @version     1.13
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8398/GM%20Lastfm%20Scrobbler%20for%20Pakartotlt.user.js
// @updateURL https://update.greasyfork.org/scripts/8398/GM%20Lastfm%20Scrobbler%20for%20Pakartotlt.meta.js
// ==/UserScript==
jQuery("#header").append("<div id='scrobblerdiv' style='position:absolute; right:20px; top:20px; z-index:1000'><div id='togglescrobbling' style='width:20px; height:20px; border-radius:10px; border: 1px solid black; background-color:rgb(43, 177, 43); line-height:20px; text-align:center;'></div></div>");


started = false;
playingflag = false;
scrobbledflag = false;
scrobblingenabled = '';
elapsed = 0;
startedplaying = '';
checkScrobblingCookie();

tick();

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}     

function authentication()
{

  if (!$.cookie('pakartotscrobblerlastfmkey') && !$.cookie('gettingsessionkey')) {
    $.cookie('gettingsessionkey', 'true');

    window.location.replace("http://www.last.fm/api/auth/?api_key=f2a62c02742b52b2348e91ccb592c2fd&cb="+window.location.href);
  }

  if (!$.cookie('pakartotscrobblerlastfmkey') && $.cookie('gettingsessionkey')) {
    token = getUrlParameter('token');

    signing=hex_md5('api_keyf2a62c02742b52b2348e91ccb592c2fdmethodauth.getSessiontoken'+token+'54643ba2e62c2db46469da26d7e1d268')+'';

    $.get("https://ws.audioscrobbler.com/2.0/?method=auth.getSession&token="+token+"&api_key=f2a62c02742b52b2348e91ccb592c2fd&api_sig="+signing, function( data )
    {
      $xml = $(data)
      key = $xml.find('key').text();
      $.cookie('pakartotscrobblerlastfmkey', key, { expires: 10000, path: '/', domain: '.pakartot.lt'});
      $.removeCookie('gettingsessionkey');
    });
  }
}

jQuery("#togglescrobbling").click(function()
{
  if (scrobblingenabled == 1) {
    toggleScrobbling(0);
  } else {
    toggleScrobbling(1);
  }
});

jQuery(".jp-pause").click(function()
{
  playingflag = false;
});


function startthething()
{
  info = gettrackdata();
  
  console.log(info["artist"]);
  console.log(info["track"]);
  console.log(info["duration"]);
  updatenowplaying();
  startedplaying = Math.round(+new Date()/1000);
}

function toggleScrobbling(bool)
{
  if (bool == 1) {    
    jQuery("#togglescrobbling").css('background-color','rgb(43, 177, 43)');
  } else {
    jQuery("#togglescrobbling").css('background-color','rgb(180, 180, 180)');
  }
  scrobblingenabled = bool;
  $.cookie('pakartotscrobblerenabled', bool, { expires: 10000, path: '/', domain: '.pakartot.lt'});
}

function checkScrobblingCookie()
{
  if (!$.cookie('pakartotscrobblerenabled')) {
   $.cookie('pakartotscrobblerenabled', 1, { expires: 10000, path: '/', domain: '.pakartot.lt'});
   toggleScrobbling(1);
   return 1;
  } else {
    toggleScrobbling($.cookie('pakartotscrobblerenabled'));
    return $.cookie('pakartotscrobblerenabled');
  }
}

function gettrackdata()
{
  track = jQuery(".jp-player-title a").html().trim();
  artist = jQuery(".jp-player-artist a").html().trim(); //trim nes kažkodėl prieky tarpas būna, lolwut
  duration = jQuery(".jp-duration").html();
  
  tt=duration.split(":");
  sec=tt[0]*60+tt[1]*1;
  
  result = [];
  result["track"] = track;
  result["artist"] = artist;
  result["duration"] = sec;
  
  return result;
}

function updatenowplaying()
{
  signing=hex_md5('api_keyf2a62c02742b52b2348e91ccb592c2fdartist'+info["artist"]+'methodtrack.updateNowPlayingsk'+$.cookie('pakartotscrobblerlastfmkey')+'track'+info["track"]+'54643ba2e62c2db46469da26d7e1d268')+'';
  
  $.ajax(
  {
    type : 'POST',
    url : 'https://ws.audioscrobbler.com/2.0/',
    data : 'method=track.updateNowPlaying' +
           '&artist='+info["artist"]+
           '&track='+info["track"]+
           '&api_key=f2a62c02742b52b2348e91ccb592c2fd'+
           '&sk='+$.cookie('pakartotscrobblerlastfmkey')+
           '&api_sig='+signing,
    success : function(data) {
        //console.log("Now playing updated.");
    },
    error : function(code, message){
        console.log("Now playing update failed.");
        //console.log(code);
        xmlDoc = jQuery.parseXML(code['responseText']);
        $xml = $(xmlDoc);
        errorcode = $xml.find('error').attr('code');
        console.log(errorcode);
      
        if (errorcode==9) {
          $.removeCookie('pakartotscrobblerlastfmkey', {path: '/', domain: '.pakartot.lt'});
          authentication();
        }
    }
  });
}


function scrobble()
{
  signing=hex_md5('api_keyf2a62c02742b52b2348e91ccb592c2fdartist'+info["artist"]+'methodtrack.scrobblesk'+$.cookie('pakartotscrobblerlastfmkey')+'timestamp'+startedplaying+'track'+info["track"]+'54643ba2e62c2db46469da26d7e1d268')+'';
  
  $.ajax(
  {
    type : 'POST',
    url : 'https://ws.audioscrobbler.com/2.0/',
    data : 'method=track.scrobble' +
           '&artist='+info["artist"]+
           '&track='+info["track"]+
           '&timestamp='+startedplaying+
           '&api_key=f2a62c02742b52b2348e91ccb592c2fd'+
           '&sk='+$.cookie('pakartotscrobblerlastfmkey')+
           '&api_sig='+signing,
    success : function(data) {
        console.log("Scrobbled.");
        jQuery('#togglescrobbling').html('&#10004;').attr('title', 'Scrobbled');
    },
    error : function(code, message){
        console.log("Scrobbling failed.");
        jQuery('#togglescrobbling').html('&#10007;').attr('title', 'Scrobbling failed');
    }
  });
}

function tick()
{
  window.setInterval(function()
  {
    if (started == false && jQuery('.jp-pause').css('display') == 'block') {
      startthething();
      started = true;
    }
       
    if (jQuery('.jp-play').css('display') == 'none' && jQuery('.jp-pause').css('display') == 'block') {
      playingflag=true;
    } else {
      playingflag=false;
    }
    
    if (playingflag==true) {
      elapsed++;
    }
   
    if (info["duration"] > 30 && (elapsed > (info['duration']/2) || elapsed > 240) && scrobbledflag == false && scrobblingenabled == 1) {
      scrobble();
      scrobbledflag = true;
    }
    
    info_last = gettrackdata();
    
    if (info_last["track"] != info["track"] || info_last["artist"] != info["artist"] || info_last["duration"] != info["duration"]) {
      info = info_last;
      scrobbledflag = false;
      jQuery('#togglescrobbling').html('').removeAttr('title');
      elapsed = 0;
      updatenowplaying();
      startedplaying = Math.round(+new Date()/1000);
    }
  }, 1000);
}