// ==UserScript==
// @name Stream URL grabber
// @description Adds a button that gives you a .m3u8 file for a stream on Twitch or Hitbox.
// @include *://twitch.tv/*
// @include *.twitch.tv/*
// @include *://player.twitch.tv/*
// @include *://www.player.twitch.tv/*
// @include *://www.hitbox.tv/*
// @include	*://api.twitch.tv/*?grabber
// @include	*://api.twitch.tv/*&grabber
// @namespace https://greasyfork.org/users/3167
// @run-at      document-ready
// @grant none
// @version 19.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/8114/Stream%20URL%20grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/8114/Stream%20URL%20grabber.meta.js
// ==/UserScript==

// NOTE: hls.js was previously used in this script and greasyfork now denies its use in script, so this is broken now, and i dont know if i will fix this
// hls.js npm source: https://cdn.jsdelivr.net/npm/hls.js@latest

if (window.top != window.self) {
  //don't run on frames or iframes
    console.log("Skipping frame/iframe...");
    return;
}

var maxretries = 60;
var debug = false;

var host = window.location.host;

function downloadString(text, fileType, fileName) {
  var blob = new Blob([text], { type: fileType });

  var a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
}

function savem3u8(str, filename) {
  var sources = parsem3u8(str);
  
  var str = "#EXTM3U\n";
  
  for (var i=0; i<sources.length; i++) {
    var source = sources[i];

    str += "#EXTINF:123," + source.quality + "\n"
    str += source.source + "\n";
  }

  downloadString(str, "m3u8", filename);

}


function parsem3u8(str) {
    console.log("parsem3u8");
  var sources = [];
  
  var playlist = str.split("#EXT-X-MEDIA");
  if (playlist.length>1) {

    for (var i=1; i<playlist.length; i++) {
      var entity = playlist[i];
      var rows = entity.split("\n");


      var quality = rows[0].split('NAME="')[1].split('"')[0];
      
      var stream = rows[2];
      
      var source = {quality: quality, source: stream};
      sources.push(source);
    }

  }
  return sources;
}

function loadm3u8(link, cb) {
    console.log("loadm3u8");
    var blob = null;
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", link); 
    xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
    xhr.onload = function() 
    {
        var reader = new FileReader();
        reader.onload = function(event) {
          var str = event.target.result;
          cb(str);
        };

        blob = xhr.response;//xhr.response is now a blob object
        reader.readAsText(blob);
    }
    xhr.send();
}

function playm3u8(link) {
    console.log("playm3u8");
  var html5Player = document.getElementById('html5player');

  if(Hls.isSupported()) {

    var config = {
      liveDurationInfinity: false, // true for streams
      initialLiveManifestSize: 3,
      liveSyncDurationCount: 10 // Buffer x fragments before playback
    };

    var hls = new Hls(config);
    hls.loadSource(link);
    hls.attachMedia(html5Player);
    hls.on(Hls.Events.MANIFEST_PARSED,function() {
      html5Player.play();
    });
  }
  else if (html5Player.canPlayType('application/vnd.apple.mpegurl')) {
    html5Player.src = link;
    html5Player.addEventListener('loadedmetadata',function() {
      html5Player.play();
    });
  }
}



function generateM3U8Link(data) {
  console.log("Generating M3U8 url");
  var json = data;
  var user;

  var token = json['token'] || '';
  var signature = json['sig'] || '';

  if (token && token!='') {
    var tokenjson = JSON.parse(decodeURI(token));
    if (tokenjson) {
      user = tokenjson['channel'] || user;
    }

  }

  var randomp = Math.round(Math.random() * 9999999);

  var url = location.protocol + '//usher.ttvnw.net/api/channel/hls/' + user + '.m3u8?player=twitchweb&token=' + token + '&sig=' + signature + '&allow_audio_only=true&allow_source=true&type=any&p=' + randomp;

  //console.log("Encoding url...");
  var urle = encodeURI(url);
  if (debug) {
    console.log("Streamgrabber: generated m3u8 url: " + urle);
  }
  
  return urle;
}
 

