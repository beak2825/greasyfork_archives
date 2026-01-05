// ==UserScript==
// @name          GooglePlay download APK button
// @description   Download APK (via apps.evozi.com) button next to the Install button
// @include       https://play.google.com/store/apps/details*
// @run-at        document-start
// @author        wOxxOm
// @version       1
// @namespace wOxxOm
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/7319/GooglePlay%20download%20APK%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/7319/GooglePlay%20download%20APK%20button.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', function(e) {
  var c = document.querySelector('.details-actions');
  if (c)
    c.insertAdjacentHTML('beforeend',
          '<div class="play-button">\
          <a href="https://apps.evozi.com/apk-downloader/?id=' + 
          document.location.href.replace(/^.+?\?id=(.+)$/,'$1') + 
          '"><img src="https://apps.evozi.com/apk-downloader/assets/favicon.ico"> Download</a></div>');
});