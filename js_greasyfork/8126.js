// ==UserScript==
// @name        Clean Bitbucket
// @namespace   bitbucket.org
// @description Remove Bitbucket advertising div and the deviant gay logo
// @include     https://bitbucket.org/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version     0.0.4
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/8126/Clean%20Bitbucket.user.js
// @updateURL https://update.greasyfork.org/scripts/8126/Clean%20Bitbucket.meta.js
// ==/UserScript==

// Replace the deviant gay logo
GM_addStyle('.aui-header-logo-device { background-image: url(data:image/png;base64,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) !important; }');

var checkExist = setInterval(function() {
  var crap = $('.dashboard-announcement');
  console.log("checking...");
  if (crap.length) {
    console.log("Exists!");
    crap.remove();
    clearInterval(checkExist);
  }
}, 100); // check every 100ms
