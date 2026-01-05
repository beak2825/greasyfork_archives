// ==UserScript==
// @id             maturify@scriptish
// @name           mlpchan mature already dammit
// @namespace      hax
// @version        1.0
// @author         
// @description    what the name says
// @include        https://mlpchan.net/*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/8259/mlpchan%20mature%20already%20dammit.user.js
// @updateURL https://update.greasyfork.org/scripts/8259/mlpchan%20mature%20already%20dammit.meta.js
// ==/UserScript==

function contentEval(source) {
  // Check for function input.
  if ('function' == typeof source) {
    // Execute this function with no arguments, by adding parentheses.
    // One set around the function, required for valid syntax, and a
    // second empty set calls the surrounded function.
    source = '(' + source + ')();'
  }

  // Create a script node holding this  source code.
  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;

  // Insert the script node into the page, so it will run, and immediately
  // remove it to clean up.
  document.head.appendChild(script);
  document.head.removeChild(script);
}

function settings() {
    var setSetting = window.settings.setSetting;
    setSetting("show_mature",true,true);
    setSetting("mature_as_spoiler",false,true);
    setSetting("preview_hover",false,true);
    setSetting("image_hover_enabled",false,true);
}

contentEval(settings);