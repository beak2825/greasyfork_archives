// ==UserScript==
// @name          Autofocus input text field
// @description   Autofocus the first visible input text field when a page is loaded
// @version       1.0.5
// @include       *
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @license       MIT License
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/9524/Autofocus%20input%20text%20field.user.js
// @updateURL https://update.greasyfork.org/scripts/9524/Autofocus%20input%20text%20field.meta.js
// ==/UserScript==

var TEXT_FIELD = ' text number search url ';

document.addEventListener('DOMContentLoaded', function() {
  if (TEXT_FIELD.indexOf(document.activeElement.type) >= 0)
    return;
  // find text inputs inside visible DOM containers
  var inputs = document.getElementsByTagName('input');
  var first;
  for (var i=0, input, il=inputs.length; i<il && (input=inputs[i]); i++)
    if (TEXT_FIELD.indexOf(' '+input.type+' ') >= 0) {
      var n=input, style;
      while (n && n.style && (style=getComputedStyle(n)) && style.display!='none' && style.visibility!='hidden')
        n = n.parentNode;
      if (!n || !n.style) {
        if (!first // set the first OR if it's empty, try to select an identically named input field with some text (happens on some sites)
            || (input.value && input.name == first.name && (!input.form && !first.form || input.form.action == first.form.action))) {
          first = input;
          if (first.value)
            break;
        }
      }
    }
  if (first) first.focus();
});
