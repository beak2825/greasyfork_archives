// ==UserScript==
// @name        inchallah-revealer
// @name:fr     inchallah-révélateur
// @namespace   inchallah.com
// @include     https://www.inchallah.com/member/*
// @description:en enables you to click and view 'protected' photos of members on inchallah.com dating site
// I know its lame but it was passible so i did it.
// @description:fr Permet de cliquer et voir les photos de profil 'protégées' sur le site de encontres inchallah.com
//Je sais que c'est con mais je l'ai fait car c'etait possible.
// @version 0.0.1.20150102160923
// @description enables you to click and view 'protected' photos of members on inchallah.com dating site
// @downloadURL https://update.greasyfork.org/scripts/7291/inchallah-revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/7291/inchallah-revealer.meta.js
// ==/UserScript==

var pix = document.getElementsByClassName("pict");

for (var i = 0; i < pix.length; i++) {
  var pic = pix[i].getElementsByTagName('img') [0];
  pic.removeAttribute('of');
  //console.log(pic);
}
