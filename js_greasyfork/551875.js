// ==UserScript==
// @name         magentamusik stream url
// @namespace    http://tampermonkey.net/
// @version      2
// @description  get magentamusik stream url with just one click
// @author       mihau
// @match        https://www.magentamusik.de/*
// @exclude        https://www.magentamusik.de/
// @exclude        https://www.magentamusik.de/collection/*
// @supportURL   https://greasyfork.org/en/scripts/551875-magentamusik-stream-url
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551875/magentamusik%20stream%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/551875/magentamusik%20stream%20url.meta.js
// ==/UserScript==

// from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitforit(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    var observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, { childList: true, subtree: true });
  });
}


var xhr = new XMLHttpRequest();
var a, b, c;

waitforit('.sc-17yqz66-0.dbUgKs').then((elm) => {
 
$qa = function(_) {return document.querySelectorAll(_)}

var
_ = "https://wcps.t-online.de/cvss/magentamusic/vodclient/v2/assetdetails/58938/DMM_MOVIE_",
                                                                       // ^^^^^ // hardcoded, kann sich also jederzeit ändern
movieid = "",
prfx = "[data-js-element=",
live = "'o-main-stage__config']",
arch = "'o-video-player__config']",
dmm = /DMM_MOVIE_(.*?)"/;
  
       if ($qa(prfx+live)[0]) {
  movieid = $qa(prfx+live)[0].innerText.match(dmm)[1];
} else if ($qa(prfx+arch)[0]) {
  movieid = $qa(prfx+arch)[0].innerText.match(dmm)[1];
} else {
  var loc = window.location.pathname.split('-');
  movieid = loc[loc.length - 1];
}
  
var getJSON = function(url, callback) {

  xhr.open('GET', url, true);
  xhr.responseType = 'json'; 

  xhr.onload = function() {

    var status = xhr.status;

    if (status == 200) {
      callback(null, xhr.response);
    } else {
      callback(status);
    }
  };

  xhr.send();
};

getJSON(_ + movieid, function(err, data) {

  if (err != null) {
    console.error(err);
  } else {
    a = data.content.partnerInformation[0].features[0].player.href;
    getJSON(a, function(err, data) {
      if (err != null) {
        console.error(err);
      } else {

        b = data.content.feature.representations[0].contentPackages[0].media.href;
        xhr.open("GET", b);

        xhr.responseType = "document";
        xhr.overrideMimeType("text/xml");

        xhr.onload = () => {
          if (xhr.readyState === xhr.DONE && xhr.status === 200) {

            // document.title = "[!] " + document.title;
              
              c = xhr.responseXML.getElementsByTagName("media")[0].getAttribute("src");
              
              var logo = document.getElementsByClassName("o-header__trigger")[0].innerHTML;
              document.getElementsByClassName("o-header__trigger")[0].innerHTML = '<a id="m3u8" href="#" style="font-size:30px; text-decoration:none">&#x1f847;</a> ' + logo;
              document.getElementsByClassName("o-header__trigger")[0].onclick = function() {showURL(c);event.preventDefault()};

          }
        };

        xhr.send();

      }
    });

  }
});

if ($qa(".m-mixed-copy__toggle")[0]) {
  $qa(".m-mixed-copy__toggle")[0].click();
  $qa(".m-mixed-copy__toggle")[0].style.display="none";
  $qa(".m-mixed-copy__toggle")[0].style.visibility="hidden";
}
  
});

function showURL() {
  // console.log(xhr.response)
  // alert (a+"\n\n"+b+"\n\n"+c);
  var test = prompt("stream URL (OK for ffmpeg command)", c);
  if (test !== null) {
    prompt("ffmpeg command (OK for AUDIO-ONLY command)", 'ffmpeg -referer "' + location.href + '" -user_agent "' + window.navigator.userAgent + '" -i "' + c + '" -c copy -bsf:a aac_adtstoasc "' + location.pathname.replace(/\//, "") + '.mp4"');
    if (test !== null) {
      prompt("ffmpeg AUDIO-ONLY command", 'ffmpeg -referer "' + location.href + '" -user_agent "' + window.navigator.userAgent + '" -i "' + c + '" -vn -c:a copy "' + location.pathname.replace(/\//, "") + '-audio.m4a"');
    }
  }

}