function replaceplayer(m3u8, username) {
  console.log("Replacing Twitch player with HTML5 player...");
  
  var mainPlayer = null;
  var videoPlayer = document.getElementsByTagName('video')[0];
  if (videoPlayer) {
    videoPlayer.pause();
    
    mainPlayer = videoPlayer.parentElement;
  }

  if (!mainPlayer) {
    mainPlayer = document.getElementsByClassName('video-player__container')[0];
  }
  if (!mainPlayer) {
    mainPlayer = document.getElementsByClassName('video-player')[0];
  }
  //document.getElementsByClassName('player')[0]
  //
 
  // Delete the original video player, don't let it buffer in background.

  //document.getElementsByTagName('video')[0].src = "";
  mainPlayer.innerHTML = "";


  //var html = '<div id="wrap_video"><div id="video_box" style="float:left; width: 100%; height: 100%;"><div id="video_overlay" style="text-align: center; position:absolute; float:left; z-index:10; width: 100%;"></div><div><video id="html5player" style="width:100%; max-height:100vh;" controls></video></div></div></div></div>';
  var html = '<video id="html5player" style="width:100%; max-height:100%;" controls></video>';
  mainPlayer.innerHTML = html;
  mainPlayer.style.margin = "0px";
  
 
  var overlay = document.getElementById('video_overlay');
  var filename = username + '.m3u8';
 
  
  var grabber = document.getElementById("grabber");
  
  var sources = parsem3u8(m3u8);
  
  var controlbar = grabber.parentNode;

  var downloadLink = document.createElement("button");
  downloadLink.innerHTML = '<span class="tw-button-icon__icon" style="cursor:pointer;">Download</span>';
  downloadLink.classList.add('tw-mg-x-1');
  downloadLink.classList.add('tw-button');
  downloadLink.classList.add('tw-button--hollow');
  
  downloadLink.onclick = function (event) {
    savem3u8(m3u8, filename);
  };
  controlbar.appendChild(downloadLink);
  
  
  
  var selector = document.createElement("select");
  //newspan.innerHTML = '<button class="tw-button tw-button--hollow"><span class="tw-button-icon__icon" style="cursor:pointer;">Grabber</span></button>';
  //var selectorhtml = '<span class="tw-button-icon__icon" style="cursor:pointer;">';
  var selectorhtml = ""; 
  for (var i=0; i<sources.length; i++) {
    var source = sources[i];
    selectorhtml += '<option value="' + source.source + '">' + source.quality + '</option>';
  }
  //selectorhtml += '</span></select>';
  selector.innerHTML = selectorhtml;
  //tw-interactable
  selector.classList.add('tw-button');
  selector.classList.add('tw-button--hollow');
  selector.id = "selector";
  selector.onchange = function (event) {
    //console.log("switching stream to: " + event.target.value);
    playm3u8(event.target.value);
  }
  controlbar.appendChild(selector);
  
  if (typeof init_videowrapper != "undefined") {
      init_videowrapper();
  }
  
  grabber.hidden = true;
  if (sources[0]) {
    playm3u8(sources[0].source);
  }
  
}


