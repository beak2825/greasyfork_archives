// ==UserScript==
// @author       James Edward Lewis II
// @name         Tracking Hash Remover
// @namespace    greasyfork.org
// @version      0.0.1
// @description  This removes the random fragment identifiers used to track you.
// @grant        none
// @include      *
// @license MIT
// @copyright    2015+, James Edward Lewis II
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/9343/Tracking%20Hash%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/9343/Tracking%20Hash%20Remover.meta.js
// ==/UserScript==

(function trackingHashRemover(window, undefined) {
  'use strict';
  var trackPattern = /^#?\.[a-zA-Z0-9]{8,}/, interval;
  function removeHash(hsh) {
    var subst, idx;
    if (typeof hsh === 'symbol') hsh = '';
    hsh += '';
    idx = hsh.indexOf('#');
    if (idx !== -1) {
      subst = hsh.slice(idx);
      if (trackPattern.test(subst)) return hsh.slice(0, idx);
      else return hsh;
    } else return '';
  }
  function locHashRemover() {
    var hsh = location.hash;
    if (trackPattern.test(hsh)) location.hash = '';
    else {
      clearInterval(interval);
      interval = null;
    }
  }
  function removeHashes() {
    var links = document.getElementsByTagName('a'),
      forms = document.getElementsByTagName('form'), i;
    interval = interval || setInterval(locHashRemover, 16);
    for (i in links)
      if (links.hasOwnProperty(i))
        i.hash = removeHash(i.hash);
    for (i in forms)
      if(forms.hasOwnProperty(i))
        i.action = removeHash(i.action);
  }
  function dclRemover() {
    document.removeEventListener('DOMContentLoaded', dclRemover, false);
    removeHashes();
  }
  function loadRemover() {
    window.removeEventListener('load', loadRemover, false);
    removeHashes();
  }
  removeHashes();
  document.addEventListener('readystatechange', removeHashes, false);
  document.addEventListener('DOMContentLoaded', dclRemover, false);
  window.addEventListener('load', loadRemover, false);
  window.addEventListener('hashchange', removeHashes, false);
}(window));
