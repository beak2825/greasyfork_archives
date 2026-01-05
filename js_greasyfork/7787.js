// ==UserScript==
// @name        presidentA
// @namespace   dbb.9hells.org
// @description conserta a grafia para "presidenta"
// @include     *
// @exclude     https://greasyfork.org/*
// @exclude     http://greasyfork.org/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7787/presidentA.user.js
// @updateURL https://update.greasyfork.org/scripts/7787/presidentA.meta.js
// ==/UserScript==

(function() {

  function replaceAll(from, to) {
    var regexp = new RegExp(from, 'g');
    document.body.innerHTML= document.body.innerHTML.replace(regexp, to);
  }
  
  replaceAll('a Presidente', 'a Presidenta');
  replaceAll('a presidente', 'a presidenta');
  replaceAll('A Presidente', 'A Presidenta');
  replaceAll('A presidente', 'A presidenta');
  replaceAll('Presidente Dilma', 'Presidenta Dilma');
  replaceAll('presidente Dilma', 'presidenta Dilma'); 
})();