function loadgrabber(tokenurl, username)
{

    var request = new XMLHttpRequest();
    request.open('GET', tokenurl, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        // Success!
        var data = JSON.parse(request.responseText);

        var m3u8link = generateM3U8Link(data);

        //var urle = encodeURI(m3u8link);
        console.log(m3u8link);

        loadm3u8(m3u8link, function(m3u8) {

          replaceplayer(m3u8, username);

        }); 

      } else {
        // We reached our target server, but it returned an error
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send();
}


if (document.URL.split("grabber").length > 1) {
  console.log("Grab command detected...");
    if (host == "api.twitch.tv" || host == "www.api.twitch.tv") {
        //var text = document.body.textContent;
        var text = document.body.innerText;
      	if (document.body.children.length>0) {
          	text = document.body.children[0].innerText;
        }
      	
        
        var json = JSON.parse(text);
        var user = document.URL.split("api.twitch.tv/api/channels/")[1].split("/")[0].split("#")[0];

        var token = json['token'] || '';
        var signature = json['sig'] || '';

        if (token && token!='') {
          var tokenjson = JSON.parse(decodeURI(token));
          if (tokenjson) {
            user = tokenjson['channel'] || user;
          }
          
        }

        var randomp = Math.round(Math.random() * 9999999);

        var url = location.protocol + '//usher.ttvnw.net/api/channel/hls/' + user + '.m3u8?player=twitchweb&token=' + token + '&sig=' + signature + '&allow_audio_only=true&allow_source=true&type=any&p=' + randomp;

        if (debug) {
          console.log("Encoding url...");
        }
        
        var urle = encodeURI(url);
        if (debug) {
          console.log(urle);
        }
        
        
        loadm3u8(urle, function(m3u8) {
          handlem3u8(m3u8, user);
 
        });    
        if (debug) {
          console.log("Streamgrabber: stream grabbed on: " + host);
        }
    }
    //return;
    //

} else {
    
    var hook = function(retries) {
        
        var loaded = document.getElementById("grabber");

        if (retries > 0 && !loaded) {
            retries--;
          
          if (debug) {
            console.log("Streamgrabber: hook retries: " + retries);
          }

            if (host.split("twitch.tv").length > 1) {
                var div = document.querySelectorAll('.channel-actions')[0];
              
              
                if (div == null) {
                    div = document.querySelectorAll('.channel-info-bar__action-container')[0];
                    if (div) {
                        div = div.children[0];
                    }
                }
              
                if (div == null) {
                    div = document.querySelectorAll('.cn-metabar__more')[0];
                }
              
              if (div == null) {
                    div = document.querySelectorAll('.channel-header__right')[0];
                }


                if (div == null) {
                    setTimeout(function() {
                        hook(retries);
                    }, 1000);
                    return;
                }
                else
                 {
                   //do
                  var username = document.URL.split("twitch.tv/")[1].split("/")[0];

                  var clientid = "rp5xf0lwwskmtt1nyuee68mgd0hthrw";
                  var url = location.protocol + '//api.twitch.tv/api/channels/' + username + '/access_token?client_id=' + clientid + '&grabber';
                  //var url = 'http://api.twitch.tv/api/channels/' + user + '/access_token?client_id=' + clientid + '&grabber';

                  var isvideo = document.URL.split("/v/")[1];
                  if (isvideo != undefined) {
                      url = location.protocol + '//player.twitch.tv/?!branding&!channelInfo&video=v' + isvideo + '&client_id=' + clientid + '&grabber';
                      //url = 'http://player.twitch.tv/?!branding&!channelInfo&video=v' + isvideo + '&client_id=' + clientid + '&grabber';
                  }

                  var newspan = document.createElement("span");
                   
                  
                  newspan.innerHTML = '<button class="tw-button tw-button--hollow"><span class="tw-button-icon__icon" style="cursor:pointer;">Grabber</span></button>';

                  newspan.classList.add('tw-mg-x-1');
                  newspan.id = "grabber";
                  
                  div.appendChild(newspan);
                   
                  newspan.onclick = function (event) {
                    loadgrabber(url, username);
                  };

                  console.log("Streamgrabber: loaded on: " + host);
                 }
                
            }

            if (host == "www.hitbox.tv") {
                var div = document.querySelectorAll('.status')[0];
                if (div == null) {
                    setTimeout(function() {
                        hook(retries);
                    }, 1000);
                    return
                }
                else
                {
                  //do
                  var user = document.URL.split("hitbox.tv/")[1].split("/")[0];

                  var url = location.protocol + '//api.hitbox.tv/player/hls/' + user + '.m3u8';

                  var newspan = document.createElement("span");
                  newspan.innerHTML = '<span style="cursor:pointer;">Grabber</span>';
                  newspan.id = "grabber";
                  div.appendChild(newspan);
                  
                  newspan.onclick = function (event) {
                      window.open(url);
                  };

                  console.log("Streamgrabber: " + url);
                  
                  console.log("Streamgrabber: loaded on: " + host);
                }
                
            }
        }
      

          
        

        if (loaded) {
          if (debug) {
            console.log("Streamgrabber: already hooked");
          }
        } else {
          if (host.split("twitch.tv").length > 1) {
            var targetNode = document.getElementsByTagName("main")[0];

            if (targetNode && !targetNode.grabbed) {
              var config = { childList: true };

              var callback = function(mutationsList) {
                if (debug) {
                  console.log("Mutation detected, hooking...");
                }
                hook(maxretries);
              };

              var observer = new MutationObserver(callback);
              observer.observe(targetNode, config);
    
              targetNode.grabbed = true;
            }
          }
          
        }
    };
    
    if (debug) {
      console.log("Streamgrabber: hooking");
    }

    hook(maxretries);

   

}