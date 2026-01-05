// ==UserScript==
// @name       Soundgasm Download
// @namespace  http://www.reddit.com/r/gonewildaudio
// @version    0.1
// @description  show source mp4 link for soundgasm site
// @match      http://soundgasm.net/u/*/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/5590/Soundgasm%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/5590/Soundgasm%20Download.meta.js
// ==/UserScript==

//Load JQuery using jQ instead of using $ for future compatibility purposes
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function main(){
    var jp = jQ('#jp_audio_0')[0].currentSrc;
    console.log(jp);
    var htmlBody = '<a href="' + jp + '" style="position:fixed; top:5px; left:5px;" id="btnDown">Download</a>';
    $('body').prepend(htmlBody);
}

addJQuery(main);
