// ==UserScript==
// @name rtl+ minus (nur kostenlose inhalte)
// @description klappt bei serien "alle folgen" auf, wechselt und scrollt automatisch zu "nur kostenlose anzeigen"
// @namespace Violentmonkey Scripts
// @match https://plus.rtl.de/video-tv/*
// @grant none
// @version 0.0.1.20250917150533
// @downloadURL https://update.greasyfork.org/scripts/549755/rtl%2B%20minus%20%28nur%20kostenlose%20inhalte%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549755/rtl%2B%20minus%20%28nur%20kostenlose%20inhalte%29.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded',
  function() {

    setTimeout(function() {

      if (document.querySelectorAll("ui-button.show-more-episodes")[0]) {
        document.querySelectorAll("ui-button.show-more-episodes")[0].getElementsByTagName("button")[0].click();
        document.getElementById("mat-tab-group-serverapp0-label-1").getElementsByClassName("mdc-tab__text-label")[0].click();
        window.scrollBy(0, 900);
        
      }

    }, 5000)

  });
