// ==UserScript==
// @name         PassViewer
// @namespace    http://userscripts.org/users/zackton
// @description  onMouseOver event that shows typed password in forms 
// @include      *
// @run-at       document-start
// @grant        none
// @version      1.0.1
// @downloadURL https://update.greasyfork.org/scripts/7932/PassViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/7932/PassViewer.meta.js
// ==/UserScript==

window.setTimeout(function() {
  var passFields = document.querySelectorAll("input[type='password']");
  if (!passFields.length) return;
  for (var i = 0; i < passFields.length; i++) {
    passFields[i].addEventListener("mouseover", function() {
      this.type = "text";
    }, false);
    passFields[i].addEventListener("mouseout", function() {
      this.type = "password";
    }, false);
  }
}, 1000)