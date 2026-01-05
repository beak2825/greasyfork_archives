// ==UserScript==
// @name        Polskie znaki w Arkuszach Google
// @description Rozwiązuje problem z wprowadzaniem znaków 'ę' i 'ń' w arkuszach Google
// @namespace   Google scripts
// @include     https://docs.google.com/*spreadsheets/*
// @version     0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7765/Polskie%20znaki%20w%20Arkuszach%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/7765/Polskie%20znaki%20w%20Arkuszach%20Google.meta.js
// ==/UserScript==

function overrideAltNE()
{
  document.addEventListener('keydown', function(e) {
     if((e.keyCode==69 || e.keyCode==78) && e.altKey)  // 'ę' || 'ń'
     {
       e.stopImmediatePropagation();
       e.stopPropagation();
       return;
     }
  }, true);
}
//setTimeout(function(){overrideAltNE();}, 3000);
document.addEventListener("DOMContentLoaded", function(event) {overrideAltNE();}, false);