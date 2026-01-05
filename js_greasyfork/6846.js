// ==UserScript==
// @name          EZTV Bigger Show List Images
// @namespace   SOD_Scripts
// @description   Makes the images on EZTV's show list a little larger for easier viewing.
// @author Son_Of_Diablo
// @include       *eztv.ch/showlist/*
// @include       *eztv-proxy.net/showlist/*
// @version       0.4
// @downloadURL https://update.greasyfork.org/scripts/6846/EZTV%20Bigger%20Show%20List%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/6846/EZTV%20Bigger%20Show%20List%20Images.meta.js
// ==/UserScript==
 
  src = document.body.innerHTML;
 
  src = src.replace(/thumb_50_42/g,"main");
  src = src.replace(/width=\"50\"/g,"width=\"200\"");
  src = src.replace(/height=\"42\"/g,"height=\"168\"");
 
  document.body.innerHTML = src;