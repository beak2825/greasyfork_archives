/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details. */

// ==UserScript==
// @name switch to mobile version on facebook video page
// @namespace http://rboci.blogspot.com/
// @description When you open a video in facebook, you're redirected to mobile version so that it can play in HTML5 player
// @match https://www.facebook.com/*
// @run-at document-start
// @version 0.0.9
// @license WTFPL
// @resource LICENSE https://raw.github.com/LouCypher/userscripts/master/licenses/WTFPL/LICENSE.txt
// @downloadURL https://update.greasyfork.org/scripts/8176/switch%20to%20mobile%20version%20on%20facebook%20video%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/8176/switch%20to%20mobile%20version%20on%20facebook%20video%20page.meta.js
// ==/UserScript==   

// match 4 types of URLs (relative and absolute):
//  https://www.facebook.com/mavikocaelicomtr/videos/836587179720780/
//  https://www.facebook.com/video.php?v=10152484650042694
//  /mavikocaelicomtr/videos/836587179720780/
//  /video.php?v=10152484650042694
var videoURLRe = /(?:www.facebook.com|^)\/(?:video\.php\?v=|[^\/]+\/videos\/).+/;

if (videoURLRe.test(content.document.location.href)) {
  var target = content.document.location.href.replace("www.facebook", "m.facebook");
  window.location.replace(target)
}

// install a hook that will redirect us if a link to video is clicked
// possible alternative approaches (so I do not forget):
//   http://stackoverflow.com/a/6390389/520567 - using timer to check current URL
//   http://stackoverflow.com/a/7381436/520567 - proxy the pushState() method
if (document.addEventListener ){
  document.addEventListener("click", function(event) {
    var targetElement = event.target || event.srcElement;
    // TODO: support deeper search for parent element with a href attribute
    var href = targetElement.getAttribute('href') || targetElement.parentElement.getAttribute('href') ;
    if (href && videoURLRe.test(href)) {
      var target = "";
      if (href.indexOf("/") == 0) {
        target = "https://m.facebook.com" + href
      } else {
        target = href.replace("www.facebook", "m.facebook");
      }
      window.location.assign(target);
    }   
  }, true);
}